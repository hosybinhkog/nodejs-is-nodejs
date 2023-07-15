import { ApiKey } from "../models/index.js";
import crypto from "node:crypto";

export class ApiKeyRepository {
  static async findOne(key) {
    return await ApiKey.findOne({ key, status: true }).lean();
  }

  static async create(permissions = ["0000"]) {
    return await ApiKey.create({
      key: crypto.randomBytes(20).toString("hex"),
      permissions,
    });
  }
}
