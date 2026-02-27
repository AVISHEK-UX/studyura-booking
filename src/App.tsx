import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import LibraryDetail from "./pages/LibraryDetail";
import Login from "./pages/Login";
import MyBookings from "./pages/MyBookings";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLayout from "./components/admin/AdminLayout";
import AdminGuard from "./components/admin/AdminGuard";
import LibraryEdit from "./pages/admin/LibraryEdit";
import AdminSettings from "./pages/admin/Settings";
import LibraryBookings from "./pages/admin/LibraryBookings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/library/:id" element={<LibraryDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminGuard>
                  <AdminLayout />
                </AdminGuard>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="library/new" element={<LibraryEdit />} />
              <Route path="library/:id/edit" element={<LibraryEdit />} />
              <Route path="library-bookings" element={<LibraryBookings />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
