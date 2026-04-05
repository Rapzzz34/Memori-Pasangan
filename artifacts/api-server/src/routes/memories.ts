import { Router, type IRouter } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { eq, desc } from "drizzle-orm";
import { db, memoriesTable } from "@workspace/db";
import {
  GetMemoryParams,
  UpdateMemoryParams,
  UpdateMemoryBody,
  DeleteMemoryParams,
} from "@workspace/api-zod";

const uploadsDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file gambar yang diizinkan"));
    }
  },
});

const router: IRouter = Router();

router.get("/memories", async (_req, res): Promise<void> => {
  const memories = await db
    .select()
    .from(memoriesTable)
    .orderBy(desc(memoriesTable.createdAt));
  res.json(memories);
});

router.post("/memories", upload.single("photo"), async (req, res): Promise<void> => {
  const isOwner = (req.session as Record<string, unknown>)["isOwner"] === true;
  if (!isOwner) {
    res.status(401).json({ error: "Hanya pemilik yang bisa menambah kenangan" });
    return;
  }

  const { title, caption, memoryDate } = req.body as { title?: string; caption?: string; memoryDate?: string };

  if (!title) {
    res.status(400).json({ error: "Judul wajib diisi" });
    return;
  }

  if (!req.file) {
    res.status(400).json({ error: "Foto wajib diunggah" });
    return;
  }

  const imageUrl = `/api/uploads/${req.file.filename}`;

  const [memory] = await db
    .insert(memoriesTable)
    .values({
      title,
      caption: caption ?? "",
      imageUrl,
      memoryDate: memoryDate ?? null,
    })
    .returning();

  res.status(201).json(memory);
});

router.get("/memories/:id", async (req, res): Promise<void> => {
  const params = GetMemoryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [memory] = await db
    .select()
    .from(memoriesTable)
    .where(eq(memoriesTable.id, params.data.id));

  if (!memory) {
    res.status(404).json({ error: "Kenangan tidak ditemukan" });
    return;
  }

  res.json(memory);
});

router.patch("/memories/:id", async (req, res): Promise<void> => {
  const isOwner = (req.session as Record<string, unknown>)["isOwner"] === true;
  if (!isOwner) {
    res.status(401).json({ error: "Hanya pemilik yang bisa mengedit kenangan" });
    return;
  }

  const params = UpdateMemoryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateMemoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.title != null) updateData["title"] = parsed.data.title;
  if (parsed.data.caption != null) updateData["caption"] = parsed.data.caption;
  if ("memoryDate" in parsed.data) updateData["memoryDate"] = parsed.data.memoryDate;

  const [memory] = await db
    .update(memoriesTable)
    .set(updateData)
    .where(eq(memoriesTable.id, params.data.id))
    .returning();

  if (!memory) {
    res.status(404).json({ error: "Kenangan tidak ditemukan" });
    return;
  }

  res.json(memory);
});

router.delete("/memories/:id", async (req, res): Promise<void> => {
  const isOwner = (req.session as Record<string, unknown>)["isOwner"] === true;
  if (!isOwner) {
    res.status(401).json({ error: "Hanya pemilik yang bisa menghapus kenangan" });
    return;
  }

  const params = DeleteMemoryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [existing] = await db
    .select()
    .from(memoriesTable)
    .where(eq(memoriesTable.id, params.data.id));

  if (!existing) {
    res.status(404).json({ error: "Kenangan tidak ditemukan" });
    return;
  }

  const filename = existing.imageUrl.split("/").pop();
  if (filename) {
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  await db.delete(memoriesTable).where(eq(memoriesTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
