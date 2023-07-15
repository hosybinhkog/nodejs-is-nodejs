import { collectionsAndDocumentNameMongo } from "../constanst.js";
import { BadRequestErrorResponse } from "../middleware/index.js";
import {
  ClothingModel,
  ElectronicModel,
  ProductModel,
} from "../models/index.js";

export class ProductService {}

export class ProductFactory {
  static async createProduct({ type, payload }) {
    switch (type) {
      case collectionsAndDocumentNameMongo.clothing.NAME:
        return await new Clothing(payload).createProduct();
      case collectionsAndDocumentNameMongo.electronic.NAME:
        return await new Electronic(payload).createProduct();
      default:
        throw new Error("Error to create PF");
    }
  }
}

export class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
    product_slug,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_attributes = product_attributes;
    this.product_shop = product_shop;
    this.product_slug = product_slug;
  }

  async createProduct(id) {
    console.log("create product");
    return await ProductModel.create({
      ...this,
      _id: id,
    });
  }
}

export class Clothing extends Product {
  async createProduct() {
    const clothing = await ClothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!clothing)
      throw new BadRequestErrorResponse(
        "Invalid input create clothings product"
      );

    console.log("log clothings");

    const newProduct = await super.createProduct(clothing._id);
    console.log(newProduct);
    if (!newProduct)
      await new BadRequestErrorResponse("create new Clothings error");

    return newProduct;
  }
}

export class Electronic extends Product {
  async createProduct() {
    const electronic = await ElectronicModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!electronic)
      throw new BadRequestErrorResponse(
        "Invalid input create electronic product"
      );

    const newProduct = await super.createProduct(electronic._id);
    if (!newProduct)
      await new BadRequestErrorResponse("create new electronic error");

    return newProduct;
  }
}
