import { after } from "next/server";
import { renderEmail } from "./layout";
import { sendEmail } from "./send";

export type Notification = {
  to: string[];
  subject: string;
  title: string;
  paragraphs: string[];
  /** Path of the page to open, e.g. "/stock". */
  path: string;
  ctaLabel: string;
};

/**
 * Sends the same email to each recipient (one email each: recipients never see each other).
 * Never throws: a mail failure is logged.
 */
export async function sendNotification({ to, subject, title, paragraphs, path, ctaLabel }: Notification) {
  const recipients = [...new Set(to.filter(Boolean))];
  if (!recipients.length) return console.warn("[email] aucun destinataire", subject);

  const { html, text } = renderEmail({
    title,
    paragraphs,
    cta: { label: ctaLabel, url: `${process.env.NEXT_PUBLIC_URL}${path}` },
  });

  await Promise.all(recipients.map(async (recipient) => {
    try {
      await sendEmail({ to: recipient, subject, html, text });
    } catch (err) {
      console.error("[email] échec de la notification", subject, recipient, err);
    }
  }));
}

/**
 * Same as sendNotification, after the response: a mail never blocks or breaks the user's action.
 */
export function notify(notification: Notification) {
  after(() => sendNotification(notification));
}
