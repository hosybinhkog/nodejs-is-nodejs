import express from "express";
import { accessController } from "../../controllers/index.js";
import { authenticate } from "../../auth/authenticate.js";

const accessRouter = express.Router();

accessRouter.post("/signup", accessController.signUp);
accessRouter.post("/signin", accessController.signin);
accessRouter.get("/logout", authenticate, accessController.logout);
accessRouter.post(
  "/handle-refreshtoken",
  authenticate,
  accessController.handleRefreshToken
);

export default accessRouter;
