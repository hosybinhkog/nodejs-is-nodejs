import { HttpStatus, ReasonPhrases } from "../enums/index.js";

export class SuccessResponse {
  constructor({
    message,
    statusCode = HttpStatus.OK,
    reasonStatusCode = ReasonPhrases.OK,
    metadata = {},
  }) {
    this.status = statusCode;
    this.message = message ? message : reasonStatusCode;
    this.reasonStatusCode = reasonStatusCode;
    this.metadata = metadata;
  }

  send(res, header = {}) {
    res.status(this.status).json(this);
  }
}

export class OkeResponse extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}
