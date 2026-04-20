import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Clock, CheckCircle2, XCircle, ArrowRight, Lock } from "lucide-react";
import { reservationsData } from "@/data/reservations";
import { isReservationFormClosed } from "@/data/blocks";
import { useEffect, useState } from "react";

const statusStyles: Record<string, string> = {
  aceptada: "bg-success/10 text-success border-success/20",
  pendiente: "bg-warning/10 text-warning border-warning/20",
  cancelada: "bg-destructive/10 text-destructive border-destructive/20",
};

const Index = () => {
  const [formClosed, setFormClosed] = useState(isReservationFormClosed());

  useEffect(() => {
    const handler = () => setFormClosed(isReservationFormClosed());
    window.addEventListener("reservation-form-closed-changed", handler);
    return () => window.removeEventListener("reservation-form-closed-changed", handler);
  }, []);

  const total = reservationsData.length;
  const pendientes = reservationsData.filter((r) => r.status === "pendiente").length;
  const aceptadas = reservationsData.filter((r) => r.status === "aceptada").length;
  const canceladas = reservationsData.filter((r) => r.status === "cancelada").length;

  const stats = [
    { label: "Total Reservas", value: total, icon: CalendarCheck, color: "bg-primary text-primary-foreground" },
    { label: "Pendientes", value: pendientes, icon: Clock, color: "bg-warning text-warning-foreground" },
    { label: "Confirmadas", value: aceptadas, icon: CheckCircle2, color: "bg-success text-success-foreground" },
    { label: "Canceladas", value: canceladas, icon: XCircle, color: "bg-destructive text-destructive-foreground" },
  ];

  const recientes = [...reservationsData]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 5);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inicio</h1>
          <p className="text-sm text-muted-foreground mt-1">Bienvenido a Catedral Café</p>
        </div>

        {formClosed && (
          <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
            <Lock className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="text-sm font-semibold text-destructive">Formulario de reservas cerrado</p>
              <p className="text-xs text-destructive/80">No se aceptan nuevas reservas hasta nuevo aviso.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Reservas Recientes</CardTitle>
            <Button asChild variant="ghost" size="sm" className="gap-1 text-primary">
              <Link to="/reservas">
                Ver todas <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {recientes.map((r) => (
              <div
                key={r.code}
                className="flex items-center justify-between gap-3 py-2 border-b last:border-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{r.client}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.date} · {r.time} · {r.table}
                  </p>
                </div>
                <Badge variant="outline" className={`capitalize text-xs shrink-0 ${statusStyles[r.status]}`}>
                  {r.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Index;
