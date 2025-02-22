import app from "./app";
import config from "./config/env";
import logger from "./config/logger";

const server = app.listen(config.PORT, () => {
  if (config.NODE_ENV === "production") {
    logger.info(`Server started running on PORT ${config.PORT}`);
    logger.info("API Doc available at " + config.PROD_URL + "/api-docs");
  } else {
    console.log("Server started on port " + config.PORT);
    console.log("API Doc available at " + config.DEV_URL + "/api-docs");
  }
});

process
  .on("unhandledRejection", (reason, p) => {
    console.error(reason, "Unhandled Rejection at Promise", p);
    logger.error(reason + " Unhandled Rejection at Promise " + p);
  })
  .on("uncaughtException", (err) => {
    console.error(err, "Uncaught Exception thrown");
    logger.error(err + " Uncaught Exception thrown");
    process.exit(1);
  });
