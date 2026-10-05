import { after } from "next/server";
import { renderEmail } from "./layout";
import { sendEmail } from "./send";

type AdminNotification = {
  subject: string;
  title: string;
  paragraphs: string[];
  /** Path of the admin page to open, e.g. "/admin/validation". */
  path: string;
};

/**
 * Emails the association's contact address that an admin action is needed.
 * Sent after the response: a mail failure never blocks or breaks the user's action.
 */
export function notifyAdmins({ subject, title, paragraphs, path }: AdminNotification) {
  after(async () => {
    const to = process.env.CONTACT_EMAIL;
    if (!to) return console.warn("[email] CONTACT_EMAIL absent : notification admin non envoyée", subject);
    try {
      const { html, text } = renderEmail({
        title,
        paragraphs,
        cta: { label: "Ouvrir l'administration", url: `${process.env.NEXT_PUBLIC_URL}${path}` },
      });
      await sendEmail({ to, subject: `[Admin] ${subject}`, html, text });
    } catch (err) {
      console.error("[email] échec de la notification admin", subject, err);
    }
  });
}
