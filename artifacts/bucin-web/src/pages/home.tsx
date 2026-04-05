import { useMemories } from "@/hooks/use-memories";
import { useSettings } from "@/hooks/use-settings";
import { useBucketList } from "@/hooks/use-bucket-list";
import { useSongs } from "@/hooks/use-songs";
import { useDiary } from "@/hooks/use-diary";
import { getDaysTogether, formatDate } from "@/lib/date-utils";
import { Layout } from "@/components/layout";
import { Heart, Music2, BookOpen, Camera, CheckSquare, Check, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import type { DiaryEntry, Song } from "@workspace/api-client-react";

function getTimeTogether(loveDateStr: string | null | undefined) {
  if (!loveDateStr) return { days: 0, hours: 0, minutes: 0 };
  const start = new Date(loveDateStr);
  const now = new Date();
  const diff = Math.max(0, now.getTime() - start.getTime());
  const totalMinutes = Math.floor(diff / 60000);
  const totalHours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  return { days, hours, minutes };
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[3.5rem]">
      <div className="text-3xl md:text-4xl font-bold text-white tabular-nums leading-none">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(to bottom, hsl(330,85%,60%), hsl(330,70%,40%))" }} />
      <span className="text-white/50 text-xs">{icon}</span>
      <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">{title}</h2>
    </div>
  );
}

function DiaryCard({ entry }: { entry: DiaryEntry }) {
  const date = new Date(entry.createdAt);
  const dateStr = date.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-xl border border-white/8 overflow-hidden"
      style={{ background: "rgba(255,255,255,0.04)" }}
    >
      {entry.imageUrl && (
        <div className="relative">
          <img src={entry.imageUrl} alt="" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth="2">
              <path d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      )}
      <div className="p-4">
        <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">{dateStr}</p>
        <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line">{entry.content}</p>
      </div>
    </motion.div>
  );
}

function SongCard({ song }: { song: Song }) {
  const [playing, setPlaying] = useState(false);
  const [audio] = useState(() => song.audioUrl ? new Audio(song.audioUrl) : null);

  const toggle = () => {
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

  return (
    <div
      className="rounded-xl p-3 flex flex-col items-center gap-2 border border-white/8"
      style={{ background: "rgba(255,255,255,0.05)" }}
    >
      <div className="w-full aspect-square rounded-lg flex items-center justify-center relative"
        style={{ background: "rgba(255,255,255,0.06)" }}>
        <Music2 className="w-8 h-8 text-white/30" />
        {song.audioUrl && (
          <button
            onClick={toggle}
            className="absolute bottom-2 left-2 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, hsl(330,85%,58%), hsl(320,90%,48%))" }}
          >
            {playing
              ? <span className="w-2.5 h-2.5 border-l-2 border-r-2 border-white" />
              : <Play className="w-3 h-3 text-white fill-white ml-0.5" />
            }
          </button>
        )}
      </div>
      <div className="w-full text-center">
        <p className="text-white/85 text-xs font-medium truncate">{song.title}</p>
        {song.artist && <p className="text-white/35 text-[10px] truncate">{song.artist}</p>}
      </div>
    </div>
  );
}

