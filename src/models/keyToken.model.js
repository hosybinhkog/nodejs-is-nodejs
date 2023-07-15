import { Schema, model } from "mongoose";
import { collectionsAndDocumentNameMongo } from "../constanst.js";

const keyTokenScheme = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: collectionsAndDocumentNameMongo.shop.DOCUMENT_NAME,
      required: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshTokens: {
      type: Array,
      default: [],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: collectionsAndDocumentNameMongo.keyToken.COLLECTION_NAME,
  }
);

export const KeyToken = model(
  collectionsAndDocumentNameMongo.keyToken.DOCUMENT_NAME,
  keyTokenScheme
);
