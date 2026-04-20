import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import Reservas from "./pages/Reservas.tsx";
import Reportes from "./pages/Reportes.tsx";
import Configuracion from "./pages/Configuracion.tsx";
import Mesas from "./pages/Mesas.tsx";
import Bloqueos from "./pages/Bloqueos.tsx";
import Login from "./pages/Login.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/reservas" element={<ProtectedRoute><Reservas /></ProtectedRoute>} />
            <Route path="/mesas" element={<ProtectedRoute><Mesas /></ProtectedRoute>} />
            <Route path="/bloqueos" element={<ProtectedRoute requireRole="Administrador"><Bloqueos /></ProtectedRoute>} />
            <Route path="/reportes" element={<ProtectedRoute requireRole="Administrador"><Reportes /></ProtectedRoute>} />
            <Route path="/configuracion" element={<ProtectedRoute requireRole="Administrador"><Configuracion /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
