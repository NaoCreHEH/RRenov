import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Edit2, Plus, Trash2 } from "lucide-react";

export default function AdminAbout() {
  const { data: aboutContent, refetch: refetchAbout } = trpc.content.getAboutContent.useQuery();
  const { data: teamMembers, refetch: refetchTeam } = trpc.content.getTeamMembers.useQuery();
  const upsertAboutMutation = trpc.content.upsertAboutContent.useMutation();
  const createTeamMutation = trpc.content.createTeamMember.useMutation();
  const updateTeamMutation = trpc.content.updateTeamMember.useMutation();
  const deleteTeamMutation = trpc.content.deleteTeamMember.useMutation();

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  
  const [aboutForm, setAboutForm] = useState({
    section: "",
    title: "",
    content: "",
  });

  const [teamForm, setTeamForm] = useState({
    name: "",
    role: "",
    bio: "",
    imageUrl: "",
  });

  const handleEditAbout = (section: any) => {
    setEditingSection(section.section);
    setAboutForm({
      section: section.section,
      title: section.title || "",
      content: section.content || "",
    });
  };

  const handleSaveAbout = async () => {
    try {
      await upsertAboutMutation.mutateAsync(aboutForm);
      toast.success("Section mise à jour avec succès");
      setEditingSection(null);
      setAboutForm({ section: "", title: "", content: "" });
      refetchAbout();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleEditTeam = (member: any) => {
    setEditingTeamId(member.id);
    setTeamForm({
      name: member.name,
      role: member.role || "",
      bio: member.bio || "",
      imageUrl: member.imageUrl || "",
    });
  };

  const handleSaveTeam = async () => {
    if (!teamForm.name) {
      toast.error("Le nom est requis");
      return;
    }
    try {
      if (editingTeamId) {
        await updateTeamMutation.mutateAsync({
          id: editingTeamId,
          ...teamForm,
        });
        toast.success("Membre mis à jour avec succès");
      } else {
        await createTeamMutation.mutateAsync(teamForm);
        toast.success("Membre ajouté avec succès");
      }
      setEditingTeamId(null);
      setIsAddingTeam(false);
      setTeamForm({ name: "", role: "", bio: "", imageUrl: "" });
      refetchTeam();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleDeleteTeam = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) return;
    try {
      await deleteTeamMutation.mutateAsync(id);
      toast.success("Membre supprimé avec succès");
      refetchTeam();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const getSectionLabel = (section: string) => {
    const labels: Record<string, string> = {
      header: "En-tête",
      who_we_are: "Qui Sommes-Nous ?",
      expertise: "Notre Expertise",
      values: "Nos Valeurs",
    };
    return labels[section] || section;
  };

  return (
    <div className="space-y-8">
      {/* About Content Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">Gérer le Contenu "À Propos"</h2>
        
        <div className="space-y-4">
          {aboutContent && aboutContent.length > 0 ? (
            aboutContent.map((section) => (
              <div key={section.id} className="bg-gray-50 p-6 rounded-lg border border-border">
                {editingSection === section.section ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Section</label>
                      <input
                        type="text"
                        value={getSectionLabel(aboutForm.section)}
                        disabled
                        className="w-full px-4 py-2 border border-border rounded-lg bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Titre</label>
                      <input
                        type="text"
                        value={aboutForm.title}
                        onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Contenu</label>
                      <textarea
                        value={aboutForm.content}
                        onChange={(e) => setAboutForm({ ...aboutForm, content: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        rows={6}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveAbout} className="bg-primary text-white">
                        <Save size={16} className="mr-2" />
                        Enregistrer
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingSection(null);
                          setAboutForm({ section: "", title: "", content: "" });
                        }}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-primary mb-2">
                        {getSectionLabel(section.section)}
                      </h3>
                      {section.title && (
                        <p className="text-sm font-semibold text-foreground/90 mb-2">{section.title}</p>
                      )}
                      <p className="text-foreground/80 whitespace-pre-line">{section.content}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditAbout(section)}
                    >
                      <Edit2 size={16} />
                    </Button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-foreground/60 text-center py-8">Aucun contenu pour le moment.</p>
          )}
        </div>
      </div>

      {/* Team Members Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">Gérer l'Équipe</h2>
          {!isAddingTeam && !editingTeamId && (
            <Button onClick={() => setIsAddingTeam(true)} className="bg-accent text-white">
              <Plus size={20} className="mr-2" />
              Ajouter un Membre
            </Button>
          )}
        </div>

        {/* Add/Edit Team Form */}
        {(isAddingTeam || editingTeamId) && (
          <div className="bg-gray-50 p-6 rounded-lg border border-border">
            <h3 className="text-lg font-bold mb-4">
              {editingTeamId ? "Modifier le Membre" : "Ajouter un Membre"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom *</label>
                <input
                  type="text"
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nom complet"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rôle</label>
                <input
                  type="text"
                  value={teamForm.role}
                  onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ex: Fondateur et gérant"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Biographie</label>
                <textarea
                  value={teamForm.bio}
                  onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={6}
                  placeholder="Description du membre de l'équipe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">URL de l'image</label>
                <input
                  type="text"
                  value={teamForm.imageUrl}
                  onChange={(e) => setTeamForm({ ...teamForm, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="/matthias.png"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveTeam} className="bg-primary text-white">
                  {editingTeamId ? "Mettre à jour" : "Ajouter"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingTeam(false);
                    setEditingTeamId(null);
                    setTeamForm({ name: "", role: "", bio: "", imageUrl: "" });
                  }}
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Team Members List */}
        <div className="space-y-4">
          {teamMembers && teamMembers.length > 0 ? (
            teamMembers.map((member) => (
              <div key={member.id} className="bg-gray-50 p-6 rounded-lg border border-border">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4 flex-1">
                    {member.imageUrl && (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-primary mb-1">{member.name}</h3>
                      {member.role && (
                        <p className="text-sm font-semibold text-foreground/90 mb-2">{member.role}</p>
                      )}
                      <p className="text-foreground/80 whitespace-pre-line">{member.bio}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditTeam(member)}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteTeam(member.id)}
                      className="text-destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-foreground/60 text-center py-8">Aucun membre pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
