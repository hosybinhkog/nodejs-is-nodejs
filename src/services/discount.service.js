import { HttpStatus } from "../enums/http-status.enum.js";
import {
  BadRequestErrorResponse,
  ErrorResponse,
  NotFoundResponse,
} from "../middleware/index.js";
import {
  DiscountRepository,
  ProductRepository,
} from "../repositories/index.js";
import { convertObjectIdMongoose } from "../utils/index.js";

export class DiscountService {
  static async create({
    discount_code,
    discount_start_date,
    discount_end_date,
    discount_name,
    discount_description,
    discount_type = "fixed_amount",
    discount_value,
    discount_uses_count,
    discount_apply_to,
    discount_product_ids,
    discount_min_order_value,
    discount_max_uses_per_user,
    discount_shopId,
    discount_max_value,
    discount_users_used,
  }) {
    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date) ||
      new Date(discount_end_date) < new Date(discount_start_date)
    ) {
      throw new BadRequestErrorResponse("date invalid");
    }

    const foundDiscount = await DiscountRepository.findOne({
      filter: {
        discount_code,
        discount_shopId: convertObjectIdMongoose(discount_shopId),
      },
    });

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestErrorResponse("Discount is already");
    }

    const newDiscount = await DiscountRepository.create({
      payload: {
        discount_name,
        discount_description,
        discount_type,
        discount_code,
        discount_value,
        discount_min_order_value,
        discount_max_value,
        discount_min_order_value,
        discount_end_date: new Date(discount_end_date),
        discount_start_date: new Date(discount_start_date),
        discount_max_uses,
        discount_uses_count,
        discount_users_used,
        discount_shopId: convertObjectIdMongoose(discount_shopId),
        discount_max_uses_per_user,
        discount_is_active,
        discount_apply_to,
        discount_product_ids:
          discount_apply_to === "all" ? [] : discount_product_ids,
      },
    });

    if (!newDiscount)
      throw new ErrorResponse(
        "Error to create discount",
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    return newDiscount;
  }

  static async update() {}

  static async getAllDiscountCodeWithProduct({
    discount_code,
    discount_shopId,
    userId,
    limit,
    page,
  }) {
    const foundDiscount = await DiscountRepository.findOne({
      filter: {
        discount_code,
        discount_shopId: convertObjectIdMongoose(discount_shopId),
      },
    });

    if (!foundDiscount || !foundDiscount.discount_is_active)
      throw new NotFoundResponse();

    const { discount_apply_to, discount_product_ids } = foundDiscount;
    let products = [];
    if (discount_apply_to === "all") {
      products = await ProductRepository.findAll({
        filter: {
          product_shop: convertObjectIdMongoose(discount_shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    if (discount_apply_to === "specific") {
      products = await ProductRepository.findAll({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    return products;
  }

  static async getAllDiscountCodesByShop({
    limit = 10,
    page = 0,
    sort = "ctime",
    shopId,
  }) {
    const discounts = await DiscountRepository.findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      sort,
      filter: {
        discount_shopId: convertObjectIdMongoose(shopId),
        discount_is_active: true,
      },
      unselect: ["__v", "discount_shopId"],
    });

    return discounts;
  }

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await DiscountRepository.findOne({
      filter: {
        discount_code: codeId,
        discount_shopId: convertObjectIdMongoose(shopId),
      },
      message: "Not found discount amount",
    });

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_users_used,
    } = foundDiscount;

    if (!discount_is_active) throw new NotFoundResponse("discount exprires");
    if (!discount_max_uses) throw new NotFoundResponse("discount are out!!");

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new NotFoundResponse("discount exprires");
    }
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((pre, current) => {
        return pre + current.product_price * current.product_quantity;
      }, 0);

      if (totalOrder < discount_min_order_value)
        throw new BadRequestErrorResponse("total product < min order value");
    }

    if (discount_max_uses_per_user > 0) {
      const userUseDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );

      if (userUseDiscount) {
      }
    }
    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    const foundDiscount = await DiscountRepository.findOne({
      filter: {
        discount_code: codeId,
        discount_shopId: convertObjectIdMongoose(shopId),
      },
      message: "Not found discount amount",
    });

    const deleted = await foundDiscount.deleteOne();

    return deleted;
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await DiscountRepository.findOne({
      filter: {
        discount_code: codeId,
        discount_shopId: convertObjectIdMongoose(shopId),
      },
      message: "Not found discount amount",
    });

    foundDiscount.updateOne({
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });

    return result;
  }
}
