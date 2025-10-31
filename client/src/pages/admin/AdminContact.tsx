import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function AdminContact() {
  const { data: contactInfo } = trpc.content.getContactInfo.useQuery();
  const updateMutation = trpc.content.updateContactInfo.useMutation();

  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (contactInfo) {
      setFormData({
        phone: contactInfo.phone || "",
        email: contactInfo.email || "",
        address: contactInfo.address || "",
      });
    }
  }, [contactInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
      });
      toast.success("Informations de contact mises à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour des informations de contact");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Gérer les Informations de Contact</h2>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            Téléphone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="0472 65 58 73"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="contact@rommelaere-renov.com"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-2">
            Adresse
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={4}
            placeholder="Votre adresse complète"
          />
        </div>

        <Button type="submit" className="bg-primary text-white">
          Mettre à jour les informations
        </Button>
      </form>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
        <h3 className="font-bold text-blue-900 mb-2">Informations actuelles</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p><strong>Téléphone :</strong> {contactInfo?.phone || "Non défini"}</p>
          <p><strong>Email :</strong> {contactInfo?.email || "Non défini"}</p>
          <p><strong>Adresse :</strong> {contactInfo?.address || "Non définie"}</p>
        </div>
      </div>
    </div>
  );
}
