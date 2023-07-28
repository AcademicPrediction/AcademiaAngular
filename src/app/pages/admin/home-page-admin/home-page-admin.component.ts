import { Component, OnInit } from '@angular/core';
import { SupervisorService } from 'src/app/service/admin/supervisor.service';
import { Supervisor } from 'src/app/model/supervisor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home-page-admin',
  templateUrl: './home-page-admin.component.html',
  styleUrls: ['./home-page-admin.component.css']
})
export class HomePageAdminComponent implements OnInit {
  supervisores: Supervisor[] = [];
  totalSupervisores: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  selectedSupervisor: Supervisor | null = null;
  isIconsEnabled: boolean = false;
  selectedSupervisorId: number | null = null;
  searchText: string = '';
  filteredSupervisores: Supervisor[] = [];
  newSupervisor: Supervisor = {
    id: 0,
    nombre: '',
    apellido: '',
    correoElectronico: '',
    contrasena: '',
    dni: 0,
    numeroTelefonico: 0
  };

  constructor(private supervisorService: SupervisorService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.consultarTodosSupervisores();
  }

  consultarTodosSupervisores(): void {
    this.supervisorService.getAll().subscribe(
      (supervisores: Supervisor[]) => {
        this.supervisores = supervisores;
        this.totalSupervisores = this.supervisores.length;
        this.calculateTotalPages();
        this.applyFilter(); // Aplicar el filtro inicial
      },
      (error) => {
        console.error('Error al obtener supervisores:', error);
      }
    );
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalSupervisores / this.itemsPerPage);
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
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  getPaginatedSupervisores(): Supervisor[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.totalSupervisores);
    return this.filteredSupervisores.slice(startIndex, endIndex); // Actualizamos para usar los datos filtrados
  }

  editSupervisor(supervisor: Supervisor): void {
    this.selectedSupervisor = supervisor ? { ...supervisor } : null;
  }

  saveEditedSupervisor(): void {
    if (this.selectedSupervisor) {
      this.supervisorService.update(this.selectedSupervisor).subscribe(() => {
        console.log('Guardar supervisor editado:', this.selectedSupervisor);
        this.selectedSupervisor = null;
        
        // Actualizar la tabla nuevamente después de editar
        this.consultarTodosSupervisores();
      });
    }
  }

  applyFilter(): void {
    if (!this.searchText.trim()) {
      this.filteredSupervisores = this.supervisores; // Si el filtro de búsqueda está vacío, muestra todos los supervisores
    } else {
      this.filteredSupervisores = this.filterSupervisores();
    }
    this.totalSupervisores = this.filteredSupervisores.length;
    this.calculateTotalPages();
    this.setPage(1);
  }
  
  filterSupervisores(): Supervisor[] {
    if (!this.searchText.trim()) {
      return this.supervisores; // Si el filtro de búsqueda está vacío, muestra todos los supervisores
    }
  
    const searchTextLower = this.searchText.toLowerCase();
    return this.supervisores.filter((supervisor) => {
      // Combinar todos los campos y buscar en ellos
      const combinedFields =
        supervisor.nombre.toLowerCase() +
        supervisor.apellido.toLowerCase() +
        supervisor.correoElectronico.toLowerCase() +
        supervisor.contrasena.toLowerCase() +
        supervisor.dni.toString() +
        supervisor.numeroTelefonico.toString();
  
      return combinedFields.includes(searchTextLower);
    });
  }
  
  clearSearch(): void {
    this.searchText = ''; // Limpiar el filtro de búsqueda
    this.applyFilter(); // Aplicar el filtro nuevamente para mostrar todos los supervisores
  }

  agregarSupervisor(): void {
    this.supervisorService.create(this.newSupervisor).subscribe(() => {
      console.log('Agregar supervisor:', this.newSupervisor);
      this.newSupervisor = {
        id: 0,
        nombre: '',
        apellido: '',
        correoElectronico: '',
        contrasena: '',
        dni: 0,
        numeroTelefonico: 0
      };
      this.modalService.dismissAll(); // Cerrar el modal al agregar correctamente
      this.consultarTodosSupervisores(); // Actualizar la tabla automáticamente
    });
  }
  
  isNewSupervisorValid(): boolean {
    return (
      this.newSupervisor.nombre.trim() !== '' &&
      this.newSupervisor.apellido.trim() !== '' &&
      this.newSupervisor.correoElectronico.trim() !== '' &&
      this.newSupervisor.contrasena.trim() !== '' &&
      !isNaN(Number(this.newSupervisor.dni)) &&
      this.newSupervisor.dni.toString().length === 8 &&
      this.newSupervisor.numeroTelefonico !== null && // Verificar que el número telefónico no sea nulo
      !isNaN(Number(this.newSupervisor.numeroTelefonico))
    );
  }
  

  deleteSupervisor(): void {
    if (this.selectedSupervisorId) {
      this.supervisorService.delete(this.selectedSupervisorId).subscribe(
        () => {
          this.supervisores = this.supervisores.filter(s => s.id !== this.selectedSupervisorId);
          this.selectedSupervisorId = null;
          this.updateIconState();
          this.calculateTotalPages();
          this.setPage(this.currentPage);

          // Actualizar la tabla nuevamente después de eliminar
          this.consultarTodosSupervisores();

          // Cerrar el modal después de eliminar exitosamente el supervisor
          this.modalService.dismissAll();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  selectAll(event: Event): void {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    this.supervisores.forEach(supervisor => supervisor.isSelected = checked);
    this.updateIconState(); // Actualizar el estado de los íconos después de seleccionar todos los supervisores
  }

  selectCheckbox(event: Event, supervisor: Supervisor): void {
    supervisor.isSelected = (event.target as HTMLInputElement).checked;
    this.updateIconState(); // Actualizar el estado de los íconos después de seleccionar/deseleccionar un supervisor individual
  }

  updateIconState(): void {
    this.isIconsEnabled = this.supervisores.some((supervisor) => supervisor.isSelected);
  }
}
