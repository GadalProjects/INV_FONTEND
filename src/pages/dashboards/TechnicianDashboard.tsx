import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/client';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Square, Hammer, ClipboardList, PenTool, Timer, CheckCircle2, History, ArrowRight } from "lucide-react";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

export default function TechnicianDashboard() {
  const queryClient = useQueryClient();
  const [repairNotes, setRepairNotes] = useState<Record<string, string>>({});

  const { data: myJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: async () => {
      const resp = await api.get('/jobs/my-tasks');
      return resp.data;
    },
  });

  const clockInMutation = useMutation({
    mutationFn: (jobCardId: string) => api.post('/labor/clock-in', { jobCardId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
      toast.success("Shift Engagement Started.");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to clock in.");
    }
  });

  const clockOutMutation = useMutation({
    mutationFn: (jobCardId: string) => api.post('/labor/clock-out', { jobCardId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
      toast.info("Shift Engagement Terminated.");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to clock out.");
    }
  });

  const updateRepairMutation = useMutation({
    mutationFn: ({ jobId, notes }: { jobId: string, notes: string }) => 
      api.patch(`/jobs/${jobId}/status`, { status: "ACTIVE", notes }), // Using status route for notes if needed, or dedicated route
    onSuccess: () => {
      toast.success("Technical log updated.");
    }
  });

  if (jobsLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      <p className="text-muted-foreground font-black uppercase tracking-widest text-xs animate-pulse">Loading Mission Briefings...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-primary/5">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight text-foreground">Technical Workbench</h2>
          <p className="text-muted-foreground text-lg italic">Phase 3: Execute maintenance protocols and log labor metrics.</p>
        </div>
        <div className="flex items-center gap-4 bg-primary/5 px-6 py-3 rounded-2xl border border-primary/10">
           <Timer className="h-4 w-4 text-primary animate-pulse" />
           <span className="text-sm font-black uppercase tracking-widest text-primary">Shift Control Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Active Tasks Area */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Hammer className="h-5 w-5" />
             </div>
             <h3 className="text-xl font-black uppercase tracking-widest text-foreground/80">Active Assignments</h3>
          </div>
          
          {myJobs?.length === 0 && (
            <Card className="bg-card/20 backdrop-blur-md border-dashed border-2 border-primary/10 rounded-[2.5rem]">
              <CardContent className="py-24 text-center text-muted-foreground">
                <ClipboardList className="h-16 w-16 mx-auto mb-6 opacity-10" />
                <p className="text-xl font-bold opacity-40">No missions currently assigned to your unit.</p>
                <p className="text-sm italic mt-2 opacity-30">Stand by for Foreman instructions.</p>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-8">
            {myJobs?.map((job: any) => (
              <Card key={job._id} className="bg-card/30 backdrop-blur-2xl border-primary/5 shadow-2xl overflow-hidden rounded-[2.5rem] group transition-all hover:scale-[1.01] hover:border-primary/20">
                <div className="border-b border-primary/5 bg-primary/[0.03] p-8 flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                       <span className="bg-primary/20 text-primary px-3 py-1.5 rounded-lg text-xs font-black tracking-[0.2em] uppercase border border-primary/10 glow-primary">
                          {job.jobCardID}
                       </span>
                       <Badge className={cn(
                         "px-4 py-1.5 rounded-full font-black uppercase tracking-tighter text-[10px] border",
                         job.status === 'ACTIVE' ? "bg-amber-500/20 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary/60 border-primary/10"
                       )}>
                          {job.status}
                       </Badge>
                    </div>
                    <h4 className="text-3xl font-black text-foreground pt-3 tracking-tighter">
                       {job.vehicle.make} <span className="text-primary italic">/</span> {job.vehicle.vehicleModel}
                    </h4>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60">
                       Registry: <span className="text-foreground tracking-widest">{job.vehicle.plateNumber}</span>
                    </p>
                  </div>
                  <Link to={`/jobs/${job._id}`}>
                    <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all duration-500">
                       <ArrowRight className="h-6 w-6" />
                    </Button>
                  </Link>
                </div>

                <CardContent className="p-8 space-y-10">
                  <div className={cn(
                    "grid md:grid-cols-2 gap-10 p-6 rounded-[2rem] transition-all duration-700",
                    job.isClockedIn ? "bg-emerald-500/[0.03] border border-emerald-500/10 shadow-[inner_0_0_20px_rgba(16,185,129,0.05)]" : "bg-primary/[0.02] border border-primary/5"
                  )}>
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 ml-1">Mission Clock</Label>
                      <div className="flex gap-4">
                        <Button 
                          onClick={() => clockInMutation.mutate(job._id)} 
                          disabled={job.isClockedIn || clockInMutation.isPending}
                          className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-500 hover:scale-[1.02] active:scale-[0.98] rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-emerald-500/20 gap-3 border-none transition-all glow-accent text-foreground"
                        >
                          <Play className="h-4 w-4 fill-foreground" /> Engage Shift
                        </Button>
                        <Button 
                          onClick={() => clockOutMutation.mutate(job._id)} 
                          disabled={!job.isClockedIn || clockOutMutation.isPending}
                          variant="destructive"
                          className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-destructive/20 gap-3 transition-all hover:scale-[1.02] border-none bg-destructive text-foreground"
                        >
                          <Square className="h-4 w-4 fill-foreground" /> Terminate
                        </Button>
                      </div>
                      {job.isClockedIn && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 animate-in fade-in zoom-in duration-500">
                           <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                           <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] italic">Session Active: Metrics streaming...</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/60 ml-1">Hardware Requisition</Label>
                      <Link to={`/jobs/${job._id}/parts-request`}>
                        <Button variant="outline" className="w-full h-14 rounded-2xl border-accent/20 hover:bg-accent/10 hover:text-accent transition-all duration-300 gap-3 font-black uppercase tracking-widest text-[10px] glow-accent text-foreground">
                          <PenTool className="h-4 w-4" /> Secure Spare Parts
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <Label htmlFor={`notes-${job._id}`} className="text-[10px] font-black uppercase tracking-[0.3em] text-primary ml-1 neon-text-primary italic">Technical Engagement Log</Label>
                    <div className="relative group">
                      <Input 
                        id={`notes-${job._id}`}
                        placeholder="Log diagnostic findings or maintenance milestones..." 
                        className="h-16 bg-primary/5 border-primary/10 rounded-2xl font-bold text-foreground pl-6 pr-40 focus:ring-primary/20 focus:border-primary/40 transition-all duration-500 placeholder:text-foreground/20"
                        onChange={(e) => setRepairNotes({ ...repairNotes, [job._id]: e.target.value })}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-10 px-6 rounded-xl bg-primary text-foreground hover:bg-primary/80 font-black uppercase tracking-widest text-[9px] shadow-2xl transition-all duration-300"
                        onClick={() => updateRepairMutation.mutate({ jobId: job._id, notes: repairNotes[job._id] })}
                      >
                        Commit Log
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar Performance Area */}
        <div className="lg:col-span-4 space-y-8">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent glow-accent">
                <Timer className="h-5 w-5" />
             </div>
             <h3 className="text-xl font-black uppercase tracking-widest text-foreground/80">Unit Efficiency</h3>
          </div>

          <Card className="bg-card/40 backdrop-blur-3xl border-primary/10 rounded-[2.5rem] p-10 space-y-10 shadow-2xl overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            
            <div className="space-y-4 text-center">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">Weekly Labor Output</p>
               <div className="flex items-end justify-center gap-2">
                  <p className="text-7xl font-black text-foreground tracking-tighter drop-shadow-2xl">32.5</p>
                  <p className="text-2xl font-black text-primary/40 pb-2">HRS</p>
               </div>
               <div className="flex items-center justify-center gap-2 text-amber-500 bg-amber-500/5 px-4 py-2 rounded-full w-fit mx-auto border border-amber-500/10">
                  <CheckCircle2 className="h-4 w-4" />
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] italic">+2.1h productivity burst</p>
               </div>
            </div>

            <div className="space-y-5">
               <div className="w-full h-3 bg-primary/10 rounded-full overflow-hidden border border-primary/10 p-0.5">
                  <div className="h-full bg-primary w-[80%] rounded-full shadow-[0_0_15px_rgba(249,115,22,0.6)] animate-pulse" />
               </div>
               <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.3em] text-foreground/30 px-2">
                  <span>Unit Capacity</span>
                  <span className="text-primary italic">80.2%</span>
               </div>
            </div>

            <div className="pt-10 border-t border-primary/10 space-y-8">
               <div className="flex items-center gap-3">
                  <History className="h-5 w-5 text-primary opacity-60" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">Technical Logs Feed</p>
               </div>
               <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-4 items-start group">
                       <div className="h-2 w-2 rounded-full bg-primary mt-2 shadow-[0_0_10px_rgba(249,115,22,0.8)] group-hover:scale-150 transition-transform" />
                       <div className="space-y-1">
                          <p className="text-sm font-bold text-foreground/80 leading-tight italic">
                            "Hydraulic subsystem recalibrated successfully."
                          </p>
                          <p className="text-[9px] font-black uppercase text-primary/40 tracking-widest">Job #JC-9921 • 2h ago</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
