import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Edit2, Plus } from "lucide-react";

export default function AdminServices() {
  const { data: services, refetch } = trpc.content.getServices.useQuery();
  const createMutation = trpc.content.createService.useMutation();
  const updateMutation = trpc.content.updateService.useMutation();
  const deleteMutation = trpc.content.deleteService.useMutation();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
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
        icon: formData.icon,
      });
      toast.success("Service ajouté avec succès");
      setFormData({ title: "", description: "", icon: "" });
      setIsAdding(false);
      refetch();
    } catch (error) {
      toast.error("Erreur lors de l'ajout du service");
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      await updateMutation.mutateAsync({
        id,
        title: formData.title,
        description: formData.description,
        icon: formData.icon,
      });
      toast.success("Service mis à jour avec succès");
      setFormData({ title: "", description: "", icon: "" });
      setEditingId(null);
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du service");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Service supprimé avec succès");
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la suppression du service");
    }
  };

  const handleEdit = (service: any) => {
    setEditingId(service.id);
    setFormData({
      title: service.title,
      description: service.description || "",
      icon: service.icon || "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Gérer les Services</h2>
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)} className="bg-accent text-white">
            <Plus size={20} className="mr-2" />
            Ajouter un Service
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-gray-50 p-6 rounded-lg border border-border">
          <h3 className="text-lg font-bold mb-4">
            {editingId ? "Modifier le Service" : "Ajouter un Service"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Titre</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Titre du service"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={4}
                placeholder="Description du service"
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
                  setFormData({ title: "", description: "", icon: "" });
                }}
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="space-y-4">
        {services && services.length > 0 ? (
          services.map((service) => (
            <div key={service.id} className="bg-gray-50 p-6 rounded-lg border border-border flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-primary mb-2">{service.title}</h3>
                <p className="text-foreground/80">{service.description}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(service)}
                >
                  <Edit2 size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(service.id)}
                  className="text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-foreground/60 text-center py-8">Aucun service pour le moment.</p>
        )}
      </div>
    </div>
  );
}
