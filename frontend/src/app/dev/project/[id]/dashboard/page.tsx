"use client";
import { useProjectData } from "@/hooks/useProjectData";
import Image from "next/image";
import { useEffect, useState } from "react";

// Yardımcı: Resim URL'sini tam URL'ye çevir
function getFullImageUrl(url?: string | null): string {
  if (!url) return "/no-image.png";
  if (url.startsWith('http://backend:5000/uploads/')) {
    return url.replace('http://backend:5000', '');
  }
  if (url.startsWith('/uploads/')) {
    return url;
  }
  return url;
}

export default function DashboardPage() {
  const { project, loading, error } = useProjectData();
  const [allGames, setAllGames] = useState<any[]>([]);
  const [gamesLoading, setGamesLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/games`)
      .then((r) => r.json())
      .then((d) => {
        const games = (d.data?.games || []).map((g: any) => ({
          id: g.id,
          name: g.name,
          description: g.description,
          imageUrl: g.image_url,
        }));
        setAllGames(games);
      })
      .catch(() => setAllGames([]))
      .finally(() => setGamesLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error || !project) return <div className="text-red-500">Proje verisi alınamadı.</div>;
  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        {project.imageUrl && (
          <Image
            src={getFullImageUrl(project.imageUrl)}
            alt={project.name}
            width={64}
            height={64}
            className="rounded object-cover border border-border"
          />
        )}
        <span className="text-3xl font-bold text-primary">{project.name}</span>
        <span className="text-muted-foreground text-base">{project.description}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Buraya metrik kartları, grafikler, hızlı erişim butonları eklenebilir */}
        <div className="p-4 bg-accent/30 rounded shadow">API Kullanımı, Kota, Son 24 Saat</div>
        <div className="p-4 bg-accent/30 rounded shadow">Başlıca İstatistikler</div>
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Sistemdeki Tüm Oyunlar</h2>
        {gamesLoading ? (
          <div>Yükleniyor...</div>
        ) : allGames.length === 0 ? (
          <div>Oyun bulunamadı.</div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allGames.map((g) => (
              <li key={g.id} className="aspect-square bg-background border rounded-lg flex flex-col items-center justify-center p-6 transition-shadow hover:shadow-lg">
                {g.imageUrl && (
                  <div className="mb-2 flex items-center justify-center w-full">
                    <img
                      src={getFullImageUrl(g.imageUrl) || "/no-image.png"}
                      alt={g.name}
                      className="rounded object-cover border border-border"
                      style={{ width: 80, height: 80, objectFit: 'cover', margin: '0 auto' }}
                    />
                  </div>
                )}
                <div className="font-semibold text-lg mb-2 truncate w-full">{g.name}</div>
                <div className="text-muted-foreground text-sm line-clamp-3 w-full">{g.description}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
