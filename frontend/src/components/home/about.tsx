'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/components/providers/language-provider';
import { useEffect, useState } from 'react';

export default function About() {
  const { lang } = useLanguage();
  const [hydratedLang, setHydratedLang] = useState<'en' | 'tr' | 'de' | 'fr' | 'es' | 'ru' | 'zh'>('en');
  useEffect(() => { setHydratedLang(lang as any); }, [lang]);
  type LangKey = 'en' | 'tr' | 'de' | 'fr' | 'es' | 'ru' | 'zh';
  const t: Record<LangKey, {
    title: string;
    about1: string;
    about2: string;
    about3: string;
    uptime: string;
    response: string;
    features: { title: string; desc: string }[];
    teamTitle: string;
    teamDesc: string;
  }> = {
    en: {
      title: 'About <span class="gradient-text">Web3APIs</span>',
      about1: 'Web3APIs is a comprehensive platform designed to bridge the gap between traditional gaming and Web3 technology. We provide developers with the tools they need to integrate blockchain features seamlessly into their games.',
      about2: 'Our mission is to democratize Web3 gaming by making blockchain integration as simple as calling a REST API. Whether you\'re building a small indie game or a massive multiplayer experience, our platform scales with your needs.',
      about3: 'From secure player authentication to NFT marketplaces, from in-game economies to P2P tournaments, we handle the complex blockchain infrastructure so you can focus on creating amazing gaming experiences.',
      uptime: 'Uptime SLA',
      response: 'API Response Time',
      features: [
        { title: '🔐 Enterprise Security', desc: 'Bank-level security with OAuth 2.0, multi-factor authentication, and comprehensive GDPR compliance for global operations.' },
        { title: '🎮 Game Engine Support', desc: 'Native SDKs for Unity, Unreal Engine, and web-based games. Simple integration with comprehensive documentation and examples.' },
        { title: '🌐 Multi-Chain Compatible', desc: 'Support for Ethereum, Polygon, BSC, and other popular networks. Easy switching between testnets and mainnets.' },
        { title: '📊 Real-time Analytics', desc: 'Comprehensive dashboard with player analytics, revenue tracking, and performance metrics to optimize your game\'s success.' },
      ],
      teamTitle: 'Built by Gaming & Blockchain Experts',
      teamDesc: 'Our team combines years of experience in game development, blockchain technology, and enterprise software to deliver a platform that truly understands the needs of modern game developers.',
    },
    tr: {
      title: '<span class="gradient-text">Web3APIs</span> Hakkında',
      about1: 'Web3APIs, geleneksel oyun ile Web3 teknolojisi arasındaki köprüyü kurmak için tasarlanmış kapsamlı bir platformdur. Geliştiricilere, oyunlarına blokzincir özelliklerini sorunsuzca entegre etmeleri için ihtiyaç duydukları araçları sunar.',
      about2: 'Misyonumuz, blokzincir entegrasyonunu bir REST API çağrısı kadar kolay hale getirerek Web3 oyununu demokratikleştirmektir. İster küçük bir indie oyun ister devasa bir çok oyunculu deneyim inşa edin, platformumuz ihtiyaçlarınıza göre ölçeklenir.',
      about3: 'Güvenli oyuncu kimlik doğrulamadan NFT pazarına, oyun içi ekonomilerden P2P turnuvalara kadar karmaşık blokzincir altyapısını biz yönetiyoruz, siz harika oyun deneyimleri yaratmaya odaklanın.',
      uptime: 'Çalışma Süresi SLA',
      response: 'API Yanıt Süresi',
      features: [
        { title: '🔐 Kurumsal Güvenlik', desc: 'OAuth 2.0, çok faktörlü kimlik doğrulama ve küresel operasyonlar için kapsamlı KVKK uyumluluğu ile banka düzeyinde güvenlik.' },
        { title: '🎮 Oyun Motoru Desteği', desc: 'Unity, Unreal Engine ve web tabanlı oyunlar için yerel SDK\'lar. Kapsamlı dokümantasyon ve örneklerle kolay entegrasyon.' },
        { title: '🌐 Çoklu Zincir Uyumluluğu', desc: 'Ethereum, Polygon, BSC ve diğer popüler ağlar için destek. Testnet ve mainnet arasında kolay geçiş.' },
        { title: '📊 Gerçek Zamanlı Analitik', desc: 'Oyuncu analitiği, gelir takibi ve performans metrikleriyle kapsamlı gösterge paneli.' },
      ],
      teamTitle: 'Oyun ve Blokzincir Uzmanları Tarafından Geliştirildi',
      teamDesc: 'Ekibimiz, oyun geliştirme, blokzincir teknolojisi ve kurumsal yazılımda yılların deneyimini birleştirerek modern oyun geliştiricilerinin ihtiyaçlarını gerçekten anlayan bir platform sunuyor.',
    },
    de: {
      title: 'Über <span class="gradient-text">Web3APIs</span>',
      about1: 'Web3APIs ist eine umfassende Plattform, die die Lücke zwischen traditionellem Gaming und Web3-Technologie schließt. Wir bieten Entwicklern die Tools, die sie benötigen, um Blockchain-Funktionen nahtlos in ihre Spiele zu integrieren.',
      about2: 'Unsere Mission ist es, Web3-Gaming zu demokratisieren, indem wir die Blockchain-Integration so einfach wie einen REST-API-Aufruf machen. Egal, ob Sie ein kleines Indie-Spiel oder ein großes Multiplayer-Erlebnis entwickeln, unsere Plattform skaliert mit Ihren Anforderungen.',
      about3: 'Von sicherer Spieler-Authentifizierung bis zu NFT-Marktplätzen, von In-Game-Ökonomien bis zu P2P-Turnieren – wir übernehmen die komplexe Blockchain-Infrastruktur, damit Sie sich auf großartige Spielerlebnisse konzentrieren können.',
      uptime: 'Betriebszeit SLA',
      response: 'API-Antwortzeit',
      features: [
        { title: '🔐 Unternehmenssicherheit', desc: 'Bankenähnliche Sicherheit mit OAuth 2.0, Multi-Faktor-Authentifizierung und umfassender DSGVO-Konformität.' },
        { title: '🎮 Game-Engine-Unterstützung', desc: 'Native SDKs für Unity, Unreal Engine und webbasierte Spiele. Einfache Integration mit umfassender Dokumentation und Beispielen.' },
        { title: '🌐 Multi-Chain-Kompatibilität', desc: 'Unterstützung für Ethereum, Polygon, BSC und andere beliebte Netzwerke. Einfaches Umschalten zwischen Testnetzen und Mainnets.' },
        { title: '📊 Echtzeit-Analytik', desc: 'Umfassendes Dashboard mit Spieleranalysen, Umsatzverfolgung und Leistungsmetriken.' },
      ],
      teamTitle: 'Von Gaming- & Blockchain-Experten entwickelt',
      teamDesc: 'Unser Team vereint jahrelange Erfahrung in der Spieleentwicklung, Blockchain-Technologie und Unternehmenssoftware, um eine Plattform zu bieten, die die Bedürfnisse moderner Spieleentwickler wirklich versteht.',
    },
    fr: {
      title: 'À propos de <span class="gradient-text">Web3APIs</span>',
      about1: 'Web3APIs est une plateforme complète conçue pour combler le fossé entre le jeu traditionnel et la technologie Web3. Nous fournissons aux développeurs les outils nécessaires pour intégrer facilement les fonctionnalités blockchain dans leurs jeux.',
      about2: 'Notre mission est de démocratiser le jeu Web3 en rendant l\'intégration blockchain aussi simple qu\'un appel d\'API REST. Que vous construisiez un petit jeu indépendant ou une expérience multijoueur massive, notre plateforme s\'adapte à vos besoins.',
      about3: 'De l\'authentification sécurisée des joueurs aux places de marché NFT, des économies en jeu aux tournois P2P, nous gérons l\'infrastructure blockchain complexe pour que vous puissiez vous concentrer sur la création d\'expériences de jeu exceptionnelles.',
      uptime: 'SLA de disponibilité',
      response: 'Temps de réponse API',
      features: [
        { title: '🔐 Sécurité d\'entreprise', desc: 'Sécurité de niveau bancaire avec OAuth 2.0, authentification multi-facteurs et conformité RGPD complète.' },
        { title: '🎮 Support moteur de jeu', desc: 'SDK natifs pour Unity, Unreal Engine et jeux web. Intégration simple avec documentation et exemples complets.' },
        { title: '🌐 Compatible multi-chaînes', desc: 'Prise en charge d\'Ethereum, Polygon, BSC et d\'autres réseaux populaires. Changement facile entre testnets et mainnets.' },
        { title: '📊 Analytique en temps réel', desc: 'Tableau de bord complet avec analyses des joueurs, suivi des revenus et métriques de performance.' },
      ],
      teamTitle: 'Créé par des experts du jeu & de la blockchain',
      teamDesc: 'Notre équipe combine des années d\'expérience en développement de jeux, technologie blockchain et logiciels d\'entreprise pour offrir une plateforme qui comprend vraiment les besoins des développeurs de jeux modernes.',
    },
    es: {
      title: 'Acerca de <span class="gradient-text">Web3APIs</span>',
      about1: 'Web3APIs es una plataforma integral diseñada para cerrar la brecha entre los juegos tradicionales y la tecnología Web3. Proporcionamos a los desarrolladores las herramientas que necesitan para integrar funciones blockchain en sus juegos.',
      about2: 'Nuestra misión es democratizar el juego Web3 haciendo que la integración blockchain sea tan simple como llamar a una API REST. Ya sea que estés creando un juego indie pequeño o una experiencia multijugador masiva, nuestra plataforma se adapta a tus necesidades.',
      about3: 'Desde la autenticación segura de jugadores hasta los mercados NFT, desde las economías en el juego hasta los torneos P2P, gestionamos la infraestructura blockchain compleja para que puedas centrarte en crear experiencias de juego increíbles.',
      uptime: 'SLA de tiempo de actividad',
      response: 'Tiempo de respuesta de la API',
      features: [
        { title: '🔐 Seguridad empresarial', desc: 'Seguridad a nivel bancario con OAuth 2.0, autenticación multifactor y cumplimiento integral de RGPD.' },
        { title: '🎮 Soporte para motores de juego', desc: 'SDKs nativos para Unity, Unreal Engine y juegos web. Integración sencilla con documentación y ejemplos completos.' },
        { title: '🌐 Compatible con múltiples cadenas', desc: 'Soporte para Ethereum, Polygon, BSC y otras redes populares. Cambio fácil entre testnets y mainnets.' },
        { title: '📊 Analítica en tiempo real', desc: 'Panel integral con análisis de jugadores, seguimiento de ingresos y métricas de rendimiento.' },
      ],
      teamTitle: 'Creado por expertos en juegos y blockchain',
      teamDesc: 'Nuestro equipo combina años de experiencia en desarrollo de juegos, tecnología blockchain y software empresarial para ofrecer una plataforma que realmente comprende las necesidades de los desarrolladores de juegos modernos.',
    },
    ru: {
      title: 'О <span class="gradient-text">Web3APIs</span>',
      about1: 'Web3APIs — это комплексная платформа, созданная для преодоления разрыва между традиционными играми и технологией Web3. Мы предоставляем разработчикам инструменты для бесшовной интеграции блокчейна в их игры.',
      about2: 'Наша миссия — демократизировать Web3-гейминг, делая интеграцию блокчейна такой же простой, как вызов REST API. Независимо от того, создаете ли вы небольшую инди-игру или крупный многопользовательский проект, наша платформа масштабируется под ваши нужды.',
      about3: 'От безопасной аутентификации игроков до NFT-маркетплейсов, от внутриигровых экономик до P2P-турниров — мы берем на себя сложную блокчейн-инфраструктуру, чтобы вы могли сосредоточиться на создании потрясающих игровых впечатлений.',
      uptime: 'SLA по времени безотказной работы',
      response: 'Время отклика API',
      features: [
        { title: '🔐 Корпоративная безопасность', desc: 'Банковский уровень безопасности с OAuth 2.0, многофакторной аутентификацией и полной поддержкой GDPR.' },
        { title: '🎮 Поддержка игровых движков', desc: 'Нативные SDK для Unity, Unreal Engine и веб-игр. Простая интеграция с подробной документацией и примерами.' },
        { title: '🌐 Мультицепная совместимость', desc: 'Поддержка Ethereum, Polygon, BSC и других популярных сетей. Легкое переключение между тестнетами и мейннетами.' },
        { title: '📊 Аналитика в реальном времени', desc: 'Полная панель с аналитикой игроков, отслеживанием доходов и метриками производительности.' },
      ],
      teamTitle: 'Создано экспертами в играх и блокчейне',
      teamDesc: 'Наша команда сочетает многолетний опыт в разработке игр, блокчейн-технологиях и корпоративном ПО, чтобы создать платформу, которая действительно понимает потребности современных разработчиков игр.',
    },
    zh: {
      title: '关于 <span class="gradient-text">Web3APIs</span>',
      about1: 'Web3APIs 是一个综合平台，旨在弥合传统游戏与 Web3 技术之间的差距。我们为开发者提供将区块链功能无缝集成到游戏中的工具。',
      about2: '我们的使命是通过让区块链集成像调用 REST API 一样简单，来实现 Web3 游戏的民主化。无论你是在开发小型独立游戏还是大型多人游戏，我们的平台都能满足你的需求。',
      about3: '从安全的玩家认证到 NFT 市场，从游戏内经济到 P2P 锦标赛，我们处理复杂的区块链基础设施，让你专注于打造出色的游戏体验。',
      uptime: '正常运行时间 SLA',
      response: 'API 响应时间',
      features: [
        { title: '🔐 企业级安全', desc: '银行级安全，支持 OAuth 2.0、多因素认证和全面 GDPR 合规。' },
        { title: '🎮 游戏引擎支持', desc: '为 Unity、Unreal Engine 和网页游戏提供原生 SDK。简单集成，文档和示例齐全。' },
        { title: '🌐 多链兼容', desc: '支持以太坊、Polygon、BSC 等主流网络。轻松切换测试网和主网。' },
        { title: '📊 实时分析', desc: '综合仪表盘，提供玩家分析、收入跟踪和性能指标，助力游戏成功。' },
      ],
      teamTitle: '由游戏与区块链专家打造',
      teamDesc: '我们的团队结合了游戏开发、区块链技术和企业软件的多年经验，打造出真正理解现代游戏开发者需求的平台。',
    },
  };
  const currentT = t[hydratedLang] || t['en'];
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6" dangerouslySetInnerHTML={{__html: currentT.title}} />
            <div className="space-y-6 text-lg text-muted-foreground">
              <p>{currentT.about1}</p>
              <p>{currentT.about2}</p>
              <p>{currentT.about3}</p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-primary mb-2">99.9%</h3>
                <p className="text-muted-foreground">{currentT.uptime}</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-2">&lt;100ms</h3>
                <p className="text-muted-foreground">{currentT.response}</p>
              </div>
            </div>
          </motion.div>
          {/* Right Content - Features List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {currentT.features.map((f, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">{f.title}</h3>
                <p className="text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl font-bold mb-8">{currentT.teamTitle}</h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{currentT.teamDesc}</p>
        </motion.div>
      </div>
    </section>
  )
}
