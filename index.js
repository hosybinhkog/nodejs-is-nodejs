import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";

const PORT = process.env.PORT || 4444;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("SIGINT", () => {
  server.close((error) => {
    if (error) console.log(`server error`, error.message);
    console.log(`server is close`);
    process.exit();
  });
});
