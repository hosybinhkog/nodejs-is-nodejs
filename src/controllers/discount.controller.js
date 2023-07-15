import { HttpStatus } from "../enums/http-status.enum.js";
import { ReasonPhrases } from "../enums/reason-status-code.enum.js";
import { SuccessResponse, catchAsyncError } from "../middleware/index.js";
import { DiscountService } from "../services/index.js";

class DiscountController {
  create = catchAsyncError(async (req, res, _next) => {
    new SuccessResponse({
      message: "create successfully discount!!!",
      metadata: await DiscountService.create({
        ...req.body,
        discount_shopId: req.user.userId,
      }),
      statusCode: HttpStatus.CREATED,
      reasonStatusCode: ReasonPhrases.CREATED,
    }).send(res);
  });

  getAll = catchAsyncError(async (req, res, _next) => {
    new SuccessResponse({
      message: "get all successfully",
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.body,
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  });

  getDiscountAmount = catchAsyncError(async (req, res, _next) => {
    new SuccessResponse({
      message: "get discount amount successfully!!!",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
        userId: req.body.userId || req.user.userId,
      }),
    }).send(res);
  });

  getAllDiscountCodeProducts = catchAsyncError(async (req, res, next) => {
    new SuccessResponse({
      message: "get discounts code product",
      metadata: await DiscountService.getAllDiscountCodeWithProduct({
        ...req.query,
        discount_shopId: req.user.userId,
      }),
    }).send(res);
  });
}

export const discountController = new DiscountController();
