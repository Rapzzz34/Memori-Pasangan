import { useMemories } from "@/hooks/use-memories";
import { formatDate } from "@/lib/date-utils";
import { Layout } from "@/components/layout";
import { Camera, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function Kenangan() {
  const { memories, isLoading } = useMemories();

  return (
    <Layout>
      <div className="min-h-[100dvh] px-4 pt-8 pb-4 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Camera className="w-4 h-4" style={{ color: "hsl(330,100%,60%)", filter: "drop-shadow(0 0 4px rgba(255,20,147,0.6))" }} />
            <h1 className="text-sm font-bold uppercase tracking-[0.25em]" style={{ color: "rgba(255,255,255,0.45)" }}>
              Kenangan Kita
            </h1>
          </div>
          <p className="text-xs" style={{ color: "rgba(255,150,200,0.28)" }}>{memories.length} foto tersimpan</p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : memories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 gap-3">
            <Heart className="w-10 h-10" style={{ color: "rgba(255,20,147,0.30)", fill: "rgba(255,20,147,0.08)" }} />
            <p className="text-sm font-serif italic" style={{ color: "rgba(255,150,200,0.28)" }}>
              Belum ada kenangan yang disimpan
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {memories.map((memory, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`flex gap-4 items-start ${!isLeft ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className="w-36 shrink-0 rounded-2xl overflow-hidden aspect-[3/4]"
                    style={{
                      border: "1.5px solid rgba(255,30,140,0.25)",
                      boxShadow: "0 8px 28px rgba(255,20,147,0.18)",
                    }}
                  >
                    <img src={memory.imageUrl} alt={memory.title} className="w-full h-full object-cover" />
                  </div>
                  <div className={`flex-1 pt-2 ${!isLeft ? "text-right" : ""}`}>
                    {memory.memoryDate && (
                      <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,150,200,0.32)" }}>
                        {formatDate(memory.memoryDate)}
                      </p>
                    )}
                    <h3 className="text-white/85 font-serif text-lg leading-snug mb-2">{memory.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(255,200,220,0.45)" }}>{memory.caption}</p>
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
