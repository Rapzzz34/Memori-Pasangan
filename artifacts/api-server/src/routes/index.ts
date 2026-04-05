import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import memoriesRouter from "./memories";
import settingsRouter from "./settings";
import bucketListRouter from "./bucket-list";
import songsRouter from "./songs";
import diaryRouter from "./diary";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(memoriesRouter);
router.use(settingsRouter);
router.use(bucketListRouter);
router.use(songsRouter);
router.use(diaryRouter);

export default router;
