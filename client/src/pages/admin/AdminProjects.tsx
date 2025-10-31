import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Edit2, Plus } from "lucide-react";

export default function AdminProjects() {
  const { data: projects, refetch } = trpc.content.getProjects.useQuery();
  const createMutation = trpc.content.createProject.useMutation();
  const updateMutation = trpc.content.updateProject.useMutation();
  const deleteMutation = trpc.content.deleteProject.useMutation();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });

  const handleAdd = async () => {
    if (!formData.title) {
      toast.error("Le titre est requis");
      return;
    }
    try {
      await createMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl,
      });
      toast.success("Réalisation ajoutée avec succès");
      setFormData({ title: "", description: "", imageUrl: "" });
      setIsAdding(false);
      refetch();
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la réalisation");
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      await updateMutation.mutateAsync({
        id,
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl,
      });
      toast.success("Réalisation mise à jour avec succès");
      setFormData({ title: "", description: "", imageUrl: "" });
      setEditingId(null);
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la réalisation");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette réalisation ?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Réalisation supprimée avec succès");
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la suppression de la réalisation");
    }
  };

  const handleEdit = (project: any) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      description: project.description || "",
      imageUrl: project.imageUrl || "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Gérer les Réalisations</h2>
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)} className="bg-accent text-white">
            <Plus size={20} className="mr-2" />
            Ajouter une Réalisation
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-gray-50 p-6 rounded-lg border border-border">
          <h3 className="text-lg font-bold mb-4">
            {editingId ? "Modifier la Réalisation" : "Ajouter une Réalisation"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Titre</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Titre du projet"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={4}
                placeholder="Description du projet"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">URL de l'image</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://exemple.com/image.jpg"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => (editingId ? handleUpdate(editingId) : handleAdd())}
                className="bg-primary text-white"
              >
                {editingId ? "Mettre à jour" : "Ajouter"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setFormData({ title: "", description: "", imageUrl: "" });
                }}
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {projects && projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.id} className="bg-gray-50 p-6 rounded-lg border border-border flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-primary mb-2">{project.title}</h3>
                <p className="text-foreground/80 mb-2">{project.description}</p>
                {project.imageUrl && (
                  <p className="text-sm text-foreground/60">Image: {project.imageUrl}</p>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(project)}
                >
                  <Edit2 size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(project.id)}
                  className="text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-foreground/60 text-center py-8">Aucune réalisation pour le moment.</p>
        )}
      </div>
    </div>
  );
}
