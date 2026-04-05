import { Link } from "wouter";
import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { BottomNav } from "@/components/bottom-nav";

export function Layout({ children, hideNav }: { children: ReactNode; hideNav?: boolean }) {
  const { isOwner } = useAuth();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <main className="flex-1 w-full pb-20">{children}</main>
      {!hideNav && <BottomNav />}
      <div className="fixed top-3 right-3 z-50">
        <Link
          href="/owner"
          className="text-[9px] uppercase tracking-widest text-white/20 hover:text-primary transition-colors px-2 py-1"
        >
          {isOwner ? "Panel" : "Owner"}
        </Link>
      </div>
    </div>
  );
}
