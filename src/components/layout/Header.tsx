import { Bell, Search, Settings, User, Command } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="h-20 bg-background/40 backdrop-blur-md border-b border-primary/5 flex items-center justify-between px-8 z-10 selection:bg-primary/20">
      <div className="flex items-center gap-6 flex-1">
        <div className="relative w-full max-w-md hidden md:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search garage records..." 
            className="pl-10 h-10 bg-primary/5 border-transparent transition-all focus:bg-background focus:border-primary/20 focus:ring-4 focus:ring-primary/5 rounded-2xl w-full"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded border border-primary/10 bg-background text-[10px] items-center text-muted-foreground font-black opacity-60">
             <Command className="h-2.5 w-2.5" /> K
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-1000">
        <div className="flex items-center gap-2 bg-primary/5 p-1.5 rounded-2xl border border-primary/10">
           <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-background hover:text-primary transition-all duration-300 shadow-none">
             <Bell className="h-4.5 w-4.5" />
           </Button>
           <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-background hover:text-primary transition-all duration-300 shadow-none">
             <Settings className="h-4.5 w-4.5" />
           </Button>
        </div>
        
        <div className="h-8 w-px bg-primary/10 mx-2" />
        
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 p-1 rounded-2xl pr-4 hover:bg-primary/5 border border-primary/5 transition-all outline-none focus-visible:ring-0 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-foreground shadow-lg glow-primary group-hover:scale-105 transition-transform duration-500">
                <User className="h-5 w-5" />
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-sm font-black tracking-tight leading-tight">{user?.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                   <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] leading-none opacity-60 italic">mission status: operational</p>
                </div>
              </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 p-3 rounded-[1.5rem] glass-morphism border-primary/10 shadow-2xl animate-in slide-in-from-top-4 duration-500 outline-none">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-4 py-3">
                 <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em] mb-1">Personnel Detail</p>
                 <p className="text-sm font-bold truncate opacity-80">{user?.email}</p>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-primary/10 my-2" />
            <DropdownMenuItem className="rounded-xl px-4 py-3 cursor-pointer focus:bg-primary/10 transition-colors gap-3 font-bold text-xs uppercase tracking-widest outline-none">
               <Settings className="h-4 w-4 opacity-40" /> Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl px-4 py-3 cursor-pointer focus:bg-primary/10 transition-colors gap-3 font-bold text-xs uppercase tracking-widest outline-none">
               <Bell className="h-4 w-4 opacity-40" /> Alert Feed
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-primary/10 my-2" />
            <DropdownMenuItem className="rounded-xl px-4 py-3 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer font-black text-xs uppercase tracking-[0.2em] gap-3 outline-none" onClick={logout}>
              Terminate Session
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
