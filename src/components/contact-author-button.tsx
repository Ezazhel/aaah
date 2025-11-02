import React from "react";

type ContactAuthorButtonProps = {
  authorName: string;
  contactEmail?: string;
  gameName?: string;
};

export const ContactAuthorButton: React.FC<ContactAuthorButtonProps> = ({
  authorName,
  contactEmail,
  gameName,
}) => {
  // Compose mailto link if email is available
  let mailtoHref: string | undefined;
  if (contactEmail) {
    const subject = `Contact depuis le site - ${authorName}`;
    let body = `Bonjour ${authorName},\n\nJe vous contacte au sujet de`;
    if (gameName) {
      body += ` votre jeu "${gameName}"`;
    }
    body += "...";
    mailtoHref = `mailto:${encodeURIComponent(contactEmail)}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  // Use lucide-react Mail icon if available, else fallback to emoji
  let MailIcon: React.ReactNode = <span className="mr-2">✉️</span>;
  try {
    // @ts-ignore
     
    const { Mail } = require("lucide-react");
    MailIcon = <Mail className="w-5 h-5 mr-2" aria-hidden="true" />;
  } catch {
    // fallback to emoji
  }

  // Tooltip for disabled state
  const tooltip = !contactEmail ? "Email non disponible" : undefined;

  return (
    <span className="block w-full md:w-auto" title={tooltip}>
      {contactEmail ? (
        <a
          href={mailtoHref}
          className={`
            inline-flex items-center justify-center
            w-full md:w-auto
            px-6 py-2 rounded-lg
            bg-brand-primary text-white font-semibold shadow
            hover:bg-brand-primary/90 transition
            focus:outline-none focus:ring-2 focus:ring-brand-primary/50
            text-base
          `}
          aria-label={`Contacter l'auteur ${authorName}`}
        >
          {MailIcon}
          Contacter l&apos;auteur
        </a>
      ) : (
        <button
          type="button"
          className={`
            inline-flex items-center justify-center
            w-full md:w-auto
            px-6 py-2 rounded-lg
            bg-gray-300 text-gray-500 font-semibold shadow
            cursor-not-allowed
            text-base
          `}
          disabled
          aria-label="Email non disponible"
          tabIndex={-1}
        >
          {MailIcon}
          Contacter l&apos;auteur
        </button>
      )}
    </span>
  );
};
