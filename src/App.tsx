import { lazy, Suspense } from "react";
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
import LibraryDiscounts from "./pages/admin/LibraryDiscounts";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";

const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));

import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

// Prefetch libraries so data is ready before user sees the page
queryClient.prefetchQuery({
  queryKey: ["libraries"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("libraries")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data;
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <SplashScreen />
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
              <Route path="library-discounts" element={<LibraryDiscounts />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
