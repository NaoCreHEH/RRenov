import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Trash2, Edit2, Plus, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function AdminTestimonials() {
  const { data: testimonials, refetch } = trpc.testimonials.listAll.useQuery();
  const createMutation = trpc.testimonials.create.useMutation();
  const updateMutation = trpc.testimonials.update.useMutation();
  const deleteMutation = trpc.testimonials.delete.useMutation();
  const toggleMutation = trpc.testimonials.togglePublished.useMutation();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    clientName: "",
    clientRole: "",
    projectType: "",
    content: "",
    rating: 5,
    imageUrl: "",
    order: 0,
  });

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      clientName: "",
      clientRole: "",
      projectType: "",
      content: "",
      rating: 5,
      imageUrl: "",
      order: 0,
    });
  };

  const handleEdit = (testimonial: any) => {
    setEditingId(testimonial.id);
    setIsAdding(true);
    setFormData({
      clientName: testimonial.clientName,
      clientRole: testimonial.clientRole || "",
      projectType: testimonial.projectType || "",
      content: testimonial.content,
      rating: testimonial.rating || 5,
      imageUrl: testimonial.imageUrl || "",
      order: testimonial.order || 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
        });
        toast.success("Témoignage modifié avec succès");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Témoignage créé avec succès");
      }

      setIsAdding(false);
      setEditingId(null);
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce témoignage ?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Témoignage supprimé");
        refetch();
      } catch (error) {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  const handleTogglePublished = async (id: number, isPublished: boolean) => {
    try {
      await toggleMutation.mutateAsync({
        id,
        isPublished: !isPublished,
      });
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Gestion des Témoignages</h1>
          {!isAdding && (
            <Button onClick={handleAddNew} className="bg-accent hover:bg-accent/90">
              <Plus size={20} className="mr-2" />
              Ajouter un Témoignage
            </Button>
          )}
        </div>

        {/* Form */}
        {isAdding && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Modifier le Témoignage" : "Nouveau Témoignage"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom du Client *</label>
                  <Input
                    value={formData.clientName}
                    onChange={(e) =>
                      setFormData({ ...formData, clientName: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Rôle/Titre</label>
                  <Input
                    value={formData.clientRole}
                    onChange={(e) =>
                      setFormData({ ...formData, clientRole: e.target.value })
                    }
                    placeholder="ex: Propriétaire, Entrepreneur"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Type de Projet</label>
                  <Input
                    value={formData.projectType}
                    onChange={(e) =>
                      setFormData({ ...formData, projectType: e.target.value })
                    }
                    placeholder="ex: Aménagement combles"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Note (1-5)</label>
                  <select
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: parseInt(e.target.value) })
                    }
                    className="w-full border border-border rounded px-3 py-2"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} étoile{n > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Ordre d'affichage</label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">URL de la Photo</label>
                  <Input
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Contenu du Témoignage *</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Écrivez le témoignage ici..."
                  rows={5}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  {editingId ? "Mettre à jour" : "Créer"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAdding(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Client</th>
                  <th className="px-6 py-3 text-left font-medium">Projet</th>
                  <th className="px-6 py-3 text-left font-medium">Contenu</th>
                  <th className="px-6 py-3 text-left font-medium">Note</th>
                  <th className="px-6 py-3 text-left font-medium">Statut</th>
                  <th className="px-6 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials?.map((testimonial) => (
                  <tr key={testimonial.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <div>
                        <p className="font-medium">{testimonial.clientName}</p>
                        <p className="text-sm text-gray-500">{testimonial.clientRole}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm">{testimonial.projectType}</td>
                    <td className="px-6 py-3 text-sm max-w-xs truncate">
                      {testimonial.content}
                    </td>
                    <td className="px-6 py-3 text-sm">{testimonial.rating}/5</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() =>
                          handleTogglePublished(testimonial.id, testimonial.isPublished)
                        }
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition"
                        style={{
                          backgroundColor: testimonial.isPublished ? "#dcfce7" : "#fee2e2",
                          color: testimonial.isPublished ? "#166534" : "#991b1b",
                        }}
                      >
                        {testimonial.isPublished ? (
                          <>
                            <Eye size={14} /> Publié
                          </>
                        ) : (
                          <>
                            <EyeOff size={14} /> Brouillon
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(testimonial)}
                          className="p-2 hover:bg-gray-100 rounded transition"
                        >
                          <Edit2 size={16} className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(testimonial.id)}
                          className="p-2 hover:bg-gray-100 rounded transition"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!testimonials || testimonials.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun témoignage. Créez-en un pour commencer.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
