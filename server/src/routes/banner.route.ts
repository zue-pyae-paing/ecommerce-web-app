import { Router } from "express";
import { authMiddleware } from "../middlewares/‌auth.middleware.js";
import bannerController from "../controllers/banner.controller.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { bannerIdParamSchema, createBannerSchema, updateBannerSchema } from "../validations/banner.shcema.js";

const router =Router()

router.use(authMiddleware)


router.get("/",bannerController.getBanner)
router.post("/", adminMiddleware,upload.single("banner"),validate({body:createBannerSchema}),bannerController.createBanner)
router.put("/:id",adminMiddleware, upload.single("banner"),validate({body:updateBannerSchema,params:bannerIdParamSchema}),bannerController.updateBanner)
router.delete("/:id",adminMiddleware,validate({params:bannerIdParamSchema}),bannerController.deleteBanner)

export default router