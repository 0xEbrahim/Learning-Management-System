import { Options } from "swagger-jsdoc";

export const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LMS API",
      version: "1.0.0",
      description: "API documentation for LMS API",
    },
    security: [{ BearerAuth: [] }],
  },
  apis: [
    './src/modules/**/*.route.js',
    './src/modules/**/*.swagger.ts',
  ],
};
