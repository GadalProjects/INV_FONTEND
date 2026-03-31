import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from '@/pages/auth/Login';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MasterDashboard from '@/pages/dashboards/MasterDashboard';
import ForemanDashboard from '@/pages/dashboards/ForemanDashboard';
import TechnicianDashboard from '@/pages/dashboards/TechnicianDashboard';
import InspectorDashboard from '@/pages/dashboards/InspectorDashboard';
import FinanceDashboard from '@/pages/dashboards/FinanceDashboard';
import VRSForm from '@/pages/jobs/VRSForm';
import JobDetails from '@/pages/jobs/JobDetails';
import PartRequest from '@/pages/jobs/PartRequest';
import { Toaster } from 'sonner';

// Role-based protection helper
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, isInitialized } = useAuth();

  if (!isInitialized) return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Dashboard Area */}
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<MasterDashboard />} />
          
          <Route path="vrs" element={
            <ProtectedRoute allowedRoles={['RECEIVING']}>
              <VRSForm />
            </ProtectedRoute>
          } />

          <Route path="foreman" element={
            <ProtectedRoute allowedRoles={['FOREMAN']}>
              <ForemanDashboard />
            </ProtectedRoute>
          } />

          <Route path="tech" element={
            <ProtectedRoute allowedRoles={['TECHNICIAN']}>
              <TechnicianDashboard />
            </ProtectedRoute>
          } />

          <Route path="inspection" element={
            <ProtectedRoute allowedRoles={['INSPECTOR']}>
              <InspectorDashboard />
            </ProtectedRoute>
          } />

          <Route path="billing" element={
            <ProtectedRoute allowedRoles={['FINANCE']}>
              <FinanceDashboard />
            </ProtectedRoute>
          } />

          <Route path="jobs/:id" element={
            <ProtectedRoute>
              <JobDetails />
            </ProtectedRoute>
          } />

          <Route path="jobs/:id/parts-request" element={
            <ProtectedRoute allowedRoles={['TECHNICIAN']}>
              <PartRequest />
            </ProtectedRoute>
          } />
          
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
