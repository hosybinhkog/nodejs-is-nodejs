import mongoose from "mongoose";
import { Inventory } from "../models/index.js";

export class InventoryRepository {
  static async insert({ productId, shopId, stock, locatiton = "unKnow" }) {
    return await Inventory.create({
      inventory_productId: new mongoose.Types.ObjectId(productId),
      inventory_shopId: new mongoose.Types.ObjectId(shopId),
      inventory_location: locatiton,
      inventory_stock: stock,
    });
  }
}
