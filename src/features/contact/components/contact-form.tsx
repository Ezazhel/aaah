import { useState, type FormEvent } from 'react';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { useSubmitContact } from '../api/submit-contact';

export const ContactForm = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Honeypot field (should remain empty)
  const [successMessage, setSuccessMessage] = useState('');

  const submitContactMutation = useSubmitContact({
    mutationConfig: {
      onSuccess: () => {
        setSuccessMessage('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
        // Reset form
        setEmail('');
        setSubject('');
        setMessage('');
        setHoneypot('');
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(''), 5000);
      },
      onError: (error) => {
        console.error('Error submitting contact form:', error);
      },
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Honeypot check: if filled, it's likely a bot
    if (honeypot) {
      console.warn('Honeypot triggered - possible bot submission');
      return;
    }

    // Basic validation
    if (!email || !subject || !message) {
      return;
    }

    submitContactMutation.mutate({
      email,
      subject,
      message,
      honeypot,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          <Mail className="inline-block mr-2" size={16} />
          Adresse e-mail <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(69%_0.19_41)] transition"
          placeholder="votre.email@exemple.fr"
        />
      </div>

      {/* Subject Field */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
          <MessageSquare className="inline-block mr-2" size={16} />
          Sujet <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(69%_0.19_41)] transition"
          placeholder="Objet de votre message"
        />
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(69%_0.19_41)] transition resize-y"
          placeholder="Écrivez votre message ici..."
        />
      </div>

      {/* Honeypot Field (hidden from users, visible to bots) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website (leave blank)</label>
        <input
          type="text"
          id="website"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Error Message */}
      {submitContactMutation.isError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          Une erreur est survenue lors de l'envoi du message. Veuillez réessayer plus tard.
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {successMessage}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitContactMutation.isPending}
        className="w-full flex items-center justify-center px-6 py-3 bg-[oklch(69%_0.19_41)] text-white font-semibold rounded-lg shadow hover:bg-[oklch(69%_0.19_41)]/80 transition focus:outline-none focus:ring-2 focus:ring-[oklch(69%_0.19_41)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitContactMutation.isPending ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            Envoi en cours...
          </>
        ) : (
          <>
            <Send className="mr-2" size={20} />
            Envoyer
          </>
        )}
      </button>
    </form>
  );
};
