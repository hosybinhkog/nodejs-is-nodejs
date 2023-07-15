import { ClothingModel } from "../models/index.js";

export class ClothingsRepository {
  static async findByIdAndUpdate({ product_id, payload }) {
    return ClothingModel.findByIdAndUpdate(product_id, payload, {
      new: true,
    });
  }
}
