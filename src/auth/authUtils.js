import jwt from "jsonwebtoken";

export const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const acccessToken = await jwt.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = await jwt.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    // jwt.verify(acccessToken, publicKey, (err, decode) => {
    //   if (err) {
    //     console.log(err);
    //   }

    //   console.log(decode);
    // });

    return { acccessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
};

export const verifyToken = async (token, secret) => {
  return await jwt.verify(token, secret);
};
