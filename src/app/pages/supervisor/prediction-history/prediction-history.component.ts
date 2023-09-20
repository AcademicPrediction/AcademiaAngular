import { Component } from '@angular/core';
import { Prediction } from 'src/app/model/prediction';
import { Supervisor } from 'src/app/model/supervisor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PredictionService } from 'src/app/service/prediction.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prediction-history',
  templateUrl: './prediction-history.component.html',
  styleUrls: ['./prediction-history.component.css'],
})
export class PredictionHistoryComponent {
  predictiones: Prediction[] = [];
  totalPredictiones: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 1;
  selectedPrediction: Prediction | null = null;
  isIconsEnabled: boolean = false;
  selectedPredictionId: number | null = null;
  searchText: string = '';
  filteredPredictiones: Prediction[] = [];
  newPrediction: Prediction = {
    id: 0,
    name: '',
    date: new Date(),
  };
  supervisor: Supervisor | null = null;

  constructor(
    private modalService: NgbModal,
    private predictionService: PredictionService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.consultarTodosPredictiones();
  }

  consultarTodosPredictiones(): void {
    //getLocalstorage supervisor id
    this.supervisor = JSON.parse(
      localStorage.getItem('supervisor') || '{}',
    ) as Supervisor;
    this.predictionService.getAllPredictions(this.supervisor.id).subscribe(
      (predictiones: Prediction[]) => {
        this.predictiones = predictiones.sort((a, b) => {
          //return a.id - b.id; // Orden ascendente
          return b.id - a.id; // Para orden descendente
        });

        this.totalPredictiones = this.predictiones.length;
        this.calculateTotalPages();
        this.applyFilter();
      },
      (error) => {
        console.error('Error al obtener predicciones:', error);
      },
    );
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalPredictiones / this.itemsPerPage);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage(): void {
    this.setPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.setPage(this.currentPage + 1);
  }

  getPageNumbers(): number[] {
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );
  }

  getPaginatedPredictiones(): Prediction[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(
      startIndex + this.itemsPerPage,
      this.totalPredictiones,
    );
    return this.filteredPredictiones.slice(startIndex, endIndex); // Actualizamos para usar los datos filtrados
  }

  applyFilter(): void {
    if (!this.searchText.trim()) {
      this.filteredPredictiones = this.predictiones; // Si el filtro de búsqueda está vacío, muestra todos los predictiones
    } else {
      this.filteredPredictiones = this.filterPredictiones();
    }
    this.totalPredictiones = this.filteredPredictiones.length;
    this.calculateTotalPages();
    this.setPage(1);
  }

  filterPredictiones(): Prediction[] {
    if (!this.searchText.trim()) {
      return this.predictiones; // Si el filtro de búsqueda está vacío, muestra todos los predictiones
    }

    const searchTextLower = this.searchText.toLowerCase();
    return this.predictiones.filter((prediction) => {
      // Combinar todos los campos y buscar en ellos
      const combinedFields =
        prediction.name.toLowerCase() +
        prediction.date.toString().toLowerCase();

      return combinedFields.includes(searchTextLower);
    });
  }

  clearSearch(): void {
    this.searchText = ''; // Limpiar el filtro de búsqueda
    this.applyFilter(); // Aplicar el filtro nuevamente para mostrar todos los predictiones
  }

  selectAll(event: Event): void {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    this.predictiones.forEach(
      (prediction) => (prediction.isSelected = checked),
    );
    this.updateIconState(); // Actualizar el estado de los íconos después de seleccionar todos los predictiones
  }

  selectCheckbox(event: Event, prediction: Prediction): void {
    prediction.isSelected = (event.target as HTMLInputElement).checked;
    this.updateIconState(); // Actualizar el estado de los íconos después de seleccionar/deseleccionar un prediction individual
  }

  updateIconState(): void {
    this.isIconsEnabled = this.predictiones.some(
      (prediction) => prediction.isSelected,
    );
  }

  downloadPredictionFile(id: string, name: string): void {
    this.predictionService.downloadPredictionFile({ id, name }).subscribe(
      (response) => {
        const filename =
          response.headers.get('content-disposition')?.split('filename=')[1] ||
          'default-filename.xlsx';
        const blob = new Blob([response.body as Blob], {
          type: 'application/octet-stream',
        });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();

        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error al descargar el archivo:', error);
      },
    );
  }

  convertDate(date: Date): string {
    const originalDate = new Date(date);
    const year = originalDate.getFullYear();
    const month = String(originalDate.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11, así que añadimos 1 para obtener el mes correcto
    const day = String(originalDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  navigateToPredictionReview(
    predictionId: string,
    predictionName: string,
  ): void {
    this.router.navigate(['/prediction-review', predictionId, predictionName]);
    localStorage.setItem('predictionId', predictionId);
    localStorage.setItem('predictionName', predictionName);
  }
}
