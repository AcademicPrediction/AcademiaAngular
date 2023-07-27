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
  newSupervisor: Supervisor = {
    id: 0,
    nombre: '',
    apellido: '',
    correoElectronico: '',
    contrasena: '',
    dni: '',
    numeroTelefonico: ''
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
        this.setPage(1);
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
    return this.supervisores.slice(startIndex, endIndex);
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
  

  agregarSupervisor(): void {
    this.supervisorService.create(this.newSupervisor).subscribe(() => {
      console.log('Agregar supervisor:', this.newSupervisor);
      this.newSupervisor = {
        id: 0,
        nombre: '',
        apellido: '',
        correoElectronico: '',
        contrasena: '',
        dni: '',
        numeroTelefonico: ''
      };
      this.modalService.dismissAll(); // Cerrar el modal al agregar correctamente
      this.consultarTodosSupervisores(); // Actualizar la tabla automáticamente
    });
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