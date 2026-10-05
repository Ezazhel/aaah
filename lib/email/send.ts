import nodemailer from "nodemailer";

type Email = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

// Local: Mailpit (no auth). Production: Brevo SMTP relay.
const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
});

/**
 * Sends an email. Server only. Throws if the SMTP server refuses it.
 */
export async function sendEmail({ to, subject, html, text, replyTo }: Email) {
  await transport.sendMail({ from: process.env.EMAIL_FROM, to, subject, html, text, replyTo });
  console.log("[email] envoyé", to, subject);
}
