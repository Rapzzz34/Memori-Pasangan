import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const { login, isLoggingIn } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login({ data: { password } });
    } catch {
      setError("Kode salah. Coba lagi.");
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div
        className="rounded-2xl p-8 space-y-6 border border-white/10"
        style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full flex items-center justify-center border border-white/20" style={{ background: "rgba(255,255,255,0.08)" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 text-primary" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 1.5C7.858 1.5 4.5 4.858 4.5 9c0 2.18.46 4.252 1.286 6.125M12 1.5c4.142 0 7.5 3.358 7.5 7.5 0 2.18-.46 4.252-1.286 6.125M12 1.5c-1.657 0-3 3.358-3 7.5 0 2.18.327 4.18.893 5.875M12 1.5c1.657 0 3 3.358 3 7.5 0 2.18-.327 4.18-.893 5.875M4.5 9A7.5 7.5 0 0 0 12 16.5M4.5 9a7.5 7.5 0 0 1 15 0M12 16.5A7.5 7.5 0 0 0 19.5 9" />
            </svg>
          </div>
          <p className="text-xs tracking-[0.3em] text-white/50 uppercase font-medium">Access Memory</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="password"
            placeholder="Kode rahasia"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            className="text-center tracking-[0.2em] text-white placeholder:text-white/25 border-white/15 h-12 text-base"
            style={{ background: "rgba(0,0,0,0.35)" }}
            autoComplete="current-password"
          />
          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}
          <Button
            type="submit"
            disabled={isLoggingIn || !password}
            className="w-full h-12 text-white font-bold tracking-[0.15em] text-sm uppercase rounded-xl"
            style={{ background: isLoggingIn || !password ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, hsl(330,85%,58%), hsl(320,90%,48%))" }}
          >
            {isLoggingIn ? "..." : "Masuk →"}
          </Button>
        </form>

        <p className="text-center text-xs text-white/25">
          Belum punya? Hubungi pemilik
        </p>
      </div>
    </div>
  );
}
