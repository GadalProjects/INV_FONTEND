import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/client';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronLeft, 
  Truck, 
  User as UserIcon, 
  Clock, 
  Settings,
  Package,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  History,
  Wrench
} from "lucide-react";
import { cn } from '@/lib/utils';

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

  if (isLoading) return (
     <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
       <div className="h-16 w-16 border-8 border-primary/20 border-t-primary rounded-full animate-spin" />
       <div className="text-center">
          <p className="text-2xl font-black tracking-tighter animate-pulse">Retrieving Asset Lifecycle...</p>
          <p className="text-muted-foreground italic text-sm">Querying workshop database...</p>
       </div>
     </div>
  );
  
  if (!job) return (
     <div className="p-20 text-center space-y-4">
        <ShieldAlert className="h-20 w-20 text-destructive mx-auto" />
        <h2 className="text-3xl font-black">Digital Token Invalid</h2>
        <p className="text-muted-foreground italic">The requested Job Card ID did not return a valid asset record.</p>
        <Button onClick={() => navigate('/')} variant="outline" className="rounded-2xl px-10">Back to Base</Button>
     </div>
  );

  const steps = [
     { id: 'RECEIVED', label: 'Intake', icon: Truck },
     { id: 'ACTIVE', label: 'Service', icon: Wrench },
     { id: 'QC', label: 'Quality', icon: ShieldCheck },
     { id: 'CLOSED', label: 'Finalized', icon: CheckCircle2 }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === job.status);

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header & Navigation */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8 justify-between">
         <div className="flex items-center gap-8">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="h-16 w-16 rounded-2xl bg-card/40 backdrop-blur-xl transition-all duration-500 hover:scale-110 hover:glow-primary border-primary/20 shadow-2xl">
               <ChevronLeft className="h-8 w-8 text-primary" />
            </Button>
            <div>
               <div className="flex items-center gap-5">
                  <h1 className="text-6xl font-black tracking-tighter text-foreground drop-shadow-2xl">{job.jobCardID}</h1>
                  <Badge className={cn(
                    "px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border-2 shadow-glow",
                    cnStatus(job.status)
                  )}>
                    {job.status.replace('_', ' ')}
                  </Badge>
               </div>
               <p className="text-primary mt-3 text-xl font-black uppercase tracking-[0.2em] opacity-60 italic">mission profile: asset intelligence panel</p>
            </div>
         </div>
         <div className="flex items-center gap-4 animate-in slide-in-from-right-8 duration-1000">
            <Button className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest gap-4 shadow-[0_0_30px_rgba(var(--primary),0.3)] bg-gradient-to-r from-primary to-accent text-foreground hover:scale-105 transition-all duration-500 border-none">
               Update Protocol <ArrowRight className="h-5 w-5" />
            </Button>
         </div>
      </div>

      {/* Lifecycle Stepper */}
      <Card className="bg-card/20 backdrop-blur-3xl border-primary/10 p-10 rounded-[3rem] shadow-2xl overflow-hidden relative group">
         <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />
         <div className="relative flex justify-between items-center max-w-5xl mx-auto">
            <div className="absolute left-10 right-10 h-1.5 bg-primary/10 top-1/2 -translate-y-1/2 -z-10 rounded-full" />
            <div className="absolute left-10 h-1.5 bg-gradient-to-r from-primary via-accent to-emerald-400 top-1/2 -translate-y-1/2 -z-10 transition-all duration-1000 shadow-[0_0_15px_rgba(var(--primary),0.5)] rounded-full" style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }} />
            
            {steps.map((step, i) => {
               const isCompleted = i < currentStepIndex;
               const isCurrent = i === currentStepIndex;
               return (
                  <div key={step.id} className="flex flex-col items-center gap-4 group/step">
                     <div className={cn(
                        "h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-700 border-2 relative",
                        isCompleted ? "bg-primary border-primary text-foreground shadow-[0_0_20px_rgba(var(--primary),0.4)] scale-110" : 
                        isCurrent ? "bg-primary/20 border-primary text-primary shadow-[0_0_30px_rgba(var(--primary),0.6)] scale-125 z-10" : 
                        "bg-primary/5 border-primary/10 text-foreground/20 group-hover/step:border-primary/40"
                     )}>
                        <step.icon className={cn("h-7 w-7", isCurrent && "animate-pulse")} />
                        {isCurrent && <div className="absolute -inset-2 bg-primary/20 rounded-3xl blur-xl animate-pulse -z-10" />}
                     </div>
                     <span className={cn(
                        "text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500",
                        (isCompleted || isCurrent) ? "text-foreground opacity-100" : "text-foreground/20"
                     )}>{step.label}</span>
                  </div>
               );
            })}
         </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
         {/* Sidebar Stats */}
         <div className="space-y-8">
            <Card className="bg-card/30 backdrop-blur-3xl border-primary/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               <CardHeader className="p-0 mb-8">
                  <div className="flex items-center gap-4">
                     <div className="p-3 rounded-2xl bg-primary/20 text-primary glow-primary border border-primary/20">
                        <Truck className="h-6 w-6" />
                     </div>
                     <CardTitle className="text-lg font-black uppercase tracking-[0.2em] text-foreground/80">Asset Registry</CardTitle>
                  </div>
               </CardHeader>
               <div className="space-y-6">
                  <div className="p-6 rounded-[1.5rem] bg-primary/5 border border-primary/5 hover:border-primary/20 transition-colors">
                     <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 opacity-60">Vehicle Configuration</p>
                     <p className="text-2xl font-black text-foreground tracking-tight">{job.vehicle.make} <span className="text-primary italic">/</span> {job.vehicle.vehicleModel}</p>
                  </div>
                  <div className="p-6 rounded-[1.5rem] bg-primary/5 border border-primary/5 hover:border-primary/20 transition-colors">
                     <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 opacity-60">Identification Markings</p>
                     <p className="text-2xl font-black text-foreground tracking-widest uppercase italic">{job.vehicle.plateNumber}</p>
                  </div>
                  <div className="p-6 rounded-[1.5rem] bg-primary/5 border border-primary/5 hover:border-primary/20 transition-colors">
                     <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 opacity-60">Chassis Sequence</p>
                     <p className="text-sm font-mono font-black text-foreground/60 truncate tracking-widest">{job.vehicle.vin}</p>
                  </div>
               </div>
            </Card>

            <Card className="bg-gradient-to-br from-accent/20 to-transparent backdrop-blur-3xl border-accent/20 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent)]" />
               <CardHeader className="p-0 mb-8">
                  <div className="flex items-center gap-4">
                     <div className="p-3 rounded-2xl bg-accent/20 text-accent glow-accent border border-accent/20">
                        <UserIcon className="h-6 w-6" />
                     </div>
                     <CardTitle className="text-lg font-black uppercase tracking-[0.2em] text-foreground/80">Operations Lead</CardTitle>
                  </div>
               </CardHeader>
               <div className="flex items-center gap-5 relative z-10">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent to-emerald-600 flex items-center justify-center text-foreground text-2xl font-black shadow-2xl shadow-accent/40 rotate-3 group-hover:rotate-0 transition-transform duration-500 border-2 border-primary/20">
                     {job.assignedTechnician?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                     <p className="font-black text-2xl text-foreground tracking-tighter leading-tight">{job.assignedTechnician?.name || 'In-Queue'}</p>
                     <p className="text-[10px] uppercase font-black tracking-[0.3em] text-accent mt-1 opacity-80">Designated Technician</p>
                  </div>
               </div>
            </Card>
         </div>

         {/* Main content area */}
         <div className="lg:col-span-3 space-y-10">
            <Tabs defaultValue="overview" className="w-full">
               <TabsList className="bg-primary/5 p-2 rounded-3xl glass-morphism border border-primary/10 h-20 w-full shadow-2xl">
                 <TabsTrigger value="overview" className="rounded-2xl flex-1 h-full text-[10px] font-black uppercase tracking-[0.3em] data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-foreground data-[state=active]:shadow-2xl transition-all duration-500 border border-transparent data-[state=active]:border-primary/20">Mission Log</TabsTrigger>
                 <TabsTrigger value="labor" className="rounded-2xl flex-1 h-full text-[10px] font-black uppercase tracking-[0.3em] data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-foreground data-[state=active]:shadow-2xl transition-all duration-500 border border-transparent data-[state=active]:border-primary/20">Chronometer</TabsTrigger>
                 <TabsTrigger value="parts" className="rounded-2xl flex-1 h-full text-[10px] font-black uppercase tracking-[0.3em] data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-foreground data-[state=active]:shadow-2xl transition-all duration-500 border border-transparent data-[state=active]:border-primary/20">Hardware</TabsTrigger>
                 <TabsTrigger value="qc" className="rounded-2xl flex-1 h-full text-[10px] font-black uppercase tracking-[0.3em] data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-foreground data-[state=active]:shadow-2xl transition-all duration-500 border border-transparent data-[state=active]:border-primary/20">Compliance</TabsTrigger>
               </TabsList>

               <TabsContent value="overview" className="mt-10 space-y-8 animate-in fade-in-0 zoom-in-95 duration-700 outline-none">
                  <Card className="bg-card/20 backdrop-blur-3xl border-primary/5 rounded-[3rem] overflow-hidden shadow-2xl">
                     <div className="p-12 space-y-12">
                        <section className="relative group/section">
                           <div className="absolute -left-12 -top-12 h-24 w-24 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover/section:opacity-100 transition-opacity" />
                           <h4 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6">
                              <History className="h-4 w-4" /> Diagnostic Findings & Initial Data
                           </h4>
                           <div className="relative pl-10">
                              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary to-transparent rounded-full glow-primary" />
                              <p className="text-3xl font-black text-foreground/90 leading-[1.4] tracking-tight italic">
                                 "{job.findings || "Workshop personnel are awaiting the diagnostic phase initiation command."}"
                              </p>
                           </div>
                        </section>

                        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

                        <section className="relative group/section">
                           <div className="absolute -left-12 -top-12 h-24 w-24 bg-accent/5 rounded-full blur-3xl opacity-0 group-hover/section:opacity-100 transition-opacity" />
                           <h4 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-6">
                              <Settings className="h-4 w-4" /> Recommended Technical Countermeasures
                           </h4>
                           <p className="text-xl font-bold text-foreground/60 leading-relaxed pl-10 border-l-4 border-accent/20 border-dotted">
                              {job.repairNotes || "Technical specialists have not yet documented the specific mechanical procedures required."}
                           </p>
                        </section>
                     </div>
                  </Card>
               </TabsContent>

               <TabsContent value="labor" className="mt-10 animate-in fade-in-0 slide-in-from-top-6 duration-700">
                  <Card className="bg-card/20 backdrop-blur-3xl border-primary/5 rounded-[3rem] overflow-hidden shadow-2xl">
                     <Table>
                        <TableHeader>
                           <TableRow className="bg-primary/5 border-primary/5 hover:bg-primary/5">
                              <TableHead className="px-12 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-primary">Personnel Unit</TableHead>
                              <TableHead className="py-8 text-[11px] font-black uppercase tracking-[0.3em] text-primary">Operational Window</TableHead>
                              <TableHead className="py-8 text-[11px] font-black uppercase tracking-[0.3em] text-right px-12 text-primary">Efficiency</TableHead>
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                           {job.laborLogs?.length === 0 ? (
                              <TableRow><TableCell colSpan={3} className="text-center py-32 opacity-20 italic text-xl font-black uppercase tracking-widest">Zero labor metrics detected.</TableCell></TableRow>
                           ) : (
                              job.laborLogs?.map((log: any) => (
                                 <TableRow key={log._id} className="border-primary/5 hover:bg-primary/[0.03] transition-colors group">
                                    <TableCell className="px-12 py-8">
                                       <div className="flex items-center gap-4">
                                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20">
                                             {log.technician?.name?.charAt(0)}
                                          </div>
                                          <span className="font-black text-xl text-foreground group-hover:text-primary transition-colors">{log.technician?.name}</span>
                                       </div>
                                    </TableCell>
                                    <TableCell className="py-8">
                                       <div className="flex items-center gap-4 text-sm font-black text-foreground/40 tracking-widest">
                                          <span className="bg-primary/5 px-4 py-1.5 rounded-lg border border-primary/5">{new Date(log.startTime).toLocaleTimeString()}</span>
                                          <ArrowRight className="h-4 w-4 text-primary opacity-50" />
                                          <span className="bg-primary/5 px-4 py-1.5 rounded-lg border border-primary/5">
                                             {log.endTime ? new Date(log.endTime).toLocaleTimeString() : <Badge className="bg-emerald-500 text-foreground animate-pulse rounded-full px-5 py-1 font-black text-[9px] tracking-[0.2em] border-none shadow-glow">ACTIVE SESSION</Badge>}
                                          </span>
                                       </div>
                                    </TableCell>
                                    <TableCell className="text-right px-12 py-8">
                                       <span className="text-4xl font-black text-foreground tracking-tighter drop-shadow-lg">{log.durationHours?.toFixed(1) || '0.0'}<span className="text-lg text-primary opacity-40 ml-1">H</span></span>
                                    </TableCell>
                                 </TableRow>
                              ))
                           )}
                        </TableBody>
                     </Table>
                     <div className="p-12 bg-primary/[0.05] border-t border-primary/5 flex justify-between items-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-primary glow-primary" />
                        <div className="z-10">
                           <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">Total Unit Allocation</p>
                           <p className="text-7xl font-black text-foreground tracking-tighter drop-shadow-2xl">{job.totalLaborHours?.toFixed(1)} <span className="text-2xl text-primary opacity-40 italic ml-2">METRIC HOURS</span></p>
                        </div>
                        <Button variant="outline" className="h-16 rounded-[1.25rem] gap-4 font-black uppercase tracking-widest px-10 border-primary/10 hover:bg-primary/5 transition-all text-sm group text-foreground">
                           <Clock className="h-5 w-5 text-primary group-hover:scale-125 transition-transform" /> Detailed History
                        </Button>
                     </div>
                  </Card>
               </TabsContent>

               <TabsContent value="parts" className="mt-10 animate-in fade-in-0 slide-in-from-top-6 duration-700">
                  <Card className="bg-card/20 backdrop-blur-3xl border-primary/5 rounded-[3rem] overflow-hidden shadow-2xl">
                     <Table>
                        <TableHeader>
                           <TableRow className="bg-primary/5 border-primary/5 hover:bg-primary/5">
                              <TableHead className="px-12 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-accent">Component Identifier</TableHead>
                              <TableHead className="py-8 text-[11px] font-black uppercase tracking-[0.3em] text-accent text-center">Unit Load</TableHead>
                              <TableHead className="py-8 text-[11px] font-black uppercase tracking-[0.3em] text-right px-12 text-accent">Value Proj.</TableHead>
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                           {job.partsRequested?.length === 0 ? (
                              <TableRow><TableCell colSpan={3} className="text-center py-32 opacity-20 italic text-xl font-black uppercase tracking-widest">Hardware inventory untouched.</TableCell></TableRow>
                           ) : (
                               job.partsRequested?.map((part: any) => (
                                 <TableRow key={part._id} className="border-primary/5 hover:bg-primary/[0.03] group transition-all">
                                    <TableCell className="px-12 py-8">
                                       <div className="flex items-center gap-5">
                                          <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent glow-accent border border-accent/20 group-hover:rotate-12 transition-all">
                                             <Package className="h-6 w-6" />
                                          </div>
                                          <div className="flex flex-col">
                                             <span className="font-black text-xl text-foreground group-hover:text-accent transition-colors">{part.name}</span>
                                             <span className="text-[10px] font-bold text-foreground/30 tracking-widest uppercase mt-1">Ref ID: {part._id.slice(-8).toUpperCase()}</span>
                                          </div>
                                       </div>
                                    </TableCell>
                                    <TableCell className="py-8 text-center">
                                       <span className="bg-accent/5 px-6 py-2 rounded-2xl font-black text-2xl text-accent border border-accent/10 shadow-inner">× {part.quantity}</span>
                                    </TableCell>
                                    <TableCell className="text-right px-12 py-8">
                                       <span className="text-3xl font-black text-foreground tracking-tighter drop-shadow-lg">${((part.costAtTimeOfIssuance || 0) * part.quantity).toLocaleString()}</span>
                                    </TableCell>
                                 </TableRow>
                              ))
                           )}
                        </TableBody>
                     </Table>
                     <div className="p-12 bg-accent/[0.05] border-t border-primary/5 flex justify-between items-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-2 h-full bg-accent glow-accent" />
                        <div className="z-10">
                           <p className="text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-2">Total Supply Liquidity</p>
                           <p className="text-7xl font-black text-foreground tracking-tighter drop-shadow-2xl">${job.totalPartsCost?.toLocaleString()} <span className="text-2xl text-accent opacity-40 italic ml-2">USD CURRENCY</span></p>
                        </div>
                        <Button className="h-16 rounded-[1.25rem] gap-4 font-black uppercase tracking-widest px-10 bg-accent hover:bg-emerald-600 text-foreground shadow-2xl transition-all text-sm group border-none">
                           <Package className="h-5 w-5 group-hover:translate-y-[-2px] transition-transform" /> Requisition Asset
                        </Button>
                     </div>
                  </Card>
               </TabsContent>

               <TabsContent value="qc" className="mt-10 animate-in fade-in-0 duration-1000">
                  <Card className="bg-card/20 backdrop-blur-3xl border-primary/5 rounded-[4rem] p-32 text-center relative overflow-hidden group">
                     {/* Background Glow */}
                     <div className={cn(
                        "absolute -inset-20 blur-[100px] opacity-20 transition-all duration-1000 group-hover:opacity-40",
                        job.isQCComplete ? "bg-emerald-500" : "bg-primary"
                     )} />
                     
                     {job.isQCComplete ? (
                        <div className="space-y-10 relative z-10">
                           <div className="h-40 w-40 bg-gradient-to-br from-emerald-400 to-emerald-700 text-foreground rounded-[3rem] flex items-center justify-center mx-auto shadow-[0_0_80px_rgba(16,185,129,0.3)] rotate-6 group-hover:rotate-0 transition-transform duration-700 border-4 border-primary/20">
                              <CheckCircle2 className="h-20 w-20 drop-shadow-2xl" />
                           </div>
                           <div className="space-y-4">
                              <h3 className="text-6xl font-black tracking-tighter text-foreground">System Integrity Verified</h3>
                              <p className="text-foreground/40 text-2xl font-black uppercase tracking-[0.2em] italic max-w-2xl mx-auto leading-relaxed">Asset cleared for final mission deployment. All mechanical and digital protocols satisfied.</p>
                           </div>
                           <Button className="h-20 px-16 rounded-3xl font-black uppercase tracking-[0.3em] bg-primary text-foreground hover:bg-primary/80 hover:scale-105 transition-all duration-500 shadow-2xl text-sm border-none">Download Compliance Matrix</Button>
                        </div>
                     ) : (
                        <div className="space-y-10 relative z-10 opacity-60 group-hover:opacity-100 transition-opacity">
                           <div className="h-40 w-40 bg-primary/5 text-foreground rounded-[3rem] flex items-center justify-center mx-auto border-4 border-primary/10 border-dashed animate-pulse">
                              <ShieldIcon className="h-20 w-20 opacity-20" />
                           </div>
                           <div className="space-y-4">
                              <h3 className="text-5xl font-black tracking-tighter uppercase text-foreground/80">Pending Quality Audit</h3>
                              <p className="text-primary text-xl font-black uppercase tracking-[0.2em] italic">Workshop operations must terminate before sector verification.</p>
                           </div>
                           <Button disabled className="h-16 px-12 rounded-2xl font-black uppercase tracking-widest bg-primary/5 border border-primary/10 text-foreground/20 cursor-not-allowed">Protocol Locked</Button>
                        </div>
                     )}
                  </Card>
               </TabsContent>
            </Tabs>
         </div>
      </div>

    </div>
  );
}

function cnStatus(status: string) {
  switch (status) {
    case 'RECEIVED': return "bg-blue-500/10 text-blue-500 border-blue-500/10";
    case 'ACTIVE': return "bg-amber-500/10 text-amber-500 border-amber-500/10";
    case 'QC': return "bg-purple-500/10 text-purple-500 border-purple-500/10";
    case 'CLOSED': return "bg-emerald-500/10 text-emerald-500 border-emerald-500/10";
    default: return "bg-gray-500/10 text-gray-500 border-gray-500/10";
  }
}


function ShieldCheck(props: any) {
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
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function ShieldIcon(props: any) {
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
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  )
}
