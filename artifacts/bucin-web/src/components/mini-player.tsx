import { useAudio } from "@/contexts/audio-context";
import { Play, Pause, X, Music2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MiniPlayer() {
  const { currentSong, isPlaying, progress, resume, pause, stop, seek } = useAudio();

  return (
    <AnimatePresence>
      {currentSong && (
        <motion.div
          key="mini-player"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="shrink-0 overflow-hidden border-t border-white/6"
          style={{ background: "rgba(15,8,25,0.97)" }}
        >
          {/* Seekable progress bar */}
          <div
            className="h-0.5 w-full cursor-pointer"
            style={{ background: "rgba(255,255,255,0.07)" }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              seek((e.clientX - rect.left) / rect.width);
            }}
          >
            <div
              className="h-full"
              style={{
                width: `${progress * 100}%`,
                background: "linear-gradient(90deg, hsl(330,85%,58%), hsl(310,90%,48%))",
                transition: "width 0.3s linear",
              }}
            />
          </div>

          <div className="flex items-center gap-3 px-4 py-2.5">
            {/* Animated icon */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, hsl(330,60%,22%), hsl(320,50%,14%))" }}
            >
              {isPlaying ? (
                <div className="flex items-end gap-0.5 h-5">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-0.5 rounded-full"
                      style={{ background: "hsl(330,85%,65%)" }}
                      animate={{ height: ["5px", "16px", "4px", "12px", "5px"] }}
                      transition={{ duration: 0.65 + i * 0.12, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 }}
                    />
                  ))}
                </div>
              ) : (
                <Music2 className="w-4 h-4" style={{ color: "hsl(330,85%,65%)" }} />
              )}
            </div>

            {/* Song info */}
            <div className="flex-1 min-w-0">
              <p className="text-white/90 text-sm font-medium truncate leading-tight">{currentSong.title}</p>
              {currentSong.artist && (
                <p className="text-white/35 text-[11px] truncate">{currentSong.artist}</p>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={isPlaying ? pause : resume}
                className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-lg"
                style={{ background: "linear-gradient(135deg, hsl(330,85%,58%), hsl(320,90%,48%))" }}
              >
                {isPlaying
                  ? <Pause className="w-3.5 h-3.5 text-white fill-white" />
                  : <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                }
              </button>
              <button
                onClick={stop}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/25 hover:text-white/60 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
