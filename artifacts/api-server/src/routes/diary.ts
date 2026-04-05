import { Router, type IRouter } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { eq, desc } from "drizzle-orm";
import { db, diaryTable } from "@workspace/db";

const uploadsDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `diary-${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Hanya file gambar yang diizinkan"));
  },
});

const router: IRouter = Router();

router.get("/diary", async (_req, res): Promise<void> => {
  const entries = await db.select().from(diaryTable).orderBy(desc(diaryTable.createdAt));
  res.json(entries);
});

router.post("/diary", upload.single("image"), async (req, res): Promise<void> => {
  const isOwner = (req.session as Record<string, unknown>)["isOwner"] === true;
  if (!isOwner) {
    res.status(401).json({ error: "Hanya pemilik yang bisa menambah diary" });
    return;
  }
  const { content } = req.body as { content?: string };
  let imageUrl: string | null = null;
  if (req.file) imageUrl = `/api/uploads/${req.file.filename}`;
  const [entry] = await db.insert(diaryTable).values({
    content: content ?? "",
    imageUrl,
  }).returning();
  res.status(201).json(entry);
});

router.patch("/diary/:id", upload.single("image"), async (req, res): Promise<void> => {
  const isOwner = (req.session as Record<string, unknown>)["isOwner"] === true;
  if (!isOwner) {
    res.status(401).json({ error: "Hanya pemilik yang bisa mengedit diary" });
    return;
  }
  const id = parseInt(req.params.id as string, 10);
  const { content } = req.body as { content?: string };
  const updateData: Record<string, unknown> = {};
  if (content !== undefined) updateData["content"] = content;
  if (req.file) updateData["imageUrl"] = `/api/uploads/${req.file.filename}`;
  const [entry] = await db.update(diaryTable).set(updateData).where(eq(diaryTable.id, id)).returning();
  if (!entry) {
    res.status(404).json({ error: "Entry tidak ditemukan" });
    return;
  }
  res.json(entry);
});

router.delete("/diary/:id", async (req, res): Promise<void> => {
  const isOwner = (req.session as Record<string, unknown>)["isOwner"] === true;
  if (!isOwner) {
    res.status(401).json({ error: "Hanya pemilik yang bisa menghapus diary" });
    return;
  }
  const id = parseInt(req.params.id as string, 10);
  const [existing] = await db.select().from(diaryTable).where(eq(diaryTable.id, id));
  if (!existing) {
    res.status(404).json({ error: "Entry tidak ditemukan" });
    return;
  }
  if (existing.imageUrl) {
    const filename = existing.imageUrl.split("/").pop();
    if (filename) {
      const filePath = path.join(uploadsDir, filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  }
  await db.delete(diaryTable).where(eq(diaryTable.id, id));
  res.sendStatus(204);
});

export default router;
