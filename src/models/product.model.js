import mongoose, { Schema, model } from "mongoose";
import { collectionsAndDocumentNameMongo } from "../constanst.js";
import slugify from "slugify";

const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: String, required: true },
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_slug: { type: String },
    product_type: {
      type: String,
      required: true,
      enum: collectionsAndDocumentNameMongo.product.ENUMS,
    },
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collectionsAndDocumentNameMongo.shop.DOCUMENT_NAME,
    },
    product_attributes: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Ratings must be above 1.0"],
      max: [5, "Ratings must be 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: collectionsAndDocumentNameMongo.product.COLLECTION_NAME,
  }
);

productSchema.index({
  product_name: "text",
  product_description: "text",
});

productSchema.pre("save", function (next) {
  if (this.product_name)
    this.product_slug = slugify(this.product_name.toString(), {
      replacement: "-", // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: true, // convert to lower case, defaults to `false`
      strict: false, // strip special characters except replacement, defaults to `false`
      locale: "vi", // language code of the locale to use
      trim: true, // trim leading and trailing replacement chars, defaults to `true`
    });
  next();
});

const clothingChema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collectionsAndDocumentNameMongo.shop.DOCUMENT_NAME,
    },
  },
  {
    timestamps: true,
    collection: collectionsAndDocumentNameMongo.clothing.COLLECTION_NAME,
  }
);

const electronicChema = new Schema(
  {
    manufacture: { type: String, required: true },
    size: String,
    color: String,
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collectionsAndDocumentNameMongo.shop.DOCUMENT_NAME,
    },
  },
  {
    timestamps: true,
    collection: collectionsAndDocumentNameMongo.electronic.COLLECTION_NAME,
  }
);

export const ProductModel = model(
  collectionsAndDocumentNameMongo.product.DOCUMENT_NAME,
  productSchema
);

export const ClothingModel = model(
  collectionsAndDocumentNameMongo.clothing.DOCUMENT_NAME,
  clothingChema
);

export const ElectronicModel = model(
  collectionsAndDocumentNameMongo.electronic.DOCUMENT_NAME,
  electronicChema
);
