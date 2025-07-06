'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/components/providers/language-provider';
import { useEffect, useState } from 'react';

export default function Stats() {
  const { lang } = useLanguage();
  const [hydratedLang, setHydratedLang] = useState<'en' | 'tr' | 'de' | 'fr' | 'es' | 'ru' | 'zh'>('en');
  useEffect(() => { setHydratedLang(lang as any); }, [lang]);
  type LangKey = 'en' | 'tr' | 'de' | 'fr' | 'es' | 'ru' | 'zh';
  const t: Record<LangKey, {
    title: string;
    subtitle: string;
    stats: { label: string; description: string }[];
    trusted: string;
    companies: string[];
  }> = {
    en: {
      title: 'Trusted by the <span class="gradient-text">Gaming Community</span>',
      subtitle: 'Join thousands of developers building the future of Web3 gaming',
      stats: [
        { label: 'Active Developers', description: 'Building with our APIs' },
        { label: 'Games Integrated', description: 'Across multiple genres' },
        { label: 'Player Accounts', description: 'Managed securely' },
        { label: 'NFTs Traded', description: 'On our marketplace' },
      ],
      trusted: 'Trusted by leading gaming companies',
      companies: ['Unity', 'Unreal', 'Ethereum', 'Polygon'],
    },
    tr: {
      title: '<span class="gradient-text">Oyun Topluluğu</span> Tarafından Güvenildi',
      subtitle: 'Web3 oyunlarının geleceğini inşa eden binlerce geliştiriciye katılın',
      stats: [
        { label: 'Aktif Geliştirici', description: 'APIlerimizle geliştiriyor' },
        { label: 'Entegre Oyun', description: 'Farklı türlerde' },
        { label: 'Oyuncu Hesabı', description: 'Güvenle yönetiliyor' },
        { label: 'NFT İşlemi', description: 'Pazarımızda alınıp satıldı' },
      ],
      trusted: 'Önde gelen oyun şirketleri tarafından güvenildi',
      companies: ['Unity', 'Unreal', 'Ethereum', 'Polygon'],
    },
    de: {
      title: 'Vertrauenswürdig von der <span class="gradient-text">Gaming-Community</span>',
      subtitle: 'Schließen Sie sich Tausenden von Entwicklern an, die die Zukunft des Web3-Gamings gestalten',
      stats: [
        { label: 'Aktive Entwickler', description: 'Entwickeln mit unseren APIs' },
        { label: 'Integrierte Spiele', description: 'Über mehrere Genres hinweg' },
        { label: 'Spielerkonten', description: 'Sicher verwaltet' },
        { label: 'Gehandelte NFTs', description: 'Auf unserem Marktplatz' },
      ],
      trusted: 'Vertrauenswürdig von führenden Spielefirmen',
      companies: ['Unity', 'Unreal', 'Ethereum', 'Polygon'],
    },
    fr: {
      title: 'Approuvé par la <span class="gradient-text">communauté du jeu</span>',
      subtitle: 'Rejoignez des milliers de développeurs qui construisent le futur du jeu Web3',
      stats: [
        { label: 'Développeurs actifs', description: 'Développent avec nos APIs' },
        { label: 'Jeux intégrés', description: 'Dans plusieurs genres' },
        { label: 'Comptes joueurs', description: 'Gérés en toute sécurité' },
        { label: 'NFTs échangés', description: 'Sur notre marketplace' },
      ],
      trusted: 'Approuvé par les plus grandes sociétés de jeux',
      companies: ['Unity', 'Unreal', 'Ethereum', 'Polygon'],
    },
    es: {
      title: 'Confiado por la <span class="gradient-text">comunidad gamer</span>',
      subtitle: 'Únete a miles de desarrolladores que construyen el futuro del gaming Web3',
      stats: [
        { label: 'Desarrolladores activos', description: 'Construyendo con nuestras APIs' },
        { label: 'Juegos integrados', description: 'En múltiples géneros' },
        { label: 'Cuentas de jugadores', description: 'Gestionadas de forma segura' },
        { label: 'NFTs intercambiados', description: 'En nuestro marketplace' },
      ],
      trusted: 'Confiado por las principales empresas de juegos',
      companies: ['Unity', 'Unreal', 'Ethereum', 'Polygon'],
    },
    ru: {
      title: 'Доверяют <span class="gradient-text">игровое сообщество</span>',
      subtitle: 'Присоединяйтесь к тысячам разработчиков, создающих будущее Web3-игр',
      stats: [
        { label: 'Активные разработчики', description: 'Работают с нашими API' },
        { label: 'Интегрированные игры', description: 'В разных жанрах' },
        { label: 'Игровые аккаунты', description: 'Надежно управляются' },
        { label: 'NFT-транзакций', description: 'На нашем маркетплейсе' },
      ],
      trusted: 'Доверяют ведущие игровые компании',
      companies: ['Unity', 'Unreal', 'Ethereum', 'Polygon'],
    },
    zh: {
      title: '获得<span class="gradient-text">游戏社区</span>的信任',
      subtitle: '加入数千名正在构建 Web3 游戏未来的开发者',
      stats: [
        { label: '活跃开发者', description: '使用我们的 API 构建' },
        { label: '集成游戏', description: '涵盖多种类型' },
        { label: '玩家账户', description: '安全管理' },
        { label: 'NFT 交易', description: '在我们的市场' },
      ],
      trusted: '获得领先游戏公司的信任',
      companies: ['Unity', 'Unreal', 'Ethereum', 'Polygon'],
    },
  };
  const currentT = t[hydratedLang] || t['en'];
  const numbers = ['10K+', '500+', '1M+', '50M+'];
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" dangerouslySetInnerHTML={{__html: currentT.title}} />
          <p className="text-xl text-muted-foreground">{currentT.subtitle}</p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {currentT.stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="relative mb-4">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {numbers[index]}
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{stat.label}</h3>
              <p className="text-muted-foreground text-sm">{stat.description}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <p className="text-muted-foreground mb-8">{currentT.trusted}</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            {currentT.companies.map((c, i) => (
              <div key={i} className="w-24 h-8 bg-muted rounded flex items-center justify-center">
                <span className="text-xs font-medium">{c}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
