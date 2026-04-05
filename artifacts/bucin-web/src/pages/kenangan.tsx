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
            <Camera className="w-4 h-4 text-primary/60" />
            <h1 className="text-sm font-bold uppercase tracking-[0.25em] text-white/50">Kenangan Kita</h1>
          </div>
          <p className="text-white/25 text-xs">{memories.length} foto tersimpan</p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : memories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 gap-3">
            <Heart className="w-10 h-10 text-primary/20 fill-primary/5" />
            <p className="text-white/20 text-sm font-serif italic">Belum ada kenangan yang disimpan</p>
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
                  <div className="w-36 shrink-0 rounded-xl overflow-hidden aspect-[3/4] border border-white/8">
                    <img src={memory.imageUrl} alt={memory.title} className="w-full h-full object-cover" />
                  </div>
                  <div className={`flex-1 pt-2 ${!isLeft ? "text-right" : ""}`}>
                    {memory.memoryDate && (
                      <p className="text-[10px] text-white/25 uppercase tracking-widest mb-1">
                        {formatDate(memory.memoryDate)}
                      </p>
                    )}
                    <h3 className="text-white/85 font-serif text-lg leading-snug mb-2">{memory.title}</h3>
                    <p className="text-white/40 text-xs leading-relaxed">{memory.caption}</p>
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
