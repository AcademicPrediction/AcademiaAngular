import { Component } from '@angular/core';
import { Prediction } from 'src/app/model/prediction';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-prediction-history',
  templateUrl: './prediction-history.component.html',
  styleUrls: ['./prediction-history.component.css'],
})
export class PredictionHistoryComponent {
  predictiones: Prediction[] = [];
  totalPredictiones: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 7;
  totalPages: number = 1;
  selectedPrediction: Prediction | null = null;
  isIconsEnabled: boolean = false;
  selectedPredictionId: number | null = null;
  searchText: string = '';
  filteredPredictiones: Prediction[] = [];
  newPrediction: Prediction = {
    id: 0,
    fileName: '',
    date: '',
  };

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    // this.consultarTodosPredictiones();
  }

  // consultarTodosPredictiones(): void {
  //   this.predictionService.getAll().subscribe(
  //     (predictiones: Prediction[]) => {
  //       this.predictiones = predictiones;
  //       this.totalPredictiones = this.predictiones.length;
  //       this.calculateTotalPages();
  //       this.applyFilter(); // Aplicar el filtro inicial
  //     },
  //     (error) => {
  //       console.error('Error al obtener predictiones:', error);
  //     },
  //   );
  // }

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
        prediction.fileName.toLowerCase() + prediction.date.toLowerCase();

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
}
