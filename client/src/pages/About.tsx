import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      {/* Header */}
      <section className="bg-primary text-white py-16">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">À Propos de Nous</h1>
          <p className="text-xl text-primary-foreground/90">
            Votre partenaire de confiance pour l'aménagement de combles
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="container max-w-3xl">
          <div className="prose prose-lg">
            <h2 className="text-3xl font-bold mb-6 text-primary">Qui Sommes-Nous ?</h2>
            <p className="text-foreground/80 mb-6 leading-relaxed">
              Rommelaere Rénov est une entreprise spécialisée dans l'aménagement de combles depuis plus de 10 ans. 
              Nous mettons notre expertise et notre passion au service de vos projets de rénovation.
            </p>

            <h2 className="text-3xl font-bold mb-6 mt-12 text-primary">Notre Expertise</h2>
            <p className="text-foreground/80 mb-6 leading-relaxed">
              Nous maîtrisons tous les aspects de l'aménagement de combles :
            </p>
            <ul className="list-disc list-inside text-foreground/80 mb-6 space-y-2">
              <li>Gyproc et cloisons</li>
              <li>Enduit et finitions</li>
              <li>Retouche sur plafonnage</li>
              <li>Cimentage et travaux de base</li>
              <li>Crépi sur isolant</li>
              <li>Plafonnage</li>
              <li>Isolation laine de bois et laine minérale</li>
            </ul>

            <h2 className="text-3xl font-bold mb-6 mt-12 text-primary">Nos Valeurs</h2>
            <p className="text-foreground/80 mb-6 leading-relaxed">
              Qualité, professionnalisme et satisfaction client sont au cœur de nos valeurs. 
              Nous nous engageons à livrer des travaux impeccables dans les délais convenus.
            </p>
          </div>
        </div>
      </section>

      {/* Matthias Section */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">Notre Équipe</h2>
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <div className="flex items-center justify-center">
                <img
                  src="/matthias.png"
                  alt="Matthias Rommelaere"
                  className="w-full h-auto rounded-lg object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-3 text-primary">Matthias Rommelaere</h3>
                <p className="text-foreground/80 mb-4 leading-relaxed">
                  Fondateur et gérant de Rommelaere Rénov, Matthias apporte plus de 10 ans d'expérience 
                  dans le domaine de la rénovation et de l'aménagement de combles.
                </p>
                <p className="text-foreground/80 mb-6 leading-relaxed">
                  Passionné par son métier, il s'engage à fournir des solutions de qualité supérieure 
                  à chacun de ses clients. Son attention aux détails et son professionnalisme font 
                  la différence dans chaque projet.
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  Matthias croit que chaque projet est unique et mérite une approche personnalisée 
                  pour garantir la satisfaction totale du client.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4 text-primary">Prêt à Commencer ?</h2>
          <p className="text-foreground/80 mb-8 leading-relaxed">
            Contactez-nous pour discuter de votre projet et obtenir un devis personnalisé.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
              Demander un Devis
            </Button>
          </Link>
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
