import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, ClipboardIcon, AlertCircle, Microscope, Target, ShieldCheck } from "lucide-react";
import { toast } from 'sonner';


export default function InspectorDashboard() {
  const queryClient = useQueryClient();

  const { data: qcJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['qc-pending-jobs'],
    queryFn: async () => {
      // Showing active jobs for inspection review
      const resp = await api.get('/jobs?status=ACTIVE');
      return resp.data;
    },
  });

  const signOffMutation = useMutation({
    mutationFn: (jobId: string) => api.patch(`/inspections/${jobId}/qc-sign-off`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qc-pending-jobs'] });
      toast.success("Quality Control Clearance Granted.");
    },
    onError: () => {
      toast.error("QC Sign-off failed. Verify inspection record integrity.");
    }
  });

  if (jobsLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      <p className="text-muted-foreground font-black uppercase tracking-widest text-xs animate-pulse">Syncing Inspection Queue...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-primary/5">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight text-foreground">Quality Control Hub</h2>
          <p className="text-muted-foreground text-lg italic">Phase 3: Verify repair integrity and authorize final gate clearance.</p>
        </div>
        <div className="flex items-center gap-4 bg-primary/5 px-6 py-3 rounded-2xl border border-primary/10">
           <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
           <span className="text-sm font-black uppercase tracking-widest text-primary">Status: Secure</span>
        </div>
      </div>

      <div className="grid gap-8">
        <Card className="bg-card/30 backdrop-blur-xl border-primary/5 shadow-2xl overflow-hidden rounded-[2rem]">
          <CardHeader className="p-8 bg-emerald-500/[0.02] border-b border-primary/5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 glow-primary border border-emerald-500/20">
                <Microscope className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black tracking-tight">Active Verifications</CardTitle>
                <CardDescription className="text-base italic">Reviewing technical logs and physical repair quality.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-primary/5 bg-primary/[0.02]">
                  <TableHead className="py-6 px-8 font-black uppercase tracking-widest text-[10px]">Reference</TableHead>
                  <TableHead className="py-6 font-black uppercase tracking-widest text-[10px]">Asset Configuration</TableHead>
                  <TableHead className="py-6 font-black uppercase tracking-widest text-[10px]">Technical Progress</TableHead>
                  <TableHead className="py-6 font-black uppercase tracking-widest text-[10px]">QC State</TableHead>
                  <TableHead className="py-6 px-8 text-right font-black uppercase tracking-widest text-[10px]">Protocol</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qcJobs?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-24 text-muted-foreground italic">
                       <div className="flex flex-col items-center gap-4 opacity-40">
                          <CheckCircle2 className="h-12 w-12" />
                          <p className="text-lg font-bold">All maintenance missions cleared for QC.</p>
                       </div>
                    </TableCell>
                  </TableRow>
                )}
                {qcJobs?.map((job: any) => (
                  <TableRow key={job._id} className="border-b border-primary/5 hover:bg-emerald-500/[0.03] transition-all group">
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
                           <span>{job.assignedTechnician?.name || "Unit Assigned"}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-8 align-top">
                      <div className="text-xs max-w-[250px] leading-relaxed font-bold italic opacity-60">
                        {job.repairNotes || "Technical diagnostic notes pending..."}
                      </div>
                    </TableCell>
                    <TableCell className="py-8 align-top">
                      {job.isQCComplete ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-2 font-black uppercase tracking-tighter px-3 py-1 text-[10px]">
                           <CheckCircle2 className="h-3 w-3" /> Signed Off
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-2 font-black uppercase tracking-tighter px-3 py-1 text-[10px]">
                           <AlertCircle className="h-3 w-3" /> Pending Review
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-8 px-8 text-right align-top">
                       <div className="flex justify-end gap-3">
                        <Button variant="ghost" size="sm" className="h-10 rounded-xl px-4 font-black uppercase tracking-widest text-[9px] gap-2 hover:bg-primary/10 hover:text-primary transition-all">
                          <ClipboardIcon className="h-3.5 w-3.5" /> Checklist
                        </Button>
                        {!job.isQCComplete && (
                          <Button 
                            disabled={signOffMutation.isPending}
                            onClick={() => signOffMutation.mutate(job._id)}
                            className="bg-emerald-600 text-foreground hover:bg-emerald-700 font-bold px-6 rounded-xl shadow-lg glow-accent border-none"
                          >
                            <ShieldCheck className="mr-2 h-4 w-4" /> Sign Off
                          </Button>
                        )}
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Oversight Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <Card className="bg-emerald-500/10 border-emerald-500/20 rounded-[2rem] p-8 space-y-4 hover:scale-[1.02] transition-transform duration-500 glow-accent group">
              <div className="flex justify-between items-center text-emerald-600">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                   <Target className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Quality Target</span>
              </div>
              <div>
                <p className="text-5xl font-black text-emerald-600 tracking-tighter">98.2%</p>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-2">First-Time Pass Rate</p>
              </div>
           </Card>

           <Card className="bg-primary/10 border-primary/20 rounded-[2rem] p-8 space-y-4 hover:scale-[1.02] transition-transform duration-500 glow-primary group">
              <div className="flex justify-between items-center text-primary">
                <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                   <ClipboardIcon className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Queue Volume</span>
              </div>
              <div>
                <p className="text-5xl font-black text-primary tracking-tighter">{qcJobs?.length || 0}</p>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-2">Active Verifications</p>
              </div>
           </Card>

           <Card className="bg-amber-500/10 border-amber-500/20 rounded-[2rem] p-8 space-y-4 hover:scale-[1.02] transition-transform duration-500 glow-accent group">
              <div className="flex justify-between items-center text-amber-500">
                <div className="h-12 w-12 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30 group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                   <AlertCircle className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Action Required</span>
              </div>
              <div>
                <p className="text-5xl font-black text-amber-500 tracking-tighter">02</p>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-2">QC Failures / Retries</p>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
