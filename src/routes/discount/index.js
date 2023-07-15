import express from "express";
import { authenticate } from "../../auth/authenticate.js";
import { discountController } from "../../controllers/index.js";

const discountRouter = express.Router();

discountRouter.post("/", authenticate, discountController.create);
discountRouter.post(
  "/get-all-by-shops",
  authenticate,
  discountController.getAll
);
discountRouter.post(
  "/get-discount-amount",
  authenticate,
  discountController.getDiscountAmount
);
discountRouter.post(
  "/get-discounts-product",
  discountController.getAllDiscountCodeProducts
);

export default discountRouter;
