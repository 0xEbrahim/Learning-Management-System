import app from "./app";
import config from "./config/env";
import logger from "./config/logger";

app.listen(config.PORT, () => {
  if (config.NODE_ENV === "production") {
    logger.info(`Server started running on PORT ${config.PORT}`);
    logger.info("API Doc available at " + config.PROD_URL+"/api-docs");
  } else {
    console.log("Server started on port " + config.PORT);
    console.log("API Doc available at " + config.DEV_URL+"/api-docs");
  }
});
