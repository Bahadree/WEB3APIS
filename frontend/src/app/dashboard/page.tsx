"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import Link from "next/link";
import { motion } from "framer-motion";
import { Gamepad2, Zap } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Image from "next/image";
import { getApiUrl } from '@/utils/getApiUrl';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const { lang } = useLanguage();
  const [games, setGames] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // i18n
  const t: Record<
    "en" | "tr" | "de" | "fr" | "es" | "ru" | "zh",
    {
      badge: string;
      title: string;
      subtitle: string;
      select: string;
      noGames: string;
      loading: string;
      error: string;
    }
  > = {
    en: {
      badge: "Your Web3 Games",
      title: "Welcome to your Dashboard",
      subtitle:
        "Select a game to continue. Manage your Web3 gaming experience, NFTs, and more.",
      select: "Select a game to continue",
      noGames: "You are not registered in any games.",
      loading: "Loading games...",
      error: "Failed to load games.",
    },
    tr: {
      badge: "Web3 Oyunların",
      title: "Paneline Hoş Geldin",
      subtitle:
        "Devam etmek için bir oyun seç. Web3 oyun deneyimini, NFT'lerini ve daha fazlasını yönet.",
      select: "Devam etmek için bir oyun seç",
      noGames: "Hiçbir oyuna kayıtlı değilsin.",
      loading: "Oyunlar yükleniyor...",
      error: "Oyunlar yüklenemedi.",
    },
    de: {
      badge: "Deine Web3-Spiele",
      title: "Willkommen im Dashboard",
      subtitle:
        "Wähle ein Spiel aus, um fortzufahren. Verwalte dein Web3-Gaming, NFTs und mehr.",
      select: "Wähle ein Spiel aus",
      noGames: "Du bist in keinem Spiel registriert.",
      loading: "Spiele werden geladen...",
      error: "Spiele konnten nicht geladen werden.",
    },
    fr: {
      badge: "Vos jeux Web3",
      title: "Bienvenue sur votre tableau de bord",
      subtitle:
        "Sélectionnez un jeu pour continuer. Gérez votre expérience de jeu Web3, vos NFTs et plus encore.",
      select: "Sélectionnez un jeu pour continuer",
      noGames: "Vous n'êtes inscrit à aucun jeu.",
      loading: "Chargement des jeux...",
      error: "Échec du chargement des jeux.",
    },
    es: {
      badge: "Tus juegos Web3",
      title: "Bienvenido a tu panel",
      subtitle:
        "Selecciona un juego para continuar. Administra tu experiencia de juego Web3, NFTs y más.",
      select: "Selecciona un juego para continuar",
      noGames: "No estás registrado en ningún juego.",
      loading: "Cargando juegos...",
      error: "No se pudieron cargar los juegos.",
    },
    ru: {
      badge: "Ваши Web3-игры",
      title: "Добро пожаловать в панель управления",
      subtitle:
        "Выберите игру для продолжения. Управляйте своим Web3-геймингом, NFT и многим другим.",
      select: "Выберите игру для продолжения",
      noGames: "Вы не зарегистрированы ни в одной игре.",
      loading: "Загрузка игр...",
      error: "Не удалось загрузить игры.",
    },
    zh: {
      badge: "你的 Web3 游戏",
      title: "欢迎来到仪表盘",
      subtitle:
        "请选择一个游戏继续。管理你的 Web3 游戏体验、NFT 等。",
      select: "请选择一个游戏继续",
      noGames: "你没有注册任何游戏。",
      loading: "正在加载游戏...",
      error: "无法加载游戏。",
    },
  };
  const currentT = t[lang as keyof typeof t] || t["en"];

  useEffect(() => {
    async function fetchGames() {
      setLoading(true);
      setError("");
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
        const res = await fetch(getApiUrl('/games/my'), {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        setGames(data.games || []);
      } catch (e) {
        setError(currentT.error);
      } finally {
        setLoading(false);
      }
    }
    async function fetchAllGames() {
      try {
        const res = await fetch(getApiUrl('/games/all'));
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        setAllGames(data.games || []);
      } catch {}
    }
    if (isAuthenticated) fetchGames();
    fetchAllGames();
  }, [isAuthenticated, user, lang, currentT.error]);

  // Yardımcı: Resim URL'sini tam URL'ye çevir
  function getFullImageUrl(url?: string | null) {
    if (!url || typeof url !== "string" || url === "null" || url === "undefined") {
      return "/placeholder.png";
    }
    if (url.startsWith("http://backend:5000/uploads/")) {
      return url.replace("http://backend:5000", "");
    }
    if (url.startsWith("/uploads/")) {
      return url;
    }
    // Eğer url mutlak bir URL ise (http/https ile başlıyorsa) onu döndür, aksi halde placeholder
    if (/^https?:\/\//.test(url)) {
      return url;
    }
    return "/placeholder.png";
  }

  // Yardımcı: Açıklama kısaltıcı
  function getShortDescription(desc: string, limit = 80) {
    if (!desc) return '';
    if (desc.length <= limit) return desc;
    return desc.slice(0, limit) + '...';
  }

  const [showFullGames, setShowFullGames] = useState<boolean[]>([]);
  const [showFullAllGames, setShowFullAllGames] = useState<boolean[]>([]);
  // Modal için state
  const [selectedGame, setSelectedGame] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Modal bileşeni (dışarı taşıdık, fonksiyonun içinde tanımlı kalacak)
  function GameDetailModal({ game, onClose }: { game: any, onClose: () => void }) {
    if (!game || !mounted) return null;
    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="relative bg-background rounded-2xl shadow-xl max-w-lg w-full p-6 animate-fadeIn">
          <button
            className="absolute top-3 right-3 text-xl text-muted-foreground hover:text-primary"
            onClick={onClose}
            aria-label="Kapat"
          >
            ×
          </button>
          <div className="w-full aspect-video rounded-xl overflow-hidden mb-4">
            <Image
              src={getFullImageUrl(game.image_url) ? getFullImageUrl(game.image_url) : "/placeholder.png"}
              alt={game.name || "Game image"}
              fill
              className="object-cover w-full h-full"
              sizes="(max-width: 768px) 100vw, 400px"
              priority
            />
          </div>
          <h3 className="text-2xl font-bold mb-2">{game.name}</h3>
          <p className="text-base text-muted-foreground mb-2">{game.description}</p>
          {game.developer && (
            <div className="text-sm text-muted-foreground mb-1">Geliştirici: {game.developer}</div>
          )}
          <button
            className="mt-4 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/80 font-semibold"
            onClick={onClose}
          >
            Kapat
          </button>
        </div>
      </div>,
      typeof window !== "undefined" ? document.body : (null as any)
    );
  }

  return (
    <>
      <Navbar />
      <section className="relative min-h-screen flex flex-col items-start justify-start overflow-hidden bg-gradient-to-br from-background via-background to-background/50 pt-0">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <Zap className="w-4 h-4 mr-2" />
                {currentT.badge}
              </div>
            </div>
            {/* Main Heading */}
            <h1
              className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight min-h-[3.5rem] max-w-3xl mx-auto text-center drop-shadow-lg"
              style={{ letterSpacing: "-0.03em" }}
            >
              {currentT.title}
            </h1>
            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              {currentT.subtitle}
            </p>
          </motion.div>
          {/* Games List */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8"
          >
            {/* My Games */}
            <h2 className="text-2xl font-bold mb-4 text-left">{currentT.badge}</h2>
            {loading ? (
              <p className="text-lg text-muted-foreground text-center">{currentT.loading}</p>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : games.length === 0 ? (
              <p className="text-muted-foreground text-center">{currentT.noGames}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                {games.map((game: any, idx: number) => {
                  const desc = game.description || '';
                  const isLong = desc.length > 80;
                  const showFull = showFullGames[idx] || false;
                  return (
                    <button
                      key={game.id}
                      type="button"
                      className="block aspect-square rounded-2xl border border-border bg-black overflow-hidden shadow-lg group relative cursor-pointer p-0 text-left focus:outline-none"
                      onClick={() => {
                        setSelectedGame(game);
                        setShowModal(true);
                      }}
                    >
                      {/* Background image as absolute fill */}
                      <div className="absolute inset-0 z-0">
                        <Image
                          src={getFullImageUrl(game.image_url) ? getFullImageUrl(game.image_url) : "/placeholder.png"}
                          alt={game.name || "Game image"}
                          fill
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 400px"
                          priority
                        />
                      </div>
                      {/* Top left: Game name with blur and semi-transparent bg */}
                      <div
                        className="absolute top-4 left-4 px-4 py-2 rounded-lg backdrop-blur-md bg-black/60 text-white text-lg font-semibold shadow-lg z-10"
                        style={{ maxWidth: '80%', backdropFilter: 'blur(8px)' }}
                      >
                        {game.name}
                      </div>
                      {/* Bottom: Description with blur ve daha fazla oku */}
                      <div
                        className="absolute bottom-0 left-0 w-full px-4 py-3 rounded-b-xl backdrop-blur-md bg-black/50 text-white text-base shadow-lg z-10 flex flex-col gap-1"
                        style={{ backdropFilter: 'blur(8px)' }}
                      >
                        <span className="block">
                          {showFull ? desc : getShortDescription(desc)}
                        </span>
                        {isLong && (
                          <button
                            type="button"
                            className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full transition-colors mt-1 self-end
                              ${showFull ? 'bg-primary text-primary-foreground hover:bg-primary/80' : 'bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground'}
                              shadow border border-primary/30`}
                            style={{ backdropFilter: 'blur(4px)' }}
                            tabIndex={-1}
                            onClick={e => {
                              e.stopPropagation();
                              setShowFullGames(arr => {
                                const copy = [...arr];
                                copy[idx] = !copy[idx];
                                return copy;
                              });
                            }}
                          >
                            {showFull ? (
                              <>
                                <span>Daha az göster</span>
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="inline ml-1"><path d="M19 15l-7-7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              </>
                            ) : (
                              <>
                                <span>Daha fazla oku</span>
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="inline ml-1"><path d="M5 9l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* All Games Section */}
            <h2 className="text-2xl font-bold mb-4 text-left mt-12">Sistemdeki Tüm Oyunlar</h2>
            {allGames.length === 0 ? (
              <p className="text-muted-foreground text-center">Hiç oyun bulunamadı.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {allGames.map((game: any, idx: number) => {
                  const desc = game.description || '';
                  const isLong = desc.length > 80;
                  const showFull = showFullAllGames[idx] || false;
                  return (
                    <div
                      key={game.id}
                      className="block aspect-square rounded-2xl border border-border bg-black overflow-hidden shadow group relative cursor-default p-0"
                    >
                      {/* Background image as absolute fill */}
                      <div className="absolute inset-0 z-0">
                        <Image
                          src={getFullImageUrl(game.image_url) ? getFullImageUrl(game.image_url) : "/placeholder.png"}
                          alt={game.name || "Game image"}
                          fill
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 400px"
                          priority
                        />
                      </div>
                      {/* Top left: Game name with blur and semi-transparent bg */}
                      <div
                        className="absolute top-4 left-4 px-4 py-2 rounded-lg backdrop-blur-md bg-black/60 text-white text-lg font-semibold shadow-lg z-10"
                        style={{ maxWidth: '80%', backdropFilter: 'blur(8px)' }}
                      >
                        {game.name}
                      </div>
                      {/* Bottom: Description with blur ve daha fazla oku */}
                      <div
                        className="absolute bottom-0 left-0 w-full px-4 py-3 rounded-b-xl backdrop-blur-md bg-black/50 text-white text-base shadow-lg z-10 flex flex-col gap-1"
                        style={{ backdropFilter: 'blur(8px)' }}
                      >
                        <span className="block">
                          {showFull ? desc : getShortDescription(desc)}
                        </span>
                        {isLong && (
                          <button
                            type="button"
                            className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full transition-colors mt-1 self-end
                              ${showFull ? 'bg-primary text-primary-foreground hover:bg-primary/80' : 'bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground'}
                              shadow border border-primary/30`}
                            style={{ backdropFilter: 'blur(4px)' }}
                            tabIndex={-1}
                            onClick={e => {
                              e.preventDefault();
                              setShowFullAllGames(arr => {
                                const copy = [...arr];
                                copy[idx] = !copy[idx];
                                return copy;
                              });
                            }}
                          >
                            {showFull ? (
                              <>
                                <span>Daha az göster</span>
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="inline ml-1"><path d="M19 15l-7-7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              </>
                            ) : (
                              <>
                                <span>Daha fazla oku</span>
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="inline ml-1"><path d="M5 9l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </section>
      {/* Modal gösterimi */}
      {mounted && showModal && selectedGame && (
        <GameDetailModal game={selectedGame} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
