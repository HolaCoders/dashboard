import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useTables } from "@/hooks/useTables";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Table2, Users } from "lucide-react";
import { toast } from "sonner";
import { RestaurantTable, TableStatus } from "@/data/tables";
import { useAuth } from "@/context/AuthContext";

const statusVariants: Record<TableStatus, string> = {
  Disponible: "bg-green-100 text-green-700 hover:bg-green-100",
  Reservada: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  Mantenimiento: "bg-amber-100 text-amber-700 hover:bg-amber-100",
};

const Mesas = () => {
  const { hasRole } = useAuth();
  const isAdmin = hasRole("Administrador");
  const { tables, addTable, updateTable, removeTable } = useTables();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<RestaurantTable | null>(null);
  const [form, setForm] = useState({ numero: "", capacidad: "", estado: "Disponible" as TableStatus });

  const totalCapacity = tables.reduce((sum, t) => sum + t.capacidad, 0);
  const availableCount = tables.filter((t) => t.estado === "Disponible").length;

  const openCreate = () => {
    setEditing(null);
    setForm({ numero: "", capacidad: "", estado: "Disponible" });
    setOpen(true);
  };

  const openEdit = (t: RestaurantTable) => {
    setEditing(t);
    setForm({ numero: String(t.numero), capacidad: String(t.capacidad), estado: t.estado });
    setOpen(true);
  };

  const handleSave = () => {
    const numero = parseInt(form.numero, 10);
    const capacidad = parseInt(form.capacidad, 10);
    if (!numero || !capacidad || capacidad < 1) {
      toast.error("Completa todos los campos correctamente");
      return;
    }
    const duplicate = tables.find((t) => t.numero === numero && t.id !== editing?.id);
    if (duplicate) {
      toast.error("Ya existe una mesa con ese número");
      return;
    }
    if (editing) {
      updateTable(editing.id, { numero, capacidad, estado: form.estado });
      toast.success("Mesa actualizada");
    } else {
      addTable({ numero, capacidad, estado: form.estado });
      toast.success("Mesa creada");
    }
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    removeTable(id);
    toast.success("Mesa eliminada");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestión de Mesas</h1>
            <p className="text-sm text-muted-foreground mt-1">Administra las mesas del restaurante y su estado</p>
          </div>
          {isAdmin && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreate} className="gap-2">
                  <Plus className="h-4 w-4" /> Nueva Mesa
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editing ? "Editar Mesa" : "Nueva Mesa"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label>Número de mesa</Label>
                    <Input type="number" min={1} value={form.numero} onChange={(e) => setForm((p) => ({ ...p, numero: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Capacidad</Label>
                    <Input type="number" min={1} value={form.capacidad} onChange={(e) => setForm((p) => ({ ...p, capacidad: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select value={form.estado} onValueChange={(v) => setForm((p) => ({ ...p, estado: v as TableStatus }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Disponible">Disponible</SelectItem>
                        <SelectItem value="Reservada">Reservada</SelectItem>
                        <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                  <Button onClick={handleSave}>{editing ? "Guardar" : "Crear"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardContent className="pt-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Table2 className="h-5 w-5 text-primary" /></div>
            <div><p className="text-xs text-muted-foreground">Total mesas</p><p className="text-2xl font-bold">{tables.length}</p></div>
          </CardContent></Card>
          <Card><CardContent className="pt-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center"><Table2 className="h-5 w-5 text-green-700" /></div>
            <div><p className="text-xs text-muted-foreground">Disponibles</p><p className="text-2xl font-bold">{availableCount}</p></div>
          </CardContent></Card>
          <Card><CardContent className="pt-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/40 flex items-center justify-center"><Users className="h-5 w-5 text-foreground" /></div>
            <div><p className="text-xs text-muted-foreground">Capacidad total</p><p className="text-2xl font-bold">{totalCapacity}</p></div>
          </CardContent></Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Listado de mesas</CardTitle>
            <CardDescription>{isAdmin ? "Edita o elimina las mesas" : "Vista de solo lectura"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mesa</TableHead>
                  <TableHead>Capacidad</TableHead>
                  <TableHead>Estado</TableHead>
                  {isAdmin && <TableHead className="text-right">Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">Mesa #{t.numero}</TableCell>
                    <TableCell>{t.capacidad} personas</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusVariants[t.estado]}>{t.estado}</Badge>
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(t)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar Mesa #{t.numero}?</AlertDialogTitle>
                                <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(t.id)}>Eliminar</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Mesas;
