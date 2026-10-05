import { ASSOCIATION_NAME } from "@/lib/association";

// Same look as supabase/templates/invite.html (hex colors from app/globals.css).
const COLORS = { orange: "#F8682B", dark: "#003D7D", blue: "#007CA3", muted: "#52657A", page: "#EDF2F8", border: "#D4DFEB" };

/** Escapes text before putting it in HTML. Use it on every user input. */
export const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

type EmailContent = {
  title: string;
  /** Plain text paragraphs: escaped here, line breaks kept. */
  paragraphs: string[];
  cta?: { label: string; url: string };
};

/**
 * Builds the HTML and text versions of an email with the association's layout.
 */
export function renderEmail({ title, paragraphs, cta }: EmailContent) {
  const site = process.env.NEXT_PUBLIC_URL ?? "";
  const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

  const body = paragraphs
    .map((p) => `<p style="margin:0 0 16px 0; font-size:16px; line-height:1.6;">${escapeHtml(p).replace(/\n/g, "<br />")}</p>`)
    .join("");

  const button = cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 8px 0;"><tr>
        <td align="center" style="border-radius:10px; background-color:${COLORS.orange};">
          <a href="${escapeHtml(cta.url)}" style="display:inline-block; padding:14px 28px; font-size:16px; font-weight:bold; color:#FFFFFF; text-decoration:none; border-radius:10px;">${escapeHtml(cta.label)}</a>
        </td></tr></table>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="fr">
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${escapeHtml(title)}</title></head>
  <body style="margin:0; padding:0; background-color:${COLORS.page};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${COLORS.page};"><tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background-color:#FFFFFF; border-radius:10px; overflow:hidden; font-family:${font}; color:${COLORS.dark};">
          <tr><td align="center" style="background-color:${COLORS.dark}; background-image:linear-gradient(135deg, ${COLORS.dark}, ${COLORS.blue}); padding:24px;">
            <img src="${site}/aaah_logo.png" width="160" alt="AAAH!" style="display:block; width:160px; max-width:100%; height:auto; border:0;" />
          </td></tr>
          <tr><td style="padding:32px 32px 16px 32px;">
            <h1 style="margin:0 0 16px 0; font-size:22px; line-height:1.3; color:${COLORS.dark};">${escapeHtml(title)}</h1>
            ${body}
            ${button}
          </td></tr>
          <tr><td style="padding:20px 32px; border-top:1px solid ${COLORS.border};">
            <p style="margin:0; font-size:12px; line-height:1.5; color:${COLORS.muted}; text-align:center;">
              ${escapeHtml(ASSOCIATION_NAME)} (AAAH!)<br /><a href="${site}" style="color:${COLORS.muted};">${site}</a>
            </p>
          </td></tr>
        </table>
      </td>
    </tr></table>
  </body>
</html>`;

  const text = [title, "", ...paragraphs.flatMap((p) => [p, ""]), cta ? `${cta.label} : ${cta.url}` : "", "", `${ASSOCIATION_NAME} — ${site}`]
    .join("\n")
    .trim();

  return { html, text };
}
