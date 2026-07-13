const nodemailer = require("nodemailer");
const ApiError = require("./ApiError");

let transporter = null;

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASSWORD } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    throw new ApiError(500, "SMTP configuration is missing in environment variables");
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });

  return transporter;
};

const verifyTransporter = async () => {
  const activeTransporter = getTransporter();

  await activeTransporter.verify();
};

const sendEmail = async ({ to, subject, html }) => {
  const activeTransporter = getTransporter();

  const fromAddress = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

  await activeTransporter.sendMail({
    from: fromAddress,
    to,
    subject,
    html,
  });
};

module.exports = { sendEmail, verifyTransporter };