import { Router, type IRouter } from "express";
import { LoginBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const ownerPassword = process.env["OWNER_PASSWORD"] ?? "kenangan123";
  if (parsed.data.password !== ownerPassword) {
    res.status(401).json({ error: "Password salah" });
    return;
  }

  (req.session as Record<string, unknown>)["isOwner"] = true;
  res.json({ success: true, message: "Login berhasil" });
});

router.post("/auth/logout", async (req, res): Promise<void> => {
  (req.session as Record<string, unknown>)["isOwner"] = false;
  res.json({ message: "Logout berhasil" });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const isOwner = (req.session as Record<string, unknown>)["isOwner"] === true;
  res.json({ isOwner });
});

export default router;
