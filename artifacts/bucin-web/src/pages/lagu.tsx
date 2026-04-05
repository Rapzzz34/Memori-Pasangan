import { useSongs } from "@/hooks/use-songs";
import { useSettings } from "@/hooks/use-settings";
import { Layout } from "@/components/layout";
import { Music2, Play, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Song } from "@workspace/api-client-react";

function SongCard({ song }: { song: Song }) {
  const [playing, setPlaying] = useState(false);
  const [audio] = useState(() => song.audioUrl ? new Audio(song.audioUrl) : null);

  const toggle = () => {
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      void audio.play();
      setPlaying(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="rounded-xl border border-white/8 overflow-hidden"
      style={{ background: "rgba(255,255,255,0.04)" }}
    >
      <div
        className="relative aspect-square flex items-center justify-center"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        <Music2 className="w-10 h-10 text-white/15" />
        {song.audioUrl && (
          <button
            onClick={toggle}
            className="absolute bottom-2 right-2 w-9 h-9 rounded-full flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg, hsl(330,85%,58%), hsl(320,90%,48%))" }}
          >
            {playing
              ? <span className="flex gap-0.5"><span className="w-1 h-3.5 bg-white rounded-sm" /><span className="w-1 h-3.5 bg-white rounded-sm" /></span>
              : <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            }
          </button>
        )}
      </div>
      <div className="p-3 text-center">
        <p className="text-white/80 text-sm font-medium truncate">{song.title}</p>
        {song.artist && <p className="text-white/30 text-[11px] truncate mt-0.5">{song.artist}</p>}
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
      <div className="min-h-[100dvh] px-4 pt-8 pb-4 max-w-2xl mx-auto">
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
