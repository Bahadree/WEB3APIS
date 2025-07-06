"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import Navbar from "@/components/layout/navbar";

export default function CreateProjectPage() {
  const { isAuthenticated } = useAuth();
  const { lang } = useLanguage();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", description: "", websiteUrl: "", gameType: "p2p", webhookUrl: "" });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const translations = {
    en: {
      title: "Create New Project",
      desc: "Fill out the form to create your new project.",
      name: "Project Name",
      namePlaceholder: "Enter project name",
      description: "Description",
      descriptionPlaceholder: "Enter description",
      url: "Website URL",
      urlPlaceholder: "Enter website URL",
      type: "Game Type",
      webhook: "Webhook URL",
      webhookPlaceholder: "Enter webhook URL (optional)",
      submit: "Create Project",
      back: "Back to Projects",
      success: "Project created successfully!"
    },
    tr: {
      title: "Yeni Proje Oluştur",
      desc: "Yeni projenizi oluşturmak için formu doldurun.",
      name: "Proje Adı",
      namePlaceholder: "Proje adını girin",
      description: "Açıklama",
      descriptionPlaceholder: "Açıklama girin",
      url: "Web Sitesi",
      urlPlaceholder: "Web sitesi adresi girin",
      type: "Oyun Türü",
      webhook: "Webhook URL",
      webhookPlaceholder: "Webhook URL (opsiyonel)",
      submit: "Projeyi Oluştur",
      back: "Projelerime Dön",
      success: "Proje başarıyla oluşturuldu!"
    }
  };
  // Fix for TypeScript: restrict lang to 'en' | 'tr'
  const langKey = (lang === 'tr' ? 'tr' : 'en') as 'en' | 'tr';
  const t = translations[langKey];

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    // Remove empty strings for optional fields to avoid validation errors
    const cleanForm = {
      ...form,
      websiteUrl: form.websiteUrl.trim() === "" ? undefined : form.websiteUrl,
      webhookUrl: form.webhookUrl.trim() === "" ? undefined : form.webhookUrl,
      description: form.description.trim() === "" ? undefined : form.description,
    };
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
    try {
      const res = await fetch("/api/dev/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(cleanForm)
      });
      if (!res.ok) {
        let msg = "API error";
        try {
          const err = await res.json();
          msg = err?.message || msg;
        } catch {}
        throw new Error(msg);
      }
      setSuccess(true);
      setTimeout(() => router.push("/dev"), 1200);
    } catch (err: any) {
      setError(err.message || "API error");
    } finally {
      setCreating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full space-y-8 p-8 text-center text-lg bg-accent/30 rounded-lg">
            Giriş yapmalısınız.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold gradient-text">{t.title}</h2>
            <p className="mt-2 text-muted-foreground">{t.desc}</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleCreate}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="sr-only">{t.name}</label>
                <input
                  required
                  id="name"
                  className="block w-full pl-3 pr-3 py-3 border border-border rounded-lg bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={t.namePlaceholder}
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label htmlFor="description" className="sr-only">{t.description}</label>
                <input
                  id="description"
                  className="block w-full pl-3 pr-3 py-3 border border-border rounded-lg bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={t.descriptionPlaceholder}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div>
                <label htmlFor="websiteUrl" className="sr-only">{t.url}</label>
                <input
                  id="websiteUrl"
                  className="block w-full pl-3 pr-3 py-3 border border-border rounded-lg bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={t.urlPlaceholder}
                  value={form.websiteUrl}
                  onChange={e => setForm(f => ({ ...f, websiteUrl: e.target.value }))}
                />
              </div>
              <div>
                <label htmlFor="gameType" className="sr-only">{t.type}</label>
                <div className="relative">
                  <select
                    id="gameType"
                    className="block w-full pl-3 pr-10 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer hover:bg-accent/40 transition-colors"
                    value={form.gameType}
                    onChange={e => setForm(f => ({ ...f, gameType: e.target.value }))}
                  >
                    <option value="p2p">P2P</option>
                    <option value="mmo">MMO</option>
                    <option value="strategy">Strategy</option>
                    <option value="action">Action</option>
                    <option value="puzzle">Puzzle</option>
                    <option value="other">Other</option>
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.584l3.71-3.354a.75.75 0 111.02 1.1l-4.25 3.846a.75.75 0 01-1.02 0l-4.25-3.846a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
                  </span>
                </div>
              </div>
              <div>
                <label htmlFor="webhookUrl" className="sr-only">{t.webhook}</label>
                <input
                  id="webhookUrl"
                  className="block w-full pl-3 pr-3 py-3 border border-border rounded-lg bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={t.webhookPlaceholder}
                  value={form.webhookUrl}
                  onChange={e => setForm(f => ({ ...f, webhookUrl: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={creating}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.submit}
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 border border-border rounded-lg bg-background text-sm font-medium text-foreground hover:bg-accent"
                onClick={() => router.push("/dev")}
              >
                {t.back}
              </button>
            </div>
            {error && <div className="text-red-500 mt-2">{error}</div>}
            {success && <div className="text-green-600 mt-2">{t.success}</div>}
          </form>
        </div>
      </div>
    </>
  );
}
