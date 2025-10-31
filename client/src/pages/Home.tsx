import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Link } from "wouter";
import { Phone, Mail, MapPin } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { data: contactInfo } = trpc.content.getContactInfo.useQuery();
  const { data: services } = trpc.content.getServices.useQuery();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Rommelaere Rénov
              </h1>
              <p className="text-xl mb-2 text-primary-foreground/90">
                Spécialisé en aménagement de combles
              </p>
              <p className="text-lg mb-6 text-primary-foreground/80">
                Gyproc • Enduit • Retouche sur plafonnage
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/contact">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
                    Demander un devis
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Voir nos réalisations
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <img src="/image2vector.svg" alt="Rommelaere Rénov" className="w-64 h-64" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            Nos Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services?.map((service) => (
              <div key={service.id} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
                <h3 className="text-xl font-bold mb-3 text-primary">{service.title}</h3>
                <p className="text-foreground/80 mb-4">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/services">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Tous nos services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            Nous Contacter
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {contactInfo?.phone && (
              <div className="flex items-start gap-4">
                <Phone className="text-accent mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-lg mb-1">Téléphone</h3>
                  <a href={`tel:${contactInfo.phone}`} className="text-primary hover:underline">
                    {contactInfo.phone}
                  </a>
                </div>
              </div>
            )}
            {contactInfo?.email && (
              <div className="flex items-start gap-4">
                <Mail className="text-accent mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-lg mb-1">Email</h3>
                  <a href={`mailto:${contactInfo.email}`} className="text-primary hover:underline">
                    {contactInfo.email}
                  </a>
                </div>
              </div>
            )}
            {contactInfo?.address && (
              <div className="flex items-start gap-4">
                <MapPin className="text-accent mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-lg mb-1">Adresse</h3>
                  <p className="text-foreground/80">{contactInfo.address}</p>
                </div>
              </div>
            )}
          </div>
          <div className="text-center">
            <Link href="/contact">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
                Contactez-nous
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-8">
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
