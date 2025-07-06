"use client";

import { useProjectData } from "@/hooks/useProjectData";

export default function ProjectSettingsPage() {
  const { project, loading, error } = useProjectData();
  if (loading) return <div>Loading...</div>;
  if (error || !project) return <div className="text-red-500">Proje verisi alınamadı.</div>;
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{project.name} - Hesap Ayarları</h1>
      <p className="text-muted-foreground mb-4">{project.description}</p>
      <div className="p-4 bg-accent/30 rounded shadow mb-4">Proje ile ilgili hesap ayarlarını buradan yönetebilirsiniz.</div>
      {/* Şifre değiştir, e-posta güncelle, 2FA gibi ayarlar buraya */}
    </div>
  );
}
