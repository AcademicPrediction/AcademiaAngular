import { Component, OnInit } from '@angular/core';
import { SupervisorService } from 'src/app/service/admin/supervisor.service';
import { Supervisor } from 'src/app/model/supervisor';

@Component({
  selector: 'app-home-page-admin',
  templateUrl: './home-page-admin.component.html',
  styleUrls: ['./home-page-admin.component.css']
})
export class HomePageAdminComponent implements OnInit {
  supervisores: Supervisor[] = [];
  totalSupervisores: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  selectedSupervisor: Supervisor | null = null;
  newSupervisor: Supervisor = {
    id: 0,
    nombre: '',
    apellido: '',
    correoElectronico: '',
    contrasena: '',
    dni: '',
    numeroTelefonico: ''
  };

  constructor(private dataService: SupervisorService) { }

  ngOnInit(): void {
    this.consultarTodosSupervisores();
  }

  consultarTodosSupervisores(): void {
    this.dataService.getAll().subscribe((supervisores: Supervisor[] | null) => {
      if (supervisores && Array.isArray(supervisores)) {
        this.supervisores = supervisores;
        this.totalSupervisores = supervisores.length;
        this.calculateTotalPages();
        this.setPage(1);
      } else {
        // Manejo de error o mensaje adecuado si no se obtienen los datos esperados
      }
    });
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalSupervisores / this.itemsPerPage);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  getPageNumbers(): number[] {
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPaginatedSupervisores(): Supervisor[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.totalSupervisores);
    return this.supervisores.slice(startIndex, endIndex);
  }

  editSupervisor(supervisor: Supervisor): void {
    // Asegurarnos de que supervisor no sea nulo antes de asignarlo a selectedSupervisor
    this.selectedSupervisor = supervisor ? { ...supervisor } : null;
  }

  saveEditedSupervisor(): void {
    if (this.selectedSupervisor) {
      // Lógica para guardar los cambios en el supervisor editado
      // this.dataService.editSupervisor(this.selectedSupervisor);
      console.log('Guardar supervisor editado:', this.selectedSupervisor);
      this.selectedSupervisor = null;
    }
  }

  addSupervisor(): void {
    // Lógica para agregar un nuevo supervisor
    // this.dataService.addSupervisor(this.newSupervisor);
    console.log('Agregar supervisor:', this.newSupervisor);
    this.newSupervisor = {
      id: 0,
      nombre: '',
      apellido: '',
      correoElectronico: '',
      contrasena: '',
      dni: '',
      numeroTelefonico: ''
    }; // Limpiar el formulario después de agregar
  }

  deleteSupervisor(id: number): void {
    // Lógica para eliminar un supervisor por su ID
    console.log('Eliminar supervisor con ID:', id);
  }

  selectCheckbox(event: any): void {
    // Lógica para seleccionar/deseleccionar una fila mediante el checkbox
    console.log('Checkbox cambiado:', event.target.value, event.target.checked);
  }

  selectAllCheckbox(event: any): void {
    // Lógica para seleccionar/deseleccionar todas las filas mediante el checkbox de selección general
    console.log('Checkbox Seleccionar Todo cambiado:', event.target.checked);
  }

  deleteSelectedSupervisors(): void {
    // Lógica para eliminar los supervisores seleccionados
  }  
}