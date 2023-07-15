import { HEADER } from "../constanst.js";
import { ApiKeyRepository } from "../repositories/index.js";

export class ApiKeyService {
  static async apiKey(req, res, next) {
    try {
      const key = req.headers[HEADER.API_KEY]?.toString();
      if (!key) {
        return res.status(403).json({
          statusCode: 403,
          message: "Forbidden Error",
          success: false,
        });
      }

      const objKey = await ApiKeyRepository.findOne(key);
      if (!objKey) {
        return res.status(403).json({
          statusCode: 403,
          message: "Forbidden Error",
          success: false,
        });
      }

      req.permissions = objKey;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async create() {
    await ApiKeyRepository.create();
  }

  static permission = (permission) => {
    return (req, res, next) => {
      console.log("log");
      if (!req.permissions?.permissions) {
        return res.status(403).json({
          statusCode: 403,
          message: "Forbidden Error",
          success: false,
        });
      }

      const validPermission = req.permissions?.permissions.includes(permission);

      if (!validPermission) {
        return res.status(403).json({
          statusCode: 403,
          message: "Forbidden Error",
          success: false,
        });
      }

      next();
    };
  };
}
