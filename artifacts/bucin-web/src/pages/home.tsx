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
      <div className="text-3xl md:text-5xl font-bold text-white tabular-nums leading-none"
        style={{ textShadow: "0 0 20px rgba(255,20,147,0.4)" }}>
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[9px] uppercase tracking-widest mt-1.5" style={{ color: "rgba(255,150,200,0.45)" }}>
        {label}
      </div>
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
        style={{ minHeight: "calc(100dvh - 120px)" }}
      >
        {/* Bokeh neon orbs */}
        {[
          { w: 200, h: 200, top: "5%", left: "8%",   color: "rgba(255,20,147,0.20)", blur: 50, dur: 7 },
          { w: 140, h: 140, top: "18%", right: "5%",  color: "rgba(220,30,180,0.16)", blur: 35, dur: 9 },
          { w: 170, h: 170, top: "60%", left: "3%",   color: "rgba(255,0,120,0.16)",  blur: 42, dur: 8 },
          { w: 110, h: 110, top: "72%", right: "8%",  color: "rgba(255,80,180,0.18)", blur: 28, dur: 6 },
          { w: 90,  h: 90,  top: "42%", left: "52%",  color: "rgba(255,20,147,0.10)", blur: 22, dur: 10 },
        ].map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: orb.w, height: orb.h,
              top: orb.top,
              left: (orb as any).left,
              right: (orb as any).right,
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              filter: `blur(${orb.blur}px)`,
            }}
            animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: orb.dur, repeat: Infinity, ease: "easeInOut", delay: i * 1.5 }}
          />
        ))}

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
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1.5px solid rgba(255,30,140,0.40)",
              boxShadow: "0 0 32px rgba(255,20,147,0.40), 0 0 0 8px rgba(255,20,147,0.06)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Heart
              className="w-8 h-8 fill-current"
              style={{
                color: "hsl(330,100%,60%)",
                filter: "drop-shadow(0 0 10px rgba(255,20,147,0.9))",
              }}
            />
          </motion.div>

          {/* Names */}
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-serif text-white leading-tight"
              style={{ textShadow: "0 0 40px rgba(255,20,147,0.20)" }}>
              {settings?.person1Name || "Kamu"}
              <span className="mx-3 font-light text-3xl" style={{ color: "rgba(255,20,147,0.50)" }}> & </span>
              {settings?.person2Name || "Dia"}
            </h1>
            {settings?.loveDate && (
              <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color: "rgba(255,150,200,0.38)" }}>
                Bersama sejak {formatDate(settings.loveDate)}
              </p>
            )}
          </div>

          {/* Live Timer */}
          {settings?.loveDate && (
            <div className="flex justify-center w-full">
              <div
                className="flex items-center gap-3 rounded-2xl px-6 py-5"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,30,140,0.22)",
                  boxShadow: "0 8px 32px rgba(255,20,147,0.14), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <TimeBlock value={time.days} label="hari" />
                <span className="text-2xl font-extralight mb-3" style={{ color: "rgba(255,20,147,0.30)" }}>:</span>
                <TimeBlock value={time.hours} label="jam" />
                <span className="text-2xl font-extralight mb-3" style={{ color: "rgba(255,20,147,0.30)" }}>:</span>
                <TimeBlock value={time.minutes} label="menit" />
                <span className="text-2xl font-extralight mb-3" style={{ color: "rgba(255,20,147,0.30)" }}>:</span>
                <TimeBlock value={time.seconds} label="detik" />
              </div>
            </div>
          )}

          {/* Total days */}
          {settings?.loveDate && (
            <p className="text-xs font-serif italic" style={{ color: "rgba(255,150,200,0.38)" }}>
              {totalDays} hari penuh cinta
            </p>
          )}

          {/* Love message */}
          {settings?.loveMessage && (
            <p className="font-serif italic text-sm leading-relaxed max-w-xs mx-auto" style={{ color: "rgba(255,200,220,0.55)" }}>
              "{settings.loveMessage}"
            </p>
          )}
        </motion.div>
      </section>
    </Layout>
  );
}
