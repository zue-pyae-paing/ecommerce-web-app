import { Router } from "express";
import { authMiddleware } from "../middlewares/‌auth.middleware";
import bannerController from "../controllers/banner.controller";
import { adminMiddleware } from "../middlewares/admin.middleware";

const router =Router()

router.use(authMiddleware)


router.get("/",bannerController.getBanner)
router.post("/", adminMiddleware,bannerController.createBanner)
router.put("/:id",adminMiddleware,bannerController.updateBanner)
router.delete("/:id",adminMiddleware,bannerController.deleteBanner)

export default router