import { CalendarCheck, Clock, CheckCircle2, XCircle } from "lucide-react";

const stats = [
  { label: "Total Reservas", value: 8, icon: CalendarCheck, color: "bg-primary text-primary-foreground" },
  { label: "Pendientes", value: 1, icon: Clock, color: "bg-warning text-warning-foreground" },
  { label: "Confirmadas", value: 4, icon: CheckCircle2, color: "bg-success text-success-foreground" },
  { label: "Canceladas", value: 3, icon: XCircle, color: "bg-destructive text-destructive-foreground" },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card rounded-xl border p-4 flex items-center gap-4 shadow-sm">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${stat.color}`}>
            <stat.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
