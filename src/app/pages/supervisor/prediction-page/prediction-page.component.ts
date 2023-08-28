import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Supervisor } from 'src/app/model/supervisor';
import { PredictionService } from 'src/app/service/prediction.service';

@Component({
  selector: 'app-prediction-page',
  templateUrl: './prediction-page.component.html',
  styleUrls: ['./prediction-page.component.css'],
})
export class PredictionPageComponent {
  constructor(
    private predictionService: PredictionService,
    private router: Router,
  ) {}

  file: any;
  isLoading: boolean = false;
  showDialog = false;
  supervisor: Supervisor | null = null;

  ngOnInit(): void {
    this.file = null;
  }

  getFile(event: any): void {
    const selectedFile = event.target.files[0];
    const allowedExtensions = ['xls', 'xlsx'];

    if (
      selectedFile &&
      allowedExtensions.includes(
        selectedFile.name.split('.').pop().toLowerCase(),
      )
    ) {
      this.file = selectedFile;
    } else {
      console.log('Archivo no válido. Solo se permiten archivos Excel.');
    }
  }

  disableInputClick(event: MouseEvent): void {
    event.preventDefault();
  }

  doPrediction(): void {
    this.isLoading = true;
    this.supervisor = JSON.parse(
      localStorage.getItem('supervisor') || '{}',
    ) as Supervisor;
    this.predictionService
      .doPrediction(this.file, this.supervisor.id)
      .subscribe(
        (response) => {
          const filename =
            response.headers
              .get('content-disposition')
              ?.split('filename=')[1] || 'default-filename.xlsx';
          const blob = new Blob([response.body as Blob], {
            type: 'application/octet-stream',
          });
          const url = window.URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          link.click();

          window.URL.revokeObjectURL(url);

          this.isLoading = false;
          this.showDialog = true;
        },
        (error) => {
          console.error('Error al descargar el archivo:', error);
          this.isLoading = false;
        },
      );
  }

  cancelPrediction(): void {
    this.file = null;
    this.router.navigate(['/prediction']);
  }

  closeDialog() {
    this.showDialog = false;
  }
}
