import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ReservationsTable } from "@/components/dashboard/ReservationsTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Panel de Reservas</h1>
            <p className="text-sm text-muted-foreground mt-1">Gestiona las reservas de Catedral Café</p>
          </div>
          <Button className="gap-2 rounded-lg shadow-sm">
            <Plus className="h-4 w-4" />
            Nueva Reserva
          </Button>
        </div>

        {/* Stats */}
        <StatsCards />

        {/* Filters + Table */}
        <div className="bg-card rounded-xl border shadow-sm">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 border-b">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente o teléfono..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-muted/50 border-0 rounded-lg"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-muted/50 border-0 rounded-lg">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="aceptada">Aceptada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ReservationsTable searchQuery={searchQuery} statusFilter={statusFilter} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
