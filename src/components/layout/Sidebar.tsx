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
  LogOut 
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
    name: "Job Cards", 
    href: "/jobs", 
    icon: ClipboardCheck, 
    roles: [UserRole.FOREMAN, UserRole.INSPECTOR, UserRole.FINANCE] 
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
    <aside className="w-64 glass-morphism border-r border-primary/10 flex flex-col z-20 transition-all duration-300">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight text-primary">Gadal Tech</h1>
        <p className="text-xs text-muted-foreground mt-1 opacity-70">Garage Management</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" 
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "animate-pulse" : "group-hover:scale-110 transition-transform")} />
              <span className="font-medium tracking-wide">{item.name}</span>
              {isActive && (
                <div className="absolute right-2 h-2 w-2 rounded-full bg-primary-foreground shadow-sm animate-bounce" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-primary/10">
        <div className="mb-4 px-4 py-3 rounded-xl bg-primary/5 border border-primary/10">
          <p className="text-xs font-semibold text-primary/70 uppercase tracking-wider">{user.role}</p>
          <p className="text-sm font-medium truncate">{user.name}</p>
        </div>
        <Button 
          variant="ghost" 
          onClick={logout} 
          className="w-full justify-start gap-3 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </aside>
  );
}
