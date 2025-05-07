import { IResponse } from "../Interfaces/types";
import APIError from "./APIError";

interface ResponseMetadata {
  timestamp?: string;
  fromCache?: boolean;
  cacheInvalidated?: boolean;
  cacheTTL?: number;
  [key: string]: any;
}

export class ResponseFormatter {
  static format<T extends object | undefined>(
    data: T,
    statusCode: number = 200,
    message?: string,
    metadata?: ResponseMetadata
  ): IResponse {
    const response: IResponse = {
      status: "Success",
      statusCode,
      message: message || "Operation completed successfully",
    };

    if (data) {
      response.data = data;
    }

    if (metadata) {
      const enrichedMetadata = {
        timestamp: new Date().toISOString(),
        ...metadata,
      };

      response.data = {
        ...response.data,
        metadata: enrichedMetadata,
      };
    }

    return response;
  }

  static ok<T extends object | undefined>(
    data: T,
    message?: string,
    metadata?: ResponseMetadata
  ): IResponse {
    return this.format(data, 200, message, metadata);
  }

  static created<T extends object | undefined>(
    data: T,
    message?: string,
    metadata?: ResponseMetadata
  ): IResponse {
    return this.format(data, 201, message, metadata);
  }

  static noContent(message?: string): IResponse {
    return this.format(undefined, 204, message);
  }

  static notFound(message: string = "Resource not found"): never {
    throw new APIError(message, 404);
  }

  static conflict(message: string = "Resource already exists"): never {
    throw new APIError(message, 409);
  }

  static unauthorized(message: string = "Unauthorized access"): never {
    throw new APIError(message, 401);
  }

  static forbidden(message: string = "Access forbidden"): never {
    throw new APIError(message, 403);
  }

  static badRequest(message: string = "Invalid request"): never {
    throw new APIError(message, 400);
  }
}

export default ResponseFormatter;
