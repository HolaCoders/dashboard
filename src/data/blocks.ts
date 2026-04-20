export type BlockType = "horario" | "dia" | "capacidad";

export interface Block {
  id: string;
  tipo: BlockType;
  fecha: string; // YYYY-MM-DD
  horaInicio?: string; // HH:mm
  horaFin?: string; // HH:mm
  capacidadMaxima?: number;
  motivo: string;
  creadoPor: string;
}

export const blocksData: Block[] = [
  {
    id: "BLK-001",
    tipo: "dia",
    fecha: "2026-01-01",
    motivo: "Año Nuevo - Restaurante cerrado",
    creadoPor: "Admin Catedral",
  },
  {
    id: "BLK-002",
    tipo: "horario",
    fecha: "2026-01-15",
    horaInicio: "18:00",
    horaFin: "22:00",
    motivo: "Evento privado - Cumpleaños empresa XYZ",
    creadoPor: "Admin Catedral",
  },
  {
    id: "BLK-003",
    tipo: "capacidad",
    fecha: "2026-01-20",
    capacidadMaxima: 20,
    motivo: "Mantenimiento parcial - capacidad reducida",
    creadoPor: "Admin Catedral",
  },
];

export function generateBlockId(): string {
  return `BLK-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;
}
