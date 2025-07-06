"use client";
import React, { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";

export default function OAuthAuthorizeDemo() {
  const params = useParams();
  const pathname = usePathname();
  const projectId = params?.id as string;
  const [apiKey, setApiKey] = useState("");
  const [step, setStep] = useState(0);
  const [requestToken, setRequestToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Projenin API keyini otomatik çek
  useEffect(() => {
    async function fetchApiKey() {
      if (!projectId) return;
      setLoading(true);
      setError(null);
      try {
        const jwt = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        if (!jwt) {
          setError("Giriş yapmalısınız (JWT bulunamadı).");
          setLoading(false);
          return;
        }
        const res = await fetch(`/api/dev/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${jwt}` }
        });
        const data = await res.json();
        if (data && data.data && data.data.project && data.data.project.apiKeys && data.data.project.apiKeys.length > 0) {
          setApiKey(data.data.project.apiKeys[0].api_key);
        } else {
          setError("API key bulunamadı.");
        }
      } catch (e) {
        setError("API key alınırken hata oluştu.");
      }
      setLoading(false);
    }
    fetchApiKey();
  }, [projectId]);

  // Request token alma süresi kontrolü
  const [lastRequestTokenTime, setLastRequestTokenTime] = useState<number | null>(null);

  useEffect(() => {
    // localStorage'dan son request token zamanını oku
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("oauth_demo_last_request_token_time");
      if (t) setLastRequestTokenTime(Number(t));
    }
  }, []);

  // 1. Request Token
  const handleRequestToken = async () => {
    // 3 dakika (180000 ms) kontrolü
    const now = Date.now();
    const last = lastRequestTokenTime || (typeof window !== "undefined" ? Number(localStorage.getItem("oauth_demo_last_request_token_time")) : 0);
    if (last && now - last < 180000) {
      setError("Demo modunda Request Token yalnızca 3 dakikada bir alınabilir.");
      return;
    }
    setLoading(true);
    setError(null);
    setAccessToken(null);
    setUserInfo(null);
    if (!apiKey) {
      setError("API key giriniz.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/oauth/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey }),
      });
      const data = await res.json();
      if (data.request_token) {
        setRequestToken(data.request_token);
        setStep(1);
        setLastRequestTokenTime(now);
        if (typeof window !== "undefined") {
          localStorage.setItem("oauth_demo_last_request_token_time", String(now));
        }
      } else {
        setError(data.error || "Request token alınamadı.");
      }
    } catch (e) {
      setError("Request token alınırken hata oluştu.");
    }
    setLoading(false);
  };

  // Access token alma süresi kontrolü
  const [lastAccessTokenTime, setLastAccessTokenTime] = useState<number | null>(null);

  useEffect(() => {
    // localStorage'dan son access token zamanını oku
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("oauth_demo_last_access_token_time");
      if (t) setLastAccessTokenTime(Number(t));
    }
  }, []);

  // 2. Access Token
  const handleAccessToken = async () => {
    // 3 dakika (180000 ms) kontrolü
    const now = Date.now();
    const last = lastAccessTokenTime || (typeof window !== "undefined" ? Number(localStorage.getItem("oauth_demo_last_access_token_time")) : 0);
    if (last && now - last < 180000) {
      setError("Demo modunda Access Token yalnızca 3 dakikada bir alınabilir.");
      return;
    }
    if (!requestToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_token: requestToken }),
      });
      const data = await res.json();
      if (data.access_token) {
        setAccessToken(data.access_token);
        setStep(2);
        setLastAccessTokenTime(now);
        if (typeof window !== "undefined") {
          localStorage.setItem("oauth_demo_last_access_token_time", String(now));
        }
      } else {
        setError(data.error || "Access token alınamadı.");
      }
    } catch (e) {
      setError("Access token alınırken hata oluştu.");
    }
    setLoading(false);
  };

  // 3. Kullanıcı Bilgisi
  const handleUserInfo = async () => {
    // JWT'yi localStorage'dan çek
    const jwt = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!jwt) {
      setError("LocalStorage'da accessToken bulunamadı.");
      return;
    }
    if (!accessToken) {
      setError("Önce access token alınmalı.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/oauth/userdata?access_token=${accessToken}`);
      const data = await res.json();
      setUserInfo(data);
      setStep(3);
    } catch (e) {
      setError("Kullanıcı bilgisi alınırken hata oluştu.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-card border border-primary rounded-2xl p-8 shadow-lg text-center">
      <h3 className="text-2xl font-bold mb-4 text-primary">OAuth Demo Akışı</h3>
      <div className="mb-4">
        <input
          type="text"
          className="px-3 py-2 border rounded-lg w-full max-w-xs text-center bg-muted text-foreground border-border"
          placeholder="API Key"
          value={apiKey}
          readOnly
          disabled
        />
      </div>
      <ol className="list-decimal text-left mb-4 pl-6">
        <li className={step >= 1 ? "font-bold text-primary" : ""}>Request Token al</li>
        <li className={step >= 2 ? "font-bold text-primary" : ""}>Access Token al</li>
        <li className={step >= 3 ? "font-bold text-primary" : ""}>Token ile Kullanıcı Bilgisi</li>
      </ol>
      <div className="space-y-4">
        <button
          className="px-4 py-2 w-full bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/80 transition"
          onClick={handleRequestToken}
          disabled={loading}
        >
          1. Request Token Al
        </button>
        <a
          href={requestToken ? `/oauth/authorize?request_token=${requestToken}` : '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full block"
        >
          <button
            className="px-4 py-2 w-full bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/80 transition"
            disabled={!requestToken}
          >
            2. Kullanıcıyı İzin Ekranına Yönlendir
          </button>
        </a>
        <button
          className="px-4 py-2 w-full bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/80 transition"
          onClick={handleAccessToken}
          disabled={!requestToken || loading}
        >
          3. Access Token Al
        </button>
        <button
          className="px-4 py-2 w-full bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/80 transition"
          onClick={handleUserInfo}
          disabled={loading}
        >
          4. Kullanıcı Bilgisi Getir (JWT localStorage'dan)
        </button>
      </div>
      {loading && <div className="mt-4 text-primary">Yükleniyor...</div>}
      {error && <div className="mt-4 text-red-600">{error}</div>}
      {requestToken && (
        <div className="mt-4 text-sm break-all">
          <b>Request Token:</b> {requestToken}
        </div>
      )}
      {accessToken && (
        <div className="mt-4 text-sm break-all">
          <b>Access Token:</b> {accessToken}
        </div>
      )}
      {userInfo && (
        <div className="mt-4 text-sm break-all bg-muted p-4 rounded-xl border mt-6">
          <b>Kullanıcı Bilgisi:</b>
          <pre className="text-xs text-left whitespace-pre-wrap">{JSON.stringify(userInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
