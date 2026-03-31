import { useQuery } from '@tanstack/react-query';
import api from '@/api/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  ArrowUpRight
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function MasterDashboard() {
  const { user } = useAuth();
  
  const { isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const resp = await api.get('/jobs/stats');
      return resp.data;
    },
  });

  const { data: recentJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['recent-jobs'],
    queryFn: async () => {
      const resp = await api.get('/jobs');
      return resp.data;
    },
  });

  if (statsLoading || jobsLoading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading dashboard insights...</div>;

  const cards = [
    { title: "Total Job Cards", value: recentJobs?.length || 0, icon: ClipboardList, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "In Progress", value: recentJobs?.filter((j: any) => j.status === 'IN_REPAIR').length || 0, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Pending QC", value: recentJobs?.filter((j: any) => j.status === 'PENDING_WORK').length || 0, icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
    { title: "Closed Jobs", value: recentJobs?.filter((j: any) => j.status === 'CLOSED').length || 0, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h2>
        <p className="text-muted-foreground mt-1">Here is what's happening in the garage today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="glass-morphism border-primary/10 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium opacity-70">{card.title}</CardTitle>
              <div className={`${card.bg} p-2 rounded-lg`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                <span>+4% from last week</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-morphism border-primary/10 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between border-b border-primary/5 pb-4">
          <div>
            <CardTitle className="text-xl">Active Job Cards</CardTitle>
            <CardDescription className="mt-1">Real-time status of current workshop activities</CardDescription>
          </div>
          <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary px-3 py-1">Live Updates</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-primary/5">
              <TableRow>
                <TableHead className="w-[150px]">Job Card ID</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentJobs?.map((job: any) => (
                <TableRow key={job._id} className="hover:bg-primary/5 transition-colors cursor-pointer group">
                  <TableCell className="font-mono text-sm font-bold">{job.jobCardID}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{job.vehicle.make} {job.vehicle.model}</div>
                        <div className="text-xs text-muted-foreground">{job.vehicle.plateNumber}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{job.customerName}</TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "border-2 font-semibold",
                      job.status === 'RECEIVED' && "bg-blue-500/10 text-blue-600 border-blue-500/20",
                      job.status === 'IN_REPAIR' && "bg-amber-500/10 text-amber-600 border-amber-500/20",
                      job.status === 'IN_QC' && "bg-purple-500/10 text-purple-600 border-purple-500/20",
                      job.status === 'CLOSED' && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                      !['RECEIVED', 'IN_REPAIR', 'IN_QC', 'CLOSED'].includes(job.status) && "bg-gray-500/10 text-gray-600 border-gray-500/20"
                    )}>
                      {job.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link to={`/jobs/${job._id}`}>
                      <button className="text-sm font-semibold text-primary hover:underline group-hover:scale-105 transition-transform">View Details</button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function CardDescription({ children, className }: { children: React.ReactNode, className?: string }) {
  return <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>;
}
