import { HttpStatus, ReasonPhrases } from "../enums/index.js";
import { SuccessResponse, catchAsyncError } from "../middleware/index.js";
import { ProductFactoryV1 } from "../services/product.service.v1.js";

class ProductController {
  createProduct = catchAsyncError(async (req, res, _next) => {
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

  getAllDraftsForShop = catchAsyncError(async (req, res, _next) => {
    new SuccessResponse({
      message: "get isDraft Product successfully!!!",
      metadata: await ProductFactoryV1.findByDraftsForShop({
        product_shop: req.user.userId,
      }),
      statusCode: HttpStatus.OK,
      reasonStatusCode: ReasonPhrases.Ok,
    }).send(res);
  });

  getAllUnDraftsForShop = catchAsyncError(async (req, res, _next) => {
    new SuccessResponse({
      message: "get unDraft Products successfully!!!",
      metadata: await ProductFactoryV1.findByUnDraftsForShop({
        product_shop: req.user.userId,
      }),
      statusCode: HttpStatus.OK,
      reasonStatusCode: ReasonPhrases.Ok,
    }).send(res);
  });

  handlePulishedProductByShop = catchAsyncError(async (req, res, _next) => {
    new SuccessResponse({
      message: "get Product is published successfully!!!",
      metadata: await ProductFactoryV1.publishedProducByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
      statusCode: HttpStatus.OK,
      reasonStatusCode: ReasonPhrases.Ok,
    }).send(res);
  });

  handleUnPulishedProductByShop = catchAsyncError(async (req, res, _next) => {
    new SuccessResponse({
      message: "get Product is published successfully!!!",
      metadata: await ProductFactoryV1.unPublishedProducByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
      statusCode: HttpStatus.OK,
      reasonStatusCode: ReasonPhrases.Ok,
    }).send(res);
  });

  searchProduct = catchAsyncError(async (req, res, next) => {
    new SuccessResponse({
      message: "search product successfully!!!",
      metadata: await ProductFactoryV1.searchProduct({
        keySearch: req.query.keySearch,
      }),
      statusCode: HttpStatus.OK,
      reasonStatusCode: ReasonPhrases.Ok,
    }).send(res);
  });

  getAllProduct = catchAsyncError(async (req, res, next) => {
    new SuccessResponse({
      message: "get all product successfully",
      statusCode: HttpStatus.OK,
      reasonStatusCode: ReasonPhrases.Ok,
      metadata: await ProductFactoryV1.findAllProduct(req.query),
    }).send(res);
  });

  findOneProduct = catchAsyncError(async (req, res, next) => {
    new SuccessResponse({
      message: "get product successfully",
      statusCode: HttpStatus.OK,
      reasonStatusCode: ReasonPhrases.Ok,
      metadata: await ProductFactoryV1.findProduct({
        product_id: req.params.id,
        unselect: req.query.unselect || req.body.unselect,
      }),
    }).send(res);
  });

  updateProduct = catchAsyncError(async (req, res, next) => {
    new SuccessResponse({
      message: "update product successfully",
      statusCode: HttpStatus.OK,
      reasonStatusCode: ReasonPhrases.Ok,
      metadata: await ProductFactoryV1.updateProduct({
        product_id: req.params.id,
        body: {
          ...req.body,
          product_shop: req.user.userId,
        },
        type: req.body.product_type,
      }),
    }).send(res);
  });
}

export const prodcutController = new ProductController();
