import { Component, OnInit, ElementRef } from '@angular/core';
import { SupervisorService } from 'src/app/service/admin/supervisor.service';
import { Supervisor } from 'src/app/model/supervisor';

// Agregamos la propiedad isSelected a la interfaz Supervisor
interface SupervisorWithSelection extends Supervisor {
  isSelected: boolean;
}

@Component({
  selector: 'app-home-page-admin',
  templateUrl: './home-page-admin.component.html',
  styleUrls: ['./home-page-admin.component.css']
})
export class HomePageAdminComponent implements OnInit {
  supervisores: SupervisorWithSelection[] = [];
  totalSupervisores: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  selectedSupervisor: SupervisorWithSelection | null = null;
  isIconsEnabled: boolean = false;
  newSupervisor: Supervisor = {
    id: 0,
    nombre: '',
    apellido: '',
    correoElectronico: '',
    contrasena: '',
    dni: '',
    numeroTelefonico: ''
  };

  constructor(private supervisorService: SupervisorService) { }

  ngOnInit(): void {
    this.consultarTodosSupervisores();
  }

  consultarTodosSupervisores(): void {
    this.supervisorService.getAll().subscribe(
      (supervisores: Supervisor[]) => {
        // Inicializar la propiedad isSelected en false para cada supervisor
        this.supervisores = supervisores.map((supervisor) => ({ ...supervisor, isSelected: false }));
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

  getPaginatedSupervisores(): SupervisorWithSelection[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.totalSupervisores);
    return this.supervisores.slice(startIndex, endIndex);
  }

  editSupervisor(supervisor: SupervisorWithSelection): void {
    // Asegurarnos de que supervisor no sea nulo antes de asignarlo a selectedSupervisor
    this.selectedSupervisor = supervisor ? { ...supervisor } : null;
  }

  saveEditedSupervisor(): void {
    if (this.selectedSupervisor) {
      this.supervisorService.update(this.selectedSupervisor).subscribe(() => {
        console.log('Guardar supervisor editado:', this.selectedSupervisor);
        this.selectedSupervisor = null;
      });
    }
  }

  addSupervisor(): void {
    // Lógica para agregar un nuevo supervisor
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
      }; // Limpiar el formulario después de agregar
    });
  }

  deleteSupervisor(id: number): void {
    // Lógica para eliminar un supervisor por su ID
    this.supervisorService.delete(id).subscribe(
      () => {
        console.log('Eliminar supervisor con ID:', id);
        this.consultarTodosSupervisores();
      },
      (error: any) => {
        console.error('Error al eliminar supervisor:', error);
      }
    );
  }

  selectCheckbox(event: any, supervisor: SupervisorWithSelection): void {
    supervisor.isSelected = event.target.checked;
    this.updateRowSelection(supervisor);
    this.updateIconState();
  }

  selectAllCheckbox(event: any): void {
    const checked = event.target.checked;
    this.supervisores.forEach((supervisor) => {
      supervisor.isSelected = checked;
      this.updateRowSelection(supervisor);
    });

    this.updateIconState();
  }

  updateRowSelection(supervisor: SupervisorWithSelection): void {
    const checkboxRow = this.getCheckboxRow(supervisor.id);
    if (checkboxRow) {
      if (supervisor.isSelected) {
        checkboxRow.classList.add('selected');
      } else {
        checkboxRow.classList.remove('selected');
      }
    }
  }

  getCheckboxRow(supervisorId: number): HTMLElement | null {
    const checkboxElement: ElementRef | null = this.getCheckboxElement(supervisorId);
    if (checkboxElement && checkboxElement.nativeElement) {
      return checkboxElement.nativeElement.closest('tr');
    }
    return null;
  }

  getCheckboxElement(supervisorId: number): ElementRef | null {
    return new ElementRef(document.getElementById('checkbox' + supervisorId));
  }
  
  updateIconState(): void {
    // Verificar si al menos una fila está seleccionada para habilitar los íconos
    this.isIconsEnabled = this.supervisores.some((supervisor) => supervisor.isSelected);
  }

  deleteSelectedSupervisors(): void {
    // Lógica para eliminar supervisores seleccionados
    const selectedSupervisors = this.supervisores.filter((supervisor) => supervisor.isSelected);
    selectedSupervisors.forEach((supervisor) => {
      this.supervisorService.delete(supervisor.id).subscribe(
        () => {
          this.supervisores = this.supervisores.filter(s => s.id !== supervisor.id);
        },
        (error) => {
          console.log(error);
        }
      );
    });
  }
}
