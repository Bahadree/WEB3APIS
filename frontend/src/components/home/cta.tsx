'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Rocket } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider';
import { useEffect, useState } from 'react';

export default function CTA() {
  const { lang } = useLanguage();
  const [hydratedLang, setHydratedLang] = useState<'en' | 'tr' | 'de' | 'fr' | 'es' | 'ru' | 'zh'>('en');
  useEffect(() => { setHydratedLang(lang as any); }, [lang]);
  type LangKey = 'en' | 'tr' | 'de' | 'fr' | 'es' | 'ru' | 'zh';
  const t: Record<LangKey, {
    title1: string;
    title2: string;
    subtitle: string;
    start: string;
    docs: string;
    free: string;
    noCard: string;
    support: string;
  }> = {
    en: {
      title1: 'Ready to Launch Your',
      title2: 'Web3 Game?',
      subtitle: 'Join thousands of developers who are already building the future of gaming. Get started with our free tier and scale as you grow.',
      start: 'Start Building Now',
      docs: 'View Documentation',
      free: '✅ Free tier available',
      noCard: '✅ No credit card required',
      support: '✅ 24/7 developer support',
    },
    tr: {
      title1: 'Web3 Oyununu',
      title2: 'Başlatmaya Hazır mısın?',
      subtitle: 'Geleceğin oyununu inşa eden binlerce geliştiriciye katıl. Ücretsiz katıl, büyüdükçe ölçeklendir.',
      start: 'Hemen Başla',
      docs: 'Dokümantasyonu Görüntüle',
      free: '✅ Ücretsiz katman mevcut',
      noCard: '✅ Kredi kartı gerekmez',
      support: '✅ 7/24 geliştirici desteği',
    },
    de: {
      title1: 'Bereit für dein',
      title2: 'Web3-Spiel?',
      subtitle: 'Schließe dich Tausenden von Entwicklern an, die bereits die Zukunft des Gamings gestalten. Starte kostenlos und skaliere nach Bedarf.',
      start: 'Jetzt starten',
      docs: 'Dokumentation ansehen',
      free: '✅ Kostenlose Stufe verfügbar',
      noCard: '✅ Keine Kreditkarte erforderlich',
      support: '✅ 24/7 Entwickler-Support',
    },
    fr: {
      title1: 'Prêt à lancer votre',
      title2: 'jeu Web3 ?',
      subtitle: 'Rejoignez des milliers de développeurs qui construisent déjà le futur du jeu. Commencez gratuitement et évoluez à votre rythme.',
      start: 'Commencer maintenant',
      docs: 'Voir la documentation',
      free: '✅ Offre gratuite disponible',
      noCard: '✅ Pas de carte bancaire requise',
      support: '✅ Support développeur 24/7',
    },
    es: {
      title1: '¿Listo para lanzar tu',
      title2: 'juego Web3?',
      subtitle: 'Únete a miles de desarrolladores que ya están construyendo el futuro del gaming. Empieza gratis y escala a medida que creces.',
      start: 'Comienza ahora',
      docs: 'Ver documentación',
      free: '✅ Nivel gratuito disponible',
      noCard: '✅ No se requiere tarjeta de crédito',
      support: '✅ Soporte para desarrolladores 24/7',
    },
    ru: {
      title1: 'Готовы запустить свою',
      title2: 'Web3-игру?',
      subtitle: 'Присоединяйтесь к тысячам разработчиков, которые уже строят будущее игр. Начните бесплатно и масштабируйтесь по мере роста.',
      start: 'Начать сейчас',
      docs: 'Посмотреть документацию',
      free: '✅ Бесплатный тариф доступен',
      noCard: '✅ Кредитная карта не требуется',
      support: '✅ Круглосуточная поддержка разработчиков',
    },
    zh: {
      title1: '准备好发布你的',
      title2: 'Web3 游戏了吗？',
      subtitle: '加入数千名正在构建游戏未来的开发者。免费开始，随业务增长灵活扩展。',
      start: '立即开始',
      docs: '查看文档',
      free: '✅ 提供免费套餐',
      noCard: '✅ 无需信用卡',
      support: '✅ 7x24 开发者支持',
    },
  };
  const currentT = t[hydratedLang] || t['en'];
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-3xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/40 rounded-3xl" />
          {/* Content */}
          <div className="relative text-center py-16 px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-6">
                <Rocket className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
            >
              {currentT.title1}
              <br />
              <span className="gradient-text">{currentT.title2}</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              {currentT.subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/auth/register"
                className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {currentT.start}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dev"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-foreground border-2 border-border rounded-xl hover:bg-accent transition-all duration-300"
              >
                {currentT.docs}
              </Link>
            </motion.div>
            {/* Additional info */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-8 text-sm text-muted-foreground"
            >
              <div className="flex items-center">{currentT.free}</div>
              <div className="flex items-center">{currentT.noCard}</div>
              <div className="flex items-center">{currentT.support}</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
