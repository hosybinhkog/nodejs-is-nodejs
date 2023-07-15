import path from "path";
import { createStream } from "rotating-file-stream";

import appRoot from "app-root-path";

export const accessLogStream = createStream("access.log", {
  interval: "1d",
  path: path.join(appRoot.path.toString(), "logs"),
});
