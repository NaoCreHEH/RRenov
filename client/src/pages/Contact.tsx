import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Phone, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import SeoHelmet from "@/components/SeoHelmet_optimized"; 

export default function Contact() {
  const { data: contactInfo } = trpc.content.getContactInfo.useQuery();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission to backend
    toast.success("Merci ! Nous vous recontacterons bientôt.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
         <SeoHelmet // NOUVEAU
        title="Spécialiste Aménagement de Combles et Rénovation"
        description="Entrepreneur spécialisé en aménagement de combles, Gyproc, enduit et retouche sur plafonnage. Demandez votre devis gratuit."
      />
      <Navigation />

      {/* Header */}
      <section className="bg-primary text-white py-16">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">Nous Contacter</h1>
          <p className="text-xl text-primary-foreground/90">
            Envoyez-nous un message ou appelez-nous directement
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-primary">Informations de Contact</h2>
              <div className="space-y-8">
                {contactInfo?.phone && (
                  <div className="flex gap-4">
                    <Phone className="text-accent flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-bold text-lg mb-1">Téléphone</h3>
                      <a href={`tel:${contactInfo.phone}`} className="text-primary hover:underline text-lg">
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>
                )}
                {contactInfo?.email && (
                  <div className="flex gap-4">
                    <Mail className="text-accent flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-bold text-lg mb-1">Email</h3>
                      <a href={`mailto:${contactInfo.email}`} className="text-primary hover:underline text-lg">
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                )}
                {contactInfo?.address && (
                  <div className="flex gap-4">
                    <MapPin className="text-accent flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-bold text-lg mb-1">Adresse</h3>
                      <p className="text-foreground/80 text-lg">{contactInfo.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-primary">Envoyez-nous un Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Votre téléphone"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Décrivez votre projet..."
                  />
                </div>

                <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-white">
                  Envoyer le Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-8 mt-auto">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; 2024 Rommelaere Rénov. Tous droits réservés.</p>
          <a
            href="https://www.facebook.com/people/Rommelaere-Renov/100064883967078/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition"
          >
            Suivez-nous sur Facebook
          </a>
        </div>
      </footer>
    </div>
  );
}
