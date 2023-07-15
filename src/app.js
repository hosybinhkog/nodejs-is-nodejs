import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import monitor from "express-status-monitor";
import { accessLogStream } from "./utils/index.js";
import router from "./routes/index.js";
import compression from "compression";
import { apiKeyController } from "./controllers/index.js";
import { ApiKeyService } from "./services/index.js";
import { errorHandlerMiddleware } from "./middleware/index.js";

const app = express();

const MODE_DEV = process.env.MODE === "production" ? "production" : "dev";

app.use(helmet());
app.use(cors());
app.use(
  MODE_DEV === "production"
    ? morgan("combined", {
        stream: accessLogStream,
      })
    : morgan("dev")
);
// app.use(
//   monitor({
//     healthChecks: [
//       {
//         protocol: "http",
//         host: "localhost",
//         path: "/api/v1/product/draft/all",
//         port: "4333",
//       },
//     ],
//   })
// );
app.use(compression());

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// app.use("/api-key", apiKeyController.create); // TEST CREATE API KEY HEADER KEY
app.use(apiKeyController.apiKey);
app.use(ApiKeyService.permission("0000"));
app.use("/api/v1", router);
app.use(errorHandlerMiddleware);
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Page not found",
    success: false,
  });
});

import "./dbs/init.mongodb.js";

export default app;
