import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ArrowLeft, Package } from "lucide-react";
import { toast } from 'sonner';

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
      toast.success("Parts request submitted successfully!");
      navigate(`/jobs/${jobId}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit request.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId) return;
    mutation.mutate({ jobId, items: parts });
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Spare Parts Requisition</h2>
      </div>

      <Card className="glass-morphism border-primary/20 shadow-xl">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" /> Request for {jobId}
          </CardTitle>
          <CardDescription>Specify the parts and quantities required for this repair.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {parts.map((part, index) => (
                <div key={index} className="flex gap-4 items-end animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="flex-1 space-y-2">
                    <Label>Part Name / Description</Label>
                    <Input 
                      placeholder="e.g. Oil Filter, Brake Pad"
                      value={part.name}
                      onChange={(e) => updatePart(index, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="w-24 space-y-2">
                    <Label>Qty</Label>
                    <Input 
                      type="number"
                      min="1"
                      value={part.quantity}
                      onChange={(e) => updatePart(index, 'quantity', parseInt(e.target.value))}
                      required
                    />
                  </div>
                  {parts.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removePart(index)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full border-dashed border-primary/40 text-primary hover:bg-primary/5 gap-2"
              onClick={addPart}
            >
              <Plus className="h-4 w-4" /> Add Another Item
            </Button>

            <div className="pt-6 border-t border-primary/10 flex gap-4">
              <Button 
                type="submit" 
                className="flex-1 text-lg h-12 shadow-lg shadow-primary/10"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Submitting..." : "Submit Requisition"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
