import { Link } from "wouter";
import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Heart } from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  const { isOwner } = useAuth();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground selection:bg-primary/20">
      <main className="flex-1 w-full max-w-7xl mx-auto">{children}</main>
      <footer className="py-8 text-center text-sm text-muted-foreground/60 flex flex-col items-center justify-center gap-4">
        <p className="flex items-center gap-1.5 font-serif italic">
          Made with <Heart className="w-3.5 h-3.5 text-primary/70 fill-primary/20" /> for love
        </p>
        <Link href="/owner" className="hover:text-primary transition-colors opacity-50 hover:opacity-100">
          {isOwner ? "Owner Panel" : "Owner Login"}
        </Link>
      </footer>
    </div>
  );
}
