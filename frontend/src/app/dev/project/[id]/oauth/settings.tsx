"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const DEFAULT_SCOPES = [
	{ key: "email", label: "E-posta adresi" },
	{ key: "username", label: "Kullanıcı adı" },
	{ key: "avatar", label: "Profil fotoğrafı" },
];

export default function OAuthSettings() {
	const params = useParams();
	const projectId = params?.id as string;
	const [scopes, setScopes] = useState<string[]>([]);
	const [appName, setAppName] = useState<string>("");
	const [redirectUris, setRedirectUris] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// LocalStorage anahtarı
	const LS_KEY = `oauth_scopes_${projectId}`;

	// fetchScopesAndApp fonksiyonunu dışarı al
	const fetchScopesAndApp = async () => {
		setLoading(true);
		setError(null);
		try {
			const jwt =
				typeof window !== "undefined"
					? localStorage.getItem("accessToken")
					: null;
			// Önce localStorage'dan scope verisini dene
			let loadedScopes: string[] = [];
			let localScopesRaw =
				typeof window !== "undefined"
					? localStorage.getItem(LS_KEY)
					: null;
			if (localScopesRaw) {
				try {
					loadedScopes = JSON.parse(localScopesRaw);
				} catch {
					loadedScopes = [];
				}
			}
			// Proje detaylarından appName, redirectUris ve scopes çek
			const projectRes = await fetch(
				`/api/dev/projects/${projectId}`,
				{
					headers: { Authorization: `Bearer ${jwt}` },
				}
			);
			const projectData = await projectRes.json();
			const oauthApp = projectData?.data?.project?.oauthApplications?.[0];
			if (oauthApp) {
				setAppName(oauthApp.app_name || "");
				setRedirectUris(
					Array.isArray(oauthApp.redirect_uris)
						? oauthApp.redirect_uris
						: oauthApp.redirect_uris
						? JSON.parse(oauthApp.redirect_uris)
						: []
				);
				// Eğer localStorage'da scope yoksa, app'ten oku
				if (!loadedScopes.length && oauthApp.scopes) {
					if (Array.isArray(oauthApp.scopes)) {
						loadedScopes = oauthApp.scopes;
					} else {
						try {
							loadedScopes = JSON.parse(oauthApp.scopes);
						} catch {
							loadedScopes = [];
						}
					}
				}
			} else {
				setAppName("Default App");
				setRedirectUris(["http://localhost:3000"]);
			}
			// Eğer localStorage'da scope yoksa backend'den çek
			if (!loadedScopes.length) {
				const scopesRes = await fetch(
					`/api/dev/projects/${projectId}/oauth-scopes`,
					{
						headers: { Authorization: `Bearer ${jwt}` },
					}
				);
				const scopesData = await scopesRes.json();
				if (
					scopesData &&
					Array.isArray(scopesData.scopes) &&
					scopesData.scopes.length > 0
				) {
					loadedScopes = scopesData.scopes;
				}
			}
			setScopes(loadedScopes || []);
			// Son durumda localStorage'a yaz veya sil
			if (typeof window !== "undefined") {
				if (loadedScopes && loadedScopes.length > 0) {
					localStorage.setItem(LS_KEY, JSON.stringify(loadedScopes));
				} else {
					localStorage.removeItem(LS_KEY);
				}
			}
		} catch (e) {
			setError("Scope veya uygulama bilgisi alınamadı.");
		}
		setLoading(false);
	};

	useEffect(() => {
		if (projectId) fetchScopesAndApp();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [projectId]);

	const handleToggleScope = (scope: string) => {
		setScopes((prev) =>
			prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
		);
	};

	const handleSave = async () => {
		setLoading(true);
		setError(null);
		setSuccess(false);
		try {
			const jwt =
				typeof window !== "undefined"
					? localStorage.getItem("accessToken")
					: null;
			// Önce scope'ları kaydet
			const scopesRes = await fetch(
				`/api/dev/projects/${projectId}/oauth-scopes`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${jwt}`,
					},
					body: JSON.stringify({ scopes }),
				}
			);
			const scopesData = await scopesRes.json();
			if (!scopesRes.ok) {
				setError(scopesData.error || "Scope kaydedilemedi.");
				setLoading(false);
				return;
			}
			// Sonra uygulama oluştur (gerekirse)
			const res = await fetch(
				`/api/dev/projects/${projectId}/oauth-apps`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${jwt}`,
					},
					body: JSON.stringify({
						appName: appName || "Default App",
						redirectUris:
							redirectUris.length > 0
								? redirectUris
								: ["http://localhost:3000"],
						scopes,
					}),
				}
			);
			const data = await res.json();
			if (res.ok) {
				setSuccess(true);
				// localStorage'ı güncelle veya sil
				if (typeof window !== "undefined") {
					if (scopes && scopes.length > 0) {
						localStorage.setItem(LS_KEY, JSON.stringify(scopes));
					} else {
						localStorage.removeItem(LS_KEY);
					}
				}
				if (projectId) await fetchScopesAndApp();
			} else setError(data.error || "Kaydedilemedi.");
		} catch (e) {
			setError("Sunucu hatası.");
		}
		setLoading(false);
	};

	return (
		<>
			<div className="max-w-xl mx-auto my-12 bg-card border border-border rounded-2xl p-8 shadow">
				<h2 className="text-2xl font-bold mb-6 text-primary text-center">
					OAuth Ayarları
				</h2>
				<div className="flex flex-col items-center justify-center min-h-[300px]">
					<div className="mb-6 w-full max-w-md">
						<div className="mb-2 font-semibold">
							İzin Verilecek Bilgiler (Scopes):
						</div>
						<div className="space-y-3">
							{DEFAULT_SCOPES.map((scope) => (
								<label
									key={scope.key}
									className={`flex items-center gap-3 cursor-pointer select-none p-3 rounded-xl border transition-all duration-200 ${
										scopes.includes(scope.key)
											? "border-primary bg-primary/10"
											: "border-border bg-muted hover:bg-accent/30"
									}`}
								>
									<span className="relative flex items-center justify-center">
										<input
											type="checkbox"
											checked={scopes.includes(scope.key)}
											onChange={() => handleToggleScope(scope.key)}
											className="peer appearance-none w-6 h-6 border-2 border-primary rounded-md bg-white checked:bg-primary checked:border-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
										/>
										<svg
											className="absolute w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
											viewBox="0 0 20 20"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M5 10.5L9 14L15 7.5"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</span>
									<span className="text-base font-medium text-foreground">
										{scope.label}
									</span>
								</label>
							))}
						</div>
					</div>
					<button
						className="px-4 py-2 w-full max-w-md bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/80 transition"
						onClick={handleSave}
						disabled={loading}
					>
						Kaydet
					</button>
					{success && (
						<div className="mt-4 text-green-600 text-center">
							Başarıyla kaydedildi.
						</div>
					)}
					{error && (
						<div className="mt-4 text-red-600 text-center">{error}</div>
					)}
				</div>
			</div>
			{/* OAuth demo akışı burada üstte olacak şekilde başka bir bileşen veya içerik eklenebilir */}
		</>
	);
}
