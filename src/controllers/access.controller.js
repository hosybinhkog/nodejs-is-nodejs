import { HttpStatus, ReasonPhrases } from "../enums/index.js";
import {
  OkeResponse,
  SuccessResponse,
  catchAsyncError,
} from "../middleware/index.js";
import { AccessService } from "../services/index.js";

class AccessController {
  signUp = catchAsyncError(async (req, res) => {
    new OkeResponse({
      message: "create success",
      metadata: await AccessService.signUp({ ...req.body }),
    }).send(res);
  });

  signin = catchAsyncError(async (req, res) => {
    new SuccessResponse({
      message: "Login success",
      statusCode: HttpStatus.CREATED,
      metadata: await AccessService.login({ body: req.body }),
      reasonStatusCode: ReasonPhrases.CREATED,
    }).send(res);
  });

  logout = catchAsyncError(async (req, res) => {
    new SuccessResponse({
      metadata: await AccessService.logout({ keyStore: req.keyStore }),
      message: "logout success",
      statusCode: HttpStatus.OK,
    }).send(res);
  });

  handleRefreshToken = catchAsyncError(async (req, res, _next) => {
    new SuccessResponse({
      message: "success handle refresh token",
      metadata: await AccessService.handleRefreshTokenV2(req),
    }).send(res);
  });
}

export const accessController = new AccessController();
