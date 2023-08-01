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
  itemsPerPage: number = 7;
  totalPages: number = 1;
  selectedSupervisoresIds: number[] = []; // Nueva variable para almacenar los IDs de los supervisores seleccionados
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
    dni: null, // Inicializar con null en lugar de 0
    numeroTelefonico: null // Inicializar con null en lugar de 0
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
        (supervisor.dni?.toString() || '') + // Usar operador de encadenamiento opcional para manejar valores nulos
        (supervisor.numeroTelefonico?.toString() || ''); // Usar operador de encadenamiento opcional para manejar valores nulos

      return combinedFields.includes(searchTextLower);
    });
  }

  clearSearch(): void {
    this.searchText = ''; // Limpiar el filtro de búsqueda
    this.applyFilter(); // Aplicar el filtro nuevamente para mostrar todos los supervisores
  }

  agregarSupervisorModal(content: any): void {
    this.modalService.open(content, { centered: true }); // Abrir el modal para agregar supervisor
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
        dni: null,
        numeroTelefonico: null
      };
      this.modalService.dismissAll(); // Cerrar el modal al agregar correctamente
      this.consultarTodosSupervisores(); // Actualizar la tabla automáticamente
    });
  }
  
  isNewSupervisorValid(): boolean {
    const validNombre = this.newSupervisor.nombre.trim() !== '';
    const validApellido = this.newSupervisor.apellido.trim() !== '';
    const validCorreoElectronico = this.newSupervisor.correoElectronico.trim() !== '';

    // Verificar que el DNI sea numérico, no sea null, no sea 0 y tenga 8 dígitos
    const validDNI =
      this.newSupervisor.dni !== null && // Verificar que no sea null
      !isNaN(Number(this.newSupervisor.dni)) &&
      this.newSupervisor.dni.toString().length === 8 &&
      !this.supervisores.some(supervisor => supervisor.dni === this.newSupervisor.dni);

    // Verificar que el número telefónico sea numérico, no sea null, no sea 0 y tenga 9 dígitos
    const validNumeroTelefonico =
      this.newSupervisor.numeroTelefonico !== null && // Verificar que no sea null
      !isNaN(Number(this.newSupervisor.numeroTelefonico)) &&
      this.newSupervisor.numeroTelefonico.toString().length === 9 &&
      !this.supervisores.some(supervisor => supervisor.numeroTelefonico === this.newSupervisor.numeroTelefonico);

    // Verificar que el correo electrónico no esté registrado
    const validCorreoElectronicoUnico =
      !this.supervisores.some(supervisor => supervisor.correoElectronico === this.newSupervisor.correoElectronico);

    return (
      validNombre &&
      validApellido &&
      validCorreoElectronico &&
      validDNI &&
      validNumeroTelefonico &&
      validCorreoElectronicoUnico
    );
  }

  deleteSupervisor(): void {
    if (this.selectedSupervisorId) {
      this.supervisorService.delete(this.selectedSupervisorId).subscribe(
        () => {
          this.supervisores = this.supervisores.filter(s => s.id !== this.selectedSupervisorId);
          this.selectedSupervisorId = null;
          this.selectedSupervisoresIds = this.selectedSupervisoresIds.filter(id => id !== this.selectedSupervisorId);
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
  this.selectedSupervisoresIds = checked ? this.supervisores.map(supervisor => supervisor.id) : [];
  this.updateIconState(); // Actualizar el estado de los íconos después de seleccionar todos los supervisores

  // Si se han seleccionado todos los supervisores, asignamos el supervisor seleccionado
  if (checked && this.selectedSupervisoresIds.length === this.supervisores.length) {
    this.selectedSupervisor = this.supervisores[0] || null;
    this.selectedSupervisorId = this.selectedSupervisoresIds[0] || null;
  } else {
    // Si se desmarcan todos los checkboxes, reiniciamos la selección
    this.selectedSupervisor = null;
    this.selectedSupervisorId = null;
  }
}

selectCheckbox(event: Event, supervisor: Supervisor): void {
  const supervisorId = supervisor.id;
  if ((event.target as HTMLInputElement).checked) {
    this.selectedSupervisoresIds.push(supervisorId);
  } else {
    this.selectedSupervisoresIds = this.selectedSupervisoresIds.filter(id => id !== supervisorId);
  }
  this.updateIconState(); // Actualizar el estado de los íconos después de seleccionar/deseleccionar un supervisor individual

  // Si solo se selecciona un supervisor individual, asignamos el supervisor seleccionado
  if (this.selectedSupervisoresIds.length === 1) {
    this.selectedSupervisor = supervisor;
    this.selectedSupervisorId = supervisorId;
  } else {
    // Si se deselecciona el supervisor individual, reiniciamos la selección
    this.selectedSupervisor = null;
    this.selectedSupervisorId = null;
  }
}

updateIconState(): void {
  this.isIconsEnabled = this.selectedSupervisoresIds.length > 0;
}
  
}
