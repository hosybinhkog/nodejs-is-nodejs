import { ApiKeyService } from "../services/index.js";

class ApiKeyController {
  apiKey(req, res, next) {
    return ApiKeyService.apiKey(req, res, next);
  }

  async create(_, res, next) {
    try {
      await ApiKeyService.create();
      res.status(201).json({
        success: true,
        message: "create api key header success",
      });
    } catch (error) {
      next(error);
    }
  }

  checkPermission(req, res, next) {
    return ApiKeyService.permission("0000");
  }
}

export const apiKeyController = new ApiKeyController();
