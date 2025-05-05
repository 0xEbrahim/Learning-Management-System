import app from "./app";
import config from "./config/env";
import logger from "./config/logger";

const HOST = config.BASE_URL;
const PORT: number = Number(process.env.PORT) || 3000;

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

app.listen(PORT, async () => {
  if (config.NODE_ENV === "production") {
    logger.info(`Server started running on PORT ${PORT}`);
    logger.info("API Doc available at " + config.PROD_URL + "/api-docs");
  } else {
    console.clear();
    const { default: figlet } = await import("figlet");
    const { default: boxen } = await import("boxen");
    const { default: kleur } = await import("kleur");
    figlet("Server Running", (err, data: any) => {
      if (err) {
        console.error("Something went wrong...");
        console.dir(err);
        return;
      }

      const banner: string = kleur.cyan(data);
      const info: string = `
  ${kleur.green("🚀 Server is running at:")}
  ${kleur.cyan(`📍 ${HOST}`)}
  ${kleur.cyan(`📍 ${HOST}/api-docs`)}
  ${kleur.yellow("=====================================")}
  ${kleur.magenta("Press CTRL+C to stop the server.")}
  ${kleur.yellow("=====================================")}
  `;

      const boxedOutput: string = boxen(`${banner}\n${info}`, {
        padding: 1,
        margin: 1,
        borderStyle: "double",
        borderColor: "cyan",
        align: "center",
      });

      console.log(boxedOutput);
    });
  }
});
