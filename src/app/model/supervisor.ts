// supervisor.interface.ts
export interface Supervisor {
  id: number;
  name: string;
  lastName: string;
  email: string;
  dni: number | null;
  phoneNumber: number | null;
  password: string
}
