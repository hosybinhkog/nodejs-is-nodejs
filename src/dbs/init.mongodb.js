import dotenv from "dotenv";
import mongoose from "mongoose";
import { checkOverLoad, countConnect } from "../helpers/index.js";

dotenv.config();

const urlConnectMongoDBStr = process.env.URL_MONGODB || "";

class Database {
  constructor() {
    // checkOverLoad();
    this.connect();
  }

  connect(type = "mongodb") {
    if (true) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(urlConnectMongoDBStr)
      .then(() => {
        countConnect();
        console.log(`connect db successfully`);
      })
      .catch((err) => {
        console.log("connect db error:::", err);
        process.exit(1);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

export default Database.getInstance();
