import { Router, type IRouter } from "express";
import { db, siteSettingsTable } from "@workspace/db";

const router: IRouter = Router();

router.post("/auth/login", async (req, res): Promise<void> => {
  const { password } = req.body as { password?: string };
  if (!password) {
    res.status(400).json({ error: "Password wajib diisi" });
    return;
  }

  const [settings] = await db.select().from(siteSettingsTable).limit(1);

  const p1Password = settings?.person1Password ?? process.env["PERSON1_PASSWORD"] ?? "kenangan1";
  const p2Password = settings?.person2Password ?? process.env["PERSON2_PASSWORD"] ?? "kenangan2";

  let personId: number | null = null;
  if (password === p1Password) {
    personId = 1;
  } else if (password === p2Password) {
    personId = 2;
  } else {
    res.status(401).json({ error: "Kode salah" });
    return;
  }

  const session = req.session as unknown as Record<string, unknown>;
  session["isOwner"] = true;
  session["personId"] = personId;
  res.json({ success: true, message: "Login berhasil" });
});

router.post("/auth/logout", async (req, res): Promise<void> => {
  const session = req.session as unknown as Record<string, unknown>;
  session["isOwner"] = false;
  session["personId"] = null;
  res.json({ message: "Logout berhasil" });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const session = req.session as unknown as Record<string, unknown>;
  const isOwner = session["isOwner"] === true;
  const personId = isOwner ? (session["personId"] as number | null) ?? null : null;
  res.json({ isOwner, personId });
});

export default router;