export default function Home() {
  const { memories } = useMemories();
  const { settings } = useSettings();
  const { items: bucketItems } = useBucketList();
  const { songs } = useSongs();
  const { entries } = useDiary();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(v => v + 1), 60000);
    return () => clearInterval(t);
  }, []);

  const time = getTimeTogether(settings?.loveDate);
  const totalDays = getDaysTogether(settings?.loveDate);

  const person1Songs = songs.filter(s => s.person === "person1" || s.person === "both");
  const person2Songs = songs.filter(s => s.person === "person2");

  return (
    <Layout>
      {/* ── HERO ── */}
      <section
        className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center overflow-hidden px-6 pt-16 pb-12"
        style={{ background: "linear-gradient(160deg, hsl(222,55%,9%) 0%, hsl(240,40%,8%) 50%, hsl(222,47%,6%) 100%)" }}
      >
        {/* subtle star/dot particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.05,
            }}
            animate={{ opacity: [0.05, 0.3, 0.05] }}
            transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
          />
        ))}

        {/* glow blob */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 400,
            height: 400,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, hsl(330,85%,55%,0.12) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative z-10 space-y-5 max-w-lg mx-auto"
        >
          {/* Heart icon */}
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mx-auto"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <Heart className="w-8 h-8 fill-current" style={{ color: "hsl(330,85%,65%)" }} />
          </motion.div>

          <div>
            <h1 className="text-4xl md:text-6xl font-serif text-white leading-tight">
              {settings?.person1Name || "Namamu"}
              <span className="mx-2 italic font-light text-white/40"> & </span>
              {settings?.person2Name || "Nama Dia"}
            </h1>
            {settings?.loveDate && (
              <p className="text-white/35 text-xs mt-2 uppercase tracking-[0.25em]">
                Bersama sejak {formatDate(settings.loveDate)}
              </p>
            )}
          </div>

          {/* Live time counter */}
          {settings?.loveDate && (
            <div
              className="inline-flex items-center gap-4 rounded-2xl px-6 py-4 mx-auto border border-white/8"
              style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)" }}
            >
              <TimeBlock value={time.days} label="hari" />
              <div className="text-white/20 text-xl font-light">:</div>
              <TimeBlock value={time.hours} label="jam" />
              <div className="text-white/20 text-xl font-light">:</div>
              <TimeBlock value={time.minutes} label="menit" />
            </div>
          )}

          {settings?.loveMessage && (
            <p className="text-white/45 font-serif italic text-base leading-relaxed">
              "{settings.loveMessage}"
            </p>
          )}
        </motion.div>

        <motion.div
          className="absolute bottom-6 flex flex-col items-center gap-1.5"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <div className="w-px h-8 bg-white/15" />
          <p className="text-white/25 text-[10px] tracking-[0.35em] uppercase">scroll</p>
        </motion.div>
      </section>

      {/* ── CONTENT SECTIONS ── */}
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-12">

        {/* WAKTU BERSAMA summary card */}
        {settings?.loveDate && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div
              className="rounded-2xl p-5 border border-white/8 flex items-center justify-between"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/35 mb-1">⏱ Waktu Bersama</p>
                <p className="text-white/70 text-sm">{totalDays} hari penuh cinta</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white tabular-nums">{totalDays}</div>
                <div className="text-[10px] text-white/30 uppercase tracking-wider">hari</div>
              </div>
            </div>
          </motion.section>
        )}

        {/* IMPIAN KITA */}
        {bucketItems.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionHeader icon={<CheckSquare className="w-3.5 h-3.5" />} title="Impian Kita" />
            <div
              className="rounded-2xl border border-white/8 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              {bucketItems.map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 px-4 py-3 ${idx < bucketItems.length - 1 ? "border-b border-white/5" : ""}`}
                >
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center shrink-0 border"
                    style={{
                      background: item.completed ? "hsl(330,85%,58%)" : "transparent",
                      borderColor: item.completed ? "hsl(330,85%,58%)" : "rgba(255,255,255,0.15)",
                    }}
                  >
                    {item.completed && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-sm ${item.completed ? "line-through text-white/30" : "text-white/75"}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* LAGU KITA */}
        {songs.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionHeader icon={<Music2 className="w-3.5 h-3.5" />} title="Lagu Kita" />
            {person1Songs.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] uppercase tracking-widest text-primary/70 mb-3">
                  Playlist {settings?.person1Name || "Dia"}
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {person1Songs.map(s => <SongCard key={s.id} song={s} />)}
                </div>
              </div>
            )}
            {person2Songs.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-primary/70 mb-3">
                  Playlist {settings?.person2Name || "Kamu"}
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {person2Songs.map(s => <SongCard key={s.id} song={s} />)}
                </div>
              </div>
            )}
          </motion.section>
        )}

        {/* BUKU HARIAN */}
        {entries.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionHeader icon={<BookOpen className="w-3.5 h-3.5" />} title="Buku Harian" />
            <div className="space-y-4">
              {entries.map(entry => <DiaryCard key={entry.id} entry={entry} />)}
            </div>
          </motion.section>
        )}

        {/* KENANGAN KITA */}
        {memories.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionHeader icon={<Camera className="w-3.5 h-3.5" />} title="Kenangan Kita" />
            <div className="space-y-6">
              {memories.map((memory, idx) => {
                const isLeft = idx % 2 === 0;
                return (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className={`flex gap-4 items-start ${!isLeft ? "flex-row-reverse" : ""}`}
                  >
                    <div className="w-36 shrink-0 rounded-xl overflow-hidden aspect-[3/4]">
                      <img src={memory.imageUrl} alt={memory.title} className="w-full h-full object-cover" />
                    </div>
                    <div className={`flex-1 pt-2 ${!isLeft ? "text-right" : ""}`}>
                      {memory.memoryDate && (
                        <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">{formatDate(memory.memoryDate)}</p>
                      )}
                      <h3 className="text-white/85 font-serif text-lg leading-snug mb-2">{memory.title}</h3>
                      <p className="text-white/45 text-xs leading-relaxed line-clamp-4">{memory.caption}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}

        {memories.length === 0 && entries.length === 0 && bucketItems.length === 0 && songs.length === 0 && (
          <div className="py-24 text-center space-y-3">
            <Heart className="w-12 h-12 text-primary/30 fill-primary/10 mx-auto" />
            <p className="text-white/25 font-serif italic">Belum ada kenangan yang ditambahkan</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
