import { useSongs } from "@/hooks/use-songs";
import { useSettings } from "@/hooks/use-settings";
import { useAudio } from "@/contexts/audio-context";
import { Layout } from "@/components/layout";
import { Music2, Play, Pause, Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { Song } from "@workspace/api-client-react";

function SongCard({ song }: { song: Song }) {
  const { toggle, currentSong, isPlaying } = useAudio();
  const isThisSong = currentSong?.id === song.id;
  const isThisPlaying = isThisSong && isPlaying;
  const hasAudio = !!song.audioUrl;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="rounded-2xl border overflow-hidden cursor-pointer active:scale-95 transition-transform"
      style={{
        background: isThisSong
          ? "linear-gradient(145deg, rgba(180,40,100,0.18), rgba(130,20,80,0.10))"
          : "rgba(255,255,255,0.04)",
        borderColor: isThisSong ? "rgba(330,85%,58%,0.3)" : "rgba(255,255,255,0.07)",
      }}
      onClick={() => hasAudio && toggle({ id: song.id, title: song.title, artist: song.artist, audioUrl: song.audioUrl })}
    >
      {/* Thumbnail area */}
      <div
        className="relative aspect-square flex flex-col items-center justify-center gap-2"
        style={{
          background: isThisSong
            ? "linear-gradient(160deg, hsl(330,60%,18%), hsl(320,50%,12%))"
            : "rgba(255,255,255,0.03)",
        }}
      >
        {/* Animated bars when playing */}
        {isThisPlaying ? (
          <div className="flex items-end gap-1 h-8">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 rounded-full"
                style={{ background: "hsl(330,85%,65%)" }}
                animate={{ height: ["8px", "28px", "6px", "20px", "8px"] }}
                transition={{ duration: 0.7 + i * 0.1, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
              />
            ))}
          </div>
        ) : (
          <Music2
            className="w-8 h-8"
            style={{ color: isThisSong ? "hsl(330,85%,65%)" : "rgba(255,255,255,0.12)" }}
          />
        )}

        {/* Play/pause button overlay */}
        {hasAudio && (
          <div
            className="absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg, hsl(330,85%,58%), hsl(320,90%,48%))" }}
          >
            {isThisPlaying
              ? <Pause className="w-3.5 h-3.5 text-white fill-white" />
              : <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
            }
          </div>
        )}

        {!hasAudio && (
          <span className="text-[9px] text-white/20 absolute bottom-1.5 right-2">no audio</span>
        )}
      </div>

      {/* Info */}
      <div className="px-2.5 py-2 text-center">
        <p
          className="text-xs font-medium truncate leading-tight"
          style={{ color: isThisSong ? "hsl(330,80%,75%)" : "rgba(255,255,255,0.8)" }}
        >
          {song.title || "Tanpa judul"}
        </p>
        {song.artist && (
          <p className="text-[10px] truncate mt-0.5" style={{ color: "rgba(255,255,255,0.28)" }}>
            {song.artist}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function Lagu() {
  const { songs, isLoading } = useSongs();
  const { settings } = useSettings();

  const person1Songs = songs.filter(s => s.person === "person1" || s.person === "both");
  const person2Songs = songs.filter(s => s.person === "person2");

  const name1 = settings?.person1Name || "Orang Pertama";
  const name2 = settings?.person2Name || "Orang Kedua";

  return (
    <Layout>
      <div className="min-h-[100dvh] px-4 pt-8 pb-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Music2 className="w-4 h-4 text-primary/60" />
            <h1 className="text-sm font-bold uppercase tracking-[0.25em] text-white/50">Lagu Kita</h1>
          </div>
          <p className="text-white/25 text-xs">{songs.length} lagu</p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : songs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 gap-3">
            <Heart className="w-10 h-10 text-primary/20 fill-primary/5" />
            <p className="text-white/20 text-sm font-serif italic">Belum ada lagu yang ditambahkan</p>
          </div>
        ) : (
          <div className="space-y-8">
            {person1Songs.length > 0 && (
              <div>
                <p
                  className="text-[10px] uppercase tracking-[0.2em] mb-4 font-medium"
                  style={{ color: "hsl(330,85%,65%)" }}
                >
                  Playlist {name1}
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {person1Songs.map(s => <SongCard key={s.id} song={s} />)}
                </div>
              </div>
            )}
            {person2Songs.length > 0 && (
              <div>
                <p
                  className="text-[10px] uppercase tracking-[0.2em] mb-4 font-medium"
                  style={{ color: "hsl(330,85%,65%)" }}
                >
                  Playlist {name2}
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {person2Songs.map(s => <SongCard key={s.id} song={s} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
