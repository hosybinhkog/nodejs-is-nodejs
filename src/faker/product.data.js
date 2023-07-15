import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import { ProductModel } from "../models/index.js";

mongoose.connect("mongodb://localhost:27017/hardv1", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const genrateData = async (num) => {
  const body = {
    product_name: faker.commerce.product(),
    product_description: faker.string.sample(),
    product_price: faker.number.int({ min: 10 }),
    product_shop: new mongoose.Types.ObjectId("649d1fba58a3d239bed28b43"),
    product_type: "clothings",
    product_thumb: faker.image.url({ width: 1920, height: 1080 }),
    product_quantity: faker.number.int({ min: 1, max: 5 }),
    product_attributes: {
      brand: faker.commerce.productName(),
      size: faker.number.int({ max: 10, min: 1 }).toString(),
      material: faker.commerce.productMaterial(),
    },
  };

  for (let i = 0; i < num; i++) {
    await ProductModel.create(body);
  }

  console.log("success");
};

// genrateData(10000);

const publishedProduct = async () => {
  const products = await ProductModel.find({ isPublished: false });
  products.forEach(async (product) => {
    product.isPublished = true;
    product.isDraft = false;
    const { modifiedCount } = await product.updateOne(product);
    console.log(modifiedCount);
  });
};

publishedProduct();
