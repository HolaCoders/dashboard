import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Store, Clock, Bell, Table2 } from "lucide-react";
import { useTables } from "@/hooks/useTables";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";
import { TableStatus } from "@/data/tables";

const Configuracion = () => {
  const [restaurant, setRestaurant] = useState({
    name: "Catedral Café",
    phone: "809-555-1234",
    address: "Calle El Conde #12, Zona Colonial, Santo Domingo",
    email: "info@catedralcafe.com",
  });

  const [hours, setHours] = useState({
    openTime: "08:00",
    closeTime: "22:00",
    daysOpen: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
  });

  const { tables, updateTable } = useTables();
  const { settings: notifications, update: updateNotifications } = useNotificationSettings();

  const handleSave = () => toast.success("Configuración guardada exitosamente");

  const toggleTableStatus = (id: number, active: boolean) => {
    // "active" -> Disponible, "inactive" -> Mantenimiento
    const estado: TableStatus = active ? "Disponible" : "Mantenimiento";
    updateTable(id, { estado });
    toast.success(active ? "Mesa activada" : "Mesa puesta en mantenimiento");
  };

  const toggleDay = (day: string) => {
    setHours((prev) => ({
      ...prev,
      daysOpen: prev.daysOpen.includes(day)
        ? prev.daysOpen.filter((d) => d !== day)
        : [...prev.daysOpen, day],
    }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
          <p className="text-sm text-muted-foreground mt-1">Administra la configuración del restaurante</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-muted/50 p-1 rounded-lg">
            <TabsTrigger value="general" className="gap-2 rounded-md"><Store className="h-4 w-4" />General</TabsTrigger>
            <TabsTrigger value="horario" className="gap-2 rounded-md"><Clock className="h-4 w-4" />Horario</TabsTrigger>
            <TabsTrigger value="mesas" className="gap-2 rounded-md"><Table2 className="h-4 w-4" />Mesas</TabsTrigger>
            <TabsTrigger value="notificaciones" className="gap-2 rounded-md"><Bell className="h-4 w-4" />Notificaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Información del Restaurante</CardTitle>
                <CardDescription>Datos generales de tu establecimiento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre</Label>
                    <Input value={restaurant.name} onChange={(e) => setRestaurant((p) => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Teléfono</Label>
                    <Input value={restaurant.phone} onChange={(e) => setRestaurant((p) => ({ ...p, phone: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Dirección</Label>
                  <Input value={restaurant.address} onChange={(e) => setRestaurant((p) => ({ ...p, address: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={restaurant.email} onChange={(e) => setRestaurant((p) => ({ ...p, email: e.target.value }))} />
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button onClick={handleSave}>Guardar Cambios</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="horario">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Horario de Operación</CardTitle>
                <CardDescription>Configura los horarios y días de apertura</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Hora de apertura</Label>
                    <Input type="time" value={hours.openTime} onChange={(e) => setHours((p) => ({ ...p, openTime: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Hora de cierre</Label>
                    <Input type="time" value={hours.closeTime} onChange={(e) => setHours((p) => ({ ...p, closeTime: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Días de operación</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
                      <Button
                        key={day}
                        variant={hours.daysOpen.includes(day) ? "default" : "outline"}
                        size="sm"
                        className="rounded-full"
                        onClick={() => toggleDay(day)}
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button onClick={handleSave}>Guardar Cambios</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mesas">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Gestión de Mesas</CardTitle>
                <CardDescription>Administra las mesas disponibles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tables.map((table) => (
                    <div key={table.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                          <Table2 className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{table.name}</p>
                          <p className="text-xs text-muted-foreground">{table.capacity} personas</p>
                        </div>
                      </div>
                      <Switch
                        checked={table.active}
                        onCheckedChange={(checked) =>
                          setTables((prev) => prev.map((t) => (t.id === table.id ? { ...t, active: checked } : t)))
                        }
                      />
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-end">
                  <Button onClick={handleSave}>Guardar Cambios</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notificaciones">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Notificaciones</CardTitle>
                <CardDescription>Configura cómo recibir alertas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "newReservation", label: "Nueva reserva", desc: "Notificar cuando se cree una nueva reserva" },
                  { key: "cancellation", label: "Cancelaciones", desc: "Notificar cuando se cancele una reserva" },
                  { key: "reminder", label: "Recordatorios", desc: "Enviar recordatorio antes de la reserva" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={(checked) => setNotifications((p) => ({ ...p, [item.key]: checked }))}
                    />
                  </div>
                ))}
                <Separator />
                <p className="text-sm font-medium">Canales</p>
                {[
                  { key: "whatsapp", label: "WhatsApp", desc: "Recibir notificaciones por WhatsApp" },
                  { key: "email", label: "Email", desc: "Recibir notificaciones por correo electrónico" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={(checked) => setNotifications((p) => ({ ...p, [item.key]: checked }))}
                    />
                  </div>
                ))}
                <Separator />
                <div className="flex justify-end">
                  <Button onClick={handleSave}>Guardar Cambios</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Configuracion;
