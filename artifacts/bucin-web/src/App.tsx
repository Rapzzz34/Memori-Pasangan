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
            {/* Outer: soft pink-white gradient fills screen */}
            <div
              className="w-full min-h-screen flex items-start justify-center relative overflow-hidden"
              style={{ background: "linear-gradient(145deg, #fff0f8 0%, #fce8ff 40%, #ffe8f5 70%, #f8f0ff 100%)" }}
            >
              {/* Floating neon blobs */}
              <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div style={{
                  position: "absolute", width: 340, height: 340,
                  top: "5%", left: "-8%",
                  background: "radial-gradient(circle, rgba(255,20,147,0.18) 0%, transparent 70%)",
                  filter: "blur(60px)", borderRadius: "50%",
                }} />
                <div style={{
                  position: "absolute", width: 280, height: 280,
                  top: "30%", right: "-5%",
                  background: "radial-gradient(circle, rgba(220,80,255,0.14) 0%, transparent 70%)",
                  filter: "blur(50px)", borderRadius: "50%",
                }} />
                <div style={{
                  position: "absolute", width: 320, height: 320,
                  bottom: "10%", left: "5%",
                  background: "radial-gradient(circle, rgba(255,80,160,0.13) 0%, transparent 70%)",
                  filter: "blur(55px)", borderRadius: "50%",
                }} />
                <div style={{
                  position: "absolute", width: 200, height: 200,
                  top: "60%", right: "10%",
                  background: "radial-gradient(circle, rgba(255,150,200,0.12) 0%, transparent 70%)",
                  filter: "blur(40px)", borderRadius: "50%",
                }} />
              </div>

              {/* Phone frame */}
              <div
                className="relative flex flex-col w-full"
                style={{
                  maxWidth: 430,
                  minHeight: "100dvh",
                  height: "100dvh",
                  background: "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(60px)",
                  WebkitBackdropFilter: "blur(60px)",
                  boxShadow: "0 0 0 1px rgba(255,180,220,0.35), 0 20px 80px rgba(255,20,147,0.10), 0 0 120px rgba(255,100,200,0.06)",
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
