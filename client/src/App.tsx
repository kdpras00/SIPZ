import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";

// Layout components
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Sidebar } from "@/components/layout/sidebar";

// Pages
import { Landing } from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Calculator from "@/pages/calculator";
import Infaq from "@/pages/infaq";
import Reports from "@/pages/reports";
import Education from "@/pages/education";
import Payments from "@/pages/payments";
import Status from "@/pages/status";
import Notifications from "@/pages/notifications";
import AdminPanel from "@/pages/admin-panel";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Kontak from "@/pages/kontak";
import Program from "@/pages/program";
import Layanan from "@/pages/layanan";
import Berita from "@/pages/berita";
import Tentang from "@/pages/tentang";
import FAQ from "@/pages/faq";

function Router() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Public routes (no authentication required)
  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/kalkulator" component={Calculator} />
          <Route path="/edukasi" component={Education} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/kontak" component={Kontak} />
          <Route path="/program" component={Program} />
          <Route path="/layanan" component={Layanan} />
          <Route path="/berita" component={Berita} />
          <Route path="/tentang" component={Tentang} />
          <Route path="/faq" component={FAQ} />
          <Route component={NotFound} />
        </Switch>
        <Footer />
      </>
    );
  }

  // Authenticated routes with layout
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-950">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/kalkulator" component={Calculator} />
            <Route path="/infaq" component={Infaq} />
            <Route path="/laporan" component={Reports} />
            <Route path="/edukasi" component={Education} />
            <Route path="/pembayaran" component={Payments} />
            <Route path="/status" component={Status} />
            <Route path="/notifikasi" component={Notifications} />
            <Route path="/admin" component={AdminPanel} />
            <Route path="/kontak" component={Kontak} />
            <Route path="/program" component={Program} />
            <Route path="/layanan" component={Layanan} />
            <Route path="/berita" component={Berita} />
            <Route path="/tentang" component={Tentang} />
            <Route path="/faq" component={FAQ} />
            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
