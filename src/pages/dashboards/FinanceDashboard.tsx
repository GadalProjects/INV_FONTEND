import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReceiptCent, FileText, Wallet, ArrowRight, TrendingUp, Landmark } from "lucide-react";
import { toast } from 'sonner';

import { Badge } from "@/components/ui/badge";

export default function FinanceDashboard() {
  const queryClient = useQueryClient();

  const { data: qcCastedJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['qc-completed-jobs'],
    queryFn: async () => {
      // Filtering for jobs that are either in QC or ACTIVE but HAVE QC sign-off
      const resp = await api.get('/jobs?isQCComplete=true');
      return resp.data;
    },
  });

  const closeJobMutation = useMutation({
    mutationFn: (jobId: string) => api.patch(`/jobs/${jobId}/status`, { status: "CLOSED" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qc-completed-jobs'] });
      toast.success("Workshop session settled and archived.");
    },
    onError: () => {
      toast.error("Settlement protocol failed. Check accounting linkage.");
    }
  });

  if (jobsLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      <p className="text-muted-foreground font-black uppercase tracking-widest text-xs animate-pulse">Scanning Financial Ledger...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-primary/5">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight text-foreground">Revenue & Settlement</h2>
          <p className="text-muted-foreground text-lg italic">Phase 4: Finalize verified sessions and generate commercial documentation.</p>
        </div>
        <div className="flex items-center gap-4 bg-primary/5 px-6 py-3 rounded-2xl border border-primary/10">
           <Landmark className="h-4 w-4 text-primary" />
           <span className="text-sm font-black uppercase tracking-widest text-primary">Ledger Balance: Secure</span>
        </div>
      </div>

      <div className="grid gap-8">
        <Card className="bg-card/30 backdrop-blur-xl border-primary/5 shadow-2xl overflow-hidden rounded-[2rem]">
          <CardHeader className="p-8 bg-primary/[0.02] border-b border-primary/5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary glow-primary border border-primary/20">
                <ReceiptCent className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black">Authorized for Invoicing</CardTitle>
                <CardDescription className="text-base italic">Technical repairs completed and signed-off by Quality Control.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-primary/5 bg-primary/[0.02]">
                  <TableHead className="py-6 px-8 font-black uppercase tracking-widest text-[10px]">Asset Token</TableHead>
                  <TableHead className="py-6 font-black uppercase tracking-widest text-[10px]">Entity & Configuration</TableHead>
                  <TableHead className="py-6 text-right font-black uppercase tracking-widest text-[10px]">Labor Effort</TableHead>
                  <TableHead className="py-6 text-right font-black uppercase tracking-widest text-[10px]">Supply Value</TableHead>
                  <TableHead className="py-6 px-8 text-right font-black uppercase tracking-widest text-[10px]">Settlement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qcCastedJobs?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-24 text-muted-foreground italic">
                       <div className="flex flex-col items-center gap-4 opacity-40">
                          <p className="text-lg font-bold">No active jobs pending financial closure.</p>
                       </div>
                    </TableCell>
                  </TableRow>
                )}
                {qcCastedJobs?.map((job: any) => (
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
                    <TableCell className="py-8 align-top text-right">
                       <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                          <span className="text-sm font-black text-primary">{job.totalLaborHours || 0}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">HRS</span>
                       </div>
                    </TableCell>
                    <TableCell className="py-8 align-top text-right">
                       <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/5 border border-amber-500/10 text-amber-600">
                          <span className="text-sm font-black">${(job.totalPartsCost || 0).toLocaleString()}</span>
                       </div>
                    </TableCell>
                    <TableCell className="py-8 px-8 text-right align-top">
                       <div className="flex justify-end gap-3">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-10 rounded-xl px-4 font-black uppercase tracking-widest text-[9px] gap-2 hover:bg-primary/10 hover:text-primary transition-all"
                          onClick={() => toast.info(`Generating secure preview for invoice: ${job.jobCardID}`)}
                        >
                          <FileText className="h-3.5 w-3.5" /> Preview
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="h-10 rounded-xl px-4 bg-primary text-primary-foreground font-black uppercase tracking-widest text-[9px] gap-2 shadow-lg glow-primary transition-all hover:scale-[1.05]"
                          disabled={closeJobMutation.isPending}
                          onClick={() => closeJobMutation.mutate(job._id)}
                        >
                          <Wallet className="h-3.5 w-3.5" /> Finalize
                        </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Financial Insight Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <Card className="bg-emerald-500/10 border-emerald-500/20 rounded-[2rem] p-10 flex items-center justify-between group overflow-hidden relative hover:scale-[1.01] transition-all duration-500 glow-accent">
              <div className="absolute -right-8 -bottom-8 opacity-[0.05] group-hover:scale-125 transition-transform duration-1000">
                 <Landmark className="h-48 w-48 text-emerald-500" />
              </div>
              <div className="space-y-6 z-10">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      <TrendingUp className="h-5 w-5" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 opacity-60">Liquidity Potential</span>
                </div>
                <div>
                  <p className="text-6xl font-black text-emerald-500 tracking-tighter drop-shadow-2xl">
                    ${(qcCastedJobs?.reduce((sum: number, j: any) => sum + (j.totalPartsCost || 0) + (j.totalLaborCost || 0), 0) || 0).toLocaleString()}
                  </p>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-3 opacity-40">Verified Settlement Pipeline</p>
                </div>
              </div>
              <div className="text-right hidden md:block z-10">
                 <div className="p-4 rounded-2xl bg-primary/5 backdrop-blur-md border border-primary/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Target Engagement</p>
                    <p className="text-xl font-black text-foreground">HIGH VOLUME</p>
                 </div>
                 <ArrowRight className="h-8 w-8 text-emerald-500 ml-auto mt-6 animate-bounce-x" />
              </div>
           </Card>

           <Card className="bg-primary/10 border-primary/20 rounded-[2rem] p-10 flex flex-col justify-center gap-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute -left-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                       <Landmark className="h-4 w-4" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Queue Velocity</p>
                 </div>
                 <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-black px-4 py-1 rounded-full uppercase text-[9px] tracking-widest">Live Flow</Badge>
              </div>
              <div className="space-y-6">
                 <div className="flex justify-between items-end">
                    <div>
                       <p className="text-4xl font-black text-foreground tracking-tighter">{qcCastedJobs?.length || 0} Assets</p>
                       <p className="text-xs font-bold text-primary italic opacity-70">Cleared for financial settlement</p>
                    </div>
                    <p className="text-2xl font-black text-primary opacity-40 italic">75%</p>
                  </div>
                  <div className="w-full h-3 bg-primary/5 rounded-full overflow-hidden border border-primary/5 p-0.5">
                     <div className="h-full bg-primary w-[75%] rounded-full shadow-[0_0_15px_hsla(25,95%,58%,0.5)] animate-pulse" />
                  </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
