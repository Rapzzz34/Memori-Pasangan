import { useMemories } from "@/hooks/use-memories";
import { useSettings } from "@/hooks/use-settings";
import { MemoryCard } from "@/components/memory-card";
import { getDaysTogether, getAnniversaryCountdown, getBirthdayCountdown, formatDate, formatShortDate } from "@/lib/date-utils";
import { Layout } from "@/components/layout";
import { Loader2, Heart, Gift, Calendar, Camera } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

function FloatingHeart({ delay, x, size }: { delay: number; x: string; size: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: x, bottom: 0 }}
      initial={{ y: 0, opacity: 0.8 }}
      animate={{ y: -700, opacity: 0, x: [0, 20, -20, 10, -10, 0] }}
      transition={{ duration: 8 + Math.random() * 4, delay, repeat: Infinity, repeatDelay: Math.random() * 6 + 2, ease: "easeOut" }}
    >
      <Heart style={{ width: size, height: size }} className="text-white fill-white" />
    </motion.div>
  );
}

function CountdownCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white/30 backdrop-blur-sm rounded-2xl px-5 py-4 text-center min-w-[80px]">
      <div className="text-3xl md:text-4xl font-serif font-bold text-white drop-shadow">{value}</div>
      <div className="text-xs text-white/80 mt-1 font-medium uppercase tracking-wider">{label}</div>
      {sub && <div className="text-[10px] text-white/60 mt-0.5">{sub}</div>}
    </div>
  );
}

