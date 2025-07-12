"use client";

import Navbar from "@/components/layout/navbar";

export default function SettingsPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full flex flex-col items-center bg-background pt-16">
        <div className="w-full max-w-2xl mx-auto space-y-8 p-8">
          <h1 className="text-3xl font-bold mb-8">Ayarlar</h1>
          <div className="bg-card rounded-lg shadow p-6 flex flex-col gap-6">
            <div>
              <div className="font-medium text-muted-foreground mb-1">Dil</div>
              <select className="w-full p-2 rounded border border-border bg-background">
                <option>Türkçe</option>
                <option>English</option>
                <option>Deutsch</option>
                <option>Français</option>
                <option>Español</option>
                <option>Русский</option>
                <option>中文</option>
              </select>
            </div>
            <div>
              <div className="font-medium text-muted-foreground mb-1">Tema</div>
              <select className="w-full p-2 rounded border border-border bg-background">
                <option>Açık</option>
                <option>Koyu</option>
                <option>Sistem</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button className="px-6 py-2 rounded bg-primary text-white font-semibold hover:bg-primary/80 transition">Kaydet</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
