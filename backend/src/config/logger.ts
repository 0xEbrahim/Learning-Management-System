import winston from "winston";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";
import config from "./env";
const { json, combine, timestamp, prettyPrint } = winston.format;
const logtail = new Logtail(config.LOGS_TOKEN, {
  endpoint: config.LOGS_HOST,
});

const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), json(), prettyPrint()),
  transports: [
    new winston.transports.File({
      filename: `${__dirname}/../../logs/error.log`,
      level: "error",
    }),
    new winston.transports.File({
      filename: `${__dirname}/../../logs/app.log`,
    }),
    new LogtailTransport(logtail),
  ],
});

if (config.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
export default logger;
