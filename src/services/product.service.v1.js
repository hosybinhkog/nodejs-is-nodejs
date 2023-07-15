import { collectionsAndDocumentNameMongo } from "../constanst.js";
import { BadRequestErrorResponse } from "../middleware/index.js";
import {
  ClothingModel,
  ElectronicModel,
  ProductModel,
} from "../models/index.js";
import { ClothingsRepository } from "../repositories/clothings.product.repository.js";
import { InventoryRepository } from "../repositories/inventory.repository.js";
import { ProductRepository } from "../repositories/product.repository.js";
import {
  getSelectData,
  getUnSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
} from "../utils/index.js";

export class ProductService {}

export class ProductFactoryV1 {
  static productRegistry = {};
  static registerProducType(type, classRef) {
    ProductFactoryV1.productRegistry[type] = classRef;
  }
  static async createProduct({ type, payload }) {
    const productClass = ProductFactoryV1.productRegistry[type];
    if (!productClass)
      throw new BadRequestErrorResponse("Type product is not defined");
    return await new productClass(payload).createProduct();
  }

  static async findByDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    const products = await ProductRepository.findAllDraftForShp({
      query,
      limit,
      skip,
    });

    return {
      products,
      size: products.length,
    };
  }

  static async findByUnDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: false };
    const products = await ProductRepository.findAllUnDraftForShop({
      query,
      limit,
      skip,
    });

    return {
      products,
      size: products.length,
    };
  }

  static async publishedProducByShop({ product_shop, product_id }) {
    if (!product_id || !product_shop) throw new BadRequestErrorResponse();
    const product = await ProductRepository.findOneByShop({
      product_shop,
      product_id,
    });

    if (product.isPublished)
      throw new BadRequestErrorResponse("product is published");

    product.isPublished = true;
    product.isDraft = false;
    const { modifiedCount } = await product.updateOne(product);
    return modifiedCount;
  }

  static async unPublishedProducByShop({ product_shop, product_id }) {
    console.log("hello api unblish");
    if (!product_id || !product_shop) throw new BadRequestErrorResponse();
    const product = await ProductRepository.findOneByShop({
      product_shop,
      product_id,
    });

    if (!product.isPublished)
      throw new BadRequestErrorResponse("product is unpublished");

    product.isPublished = false;
    product.isDraft = true;
    // await product.save();
    // return product;
    const { modifiedCount } = await product.updateOne(product);
    return modifiedCount;
  }

  static async searchProduct({ keySearch }) {
    return await ProductRepository.findSearch({ keySearch });
  }

  static async findAllProduct({
    limit = 100,
    sort = "ctime",
    page = 1,
    filter = {
      isPublished: true,
    },
    select = ["product_name", "product_price", "product_thumb"],
  }) {
    return await ProductRepository.findAll({
      limit,
      sort,
      page,
      filter,
      select: getSelectData(select),
    });
  }

  static async findProduct({ product_id, unselect }) {
    console.log(getUnSelectData(unselect), unselect);
    return await ProductRepository.findById({
      product_id,
      unselect: getUnSelectData(unselect),
    });
  }

  static async updateProduct({ product_id, body, type }) {
    const productClass = ProductFactoryV1.productRegistry[type];
    if (!productClass)
      throw new BadRequestErrorResponse("Type product is not defined");
    return await new productClass(body).updateProduct({ product_id });
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
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_attributes = product_attributes;
    this.product_shop = product_shop;
    // this.product_slug = product_slug;
  }

  async createProduct(id) {
    console.log("create product");
    const newProduct = await ProductModel.create({
      ...this,
      _id: id,
    });

    await InventoryRepository.insert({
      productId: newProduct._id,
      shopId: this.product_shop,
      stock: this.product_quantity,
    });

    return newProduct;
  }
  async updateProduct({ product_id, body }) {
    return await ProductRepository.update({
      product_id,
      body,
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

    const newProduct = await super.createProduct(clothing._id);
    console.log(newProduct);
    if (!newProduct)
      await new BadRequestErrorResponse("create new Clothings error");

    return newProduct;
  }

  async updateProduct({ product_id }) {
    const objParams = removeUndefinedObject(this);
    if (objParams.product_attributes) {
      console.log(
        "updateNestedObjectParser(objParams)",
        updateNestedObjectParser(objParams.product_attributes)
      );
      await ProductRepository.update({
        model: ClothingModel,
        body: updateNestedObjectParser(objParams.product_attributes),
        product_id,
      });
    }

    console.log(objParams);
    console.log("product_1", updateNestedObjectParser(objParams));
    const updateProduct = await super.updateProduct({
      product_id,
      body: updateNestedObjectParser(objParams),
    });

    return updateProduct;
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

  async updateProduct({ product_id }) {
    const objParams = removeUndefinedObject(this);
    if (objParams.product_attributes) {
      await ProductRepository.update({
        model: ElectronicModel,
        body: updateNestedObjectParser(objParams.product_attributes),
        product_id,
      });
    }

    const updateProduct = await super.updateProduct({
      product_id,
      body: updateNestedObjectParser(objParams),
    });

    console.log("return product update", updateProduct);

    return updateProduct;
  }
}

ProductFactoryV1.registerProducType(
  collectionsAndDocumentNameMongo.electronic.NAME,
  Electronic
);
ProductFactoryV1.registerProducType(
  collectionsAndDocumentNameMongo.clothing.NAME,
  Clothing
);
