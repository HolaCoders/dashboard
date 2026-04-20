import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reservationsData } from "@/data/reservations";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CalendarCheck, CheckCircle2, Clock, XCircle } from "lucide-react";

const Reportes = () => {
  const total = reservationsData.length;
  const aceptadas = reservationsData.filter((r) => r.status === "aceptada").length;
  const pendientes = reservationsData.filter((r) => r.status === "pendiente").length;
  const canceladas = reservationsData.filter((r) => r.status === "cancelada").length;

  const stats = [
    { label: "Total Reservas", value: total, icon: CalendarCheck, color: "bg-primary text-primary-foreground" },
    { label: "Aceptadas", value: aceptadas, icon: CheckCircle2, color: "bg-success text-success-foreground" },
    { label: "Pendientes", value: pendientes, icon: Clock, color: "bg-warning text-warning-foreground" },
    { label: "Canceladas", value: canceladas, icon: XCircle, color: "bg-destructive text-destructive-foreground" },
  ];

  const chartData = [
    { estado: "Aceptadas", cantidad: aceptadas },
    { estado: "Pendientes", cantidad: pendientes },
    { estado: "Canceladas", cantidad: canceladas },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
          <p className="text-sm text-muted-foreground mt-1">Resumen general de reservas</p>
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
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Reservas por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="estado" tick={{ fontSize: 12 }} />
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