function BirthdayCard({ name, dateString }: { name: string; dateString: string | null | undefined }) {
  const countdown = getBirthdayCountdown(dateString);
  if (!countdown) return null;

  const isToday = countdown.days === 0;
  const isSoon = countdown.days <= 7;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden rounded-3xl p-5 flex items-center gap-4 shadow-lg ${isToday ? "bg-gradient-to-br from-yellow-400 to-orange-500" : isSoon ? "bg-gradient-to-br from-pink-500 to-rose-600" : "bg-white/80 backdrop-blur-sm border border-primary/20"}`}
    >
      <div className={`rounded-full p-3 ${isToday || isSoon ? "bg-white/20" : "bg-primary/10"}`}>
        <Gift className={`w-7 h-7 ${isToday || isSoon ? "text-white" : "text-primary"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-serif font-semibold text-lg leading-tight ${isToday || isSoon ? "text-white" : "text-foreground"}`}>
          {isToday ? `Selamat Ulang Tahun, ${name}!` : `Ulang Tahun ${name}`}
        </p>
        {!isToday && (
          <p className={`text-sm mt-0.5 ${isSoon ? "text-white/80" : "text-muted-foreground"}`}>
            {formatShortDate(dateString)} — {countdown.days === 1 ? "besok!" : `${countdown.days} hari lagi`}
          </p>
        )}
        {isToday && (
          <p className="text-white/80 text-sm mt-0.5">Hari yang spesial untukmu</p>
        )}
      </div>
      {isSoon && !isToday && (
        <div className="text-right">
          <div className="text-4xl font-serif font-bold text-white">{countdown.days}</div>
          <div className="text-xs text-white/70 uppercase tracking-wide">hari</div>
        </div>
      )}
    </motion.div>
  );
}

function DayCounter({ days }: { days: number }) {
  const years = Math.floor(days / 365);
  const remaining = days % 365;
  const months = Math.floor(remaining / 30);
  const d = remaining % 30;
  return (
    <div className="flex items-center justify-center flex-wrap gap-3">
      {years > 0 && <CountdownCard label="tahun" value={years} />}
      {months > 0 && <CountdownCard label="bulan" value={months} />}
      <CountdownCard label="hari" value={d} />
    </div>
  );
}

export default function Home() {
  const { memories, isLoading: memoriesLoading } = useMemories();
  const { settings, isLoading: settingsLoading } = useSettings();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(v => v + 1), 60000);
    return () => clearInterval(t);
  }, []);

  if (settingsLoading || memoriesLoading) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <Heart className="w-10 h-10 text-primary fill-primary/30" />
          </motion.div>
          <p className="text-primary/70 font-serif italic">Memuat kenangan...</p>
        </div>
      </Layout>
    );
  }

  const daysTogether = getDaysTogether(settings?.loveDate);
  const anniversaryCountdown = getAnniversaryCountdown(settings?.loveDate);

  const hasBirthday1 = !!settings?.person1Birthday;
  const hasBirthday2 = !!settings?.person2Birthday;
  const hasBirthdays = hasBirthday1 || hasBirthday2;

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center overflow-hidden px-6 pb-10 pt-16"
        style={{ background: "linear-gradient(to bottom, hsl(350,85%,52%), hsl(350,80%,60%), hsl(350,72%,72%))" }}
      >

        {/* Floating hearts */}
        {[...Array(8)].map((_, i) => (
          <FloatingHeart key={i} delay={i * 1.5} x={`${8 + i * 12}%`} size={12 + (i % 3) * 8} />
        ))}

        {/* Big heart SVG */}
        <motion.div
          className="mb-6"
          animate={{ scale: [1, 1.06, 1], y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 200 180" className="w-36 h-32 md:w-48 md:h-44 drop-shadow-2xl" fill="none">
            <path
              d="M100 160 C100 160 20 105 20 60 C20 35 40 15 65 15 C80 15 93 23 100 35 C107 23 120 15 135 15 C160 15 180 35 180 60 C180 105 100 160 100 160Z"
              fill="white"
              fillOpacity="0.95"
            />
            <path
              d="M100 155 C100 155 25 103 25 60 C25 37 44 20 67 20 C81 20 93 27 100 38 C107 27 119 20 133 20 C156 20 175 37 175 60 C175 103 100 155 100 155Z"
              fill="url(#heartGrad)"
              fillOpacity="0.5"
            />
            <defs>
              <linearGradient id="heartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(350,90%,65%)" />
                <stop offset="100%" stopColor="hsl(350,70%,85%)" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-4 max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-serif text-white leading-tight drop-shadow-lg">
            {settings?.person1Name || "Namamu"}
            <span className="mx-3 italic font-light opacity-80">&amp;</span>
            {settings?.person2Name || "Nama Dia"}
          </h1>

          {settings?.loveDate && (
            <div className="space-y-3">
              <p className="text-white/80 font-sans text-sm uppercase tracking-widest">Bersama sejak {formatDate(settings.loveDate)}</p>
              <DayCounter days={daysTogether} />
            </div>
          )}

          {settings?.loveMessage && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/90 font-serif italic text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-4 drop-shadow"
            >
              "{settings.loveMessage}"
            </motion.p>
          )}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 flex flex-col items-center gap-1"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-px h-8 bg-white/40 rounded-full" />
          <p className="text-white/50 text-xs tracking-widest uppercase">scroll</p>
        </motion.div>
      </section>

      {/* Anniversary Countdown Section */}
      {anniversaryCountdown && (
        <section className="px-4 md:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[hsl(350,72%,55%)] to-[hsl(350,60%,68%)] p-6 md:p-8 text-center shadow-xl"
          >
            <div className="absolute top-0 right-0 opacity-10">
              <Calendar className="w-40 h-40 text-white translate-x-8 -translate-y-4" />
            </div>
            <Calendar className="w-8 h-8 text-white/70 mx-auto mb-3" />
            <p className="text-white/80 text-sm uppercase tracking-widest mb-2">Countdown Anniversary</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {anniversaryCountdown.months > 0 && (
                <CountdownCard label="bulan" value={anniversaryCountdown.months} />
              )}
              <CountdownCard label="hari" value={anniversaryCountdown.days} />
            </div>
            <p className="text-white/70 text-sm mt-4 font-serif italic">
              {formatDate(settings?.loveDate)} — hari yang kita tunggu
            </p>
          </motion.div>
        </section>
      )}

      {/* Birthday Section */}
      {hasBirthdays && (
        <section className="px-4 md:px-8 py-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2 mb-4">
              <Gift className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-serif font-semibold text-foreground">Countdown Ulang Tahun</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {hasBirthday1 && (
                <BirthdayCard name={settings?.person1Name || "Kamu"} dateString={settings?.person1Birthday} />
              )}
              {hasBirthday2 && (
                <BirthdayCard name={settings?.person2Name || "Dia"} dateString={settings?.person2Birthday} />
              )}
            </div>
          </motion.div>
        </section>
      )}

      {/* Gallery Section */}
      <section className="px-4 md:px-8 pb-16 pt-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 mb-6"
        >
          <Camera className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-serif font-semibold text-foreground">Kenangan Kita</h2>
        </motion.div>
        {memories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 auto-rows-max">
            {memories.map((memory, index) => (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
              >
                <MemoryCard memory={memory} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/15 mb-4"
            >
              <Heart className="w-10 h-10 text-primary fill-primary/30" />
            </motion.div>
            <h3 className="text-2xl font-serif text-foreground">Belum ada kenangan</h3>
            <p className="text-muted-foreground">Pemilik belum menambahkan kenangan apapun. Segera buat kenangan bersama!</p>
          </div>
        )}
      </section>
    </Layout>
  );
}
