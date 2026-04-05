import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AudioProvider } from "@/contexts/audio-context";
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
        <AudioProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            {/* Outer: dark bg fills screen on desktop */}
            <div
              className="w-full min-h-screen flex items-start justify-center"
              style={{ background: "hsl(222,50%,4%)" }}
            >
              {/* Phone frame: 430px max, full height */}
              <div
                className="relative flex flex-col w-full"
                style={{
                  maxWidth: 430,
                  minHeight: "100dvh",
                  height: "100dvh",
                  background: "hsl(222,47%,6%)",
                  boxShadow: "0 0 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)",
                }}
              >
                <Router />
              </div>
            </div>
          </WouterRouter>
          <Toaster />
        </AudioProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
