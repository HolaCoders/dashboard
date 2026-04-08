import { Home, CalendarCheck, BarChart3, Settings, LogOut, UtensilsCrossed } from "lucide-react";
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

const navItems = [
  { title: "Inicio", url: "/", icon: Home },
  { title: "Reservas", url: "/reservas", icon: CalendarCheck },
  { title: "Reportes", url: "/reportes", icon: BarChart3 },
  { title: "Configuración", url: "/configuracion", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

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
              {navItems.map((item) => (
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
        {!collapsed && (
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-3 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <span className="text-sm font-semibold text-primary">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Administrador</p>
              <p className="text-xs text-muted-foreground">Super Admin</p>
            </div>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-10 gap-3 px-3 text-destructive hover:bg-destructive/10 rounded-lg">
              <LogOut className="h-4 w-4" />
              {!collapsed && <span className="font-medium">Cerrar Sesión</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
