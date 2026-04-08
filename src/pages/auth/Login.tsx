import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import api from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Mail, ShieldCheck, Wrench, ChevronRight, Settings, Globe } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      toast.success(`Welcome back, ${response.data.user.name}`);
      login(response.data.token, response.data.user);
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F8FAFC] relative overflow-hidden">

      {/* --- BACKGROUND DECORATION --- */}
      {/* Subtle Blueprint Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} />

      {/* Soft Ambient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-200/30 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px]" />

      {/* --- LOGIN CARD --- */}
      <Card className="w-full max-w-[440px] bg-white/80 backdrop-blur-md border-white border-[6px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden relative z-10">

        {/* Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />

        <CardHeader className="text-center pt-12 pb-6">
          <div className="mx-auto w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 border border-orange-100 shadow-sm">
            <Wrench className="h-8 w-8 text-orange-600" />
          </div>

          <div className="space-y-1">
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
              GADAL <span className="text-orange-600 font-black">TECHNOLOGIES</span>
            </CardTitle>
            <CardDescription className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 pt-1">
              Inventory Management System
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-10 pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Work Email</Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@gadal.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-50 border-slate-200 h-14 pl-12 rounded-xl text-slate-900 placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-200 transition-all border"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <Label htmlFor="password" text-slate-500 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Access Password</Label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-50 border-slate-200 h-14 pl-12 rounded-xl text-slate-900 placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-200 transition-all border"
                />
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-14 text-sm font-bold rounded-xl bg-slate-900 hover:bg-orange-600 text-white shadow-lg shadow-slate-200 transition-all duration-300 hover:shadow-orange-200 mt-2"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2 w-full">
                  Sign In to Dashboard
                  <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="pb-10 pt-0 flex flex-col items-center">
          <div className="flex items-center gap-2 text-slate-400 mb-6">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-[10px] font-medium tracking-wide">Encrypted Session</span>
          </div>

          <div className="grid grid-cols-3 gap-8 w-full px-10 pt-6 border-t border-slate-100">
            <div className="flex flex-col items-center gap-1">
              <Settings className="h-4 w-4 text-slate-300" />
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Support</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-x border-slate-100">
              <Globe className="h-4 w-4 text-slate-300" />
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Global</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-orange-600 tracking-tighter italic">V.2.0</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Version</span>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Footer Copyright */}
      <p className="absolute bottom-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
        &copy; {new Date().getFullYear()} Gadal Technologies PLC. All Rights Reserved.
      </p>
    </div>
  );
}