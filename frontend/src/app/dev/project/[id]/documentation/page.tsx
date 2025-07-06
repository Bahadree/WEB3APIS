"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProjectDocumentationPage() {
  const params = useParams();
  const projectId = params?.id as string;
  const base = `/dev/project/${projectId}/oauth`;

  return (
    <div className="max-w-6xl mx-auto mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 p-6">
      <Link href={`/dev/project/${projectId}/documentation/oauth`} legacyBehavior>
        <a className="flex flex-col items-center justify-center h-56 rounded-3xl bg-primary text-primary-foreground shadow-2xl text-3xl font-bold hover:bg-primary/80 transition border-4 border-primary focus:outline-none focus:ring-4 focus:ring-primary/30">
          <div>OAuth</div>
          <div className="mt-4 text-base font-normal text-primary-foreground/90 text-center px-2">
            OAuth akışını başlat, yetkilendirme ve token işlemlerini yönet.
          </div>
        </a>
      </Link>
      <Link href="#" legacyBehavior>
        <a className="flex flex-col items-center justify-center h-56 rounded-3xl bg-muted text-foreground shadow-2xl text-3xl font-bold hover:bg-accent/40 transition border-4 border-border focus:outline-none focus:ring-4 focus:ring-primary/30">
          <div>API Key</div>
          <div className="mt-4 text-base font-normal text-foreground/80 text-center px-2">
            Projeye özel API anahtarlarını oluştur, sil ve yönet.
          </div>
        </a>
      </Link>
      <Link href="#" legacyBehavior>
        <a className="flex flex-col items-center justify-center h-56 rounded-3xl bg-muted text-foreground shadow-2xl text-3xl font-bold hover:bg-accent/40 transition border-4 border-border focus:outline-none focus:ring-4 focus:ring-primary/30">
          <div>Kullanıcı</div>
          <div className="mt-4 text-base font-normal text-foreground/80 text-center px-2">
            Kullanıcı bilgilerini ve OAuth ile alınan verileri görüntüle.
          </div>
        </a>
      </Link>
      <Link href="#" legacyBehavior>
        <a className="flex flex-col items-center justify-center h-56 rounded-3xl bg-muted text-foreground shadow-2xl text-3xl font-bold hover:bg-accent/40 transition border-4 border-border focus:outline-none focus:ring-4 focus:ring-primary/30">
          <div>Proje</div>
          <div className="mt-4 text-base font-normal text-foreground/80 text-center px-2">
            Proje ayarlarını, görsellerini ve temel bilgileri düzenle.
          </div>
        </a>
      </Link>
      <Link href="#" legacyBehavior>
        <a className="flex flex-col items-center justify-center h-56 rounded-3xl bg-muted text-foreground shadow-2xl text-3xl font-bold hover:bg-accent/40 transition border-4 border-border focus:outline-none focus:ring-4 focus:ring-primary/30">
          <div>Scope</div>
          <div className="mt-4 text-base font-normal text-foreground/80 text-center px-2">
            OAuth ile talep edilen izinleri (scope) belirle ve yönet.
          </div>
        </a>
      </Link>
      <Link href="#" legacyBehavior>
        <a className="flex flex-col items-center justify-center h-56 rounded-3xl bg-muted text-foreground shadow-2xl text-3xl font-bold hover:bg-accent/40 transition border-4 border-border focus:outline-none focus:ring-4 focus:ring-primary/30">
          <div>Ayarlar</div>
          <div className="mt-4 text-base font-normal text-foreground/80 text-center px-2">
            Gelişmiş ayarları ve entegrasyon seçeneklerini yapılandır.
          </div>
        </a>
      </Link>
    </div>
  );
}
