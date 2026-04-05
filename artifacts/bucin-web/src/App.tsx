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
            {/* Outer: deep black fills the screen */}
            <div
              className="w-full min-h-screen flex items-start justify-center relative overflow-hidden"
              style={{ background: "#06000d" }}
            >
              {/* Floating neon pink blobs */}
              <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div style={{
                  position: "absolute", width: 400, height: 400,
                  top: "-5%", left: "-10%",
                  background: "radial-gradient(circle, rgba(255,20,147,0.22) 0%, transparent 65%)",
                  filter: "blur(70px)", borderRadius: "50%",
                }} />
                <div style={{
                  position: "absolute", width: 300, height: 300,
                  top: "35%", right: "-8%",
                  background: "radial-gradient(circle, rgba(220,30,180,0.18) 0%, transparent 65%)",
                  filter: "blur(60px)", borderRadius: "50%",
                }} />
                <div style={{
                  position: "absolute", width: 350, height: 350,
                  bottom: "5%", left: "2%",
                  background: "radial-gradient(circle, rgba(255,0,120,0.16) 0%, transparent 65%)",
                  filter: "blur(65px)", borderRadius: "50%",
                }} />
                <div style={{
                  position: "absolute", width: 220, height: 220,
                  top: "65%", right: "5%",
                  background: "radial-gradient(circle, rgba(255,80,180,0.14) 0%, transparent 65%)",
                  filter: "blur(45px)", borderRadius: "50%",
                }} />
              </div>

              {/* Phone frame — dark glass */}
              <div
                className="relative flex flex-col w-full"
                style={{
                  maxWidth: 430,
                  minHeight: "100dvh",
                  height: "100dvh",
                  background: "rgba(8,0,16,0.78)",
                  backdropFilter: "blur(60px)",
                  WebkitBackdropFilter: "blur(60px)",
                  boxShadow: "0 0 0 1px rgba(255,30,140,0.22), 0 20px 80px rgba(255,20,147,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
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
