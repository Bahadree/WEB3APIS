"use client";

import Navbar from "@/components/layout/navbar";

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full flex flex-col items-center bg-background pt-16">
        <div className="w-full max-w-2xl mx-auto space-y-8 p-8">
          <h1 className="text-3xl font-bold mb-8">Profilim</h1>
          <div className="bg-card rounded-lg shadow p-6 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-primary">
                {/* Kullanıcı avatarı veya baş harfleri */}
                <span>👤</span>
              </div>
              <div>
                <div className="font-semibold text-xl">Kullanıcı Adı</div>
                <div className="text-muted-foreground text-sm">kullanici@mail.com</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-accent/30 rounded p-4">
                <div className="font-medium text-muted-foreground mb-1">Ad Soyad</div>
                <div className="font-semibold">Adınız Soyadınız</div>
              </div>
              <div className="bg-accent/30 rounded p-4">
                <div className="font-medium text-muted-foreground mb-1">E-posta</div>
                <div className="font-semibold">kullanici@mail.com</div>
              </div>
              <div className="bg-accent/30 rounded p-4">
                <div className="font-medium text-muted-foreground mb-1">Kayıt Tarihi</div>
                <div className="font-semibold">2025-07-12</div>
              </div>
              <div className="bg-accent/30 rounded p-4">
                <div className="font-medium text-muted-foreground mb-1">Durum</div>
                <div className="font-semibold text-green-600">Aktif</div>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button className="px-6 py-2 rounded bg-primary text-white font-semibold hover:bg-primary/80 transition">Profili Düzenle</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
