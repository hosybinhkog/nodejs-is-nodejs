import express from "express";
import accessRouter from "./access/index.js";
import productRouter from "./product/index.js";
import discountRouter from "./discount/index.js";

const router = express.Router();

router.get("/PING", (_, res) => {
  res.send({
    message: "PONG",
  });
});

router.use("/access/shop/", accessRouter);
router.use("/product", productRouter);
router.use("/discount", discountRouter);

export default router;
