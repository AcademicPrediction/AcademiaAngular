export interface Supervisor {
    id: number;
    nombre: string;
    apellido: string;
    correoElectronico: string;
    contrasena: string;
    dni: string;
    numeroTelefonico: string;
    isSelected?: boolean;
}