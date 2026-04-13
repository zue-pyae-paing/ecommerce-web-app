import { Router } from "express";
import deliveryFeeController from "../controllers/deliveryFee.controller.js";
import { authMiddleware } from "../middlewares/‌auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import {
  createDeliveryFeeSchema,
  deliveryFeeParamIdSchema,
} from "../validations/deliveryFee.schema.js";

const router = Router();
router.use(authMiddleware);

router.get("/", deliveryFeeController.getAllDeliveryFees);
router.get(
  "/:id",
  validate({ params:  deliveryFeeParamIdSchema  }),
  deliveryFeeController.getOneDeliveryFee,
);
router.post(
  "/",
  adminMiddleware,
  validate({ body: createDeliveryFeeSchema }),
  deliveryFeeController.createDeliveryFee,
);
router.put(
  "/:id",
  adminMiddleware,
  validate({
    params:  deliveryFeeParamIdSchema, body: createDeliveryFeeSchema ,
  }),
  deliveryFeeController.updateDeliveryFee,
);
router.post(
  "/apply/:id",
  validate({ params:  deliveryFeeParamIdSchema  }),
  deliveryFeeController.applyDeliveryFee,
);
router.delete(
  "/:id",
  adminMiddleware,
  validate({ params:deliveryFeeParamIdSchema} ),
  deliveryFeeController.deleteDeliveryFee,
);

export default router;
