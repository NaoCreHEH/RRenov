import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { Star } from "lucide-react";

export default function Testimonials() {
  const { data: testimonials, isLoading } = trpc.testimonials.list.useQuery();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "fill-accent text-accent" : "text-gray-300"}
      />
    ));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      {/* Header */}
      <section className="bg-primary text-white py-16">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">Témoignages Clients</h1>
          <p className="text-xl text-primary-foreground/90">
            Découvrez ce que nos clients pensent de nos services
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16">
        <div className="container">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-foreground/60">Chargement des témoignages...</p>
            </div>
          ) : testimonials && testimonials.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white border border-border rounded-lg p-6 hover:shadow-lg transition"
                >
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {renderStars(testimonial.rating || 5)}
                  </div>

                  {/* Quote */}
                  <p className="text-foreground/80 mb-6 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  {/* Client Info */}
                  <div className="border-t pt-4">
                    <h3 className="font-bold text-primary mb-1">
                      {testimonial.clientName}
                    </h3>
                    {testimonial.clientRole && (
                      <p className="text-sm text-foreground/60 mb-1">
                        {testimonial.clientRole}
                      </p>
                    )}
                    {testimonial.projectType && (
                      <p className="text-sm text-accent font-medium">
                        Projet : {testimonial.projectType}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-foreground/60">Aucun témoignage disponible pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4 text-primary">Satisfait de Nos Services ?</h2>
          <p className="text-foreground/80 mb-6">
            Partagez votre expérience avec nous. Vos retours nous aident à améliorer nos services.
          </p>
          <a
            href="mailto:rommelaere.renov@gmail.com?subject=Témoignage%20client"
            className="inline-block bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Nous Envoyer un Témoignage
          </a>
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
