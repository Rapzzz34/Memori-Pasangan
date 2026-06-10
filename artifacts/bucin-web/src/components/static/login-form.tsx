import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart } from "lucide-react";

export function LoginForm() {
  const { login, isLoggingIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login({ data: { email, password } });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login gagal.";
      setError(msg.includes("Invalid") || msg.includes("credentials") ? "Email atau kode salah." : msg);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div
        className="rounded-3xl p-8 space-y-6"
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          border: "1px solid rgba(255,30,140,0.25)",
          boxShadow: "0 16px 48px rgba(255,20,147,0.18), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, hsl(330,100%,55%), hsl(310,100%,50%))",
              boxShadow: "0 8px 28px rgba(255,20,147,0.55), 0 0 0 8px rgba(255,20,147,0.10)",
            }}
          >
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <p className="text-xs tracking-[0.3em] uppercase font-semibold" style={{ color: "rgba(255,150,200,0.50)" }}>
            Masuk ke Panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            className="h-12 text-base rounded-xl text-white placeholder:text-white/20"
            style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,30,140,0.25)" }}
            autoComplete="email"
            required
          />
          <Input
            type="password"
            placeholder="Kata sandi"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            className="text-center tracking-[0.2em] h-12 text-base rounded-xl text-white placeholder:tracking-normal placeholder:text-white/20"
            style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,30,140,0.25)" }}
            autoComplete="current-password"
            required
          />
          {error && <p className="text-red-400 text-xs text-center">{error}</p>}
          <Button
            type="submit"
            disabled={isLoggingIn || !email || !password}
            className="w-full h-12 font-bold tracking-[0.15em] text-sm uppercase rounded-xl text-white"
            style={{
              background: isLoggingIn || !email || !password
                ? "rgba(255,20,147,0.20)"
                : "linear-gradient(135deg, hsl(330,100%,55%), hsl(310,100%,50%))",
              boxShadow: isLoggingIn || !email || !password ? "none" : "0 8px 28px rgba(255,20,147,0.50)",
            }}
          >
            {isLoggingIn ? "..." : "Masuk →"}
          </Button>
        </form>

        <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.18)" }}>
          Hubungi pemilik untuk akses
        </p>
      </div>
    </div>
  );
}
