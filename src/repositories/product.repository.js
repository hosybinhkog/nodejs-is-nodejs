import mongoose from "mongoose";
import { ProductModel } from "../models/index.js";
import { NotFoundResponse } from "../middleware/index.js";

export class ProductRepository {
  static findAllDraftForShp = async ({ query, limit, skip }) => {
    return ProductRepository.find({
      query,
      limit,
      skip,
    });
  };

  static findAllUnDraftForShop = async ({ query, limit, skip }) => {
    return ProductRepository.find({
      query,
      limit,
      skip,
    });
  };

  static findOneByShop = async ({ product_shop, product_id }) => {
    const product = await ProductModel.findOne({
      product_shop: new mongoose.Types.ObjectId(product_shop),
      _id: new mongoose.Types.ObjectId(product_id),
    }).select("+isPublished");

    console.log("product", product);

    if (!product) throw new NotFoundResponse("Not found product");
    return product;
  };

  static find = async ({ query, limit, skip }) => {
    return await ProductModel.find(query)
      .populate("product_shop", "name email -_id")
      .sort({ updateAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
  };

  static findSearch = async ({ keySearch }) => {
    if (!keySearch)
      return await ProductModel.find({
        isDraft: false,
      })
        .lean()
        // .skip(0)
        // .limit(100)
        .exec();

    // Query not empty
    const regexSearch = new RegExp(keySearch);
    const results = await ProductModel.find(
      {
        isDraft: false,
        $text: { $search: regexSearch },
      },
      {
        score: { $meta: "textScore" },
      }
    )
      .sort({ score: { $meta: "textScore" } })
      // .skip(0)
      // .limit(100)
      .lean();

    console.log();

    return results;
  };

  static async findAll({ limit, sort, page, filter, select }) {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { id: 1 };
    const products = await ProductModel.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(select)
      .lean();

    return products;
  }

  static async findById({ product_id, unselect }) {
    const product = await ProductModel.findById(product_id).select(unselect);
    if (!product) throw new NotFoundResponse("not found product");
    return product;
  }

  static async findByIdAndUpadate({ product_id, body }) {
    return await ProductModel.findByIdAndUpdate(product_id, body, {
      new: true,
    });
  }

  static update = async ({
    product_id,
    body,
    model = ProductModel,
    isNew = true,
  }) => {
    const productUpdate = await model.findByIdAndUpdate(product_id, body, {
      new: isNew,
    });

    console.log("productUpdate", productUpdate);

    if (!productUpdate) throw new NotFoundResponse("product not found");

    return productUpdate;
  };
}
