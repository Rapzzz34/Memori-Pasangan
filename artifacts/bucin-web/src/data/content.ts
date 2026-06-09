/**
 * ============================================================
 *  EDIT FILE INI UNTUK MENGUBAH KONTEN WEBSITE
 *  File ini dipakai saat build ke Netlify (versi static).
 * ============================================================
 *
 *  FOTO (kenangan):
 *    - Taruh file foto di folder: artifacts/bucin-web/public/images/
 *    - Lalu isi imageUrl dengan: "/images/nama-file.jpg"
 *
 *  AUDIO (lagu):
 *    - Taruh file MP3/MP4 di folder: artifacts/bucin-web/public/audio/
 *    - Lalu isi audioUrl dengan: "/audio/nama-file.mp3"
 *    - Atau pakai URL eksternal (Google Drive, dll) jika tersedia
 *    - Kosongkan string "" jika tidak ada audio
 * ============================================================
 */

export const SETTINGS = {
  person1Name: "Rapp",
  person2Name: "Tataa",
  loveDate: "2026-04-05T00:00:00.000Z",
  loveMessage: "Setiap momen bersamamu adalah kenangan yang berharga.",
  person1Birthday: null as string | null,
  person2Birthday: null as string | null,
  coverImageUrl: null as string | null,
};

/**
 * PASSWORD OWNER PANEL
 * Ganti dengan password yang kamu inginkan.
 * person1Password → password untuk person 1
 * person2Password → password untuk person 2
 */
export const OWNER_PASSWORDS = {
  person1Password: "kenangan1",
  person2Password: "kenangan2",
};

export const MEMORIES = [
  // Contoh — hapus atau ganti dengan kenangan aslinya:
  // {
  //   id: 1,
  //   title: "Pertama ketemu",
  //   caption: "Hari yang paling berkesan",
  //   imageUrl: "/images/foto1.jpg",
  //   memoryDate: "2026-04-05",
  //   createdAt: "2026-04-05T00:00:00.000Z",
  //   updatedAt: "2026-04-05T00:00:00.000Z",
  // },
] as Array<{
  id: number;
  title: string;
  caption: string | null;
  imageUrl: string;
  memoryDate: string | null;
  createdAt: string;
  updatedAt: string;
}>;

export const BUCKET_LIST = [
  { id: 1, text: "Jadi CEO", completed: false },
  // Tambah impian di sini:
  // { id: 2, text: "Liburan ke Bali bareng", completed: false },
  // { id: 3, text: "Masak bareng di dapur", completed: true },
] as Array<{
  id: number;
  text: string;
  completed: boolean;
}>;

export const SONGS = [
  {
    id: 1,
    title: "bbb",
    artist: "jj",
    person: "person1",
    audioUrl: "",  // isi dengan "/audio/lagu.mp3" atau URL eksternal
    createdAt: "2026-04-05T00:00:00.000Z",
  },
  {
    id: 2,
    title: "bn",
    artist: "nn",
    person: "person1",
    audioUrl: "",
    createdAt: "2026-04-05T00:00:00.000Z",
  },
  // Tambah lagu di sini:
  // {
  //   id: 3,
  //   title: "Judul Lagu",
  //   artist: "Nama Artis",
  //   person: "person1",  // "person1", "person2", atau "both"
  //   audioUrl: "/audio/lagu.mp3",
  //   createdAt: "2026-04-05T00:00:00.000Z",
  // },
] as Array<{
  id: number;
  title: string;
  artist: string | null;
  person: string;
  audioUrl: string | null;
  createdAt: string;
}>;

export const DIARY_ENTRIES = [
  // Tambah entri diary di sini:
  // {
  //   id: 1,
  //   content: "Hari ini aku senang banget karena...",
  //   imageUrl: "/images/diary1.jpg",  // atau null jika tidak ada foto
  //   createdAt: "2026-04-05T00:00:00.000Z",
  //   updatedAt: "2026-04-05T00:00:00.000Z",
  // },
] as Array<{
  id: number;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}>;
