import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Truck, User as UserIcon, ShieldCheck, ClipboardCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VRSForm() {
  const [formData, setFormData] = useState({
    make: "",
    vehicleModel: "",
    plateNumber: "",
    vin: "",
    category: "CV",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });

  const mutation = useMutation({
    mutationFn: (data: typeof formData) => api.post("/jobs/vrs", data),
    onSuccess: () => {
      toast.success("Vehicle Receiving Sheet Created Successfully!");
      setFormData({
        make: "",
        vehicleModel: "",
        plateNumber: "",
        vin: "",
        category: "CV",
        customerName: "",
        customerEmail: "",
        customerPhone: "",
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create VRS. Check if plate/VIN exists.");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
         <div className="space-y-3">
            <h2 className="text-6xl font-black tracking-tighter text-foreground drop-shadow-2xl">Asset Intake Portal</h2>
            <p className="text-primary text-2xl font-black uppercase tracking-[0.2em] opacity-60 italic">Phase 1: Initiate Digital Receipt & Diagnostic Serialization</p>
         </div>
         <div className="h-24 w-24 rounded-[2.5rem] bg-gradient-to-br from-primary to-accent flex items-center justify-center border-2 border-primary/20 text-foreground shadow-glow animate-in zoom-in-50 duration-1000">
            <Truck className="h-12 w-12 drop-shadow-lg" />
         </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-12">
            <Card className="bg-card/20 backdrop-blur-3xl border-primary/10 shadow-2xl overflow-hidden rounded-[4rem] relative">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />
               <div className="grid grid-cols-1 lg:grid-cols-2 relative z-10">
                  <div className="p-12 border-b lg:border-b-0 lg:border-r border-primary/10 space-y-12 bg-primary/[0.02]">
                     <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center shadow-lg border border-primary/20 glow-primary">
                           <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-foreground/90">Asset Identity Matrix</h3>
                     </div>

                     <div className="grid grid-cols-1 gap-8">
                        <div className="space-y-4">
                           <Label htmlFor="make" className="text-[10px] font-black uppercase tracking-[0.4em] text-primary ml-1 neon-text-primary">Manufacturer Designation</Label>
                           <Input 
                              id="make" 
                              value={formData.make} 
                              onChange={handleChange} 
                              placeholder="e.g. ISUZU / CAT / VOLVO" 
                              required 
                              className="h-16 rounded-2xl bg-primary/5 border-primary/10 focus:ring-primary/20 focus:border-primary/40 transition-all font-black text-foreground text-lg placeholder:text-foreground/10" 
                           />
                        </div>
                        
                        <div className="space-y-4">
                           <Label htmlFor="vehicleModel" className="text-[10px] font-black uppercase tracking-[0.4em] text-primary ml-1 neon-text-primary">Series / Model Spec</Label>
                           <Input 
                              id="vehicleModel" 
                              value={formData.vehicleModel} 
                              onChange={handleChange} 
                              placeholder="e.g. FSR 320 / D8-CAT" 
                              required 
                              className="h-16 rounded-2xl bg-primary/5 border-primary/10 focus:ring-primary/20 focus:border-primary/40 transition-all font-black text-foreground text-lg placeholder:text-foreground/10" 
                           />
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                           <div className="space-y-4">
                              <Label htmlFor="plateNumber" className="text-[10px] font-black uppercase tracking-[0.4em] text-primary ml-1 neon-text-primary">License Registry</Label>
                              <Input 
                                 id="plateNumber" 
                                 value={formData.plateNumber} 
                                 onChange={handleChange} 
                                 placeholder="AA-00000" 
                                 required 
                                 className="h-16 rounded-2xl bg-primary/5 border-primary/10 focus:ring-primary/20 focus:border-primary/40 transition-all font-black text-foreground text-xl uppercase tracking-widest placeholder:text-foreground/10" 
                              />
                           </div>
                           <div className="space-y-4">
                              <Label htmlFor="category" className="text-[10px] font-black uppercase tracking-[0.4em] text-primary ml-1 neon-text-primary">Operational Class</Label>
                              <Select 
                                 value={formData.category} 
                                 onValueChange={(val: string | null) => { if(val) setFormData({...formData, category: val}) }}
                              >
                                 <SelectTrigger id="category" className="h-16 rounded-2xl bg-primary/5 border-primary/10 focus:ring-primary/20 focus:border-primary/40 transition-all font-black text-foreground text-lg">
                                    <SelectValue placeholder="Select" />
                                 </SelectTrigger>
                                 <SelectContent className="rounded-2xl backdrop-blur-3xl bg-black/90 border-primary/10 shadow-3xl">
                                    <SelectItem value="CV" className="font-black py-3 focus:bg-primary">Commercial Vehicle (CV)</SelectItem>
                                    <SelectItem value="CE" className="font-black py-3 focus:bg-primary">Construction Equipment (CE)</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <Label htmlFor="vin" className="text-[10px] font-black uppercase tracking-[0.4em] text-primary ml-1 neon-text-primary">Chassis Sequence / VIN-Token</Label>
                           <Input 
                              id="vin" 
                              value={formData.vin} 
                              onChange={handleChange} 
                              placeholder="17-CHARACTER BITRUST IDENTIFIER" 
                              required 
                              className="h-16 rounded-2xl bg-primary/5 border-primary/10 focus:ring-primary/20 focus:border-primary/40 transition-all font-mono font-black text-foreground tracking-[0.2em] placeholder:text-foreground/10" 
                           />
                        </div>
                     </div>
                  </div>

                  <div className="p-12 space-y-12 bg-primary/[0.01]">
                     <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-accent/20 text-accent flex items-center justify-center shadow-lg border border-accent/20 glow-accent">
                           <UserIcon className="h-6 w-6" />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-foreground/90">Entity Engagement</h3>
                     </div>

                     <div className="grid grid-cols-1 gap-8">
                        <div className="space-y-4">
                           <Label htmlFor="customerName" className="text-[10px] font-black uppercase tracking-[0.4em] text-accent ml-1 neon-text-accent">Primary Point of Contact</Label>
                           <Input 
                              id="customerName" 
                              value={formData.customerName} 
                              onChange={handleChange} 
                              placeholder="OPERATIONAL LEAD NAME" 
                              required 
                              className="h-16 rounded-2xl bg-primary/5 border-primary/10 focus:ring-accent/20 focus:border-accent/40 transition-all font-black text-foreground text-lg placeholder:text-foreground/10" 
                           />
                        </div>

                        <div className="space-y-4">
                           <Label htmlFor="customerEmail" className="text-[10px] font-black uppercase tracking-[0.4em] text-accent ml-1 neon-text-accent">Secure Communication Node</Label>
                           <Input 
                              id="customerEmail" 
                              type="email" 
                              value={formData.customerEmail} 
                              onChange={handleChange} 
                              placeholder="COMMUNICATIONS@DOMAIN.TRANS" 
                              className="h-16 rounded-2xl bg-primary/5 border-primary/10 focus:ring-accent/20 focus:border-accent/40 transition-all font-black text-foreground text-lg placeholder:text-foreground/10" 
                           />
                        </div>

                        <div className="space-y-4">
                           <Label htmlFor="customerPhone" className="text-[10px] font-black uppercase tracking-[0.4em] text-accent ml-1 neon-text-accent">Tactical Voice Signal</Label>
                           <Input 
                              id="customerPhone" 
                              value={formData.customerPhone} 
                              onChange={handleChange} 
                              placeholder="+254-SEQUENCE-KEY" 
                              className="h-16 rounded-2xl bg-primary/5 border-primary/10 focus:ring-accent/20 focus:border-accent/40 transition-all font-black text-foreground text-lg tracking-widest placeholder:text-foreground/10" 
                           />
                        </div>

                        <div className="pt-8">
                           <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 relative overflow-hidden group">
                              <div className="absolute top-0 right-0 w-1 h-full bg-accent animate-pulse" />
                              <div className="flex items-center gap-4 mb-4">
                                 <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                                    <ClipboardCheck className="h-5 w-5" />
                                 </div>
                                 <span className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground">Intake Integrity Protocol</span>
                              </div>
                              <p className="text-xs text-foreground/40 leading-[1.8] italic font-bold">
                                 By committing this Digital VRS, you certify that the physical status of the hardware matches the serialized identifiers provided. A high-priority maintenance slot will be allocated post-submission.
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="p-12 bg-primary/[0.04] border-t border-primary/10 flex flex-col lg:flex-row items-center gap-10">
                  <div className="flex-1 space-y-2">
                     <p className="text-3xl font-black text-foreground tracking-tighter uppercase italic">Commit Asset to Workshop</p>
                     <p className="text-primary text-sm font-black uppercase tracking-[0.3em] opacity-60">Authorize digital intake & job-card generation</p>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full lg:w-auto h-20 px-16 rounded-3xl text-sm font-black uppercase tracking-[0.3em] shadow-[0_0_50px_rgba(var(--primary),0.3)] bg-gradient-to-r from-primary to-accent text-foreground hover:scale-[1.05] active:scale-[0.98] transition-all duration-500 border border-primary/20 gap-5"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "GENERATING REQUISITION DATA..." : "INITIATE MAINTENANCE CYCLE"}
                    <ArrowRight className={cn("h-6 w-6", mutation.isPending && "animate-ping")} />
                  </Button>
               </div>
            </Card>
        </div>
      </form>
    </div>
  );
}
