import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Edit2, Plus, Image as ImageIcon, X } from "lucide-react";

export default function AdminProjectsEnhanced() {
  const { data: projects, refetch } = trpc.content.getProjects.useQuery();
  const createMutation = trpc.content.createProject.useMutation();
  const updateMutation = trpc.content.updateProject.useMutation();
  const deleteMutation = trpc.content.deleteProject.useMutation();
  
  const createImageMutation = trpc.content.createProjectImage.useMutation();
  const deleteImageMutation = trpc.content.deleteProjectImage.useMutation();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [managingImagesId, setManagingImagesId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });
  const [newImageUrl, setNewImageUrl] = useState("");
  const [projectImages, setProjectImages] = useState<any[]>([]);

  // Fetch images when managing a project
  const { data: images, refetch: refetchImages } = trpc.content.getProjectImages.useQuery(
    managingImagesId || 0,
    { enabled: managingImagesId !== null }
  );

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

  const handleManageImages = (projectId: number) => {
    setManagingImagesId(projectId);
  };

  const handleAddImage = async () => {
    if (!newImageUrl || !managingImagesId) {
      toast.error("URL de l'image requise");
      return;
    }
    try {
      await createImageMutation.mutateAsync({
        projectId: managingImagesId,
        imageUrl: newImageUrl,
        order: images?.length || 0,
      });
      toast.success("Image ajoutée avec succès");
      setNewImageUrl("");
      refetchImages();
    } catch (error) {
      toast.error("Erreur lors de l'ajout de l'image");
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm("Supprimer cette image ?")) return;
    try {
      await deleteImageMutation.mutateAsync(imageId);
      toast.success("Image supprimée avec succès");
      refetchImages();
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'image");
    }
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-2xl font-bold text-primary">Gérer les Réalisations</h2>
          {!isAdding && !editingId && !managingImagesId && (
            <Button onClick={() => setIsAdding(true)} className="bg-accent text-white w-full sm:w-auto">
              <Plus size={20} className="mr-2" />
              Ajouter une Réalisation
            </Button>
          )}
        </div>
      
      {/* Manage Images Modal */}
      {managingImagesId && (
        <div className="bg-white p-6 rounded-lg border-2 border-primary shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-primary">Gérer les Images du Projet</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setManagingImagesId(null)}
            >
              <X size={16} />
            </Button>
          </div>

          {/* Add New Image */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium mb-2">Ajouter une image</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 min-w-0 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="/projects/nom-projet/image.jpg"
                  />
                  <Button onClick={handleAddImage} className="bg-primary text-white w-full sm:w-auto">
                    <Plus size={16} className="mr-2" />
                    Ajouter
                  </Button>
                </div>
            <p className="text-xs text-foreground/60 mt-2">
              💡 Astuce: Placez vos images dans /client/public/projects/ et utilisez le chemin relatif
            </p>
          </div>

          {/* Images List */}
          <div className="space-y-3">
            {images && images.length > 0 ? (
              images.map((img, index) => (
                <div key={img.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-border">
                  <span className="text-sm font-medium text-foreground/60">#{index + 1}</span>
                  <img
                    src={img.imageUrl}
                    alt={`Image ${index + 1}`}
                    className="w-20 h-20 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3EImage%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <span className="flex-1 text-sm text-foreground/80 truncate">{img.imageUrl}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteImage(img.id)}
                    className="text-destructive"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-foreground/60 text-center py-4">Aucune image pour ce projet</p>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-gray-50 p-6 rounded-lg border border-border">
          <h3 className="text-lg font-bold mb-4">
            {editingId ? "Modifier la Réalisation" : "Ajouter une Réalisation"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Titre *</label>
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
              <label className="block text-sm font-medium mb-2">
                Image principale (optionnel)
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="/projects/nom-projet/cover.jpg"
              />
              <p className="text-xs text-foreground/60 mt-1">
                Vous pourrez ajouter plusieurs images après la création
              </p>
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
            <div key={project.id} className="bg-gray-50 p-6 rounded-lg border border-border">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-primary mb-2">{project.title}</h3>
                  <p className="text-foreground/80 mb-2">{project.description}</p>
                  {project.imageUrl && (
                    <p className="text-sm text-foreground/60 break-all">Image principale: {project.imageUrl}</p>
                  )}
                </div>
                <div className="flex  gap-2 ml-0 sm:ml-4 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleManageImages(project.id)}
                    className="text-blue-600"
                  >
                    <ImageIcon size={16} className="mr-1" />
                    Images
                  </Button>
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
            </div>
          ))
        ) : (
          <p className="text-foreground/60 text-center py-8">Aucune réalisation pour le moment.</p>
        )}
      </div>
    </div>
  );
}
