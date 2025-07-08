"use client";

import { useProjectData } from "@/hooks/useProjectData";
import { useEffect, useRef, useState } from "react";

// Types for better type safety
interface ApiKey {
  id: string;
  api_key: string;
  key_name: string;
  permissions: string[] | Record<string, boolean>;
}

interface Permissions {
  read: boolean;
  write: boolean;
  update: boolean;
  delete: boolean;
}

export default function ApiKeysPage() {
  const { project, loading, error } = useProjectData();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiKeyCreated, setApiKeyCreated] = useState<ApiKey | null>(null);
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [resettingApi, setResettingApi] = useState(false);
  const [resetError, setResetError] = useState("");

  // Delete API Key state
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteKeyId, setDeleteKeyId] = useState<string | null>(null);

  // Permissions state
  const [permissions, setPermissions] = useState<Permissions>({
    read: true,
    write: false,
    update: false,
    delete: false,
  });
  const [permissionsChanged, setPermissionsChanged] = useState(false);

  const permissionList = [
    { key: 'read', label: 'read', desc: 'Verileri okuyabilir' },
    { key: 'write', label: 'write', desc: 'Yeni veri oluşturabilir' },
    { key: 'update', label: 'update', desc: 'Mevcut verileri değiştirebilir' },
    { key: 'delete', label: 'delete', desc: 'Verileri silebilir' },
  ];

  const prevApiKeyId = useRef<string | null>(null);

  useEffect(() => {
    if (!project?.id) return;
    setApiLoading(true);
    setApiError("");
    setApiKeyCreated(null);
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
    fetch(`/api/dev/projects/${project.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setApiKeys(d.data.project.apiKeys || []))
      .catch(() => setApiError("API error"))
      .finally(() => setApiLoading(false));
  }, [project?.id, setApiLoading, setApiError, setApiKeyCreated, setApiKeys]);

  useEffect(() => {
    if (
      apiKeys.length > 0 &&
      apiKeys[0].id !== prevApiKeyId.current &&
      !permissionsChanged
    ) {
      let permsObj: Permissions = { read: false, write: false, update: false, delete: false };
      if (Array.isArray(apiKeys[0].permissions)) {
        (apiKeys[0].permissions as string[]).forEach((key) => {
          if (key in permsObj) permsObj[key as keyof Permissions] = true;
        });
      } else if (
        typeof apiKeys[0].permissions === "object" &&
        apiKeys[0].permissions !== null
      ) {
        permsObj = { ...permsObj, ...apiKeys[0].permissions };
      }
      setPermissions({
        read: permsObj.read ?? false,
        write: permsObj.write ?? false,
        update: permsObj.update ?? false,
        delete: permsObj.delete ?? false,
      });
      prevApiKeyId.current = apiKeys[0].id;
      setPermissionsChanged(false);
    }
  }, [apiKeys, permissionsChanged, setPermissions, setPermissionsChanged]);

  const handleDeleteApiKey = async () => {
    if (!project || !deleteKeyId) return;
    setApiLoading(true);
    setApiError("");
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
    try {
      const res = await fetch(`/api/dev/projects/${project.id}/api-keys/${deleteKeyId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("API error");
      setApiKeys((prev) => prev.filter((k) => k.id !== deleteKeyId));
      setShowDeletePopup(false);
      setDeleteKeyId(null);
    } catch {
      setApiError("API error");
    } finally {
      setApiLoading(false);
    }
  };

  // Permissions değiştiğinde flag'i güncelle
  const handlePermissionChange = (key: string) => {
    setPermissions((prev) => {
      const updated = { ...prev, [key]: !prev[key as keyof typeof prev] };
      setPermissionsChanged(true);
      return updated;
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {loading ? (
        <div>Loading...</div>
      ) : error || !project ? (
        <div className="text-red-500">Proje verisi alınamadı.</div>
      ) : (
        <>
          {/* <h1 className="text-2xl font-bold mb-2">{project.name} - API Keys</h1> */}
          {/* <p className="text-muted-foreground mb-4">{project.description}</p> */}
          <div className="mb-4 p-4 bg-accent/30 rounded shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="flex gap-2 w-full">
                <button
                  className={`w-full btn-primary bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white hover:bg-red-800 hover:shadow transition-all duration-200 border-none rounded font-semibold`}
                  onClick={() => setShowResetPopup(true)}
                >
                  {apiKeys.length === 0 ? "API Anahtarı Oluştur" : "API Anahtarını Resetle"}
                </button>
                <button
                  className={`w-full btn-danger bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white font-semibold rounded-md shadow-lg hover:bg-red-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border-none ring-2 ring-red-400/30 focus:ring-4 focus:ring-red-300/60 backdrop-brightness-110`}
                  onClick={() => { setShowDeletePopup(true); setDeleteKeyId(apiKeys[0]?.id); }}
                  disabled={apiKeys.length === 0 || apiLoading}
                >
                  API Anahtarını Sil
                </button>
              </div>
            </div>
          </div>
          {/* Reset API Key Popup */}
          {showResetPopup && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-background p-6 rounded-lg max-w-sm w-full relative shadow-lg border flex flex-col items-center">
                <div className="text-lg font-semibold mb-2 text-center">API Key&apos;i sıfırlamak istediğinize emin misiniz?</div>
                <div className="text-muted-foreground text-sm mb-4 text-center">
                  Bu işlem mevcut anahtarı geçersiz kılar ve yeni bir API Key üretir.<br />
                  {apiKeys.length === 0 && (
                    <span className="text-yellow-600 font-semibold block mt-2">İlk kez API anahtarı oluşturuyorsunuz. Oluşan anahtarı güvenli bir yerde saklayın, bir daha gösterilmeyecektir!</span>
                  )}
                </div>
                {resetError && <div className="text-red-500 mb-2">{resetError}</div>}
                <div className="flex gap-2 w-full">
                  <button
                    className="btn-primary w-full"
                    disabled={resettingApi}
                    onClick={async () => {
                      if (!project) return;
                      setResettingApi(true);
                      setResetError("");
                      setApiKeyCreated(null);
                      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
                      try {
                        const res = await fetch(`/api/dev/projects/${project.id}/api-keys/reset`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                          body: JSON.stringify({ permissions }),
                        });
                        if (!res.ok) throw new Error("API error");
                        const d = await res.json();
                        setApiKeys([d.data.apiKey]);
                        setApiKeyCreated(d.data.apiKey);
                        setShowResetPopup(false);
                      } catch {
                        setResetError("API error");
                      } finally {
                        setResettingApi(false);
                      }
                    }}
                  >
                    Evet, Sıfırla
                  </button>
                  <button
                    className="btn-secondary w-full"
                    onClick={() => setShowResetPopup(false)}
                    disabled={resettingApi}
                  >
                    Vazgeç
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Delete API Key Popup */}
          {showDeletePopup && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-background p-6 rounded-lg max-w-sm w-full relative shadow-lg border flex flex-col items-center">
                <div className="text-lg font-semibold mb-2 text-center">API Key&apos;i silmek istediğinize emin misiniz?</div>
                <div className="text-muted-foreground text-sm mb-4 text-center">
                  Bu işlem geri alınamaz. API anahtarı silindikten sonra erişim tamamen kapanır.
                </div>
                {apiError && <div className="text-red-500 mb-2">{apiError}</div>}
                <div className="flex gap-2 w-full">
                  <button
                    className="btn-danger w-full"
                    disabled={apiLoading}
                    onClick={handleDeleteApiKey}
                  >
                    Evet, Sil
                  </button>
                  <button
                    className="btn-secondary w-full"
                    onClick={() => { setShowDeletePopup(false); setDeleteKeyId(null); }}
                    disabled={apiLoading}
                  >
                    Vazgeç
                  </button>
                </div>
              </div>
            </div>
          )}
          {apiKeyCreated && (
            <div className="mb-2 p-2 bg-green-100 rounded text-green-800 text-center">
              API Key oluşturuldu: <br />
              <span className="font-mono break-all text-base">{apiKeyCreated.api_key}</span>
            </div>
          )}
          <div className="max-h-60 overflow-y-auto mt-2">
            <ul className="space-y-2">
              {apiLoading ? (
                <li>Yükleniyor...</li>
              ) : apiKeys.length === 0 ? (
                <li className="text-center text-muted-foreground">Hiç API anahtarı yok.</li>
              ) : apiKeys.map((k) => (
                <li key={k.id} className="p-3 border rounded bg-accent/40 flex flex-col gap-1 hover:bg-accent/60 transition-colors">
                  <div className="font-mono break-all text-sm">{k.api_key}</div>
                  <div className="text-xs text-muted-foreground">{k.key_name}</div>
                </li>
              ))}
            </ul>
          </div>
          {/* API Key Permissions Section */}
          <div className="mb-4 p-4 bg-accent/20 rounded shadow flex flex-col gap-2">
            <div className="font-semibold mb-1">API Anahtarının Yetkileri</div>
            <div className="flex flex-col gap-3">
              {permissionList.map((perm) => (
                <label key={perm.key} className="flex items-center gap-3">
                  <span className="w-16">{perm.label}</span>
                  <span className="relative inline-flex items-center">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={permissions[perm.key as keyof typeof permissions]}
                      onChange={() => handlePermissionChange(perm.key)}
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-red-600 transition-colors"></div>
                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"></div>
                  </span>
                  <span className="text-xs text-muted-foreground">{perm.desc}</span>
                </label>
              ))}
            </div>
            {permissionsChanged && (
              <button
                className="btn-primary mt-4 self-end"
                onClick={async () => {
                  if (!project || !apiKeys[0]) return;
                  setApiLoading(true);
                  setApiError("");
                  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
                  try {
                    const res = await fetch(`/api/dev/projects/${project.id}/api-keys/${apiKeys[0].id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                      body: JSON.stringify({ permissions }),
                    });
                    if (!res.ok) throw new Error("API error");
                    setPermissionsChanged(false);
                  } catch {
                    setApiError("API error");
                  } finally {
                    setApiLoading(false);
                  }
                }}
                disabled={apiLoading}
              >
                Kaydet
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
