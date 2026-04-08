import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserIcon, ClipboardCheck, AlertTriangle, ShieldCheck, ArrowRight, UserPlus } from "lucide-react";
import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

export default function ForemanDashboard() {
  const queryClient = useQueryClient();
  const [selectedTechnicians, setSelectedTechnicians] = useState<Record<string, string>>({});

  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['unassigned-jobs'],
    queryFn: async () => {
      const resp = await api.get('/jobs?status=RECEIVED');
      return resp.data;
    },
  });

  const { data: technicians } = useQuery({
    queryKey: ['technicians'],
    queryFn: async () => {
      const resp = await api.get('/users/role/TECHNICIAN');
      return resp.data;
    },
  });

  const assignMutation = useMutation({
    mutationFn: ({ jobId, technicianId }: { jobId: string, technicianId: string }) => 
      api.patch(`/jobs/${jobId}/assign`, { technicianId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unassigned-jobs'] });
      toast.success("Workshop asset successfully assigned to technician.");
    },
    onError: () => {
      toast.error("Failed to assign technician. Please verify protocol.");
    }
  });

  if (jobsLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      <p className="text-muted-foreground font-black uppercase tracking-widest text-xs animate-pulse">Syncing Workshop Queue...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-primary/5">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight text-foreground">Mission Allocation</h2>
          <p className="text-muted-foreground text-lg italic">Phase 2: Distribute operational workload to specialized units.</p>
        </div>
        <div className="flex items-center gap-4 bg-primary/5 px-6 py-3 rounded-2xl border border-primary/10">
           <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
           <span className="text-sm font-black uppercase tracking-widest text-primary">{jobs?.length || 0} Pending Assignments</span>
        </div>
      </div>

      <div className="grid gap-8">
        <Card className="bg-card/30 backdrop-blur-xl border-primary/5 shadow-2xl overflow-hidden rounded-[2rem]">
          <CardHeader className="p-8 bg-primary/[0.02] border-b border-primary/5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary glow-primary border border-primary/20">
                <ClipboardCheck className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black">Incoming Asset Queue</CardTitle>
                <CardDescription className="text-base italic">Vehicles cleared from intake and awaiting technical engagement.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-primary/5 bg-primary/[0.02]">
                  <TableHead className="py-6 px-8 font-black uppercase tracking-widest text-[10px]">Reference</TableHead>
                  <TableHead className="py-6 font-black uppercase tracking-widest text-[10px]">Asset Configuration</TableHead>
                  <TableHead className="py-6 font-black uppercase tracking-widest text-[10px]">Transmission Date</TableHead>
                  <TableHead className="py-6 font-black uppercase tracking-widest text-[10px] w-[320px]">Deployment Target</TableHead>
                  <TableHead className="py-6 px-8 text-right font-black uppercase tracking-widest text-[10px]">Engagement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-24 text-muted-foreground italic">
                       <div className="flex flex-col items-center gap-4 opacity-40">
                          <ShieldCheck className="h-12 w-12" />
                          <p className="text-lg font-bold">All sectors operational. Zero pending assignments.</p>
                       </div>
                    </TableCell>
                  </TableRow>
                )}
                {jobs?.map((job: any) => (
                  <TableRow key={job._id} className="border-b border-primary/5 hover:bg-primary/[0.03] transition-all group">
                    <TableCell className="py-8 px-8 align-top">
                       <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-black tracking-tighter border border-primary/10">
                          {job.jobCardID}
                       </span>
                    </TableCell>
                    <TableCell className="py-8 align-top">
                      <div className="space-y-1">
                        <div className="font-black text-lg text-foreground flex items-center gap-2">
                           {job.vehicle.make} <span className="opacity-40 font-light">/</span> {job.vehicle.vehicleModel}
                        </div>
                        <div className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                           <span className="text-primary/60">ID:</span> {job.vehicle.plateNumber}
                           <span className="mx-1 opacity-20">|</span>
                           <span>{job.vehicle.customerName}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-8 align-top font-bold text-sm text-muted-foreground/80">
                      {new Date(job.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="py-8 align-top">
                      <Select 
                        onValueChange={(val) => setSelectedTechnicians({ ...selectedTechnicians, [job._id]: val })}
                      >
                        <SelectTrigger className="bg-primary/5 border-primary/10 transition-all hover:bg-primary/10 focus:ring-primary/20 h-10 rounded-xl font-bold">
                          <SelectValue placeholder="Identify Personnel..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl glass-morphism border-primary/10 shadow-2xl">
                          {technicians?.map((tech: any) => (
                            <SelectItem key={tech._id} value={tech._id} className="rounded-lg focus:bg-primary/5">
                              <div className="flex items-center gap-3">
                                <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center">
                                   <UserIcon className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <span className="font-bold">{tech.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="py-8 px-8 text-right align-top">
                      <Button 
                        size="lg" 
                        className={cn(
                          "h-10 rounded-xl px-6 font-black uppercase tracking-widest text-[10px] shadow-lg transition-all",
                          selectedTechnicians[job._id] 
                            ? "bg-primary text-primary-foreground hover:scale-[1.05] glow-primary" 
                            : "bg-muted text-muted-foreground grayscale cursor-not-allowed"
                        )}
                        disabled={!selectedTechnicians[job._id] || assignMutation.isPending}
                        onClick={() => assignMutation.mutate({ jobId: job._id, technicianId: selectedTechnicians[job._id] })}
                      >
                        {assignMutation.isPending ? "Syncing..." : "Assign Task"}
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Insight Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <Card className="bg-amber-500/10 border-amber-500/20 rounded-[2rem] p-8 space-y-4 hover:scale-[1.02] transition-transform duration-500 glow-accent group">
              <div className="flex justify-between items-center text-amber-500">
                <div className="h-12 w-12 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30 group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                   <AlertTriangle className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Priority Alert</span>
              </div>
              <div>
                <p className="text-5xl font-black text-amber-500 tracking-tighter">03</p>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-2">High-Load Assets</p>
              </div>
           </Card>

           <Card className="bg-primary/10 border-primary/20 rounded-[2rem] p-8 space-y-4 hover:scale-[1.02] transition-transform duration-500 glow-primary group">
              <div className="flex justify-between items-center text-primary">
                <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                   <UserPlus className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Personnel Load</span>
              </div>
              <div>
                <p className="text-5xl font-black text-primary tracking-tighter">{technicians?.length || 0}</p>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-2">Active Technicians</p>
              </div>
           </Card>

           <Card className="bg-accent/10 border-accent/20 rounded-[2rem] p-8 space-y-4 hover:scale-[1.02] transition-transform duration-500 glow-accent group">
              <div className="flex justify-between items-center text-accent">
                <div className="h-12 w-12 rounded-2xl bg-accent/20 flex items-center justify-center border border-accent/30 group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                   <ShieldCheck className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">System Integrity</span>
              </div>
              <div>
                <p className="text-5xl font-black text-accent tracking-tighter">100%</p>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-2">Allocation Efficiency</p>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
