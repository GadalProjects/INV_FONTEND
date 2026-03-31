import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronLeft, 
  Truck, 
  User as UserIcon, 
  Calendar, 
  Clock, 
  Settings,
  Package,
  CheckCircle2
} from "lucide-react";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: job, isLoading } = useQuery({
    queryKey: ['job-details', id],
    queryFn: async () => {
      const resp = await api.get(`/jobs/${id}`);
      return resp.data;
    },
  });

  if (isLoading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading job particulars...</div>;
  if (!job) return <div className="p-8 text-center text-destructive">Job Card not found.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight">{job.jobCardID}</h2>
            <Badge className={cnStatus(job.status)}>{job.status.replace('_', ' ')}</Badge>
          </div>
          <p className="text-muted-foreground">Detailed history and current progress of vehicle maintenance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Info Cards */}
        <Card className="glass-morphism border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 opacity-70">
              <Truck className="h-4 w-4" /> Vehicle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{job.vehicle.make} {job.vehicle.model}</div>
            <p className="text-sm text-muted-foreground">{job.vehicle.plateNumber}</p>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 opacity-70">
              <UserIcon className="h-4 w-4" /> Personnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{job.assignedTechnician?.name || 'Unassigned'}</div>
            <p className="text-sm text-muted-foreground">Technician in charge</p>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-primary/10">
          <CardHeader className="pb-3 border-b border-primary/5">
            <CardTitle className="text-sm font-medium flex items-center gap-2 opacity-70">
              <Calendar className="h-4 w-4" /> Key Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
             <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Received:</span>
                <span>{new Date(job.createdAt).toLocaleDateString()}</span>
             </div>
             <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Last Update:</span>
                <span>{new Date(job.updatedAt).toLocaleDateString()}</span>
             </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-primary/5 p-1 rounded-xl glass-morphism border border-primary/10">
          <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Overview</TabsTrigger>
          <TabsTrigger value="labor" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Labor Logs</TabsTrigger>
          <TabsTrigger value="parts" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Spare Parts</TabsTrigger>
          <TabsTrigger value="qc" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">QC & Checklist</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6 animate-in slide-in-from-top-2">
           <Card className="glass-morphism border-primary/10">
              <CardHeader>
                 <CardTitle className="text-lg flex items-center gap-2"><Settings className="h-5 w-5 text-primary" /> Work Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Findings / Diagnosis</h4>
                    <p className="text-base leading-relaxed bg-primary/5 p-4 rounded-xl border border-primary/5 italic">
                       {job.findings || "Initial diagnosis pending inspector review."}
                    </p>
                 </div>
                 <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Repair Manual Notes</h4>
                    <p className="text-base leading-relaxed">
                       {job.repairNotes || "Technician has not provided progress notes yet."}
                    </p>
                 </div>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="labor" className="mt-6 animate-in slide-in-from-top-2">
           <Card className="glass-morphism border-primary/10 overflow-hidden">
              <Table>
                 <TableHeader className="bg-primary/5">
                    <TableRow>
                       <TableHead>Technician</TableHead>
                       <TableHead>Clock In</TableHead>
                       <TableHead>Clock Out</TableHead>
                       <TableHead className="text-right">Duration</TableHead>
                    </TableRow>
                 </TableHeader>
                 <TableBody>
                    {job.laborLogs?.length === 0 ? (
                       <TableRow><TableCell colSpan={4} className="text-center py-8 opacity-50 italic">No labor recorded yet.</TableCell></TableRow>
                    ) : (
                       job.laborLogs?.map((log: any) => (
                          <TableRow key={log._id}>
                             <TableCell className="font-medium">{log.technician?.name}</TableCell>
                             <TableCell>{new Date(log.startTime).toLocaleString()}</TableCell>
                             <TableCell>{log.endTime ? new Date(log.endTime).toLocaleString() : <Badge variant="outline" className="animate-pulse bg-emerald-50 text-emerald-600">Active</Badge>}</TableCell>
                             <TableCell className="text-right font-mono font-bold text-primary">{log.durationHours?.toFixed(1) || '0.0'}h</TableCell>
                          </TableRow>
                       ))
                    )}
                 </TableBody>
              </Table>
              <div className="p-6 bg-primary/5 border-t border-primary/10 flex justify-between items-center">
                 <span className="font-semibold text-muted-foreground uppercase tracking-widest text-xs">Accumulated Labor Time</span>
                 <span className="text-2xl font-black text-primary flex items-center gap-2"><Clock className="h-5 w-5" /> {job.totalLaborHours?.toFixed(1)} Hours Total</span>
              </div>
           </Card>
        </TabsContent>

        <TabsContent value="parts" className="mt-6 animate-in slide-in-from-top-2">
           <Card className="glass-morphism border-primary/10 overflow-hidden">
              <Table>
                 <TableHeader className="bg-primary/5">
                    <TableRow>
                       <TableHead>Part Name</TableHead>
                       <TableHead className="text-center">Qty</TableHead>
                       <TableHead>Status</TableHead>
                       <TableHead className="text-right">Unit Cost</TableHead>
                       <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                 </TableHeader>
                 <TableBody>
                    {job.partsRequested?.length === 0 ? (
                       <TableRow><TableCell colSpan={5} className="text-center py-8 opacity-50 italic">No spare parts requested yet.</TableCell></TableRow>
                    ) : (
                       job.partsRequested?.map((part: any) => (
                          <TableRow key={part._id}>
                             <TableCell className="font-medium flex items-center gap-2"><Package className="h-4 w-4 opacity-50" /> {part.name}</TableCell>
                             <TableCell className="text-center">{part.quantity}</TableCell>
                             <TableCell><Badge variant="outline">{part.status}</Badge></TableCell>
                             <TableCell className="text-right">${part.costAtTimeOfIssuance?.toFixed(2) || '0.00'}</TableCell>
                             <TableCell className="text-right font-bold">${((part.costAtTimeOfIssuance || 0) * part.quantity).toFixed(2)}</TableCell>
                          </TableRow>
                       ))
                    )}
                 </TableBody>
              </Table>
              <div className="p-6 bg-amber-500/5 border-t border-amber-500/10 flex justify-between items-center">
                 <span className="font-semibold text-muted-foreground uppercase tracking-widest text-xs">Total Parts Value</span>
                 <span className="text-2xl font-black text-amber-600">${job.totalPartsCost?.toFixed(2)} USD</span>
              </div>
           </Card>
        </TabsContent>

        <TabsContent value="qc" className="mt-6 animate-in slide-in-from-top-2">
           <Card className="glass-morphism border-primary/10 p-12 text-center">
              {job.isQCComplete ? (
                 <div className="space-y-4">
                    <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner shadow-emerald-200">
                       <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-700">Repair Signed-off</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">This job has passed all quality checks and is cleared for final settlement.</p>
                 </div>
              ) : (
                 <div className="space-y-4 opacity-70">
                    <div className="h-20 w-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                       <ClipboardIcon className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-semibold">QC Review Pending</h3>
                    <p className="text-muted-foreground">The inspector must verify the repair quality before closure.</p>
                 </div>
              )}
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function cnStatus(status: string) {
  switch (status) {
    case 'RECEIVED': return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case 'IN_REPAIR': return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case 'IN_QC': return "bg-purple-500/10 text-purple-600 border-purple-500/20";
    case 'CLOSED': return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    default: return "bg-gray-500/10 text-gray-600 border-gray-500/20";
  }
}

function ClipboardIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  )
}
