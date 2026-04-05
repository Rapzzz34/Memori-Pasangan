import { Link } from "wouter";
import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { BottomNav } from "@/components/bottom-nav";
import { MiniPlayer } from "@/components/mini-player";

export function Layout({ children, hideNav }: { children: ReactNode; hideNav?: boolean }) {
  const { isOwner } = useAuth();

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide relative">
        {children}
        {/* Owner link top-right */}
        <div className="fixed-within-phone absolute top-3 right-3 z-50">
          <Link
            href="/owner"
            className="text-[9px] uppercase tracking-widest transition-colors px-2 py-1"
            style={{ color: "rgba(80,20,80,0.25)" }}
          >
            {isOwner ? "Panel" : "Owner"}
          </Link>
        </div>
      </div>

      {/* Mini player — appears above nav when song is playing */}
      {!hideNav && <MiniPlayer />}

      {/* Bottom nav — always visible */}
      {!hideNav && <BottomNav />}
    </div>
  );
}
