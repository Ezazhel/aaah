import { ContactForm } from '../components/contact-form';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Contact() {
  return (
    <div className="bg-gradient-to-br from-[oklch(96%_0.01_250)] to-[oklch(94%_0.04_250)] min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[oklch(36%_0.13_250)] mb-4">
            Contactez-nous
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Une question ? Une suggestion ? N'hésitez pas à nous écrire !
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Cards */}
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <Mail className="mx-auto mb-3 text-[oklch(69%_0.19_41)]" size={32} />
            <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
            <a
              href="mailto:contact@aaah-jeux.fr"
              className="text-[oklch(69%_0.19_41)] hover:underline"
            >
              contact@aaah-jeux.fr
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow text-center">
            <MapPin className="mx-auto mb-3 text-[oklch(69%_0.19_41)]" size={32} />
            <h3 className="font-semibold text-gray-800 mb-2">Localisation</h3>
            <p className="text-gray-600">Montpellier, France</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow text-center">
            <Phone className="mx-auto mb-3 text-[oklch(69%_0.19_41)]" size={32} />
            <h3 className="font-semibold text-gray-800 mb-2">Téléphone</h3>
            <p className="text-gray-600">Sur demande</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-[oklch(36%_0.13_250)] mb-6">
            Envoyez-nous un message
          </h2>
          <ContactForm />
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>
            Nous nous efforçons de répondre à tous les messages dans un délai de 48 heures.
          </p>
        </div>
      </div>
    </div>
  );
}
