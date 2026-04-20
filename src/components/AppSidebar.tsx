import { Home, CalendarCheck, BarChart3, Settings, LogOut, UtensilsCrossed, Table2, Ban } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { title: "Inicio", url: "/", icon: Home, adminOnly: false },
  { title: "Reservas", url: "/reservas", icon: CalendarCheck, adminOnly: false },
  { title: "Mesas", url: "/mesas", icon: Table2, adminOnly: false },
  { title: "Bloqueos", url: "/bloqueos", icon: Ban, adminOnly: true },
  { title: "Reportes", url: "/reportes", icon: BarChart3, adminOnly: true },
  { title: "Configuración", url: "/configuracion", icon: Settings, adminOnly: true },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const collapsed = state === "collapsed";
  const isAdmin = hasRole("Administrador");

  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <div className="flex flex-col items-center gap-1 pt-6 pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
          <UtensilsCrossed className="h-6 w-6 text-primary-foreground" />
        </div>
        {!collapsed && (
          <>
            <h2 className="mt-2 text-lg font-semibold text-foreground">Catedral Café</h2>
            <p className="text-xs text-muted-foreground">Panel de Control</p>
          </>
        )}
      </div>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11 rounded-lg">
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="gap-3 px-3 text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                      activeClassName="bg-primary text-primary-foreground hover:bg-primary"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2 pb-4">
        {!collapsed && user && (
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-3 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <span className="text-sm font-semibold text-primary">{user.nombre.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.nombre}</p>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 mt-0.5">
                {user.rol}
              </Badge>
            </div>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="h-10 gap-3 px-3 text-destructive hover:bg-destructive/10 rounded-lg"
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span className="font-medium">Cerrar Sesión</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
