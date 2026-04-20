export type TableStatus = "Disponible" | "Reservada" | "Mantenimiento";

export interface RestaurantTable {
  id: number;
  numero: number;
  capacidad: number;
  estado: TableStatus;
}

export const tablesData: RestaurantTable[] = [
  { id: 1, numero: 1, capacidad: 4, estado: "Disponible" },
  { id: 2, numero: 2, capacidad: 2, estado: "Disponible" },
  { id: 3, numero: 3, capacidad: 6, estado: "Disponible" },
  { id: 4, numero: 4, capacidad: 4, estado: "Disponible" },
  { id: 5, numero: 5, capacidad: 8, estado: "Disponible" },
  { id: 6, numero: 6, capacidad: 2, estado: "Mantenimiento" },
  { id: 7, numero: 7, capacidad: 4, estado: "Disponible" },
  { id: 8, numero: 8, capacidad: 6, estado: "Reservada" },
];
