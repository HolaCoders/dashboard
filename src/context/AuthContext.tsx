import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AppUser, UserRole, usersData } from "@/data/users";

interface AuthContextType {
  user: AppUser | null;
  login: (correo: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "catedral_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = (correo: string, password: string) => {
    const found = usersData.find((u) => u.correo === correo && u.password === password);
    if (!found) return { ok: false, error: "Credenciales inválidas" };
    setUser(found);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const hasRole = (role: UserRole) => user?.rol === role;

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
