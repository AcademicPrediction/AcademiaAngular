import { Component, OnInit } from '@angular/core';
import { SupervisorService } from 'src/app/service/admin/supervisor.service';
import { Supervisor } from 'src/app/model/supervisor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home-page-admin',
  templateUrl: './home-page-admin.component.html',
  styleUrls: ['./home-page-admin.component.css'],
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
    name: '',
    lastName: '',
    email: '',
    dni: null,
    phoneNumber: null,
    password: ''
  };
  showPassword: boolean = false;

  constructor(
    private supervisorService: SupervisorService,
    private modalService: NgbModal,
  ) {}

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
      },
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
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getPaginatedSupervisores(): Supervisor[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(
      startIndex + this.itemsPerPage,
      this.totalSupervisores,
    );
    return this.filteredSupervisores.slice(startIndex, endIndex); // Actualizamos para usar los datos filtrados
  }

  editSupervisor(supervisor: Supervisor): void {
    this.selectedSupervisor = supervisor ? { ...supervisor } : null;
  }

  saveEditedSupervisor(): void {
    if (this.selectedSupervisor) {
      this.supervisorService
        .update(this.selectedSupervisor, this.selectedSupervisor.id)
        .subscribe(() => {
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
        supervisor.name.toLowerCase() +
        supervisor.lastName.toLowerCase() +
        supervisor.email.toLowerCase() +
        supervisor.password.toLowerCase() +
        (supervisor.dni?.toString() || '') + // Usar operador de encadenamiento opcional para manejar valores nulos
        (supervisor.phoneNumber?.toString() || ''); // Usar operador de encadenamiento opcional para manejar valores nulos

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


  isNameValid(): boolean {
    return this.newSupervisor.name.trim() !== '';
  }

  isLastNameValid(): boolean {
    return this.newSupervisor.lastName.trim() !== '';
  }

  isEmailValid(): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(this.newSupervisor.email);
  }

  isPasswordValid(): boolean {
    return this.newSupervisor.password.trim() !== '';
  }

  areFieldsValid(): boolean {
    return (
      this.isNameValid() &&
      this.isLastNameValid() &&
      this.isEmailValid() &&
      this.isPasswordValid()
    );
  }

  limitInputLength(event: any, maxLength: number) {
    const value = event.target.value.toString();
    if (value.length > maxLength) {
      event.target.value = parseInt(value.slice(0, maxLength), 10);
    }
  }

  agregarSupervisor(): void {
    if (!this.areFieldsValid()) {
      console.log('Algunos campos no son válidos');
      return;
    }

    this.supervisorService.create(this.newSupervisor).subscribe(
      () => {
        console.log('Agregar supervisor:', this.newSupervisor);
        this.newSupervisor = {
          id: 0,
          name: '',
          lastName: '',
          email: '',
          dni: null,
          phoneNumber: null,
          password: '',
        };
        this.modalService.dismissAll(); // Cerrar el modal al agregar correctamente
        this.consultarTodosSupervisores(); // Actualizar la tabla automáticamente
      },
      (error) => {
        console.error('Error al agregar supervisor:', error);
        // Aquí puedes mostrar un mensaje de error al usuario
      }
    );
  }

  isNewSupervisorValid(): boolean {
    const validNombre = this.newSupervisor.name.trim() !== '';
    const validApellido = this.newSupervisor.lastName.trim() !== '';
    const validCorreoElectronico = this.isEmailValid();
    const validDNI = this.isDNIValid();
    const validNumeroTelefonico = this.isPhoneNumberValid();
    
    return (
      validNombre &&
      validApellido &&
      validCorreoElectronico &&
      validDNI &&
      validNumeroTelefonico
    );
  }
  
  isDNIValid(): boolean {
    return (
      this.newSupervisor.dni !== null &&
      !isNaN(Number(this.newSupervisor.dni)) &&
      this.newSupervisor.dni.toString().length === 8
    );
  }
  
  isPhoneNumberValid(): boolean {
    return (
      this.newSupervisor.phoneNumber !== null &&
      !isNaN(Number(this.newSupervisor.phoneNumber)) &&
      this.newSupervisor.phoneNumber.toString().length === 9
    );
  }

  deleteSupervisor(): void {
    if (this.selectedSupervisorId) {
      this.supervisorService.delete(this.selectedSupervisorId).subscribe(
        () => {
          this.supervisores = this.supervisores.filter(
            (s) => s.id !== this.selectedSupervisorId,
          );
          this.selectedSupervisorId = null;
          this.selectedSupervisoresIds = this.selectedSupervisoresIds.filter(
            (id) => id !== this.selectedSupervisorId,
          );
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
        },
      );
    }
  }

  selectAll(event: Event): void {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    this.selectedSupervisoresIds = checked
      ? this.supervisores.map((supervisor) => supervisor.id)
      : [];
    this.updateIconState(); // Actualizar el estado de los íconos después de seleccionar todos los supervisores

    // Si se han seleccionado todos los supervisores, asignamos el supervisor seleccionado
    if (
      checked &&
      this.selectedSupervisoresIds.length === this.supervisores.length
    ) {
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
      this.selectedSupervisoresIds = this.selectedSupervisoresIds.filter(
        (id) => id !== supervisorId,
      );
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
