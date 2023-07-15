import {
  HttpClientErrorReasonPhrases,
  HttpStatus,
  ReasonPhrases,
} from "../enums/index.js";
import { ErrorHandler } from "../helpers/index.js";

export const BadRequestError = () => {
  return new ErrorHandler("Bad Request", HttpStatus.BAD_REQUEST);
};

/// LEARN #

export class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.code = status;
  }
}

export class BadRequestErrorResponse extends ErrorResponse {
  constructor(
    message = HttpClientErrorReasonPhrases.BadRequest,
    status = HttpStatus.BAD_REQUEST
  ) {
    super(message);
    this.code = status;
  }
}

export class ConfictErrorResponse extends ErrorResponse {
  constructor(
    message = HttpClientErrorReasonPhrases.BadRequest,
    status = HttpStatus.BAD_REQUEST
  ) {
    super(message);
    this.code = status;
  }
}

export class NotFoundResponse extends ErrorResponse {
  constructor(
    message = HttpClientErrorReasonPhrases.NotFound,
    status = HttpStatus.NotFound
  ) {
    super(message);
    this.code = status;
  }
}

export class AuthFailResponse extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    status = HttpStatus.UNAUTHORIZED
  ) {
    super(message);
    this.code = status;
  }
}

export class ForbiddenResponse extends ErrorResponse {
  constructor(
    message = ReasonPhrases.FORBIDDEN,
    status = HttpStatus.FORBIDDEN
  ) {
    super(message);
    this.code = status;
  }
}
