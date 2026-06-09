import { createStore } from "./local-store";
import {
  SETTINGS,
  MEMORIES,
  BUCKET_LIST,
  SONGS,
  DIARY_ENTRIES,
  OWNER_PASSWORDS,
} from "@/data/content";
import type { Memory, SiteSettings, BucketListItem, Song, DiaryEntry } from "@/lib/types";

export const authStore = createStore<{ isOwner: boolean; personId: number | null }>(
  "kk_auth",
  () => ({ isOwner: false, personId: null }),
);

export const passwordsStore = createStore<{ p1: string; p2: string }>(
  "kk_passwords",
  () => ({ p1: OWNER_PASSWORDS.person1Password, p2: OWNER_PASSWORDS.person2Password }),
);

export const settingsStore = createStore<SiteSettings>("kk_settings", () => ({
  id: 1,
  person1Name: SETTINGS.person1Name,
  person2Name: SETTINGS.person2Name,
  loveDate: SETTINGS.loveDate,
  loveMessage: SETTINGS.loveMessage,
  person1Birthday: SETTINGS.person1Birthday,
  person2Birthday: SETTINGS.person2Birthday,
  coverImageUrl: SETTINGS.coverImageUrl,
  updatedAt: new Date().toISOString(),
}));

export const memoriesStore = createStore<Memory[]>("kk_memories", () =>
  MEMORIES.map((m) => ({ ...m, caption: m.caption ?? null })),
);

export const bucketStore = createStore<BucketListItem[]>("kk_bucket", () =>
  BUCKET_LIST.map((b) => ({ ...b, createdAt: new Date().toISOString() })),
);

export const songsStore = createStore<Song[]>("kk_songs", () =>
  SONGS.map((s) => ({ ...s, audioUrl: s.audioUrl || null })),
);

export const diaryStore = createStore<DiaryEntry[]>("kk_diary", () => DIARY_ENTRIES);
