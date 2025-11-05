import Navigation from "@/components/Navigation";
import ImageCarousel from "@/components/ImageCarousel";
import { trpc } from "@/lib/trpc";
import SeoHelmet from "@/components/SeoHelmet_optimized"; 

export default function Projects() {
  const { data: projects, isLoading } = trpc.content.getProjects.useQuery();

  // Map des images par projet
  const projectImages: { [key: string]: string[] } = {
    "Restauration Complète d'une Chambre": [
      "/projects/chambre/34ea2c5e-070f-49a5-af96-eef3b28e1f1b.jpeg",
      "/projects/chambre/62e51499-21c5-483b-87ad-df5cc4781225.jpeg",
      "/projects/chambre/466c0a6b-ad25-44a1-b69c-b0303fc89d55.jpeg",
      "/projects/chambre/738b10ee-07e2-42a2-a55a-e9e5b9db2259.jpeg",
      "/projects/chambre/875c4219-4fac-4887-8033-d961be9284b5.jpeg",
      "/projects/chambre/b2dd0f74-ddbb-424b-844f-a05cb1317a4b.jpeg",
      "/projects/chambre/5a24e533-e8cd-4a7c-b0a4-1bbe4c34f6d3.jpeg",
    ],
    "Crépi sur Façade": [
      "/projects/crepis/117444298_673978626547991_5834011163013684594_n.jpg",
      "/projects/crepis/117677366_673978663214654_2888552120166652507_n.jpg",
      "/projects/crepis/117768386_673978703214650_4230967255859425165_n.jpg",
      "/projects/crepis/117623316_673978749881312_4230262152770197868_n.jpg",
    ],
    "Caisson Îlot Central": [
      "/projects/caisson/158343fb-2533-4fca-965a-b2dde1073734.jpeg",
      "/projects/caisson/607241c5-132f-4097-85f6-00b0baee741b.jpeg",
      "/projects/caisson/72003228-0314-4fce-8e01-fd460308c949.jpeg",
      "/projects/caisson/ebb7a623-5f79-4741-9741-dba2f918fed1.jpeg",
      "/projects/caisson/344cff99-3ed5-4074-a6bb-8fa83c1a4ff2.jpeg",
      "/projects/caisson/573a13f6-6f83-4d18-af0f-bf82797d4672.jpeg",
    ],
    "Aménagement Suite Parentale": [
      "/projects/suiteparentale/baa634e6-d0f9-479b-b82f-d576c6def737.jpeg",
      "/projects/suiteparentale/1e9ca91f-cab6-4535-82e0-fd5a9d4dd1dd.jpeg",
      "/projects/suiteparentale/2a30a5ec-f491-49f6-a7cd-2809a13eb7e8.jpeg",
    ],
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
          <h1 className="text-4xl font-bold mb-4">Nos Réalisations</h1>
          <p className="text-xl text-primary-foreground/90">
            Découvrez les projets que nous avons menés à bien
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="container">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-foreground/60">Chargement des réalisations...</p>
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-12">
              {projects.map((project) => {
                const images = projectImages[project.title] || [];

                return (
                  <div key={project.id} className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-lg transition">
                    <ImageCarousel images={images} title={project.title} />
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 text-primary">{project.title}</h3>
                      <p className="text-foreground/80">{project.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-foreground/60">Aucune réalisation disponible pour le moment.</p>
            </div>
          )}
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