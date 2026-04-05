import { createContext, useContext, useRef, useState, useCallback, useEffect, type ReactNode } from "react";

export interface PlayerSong {
  id: number;
  title: string;
  artist?: string | null;
  audioUrl?: string | null;
}

interface AudioContextValue {
  currentSong: PlayerSong | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  play: (song: PlayerSong) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  toggle: (song: PlayerSong) => void;
  seek: (pct: number) => void;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSong, setCurrentSong] = useState<PlayerSong | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const onTimeUpdate = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    const onDurationChange = () => setDuration(audio.duration);
    const onEnded = () => { setIsPlaying(false); setProgress(0); };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
    };
  }, []);

  const play = useCallback((song: PlayerSong) => {
    const audio = audioRef.current;
    if (!audio || !song.audioUrl) return;

    if (currentSong?.id !== song.id) {
      audio.src = song.audioUrl;
      audio.load();
      setProgress(0);
      setDuration(0);
    }
    setCurrentSong(song);
    void audio.play().then(() => setIsPlaying(true)).catch(() => {});
  }, [currentSong]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentSong(null);
    setProgress(0);
  }, []);

  const resume = useCallback(() => {
    void audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
  }, []);

  const toggle = useCallback((song: PlayerSong) => {
    if (currentSong?.id === song.id && isPlaying) {
      pause();
    } else {
      play(song);
    }
  }, [currentSong, isPlaying, play, pause]);

  const seek = useCallback((pct: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = pct * audio.duration;
    setProgress(pct);
  }, []);

  return (
    <AudioCtx.Provider value={{ currentSong, isPlaying, progress, duration, play, pause, resume, stop, toggle, seek }}>
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}
