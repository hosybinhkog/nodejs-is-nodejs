import express from "express";
import { prodcutController } from "../../controllers/index.js";
import { authenticate } from "../../auth/authenticate.js";

const productRouter = express.Router();
productRouter.get("/", prodcutController.getAllProduct);
productRouter.get("/search", prodcutController.searchProduct);

productRouter.post("/", authenticate, prodcutController.createProduct);
productRouter.get(
  "/draft/all",
  authenticate,
  prodcutController.getAllDraftsForShop
);
productRouter.get(
  "/undraft/all",
  authenticate,
  prodcutController.getAllUnDraftsForShop
);
productRouter.get(
  "/pulished/:id",
  authenticate,
  prodcutController.handlePulishedProductByShop
);

productRouter.get(
  "/unpublished/:id",
  authenticate,
  prodcutController.handleUnPulishedProductByShop
);

productRouter.get("/:id", prodcutController.findOneProduct);
productRouter.patch("/:id", authenticate, prodcutController.updateProduct);

export default productRouter;
