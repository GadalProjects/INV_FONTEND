import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, ClipboardIcon, AlertCircle, ShieldCheck } from "lucide-react";
import { toast } from 'sonner';

export default function InspectorDashboard() {
  const queryClient = useQueryClient();

  const { data: qcJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['qc-pending-jobs'],
    queryFn: async () => {
      const resp = await api.get('/jobs?status=IN_REPAIR');
      return resp.data;
    },
  });

  const signOffMutation = useMutation({
    mutationFn: (jobId: string) => api.patch(`/inspections/${jobId}/qc-sign-off`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qc-pending-jobs'] });
      toast.success("Quality Control Sign-off completed!");
    }
  });

  if (jobsLoading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Scanning workshop for QC tasks...</div>;

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quality Control Hub</h2>
          <p className="text-muted-foreground mt-1">Verify repair quality and providing final authorization for invoicing.</p>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-bold">
              <CheckCircle2 className="h-4 w-4" /> 12 QC Passed Today
           </div>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="glass-morphism border-emerald-500/20 shadow-xl overflow-hidden">
          <CardHeader className="bg-emerald-500/5 pb-4 border-b border-emerald-500/10">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/20 p-2 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <CardTitle>Repair Completion & Final Gate</CardTitle>
            </div>
            <CardDescription className="pt-2">Review works done and provide digital sign-off to proceed to billing.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Job ID</TableHead>
                  <TableHead>Vehicle & Technician</TableHead>
                  <TableHead>Work Summary</TableHead>
                  <TableHead>QC Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qcJobs?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground italic">
                      All clear! No jobs currently pending QC.
                    </TableCell>
                  </TableRow>
                )}
                {qcJobs?.map((job: any) => (
                  <TableRow key={job._id} className="hover:bg-emerald-500/5 transition-colors">
                    <TableCell className="font-bold text-emerald-600">{job.jobCardID}</TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{job.vehicle.make} {job.vehicle.model}</div>
                      <div className="text-xs text-muted-foreground font-semibold">Tech: {job.assignedTechnician?.name || 'Assigned'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs max-w-[250px] truncate opacity-70">
                        {job.repairNotes || "Technical repair notes pending..."}
                      </div>
                    </TableCell>
                    <TableCell>
                      {job.isQCComplete ? (
                        <Badge className="bg-emerald-500 text-white gap-1"><CheckCircle2 className="h-3 w-3" /> Signed Off</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1">
                          <AlertCircle className="h-3 w-3" /> Pending Review
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                       <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="text-primary gap-2">
                          <ClipboardIcon className="h-4 w-4" /> Checklist
                        </Button>
                        {!job.isQCComplete && (
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="bg-emerald-600 hover:bg-emerald-700 shadow-md"
                            disabled={signOffMutation.isPending}
                            onClick={() => signOffMutation.mutate(job._id)}
                          >
                            Final Sign-off
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
      </div>
    </div>
  );
}
