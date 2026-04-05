import { useMemories } from "@/hooks/use-memories";
import { useSettings } from "@/hooks/use-settings";
import { MemoryCard } from "@/components/memory-card";
import { getDaysTogether } from "@/lib/date-utils";
import { Layout } from "@/components/layout";
import { Loader2, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { memories, isLoading: memoriesLoading } = useMemories();
  const { settings, isLoading: settingsLoading } = useSettings();

  if (settingsLoading || memoriesLoading) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
          <Heart className="w-8 h-8 text-primary/50 animate-pulse fill-primary/20" />
          <p className="text-muted-foreground font-serif italic">Loading our memories...</p>
        </div>
      </Layout>
    );
  }

  const daysTogether = getDaysTogether(settings?.loveDate);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-6 overflow-hidden flex flex-col items-center justify-center text-center min-h-[60vh]">
        <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_center,var(--color-primary)_0%,transparent_70%)] opacity-5 mix-blend-multiply" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 max-w-3xl mx-auto"
        >
          {settings?.loveDate && (
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium tracking-wide">
              {daysTogether} days together
            </div>
          )}
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-foreground leading-tight tracking-tight">
            {settings?.person1Name || "You"} <span className="text-primary italic font-light mx-2">&amp;</span> {settings?.person2Name || "Me"}
          </h1>
          
          {settings?.loveMessage && (
            <p className="text-lg md:text-xl text-muted-foreground font-serif italic max-w-2xl mx-auto leading-relaxed">
              "{settings.loveMessage}"
            </p>
          )}
        </motion.div>
      </section>

      {/* Gallery Section */}
      <section className="px-4 md:px-8 pb-24">
        {memories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-max">
            {memories.map((memory, index) => (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              >
                <MemoryCard memory={memory} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Heart className="w-8 h-8 text-primary/40" />
            </div>
            <h3 className="text-2xl font-serif text-foreground">Our journal is empty</h3>
            <p className="text-muted-foreground">The owner hasn't added any memories yet.</p>
          </div>
        )}
      </section>
    </Layout>
  );
}
