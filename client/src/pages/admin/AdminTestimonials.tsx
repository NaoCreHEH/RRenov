import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Check, X, Star, Trash2, Edit, Plus, Eye, EyeOff } from "lucide-react";

// Le type Testimonial est défini dans le schéma Drizzle, mais nous le redéfinissons ici pour le formulaire
interface TestimonialFormData {
  clientName: string;
  content: string;
  rating: number;
  clientRole: string;
  projectType: string;
  imageUrl: string;
  isPublished: boolean;
  order: number;
}

const initialFormData: TestimonialFormData = {
  clientName: "",
  content: "",
  rating: 5,
  clientRole: "",
  projectType: "",
  imageUrl: "",
  isPublished: true,
  order: 0,
};

export default function AdminTestimonials() {
  const [formData, setFormData] = useState<TestimonialFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Utiliser getAll pour récupérer tous les témoignages (publiés ou non)
  const { data: testimonials, isLoading, refetch } = trpc.testimonials.list.useQuery();
  const createMutation = trpc.testimonials.create.useMutation();
  const updateMutation = trpc.testimonials.update.useMutation();
  const deleteMutation = trpc.testimonials.delete.useMutation();
  const togglePublishedMutation = trpc.testimonials.togglePublished.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
        setFormData((prev) => ({
            ...prev,
            [name]: (e.target as HTMLInputElement).checked,
        }));
    } else if (name === "rating" || name === "order") {
        setFormData((prev) => ({
            ...prev,
            [name]: parseInt(value) || 0,
        }));
    } else {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Préparer les données pour la mutation
      const dataToSave = {
        ...formData,
        // Drizzle utilise 1 ou 0 pour les tinyint, mais le routeur tRPC attend un boolean
        isPublished: formData.isPublished, 
        rating: formData.rating,
        order: formData.order,
      };

      if (isEditing !== null) {
        await updateMutation.mutateAsync({ id: isEditing, ...dataToSave });
        toast.success("Témoignage mis à jour avec succès !");
      } else {
        await createMutation.mutateAsync(dataToSave);
        toast.success("Témoignage créé avec succès !");
      }
      setFormData(initialFormData);
      setIsEditing(null);
      refetch();
    } catch (error) {
      toast.error("Erreur lors de l'opération.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (testimonial: NonNullable<typeof testimonials>[number]) => {
    setIsEditing(testimonial.id);
    setFormData({
      clientName: testimonial.clientName || "",
      content: testimonial.content || "",
      rating: testimonial.rating || 5,
      clientRole: testimonial.clientRole || "",
      projectType: testimonial.projectType || "",
      imageUrl: testimonial.imageUrl || "",
      isPublished: testimonial.isPublished ?? true,
      order: testimonial.order || 0,
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce témoignage ?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Témoignage supprimé.");
        refetch();
      } catch (error) {
        toast.error("Erreur lors de la suppression.");
      }
    }
  };

  const handleTogglePublished = async (id: number, isPublished: boolean) => {
    try {
      await togglePublishedMutation.mutateAsync({ id, isPublished });
      toast.success(`Témoignage ${isPublished ? "publié" : "masqué"}.`);
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour.");
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-primary">
        {isEditing !== null ? "Modifier le Témoignage" : "Ajouter un Nouveau Témoignage"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-lg bg-gray-50">
        <div className="grid md:grid-cols-2 gap-4">
            <Input
            name="clientName"
            placeholder="Nom du client *"
            value={formData.clientName}
            onChange={handleChange}
            required
            />
            <Input
            name="clientRole"
            placeholder="Rôle ou titre du client (ex: Propriétaire)"
            value={formData.clientRole}
            onChange={handleChange}
            />
            <Input
            name="projectType"
            placeholder="Type de projet (ex: Rénovation de cuisine)"
            value={formData.projectType}
            onChange={handleChange}
            />
            <Input
            name="imageUrl"
            placeholder="URL de l'image du client (Optionnel)"
            value={formData.imageUrl}
            onChange={handleChange}
            />
            <Input
                name="order"
                type="number"
                placeholder="Ordre d'affichage (0 par défaut)"
                value={formData.order}
                onChange={handleChange}
            />
            <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Note (sur 5) :</label>
                <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-2"
                >
                    {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                            {n} étoile{n > 1 ? "s" : ""}
                        </option>
                    ))}
                </select>
            </div>
        </div>
        
        <Textarea
          name="content"
          placeholder="Contenu du témoignage *"
          value={formData.content}
          onChange={handleChange}
          required
        />
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPublished"
            name="isPublished"
            checked={formData.isPublished}
            onChange={handleChange}
            className="h-4 w-4 text-primary border-gray-300 rounded"
          />
          <label htmlFor="isPublished" className="text-sm font-medium">
            Publier le témoignage
          </label>
        </div>
        <div className="flex space-x-4">
          <Button type="submit" disabled={loading}>
            {loading ? "En cours..." : isEditing !== null ? "Sauvegarder les Modifications" : "Ajouter le Témoignage"}
          </Button>
          {isEditing !== null && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditing(null);
                setFormData(initialFormData);
              }}
            >
              Annuler
            </Button>
          )}
        </div>
      </form>

      <h2 className="text-2xl font-bold text-primary pt-8 border-t">Liste des Témoignages</h2>
      {isLoading ? (
        <p>Chargement des témoignages...</p>
      ) : (
        <div className="space-y-4">
          {testimonials?.map((testimonial: NonNullable<typeof testimonials>[number]) => (
            <div
              key={testimonial.id}
              className="p-4 border rounded-lg shadow-sm flex justify-between items-start bg-white"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-lg">{testimonial.clientName}</h3>
                  <div className="flex">{renderStars(testimonial.rating || 5)}</div>
                </div>
                <p className="text-sm text-gray-600 italic">"{testimonial.content}"</p>
                <p className="text-xs text-gray-500">
                  {testimonial.clientRole} - {testimonial.projectType}
                </p>
                <div className="flex items-center space-x-2 pt-2">
                  {testimonial.isPublished ? (
                    <span className="flex items-center text-green-600 text-xs font-medium">
                      <Check size={14} className="mr-1" /> Publié
                    </span>
                  ) : (
                    <span className="flex items-center text-red-600 text-xs font-medium">
                      <X size={14} className="mr-1" /> Masqué
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(testimonial)}
                  title="Modifier"
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(testimonial.id)}
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => handleTogglePublished(testimonial.id, !testimonial.isPublished)}
                  title={testimonial.isPublished ? "Masquer" : "Publier"}
                >
                  {testimonial.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
