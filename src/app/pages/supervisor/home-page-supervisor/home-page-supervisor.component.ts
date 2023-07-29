import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home-page-supervisor',
  templateUrl: './home-page-supervisor.component.html',
  styleUrls: ['./home-page-supervisor.component.css']
})
export class HomePageSupervisorComponent {
  //inicializa un valor booleano en true
  public havePrediction = true;
  onDragStart(event: DragEvent): void {
    // Obtener los datos que se arrastrarán (puedes usar cualquier tipo de datos)
    event.dataTransfer?.setData('text/plain', 'Drag me!');
  }

  // Método para el evento 'dragover'
  onDragOver(event: DragEvent): void {
    event.preventDefault(); // Prevenir comportamiento predeterminado de 'drop'
  }

  // Método para el evento 'drop'
  onDrop(event: DragEvent): void {
    event.preventDefault(); // Prevenir comportamiento predeterminado de 'drop'
    // Obtener los datos arrastrados
    const data = event.dataTransfer?.getData('text');
    // Aquí puedes realizar cualquier acción con los datos, por ejemplo:
    console.log('Elemento arrastrado:', data);
  }
}
