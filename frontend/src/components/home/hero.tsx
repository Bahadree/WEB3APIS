'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Zap, Shield, Gamepad2 } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'
import { useEffect, useState } from 'react'

export default function Hero() {
  const { lang } = useLanguage();
  const [hydratedLang, setHydratedLang] = useState<'en' | 'tr' | 'de' | 'fr' | 'es' | 'ru' | 'zh'>('en');
  useEffect(() => { setHydratedLang(lang as any); }, [lang]);
  type LangKey = 'en' | 'tr' | 'de' | 'fr' | 'es' | 'ru' | 'zh';
  const t: Record<LangKey, {
    badge: string;
    heading1: string;
    heading2: string;
    subtitle: string;
    start: string;
    docs: string;
    feature1: string;
    feature1desc: string;
    feature2: string;
    feature2desc: string;
    feature3: string;
    feature3desc: string;
  }> = {
    en: {
      badge: 'Next-Gen Web3 Gaming Platform',
      heading1: 'Connect Your',
      heading2: 'Games to Web3',
      subtitle: 'Empower your games with blockchain technology. Manage player authentication, NFT marketplaces, and in-game economies with our comprehensive Web3 APIs.',
      start: 'Start Building',
      docs: 'View Documentation',
      feature1: 'Secure Authentication',
      feature1desc: 'OAuth 2.0, Web3 wallets, and traditional login methods',
      feature2: 'Game Integration',
      feature2desc: 'Easy APIs for Unity, Unreal Engine, and custom games',
      feature3: 'NFT Marketplace',
      feature3desc: 'Built-in marketplace for in-game assets and collectibles',
    },
    tr: {
      badge: 'Yeni Nesil Web3 Oyun Platformu',
      heading1: 'Oyunlarını',
      heading2: 'Web3 ile Bağla',
      subtitle: 'Oyunlarınıza blokzincir gücü katın. Oyuncu kimlik doğrulama, NFT pazar yeri ve oyun içi ekonomi yönetimini kapsamlı Web3 APIlerimizle kolayca yönetin.',
      start: 'Hemen Başla',
      docs: 'Dokümantasyonu Görüntüle',
      feature1: 'Güvenli Kimlik Doğrulama',
      feature1desc: 'OAuth 2.0, Web3 cüzdanlar ve klasik giriş yöntemleri',
      feature2: 'Oyun Entegrasyonu',
      feature2desc: 'Unity, Unreal Engine ve özel oyunlar için kolay APIler',
      feature3: 'NFT Pazaryeri',
      feature3desc: 'Oyun içi varlıklar ve koleksiyonlar için entegre pazar yeri',
    },
    de: {
      badge: 'Next-Gen Web3 Gaming Plattform',
      heading1: 'Verbinde deine',
      heading2: 'Spiele mit Web3',
      subtitle: 'Bringe Blockchain-Technologie in deine Spiele. Verwalte Authentifizierung, NFT-Marktplätze und In-Game-Ökonomien mit unseren umfassenden Web3-APIs.',
      start: 'Jetzt starten',
      docs: 'Dokumentation ansehen',
      feature1: 'Sichere Authentifizierung',
      feature1desc: 'OAuth 2.0, Web3-Wallets und klassische Login-Methoden',
      feature2: 'Spielintegration',
      feature2desc: 'Einfache APIs für Unity, Unreal Engine und eigene Spiele',
      feature3: 'NFT-Marktplatz',
      feature3desc: 'Integrierter Marktplatz für In-Game-Assets und Sammlerstücke',
    },
    fr: {
      badge: 'Plateforme de jeu Web3 nouvelle génération',
      heading1: 'Connectez vos',
      heading2: 'Jeux au Web3',
      subtitle: 'Donnez du pouvoir à vos jeux avec la blockchain. Gérez l\'authentification, les places de marché NFT et les économies en jeu avec nos API Web3 complètes.',
      start: 'Commencer',
      docs: 'Voir la documentation',
      feature1: 'Authentification sécurisée',
      feature1desc: 'OAuth 2.0, portefeuilles Web3 et méthodes classiques',
      feature2: 'Intégration de jeu',
      feature2desc: 'APIs faciles pour Unity, Unreal Engine et jeux personnalisés',
      feature3: 'Marché NFT',
      feature3desc: 'Marché intégré pour les actifs et objets de collection en jeu',
    },
    es: {
      badge: 'Plataforma de juegos Web3 de próxima generación',
      heading1: 'Conecta tus',
      heading2: 'Juegos a Web3',
      subtitle: 'Potencia tus juegos con blockchain. Gestiona autenticación, mercados NFT y economías en el juego con nuestras completas APIs Web3.',
      start: 'Comenzar',
      docs: 'Ver documentación',
      feature1: 'Autenticación segura',
      feature1desc: 'OAuth 2.0, monederos Web3 y métodos tradicionales',
      feature2: 'Integración de juegos',
      feature2desc: 'APIs fáciles para Unity, Unreal Engine y juegos personalizados',
      feature3: 'Mercado NFT',
      feature3desc: 'Mercado integrado para activos y coleccionables en el juego',
    },
    ru: {
      badge: 'Платформа Web3 нового поколения',
      heading1: 'Подключите свои',
      heading2: 'Игры к Web3',
      subtitle: 'Дайте своим играм возможности блокчейна. Управляйте аутентификацией, NFT-маркетплейсами и внутриигровой экономикой с помощью наших комплексных Web3 API.',
      start: 'Начать',
      docs: 'Посмотреть документацию',
      feature1: 'Безопасная аутентификация',
      feature1desc: 'OAuth 2.0, Web3-кошельки и классические методы входа',
      feature2: 'Интеграция игр',
      feature2desc: 'Простые API для Unity, Unreal Engine и кастомных игр',
      feature3: 'NFT-маркетплейс',
      feature3desc: 'Встроенный маркетплейс для внутриигровых активов и коллекционных предметов',
    },
    zh: {
      badge: '新一代 Web3 游戏平台',
      heading1: '连接你的',
      heading2: '游戏到 Web3',
      subtitle: '为你的游戏赋能区块链技术。通过我们全面的 Web3 API 管理玩家认证、NFT 市场和游戏内经济。',
      start: '立即开始',
      docs: '查看文档',
      feature1: '安全认证',
      feature1desc: 'OAuth 2.0、Web3 钱包和传统登录方式',
      feature2: '游戏集成',
      feature2desc: '适用于 Unity、Unreal Engine 和自定义游戏的易用 API',
      feature3: 'NFT 市场',
      feature3desc: '内置市场，支持游戏资产和藏品',
    },
  };
  const currentT = t[(hydratedLang as LangKey)] || t['en'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-background/50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Zap className="w-4 h-4 mr-2" />
              {currentT.badge}
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-10 lg:mb-16 leading-tight min-h-[5.5rem] max-w-4xl mx-auto text-center drop-shadow-lg"
            style={{ letterSpacing: '-0.03em' }}
          >
            <span className="block">{currentT.heading1}</span>
            <span className="block gradient-text">{currentT.heading2}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            {currentT.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link
              href="/auth/register"
              className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-105 transition-all duration-300"
            >
              {currentT.start}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/dev"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-foreground bg-background border-2 border-border rounded-xl hover:bg-accent transition-all duration-300"
            >
              <Gamepad2 className="mr-2 w-5 h-5" />
              {currentT.docs}
            </Link>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="glass rounded-2xl p-6 text-center hover:bg-primary/5 transition-colors duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{currentT.feature1}</h3>
              <p className="text-muted-foreground">
                {currentT.feature1desc}
              </p>
            </div>

            <div className="glass rounded-2xl p-6 text-center hover:bg-primary/5 transition-colors duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{currentT.feature2}</h3>
              <p className="text-muted-foreground">
                {currentT.feature2desc}
              </p>
            </div>

            <div className="glass rounded-2xl p-6 text-center hover:bg-primary/5 transition-colors duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{currentT.feature3}</h3>
              <p className="text-muted-foreground">
                {currentT.feature3desc}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground/60 rounded-full mt-2 animate-bounce" />
        </div>
      </motion.div>
    </section>
  )
}
