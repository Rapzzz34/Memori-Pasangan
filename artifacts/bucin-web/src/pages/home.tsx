import { useSettings } from "@/hooks/use-settings";
import { getDaysTogether, formatDate } from "@/lib/date-utils";
import { Layout } from "@/components/layout";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

function getTimeTogether(loveDateStr: string | null | undefined) {
  if (!loveDateStr) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const start = new Date(loveDateStr);
  const now = new Date();
  const diff = Math.max(0, now.getTime() - start.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[3.5rem]">
      <div className="text-3xl md:text-5xl font-bold text-white tabular-nums leading-none">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[9px] text-white/35 uppercase tracking-widest mt-1.5">{label}</div>
    </div>
  );
}

export default function Home() {
  const { settings } = useSettings();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(v => v + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const time = getTimeTogether(settings?.loveDate);
  const totalDays = getDaysTogether(settings?.loveDate);

  return (
    <Layout>
      <section
        className="min-h-full flex flex-col items-center justify-center text-center px-6 relative overflow-hidden"
        style={{ minHeight: "calc(100dvh - 120px)", background: "linear-gradient(160deg, hsl(222,55%,9%) 0%, hsl(240,40%,8%) 50%, hsl(222,47%,6%) 100%)" }}
      >
        {/* Stars */}
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white pointer-events-none"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 85}%`,
            }}
            animate={{ opacity: [0.05, Math.random() * 0.4 + 0.1, 0.05] }}
            transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
          />
        ))}

        {/* Glow */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 500,
            height: 500,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -55%)",
            background: "radial-gradient(circle, hsla(330,85%,55%,0.1) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative z-10 space-y-8 max-w-lg w-full"
        >
          {/* Heart */}
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mx-auto"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <Heart className="w-8 h-8 fill-current" style={{ color: "hsl(330,85%,65%)" }} />
          </motion.div>

          {/* Names */}
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-serif text-white leading-tight">
              {settings?.person1Name || "Kamu"}
              <span className="mx-3 font-light text-white/30 text-3xl"> & </span>
              {settings?.person2Name || "Dia"}
            </h1>
            {settings?.loveDate && (
              <p className="text-white/30 text-[11px] uppercase tracking-[0.3em]">
                Bersama sejak {formatDate(settings.loveDate)}
              </p>
            )}
          </div>

          {/* Live Timer */}
          {settings?.loveDate && (
            <div
              className="inline-flex items-center gap-3 rounded-2xl px-6 py-5 border border-white/8 mx-auto"
              style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(10px)" }}
            >
              <TimeBlock value={time.days} label="hari" />
              <span className="text-white/15 text-2xl font-extralight mb-3">:</span>
              <TimeBlock value={time.hours} label="jam" />
              <span className="text-white/15 text-2xl font-extralight mb-3">:</span>
              <TimeBlock value={time.minutes} label="menit" />
              <span className="text-white/15 text-2xl font-extralight mb-3">:</span>
              <TimeBlock value={time.seconds} label="detik" />
            </div>
          )}

          {/* Total days */}
          {settings?.loveDate && (
            <p className="text-white/25 text-xs font-serif italic">
              {totalDays} hari penuh cinta
            </p>
          )}

          {/* Love message */}
          {settings?.loveMessage && (
            <p className="text-white/40 font-serif italic text-sm leading-relaxed max-w-xs mx-auto">
              "{settings.loveMessage}"
            </p>
          )}
        </motion.div>
      </section>
    </Layout>
  );
}
