import { Link } from "wouter";
import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Heart } from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  const { isOwner } = useAuth();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <main className="flex-1 w-full">{children}</main>
      <footer className="py-6 text-center text-xs text-muted-foreground/40 flex flex-col items-center gap-3">
        <p className="flex items-center gap-1.5 font-serif italic">
          Made with <Heart className="w-3 h-3 text-primary/50 fill-primary/20" /> love
        </p>
        <Link href="/owner" className="hover:text-primary transition-colors opacity-40 hover:opacity-100 tracking-widest uppercase text-[10px]">
          {isOwner ? "Owner Panel" : "Owner"}
        </Link>
      </footer>
    </div>
  );
}
