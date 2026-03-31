import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Square, Hammer, ClipboardList, PenTool } from "lucide-react";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

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
    mutationFn: (jobId: string) => api.post('/labor/clock-in', { jobId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
      toast.success("Clocked in successfully!");
    }
  });

  const clockOutMutation = useMutation({
    mutationFn: (jobId: string) => api.post('/labor/clock-out', { jobId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
      toast.info("Clocked out successfully!");
    }
  });

  const updateRepairMutation = useMutation({
    mutationFn: ({ jobId, notes }: { jobId: string, notes: string }) => 
      api.patch(`/jobs/${jobId}/repair-manual`, { notes }),
    onSuccess: () => {
      toast.success("Repair notes updated!");
    }
  });

  if (jobsLoading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Fetching your work orders...</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Personal Workbench</h2>
        <p className="text-muted-foreground mt-1">Manage your active maintenance tasks and log labor hours.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Task (if any) */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Hammer className="h-5 w-5 text-primary" />
            Active Tasks
          </h3>
          
          {myJobs?.length === 0 && (
            <Card className="bg-muted/5 border-dashed border-2">
              <CardContent className="py-12 text-center text-muted-foreground">
                <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-20" />
                No active jobs assigned to you yet.
              </CardContent>
            </Card>
          )}

          {myJobs?.map((job: any) => (
            <Card key={job._id} className="glass-morphism border-primary/20 shadow-lg overflow-hidden group">
              <CardHeader className="bg-primary/5 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{job.jobCardID}</CardTitle>
                    <CardDescription>{job.vehicle.make} {job.vehicle.model} - {job.vehicle.plateNumber}</CardDescription>
                  </div>
                  <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">{job.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">Labor Clocking</Label>
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => clockInMutation.mutate(job._id)} 
                        disabled={job.isClockedIn || clockInMutation.isPending}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2 shadow-lg shadow-emerald-500/10"
                      >
                        <Play className="h-4 w-4" /> Start Labor
                      </Button>
                      <Button 
                        onClick={() => clockOutMutation.mutate(job._id)} 
                        disabled={!job.isClockedIn || clockOutMutation.isPending}
                        variant="destructive"
                        className="flex-1 gap-2 shadow-lg shadow-destructive/10"
                      >
                        <Square className="h-4 w-4" /> Pause/Stop
                      </Button>
                    </div>
                    {job.isClockedIn && (
                      <p className="text-xs text-emerald-600 font-bold animate-pulse flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-600" /> Currently Clocked In
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">Quick Action</Label>
                    <Link to={`/jobs/${job._id}/parts-request`}>
                      <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5 gap-2">
                        <PenTool className="h-4 w-4" /> Request Spare Parts
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="space-y-2 border-t pt-4">
                  <Label htmlFor={`notes-${job._id}`}>Repair Progress Notes</Label>
                  <Input 
                    id={`notes-${job._id}`}
                    placeholder="Describe diagnostic results or work done..." 
                    className="bg-background/40 border-primary/10"
                    onChange={(e) => setRepairNotes({ ...repairNotes, [job._id]: e.target.value })}
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary mt-1"
                    onClick={() => updateRepairMutation.mutate({ jobId: job._id, notes: repairNotes[job._id] })}
                  >
                    Save Notes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Labor History Summary */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            My Labor Stats
          </h3>
          <Card className="glass-morphism border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Logged Hours (This Week)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">32.5h</div>
              <p className="text-xs text-muted-foreground mt-1 text-emerald-600 font-medium">+2.1h over target</p>
            </CardContent>
            <CardFooter className="pt-0 pb-4">
               <div className="w-full h-1 bg-primary/10 rounded-full overflow-hidden">
                 <div className="h-full bg-primary w-[80%]" />
               </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
