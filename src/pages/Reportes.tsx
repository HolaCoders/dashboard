import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reservationsData } from "@/data/reservations";
import { blocksData } from "@/data/blocks";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CalendarDays, CalendarRange, CalendarCheck, CalendarX, Ban } from "lucide-react";

const Reportes = () => {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  // Inicio de semana (lunes)
  const startOfWeek = new Date(now);
  const day = (startOfWeek.getDay() + 6) % 7;
  startOfWeek.setDate(startOfWeek.getDate() - day);
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const parseDate = (s: string) => new Date(s + "T00:00:00");

  const reservasHoy = reservationsData.filter((r) => r.date === today).length;
  const reservasSemana = reservationsData.filter((r) => parseDate(r.date) >= startOfWeek).length;
  const reservasMes = reservationsData.filter((r) => parseDate(r.date) >= startOfMonth).length;
  const reservasAnio = reservationsData.filter((r) => parseDate(r.date) >= startOfYear).length;

  const diasCerrados = blocksData.filter((b) => b.tipo === "dia").length;

  const stats = [
    { label: "Hoy", value: reservasHoy, icon: CalendarCheck, color: "bg-primary text-primary-foreground" },
    { label: "Esta semana", value: reservasSemana, icon: CalendarRange, color: "bg-success text-success-foreground" },
    { label: "Este mes", value: reservasMes, icon: CalendarDays, color: "bg-warning text-warning-foreground" },
    { label: "Este año", value: reservasAnio, icon: CalendarX, color: "bg-secondary text-secondary-foreground" },
  ];

  const chartData = [
    { periodo: "Hoy", cantidad: reservasHoy },
    { periodo: "Semana", cantidad: reservasSemana },
    { periodo: "Mes", cantidad: reservasMes },
    { periodo: "Año", cantidad: reservasAnio },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
          <p className="text-sm text-muted-foreground mt-1">Resumen de reservas por período</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">Reservas {stat.label.toLowerCase()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-destructive text-destructive-foreground">
              <Ban className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{diasCerrados}</p>
              <p className="text-xs text-muted-foreground">Días cerrados registrados</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Reservas por Período</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="periodo" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "0.75rem",
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--card))",
                  }}
                />
                <Bar dataKey="cantidad" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reportes;
