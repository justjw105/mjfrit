import { ContactForm } from './contact-form';
import { Mail, Phone } from 'lucide-react';

export const metadata = {
  title: "Contact | Glass Art Gallery by MJ Frit",
  description:
    "Contact MJ Frit for glass art inquiries, commissions, or gallery details.",
  alternates: {
    canonical: "https://mjfrit.com/contact",
  },
  robots: "index, follow",
};

export default function ContactPage() {
  // <ContactForm />
  return (
    <div className="grid md:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
      <div className="space-y-8 pt-4">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold font-headline text-primary">Get in Touch</h1>
          <p className="text-lg text-foreground/80">
            Have a question about a piece, or interested in a custom commission?
            Send us an email, and we'll get back to you as soon as possible.
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Mail className="h-6 w-6 text-accent" />
            <a href="mailto:moriahguy@gmail.com" className="text-lg hover:text-primary transition-colors">
              moriahguy@gmail.com
            </a>
          </div>
        </div>
      </div>
      <div>
      </div>
    </div>
  );
}
