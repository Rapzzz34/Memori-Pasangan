import { Router, type IRouter } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { eq, asc } from "drizzle-orm";
import { db, songsTable } from "@workspace/db";

const uploadsDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const audioStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `audio-${unique}${ext}`);
  },
});

const uploadAudio = multer({
  storage: audioStorage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("audio/")) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file audio yang diizinkan"));
    }
  },
});

const router: IRouter = Router();

router.get("/songs", async (_req, res): Promise<void> => {
  const songs = await db.select().from(songsTable).orderBy(asc(songsTable.createdAt));
  res.json(songs);
});

router.post("/songs", uploadAudio.single("audio"), async (req, res): Promise<void> => {
  const isOwner = (req.session as Record<string, unknown>)["isOwner"] === true;
  if (!isOwner) {
    res.status(401).json({ error: "Hanya pemilik yang bisa menambah lagu" });
    return;
  }
  const { title, artist, person } = req.body as { title?: string; artist?: string; person?: string };
  if (!title?.trim()) {
    res.status(400).json({ error: "Judul lagu wajib diisi" });
    return;
  }
  let audioUrl: string | null = null;
  if (req.file) {
    audioUrl = `/api/uploads/${req.file.filename}`;
  }
  const [song] = await db.insert(songsTable).values({
    title: title.trim(),
    artist: artist?.trim() ?? "",
    audioUrl,
    person: person ?? "both",
  }).returning();
  res.status(201).json(song);
});

router.delete("/songs/:id", async (req, res): Promise<void> => {
  const isOwner = (req.session as Record<string, unknown>)["isOwner"] === true;
  if (!isOwner) {
    res.status(401).json({ error: "Hanya pemilik yang bisa menghapus lagu" });
    return;
  }
  const id = parseInt(req.params.id as string, 10);
  const [existing] = await db.select().from(songsTable).where(eq(songsTable.id, id));
  if (!existing) {
    res.status(404).json({ error: "Lagu tidak ditemukan" });
    return;
  }
  if (existing.audioUrl) {
    const filename = existing.audioUrl.split("/").pop();
    if (filename) {
      const filePath = path.join(uploadsDir, filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  }
  await db.delete(songsTable).where(eq(songsTable.id, id));
  res.sendStatus(204);
});

export default router;
