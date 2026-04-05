import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, bucketListTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/bucket-list", async (_req, res): Promise<void> => {
  const items = await db.select().from(bucketListTable).orderBy(asc(bucketListTable.createdAt));
  res.json(items);
});

router.post("/bucket-list", async (req, res): Promise<void> => {
  const isOwner = (req.session as Record<string, unknown>)["isOwner"] === true;
  if (!isOwner) {
    res.status(401).json({ error: "Hanya pemilik yang bisa menambah impian" });
    return;
  }
  const { text } = req.body as { text?: string };
  if (!text?.trim()) {
    res.status(400).json({ error: "Teks wajib diisi" });
    return;
  }
  const [item] = await db.insert(bucketListTable).values({ text: text.trim() }).returning();
  res.status(201).json(item);
});

router.patch("/bucket-list/:id", async (req, res): Promise<void> => {
  const isOwner = (req.session as Record<string, unknown>)["isOwner"] === true;
  if (!isOwner) {
    res.status(401).json({ error: "Hanya pemilik yang bisa mengedit impian" });
    return;
  }
  const id = parseInt(req.params.id as string, 10);
  const { completed, text } = req.body as { completed?: boolean; text?: string };
  const updateData: Record<string, unknown> = {};
  if (completed !== undefined) updateData["completed"] = completed;
  if (text !== undefined) updateData["text"] = text;
  const [item] = await db.update(bucketListTable).set(updateData).where(eq(bucketListTable.id, id)).returning();
  if (!item) {
    res.status(404).json({ error: "Impian tidak ditemukan" });
    return;
  }
  res.json(item);
});

router.delete("/bucket-list/:id", async (req, res): Promise<void> => {
  const isOwner = (req.session as Record<string, unknown>)["isOwner"] === true;
  if (!isOwner) {
    res.status(401).json({ error: "Hanya pemilik yang bisa menghapus impian" });
    return;
  }
  const id = parseInt(req.params.id as string, 10);
  await db.delete(bucketListTable).where(eq(bucketListTable.id, id));
  res.sendStatus(204);
});

export default router;
