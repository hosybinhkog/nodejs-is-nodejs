import { ErrorHandler } from "../helpers/index.js";

export const errorHandlerMiddleware = (err, _, res, _next) => {
  err.code = err.code || 500;
  err.message = err.message || "Error server internal";

  if (err.name === "CastError") {
    const message = "Resource not found Invalid:" + err.path;
    err = new ErrorHandler(message, 404);
  }

  if (err.code === 11000) {
    const message = "email is doulecap";
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "jsonWebTokenError") {
    const message = "Json web token is valid try again.";
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "TokenExpiredError") {
    const message = "TokenExpiredError.";
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "ValidationError") {
    let message = "";
    Object.values(err.errors).map((val) => message.concat(val.message + "\n"));
    err = new ErrorHandler(message, 400);
  }

  return res.status(err.code).json({
    success: false,
    message: err.message,
    code: err.code,
  });
};
