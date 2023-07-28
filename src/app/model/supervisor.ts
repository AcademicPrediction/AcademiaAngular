export interface Supervisor {
    id: number;
    nombre: string;
    apellido: string;
    correoElectronico: string;
    contrasena: string;
    dni: number | null;
    numeroTelefonico: number | null;
    isSelected?: boolean;
}
