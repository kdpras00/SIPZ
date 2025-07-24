import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Calculator from "@/pages/calculator";
import Infaq from "@/pages/infaq";
import Reports from "@/pages/reports";
import Payments from "@/pages/payments";
import Notifications from "@/pages/notifications";
import Education from "@/pages/education";
import Status from "@/pages/status";
import AdminPanel from "@/pages/admin-panel";

function Router() {
  return (
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
