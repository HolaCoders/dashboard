import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reservationsData } from "@/data/reservations";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { CalendarCheck, TrendingUp, Users, Clock } from "lucide-react";

const statusCount = {
  aceptada: reservationsData.filter((r) => r.status === "aceptada").length,
  pendiente: reservationsData.filter((r) => r.status === "pendiente").length,
  cancelada: reservationsData.filter((r) => r.status === "cancelada").length,
};

const pieData = [
  { name: "Aceptadas", value: statusCount.aceptada, color: "hsl(160, 60%, 42%)" },
  { name: "Pendientes", value: statusCount.pendiente, color: "hsl(36, 90%, 55%)" },
  { name: "Canceladas", value: statusCount.cancelada, color: "hsl(0, 72%, 51%)" },
];

const dailyData = [
  { day: "Lun", reservas: 3 },
  { day: "Mar", reservas: 5 },
  { day: "Mié", reservas: 2 },
  { day: "Jue", reservas: 7 },
  { day: "Vie", reservas: 8 },
  { day: "Sáb", reservas: 12 },
  { day: "Dom", reservas: 9 },
];

const monthlyData = [
  { mes: "Oct", reservas: 45 },
  { mes: "Nov", reservas: 62 },
  { mes: "Dic", reservas: 78 },
  { mes: "Ene", reservas: 55 },
];

const topTables = [
  { table: "Mesa #3", count: 15 },
  { table: "Mesa #1", count: 12 },
  { table: "Mesa #5", count: 10 },
  { table: "Mesa #4", count: 8 },
  { table: "Mesa #2", count: 6 },
];

const summaryStats = [
  { label: "Reservas este mes", value: "55", icon: CalendarCheck, change: "+12%" },
  { label: "Promedio personas", value: "3.8", icon: Users, change: "+5%" },
  { label: "Tasa de aceptación", value: "72%", icon: TrendingUp, change: "+3%" },
  { label: "Tiempo promedio", value: "1.5h", icon: Clock, change: "-8%" },
];

const Reportes = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
          <p className="text-sm text-muted-foreground mt-1">Estadísticas y métricas del restaurante</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryStats.map((stat) => (
            <Card key={stat.label} className="shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <span className={`text-xs font-medium ${stat.change.startsWith("+") ? "text-success" : "text-destructive"}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Bar chart - reservas por día */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Reservas por Día</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 20%, 90%)" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid hsl(30, 20%, 90%)" }} />
                  <Bar dataKey="reservas" fill="hsl(33, 45%, 42%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie chart - estados */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Distribución por Estado</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <div className="flex items-center gap-8">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                      <span className="text-sm font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line chart - tendencia mensual */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Tendencia Mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 20%, 90%)" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid hsl(30, 20%, 90%)" }} />
                  <Line type="monotone" dataKey="reservas" stroke="hsl(33, 45%, 42%)" strokeWidth={2} dot={{ fill: "hsl(33, 45%, 42%)", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top mesas */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Mesas Más Populares</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topTables.map((t, i) => (
                  <div key={t.table} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-muted-foreground w-5">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{t.table}</span>
                        <span className="text-sm text-muted-foreground">{t.count} reservas</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(t.count / 15) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reportes;
