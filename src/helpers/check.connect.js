import mongoose from "mongoose";
import os from "os";

export const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Num connections to mongoDB:::${numConnection}`);
};

const _SECONDS = 10000;

export const checkOverLoad = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsaged = process.memoryUsage().rss;

    const maxConnection = 5 * numCores;
    if (numConnection > maxConnection) {
      console.log(`over load numm connection ${numConnection}`);
    }
    console.log(`Memories usaged ${memoryUsaged / 1024 / 1024}mb`);
  }, _SECONDS);
};
