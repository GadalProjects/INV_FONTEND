import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserIcon, ClipboardCheck, AlertTriangle } from "lucide-react";
import { useState } from 'react';
import { toast } from 'sonner';

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
      const resp = await api.get('/auth/users?role=TECHNICIAN');
      return resp.data;
    },
  });

  const assignMutation = useMutation({
    mutationFn: ({ jobId, technicianId }: { jobId: string, technicianId: string }) => 
      api.patch(`/jobs/${jobId}/assign`, { technicianId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unassigned-jobs'] });
      toast.success("Job assigned successfully!");
    }
  });

  if (jobsLoading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading unassigned work...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Workload Assignment</h2>
        <p className="text-muted-foreground mt-1 text-base">Allocate incoming jobs to available technicians.</p>
      </div>

      <div className="grid gap-6">
        <Card className="glass-morphism border-primary/20 shadow-xl">
          <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-lg">
                <ClipboardCheck className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Unassigned Job Cards</CardTitle>
            </div>
            <CardDescription className="pt-2">Newly received vehicles waiting for technician allocation.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Job ID</TableHead>
                  <TableHead>Vehicle & Customer</TableHead>
                  <TableHead>Received Date</TableHead>
                  <TableHead className="w-[280px]">Assign Technician</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground italic">
                      No pending assignments at the moment.
                    </TableCell>
                  </TableRow>
                )}
                {jobs?.map((job: any) => (
                  <TableRow key={job._id} className="hover:bg-primary/5 transition-colors">
                    <TableCell className="font-bold text-primary">{job.jobCardID}</TableCell>
                    <TableCell>
                      <div className="font-medium">{job.vehicle.make} {job.vehicle.model}</div>
                      <div className="text-xs text-muted-foreground">Owner: {job.customerName}</div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Select 
                        onValueChange={(val) => setSelectedTechnicians({ ...selectedTechnicians, [job._id]: val })}
                      >
                        <SelectTrigger className="bg-background/50 border-primary/10 focus:ring-primary/30 h-10 transition-all">
                          <SelectValue placeholder="Select Technician" />
                        </SelectTrigger>
                        <SelectContent>
                          {technicians?.map((tech: any) => (
                            <SelectItem key={tech._id} value={tech._id}>
                              <div className="flex items-center gap-2">
                                <UserIcon className="h-3 w-3" />
                                <span>{tech.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        className="bg-primary/90 hover:bg-primary shadow-lg shadow-primary/10 px-4"
                        disabled={!selectedTechnicians[job._id] || assignMutation.isPending}
                        onClick={() => assignMutation.mutate({ jobId: job._id, technicianId: selectedTechnicians[job._id] })}
                      >
                        Assign Work
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Workload Insight (Optional Mockup) */}
        <div className="grid md:grid-cols-3 gap-6">
           <Card className="bg-amber-50/50 dark:bg-amber-900/10 border-amber-200/50 dark:border-amber-700/30">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center text-amber-600">
                  <span className="text-sm font-semibold uppercase tracking-wider">Urgent Jobs</span>
                  <AlertTriangle className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">03</div>
                <p className="text-xs text-muted-foreground mt-1">Requiring immediate allocation</p>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
