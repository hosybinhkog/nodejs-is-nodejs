import { Schema, model } from "mongoose";
import { collectionsAndDocumentNameMongo } from "../constanst.js";

const shopSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    verify: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: collectionsAndDocumentNameMongo.shop.COLLECTION_NAME,
  }
);

shopSchema.index({ name: 1, type: -1 });

export const Shop = model(
  collectionsAndDocumentNameMongo.shop.DOCUMENT_NAME,
  shopSchema
);
