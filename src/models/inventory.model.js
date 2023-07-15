import mongoose, { Schema, model } from "mongoose";
import { collectionsAndDocumentNameMongo } from "../constanst.js";

const iventorySchema = new Schema(
  {
    inventory_productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collectionsAndDocumentNameMongo.product.DOCUMENT_NAME,
    },
    inventory_location: {
      type: String,
      required: true,
    },
    inventory_stock: {
      type: Number,
      required: true,
    },
    inventory_shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collectionsAndDocumentNameMongo.shop.DOCUMENT_NAME,
    },
    inventory_reservation: {
      type: mongoose.Schema.Types.Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: collectionsAndDocumentNameMongo.inventory.COLLECTION_NAME,
  }
);

export const Inventory = model(
  collectionsAndDocumentNameMongo.inventory.DOCUMENT_NAME,
  iventorySchema
);
