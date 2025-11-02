// RRenov/client/src/components/ImageUpload.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
}

export default function ImageUpload({ onUploadSuccess }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadStatus("idle");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Veuillez sélectionner un fichier.");
      return;
    }

    setIsUploading(true);
    setUploadStatus("idle");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Échec de l'upload du fichier.");
      }

      const data = await response.json();
      if (data.success && data.url) {
        toast.success("Image uploadée avec succès !");
        setUploadStatus("success");
        onUploadSuccess(data.url);
      } else {
        throw new Error(data.message || "Réponse d'upload invalide.");
      }
    } catch (error) {
      console.error("Erreur d'upload:", error);
      toast.error("Erreur lors de l'upload de l'image.");
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="max-w-sm"
        disabled={isUploading}
      />
      <Button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="flex items-center"
      >
        {isUploading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : uploadStatus === "success" ? (
          <CheckCircle className="mr-2 h-4 w-4" />
        ) : uploadStatus === "error" ? (
          <XCircle className="mr-2 h-4 w-4" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        {isUploading ? "Upload en cours..." : "Uploader"}
      </Button>
    </div>
  );
}
