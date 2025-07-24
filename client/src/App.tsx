import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import { Landing } from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Calculator from "@/pages/calculator";
import Infaq from "@/pages/infaq";
import Reports from "@/pages/reports";
import Payments from "@/pages/payments";
import Notifications from "@/pages/notifications";
import Education from "@/pages/education";
import Status from "@/pages/status";
import AdminPanel from "@/pages/admin-panel";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Memuat...</p>
        </div>
      </div>
    );
  }

  // Public routes (no authentication required)
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/kalkulator" component={Calculator} />
        <Route path="/edukasi" component={Education} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Authenticated routes with layout
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/kalkulator" component={Calculator} />
              <Route path="/infaq" component={Infaq} />
              <Route path="/laporan" component={Reports} />
              <Route path="/pembayaran" component={Payments} />
              <Route path="/notifikasi" component={Notifications} />
              <Route path="/edukasi" component={Education} />
              <Route path="/status" component={Status} />
              <Route path="/admin" component={AdminPanel} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
