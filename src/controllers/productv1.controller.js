import { SuccessResponse, catchAsyncError } from "../middleware/index.js";
import { ProductFactoryV1 } from "../services/product.service.v1.js";

class ProductV1Controller {
  createProduct = catchAsyncError(async (req, res, next) => {
    new SuccessResponse({
      message: "create new Product successfully!!!",
      metadata: await ProductFactoryV1.createProduct({
        type: req.body.product_type,
        payload: {
          ...req.body,
          product_shop: req.user.userId,
        },
      }),

      statusCode: HttpStatus.CREATED,
      reasonStatusCode: ReasonPhrases.CREATED,
    }).send(res);
  });
}

export const productv1Controller = new ProductV1Controller();
