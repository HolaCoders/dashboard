import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Reservation } from "@/data/reservations";

interface Props {
  reservations: Reservation[];
  onSelectReservation: (r: Reservation) => void;
}

const statusDot: Record<string, string> = {
  aceptada: "bg-success",
  pendiente: "bg-warning",
  cancelada: "bg-destructive",
};

const WEEK_DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const ReservationsCalendar = ({ reservations, onSelectReservation }: Props) => {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<string | null>(toISO(today));

  const grid = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    // 0 = Monday-based offset
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: { date: Date; inMonth: boolean }[] = [];

    // Previous month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      cells.push({ date: new Date(year, month - 1, prevMonthDays - i), inMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(year, month, d), inMonth: true });
    }
    // Next month padding to complete 6 rows
    while (cells.length < 42) {
      const last = cells[cells.length - 1].date;
      const next = new Date(last);
      next.setDate(last.getDate() + 1);
      cells.push({ date: next, inMonth: false });
    }
    return cells;
  }, [cursor]);

  const reservationsByDay = useMemo(() => {
    const map = new Map<string, Reservation[]>();
    reservations.forEach((r) => {
      const list = map.get(r.date) || [];
      list.push(r);
      map.set(r.date, list);
    });
    return map;
  }, [reservations]);

  const dayReservations = selectedDay ? reservationsByDay.get(selectedDay) || [] : [];

  const goPrev = () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
  const goNext = () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));
  const goToday = () => {
    const t = new Date();
    setCursor(new Date(t.getFullYear(), t.getMonth(), 1));
    setSelectedDay(toISO(t));
  };

  const todayISO = toISO(today);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
      {/* Calendar */}
      <div className="lg:col-span-2 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">
            {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
          </h3>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={goToday} className="h-8 text-xs">Hoy</Button>
            <Button variant="ghost" size="icon" onClick={goPrev} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={goNext} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEK_DAYS.map((d) => (
            <div key={d} className="text-[11px] font-semibold uppercase text-muted-foreground py-2">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {grid.map(({ date, inMonth }, idx) => {
            const iso = toISO(date);
            const items = reservationsByDay.get(iso) || [];
            const isToday = iso === todayISO;
            const isSelected = iso === selectedDay;
            return (
              <button
                key={idx}
                onClick={() => setSelectedDay(iso)}
                className={cn(
                  "min-h-[68px] rounded-lg border p-1.5 text-left transition-all hover:border-primary/50 hover:bg-muted/50",
                  !inMonth && "opacity-40",
                  isSelected && "border-primary bg-primary/5 ring-1 ring-primary",
                  !isSelected && "border-border bg-card",
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      "text-xs font-medium inline-flex items-center justify-center h-5 w-5 rounded-full",
                      isToday && "bg-primary text-primary-foreground",
                      !isToday && "text-foreground",
                    )}
                  >
                    {date.getDate()}
                  </span>
                  {items.length > 0 && (
                    <span className="text-[10px] font-semibold text-muted-foreground">
                      {items.length}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-0.5">
                  {items.slice(0, 4).map((r) => (
                    <span
                      key={r.code}
                      className={cn("h-1.5 w-1.5 rounded-full", statusDot[r.status])}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" /> Aceptada</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warning" /> Pendiente</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-destructive" /> Cancelada</span>
        </div>
      </div>

      {/* Day detail */}
      <div className="bg-muted/30 rounded-xl border p-4 space-y-3">
        <div>
          <p className="text-xs uppercase font-semibold text-muted-foreground">Reservas del día</p>
          <p className="text-sm font-semibold text-foreground mt-1">
            {selectedDay
              ? new Date(selectedDay + "T00:00:00").toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })
              : "Selecciona un día"}
          </p>
        </div>

        {dayReservations.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted-foreground">
            Sin reservas para este día
          </div>
        ) : (
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {dayReservations.map((r) => (
              <button
                key={r.code}
                onClick={() => onSelectReservation(r)}
                className="w-full text-left bg-card border rounded-lg p-3 hover:border-primary/50 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{r.client}</p>
                    <p className="text-[11px] font-mono text-muted-foreground">{r.code}</p>
                  </div>
                  <Badge variant="outline" className={cn(
                    "capitalize text-[10px] shrink-0",
                    r.status === "aceptada" && "bg-success/10 text-success border-success/20",
                    r.status === "pendiente" && "bg-warning/10 text-warning border-warning/20",
                    r.status === "cancelada" && "bg-destructive/10 text-destructive border-destructive/20",
                  )}>
                    {r.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {r.time}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {r.people}</span>
                  <span className="truncate">{r.table}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
