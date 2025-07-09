"use client";

import { useProjectData } from "@/hooks/useProjectData";
import type { Project } from "@/hooks/useProjectData";
import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

// Yardımcı: Resim URL'sini tam URL'ye çevir
function getFullImageUrl(url?: string | null) {
  if (!url) return undefined;
  // Eğer backend'den tam URL (http://backend:5000/uploads/...) gelirse, sadece /uploads/... kısmını döndür
  if (url.startsWith('http://backend:5000/uploads/')) {
    return url.replace('http://backend:5000', '');
  }
  if (url.startsWith('/uploads/')) {
    return url;
  }
  return url;
}

export default function ProjectSettingsPage() {
  const { project, loading, error } = useProjectData();
  const [editName, setEditName] = useState(false);
  const [editDesc, setEditDesc] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [localProject, setLocalProject] = useState<Project | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    if (project) {
      setLocalProject(project);
      if (!editName) setName(project.name || "");
      if (!editDesc) setDescription(project.description || "");
    }
    if (project && project.imageUrl) {
      setImagePreview(getFullImageUrl(project.imageUrl) ?? null);
    }
  }, [project, editName, editDesc]);

  if (loading) return <div>Loading...</div>;
  if (error || !project) return <div className="text-red-500">Proje verisi alınamadı.</div>;

  const handleSave = async (field: "name" | "description") => {
    if (field === "name" && name === (project.name || "")) {
      setEditName(false);
      return;
    }
    if (field === "description" && description === (project.description || "")) {
      setEditDesc(false);
      return;
    }
    setSaving(true);
    setSaveMsg("");
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
    try {
      const res = await fetch(`/api/dev/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(field === "name" ? { name } : { description }),
      });
      if (!res.ok) throw new Error("API error");
      setSaveMsg("Kaydedildi!");
      window.location.reload(); // Başarılı güncelleme sonrası sayfayı yenile
      // Güncellenen alanı local state'e yaz
      setLocalProject((prev: Project | null) => prev ? { ...prev, [field]: field === "name" ? name : description } : null);
      if (field === "name") setEditName(false);
      if (field === "description") setEditDesc(false);
    } catch {
      setSaveMsg("Bir hata oluştu.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg("") , 1500);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError("");
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
      const res = await fetch(`/api/dev/projects/${project.id}/image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Yükleme başarısız");
      const data = await res.json();
      setImagePreview(getFullImageUrl(data.imageUrl) ?? null); // Backend imageUrl döndürmeli
      setSaveMsg("Resim yüklendi!");
    } catch (err) {
      setImageError("Resim yüklenemedi.");
    } finally {
      setImageUploading(false);
      setTimeout(() => setSaveMsg("") , 1500);
    }
  };

  // localProject varsa onu göster, yoksa project'i göster
  const displayProject = localProject || project;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Proje Ayarları</h1>
      <div className="p-4 bg-accent/30 rounded shadow mb-4">
        {/* Oyun Resmi Yükleme Alanı */}
        <div className="mb-6">
          <label className="block font-semibold mb-1">Oyun Resmi</label>
          {imagePreview ? (
            <div className="mb-2">
              <Image
                src={imagePreview ? imagePreview : "/no-image.png"}
                alt="Oyun Resmi"
                width={180}
                height={180}
                className="rounded shadow border border-border object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="mb-2 w-[180px] h-[180px] bg-muted rounded flex items-center justify-center text-muted-foreground border border-border">
              <span>Resim yok</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={imageUploading}
            className="block"
          />
          {imageUploading && <span className="text-sm text-muted-foreground ml-2">Yükleniyor...</span>}
          {imageError && <span className="text-sm text-red-500 ml-2">{imageError}</span>}
        </div>
        {/* Proje Adı */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <label className="block font-semibold">Proje Adı</label>
            {!editName && (
              <button
                className="ml-2 p-1 rounded hover:bg-accent/40 transition"
                onClick={() => {
                  setName(displayProject.name || "");
                  setEditName(true);
                }}
                aria-label="Proje adını düzenle"
              >
                <Pencil className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          {!editName ? (
            <motion.div
              key="name-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="text-lg font-semibold text-primary"
            >
              {displayProject.name}
            </motion.div>
          ) : (
            <motion.div
              key="name-edit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <input
                className="block w-full pl-3 pr-3 py-3 border border-border rounded-lg bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={saving}
                placeholder="Proje adını girin"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  className="btn-primary px-6 py-2 rounded font-semibold disabled:opacity-60"
                  onClick={() => handleSave("name")}
                  disabled={saving}
                >
                  {saving ? "Kaydediliyor..." : "Kaydet"}
                </button>
                <button
                  className="btn-secondary px-4 py-2 rounded font-semibold"
                  onClick={() => { setEditName(false); setName(displayProject.name); }}
                  disabled={saving}
                  type="button"
                >
                  Vazgeç
                </button>
              </div>
            </motion.div>
          )}
        </div>
        {/* Proje Açıklaması */}
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1">
            <label className="block font-semibold">Proje Açıklaması</label>
            {!editDesc && (
              <button
                className="ml-2 p-1 rounded hover:bg-accent/40 transition"
                onClick={() => {
                  setDescription(displayProject.description || "");
                  setEditDesc(true);
                }}
                aria-label="Proje açıklamasını düzenle"
              >
                <Pencil className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          {!editDesc ? (
            <motion.div
              key="desc-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="text-muted-foreground whitespace-pre-line"
            >
              {displayProject.description || <span className="italic text-muted-foreground/70">Açıklama yok</span>}
            </motion.div>
          ) : (
            <motion.div
              key="desc-edit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <textarea
                className="block w-full pl-3 pr-3 py-3 border border-border rounded-lg bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                disabled={saving}
                placeholder="Açıklama girin"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  className="btn-primary px-6 py-2 rounded font-semibold disabled:opacity-60"
                  onClick={() => handleSave("description")}
                  disabled={saving}
                >
                  {saving ? "Kaydediliyor..." : "Kaydet"}
                </button>
                <button
                  className="btn-secondary px-4 py-2 rounded font-semibold"
                  onClick={() => { setEditDesc(false); setDescription(displayProject.description || ""); }}
                  disabled={saving}
                  type="button"
                >
                  Vazgeç
                </button>
              </div>
            </motion.div>
          )}
        </div>
        {saveMsg && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-2 text-sm text-green-700">{saveMsg}</motion.div>}
      </div>
    </div>
  );
}
