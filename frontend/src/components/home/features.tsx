'use client'

import { motion } from 'framer-motion'
import { 
  Code, 
  Wallet, 
  Users, 
  Shield, 
  Zap, 
  Globe,
  GamepadIcon,
  Coins
} from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'
import { useEffect, useState } from 'react'

export default function Features() {
  const { lang } = useLanguage();
  const [hydratedLang, setHydratedLang] = useState<'en' | 'tr' | 'de' | 'fr' | 'es' | 'ru' | 'zh'>('en');
  useEffect(() => { setHydratedLang(lang as any); }, [lang]);
  type LangKey = 'en' | 'tr' | 'de' | 'fr' | 'es' | 'ru' | 'zh';
  const t: Record<LangKey, {
    title: string;
    subtitle: string;
    features: { icon: any; title: string; description: string; gradient: string }[];
    ctaTitle: string;
    ctaDesc: string;
    ctaStart: string;
    ctaDemo: string;
  }> = {
    en: {
      title: 'Powerful Features for',
      subtitle: `Everything you need to build, deploy, and scale Web3 gaming experiences. From authentication to NFT marketplaces, we've got you covered.`,
      features: [
        { icon: Code, title: 'Developer APIs', description: 'RESTful APIs and SDKs for easy integration with your games and applications.', gradient: 'from-purple-500 to-pink-500' },
        { icon: Wallet, title: 'Multi-Wallet Support', description: 'Connect MetaMask, TrustWallet, WalletConnect and more with seamless authentication.', gradient: 'from-blue-500 to-cyan-500' },
        { icon: Users, title: 'Player Management', description: 'Comprehensive user profiles, game sessions, and player progression tracking.', gradient: 'from-green-500 to-emerald-500' },
        { icon: Shield, title: 'OAuth 2.0 Security', description: 'Enterprise-grade security with OAuth 2.0, GDPR compliance, and data protection.', gradient: 'from-orange-500 to-red-500' },
        { icon: Coins, title: 'NFT Marketplace', description: 'Built-in marketplace for trading in-game assets and NFTs across multiple games.', gradient: 'from-indigo-500 to-purple-500' },
        { icon: GamepadIcon, title: 'P2P Gaming', description: 'Support for peer-to-peer gaming, tournaments, and competitive play with rewards.', gradient: 'from-pink-500 to-rose-500' },
        { icon: Zap, title: 'Real-time Analytics', description: 'Monitor player engagement, earnings, and game performance in real-time.', gradient: 'from-yellow-500 to-orange-500' },
        { icon: Globe, title: 'Cross-Chain Support', description: 'Support for Ethereum, Polygon, and other popular blockchain networks.', gradient: 'from-teal-500 to-blue-500' },
      ],
      ctaTitle: 'Ready to revolutionize your game?',
      ctaDesc: 'Join thousands of developers who are already building the future of gaming with Web3APIs.',
      ctaStart: 'Start Free Trial',
      ctaDemo: 'Schedule Demo',
    },
    tr: {
      title: 'Web3 Oyunları için Güçlü Özellikler',
      subtitle: `Kimlik doğrulamadan NFT pazarına kadar, Web3 oyun deneyimini oluşturmak, dağıtmak ve ölçeklemek için ihtiyacınız olan her şey.`,
      features: [
        { icon: Code, title: 'Geliştirici API’leri', description: 'Oyunlarınız ve uygulamalarınız için kolay entegrasyon sağlayan RESTful API ve SDK’lar.', gradient: 'from-purple-500 to-pink-500' },
        { icon: Wallet, title: 'Çoklu Cüzdan Desteği', description: 'MetaMask, TrustWallet, WalletConnect ve daha fazlası ile sorunsuz kimlik doğrulama.', gradient: 'from-blue-500 to-cyan-500' },
        { icon: Users, title: 'Oyuncu Yönetimi', description: 'Kapsamlı kullanıcı profilleri, oyun oturumları ve oyuncu ilerleme takibi.', gradient: 'from-green-500 to-emerald-500' },
        { icon: Shield, title: 'OAuth 2.0 Güvenliği', description: 'OAuth 2.0, KVKK uyumluluğu ve veri koruması ile kurumsal düzeyde güvenlik.', gradient: 'from-orange-500 to-red-500' },
        { icon: Coins, title: 'NFT Pazaryeri', description: 'Birden fazla oyunda oyun içi varlık ve NFT ticareti için entegre pazar.', gradient: 'from-indigo-500 to-purple-500' },
        { icon: GamepadIcon, title: 'P2P Oyun', description: 'Ödüllü eşler arası oyun, turnuva ve rekabet desteği.', gradient: 'from-pink-500 to-rose-500' },
        { icon: Zap, title: 'Gerçek Zamanlı Analitik', description: 'Oyuncu etkileşimi, kazanç ve oyun performansını anlık izleyin.', gradient: 'from-yellow-500 to-orange-500' },
        { icon: Globe, title: 'Çapraz Zincir Desteği', description: 'Ethereum, Polygon ve popüler blokzincir ağları desteği.', gradient: 'from-teal-500 to-blue-500' },
      ],
      ctaTitle: 'Oyununu devrimleştirmeye hazır mısın?',
      ctaDesc: 'Web3APIs ile oyun dünyasının geleceğini inşa eden binlerce geliştiriciye katıl.',
      ctaStart: 'Ücretsiz Denemeye Başla',
      ctaDemo: 'Demo Planla',
    },
    de: {
      title: 'Leistungsstarke Funktionen für',
      subtitle: 'Alles, was Sie brauchen, um Web3-Gaming-Erlebnisse zu erstellen, bereitzustellen und zu skalieren. Von Authentifizierung bis NFT-Marktplätzen – alles aus einer Hand.',
      features: [
        { icon: Code, title: 'Entwickler-APIs', description: 'RESTful APIs und SDKs für die einfache Integration in Ihre Spiele und Anwendungen.', gradient: 'from-purple-500 to-pink-500' },
        { icon: Wallet, title: 'Multi-Wallet-Unterstützung', description: 'Verbinden Sie MetaMask, TrustWallet, WalletConnect und mehr mit nahtloser Authentifizierung.', gradient: 'from-blue-500 to-cyan-500' },
        { icon: Users, title: 'Spielerverwaltung', description: 'Umfassende Benutzerprofile, Spielsitzungen und Fortschrittsverfolgung.', gradient: 'from-green-500 to-emerald-500' },
        { icon: Shield, title: 'OAuth 2.0 Sicherheit', description: 'Unternehmenssicherheit mit OAuth 2.0, DSGVO-Konformität und Datenschutz.', gradient: 'from-orange-500 to-red-500' },
        { icon: Coins, title: 'NFT-Marktplatz', description: 'Integrierter Marktplatz für den Handel mit Spiel-Assets und NFTs.', gradient: 'from-indigo-500 to-purple-500' },
        { icon: GamepadIcon, title: 'P2P-Gaming', description: 'Unterstützung für Peer-to-Peer-Gaming, Turniere und Wettbewerbe mit Belohnungen.', gradient: 'from-pink-500 to-rose-500' },
        { icon: Zap, title: 'Echtzeit-Analysen', description: 'Überwachen Sie Engagement, Einnahmen und Spielleistung in Echtzeit.', gradient: 'from-yellow-500 to-orange-500' },
        { icon: Globe, title: 'Cross-Chain-Unterstützung', description: 'Unterstützung für Ethereum, Polygon und andere Blockchains.', gradient: 'from-teal-500 to-blue-500' },
      ],
      ctaTitle: 'Bereit, Ihr Spiel zu revolutionieren?',
      ctaDesc: 'Schließen Sie sich Tausenden von Entwicklern an, die bereits die Zukunft des Gamings mit Web3APIs gestalten.',
      ctaStart: 'Kostenlos testen',
      ctaDemo: 'Demo vereinbaren',
    },
    fr: {
      title: 'Fonctionnalités puissantes pour',
      subtitle: `Tout ce dont vous avez besoin pour créer, déployer et faire évoluer des expériences de jeu Web3. De l'authentification aux places de marché NFT, tout est inclus.`,
      features: [
        { icon: Code, title: 'APIs Développeur', description: 'APIs RESTful et SDKs pour une intégration facile à vos jeux et applications.', gradient: 'from-purple-500 to-pink-500' },
        { icon: Wallet, title: 'Support Multi-Portefeuille', description: 'Connectez MetaMask, TrustWallet, WalletConnect et plus avec une authentification transparente.', gradient: 'from-blue-500 to-cyan-500' },
        { icon: Users, title: 'Gestion des joueurs', description: 'Profils utilisateurs complets, sessions de jeu et suivi de progression.', gradient: 'from-green-500 to-emerald-500' },
        { icon: Shield, title: 'Sécurité OAuth 2.0', description: 'Sécurité de niveau entreprise avec OAuth 2.0, conformité RGPD et protection des données.', gradient: 'from-orange-500 to-red-500' },
        { icon: Coins, title: 'Marché NFT', description: 'Marché intégré pour échanger des actifs et NFTs entre plusieurs jeux.', gradient: 'from-indigo-500 to-purple-500' },
        { icon: GamepadIcon, title: 'Jeu P2P', description: 'Support du jeu peer-to-peer, tournois et compétitions avec récompenses.', gradient: 'from-pink-500 to-rose-500' },
        { icon: Zap, title: 'Analytique en temps réel', description: 'Surveillez l’engagement, les gains et la performance de vos jeux en temps réel.', gradient: 'from-yellow-500 to-orange-500' },
        { icon: Globe, title: 'Support Multi-Blockchain', description: 'Support d’Ethereum, Polygon et autres blockchains populaires.', gradient: 'from-teal-500 to-blue-500' },
      ],
      ctaTitle: 'Prêt à révolutionner votre jeu ?',
      ctaDesc: 'Rejoignez des milliers de développeurs qui construisent déjà le futur du jeu avec Web3APIs.',
      ctaStart: 'Commencer l’essai gratuit',
      ctaDemo: 'Planifier une démo',
    },
    es: {
      title: 'Potentes funciones para',
      subtitle: 'Todo lo que necesitas para crear, lanzar y escalar experiencias de juego Web3. Desde autenticación hasta mercados NFT, lo tenemos todo.',
      features: [
        { icon: Code, title: 'APIs para desarrolladores', description: 'APIs RESTful y SDKs para una integración sencilla con tus juegos y aplicaciones.', gradient: 'from-purple-500 to-pink-500' },
        { icon: Wallet, title: 'Soporte Multi-Wallet', description: 'Conecta MetaMask, TrustWallet, WalletConnect y más con autenticación sin fisuras.', gradient: 'from-blue-500 to-cyan-500' },
        { icon: Users, title: 'Gestión de jugadores', description: 'Perfiles de usuario completos, sesiones de juego y seguimiento de progresión.', gradient: 'from-green-500 to-emerald-500' },
        { icon: Shield, title: 'Seguridad OAuth 2.0', description: 'Seguridad de nivel empresarial con OAuth 2.0, cumplimiento RGPD y protección de datos.', gradient: 'from-orange-500 to-red-500' },
        { icon: Coins, title: 'Mercado NFT', description: 'Mercado integrado para comerciar activos y NFTs entre varios juegos.', gradient: 'from-indigo-500 to-purple-500' },
        { icon: GamepadIcon, title: 'Juego P2P', description: 'Soporte para juego peer-to-peer, torneos y juego competitivo con recompensas.', gradient: 'from-pink-500 to-rose-500' },
        { icon: Zap, title: 'Analítica en tiempo real', description: 'Monitorea la participación, ganancias y rendimiento del juego en tiempo real.', gradient: 'from-yellow-500 to-orange-500' },
        { icon: Globe, title: 'Soporte Cross-Chain', description: 'Soporte para Ethereum, Polygon y otras blockchains populares.', gradient: 'from-teal-500 to-blue-500' },
      ],
      ctaTitle: '¿Listo para revolucionar tu juego?',
      ctaDesc: 'Únete a miles de desarrolladores que ya están construyendo el futuro del gaming con Web3APIs.',
      ctaStart: 'Comenzar prueba gratis',
      ctaDemo: 'Agendar demo',
    },
    ru: {
      title: 'Мощные возможности для',
      subtitle: 'Всё, что нужно для создания, запуска и масштабирования Web3-игр. От аутентификации до NFT-маркетплейсов — всё включено.',
      features: [
        { icon: Code, title: 'API для разработчиков', description: 'RESTful API и SDK для легкой интеграции с вашими играми и приложениями.', gradient: 'from-purple-500 to-pink-500' },
        { icon: Wallet, title: 'Поддержка нескольких кошельков', description: 'Подключайте MetaMask, TrustWallet, WalletConnect и другие с бесшовной аутентификацией.', gradient: 'from-blue-500 to-cyan-500' },
        { icon: Users, title: 'Управление игроками', description: 'Полные профили пользователей, игровые сессии и отслеживание прогресса.', gradient: 'from-green-500 to-emerald-500' },
        { icon: Shield, title: 'Безопасность OAuth 2.0', description: 'Корпоративная безопасность с OAuth 2.0, соответствие GDPR и защита данных.', gradient: 'from-orange-500 to-red-500' },
        { icon: Coins, title: 'NFT-маркетплейс', description: 'Встроенный маркетплейс для торговли внутриигровыми активами и NFT.', gradient: 'from-indigo-500 to-purple-500' },
        { icon: GamepadIcon, title: 'P2P-игры', description: 'Поддержка P2P-игр, турниров и соревнований с наградами.', gradient: 'from-pink-500 to-rose-500' },
        { icon: Zap, title: 'Аналитика в реальном времени', description: 'Отслеживайте вовлеченность, доходы и производительность игр в реальном времени.', gradient: 'from-yellow-500 to-orange-500' },
        { icon: Globe, title: 'Кроссчейн поддержка', description: 'Поддержка Ethereum, Polygon и других популярных сетей.', gradient: 'from-teal-500 to-blue-500' },
      ],
      ctaTitle: 'Готовы изменить свою игру?',
      ctaDesc: 'Присоединяйтесь к тысячам разработчиков, которые уже строят будущее игр с Web3APIs.',
      ctaStart: 'Начать бесплатно',
      ctaDemo: 'Записаться на демо',
    },
    zh: {
      title: '强大的 Web3 游戏功能',
      subtitle: '构建、部署和扩展 Web3 游戏体验所需的一切。从认证到 NFT 市场，我们应有尽有。',
      features: [
        { icon: Code, title: '开发者 API', description: 'RESTful API 和 SDK，轻松集成到您的游戏和应用。', gradient: 'from-purple-500 to-pink-500' },
        { icon: Wallet, title: '多钱包支持', description: '无缝认证，支持 MetaMask、TrustWallet、WalletConnect 等。', gradient: 'from-blue-500 to-cyan-500' },
        { icon: Users, title: '玩家管理', description: '全面的用户资料、游戏会话和进度跟踪。', gradient: 'from-green-500 to-emerald-500' },
        { icon: Shield, title: 'OAuth 2.0 安全', description: '企业级安全，支持 OAuth 2.0、GDPR 合规和数据保护。', gradient: 'from-orange-500 to-red-500' },
        { icon: Coins, title: 'NFT 市场', description: '内置市场，支持多游戏的游戏资产和 NFT 交易。', gradient: 'from-indigo-500 to-purple-500' },
        { icon: GamepadIcon, title: 'P2P 游戏', description: '支持点对点游戏、锦标赛和奖励竞技。', gradient: 'from-pink-500 to-rose-500' },
        { icon: Zap, title: '实时分析', description: '实时监控玩家参与度、收益和游戏表现。', gradient: 'from-yellow-500 to-orange-500' },
        { icon: Globe, title: '跨链支持', description: '支持以太坊、Polygon 等主流区块链网络。', gradient: 'from-teal-500 to-blue-500' },
      ],
      ctaTitle: '准备好革新你的游戏了吗？',
      ctaDesc: '加入成千上万已经用 Web3APIs 构建游戏未来的开发者行列。',
      ctaStart: '免费试用',
      ctaDemo: '预约演示',
    },
  };
  const currentT = t[(hydratedLang as LangKey)] || t['en'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            {currentT.title}{' '}
            <span className="gradient-text">Web3 Gaming</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {currentT.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {currentT.features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
              >
                <div className="h-full bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Additional Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-3xl p-8 md:p-12 border border-purple-600/20">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              {currentT.ctaTitle}
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {currentT.ctaDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary px-8 py-3">
                {currentT.ctaStart}
              </button>
              <button className="btn-secondary px-8 py-3">
                {currentT.ctaDemo}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
