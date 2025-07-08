"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import Navbar from "@/components/layout/navbar";
import Image from "next/image";

// Type definitions for better type safety
interface Project {
  id: string;
  name: string;
  description?: string;
  websiteUrl?: string;
  gameType?: string;
  imageUrl?: string; // Resim URL'si için alan eklendi
  // add other fields if needed
}
interface ApiKey {
  id: string;
  api_key: string;
  key_name: string;
}

export default function DevelopersPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { lang } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", websiteUrl: "", gameType: "p2p", webhookUrl: "" });
  const [creating, setCreating] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiKeyCreated, setApiKeyCreated] = useState<ApiKey | null>(null);

  // Popup state for API key reset
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [resettingApi, setResettingApi] = useState(false);
  const [resetError, setResetError] = useState("");

  // i18n (kısa)
  type LangKey = 'en' | 'tr';
  type TranslationType = {
    title: string;
    create: string;
    name: string;
    desc: string;
    url: string;
    type: string;
    webhook: string;
    submit: string;
    cancel: string;
    apis: string;
    createApi: string;
    apiName: string;
    actions: string;
    noProjects: string;
    apiCreated: string;
    showApis: string;
    close: string;
  };
  const translations: Record<LangKey, TranslationType> = {
    en: {
      title: "Developer Projects",
      create: "Create Project",
      name: "Project Name",
      desc: "Description",
      url: "Website URL",
      type: "Game Type",
      webhook: "Webhook URL",
      submit: "Submit",
      cancel: "Cancel",
      apis: "API Keys",
      createApi: "Create API Key",
      apiName: "API Key Name",
      actions: "Actions",
      noProjects: "No projects yet.",
      apiCreated: "API Key created!",
      showApis: "Show APIs",
      close: "Close"
    },
    tr: {
      title: "Geliştirici Projeleri",
      create: "Proje Oluştur",
      name: "Proje Adı",
      desc: "Açıklama",
      url: "Web Sitesi",
      type: "Oyun Türü",
      webhook: "Webhook URL",
      submit: "Kaydet",
      cancel: "İptal",
      apis: "API Anahtarları",
      createApi: "API Anahtarı Oluştur",
      apiName: "API Anahtarı Adı",
      actions: "İşlemler",
      noProjects: "Henüz projeniz yok.",
      apiCreated: "API Anahtarı oluşturuldu!",
      showApis: "API Anahtarlarını Göster",
      close: "Kapat"
    }
  };
  const langKey: LangKey = lang === 'tr' ? 'tr' : 'en';
  const t: TranslationType = translations[langKey];

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      setLoading(false);
      return;
    }
    if (isAuthenticated !== true) return;
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
    fetch("/api/dev/projects", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((r) => r.json())
      .then((d) => {
        // camelCase dönüşümü
        const projects = (d.data?.projects || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          websiteUrl: p.website_url,
          gameType: p.game_type,
          imageUrl: p.image_url, // Resim URL'sinin dönüşümü
          // diğer alanlar gerekiyorsa eklenebilir
        }));
        setProjects(projects);
      })
      .catch(() => setError("Error"))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
    try {
      const res = await fetch("/api/dev/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("API error");
      setShowForm(false);
      setForm({ name: "", description: "", websiteUrl: "", gameType: "p2p", webhookUrl: "" });
      // Refresh projects
      const d = await res.json();
      setProjects((prev) => [d.data.project, ...prev]);
    } catch {
      setError("Error");
    } finally {
      setCreating(false);
    }
  };

  const handleShowApis = async (project: Project) => {
    setSelectedProject(project);
    setApiLoading(true);
    setApiError("");
    setApiKeyCreated(null);
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
    try {
      const res = await fetch(`/api/dev/projects/${project.id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("API error");
      const d = await res.json();
      setApiKeys(d.data.project.apiKeys || []);
    } catch {
      setApiError("API error");
    } finally {
      setApiLoading(false);
    }
  };

  // API anahtarı silme
  const handleDeleteApiKey = async (keyId: string) => {
    if (!selectedProject) return;
    if (!confirm("API anahtarını silmek istediğinize emin misiniz?")) return;
    setApiLoading(true);
    setApiError("");
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
    try {
      const res = await fetch(`/api/dev/projects/${selectedProject.id}/api-keys/${keyId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("API error");
      setApiKeys((prev) => prev.filter((k) => k.id !== keyId));
    } catch {
      setApiError("API error");
    } finally {
      setApiLoading(false);
    }
  };

  // Proje ayarlarını açmak için yeni bir fonksiyon
  const handleOpenProjectSettings = (project: Project) => {
    // Proje dashboard sayfasına yönlendir
    router.push(`/dev/project/${project.id}/dashboard`);
  };

  // Yardımcı: Resim URL'sini tam URL'ye çevir
  function getFullImageUrl(url?: string | null) {
    if (!url) return "/no-image.png"; // fallback görsel
    if (url.startsWith("http")) return url;
    if (url.startsWith("/uploads/")) return `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '')}${url}`;
    return url;
  }

  if (!mounted) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen w-full flex flex-col items-center bg-background pt-16">
          <div className="w-full max-w-7xl mx-auto space-y-8 p-8">
            <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6" />
            <div className="h-32 w-full bg-muted rounded animate-pulse" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full flex flex-col items-center bg-background pt-16">
        <div className="w-full max-w-7xl mx-auto space-y-8 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold gradient-text">{t.title}</h1>
            <button
              className="btn-primary"
              onClick={() => router.push('/dev/create-project')}
            >
              {t.create}
            </button>
          </div>
          <div className="mt-8">
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div>
                {projects.length === 0 ? (
                  <div className="text-center text-muted-foreground text-lg py-12">{t.noProjects}</div>
                ) : (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {projects.map((p) => (
                      <li
                        key={p.id}
                        className="aspect-square overflow-hidden shadow-lg transition-shadow hover:shadow-2xl cursor-pointer p-0 m-0 rounded-xl relative group bg-black"
                        style={{ minHeight: 0 }}
                      >
                        <button
                          className="w-full h-full relative outline-none p-0 m-0 border-none bg-transparent"
                          onClick={() => handleOpenProjectSettings(p)}
                          style={{ padding: 0, margin: 0, border: 'none', background: 'transparent', height: '100%', width: '100%' }}
                        >
                          {/* Background image as absolute fill */}
                          <div className="absolute inset-0 z-0">
                            <Image
                              src={getFullImageUrl(p.imageUrl) as string}
                              alt={p.name}
                              fill
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                              sizes="100vw"
                              priority
                            />
                          </div>
                          {/* Top left: Project name with blur and semi-transparent bg */}
                          <div
                            className="absolute top-4 left-4 px-4 py-2 rounded-lg backdrop-blur-md bg-black/60 text-white text-lg font-semibold shadow-lg z-10"
                            style={{ maxWidth: '80%', backdropFilter: 'blur(8px)' }}
                          >
                            {p.name}
                          </div>
                          {/* Bottom: Description with blur and semi-transparent bg */}
                          <div
                            className="absolute bottom-0 left-0 w-full px-4 py-3 rounded-b-xl backdrop-blur-md bg-black/50 text-white text-base shadow-lg z-10"
                            style={{ backdropFilter: 'blur(8px)' }}
                          >
                            <span className="line-clamp-2 block">{p.description}</span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
