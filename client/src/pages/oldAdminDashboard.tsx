import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import AdminServices from "./admin/AdminServices";
import AdminProjectsEnhanced from "./AdminProjectsEnhanced";
import AdminContact from "./admin/AdminContact";
import AdminAbout from "./AdminAbout";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("services");
  const isLoading = user === undefined;

useEffect(() => {
  if (isLoading) return; // on attend d'avoir la vraie info
  if (!isAuthenticated || user?.role !== "admin") {
    setLocation("/login");
  }
}, [isLoading, isAuthenticated, user, setLocation]);


  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />

      {/* Admin Header */}
      <section className="bg-primary text-white py-8">
        <div className="container">
          <h1 className="text-3xl font-bold">Tableau de Bord Admin</h1>
          <p className="text-primary-foreground/90">Gérez le contenu de votre site</p>
        </div>
      </section>

      {/* Admin Content */}
      <section className="py-8 flex-1">
        <div className="container">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-border">
            <Button
              variant={activeTab === "services" ? "default" : "ghost"}
              onClick={() => setActiveTab("services")}
              className={activeTab === "services" ? "bg-primary text-white" : ""}
            >
              Services
            </Button>
            <Button
              variant={activeTab === "projects" ? "default" : "ghost"}
              onClick={() => setActiveTab("projects")}
              className={activeTab === "projects" ? "bg-primary text-white" : ""}
            >
              Réalisations
            </Button>
            <Button
              variant={activeTab === "about" ? "default" : "ghost"}
              onClick={() => setActiveTab("about")}
              className={activeTab === "about" ? "bg-primary text-white" : ""}
            >
              À Propos
            </Button>
            <Button
              variant={activeTab === "contact" ? "default" : "ghost"}
              onClick={() => setActiveTab("contact")}
              className={activeTab === "contact" ? "bg-primary text-white" : ""}
            >
              Contact
            </Button>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg p-8">
            {activeTab === "services" && <AdminServices />}
            {activeTab === "projects" && <AdminProjectsEnhanced />}
            {activeTab === "about" && <AdminAbout />}
            {activeTab === "contact" && <AdminContact />}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-8">
        <div className="container text-center">
          <p>&copy; 2024 Rommelaere Rénov. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
