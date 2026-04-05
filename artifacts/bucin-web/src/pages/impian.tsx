import { useBucketList } from "@/hooks/use-bucket-list";
import { Layout } from "@/components/layout";
import { CheckSquare, Check, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function Impian() {
  const { items, isLoading } = useBucketList();

  const done = items.filter(i => i.completed).length;
  const total = items.length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Layout>
      <div className="min-h-[100dvh] px-4 pt-8 pb-4 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <CheckSquare className="w-4 h-4" style={{ color: "hsl(330,100%,55%)" }} />
            <h1 className="text-sm font-bold uppercase tracking-[0.25em]" style={{ color: "rgba(80,20,80,0.50)" }}>
              Impian Kita
            </h1>
          </div>
          {total > 0 && (
            <p className="text-xs" style={{ color: "rgba(80,20,80,0.30)" }}>{done} dari {total} terwujud</p>
          )}
        </motion.div>

        {/* Progress bar */}
        {total > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: "rgba(255,20,147,0.08)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, hsl(330,100%,55%), hsl(310,100%,50%))",
                  boxShadow: "0 0 10px rgba(255,20,147,0.4)",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-[10px] mt-1 text-right" style={{ color: "rgba(80,20,80,0.32)" }}>{progress}%</p>
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 gap-3">
            <Heart className="w-10 h-10" style={{ color: "rgba(255,20,147,0.25)", fill: "rgba(255,20,147,0.08)" }} />
            <p className="text-sm font-serif italic" style={{ color: "rgba(80,20,80,0.28)" }}>
              Belum ada impian yang ditulis
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.04 }}
                className="flex items-center gap-3 rounded-2xl px-4 py-3.5"
                style={{
                  background: item.completed ? "rgba(255,20,147,0.06)" : "rgba(255,255,255,0.72)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: item.completed ? "1px solid rgba(255,20,147,0.20)" : "1px solid rgba(255,180,220,0.35)",
                  boxShadow: "0 2px 12px rgba(255,20,147,0.06)",
                }}
              >
                <div
                  className="w-5 h-5 rounded border flex items-center justify-center shrink-0"
                  style={{
                    background: item.completed ? "hsl(330,100%,55%)" : "transparent",
                    borderColor: item.completed ? "hsl(330,100%,55%)" : "rgba(255,20,147,0.30)",
                    boxShadow: item.completed ? "0 0 8px rgba(255,20,147,0.4)" : "none",
                  }}
                >
                  {item.completed && <Check className="w-3 h-3 text-white" />}
                </div>
                <span
                  className={`text-sm flex-1 ${item.completed ? "line-through" : ""}`}
                  style={{ color: item.completed ? "rgba(80,20,80,0.35)" : "hsl(280,60%,10%)" }}
                >
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
