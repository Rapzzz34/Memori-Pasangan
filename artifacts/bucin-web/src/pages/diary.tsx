import { useDiary } from "@/hooks/use-diary";
import { Layout } from "@/components/layout";
import { BookOpen, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function Diary() {
  const { entries, isLoading } = useDiary();

  return (
    <Layout>
      <div className="min-h-[100dvh] px-4 pt-8 pb-4 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-primary/60" />
            <h1 className="text-sm font-bold uppercase tracking-[0.25em] text-white/50">Buku Harian</h1>
          </div>
          <p className="text-white/25 text-xs">{entries.length} cerita tersimpan</p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 gap-3">
            <Heart className="w-10 h-10 text-primary/20 fill-primary/5" />
            <p className="text-white/20 text-sm font-serif italic">Belum ada cerita yang ditulis</p>
          </div>
        ) : (
          <div className="space-y-5">
            {entries.map((entry, idx) => {
              const date = new Date(entry.createdAt);
              const dateStr = date.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              });
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-2xl border border-white/8 overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  {entry.imageUrl && (
                    <div className="relative">
                      <img
                        src={entry.imageUrl}
                        alt=""
                        className="w-full object-cover"
                        style={{ maxHeight: "280px" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                  )}
                  <div className="p-4 space-y-2">
                    <p className="text-[10px] text-white/25 uppercase tracking-widest">{dateStr}</p>
                    <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{entry.content}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
