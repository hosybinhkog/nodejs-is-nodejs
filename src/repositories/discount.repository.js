import { NotFoundResponse } from "../middleware/index.js";
import { Discount } from "../models/index.js";
import { getSelectData, getUnSelectData } from "../utils/index.js";

export class DiscountRepository {
  static async findOne({ filter, message = "Not found discount" }) {
    const discount = await Discount.findOne({
      ...filter,
    });

    if (!discount) throw new NotFoundResponse(message);
    return discount;
  }

  static async create({ payload }) {
    return await Discount.create(payload);
  }

  static async findAllDiscountCodesUnSelect({
    limit,
    page,
    sort,
    filter,
    unselect,
    model = Discount,
  }) {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

    return await model
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sortBy)
      .select(getUnSelectData(unselect))
      .lean();
  }

  static async findAllDiscountCodesSelect({
    limit,
    page,
    sort,
    filter,
    select,
    model = Discount,
  }) {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

    return await model
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sortBy)
      .select(getSelectData(select))
      .lean();
  }
}
