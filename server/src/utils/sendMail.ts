import nodemailer from "nodemailer";

export const sendMail = async (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSSWORD,
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    text,
  });
};
