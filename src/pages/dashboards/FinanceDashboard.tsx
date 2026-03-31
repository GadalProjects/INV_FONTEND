import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReceiptCent, FileText, Wallet } from "lucide-react";
import { toast } from 'sonner';

export default function FinanceDashboard() {
  const queryClient = useQueryClient();

  const { data: qcCastedJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['qc-completed-jobs'],
    queryFn: async () => {
      const resp = await api.get('/jobs?isQCComplete=true&status=IN_REPAIR');
      return resp.data;
    },
  });

  const closeJobMutation = useMutation({
    mutationFn: (jobId: string) => api.post(`/billing/${jobId}/close`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qc-completed-jobs'] });
      toast.success("Job closed and archived successfully!");
    }
  });

  if (jobsLoading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Scanning workshop for billing opportunities...</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Financial settlement</h2>
        <p className="text-muted-foreground mt-1">Review finalized jobs and generate customer invoices.</p>
      </div>

      <div className="grid gap-6">
        <Card className="glass-morphism border-primary/20 shadow-xl overflow-hidden">
          <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-lg">
                <ReceiptCent className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Jobs Ready for Closure</CardTitle>
            </div>
            <CardDescription className="pt-2">Repairs signed-off by QC that are ready for final invoicing.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Job ID</TableHead>
                  <TableHead>Vehicle & Owner</TableHead>
                  <TableHead className="text-right">Total Hours</TableHead>
                  <TableHead className="text-right">Part Costs</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qcCastedJobs?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground italic">
                      No jobs currently pending billing.
                    </TableCell>
                  </TableRow>
                )}
                {qcCastedJobs?.map((job: any) => (
                  <TableRow key={job._id} className="hover:bg-primary/5 transition-colors">
                    <TableCell className="font-bold text-primary">{job.jobCardID}</TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{job.vehicle.make} {job.vehicle.model}</div>
                      <div className="text-xs text-muted-foreground">Owner: {job.customerName}</div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold">{job.totalLaborHours}h</TableCell>
                    <TableCell className="text-right font-mono font-bold text-amber-600">${job.totalPartsCost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                       <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary gap-2"
                          onClick={() => toast.info(`Showing invoice preview for: ${job.jobCardID}`)}
                        >
                          <FileText className="h-4 w-4" /> Preview Invoice
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="bg-primary hover:bg-primary shadow-lg shadow-primary/10 transition-all hover:scale-105"
                          disabled={closeJobMutation.isPending}
                          onClick={() => closeJobMutation.mutate(job._id)}
                        >
                          <Wallet className="h-4 w-4" /> Close & Settle
                        </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Financial Overview (Mockup) */}
        <div className="grid md:grid-cols-2 gap-6">
           <Card className="glass-morphism border-emerald-500/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-70">Revenue Potential (Ready to Bill)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">$12,450.00</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                   <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> 
                   Total estimated value across 8 pending jobs
                </p>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
