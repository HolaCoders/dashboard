import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Calendar as CalendarIcon, Clock, Users, Ban } from "lucide-react";
import { toast } from "sonner";
import { Block, BlockType, blocksData, generateBlockId } from "@/data/blocks";
import { useAuth } from "@/context/AuthContext";

const typeLabels: Record<BlockType, string> = {
  horario: "Horario",
  dia: "Día completo",
  capacidad: "Límite de capacidad",
};

const typeColors: Record<BlockType, string> = {
  horario: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  dia: "bg-red-100 text-red-700 hover:bg-red-100",
  capacidad: "bg-amber-100 text-amber-700 hover:bg-amber-100",
};

const typeIcons: Record<BlockType, typeof Clock> = {
  horario: Clock,
  dia: CalendarIcon,
  capacidad: Users,
};

const Bloqueos = () => {
  const { user, hasRole } = useAuth();
  const isAdmin = hasRole("Administrador");
  const [blocks, setBlocks] = useState<Block[]>(blocksData);
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState<BlockType>("horario");
  const [form, setForm] = useState({
    fecha: "",
    horaInicio: "",
    horaFin: "",
    capacidadMaxima: "",
    motivo: "",
  });

  const filterByType = (t: BlockType) => blocks.filter((b) => b.tipo === t);

  const resetForm = () => {
    setForm({ fecha: "", horaInicio: "", horaFin: "", capacidadMaxima: "", motivo: "" });
    setTipo("horario");
  };

  const handleSave = () => {
    if (!form.fecha || !form.motivo.trim()) {
      toast.error("Completa fecha y motivo");
      return;
    }
    if (tipo === "horario" && (!form.horaInicio || !form.horaFin)) {
      toast.error("Define hora de inicio y fin");
      return;
    }
    if (tipo === "horario" && form.horaInicio >= form.horaFin) {
      toast.error("La hora de fin debe ser posterior a la de inicio");
      return;
    }
    if (tipo === "capacidad" && (!form.capacidadMaxima || parseInt(form.capacidadMaxima) < 1)) {
      toast.error("Define una capacidad máxima válida");
      return;
    }

    const newBlock: Block = {
      id: generateBlockId(),
      tipo,
      fecha: form.fecha,
      motivo: form.motivo.trim(),
      creadoPor: user?.nombre || "Sistema",
      ...(tipo === "horario" && { horaInicio: form.horaInicio, horaFin: form.horaFin }),
      ...(tipo === "capacidad" && { capacidadMaxima: parseInt(form.capacidadMaxima) }),
    };

    setBlocks((prev) => [newBlock, ...prev]);
    toast.success("Bloqueo creado exitosamente");
    setOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    toast.success("Bloqueo eliminado");
  };

  const renderBlockCard = (b: Block) => {
    const Icon = typeIcons[b.tipo];
    return (
      <Card key={b.id} className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className={typeColors[b.tipo]}>{typeLabels[b.tipo]}</Badge>
                  <span className="text-xs text-muted-foreground">{b.id}</span>
                </div>
                <p className="text-sm font-medium mt-2">{b.motivo}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                  <span>📅 {b.fecha}</span>
                  {b.horaInicio && <span>🕐 {b.horaInicio} - {b.horaFin}</span>}
                  {b.capacidadMaxima && <span>👥 Máx. {b.capacidadMaxima} personas</span>}
                  <span>Por: {b.creadoPor}</span>
                </div>
              </div>
            </div>
            {isAdmin && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar bloqueo?</AlertDialogTitle>
                    <AlertDialogDescription>Esta acción liberará el horario/día/capacidad para nuevas reservas.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(b.id)}>Eliminar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const emptyState = (msg: string) => (
    <div className="text-center py-12 text-sm text-muted-foreground">
      <Ban className="h-10 w-10 mx-auto mb-2 opacity-40" />
      <p>{msg}</p>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Bloqueos Manuales</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gestiona eventos privados, días cerrados y límites de capacidad
            </p>
          </div>
          {isAdmin && (
            <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" /> Nuevo Bloqueo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Crear Bloqueo Manual</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label>Tipo de bloqueo</Label>
                    <Select value={tipo} onValueChange={(v) => setTipo(v as BlockType)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="horario">Bloquear horario (evento)</SelectItem>
                        <SelectItem value="dia">Cerrar día completo</SelectItem>
                        <SelectItem value="capacidad">Limitar capacidad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Fecha</Label>
                    <Input type="date" value={form.fecha} onChange={(e) => setForm((p) => ({ ...p, fecha: e.target.value }))} />
                  </div>

                  {tipo === "horario" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Hora inicio</Label>
                        <Input type="time" value={form.horaInicio} onChange={(e) => setForm((p) => ({ ...p, horaInicio: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Hora fin</Label>
                        <Input type="time" value={form.horaFin} onChange={(e) => setForm((p) => ({ ...p, horaFin: e.target.value }))} />
                      </div>
                    </div>
                  )}

                  {tipo === "capacidad" && (
                    <div className="space-y-2">
                      <Label>Capacidad máxima permitida</Label>
                      <Input
                        type="number"
                        min={1}
                        placeholder="Ej. 30"
                        value={form.capacidadMaxima}
                        onChange={(e) => setForm((p) => ({ ...p, capacidadMaxima: e.target.value }))}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Motivo</Label>
                    <Textarea
                      rows={3}
                      placeholder="Ej. Evento privado de cumpleaños"
                      value={form.motivo}
                      onChange={(e) => setForm((p) => ({ ...p, motivo: e.target.value }))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                  <Button onClick={handleSave}>Crear Bloqueo</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardContent className="pt-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center"><Clock className="h-5 w-5 text-blue-700" /></div>
            <div><p className="text-xs text-muted-foreground">Horarios bloqueados</p><p className="text-2xl font-bold">{filterByType("horario").length}</p></div>
          </CardContent></Card>
          <Card><CardContent className="pt-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center"><CalendarIcon className="h-5 w-5 text-red-700" /></div>
            <div><p className="text-xs text-muted-foreground">Días cerrados</p><p className="text-2xl font-bold">{filterByType("dia").length}</p></div>
          </CardContent></Card>
          <Card><CardContent className="pt-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center"><Users className="h-5 w-5 text-amber-700" /></div>
            <div><p className="text-xs text-muted-foreground">Límites de capacidad</p><p className="text-2xl font-bold">{filterByType("capacidad").length}</p></div>
          </CardContent></Card>
        </div>

        <Tabs defaultValue="todos">
          <TabsList>
            <TabsTrigger value="todos">Todos ({blocks.length})</TabsTrigger>
            <TabsTrigger value="horario">Horarios</TabsTrigger>
            <TabsTrigger value="dia">Días cerrados</TabsTrigger>
            <TabsTrigger value="capacidad">Capacidad</TabsTrigger>
          </TabsList>

          <TabsContent value="todos" className="space-y-3 mt-4">
            {blocks.length === 0 ? emptyState("No hay bloqueos activos") : blocks.map(renderBlockCard)}
          </TabsContent>
          <TabsContent value="horario" className="space-y-3 mt-4">
            {filterByType("horario").length === 0 ? emptyState("Sin horarios bloqueados") : filterByType("horario").map(renderBlockCard)}
          </TabsContent>
          <TabsContent value="dia" className="space-y-3 mt-4">
            {filterByType("dia").length === 0 ? emptyState("Sin días cerrados") : filterByType("dia").map(renderBlockCard)}
          </TabsContent>
          <TabsContent value="capacidad" className="space-y-3 mt-4">
            {filterByType("capacidad").length === 0 ? emptyState("Sin límites de capacidad") : filterByType("capacidad").map(renderBlockCard)}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Bloqueos;
