import { AuthFailResponse, catchAsyncError } from "../middleware/index.js";
import { HEADER } from "../constanst.js";
import { KeyTokenService } from "../services/index.js";
import jwt from "jsonwebtoken";

export const authenticate = catchAsyncError(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailResponse("Invalid Request");
  const keyStore = await KeyTokenService.findByUserId(userId);

  if (req.headers[HEADER.REFRESH_TOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
      const decodeUser = await jwt.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId) {
        throw new AuthFailResponse("invalid token");
      }
      req.keyStore = keyStore;
      req.refreshToken = refreshToken;
      req.user = decodeUser;
      return next();
    } catch (error) {
      console.log("error authenticate refresh token", error);
      throw error;
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailResponse("access token failure");

  try {
    const decode = await jwt.verify(accessToken, (await keyStore).publicKey);
    if (userId !== decode.userId) {
      throw new AuthFailResponse("invalid token");
    }
    console.log("set keystore");
    req.keyStore = keyStore;
    req.user = decode;
    next();
  } catch (error) {
    console.log("error authenticate", error);
    throw error;
  }
});
