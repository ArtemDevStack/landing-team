'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Section, SectionHead, Rail } from './ui-bits'
import { useLang } from '../i18n'
import { useOrderModal } from '../context/ModalContext'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function SolutionsOverview() {
  const { lang } = useLang()
  const { openOrderModal } = useOrderModal()
  const containerRef = useRef<HTMLDivElement>(null)

  const PRODUCTS = [
    {
      badgeRu: '⚡ 1-2 дня • Быстрый старт',
      badgeEn: '⚡ 1-2 Days • Fast Launch',
      titleRu: 'Продающий Лендинг / Промо-Сайт',
      titleEn: 'High-Converting Landing Page',
      subtitleRu: 'Для идеального запуска рекламы, товаров и услуг',
      subtitleEn: 'Perfect for ad campaigns & fast service launches',
      forRu: 'Вам нужно срочно запустить продажи или протестировать новую идею бизнеса.',
      forEn: 'Need to launch ads or test a new business hypothesis immediately.',
      includesRu: [
        'Современный продающий дизайн и адаптив под мобильные',
        'Мгновенная отправка заявок в Telegram и на Email',
        'Подключение вашего домена, SSL-сертификата и SEO-тегов',
        'Сверхвысокая скорость загрузки (140мс)',
      ],
      includesEn: [
        'Modern high-conversion mobile-first UI/UX',
        'Instant lead routing to Telegram & Gmail',
        'Domain mapping, SSL certificate & SEO baseline',
        'Ultra-fast response time (<140ms)',
      ],
      ctaRu: 'Заказать Лендинг за 1-2 дня →',
      ctaEn: 'Order Landing Page →',
      serviceKey: 'Продающий Лендинг (1-2 дня)',
    },
    {
      badgeRu: '🛍 2-3 дня • Полные продажи',
      badgeEn: '🛍 2-3 Days • Full E-Com',
      titleRu: 'Интернет-Магазин / Торговая Витрина',
      titleEn: 'E-Commerce Store & Marketplace',
      subtitleRu: 'Каталог товаров с приемом онлайн-платежей',
      subtitleEn: 'Product catalog with online payment integration',
      forRu: 'Хотите продавать товары напрямую клиентам с онлайн-оплатой и выбором доставки.',
      forEn: 'Want to sell products online with automated payments & delivery choices.',
      includesRu: [
        'Удобный каталог товаров с фильтрами и поиском',
        'Корзина и подключение эквайринга (Т-Банк, Сбер, ЮKassa)',
        'Автоматическая синхронизация с 1С, МойСклад или Telegram',
        'Личный кабинет покупателя и истории заказов',
      ],
      includesEn: [
        'Intuitive product catalog with instant search & filters',
        'Cart & payment acquiring (Stripe, T-Bank, Sber, Tinkoff)',
        'Automated 1C / ERP / Telegram inventory sync',
        'Customer account dashboard & order tracking',
      ],
      ctaRu: 'Заказать Магазин за 2-3 дня →',
      ctaEn: 'Order E-Commerce Store →',
      serviceKey: 'Интернет-Магазин (2-3 дня)',
    },
    {
      badgeRu: '🤖 2-4 дня • Автоматизация',
      badgeEn: '🤖 2-4 Days • Automation',
      titleRu: 'AI-Ассистент & ИИ Чат-Боты',
      titleEn: 'AI Assistant & Neuro-Bots',
      subtitleRu: 'Умный бот, который продает и отвечает 24/7',
      subtitleEn: 'Smart AI bot that handles leads & questions 24/7',
      forRu: 'Нужно квалифицировать клиентов и отвечать на вопросы круглосуточно без операторов.',
      forEn: 'Qualify leads and answer client queries 24/7 without hiring support agents.',
      includesRu: [
        'Умный нейро-бот в Telegram или прямо на вашем сайте',
        'Обучение бота на базе ваших товаров, услуг и базы знаний',
        'Автоматический прогрев и запись клиентов на созвон',
        'Мгновенный перевод горячего лида на менеджера',
      ],
      includesEn: [
        'Smart AI bot integrated in Telegram or embedded on your site',
        'Custom RAG training on your products & knowledge base',
        'Automated lead qualification & call scheduling',
        'Seamless handover of hot leads to sales team',
      ],
      ctaRu: 'Внедрить AI-Ассистента →',
      ctaEn: 'Deploy AI Assistant →',
      serviceKey: 'AI-Ассистент & Чат-боты',
    },
    {
      badgeRu: '⚙️ 1-2 недели • Масштаб',
      badgeEn: '⚙️ 1-2 Weeks • Enterprise',
      titleRu: 'CRM & B2B Личные Кабинеты',
      titleEn: 'CRM & B2B Customer Portals',
      subtitleRu: 'Единая система управления заказами и клиентами',
      subtitleEn: 'Unified portal for managing clients, orders & deals',
      forRu: 'Нужно навести порядок в сделках, счетах, клиентах и автоматизировать работу команды.',
      forEn: 'Need to organize deals, invoices, team tasks, and client analytics.',
      includesRu: [
        'Единый кабинет для клиентов и менеджеров компании',
        'Автоматическая генерация счетов, КП и договоров',
        'Аналитика продаж, воронок и конверсий в реальном времени',
        'Полная безопасность данных и разграничение прав доступа',
      ],
      includesEn: [
        'Unified portal for clients and company team',
        'Automated generation of invoices, proposals & contracts',
        'Real-time pipeline telemetry & sales analytics',
        'Enterprise security, encrypted data & access control',
      ],
      ctaRu: 'Обсудить разработку CRM →',
      ctaEn: 'Discuss CRM Portal →',
      serviceKey: 'CRM & B2B Личный Кабинет',
    },
  ]

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return

    const ctx = gsap.context(() => {
      const cards = containerRef.current?.querySelectorAll('.gsap-solution-card')
      if (!cards || !cards.length) return

      cards.forEach((card, idx) => {
        // Alternating entry directions:
        // Even indices (0, 2): fly in from LEFT (-140px on desktop, -50px on mobile)
        // Odd indices (1, 3): fly in from RIGHT (+140px on desktop, +50px on mobile)
        const isMobile = window.innerWidth < 768
        const offset = isMobile ? 50 : 140
        const fromX = idx % 2 === 0 ? -offset : offset
        const fromRotation = idx % 2 === 0 ? -3.5 : 3.5

        gsap.fromTo(
          card,
          {
            x: fromX,
            opacity: 0,
            scale: 0.92,
            rotate: fromRotation,
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              end: 'top 35%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <Rail left={lang === 'ru' ? 'ЧТО МЫ СОЗДАЕМ' : 'SOLUTIONS OVERVIEW'} right="AV / SOLUTIONS" />
      <Section id="solutions" className="pt-16 md:pt-24 overflow-hidden">
        <SectionHead
          eyebrow={lang === 'ru' ? 'Понятно и без сложностей' : 'Clear & Transparent'}
          title={
            lang === 'ru'
              ? 'Простые решения для вашего бизнеса — от Лендинга до Маркетплейса'
              : 'Turnkey Digital Products — From Landing Page to Full Store'
          }
          sub={
            lang === 'ru'
              ? 'Вам не нужно разбираться в коде. Выберите задачу вашего бизнеса — мы сами додумаем архитектуру, организуем юридическую часть и запустим проект за пару дней.'
              : 'No technical jargon needed. Choose your business objective — we handle design, coding, legal compliance, and launch in a few days.'
          }
        />

        <div ref={containerRef} className="mt-10 grid lg:grid-cols-2 gap-8">
          {PRODUCTS.map((item, idx) => (
            <div
              key={item.titleRu}
              className="gsap-solution-card h-full rounded-3xl border border-line bg-[hsl(var(--av-bg-raise)/0.5)] p-7 md:p-9 flex flex-col justify-between hover:border-[hsl(var(--av-accent)/0.6)] hover:shadow-[0_0_32px_hsl(var(--av-accent-glow))] transition-all duration-300 backdrop-blur-sm relative overflow-hidden group"
            >
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--av-accent)/0.5)] bg-[hsl(var(--av-accent-soft))] px-3.5 py-1 font-mono-tech text-xs font-semibold text-[hsl(var(--av-accent))]">
                  {lang === 'ru' ? item.badgeRu : item.badgeEn}
                </div>

                <h3 className="mt-5 font-display font-extrabold text-2xl md:text-3xl tracking-tight group-hover:text-[hsl(var(--av-accent))] transition-colors">
                  {lang === 'ru' ? item.titleRu : item.titleEn}
                </h3>

                <p className="mt-2 text-sm font-mono-tech text-dim">
                  {lang === 'ru' ? item.subtitleRu : item.subtitleEn}
                </p>

                <div className="mt-6 p-4 rounded-xl bg-[hsl(var(--av-bg))] border border-line text-xs leading-relaxed text-dim">
                  💡 <span className="font-semibold text-foreground">{lang === 'ru' ? 'Для кого:' : 'Best for:'}</span>{' '}
                  {lang === 'ru' ? item.forRu : item.forEn}
                </div>

                <div className="mt-6 space-y-2.5">
                  <div className="text-xs font-mono-tech uppercase tracking-wider text-faint mb-2">
                    {lang === 'ru' ? 'Что входит в комплект:' : 'What is included:'}
                  </div>
                  {(lang === 'ru' ? item.includesRu : item.includesEn).map((point) => (
                    <div key={point} className="flex items-start gap-2.5 text-xs md:text-sm text-foreground">
                      <span className="text-[hsl(var(--av-accent))] font-bold mt-0.5">✓</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-line">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => openOrderModal(item.serviceKey)}
                  className="w-full rounded-full bg-[hsl(var(--av-accent))] text-black font-bold px-6 py-3.5 text-xs font-mono-tech uppercase hover:shadow-[0_0_32px_hsl(var(--av-accent-glow))] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{lang === 'ru' ? item.ctaRu : item.ctaEn}</span>
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}
