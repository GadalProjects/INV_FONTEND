import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function VRSForm() {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
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
        model: "",
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
    <div className="max-w-4xl mx-auto py-8">
      <Card className="glass-morphism border-primary/20 shadow-xl overflow-hidden">
        <CardHeader className="bg-primary/5 pb-8 border-b border-primary/10">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold text-primary">Vehicle Receiving Sheet (VRS)</CardTitle>
              <CardDescription className="text-base mt-2">Log a new vehicle entry into the system</CardDescription>
            </div>
            <div className="bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Phase 1: Intake</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vehicle Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-l-4 border-primary pl-3">Vehicle Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Input id="make" value={formData.make} onChange={handleChange} placeholder="e.g. Isuzu, CAT" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input id="model" value={formData.model} onChange={handleChange} placeholder="e.g. FSR, 320D" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plateNumber">Plate Number</Label>
                  <Input id="plateNumber" value={formData.plateNumber} onChange={handleChange} placeholder="AA-12345" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(val: string | null) => val && setFormData({...formData, category: val})}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CV">Commercial Vehicle (CV)</SelectItem>
                      <SelectItem value="CE">Construction Equipment (CE)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vin">VIN / Chassis Number</Label>
                <Input id="vin" value={formData.vin} onChange={handleChange} placeholder="17-digit identifier" required />
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-l-4 border-accent pl-3">Customer Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input id="customerName" value={formData.customerName} onChange={handleChange} placeholder="Full name or company" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email Address</Label>
                <Input id="customerEmail" type="email" value={formData.customerEmail} onChange={handleChange} placeholder="customer@email.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerPhone">Phone Number</Label>
                <Input id="customerPhone" value={formData.customerPhone} onChange={handleChange} placeholder="+251 ..." />
              </div>

              <div className="pt-4">
                <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 text-xs text-muted-foreground italic">
                  Note: Upon submission, a unique Job Card ID will be generated and the status will move to 'Received'.
                </div>
              </div>
            </div>

            <div className="md:col-span-2 pt-6 border-t border-primary/10 mt-4">
              <Button 
                type="submit" 
                className="w-full text-lg h-14 shadow-xl shadow-primary/20 transition-all hover:scale-[1.01]"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Creating Job Card..." : "Create Digital VRS & Initiate Job"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
