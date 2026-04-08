import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ArrowLeft, Package, Sparkles, ShoppingCart, Send } from "lucide-react";
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

export default function PartRequest() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const [parts, setParts] = useState([{ name: "", quantity: 1 }]);

  const addPart = () => setParts([...parts, { name: "", quantity: 1 }]);
  const removePart = (index: number) => setParts(parts.filter((_, i) => i !== index));

  const updatePart = (index: number, field: string, value: string | number) => {
    const newParts = [...parts];
    (newParts[index] as any)[field] = value;
    setParts(newParts);
  };

  const mutation = useMutation({
    mutationFn: (data: { jobId: string, items: typeof parts }) => api.post("/parts/request", data),
    onSuccess: () => {
      toast.success("Logistics protocol initiated. Parts requisitioned.");
      navigate(`/jobs/${jobId}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Requisition failed. Check supply chain linkage.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId) return;
    mutation.mutate({ jobId, items: parts });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-primary/10">
        <div className="flex items-center gap-8">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate(-1)} 
            className="h-16 w-16 rounded-2xl bg-card/40 backdrop-blur-xl transition-all duration-500 hover:scale-110 hover:glow-primary border-primary/20 shadow-2xl group"
          >
            <ArrowLeft className="h-6 w-6 text-primary group-hover:-translate-x-1 transition-transform" />
          </Button>
          <div className="space-y-2">
            <h2 className="text-5xl font-black tracking-tight text-foreground drop-shadow-2xl">Hardware Requisition</h2>
            <p className="text-primary text-xl font-black uppercase tracking-[0.2em] opacity-60 italic">mission phase 3b: logistics & supply procurement</p>
          </div>
        </div>
        <div className="flex items-center gap-5 bg-accent/10 px-8 py-4 rounded-3xl border border-accent/20 shadow-glow-accent">
           <Package className="h-5 w-5 text-accent animate-bounce" />
           <span className="text-sm font-black uppercase tracking-[0.3em] text-accent italic">Job Asset: {jobId}</span>
        </div>
      </div>

      <Card className="bg-card/20 backdrop-blur-3xl border-primary/10 shadow-2xl overflow-hidden rounded-[3.5rem] relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />
        <CardHeader className="p-12 border-b border-primary/10 relative z-10">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-foreground shadow-glow border border-primary/20">
              <ShoppingCart className="h-8 w-8" />
            </div>
            <div>
              <CardTitle className="text-3xl font-black text-foreground tracking-tighter">Inventory Manifest</CardTitle>
              <CardDescription className="text-xl font-bold text-foreground/40 italic mt-1">Deploy required hardware assets for restoration protocols.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-12 relative z-10">
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="space-y-8">
              {parts.map((part, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-8 items-end p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 group transition-all duration-500 hover:bg-primary/[0.08] hover:border-primary/30 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex-1 space-y-4 w-full relative z-10">
                    <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary ml-1 neon-text-primary">Component Designation</Label>
                    <Input 
                      placeholder="e.g. ULTRA-STURDY HYDRAULIC VALVE"
                      value={part.name}
                      onChange={(e) => updatePart(index, 'name', e.target.value)}
                      required
                      className="h-16 bg-primary/5 border-primary/10 rounded-2xl font-black text-foreground px-8 focus:ring-primary/20 focus:border-primary/40 transition-all text-lg placeholder:text-foreground/10"
                    />
                  </div>
                  <div className="w-full md:w-40 space-y-4 relative z-10">
                    <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-accent ml-1 text-center block neon-text-accent">Load Unit</Label>
                    <Input 
                      type="number" 
                      min="1"
                      value={part.quantity}
                      onChange={(e) => updatePart(index, 'quantity', parseInt(e.target.value))}
                      required
                      className="h-16 bg-primary/5 border-primary/10 rounded-2xl font-black text-foreground text-center focus:ring-accent/20 focus:border-accent/40 transition-all text-2xl"
                    />
                  </div>
                  <div className="pb-2 relative z-10">
                    {parts.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removePart(index)}
                        className="h-14 w-14 rounded-2xl text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20 shadow-2xl"
                      >
                        <Trash2 className="h-6 w-6" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full h-20 border-dashed border-2 border-primary/10 rounded-[2.5rem] text-primary font-black uppercase tracking-[0.3em] text-[10px] hover:bg-primary/10 hover:border-primary/30 transition-all duration-500 gap-4 group"
              onClick={addPart}
            >
              <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-500" />
              IDENTIFY ADDITIONAL HARDWARE UNIT
            </Button>

            <div className="pt-12 border-t border-primary/10 flex flex-col md:flex-row gap-8">
              <Button 
                type="submit" 
                className="flex-1 text-[11px] font-black uppercase tracking-[0.3em] h-20 rounded-[2rem] bg-gradient-to-r from-primary to-accent text-foreground shadow-glow hover:scale-[1.03] active:scale-[0.97] transition-all duration-500 border border-primary/20 gap-4"
                disabled={mutation.isPending}
              >
                <Send className={cn("h-5 w-5", mutation.isPending && "animate-ping")} />
                {mutation.isPending ? "TRANSMITTING DATA..." : "INITIALIZE REQUISITION DATA"}
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                className="h-20 rounded-[2rem] px-12 font-black uppercase tracking-[0.3em] text-[11px] text-foreground/30 hover:text-foreground/80 hover:bg-primary/5 transition-all"
                onClick={() => navigate(-1)}
              >
                ABORT PROTOCOL
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-10">
         <div className="flex gap-6 p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-1 h-full bg-accent animate-pulse" />
            <Sparkles className="h-8 w-8 text-accent shrink-0" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 leading-relaxed italic">
               <span className="text-accent underline">Encrypted Transmission</span>: All requisition maneuvers are logged into the workshop's immutable ledger with dual-factor cryptographic validation.
            </p>
         </div>
      </div>
    </div>
  );
}
