import { Schema, model } from "mongoose";
import { collectionsAndDocumentNameMongo } from "../constanst.js";

const apiKeySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: collectionsAndDocumentNameMongo.apiKey.ENUMS,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      expires: "30d",
    },
  },
  {
    timestamps: true,
    collection: collectionsAndDocumentNameMongo.apiKey.COLLECTION_NAME,
  }
);

apiKeySchema.index({ key: 1 });

export const ApiKey = model(
  collectionsAndDocumentNameMongo.apiKey.DOCUMENT_NAME,
  apiKeySchema
);
