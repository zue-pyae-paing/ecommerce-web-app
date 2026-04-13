import { Router } from "express";
import { authMiddleware } from "../middlewares/‌auth.middleware.js";
import addressController from "../controllers/address.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { addressIdParamsSchema, createAddressSchema } from "../validations/address.schema.js";

const router = Router();

router.use(authMiddleware);

router.get("/", addressController.getAllAddress);
router.get("/:id", validate({params:addressIdParamsSchema}), addressController.getOneAddress);
router.post("/",validate({body:createAddressSchema}), addressController.createAddress);
router.delete("/:id", validate({params:addressIdParamsSchema}), addressController.deleteAddress);

export default router;