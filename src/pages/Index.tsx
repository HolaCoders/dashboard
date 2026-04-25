import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Lock,
  TrendingUp,
  Users,
  CalendarDays,
} from "lucide-react";
import { reservationsData } from "@/data/reservations";
import { isReservationFormClosed } from "@/data/blocks";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const statusStyles: Record<string, string> = {
  aceptada: "bg-success/10 text-success border-success/20",
  pendiente: "bg-warning/10 text-warning border-warning/20",
  cancelada: "bg-destructive/10 text-destructive border-destructive/20",
};

const Index = () => {
  const { user } = useAuth();
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

  const totalCubiertos = useMemo(
    () => reservationsData.filter((r) => r.status === "aceptada").reduce((sum, r) => sum + r.people, 0),
    [],
  );

  const tasaConfirmacion = total > 0 ? Math.round((aceptadas / total) * 100) : 0;

  const stats = [
    {
      label: "Total Reservas",
      value: total,
      icon: CalendarCheck,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      hint: "Histórico acumulado",
    },
    {
      label: "Pendientes",
      value: pendientes,
      icon: Clock,
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
      hint: "Por confirmar",
    },
    {
      label: "Confirmadas",
      value: aceptadas,
      icon: CheckCircle2,
      iconBg: "bg-success/10",
      iconColor: "text-success",
      hint: `${tasaConfirmacion}% del total`,
    },
    {
      label: "Canceladas",
      value: canceladas,
      icon: XCircle,
      iconBg: "bg-destructive/10",
      iconColor: "text-destructive",
      hint: "Liberadas",
    },
  ];

  const recientes = [...reservationsData].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5);

  const hoyISO = new Date().toISOString().slice(0, 10);
  const proximas = [...reservationsData]
    .filter((r) => r.date >= hoyISO && r.status !== "cancelada")
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .slice(0, 4);

  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header de bienvenida */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Panel de control
            </p>
            <h1 className="text-3xl font-bold text-foreground mt-1">
              Hola, {user?.nombre?.split(" ")[0] ?? "bienvenido"} 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-1 capitalize">{today}</p>
          </div>
          <Button asChild size="sm" className="self-start sm:self-auto">
            <Link to="/reservas">
              <CalendarCheck className="h-4 w-4" />
              Ver reservas
            </Link>
          </Button>
        </div>

        {formClosed && (
          <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
              <Lock className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-destructive">Formulario de reservas cerrado</p>
              <p className="text-xs text-destructive/80">No se aceptan nuevas reservas hasta nuevo aviso.</p>
            </div>
          </div>
        )}

        {/* Métricas principales */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconBg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground mt-4 tabular-nums">{stat.value}</p>
                <p className="text-sm font-medium text-foreground mt-1">{stat.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.hint}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Métricas secundarias */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent">
                <Users className="h-6 w-6 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Cubiertos confirmados</p>
                <p className="text-xl font-bold text-foreground tabular-nums">{totalCubiertos} personas</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-success/10">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Tasa de confirmación</p>
                <p className="text-xl font-bold text-foreground tabular-nums">{tasaConfirmacion}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grid de listas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Próximas reservas */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                <CardTitle className="text-base font-semibold">Próximas Reservas</CardTitle>
              </div>
              <Badge variant="secondary" className="text-xs">
                {proximas.length}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-1">
              {proximas.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  No hay reservas próximas.
                </p>
              ) : (
                proximas.map((r) => (
                  <div
                    key={r.code}
                    className="flex items-center justify-between gap-3 py-2.5 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <span className="text-xs font-semibold text-primary">
                          {r.client.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{r.client}</p>
                        <p className="text-xs text-muted-foreground">
                          {r.date} · {r.time} · {r.people} pax
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`capitalize text-xs shrink-0 ${statusStyles[r.status]}`}
                    >
                      {r.status}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Reservas recientes */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <CardTitle className="text-base font-semibold">Actividad Reciente</CardTitle>
              </div>
              <Button asChild variant="ghost" size="sm" className="gap-1 text-primary h-8">
                <Link to="/reservas">
                  Ver todas <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-1">
              {recientes.map((r) => (
                <div
                  key={r.code}
                  className="flex items-center justify-between gap-3 py-2.5 border-b last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{r.client}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.code} · {r.table}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`capitalize text-xs shrink-0 ${statusStyles[r.status]}`}
                  >
                    {r.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
