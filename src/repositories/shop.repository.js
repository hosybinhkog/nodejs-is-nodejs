import { NotFoundResponse } from "../middleware/index.js";
import { Shop } from "../models/index.js";

export class ShopRepository {
  static async findByEmail(
    email,
    select = { name: 1, email: 1, password: 1, roles: 1, status: 1 }
  ) {
    const shop = await Shop.findOne({ email }).select(select).lean();
    if (!shop) throw new NotFoundResponse("Not found user");
    return shop;
  }
}
