import nodemailer from "nodemailer";
import config from "../config";

type TEmail = {
  to: string;
  html: string;
  subject: string;
};

export const sendMail = async ({ to, html,subject }: TEmail) => {
  const transporter = nodemailer.createTransport({
    // @ts-ignore
    host: config.email.host || "smtp.gmail.com",
    port: config.email.port,
    secure: config.NODE_ENV !== "development",
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  }) as any;

  // send mail with defined transport object
  await transporter.sendMail({
    from: config.email.user, // sender address
    to, // list of receivers
    subject,
    html,
  });
};
