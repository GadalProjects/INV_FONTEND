import { useQuery } from '@tanstack/react-query';
import api from '@/api/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  ClipboardList, 
  CheckCircle2, 
  Truck,
  Activity,
  ArrowRight,
  Microscope,
  Zap
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function MasterDashboard() {
  const { user } = useAuth();
  
  const { data: recentJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['recent-jobs'],
    queryFn: async () => {
      const resp = await api.get('/jobs');
      return resp.data;
    },
  });

  if (jobsLoading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-muted-foreground font-medium animate-pulse">Syncing workshop data...</p>
    </div>
  );

  const stats = [
    { 
      title: "Total Job Cards", 
      value: recentJobs?.length || 0, 
      icon: ClipboardList, 
      bgColor: "bg-orange-500/10",
      iconColor: "text-orange-400",
      description: "Lifetime vehicles handled"
    },
    { 
      title: "Active Repairs", 
      value: recentJobs?.filter((j: any) => j.status === 'ACTIVE').length || 0, 
      icon: Activity, 
      bgColor: "bg-amber-500/10",
      iconColor: "text-amber-400",
      description: "Currently on hoist"
    },
    { 
      title: "Pending Quality Check", 
      value: recentJobs?.filter((j: any) => j.status === 'QC').length || 0, 
      icon: Microscope, 
      bgColor: "bg-orange-400/10",
      iconColor: "text-orange-300",
      description: "Awaiting inspection"
    },
    { 
      title: "Completed Today", 
      value: recentJobs?.filter((j: any) => j.status === 'CLOSED').length || 0, 
      icon: CheckCircle2, 
      bgColor: "bg-amber-400/10",
      iconColor: "text-amber-300",
      description: "Ready for delivery"
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
             Workshop Insights <Zap className="h-8 w-8 text-primary fill-primary" />
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            Welcome back, <span className="text-foreground font-bold">{user?.name}</span>. Technical operations are running at normal capacity.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-2xl border border-primary/10">
           <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
           <span className="text-xs font-black uppercase tracking-widest text-primary">Live Workshop Feed</span>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((card) => (
          <Card key={card.title} className={cn(
            "group overflow-hidden border-primary/10 transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl hover:border-primary/30 relative",
            card.bgColor
          )}>
            <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-10 transition-opacity">
               <card.icon className="h-24 w-24 -mr-8 -mt-8" />
            </div>
            <CardHeader className="pb-2">
              <div className={cn("p-3 w-fit rounded-2xl transition-all duration-500 group-hover:scale-110 bg-primary/10 border border-primary/20 shadow-lg")}>
                <card.icon className={cn("h-6 w-6 shadow-glow", card.iconColor)} />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-5xl font-black tracking-tighter mb-2 text-foreground drop-shadow-md">{card.value}</div>
              <p className="text-sm font-black text-foreground/80 uppercase tracking-widest">{card.title}</p>
              <p className="text-[10px] font-bold text-foreground/40 mt-3 italic">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
         <Card className="lg:col-span-3 overflow-hidden border-primary/5 shadow-2xl bg-card/30 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-primary/5 bg-primary/[0.02] p-8">
              <div>
                <CardTitle className="text-2xl font-black">Live Operations</CardTitle>
                <CardDescription className="text-base mt-1">Real-time tracking of vehicle lifecycle and workshop load</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                 <div className="flex -space-x-3">
                    {[1,2,3].map(_ => <div key={_} className="h-8 w-8 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-[10px] font-bold">U{_}</div>)}
                 </div>
                 <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-background/50 font-black text-[10px] uppercase tracking-tighter">12 Active Techs</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-primary/[0.01]">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="w-[180px] px-8 py-5 text-[10px] font-black uppercase tracking-widest">Job Token</TableHead>
                    <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest">Asset Particulars</TableHead>
                    <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-center">Lifecycle Status</TableHead>
                    <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-right px-8">Operational Intent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentJobs?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">No assets currently in rotation.</TableCell>
                    </TableRow>
                  ) : (
                    recentJobs?.map((job: any) => (
                      <TableRow key={job._id} className="hover:bg-primary/[0.03] transition-colors border-primary/5 group">
                        <TableCell className="px-8">
                           <div className="flex flex-col">
                              <span className="font-mono text-sm font-black text-primary">{job.jobCardID}</span>
                              <span className="text-[10px] text-muted-foreground font-bold mt-0.5">{new Date(job.createdAt).toLocaleDateString()}</span>
                           </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary/10 transition-colors">
                               <Truck className="h-6 w-6 text-primary/60" />
                            </div>
                            <div>
                              <div className="font-black text-base">{job.vehicle.make} {job.vehicle.vehicleModel}</div>
                              <div className="text-xs font-bold text-muted-foreground tracking-tight italic">{job.vehicle.plateNumber}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={cn(
                            "px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border-2",
                            job.status === 'RECEIVED' && "bg-blue-500/10 text-blue-500 border-blue-500/10",
                            (job.status === 'PENDING_INSPECTION' || job.status === 'PENDING_AUTHORIZATION') && "bg-purple-500/10 text-purple-500 border-purple-500/10",
                            job.status === 'ACTIVE' && "bg-amber-500/10 text-amber-500 border-amber-500/10",
                            job.status === 'QC' && "bg-emerald-500/10 text-emerald-500 border-emerald-500/10",
                            job.status === 'CLOSED' && "bg-slate-500/10 text-slate-500 border-slate-500/10",
                            !['RECEIVED', 'PENDING_INSPECTION', 'PENDING_AUTHORIZATION', 'ACTIVE', 'QC', 'CLOSED'].includes(job.status) && "bg-gray-500/10 text-gray-500 border-gray-500/10"
                          )}>
                            {job.status.replace(/_/g, ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right px-8">
                          <Link to={`/jobs/${job._id}`}>
                            <Button variant="ghost" className="rounded-xl h-10 px-6 font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-primary-foreground group-hover:shadow-lg transition-all gap-2">
                               inspect details <ArrowRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}


