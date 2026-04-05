import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart } from "lucide-react";

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
        className="rounded-3xl p-8 space-y-6"
        style={{
          background: "rgba(255,255,255,0.80)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,180,220,0.45)",
          boxShadow: "0 16px 48px rgba(255,20,147,0.12)",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, hsl(330,100%,55%), hsl(310,100%,50%))",
              boxShadow: "0 8px 24px rgba(255,20,147,0.35)",
            }}
          >
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <p className="text-xs tracking-[0.3em] uppercase font-semibold" style={{ color: "rgba(80,20,80,0.45)" }}>
            Masuk ke Panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="password"
            placeholder="Kode rahasia"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            className="text-center tracking-[0.2em] h-12 text-base rounded-xl placeholder:tracking-normal"
            style={{
              background: "rgba(255,255,255,0.90)",
              borderColor: "rgba(255,150,200,0.40)",
              color: "hsl(280,60%,10%)",
            }}
            autoComplete="current-password"
          />
          {error && (
            <p className="text-red-500 text-xs text-center">{error}</p>
          )}
          <Button
            type="submit"
            disabled={isLoggingIn || !password}
            className="w-full h-12 font-bold tracking-[0.15em] text-sm uppercase rounded-xl text-white"
            style={{
              background: isLoggingIn || !password
                ? "rgba(255,20,147,0.25)"
                : "linear-gradient(135deg, hsl(330,100%,55%), hsl(310,100%,50%))",
              boxShadow: isLoggingIn || !password ? "none" : "0 8px 24px rgba(255,20,147,0.35)",
            }}
          >
            {isLoggingIn ? "..." : "Masuk →"}
          </Button>
        </form>

        <p className="text-center text-xs" style={{ color: "rgba(80,20,80,0.30)" }}>
          Belum punya akses? Hubungi pemilik
        </p>
      </div>
    </div>
  );
}
