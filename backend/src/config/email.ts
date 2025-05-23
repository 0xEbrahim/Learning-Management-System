import nodeMailer, { Transporter } from "nodemailer";
import config from "./env";
import logger from "./logger";
import prisma from "./prisma";
import { IEmail } from "../Interfaces/types";

const sendEmail = async (options: IEmail) => {
  const transporter: Transporter = nodeMailer.createTransport({
    host: config.SMTP_HOST,
    port: Number(config.SMTP_PORT),
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  });

  const data: any = {
    from: "Ebrahim El-Sayed",
    to: options.email,
    subject: options.subject,
    html: options.template,
  };
  const info = await transporter.sendMail(data);
  logger.info(
    "Email sent successfully, id: " +
      info.messageId +
      ", Email: " +
      options.email
  );
  await prisma.email.create({
    data: {
      id: info.messageId,
      email: options.email,
      subject: options.subject,
    },
  });
};

export default sendEmail;
