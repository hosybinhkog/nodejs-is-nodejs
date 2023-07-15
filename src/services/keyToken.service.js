import mongoose from "mongoose";
import { NotFoundResponse } from "../middleware/index.js";
import { KeyToken } from "../models/index.js";

export class KeyTokenService {
  static createKeyToken = async (
    userId,
    publiccKeyToken,
    privateKey,
    refreshToken
  ) => {
    try {
      // const token = await KeyToken.create({
      //   user: new mongoose.Types.ObjectId(userId),
      //   publicKey: publiccKeyToken,
      //   privateKey,
      // });

      // console.log(token);

      const filter = { user: new mongoose.Types.ObjectId(userId) };
      const update = {
        privateKey,
        publicKey: publiccKeyToken,
        resfreshTokens: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };
      const tokens = await KeyToken.findOneAndUpdate(filter, update, options);
      console.log(tokens);
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static async findByUserId(userId) {
    const keyToken = await KeyToken.findOne({
      user: new mongoose.Types.ObjectId(userId),
    });

    if (!keyToken) throw new NotFoundResponse("Not found token");
    return keyToken;
  }

  static removeKeyById = async (id) => {
    return await KeyToken.findByIdAndDelete(id);
  };

  static findByRefreshTokenUsed = async ({ refreshTokens }) => {
    return await KeyToken.findOne({ refreshTokens }).lean();
  };

  static findByRefreshToken = async ({ refreshToken }) => {
    return await KeyToken.findOne({ refreshToken });
  };

  static deleteByUserId = async (userId) => {
    return await KeyToken.findOneAndDelete({
      user: new mongoose.Types.ObjectId(userId),
    }).lean();
  };
}
