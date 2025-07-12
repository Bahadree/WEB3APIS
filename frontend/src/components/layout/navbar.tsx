'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { Moon, Sun, Menu, X, Gamepad2 } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/components/providers/language-provider'
import { useRouter, usePathname } from 'next/navigation'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { lang, setLang } = useLanguage();
  const [hydratedLang, setHydratedLang] = useState<'en' | 'tr' | 'de' | 'fr' | 'es' | 'ru' | 'zh'>();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    setMounted(true);
    setHydratedLang(lang as any);
  }, [lang]);
  useEffect(() => {
    if (mounted) setHydratedLang(lang as any);
  }, [lang, mounted]);
  type LangKey = 'en' | 'tr' | 'de' | 'fr' | 'es' | 'ru' | 'zh';
  const t: Record<LangKey, {
    home: string;
    features: string;
    about: string;
    dev: string;
    login: string;
    getStarted: string;
    dashboard: string;
    // ...other keys...
  }> = {
    en: { home: 'Home', features: 'Features', about: 'About', dev: 'Developers', login: 'Login', getStarted: 'Get Started', dashboard: 'Dashboard' },
    tr: { home: 'Anasayfa', features: 'Özellikler', about: 'Hakkında', dev: 'Geliştiriciler', login: 'Giriş', getStarted: 'Başla', dashboard: 'Panel' },
    de: { home: 'Startseite', features: 'Funktionen', about: 'Über', dev: 'Entwickler', login: 'Anmelden', getStarted: 'Loslegen', dashboard: 'Übersicht' },
    fr: { home: 'Accueil', features: 'Fonctionnalités', about: 'À propos', dev: 'Développeurs', login: 'Connexion', getStarted: 'Commencer', dashboard: 'Tableau de bord' },
    es: { home: 'Inicio', features: 'Características', about: 'Acerca de', dev: 'Desarrolladores', login: 'Iniciar sesión', getStarted: 'Comenzar', dashboard: 'Panel' },
    ru: { home: 'Главная', features: 'Возможности', about: 'О нас', dev: 'Разработчики', login: 'Войти', getStarted: 'Начать', dashboard: 'Панель' },
    zh: { home: '首页', features: '功能', about: '关于', dev: '开发者', login: '登录', getStarted: '开始使用', dashboard: '仪表盘' },
  };
  const currentT = t[hydratedLang || 'en'] || t['en'];

  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    if (langOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [langOpen])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [profileOpen])

  const handleNav = (hash: string) => {
    if (pathname !== '/') {
      router.push(`/${hash}`);
    } else {
      const el = document.getElementById(hash.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!mounted || !hydratedLang) {
    // Prevent rendering until after hydration to avoid mismatch
    return null;
  }

  const navigation = [
    { name: currentT.home, href: '/' },
    { name: currentT.features, href: '#features', isHash: true },
    { name: currentT.about, href: '#about', isHash: true },
    { name: currentT.dev, href: '/dev' },
  ]

  return (
    <nav className="fixed w-full z-50 top-0 left-0 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo */}
          <div className="flex-1 flex items-center min-w-0">
            <Link href="/" className="flex items-center space-x-2 min-w-0">
              <div className="relative">
                <Gamepad2 className="h-8 w-8 text-primary" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" />
              </div>
              <span className="text-xl font-bold gradient-text">Web3APIs</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 flex-1 justify-center min-w-0">
            {navigation.map((item) =>
              item.isHash ? (
                <button
                  key={item.name}
                  onClick={() => handleNav(item.href)}
                  className="text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none outline-none cursor-pointer px-0"
                  style={{ background: 'none' }}
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* Right side: Theme, Language, Login, Get Started, Profile */}
          <div className="flex-1 flex items-center justify-end space-x-4 min-w-0">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            {/* Custom Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background text-sm font-medium shadow-sm hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary min-w-[180px] w-[180px] justify-between"
                onClick={() => setLangOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                style={{ minWidth: 180, width: 180 }}
              >
                <span className="font-semibold">Language</span>
                <span className="truncate max-w-[90px]">
                  {lang === 'en' && 'English'}
                  {lang === 'tr' && 'Türkçe'}
                  {lang === 'de' && 'Deutsch'}
                  {lang === 'fr' && 'Français'}
                  {lang === 'es' && 'Español'}
                  {lang === 'ru' && 'Русский'}
                  {lang === 'zh' && '中文'}
                </span>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 rounded-lg shadow-lg bg-background border border-border z-50 animate-fade-in min-w-[180px] w-[180px]">
                  <button
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${lang === 'en' ? 'bg-accent font-semibold' : 'hover:bg-accent/60'}`}
                    onClick={() => { setLang('en'); setLangOpen(false); }}
                  >
                    English
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${lang === 'tr' ? 'bg-accent font-semibold' : 'hover:bg-accent/60'}`}
                    onClick={() => { setLang('tr'); setLangOpen(false); }}
                  >
                    Türkçe
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${lang === 'de' ? 'bg-accent font-semibold' : 'hover:bg-accent/60'}`}
                    onClick={() => { setLang('de'); setLangOpen(false); }}
                  >
                    Deutsch
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${lang === 'fr' ? 'bg-accent font-semibold' : 'hover:bg-accent/60'}`}
                    onClick={() => { setLang('fr'); setLangOpen(false); }}
                  >
                    Français
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${lang === 'es' ? 'bg-accent font-semibold' : 'hover:bg-accent/60'}`}
                    onClick={() => { setLang('es'); setLangOpen(false); }}
                  >
                    Español
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${lang === 'ru' ? 'bg-accent font-semibold' : 'hover:bg-accent/60'}`}
                    onClick={() => { setLang('ru'); setLangOpen(false); }}
                  >
                    Русский
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${lang === 'zh' ? 'bg-accent font-semibold' : 'hover:bg-accent/60'}`}
                    onClick={() => { setLang('zh'); setLangOpen(false); }}
                  >
                    中文
                  </button>
                </div>
              )}
            </div>
            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {currentT.dashboard}
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {currentT.login}
                </Link>
                <Link
                  href="/auth/register"
                  className="btn-primary text-sm px-4 py-2"
                >
                  {currentT.getStarted}
                </Link>
              </div>
            )}
            {/* Profile Icon Dropdown - always at far right */}
            {isAuthenticated && (
              <div className="relative" ref={profileRef}>
                <button
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={() => setProfileOpen((v) => !v)}
                  aria-haspopup="true"
                  aria-expanded={profileOpen}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg bg-background border border-border z-50 animate-fade-in">
                    <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-accent rounded-t-lg transition-colors">Profile</Link>
                    <Link href="/settings" className="block px-4 py-2 text-sm hover:bg-accent transition-colors">Settings</Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent rounded-b-lg transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-b border-border">
            {navigation.map((item) =>
              item.isHash ? (
                <button
                  key={item.name}
                  onClick={() => { handleNav(item.href); setMobileMenuOpen(false); }}
                  className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors bg-transparent border-none outline-none cursor-pointer w-full text-left"
                  style={{ background: 'none' }}
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            )}
            
            <div className="pt-4 border-t border-border mt-4">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block mx-3 my-2 px-4 py-2 text-center bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
