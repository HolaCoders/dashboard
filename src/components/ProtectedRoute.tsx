import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/data/users";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: UserRole;
}

export function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (requireRole && user.rol !== requireRole) return <Navigate to="/" replace />;

  return <>{children}</>;
}
