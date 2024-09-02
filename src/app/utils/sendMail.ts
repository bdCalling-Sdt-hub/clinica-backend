import nodemailer from "nodemailer";
import config from "../config";
//import config from "../config";

type TEmail = {
  to: string;
  html: string;
};

export const sendMail = async ({ to, html }: TEmail) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: config.NODE_ENV !== "development",
    auth: {
      user: "masumraihan3667@gmail.com",
      pass: "lesa itqt nlqw emxr",
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: "masumraihan3667@gmail.com", // sender address
    to, // list of receivers
    subject: "Your Candymap Account Created Successfully",
    html,
  });
};
