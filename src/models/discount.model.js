import mongoose, { Schema, model, mongo } from "mongoose";
import { collectionsAndDocumentNameMongo } from "../constanst.js";

const discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      required: true,
      default: "fixed_amount",
    },
    discount_value: {
      type: Number,
      required: true,
    },
    discount_code: {
      type: String,
      required: true,
    },
    discount_start_date: {
      type: Date,
      required: true,
    },
    discount_end_date: {
      type: Date,
      required: true,
    },
    discount_max_uses: {
      type: Number,
      required: true,
    },
    discount_uses_count: {
      type: Number,
      required: true,
      default: 0,
    },
    discount_users_used: {
      type: mongoose.Schema.Types.Array,
      default: [],
    },
    discount_max_uses_per_user: {
      type: Number,
      required: true,
    },
    discount_min_order_value: {
      type: Number,
      required: true,
    },
    discount_max_value: {
      type: Number,
    },
    discount_shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collectionsAndDocumentNameMongo.shop.DOCUMENT_NAME,
    },
    discount_is_active: {
      type: Boolean,
      default: true,
    },
    discount_apply_to: {
      type: String,
      required: true,
      enum: collectionsAndDocumentNameMongo.discount.DISCOUNT_APPLIES_TO_ENUMS,
    },
    discount_product_ids: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: collectionsAndDocumentNameMongo.discount.COLLECTION_NAME,
  }
);

export const Discount = model(
  collectionsAndDocumentNameMongo.discount.DOCUMENT_NAME,
  discountSchema
);
