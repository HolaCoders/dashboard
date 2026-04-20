export type UserRole = "Administrador" | "Usuario";

export interface AppUser {
  id: number;
  nombre: string;
  correo: string;
  password: string;
  rol: UserRole;
}

export const usersData: AppUser[] = [
  { id: 1, nombre: "Admin Catedral", correo: "admin@catedral.com", password: "admin123", rol: "Administrador" },
  { id: 2, nombre: "Recepción", correo: "user@catedral.com", password: "user123", rol: "Usuario" },
];
