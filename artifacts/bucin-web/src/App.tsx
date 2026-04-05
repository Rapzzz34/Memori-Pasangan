import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Kenangan from "@/pages/kenangan";
import Impian from "@/pages/impian";
import Lagu from "@/pages/lagu";
import Diary from "@/pages/diary";
import OwnerPanel from "@/pages/owner";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/kenangan" component={Kenangan} />
      <Route path="/impian" component={Impian} />
      <Route path="/lagu" component={Lagu} />
      <Route path="/diary" component={Diary} />
      <Route path="/owner" component={OwnerPanel} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
