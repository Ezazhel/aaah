import { notify } from "./notify";

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
  const to = process.env.CONTACT_EMAIL;
  if (!to) return console.warn("[email] CONTACT_EMAIL absent : notification admin non envoyée", subject);
  notify({ to: [to], subject: `[Admin] ${subject}`, title, paragraphs, path, ctaLabel: "Ouvrir l'administration" });
}
