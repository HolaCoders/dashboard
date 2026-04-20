import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Eye, MessageCircle, CheckCircle2, XCircle, CalendarCheck, Clock, Lock } from "lucide-react";
import { reservationsData, generateCode, type Reservation } from "@/data/reservations";
import { isReservationFormClosed } from "@/data/blocks";
import { toast } from "sonner";

const statusStyles: Record<string, string> = {
  aceptada: "bg-success/10 text-success border-success/20",
  pendiente: "bg-warning/10 text-warning border-warning/20",
  cancelada: "bg-destructive/10 text-destructive border-destructive/20",
};

const stats = [
  { label: "Total", icon: CalendarCheck, color: "bg-primary text-primary-foreground", key: "total" },
  { label: "Pendientes", icon: Clock, color: "bg-warning text-warning-foreground", key: "pendiente" },
  { label: "Confirmadas", icon: CheckCircle2, color: "bg-success text-success-foreground", key: "aceptada" },
  { label: "Canceladas", icon: XCircle, color: "bg-destructive text-destructive-foreground", key: "cancelada" },
];

const Reservas = () => {
  const [reservations, setReservations] = useState<Reservation[]>(reservationsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formClosed, setFormClosed] = useState(isReservationFormClosed());
  const [newReservation, setNewReservation] = useState({
    client: "", phone: "", date: "", time: "", people: 1, table: "Mesa #1", notes: "",
  });

  useEffect(() => {
    const handler = () => setFormClosed(isReservationFormClosed());
    window.addEventListener("reservation-form-closed-changed", handler);
    return () => window.removeEventListener("reservation-form-closed-changed", handler);
  }, []);

  const counts = {
    total: reservations.length,
    pendiente: reservations.filter((r) => r.status === "pendiente").length,
    aceptada: reservations.filter((r) => r.status === "aceptada").length,
    cancelada: reservations.filter((r) => r.status === "cancelada").length,
  };

  const filtered = reservations.filter((r) => {
    const matchesSearch = !searchQuery ||
      r.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    if (!newReservation.client || !newReservation.phone || !newReservation.date || !newReservation.time) {
      toast.error("Completa todos los campos requeridos");
      return;
    }
    const reservation: Reservation = {
      code: generateCode(),
      ...newReservation,
      people: Number(newReservation.people),
      status: "pendiente",
    };
    setReservations((prev) => [reservation, ...prev]);
    setNewReservation({ client: "", phone: "", date: "", time: "", people: 1, table: "Mesa #1", notes: "" });
    setIsCreateOpen(false);
    toast.success("Reserva creada exitosamente");
  };

  const handleStatusChange = (code: string, status: Reservation["status"]) => {
    setReservations((prev) => prev.map((r) => (r.code === code ? { ...r, status } : r)));
    toast.success(`Reserva ${status}`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestión de Reservas</h1>
            <p className="text-sm text-muted-foreground mt-1">Administra todas las reservas del restaurante</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 rounded-lg shadow-sm" disabled={formClosed}>
                <Plus className="h-4 w-4" />
                Nueva Reserva
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Crear Nueva Reserva</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cliente *</Label>
                    <Input value={newReservation.client} onChange={(e) => setNewReservation((p) => ({ ...p, client: e.target.value }))} placeholder="Nombre del cliente" />
                  </div>
                  <div className="space-y-2">
                    <Label>Teléfono *</Label>
                    <Input value={newReservation.phone} onChange={(e) => setNewReservation((p) => ({ ...p, phone: e.target.value }))} placeholder="809-000-0000" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fecha *</Label>
                    <Input type="date" value={newReservation.date} onChange={(e) => setNewReservation((p) => ({ ...p, date: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Hora *</Label>
                    <Input type="time" value={newReservation.time} onChange={(e) => setNewReservation((p) => ({ ...p, time: e.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Personas</Label>
                    <Input type="number" min={1} value={newReservation.people} onChange={(e) => setNewReservation((p) => ({ ...p, people: Number(e.target.value) }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Mesa</Label>
                    <Select value={newReservation.table} onValueChange={(v) => setNewReservation((p) => ({ ...p, table: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <SelectItem key={n} value={`Mesa #${n}`}>Mesa #{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notas</Label>
                  <Textarea value={newReservation.notes} onChange={(e) => setNewReservation((p) => ({ ...p, notes: e.target.value }))} placeholder="Notas adicionales..." />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                <Button onClick={handleCreate}>Crear Reserva</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {formClosed && (
          <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
            <Lock className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="text-sm font-semibold text-destructive">Formulario de reservas cerrado</p>
              <p className="text-xs text-destructive/80">Las nuevas reservas están deshabilitadas hasta nuevo aviso. Puedes reactivarlo desde el módulo de Bloqueos.</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.key} className="bg-card rounded-xl border p-4 flex items-center gap-4 shadow-sm">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{counts[stat.key as keyof typeof counts]}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border shadow-sm">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 border-b">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por cliente, teléfono o código..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-muted/50 border-0 rounded-lg" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-muted/50 border-0 rounded-lg"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="aceptada">Aceptada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
                  <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No se encontraron reservas</TableCell></TableRow>
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
                        <Badge variant="outline" className={`capitalize text-xs ${statusStyles[r.status]}`}>{r.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {r.status === "pendiente" && (
                            <>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-success hover:bg-success/10" onClick={() => handleStatusChange(r.code, "aceptada")}>
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleStatusChange(r.code, "cancelada")}>
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-success hover:bg-success/10">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" onClick={() => setSelectedReservation(r)}>
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
        </div>

        {/* Detail dialog */}
        <Dialog open={!!selectedReservation} onOpenChange={() => setSelectedReservation(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Detalle de Reserva</DialogTitle>
            </DialogHeader>
            {selectedReservation && (
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Código</p><p className="font-mono font-medium">{selectedReservation.code}</p></div>
                  <div><p className="text-muted-foreground">Estado</p><Badge variant="outline" className={`capitalize text-xs mt-1 ${statusStyles[selectedReservation.status]}`}>{selectedReservation.status}</Badge></div>
                  <div><p className="text-muted-foreground">Cliente</p><p className="font-medium">{selectedReservation.client}</p></div>
                  <div><p className="text-muted-foreground">Teléfono</p><p className="font-medium">{selectedReservation.phone}</p></div>
                  <div><p className="text-muted-foreground">Fecha</p><p className="font-medium">{selectedReservation.date}</p></div>
                  <div><p className="text-muted-foreground">Hora</p><p className="font-medium">{selectedReservation.time}</p></div>
                  <div><p className="text-muted-foreground">Personas</p><p className="font-medium">{selectedReservation.people}</p></div>
                  <div><p className="text-muted-foreground">Mesa</p><p className="font-medium">{selectedReservation.table}</p></div>
                </div>
                {selectedReservation.notes && (
                  <div className="text-sm"><p className="text-muted-foreground">Notas</p><p className="font-medium">{selectedReservation.notes}</p></div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Reservas;
