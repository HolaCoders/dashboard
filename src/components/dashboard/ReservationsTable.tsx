import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MessageCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Reservation {
  code: string;
  client: string;
  phone: string;
  date: string;
  time: string;
  people: number;
  table: string;
  status: "pendiente" | "aceptada" | "cancelada";
}

const reservations: Reservation[] = [
  { code: "RSV-7160BA", client: "Maria Josefina", phone: "8098497534", date: "2026-01-02", time: "9:00 AM", people: 2, table: "Mesa #3", status: "aceptada" },
  { code: "RSV-3B5285", client: "Maria Elenea", phone: "8098497537", date: "2026-01-01", time: "3:00 PM", people: 1, table: "Mesa #3", status: "aceptada" },
  { code: "RSV-72B842", client: "Jordan Belfot", phone: "8887878778", date: "2025-12-19", time: "1:00 PM", people: 4, table: "Mesa #4", status: "aceptada" },
  { code: "RSV-FED7E5", client: "Carlota", phone: "3343434332", date: "2025-12-13", time: "12:00 PM", people: 20, table: "Mesa #5", status: "cancelada" },
  { code: "RSV-A1B2C3", client: "Pedro Ramirez", phone: "8091234567", date: "2026-01-05", time: "7:00 PM", people: 6, table: "Mesa #1", status: "pendiente" },
  { code: "RSV-D4E5F6", client: "Ana García", phone: "8097654321", date: "2025-12-20", time: "8:30 PM", people: 3, table: "Mesa #2", status: "cancelada" },
  { code: "RSV-G7H8I9", client: "Luis Torres", phone: "8095551234", date: "2025-12-22", time: "6:00 PM", people: 2, table: "Mesa #6", status: "cancelada" },
  { code: "RSV-J0K1L2", client: "Carmen Díaz", phone: "8099876543", date: "2026-01-03", time: "1:30 PM", people: 5, table: "Mesa #7", status: "aceptada" },
];

const statusStyles: Record<string, string> = {
  aceptada: "bg-success/10 text-success border-success/20",
  pendiente: "bg-warning/10 text-warning border-warning/20",
  cancelada: "bg-destructive/10 text-destructive border-destructive/20",
};

interface Props {
  searchQuery: string;
  statusFilter: string;
}

export function ReservationsTable({ searchQuery, statusFilter }: Props) {
  const filtered = reservations.filter((r) => {
    const matchesSearch =
      !searchQuery ||
      r.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Código</TableHead>
            <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Cliente</TableHead>
            <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Teléfono</TableHead>
            <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Fecha</TableHead>
            <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Hora</TableHead>
            <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Personas</TableHead>
            <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Mesa</TableHead>
            <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Estado</TableHead>
            <TableHead className="text-xs font-semibold uppercase text-muted-foreground text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                No se encontraron reservas
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((r) => (
              <TableRow key={r.code} className="hover:bg-muted/30">
                <TableCell className="font-mono text-xs text-muted-foreground">{r.code}</TableCell>
                <TableCell className="font-medium">{r.client}</TableCell>
                <TableCell className="text-muted-foreground">{r.phone}</TableCell>
                <TableCell className="text-muted-foreground">{r.date}</TableCell>
                <TableCell className="text-muted-foreground">{r.time}</TableCell>
                <TableCell className="text-center">{r.people}</TableCell>
                <TableCell className="text-muted-foreground">{r.table}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`capitalize text-xs ${statusStyles[r.status]}`}>
                    {r.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-success hover:bg-success/10">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
