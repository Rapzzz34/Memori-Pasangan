import { Router, type IRouter } from "express";
import { db, siteSettingsTable } from "@workspace/db";
import { UpdateSettingsBody } from "@workspace/api-zod";

const router: IRouter = Router();

async function ensureSettings() {
  const [existing] = await db.select().from(siteSettingsTable).limit(1);
  if (!existing) {
    const [created] = await db.insert(siteSettingsTable).values({
      person1Name: "Namamu",
      person2Name: "Nama Dia",
      loveDate: null,
      loveMessage: "Terima kasih sudah hadir dalam hidupku. Setiap momen bersamamu adalah kenangan yang berharga.",
      coverImageUrl: null,
    }).returning();
    return created;
  }
  return existing;
}

router.get("/settings", async (_req, res): Promise<void> => {
  const settings = await ensureSettings();
  res.json(settings);
});

router.patch("/settings", async (req, res): Promise<void> => {
  const isOwner = (req.session as Record<string, unknown>)["isOwner"] === true;
  if (!isOwner) {
    res.status(401).json({ error: "Hanya pemilik yang bisa mengubah pengaturan" });
    return;
  }

  const parsed = UpdateSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  await ensureSettings();

  const updateData: Record<string, unknown> = {};
  if (parsed.data.person1Name != null) updateData["person1Name"] = parsed.data.person1Name;
  if (parsed.data.person2Name != null) updateData["person2Name"] = parsed.data.person2Name;
  if ("loveDate" in parsed.data) updateData["loveDate"] = parsed.data.loveDate;
  if (parsed.data.loveMessage != null) updateData["loveMessage"] = parsed.data.loveMessage;
  if ("person1Birthday" in parsed.data) updateData["person1Birthday"] = parsed.data.person1Birthday;
  if ("person2Birthday" in parsed.data) updateData["person2Birthday"] = parsed.data.person2Birthday;

  const [settings] = await db
    .update(siteSettingsTable)
    .set(updateData)
    .returning();

  res.json(settings);
});

export default router;
