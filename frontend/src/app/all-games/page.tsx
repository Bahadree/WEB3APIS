"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/navbar";

interface Game {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

// Yardımcı: Resim URL'sini tam URL'ye çevir
function getFullImageUrl(url?: string | null) {
  if (!url) return undefined;
  if (url.startsWith('http://backend:5000/uploads/')) {
    return url.replace('http://backend:5000', '');
  }
  if (url.startsWith('/uploads/')) {
    return url;
  }
  return url;
}

export default function AllGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Tüm API istekleri sadece /api/... ile başlamalı
    fetch(`/api/games`)
      .then((r) => r.json())
      .then((d) => {
        const games = (d.data?.games || []).map((g: any) => ({
          id: g.id,
          name: g.name,
          description: g.description,
          imageUrl: g.image_url,
        }));
        setGames(games);
      })
      .catch(() => setError("Oyunlar alınamadı."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full flex flex-col items-center bg-background pt-16">
        <div className="w-full max-w-7xl mx-auto space-y-8 p-8">
          <h1 className="text-3xl font-bold mb-8">Sistemdeki Tüm Oyunlar</h1>
          {loading ? (
            <div>Yükleniyor...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {games.map((g) => (
                <li key={g.id} className="aspect-square bg-background border rounded-lg flex flex-col items-center justify-center p-6 transition-shadow hover:shadow-lg">
                  {g.imageUrl && (
                    <div className="mb-2 flex items-center justify-center w-full">
                      <img
                        src={getFullImageUrl(g.imageUrl)}
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
    </>
  );
}
