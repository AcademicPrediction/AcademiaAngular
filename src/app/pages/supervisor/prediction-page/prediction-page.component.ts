import { Component } from '@angular/core';

@Component({
  selector: 'app-prediction-page',
  templateUrl: './prediction-page.component.html',
  styleUrls: ['./prediction-page.component.css']
})
export class PredictionPageComponent {

  file: any

  getFile(event: any): void {
    const selectedFile = event.target.files[0];
    const allowedExtensions = ['xls', 'xlsx'];

    if (selectedFile && allowedExtensions.includes(selectedFile.name.split('.').pop().toLowerCase())) {
      this.file = selectedFile;
      
    } else {
      console.log('Archivo no válido. Solo se permiten archivos Excel.');
    }
  }

  disableInputClick(event: MouseEvent): void {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del clic
  }
}
