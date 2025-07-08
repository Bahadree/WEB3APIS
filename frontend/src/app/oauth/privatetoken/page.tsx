"use client";
import React, { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

// Oyun ve scope tipleri
interface GameInfo {
  name: string;
  logo: string;
  scopes: string[];
}

function OAuthPrivatetokenInner() {
  const searchParams = useSearchParams();
  const requestToken = searchParams.get('request_token');
  const [game, setGame] = useState<GameInfo | null>(null);
  const [scopes, setScopes] = useState<string[]>([]);
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchGameInfo() {
      try {
        // request_token ile backendden apiKey ve oyun bilgisi çek
        // Demo amaçlı apiKey sabit, gerçekte request_token ile eşleştirilmeli
        const apiKey = 'test-api-key';
        const res = await fetch(`/api/oauth/gameinfo?apiKey=${apiKey}`);
        const data = await res.json();
        setGame(data);
        setScopes(data.scopes || []);
        setSelectedScopes(data.scopes || []);
      } catch (e) {
        setError('Oyun bilgisi alınamadı.');
      } finally {
        setLoading(false);
      }
    }
    fetchGameInfo();
  }, [requestToken]);

  const handleScopeChange = (scope: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scope)
        ? prev.filter((s) => s !== scope)
        : [...prev, scope]
    );
  };

  const handleAuthorize = async () => {
    setError('');
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
    const res = await fetch('/api/oauth/authorize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        request_token: requestToken
      }),
    });
    if (res.ok) setSuccess(true);
    else setError('İzin verilemedi.');
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;
  if (success) return <div>İzin verildi! Pencereyi kapatabilirsiniz.</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex items-center mb-4">
        {game?.logo && (
          <Image src={game.logo} alt="logo" width={48} height={48} className="rounded mr-3" />
        )}
        <div>
          <div className="font-bold text-lg">{game?.name}</div>
          <div className="text-gray-500 text-sm">Bu oyun aşağıdaki verilere erişmek istiyor:</div>
        </div>
      </div>
      <form onSubmit={e => { e.preventDefault(); handleAuthorize(); }}>
        <div className="mb-4">
          {scopes.map(scope => (
            <label key={scope} className="block">
              <input
                type="checkbox"
                checked={selectedScopes.includes(scope)}
                onChange={() => handleScopeChange(scope)}
                className="mr-2"
              />
              {scope}
            </label>
          ))}
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">İzin Ver</button>
      </form>
    </div>
  );
}

export default function OAuthPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <OAuthPrivatetokenInner />
    </Suspense>
  );
}
