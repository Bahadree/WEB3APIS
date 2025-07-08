"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function OAuthAuthorizeInner() {
  const searchParams = useSearchParams();
  const requestToken = searchParams.get("request_token");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameInfo, setGameInfo] = useState<any>(null);
  const [scopes, setScopes] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchInfo() {
      setLoading(true);
      setError(null);
      if (!requestToken) {
        setError("Request token bulunamadı.");
        setLoading(false);
        return;
      }
      try {
        // Request token ile backend'den oyun bilgisi ve scope çek
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '')}/oauth/requestinfo?request_token=${requestToken}`);
        const data = await res.json();
        if (data.error) {
          setError(data.error);
        } else {
          setGameInfo(data.game);
          setScopes(data.scopes || []);
        }
      } catch (e) {
        setError("Sunucu hatası.");
      }
      setLoading(false);
    }
    fetchInfo();
  }, [requestToken]);

  const handleAuthorize = async () => {
    setLoading(true);
    setError(null);
    try {
      const jwt = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      if (!jwt) {
        setError("Giriş yapmalısınız.");
        setLoading(false);
        return;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/oauth/authorize`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
        body: JSON.stringify({ request_token: requestToken })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "İzin verilemedi.");
      }
    } catch (e) {
      setError("Sunucu hatası.");
    }
    setLoading(false);
  };

  if (loading) return <div className="max-w-lg mx-auto mt-16 text-center text-primary">Yükleniyor...</div>;
  if (error) return <div className="max-w-lg mx-auto mt-16 text-center text-red-600">{error}</div>;
  if (success) return <div className="max-w-lg mx-auto mt-16 text-center text-green-600 font-bold">İzin verildi! Uygulamaya dönebilirsiniz.</div>;

  return (
    <div className="max-w-lg mx-auto mt-16 bg-card border border-border rounded-2xl p-8 shadow text-center">
      <h2 className="text-2xl font-bold mb-4 text-primary">Erişim İzni</h2>
      <div className="mb-4">
        <span className="font-semibold">{gameInfo?.name || "Bir uygulama"}</span> aşağıdaki bilgilere erişmek istiyor:
      </div>
      <ul className="mb-6 text-left list-disc pl-8">
        {scopes.map(scope => (
          <li key={scope}>{scope}</li>
        ))}
      </ul>
      <button
        className="px-4 py-2 w-full bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/80 transition"
        onClick={handleAuthorize}
        disabled={loading}
      >
        İzin Ver
      </button>
    </div>
  );
}

export default function OAuthAuthorizePage() {
  return (
    <Suspense fallback={<div className="max-w-lg mx-auto mt-16 text-center text-primary">Yükleniyor...</div>}>
      <OAuthAuthorizeInner />
    </Suspense>
  );
}
