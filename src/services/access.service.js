import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { createTokenPair, verifyToken } from "../auth/authUtils.js";
import { rolesShop } from "../constanst.js";
import { ErrorHandler } from "../helpers/index.js";
import {
  AuthFailResponse,
  BadRequestErrorResponse,
  ForbiddenResponse,
  NotFoundResponse,
} from "../middleware/index.js";
import { Shop } from "../models/index.js";
import { ShopRepository } from "../repositories/index.js";
import { getInfoData } from "../utils/index.js";
import { KeyTokenService } from "./keyToken.service.js";

export class AccessService {
  static signUp = async ({ name, email, password }) => {
    const holderShop = await Shop.findOne({ email }).lean();

    if (holderShop) {
      // throw BadRequestError();
      throw new BadRequestErrorResponse();
    }

    const passwordHash = await bcrypt.hash(password, 16);

    const shop = await Shop.create({
      name,
      email,
      password: passwordHash,
      roles: [rolesShop.SHOP],
    });

    if (!shop) {
      throw new ErrorHandler("Create shop error");
    }

    // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    //   modulusLength: 4096,
    //   publicKeyEncoding:
    //     type: "pkcs1",
    //     format: "pem",
    //   },
    //   privateKeyEncoding: {
    //     type: "pkcs1",
    //     format: "pem",
    //   },
    // });

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    // const publiccKeyTokenString = await KeyTokenService.createKeyToken(
    //   shop._id,
    //   publicKey,
    //   privateKey
    // );

    // const publicKeyCrypto = crypto.createPublicKey(publiccKeyTokenString);

    const tokens = await createTokenPair(
      {
        userId: shop._id,
        email: shop.email,
      },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken(
      shop._id,
      publicKey,
      privateKey,
      tokens.refreshToken
    );

    return {
      code: "xxxx",
      message: "create shop success" + shop._id,
      tokens,
      metadata: getInfoData(shop, ["_id", "name", "email"]),
    };
  };

  static async login({ body, refreshToken = null }) {
    const { email, password } = body;
    if (!email || !password) throw new BadRequestErrorResponse();
    const shop = await ShopRepository.findByEmail(email);

    const isValidPassword = await bcrypt.compare(password, shop.password);
    if (!isValidPassword)
      throw new BadRequestErrorResponse("Wrong password or email");

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokenPair(
      {
        userId: shop._id,
        email: shop.email,
      },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken(
      shop._id,
      publicKey,
      privateKey,
      tokens.refreshToken
    );

    return {
      tokens,
      shop,
    };
  }

  static async logout({ keyStore }) {
    await KeyTokenService.removeKeyById(keyStore._id);

    return true;
  }

  static async handleRefreshToken({ refreshToken }) {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed({
      refreshTokens: refreshToken,
    });
    console.log("foundToken", foundToken);

    if (foundToken) {
      const { userId, email } = verifyToken(
        refreshToken,
        foundToken.privateKey
      );

      console.log(userId, email);
      await KeyTokenService.deleteByUserId(userId);
      throw new ForbiddenResponse("Tokennn !!!");
    }

    const holderToken = await KeyTokenService.findByRefreshToken({
      refreshToken,
    });

    console.log("holderToken", holderToken);
    console.log("refreshToken", refreshToken);

    if (!holderToken) throw new AuthFailResponse("Shop not registerd!");

    const { userId, email } = await verifyToken(
      refreshToken,
      holderToken.privateKey
    );

    console.log(userId, email);
    await ShopRepository.findByEmail(email);

    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokens: refreshToken,
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  }

  static async handleRefreshTokenV2({ refreshToken, user, keyStore }) {
    const { userId, email } = user;

    if (keyStore.refreshTokens.includes(refreshToken)) {
      await KeyTokenService.deleteByUserId(userId);
      throw new ForbiddenResponse("Somethins wrong happend !! please  relogin");
    }

    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailResponse("Shop not registerd!");

    const shop = await ShopRepository.findByEmail(email);

    if (!shop) throw new AuthFailResponse("shop not règister");

    // const shopTokens = await KeyTokenService.findByRefreshToken({
    //   refreshToken,
    // });

    // if (!shopTokens) throw new NotFoundResponse("shop not found");

    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokens: refreshToken,
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  }
}
