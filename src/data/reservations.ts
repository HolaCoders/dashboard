export interface Reservation {
  code: string;
  client: string;
  phone: string;
  date: string;
  time: string;
  people: number;
  table: string;
  status: "pendiente" | "aceptada" | "cancelada";
  notes?: string;
}

export const reservationsData: Reservation[] = [
  { code: "RSV-7160BA", client: "Maria Josefina", phone: "8098497534", date: "2026-01-02", time: "9:00 AM", people: 2, table: "Mesa #3", status: "aceptada" },
  { code: "RSV-3B5285", client: "Maria Elenea", phone: "8098497537", date: "2026-01-01", time: "3:00 PM", people: 1, table: "Mesa #3", status: "aceptada" },
  { code: "RSV-72B842", client: "Jordan Belfot", phone: "8887878778", date: "2025-12-19", time: "1:00 PM", people: 4, table: "Mesa #4", status: "aceptada" },
  { code: "RSV-FED7E5", client: "Carlota", phone: "3343434332", date: "2025-12-13", time: "12:00 PM", people: 20, table: "Mesa #5", status: "cancelada" },
  { code: "RSV-A1B2C3", client: "Pedro Ramirez", phone: "8091234567", date: "2026-01-05", time: "7:00 PM", people: 6, table: "Mesa #1", status: "pendiente" },
  { code: "RSV-D4E5F6", client: "Ana García", phone: "8097654321", date: "2025-12-20", time: "8:30 PM", people: 3, table: "Mesa #2", status: "cancelada" },
  { code: "RSV-G7H8I9", client: "Luis Torres", phone: "8095551234", date: "2025-12-22", time: "6:00 PM", people: 2, table: "Mesa #6", status: "cancelada" },
  { code: "RSV-J0K1L2", client: "Carmen Díaz", phone: "8099876543", date: "2026-01-03", time: "1:30 PM", people: 5, table: "Mesa #7", status: "aceptada" },
];

export function generateCode(): string {
  const chars = "ABCDEF0123456789";
  let result = "RSV-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
