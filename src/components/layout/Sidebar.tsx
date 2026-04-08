import { Link, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/hooks/useAuth";
import { 
  LayoutDashboard, 
  CarFront, 
  ClipboardCheck, 
  Users, 
  Wrench, 
  Package, 
  ReceiptIndianRupee,
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { 
    name: "Dashboard", 
    href: "/", 
    icon: LayoutDashboard, 
    roles: Object.values(UserRole) 
  },
  { 
    name: "Vehicle Receiving", 
    href: "/vrs", 
    icon: CarFront, 
    roles: [UserRole.RECEIVING] 
  },
  { 
    name: "Mission Control", 
    href: "/foreman", 
    icon: ClipboardCheck, 
    roles: [UserRole.FOREMAN] 
  },
  { 
    name: "Job Cards", 
    href: "/jobs", 
    icon: ClipboardCheck, 
    roles: [UserRole.INSPECTOR, UserRole.FINANCE] 
  },
  { 
    name: "Technician Desk", 
    href: "/tech", 
    icon: Wrench, 
    roles: [UserRole.TECHNICIAN] 
  },
  { 
    name: "Inspection & QC", 
    href: "/inspection", 
    icon: Users, 
    roles: [UserRole.INSPECTOR] 
  },
  { 
    name: "Inventory", 
    href: "/inventory", 
    icon: Package, 
    roles: [UserRole.STORES] 
  },
  { 
    name: "Finance & Billing", 
    href: "/billing", 
    icon: ReceiptIndianRupee, 
    roles: [UserRole.FINANCE] 
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));

  return (
    <aside className="w-72 bg-card/80 backdrop-blur-2xl border-r border-primary/5 flex flex-col z-20 transition-all duration-500 group selection:bg-primary/20">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 glow-primary">
            <Wrench className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-foreground">Gadal<span className="text-primary italic">Tech</span></h1>
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground opacity-60">Inventory v1.0</p>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-2">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-500 relative overflow-hidden font-black text-sm tracking-widest uppercase",
                isActive 
                  ? "bg-gradient-to-r from-primary/20 to-accent/10 text-foreground shadow-lg glow-primary" 
                  : "text-foreground/30 hover:bg-primary/5 hover:text-foreground"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary to-accent rounded-r-full shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
              )}
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-2.5 rounded-xl transition-all duration-500",
                  isActive 
                    ? "bg-gradient-to-br from-primary to-accent text-foreground shadow-xl scale-110" 
                    : "bg-primary/5 group-hover:bg-primary/10 group-hover:scale-105"
                )}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className={cn(
                  "transition-all duration-300",
                  isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                )}>{item.name}</span>
              </div>
              <ChevronRight className={cn(
                "h-4 w-4 transition-all duration-500",
                isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 group-hover:opacity-40 group-hover:translate-x-0"
              )} />
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto">
        <div className="p-4 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 shadow-inner">
          <div className="flex items-center gap-3 mb-4">
             <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{user.name}</p>
                <p className="text-[10px] font-black uppercase text-primary tracking-tighter opacity-80">{user.role}</p>
             </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={logout} 
            className="w-full justify-center gap-2 rounded-2xl text-xs font-bold uppercase tracking-widest text-destructive hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20 transition-all duration-300"
          >
            <LogOut className="h-4 w-4" />
            <span>Terminate Session</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
