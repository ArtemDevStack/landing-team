'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '../i18n'
import { useOrderModal } from '../context/ModalContext'
import { Rail, SectionHead } from './ui-bits'
import {
  Lightbulb,
  Palette,
  Code2,
  Bot,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Terminal,
  Cpu,
  Layers,
  BarChart3,
  Flame,
} from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface PipelineStage {
  id: string
  titleRu: string
  titleEn: string
  subtitleRu: string
  subtitleEn: string
  badgeRu: string
  badgeEn: string
  icon: typeof Lightbulb
  deliverablesRu: string[]
  deliverablesEn: string[]
  metrics: { labelRu: string; labelEn: string; val: string }[]
  visualType: 'idea' | 'design' | 'dev' | 'ai' | 'growth'
}

const STAGES: PipelineStage[] = [
  {
    id: 'IDEA',
    titleRu: 'IDEA & Стратегия Продукта',
    titleEn: 'IDEA & Product Strategy',
    subtitleRu: 'Превращаем сырую идею в просчитанную юнит-экономику, ТЗ и стек с окупаемостью от 3 месяцев.',
    subtitleEn: 'Refining raw concepts into validated unit economics, specs & fast ROI strategy.',
    badgeRu: '01 / АНАЛИЗ & ЭКОНОМИКА',
    badgeEn: '01 / AUDIT & ECONOMICS',
    icon: Lightbulb,
    deliverablesRu: [
      'Юнит-экономика и расчет ROI',
      'Карта пути пользователя (CJM)',
      'Техническое задание и ТЗ-архитектура',
      'Оценка сроков и бюджета с гарантией',
    ],
    deliverablesEn: [
      'Unit economics & ROI projections',
      'Customer Journey Mapping (CJM)',
      'Architecture & Spec Roadmap',
      'Guaranteed timeline & budget estimate',
    ],
    metrics: [
      { labelRu: 'Прогноз ROI', labelEn: 'Expected ROI', val: '+340%' },
      { labelRu: 'Расчет сметы', labelEn: 'Spec Calculation', val: '24 часа' },
      { labelRu: 'Риск-аудит', labelEn: 'Risk Mitigation', val: '100%' },
    ],
    visualType: 'idea',
  },
  {
    id: 'DESIGN',
    titleRu: 'DESIGN & UX/UI Система',
    titleEn: 'DESIGN & UX/UI System',
    subtitleRu: 'Создаем продающие прототипы и премиальные UI-киты с фокусом на максимальную конверсию.',
    subtitleEn: 'High-conversion interactive Figma prototypes, design systems & fluid animations.',
    badgeRu: '02 / ИНТЕРФЕЙСЫ & UX',
    badgeEn: '02 / UX & UI SYSTEM',
    icon: Palette,
    deliverablesRu: [
      'Кликабельный прототип в Figma',
      'Дизайн-система и библиотека токенов',
      'Адаптивы для iOS, Android & Desktop',
      'Микро-анимации и визуальные акценты',
    ],
    deliverablesEn: [
      'Interactive Figma prototypes',
      'Design system & UI tokens',
      'Responsive mobile & desktop UX',
      'Micro-animations & dynamic visual cues',
    ],
    metrics: [
      { labelRu: 'Конверсия UX', labelEn: 'UX Conversion', val: 'x2.4' },
      { labelRu: 'Скорость отклика', labelEn: 'Interaction speed', val: '60 FPS' },
      { labelRu: 'Глубина просмотров', labelEn: 'Session depth', val: '+180%' },
    ],
    visualType: 'design',
  },
  {
    id: 'DEVELOPMENT',
    titleRu: 'DEVELOPMENT & Код',
    titleEn: 'DEVELOPMENT & Code',
    subtitleRu: 'Пишем отказоустойчивый чистый код на Next.js 15, Node.js и PostgreSQL с высокой скоростью.',
    subtitleEn: 'Engineering scalable Next.js 15 & Node.js backend with sub-second performance.',
    badgeRu: '03 / ИНЖЕНЕРИЯ & BACKEND',
    badgeEn: '03 / CODE & ARCHITECTURE',
    icon: Code2,
    deliverablesRu: [
      'Чистая Next.js 15 / React 19 архитектура',
      'Интеграции с 1С, МойСклад & ERP',
      'Оптимизация скорости загрузки (<0.4s)',
      'CI/CD автодеплой и защита от сбоев',
    ],
    deliverablesEn: [
      'Clean Next.js 15 / React 19 codebase',
      'Real-time 1C & ERP API sync',
      'Sub-second page loading speed (<0.4s)',
      'Automated CI/CD & resilient infrastructure',
    ],
    metrics: [
      { labelRu: 'Скорость загрузки', labelEn: 'Page Load Speed', val: '0.38s' },
      { labelRu: 'Покрытие тестами', labelEn: 'Test Coverage', val: '99.4%' },
      { labelRu: 'Lighthouse Score', labelEn: 'Lighthouse Rating', val: '100/100' },
    ],
    visualType: 'dev',
  },
  {
    id: 'AI',
    titleRu: 'AI & Нейро-автоматизация',
    titleEn: 'AI & Neural Automation',
    subtitleRu: 'Внедряем автономных AI-агентов, RAG-векторные базы и умные интеграции для авто-продаж 24/7.',
    subtitleEn: 'Embedding autonomous sales AI agents, vector RAG & workflow automation.',
    badgeRu: '04 / ИИ-МОДЕЛИ & RAG',
    badgeEn: '04 / NEURAL & AI AGENTS',
    icon: Bot,
    deliverablesRu: [
      'Автономные AI-агенты продаж в TG / Web',
      'Векторная RAG база знаний компании',
      'Автоматизация рутины менеджеров',
      'Безопасный изолированный AI-контур',
    ],
    deliverablesEn: [
      'Autonomous 24/7 sales AI agents',
      'Enterprise RAG vector database',
      'Full CRM routine automation',
      'Isolated & secure AI infrastructure',
    ],
    metrics: [
      { labelRu: 'Автономность ответов', labelEn: 'AI Response Rate', val: '94%' },
      { labelRu: 'Экономия времени', labelEn: 'Time Saved', val: '140ч/мес' },
      { labelRu: 'Затраты на поддержку', labelEn: 'Support Cost', val: '-70%' },
    ],
    visualType: 'ai',
  },
  {
    id: 'GROWTH',
    titleRu: 'GROWTH & Масштабирование',
    titleEn: 'GROWTH & SLA Scaling',
    subtitleRu: 'Запускаем постоянное развитие продукта, рекламу, SEO, SLA мониторинг и защиту без вендор-лока.',
    subtitleEn: 'Continuous product optimization, telemetry, SLA guarantees & lead scaling.',
    badgeRu: '05 / ПОДДЕРЖКА & РОСТ',
    badgeEn: '05 / SLA & SCALING',
    icon: TrendingUp,
    deliverablesRu: [
      'Гарантированный SLA 99.99% в договоре',
      '100% Передача исходных прав и кода',
      'Маркетинговые воронки и SEO-рост',
      'Поддержка и масштабирование 24/7',
    ],
    deliverablesEn: [
      '99.99% Uptime SLA in contract',
      '100% Source code & IP ownership',
      'Conversion funnels & SEO growth',
      '24/7 Dedicated engineering support',
    ],
    metrics: [
      { labelRu: 'SLA Аптайм', labelEn: 'SLA Uptime', val: '99.99%' },
      { labelRu: 'Вендор-лок', labelEn: 'Vendor Lock-in', val: '0%' },
      { labelRu: 'Рост конверсии', labelEn: 'Growth Delta', val: '+220%' },
    ],
    visualType: 'growth',
  },
]

export default function PipelineScrollSection() {
  const { lang } = useLang()
  const { openOrderModal } = useOrderModal()

  const containerRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const [progressPercent, setProgressPercent] = useState(0)

  useEffect(() => {
    if (!containerRef.current || !pinRef.current) return

    const totalStages = STAGES.length

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: `+=${totalStages * 100}%`,
      pin: pinRef.current,
      pinSpacing: true,
      scrub: 0.5,
      onUpdate: (self) => {
        const prog = self.progress
        setProgressPercent(prog * 100)

        // Calculate current stage index based on progress
        const rawIdx = Math.floor(prog * totalStages)
        const clampedIdx = Math.min(totalStages - 1, Math.max(0, rawIdx))
        setActiveIndex(clampedIdx)
      },
    })

    return () => {
      trigger.kill()
    }
  }, [])

  const currentStage = STAGES[activeIndex]

  const handleSelectTab = (idx: number) => {
    setActiveIndex(idx)
  }

  return (
    <>
      <Rail
        left={lang === 'ru' ? '02 / ИНЖЕНЕРНЫЙ ПАЙПЛАЙН (GSAP PIN)' : '02 / GSAP PINNED PIPELINE'}
        right="IDEA → DESIGN → CODE → AI → GROWTH"
      />

      {/* Scroll container for GSAP pinning */}
      <section
        id="pipeline-scroll"
        ref={containerRef}
        className="relative bg-[hsl(var(--av-bg))] text-foreground"
      >
        {/* Pinned viewport frame */}
        <div
          ref={pinRef}
          className="w-full min-h-screen flex flex-col justify-between p-4 sm:p-6 md:p-10 max-w-7xl mx-auto overflow-hidden"
        >
          {/* Header & Controls */}
          <div className="shrink-0 pt-2 pb-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <SectionHead
                eyebrow={lang === 'ru' ? '02 / Непрерывный цикл разработки' : '02 / Continuous Pipeline'}
                title={lang === 'ru' ? 'От Идеи до Запуска и Масштабирования' : 'From Idea to Production & Scale'}
                sub={
                  lang === 'ru'
                    ? 'Скролльте вниз: экран зафиксирован (GSAP ScrollTrigger), а прогресс пошагово раскрывает все 5 этапов создания продукта.'
                    : 'Scroll down: page pins with GSAP as progress unlocks all 5 key product engineering stages.'
                }
              />
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[hsl(var(--av-accent)/0.4)] bg-[hsl(var(--av-accent-soft))] text-[hsl(var(--av-accent))] text-xs font-mono-tech uppercase tracking-wider shrink-0 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-[hsl(var(--av-accent))] animate-pulse" />
                <span>{lang === 'ru' ? 'GSAP Scroll Pin • Листайте вниз ↓' : 'GSAP Scroll Pin • Keep Scrolling ↓'}</span>
              </div>
            </div>

            {/* Top Interactive Progress Tabs */}
            <div className="relative">
              {/* Progress Line Background */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-[hsl(var(--av-bg-raise))] border border-line -translate-y-1/2 rounded-full z-0" />
              
              {/* Active Animated Progress Fill */}
              <div
                className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[hsl(var(--av-accent))] via-cyan-400 to-emerald-400 -translate-y-1/2 rounded-full z-0 transition-all duration-300 shadow-[0_0_12px_hsl(var(--av-accent-glow))]"
                style={{ width: `${progressPercent}%` }}
              />

              {/* Step Tabs Grid */}
              <div className="relative z-10 grid grid-cols-5 gap-1 sm:gap-3">
                {STAGES.map((stg, idx) => {
                  const isActive = activeIndex === idx
                  const isPassed = activeIndex > idx
                  const Icon = stg.icon

                  return (
                    <button
                      key={stg.id}
                      onClick={() => handleSelectTab(idx)}
                      className={`group relative py-2.5 px-2 sm:px-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between ${
                        isActive
                          ? 'border-[hsl(var(--av-accent))] bg-[hsl(var(--av-bg-panel))] shadow-xl shadow-[hsl(var(--av-accent-glow))] scale-[1.02]'
                          : isPassed
                          ? 'border-line-strong bg-[hsl(var(--av-bg-raise)/0.8)] text-foreground'
                          : 'border-line bg-[hsl(var(--av-bg)/0.8)] text-dim hover:border-line-strong'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span
                          className={`font-mono-tech text-[10px] sm:text-xs font-bold tracking-wider ${
                            isActive
                              ? 'text-[hsl(var(--av-accent))]'
                              : isPassed
                              ? 'text-emerald-400'
                              : 'text-faint'
                          }`}
                        >
                          0{idx + 1}
                        </span>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                            isActive
                              ? 'bg-[hsl(var(--av-accent))] text-black'
                              : isPassed
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-[hsl(var(--av-bg))] text-faint border border-line'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      <div
                        className={`font-display font-bold text-xs sm:text-sm tracking-tight truncate ${
                          isActive
                            ? 'text-[hsl(var(--av-accent))]'
                            : 'text-foreground group-hover:text-[hsl(var(--av-accent))]'
                        }`}
                      >
                        {stg.id}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Main Stage Display Grid */}
          <div className="my-auto py-2 grid lg:grid-cols-12 gap-6 items-center">
            {/* Left Info Panel (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStage.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[hsl(var(--av-accent)/0.5)] bg-[hsl(var(--av-accent-soft))] text-[hsl(var(--av-accent))] font-mono-tech text-[11px] font-bold uppercase tracking-widest">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === 'ru' ? currentStage.badgeRu : currentStage.badgeEn}</span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-foreground">
                      {lang === 'ru' ? currentStage.titleRu : currentStage.titleEn}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-dim leading-relaxed">
                      {lang === 'ru' ? currentStage.subtitleRu : currentStage.subtitleEn}
                    </p>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-line">
                    {currentStage.metrics.map((m, idx) => (
                      <div key={idx} className="bg-[hsl(var(--av-bg-raise)/0.6)] p-2.5 rounded-xl border border-line">
                        <div className="font-display font-extrabold text-lg sm:text-xl text-[hsl(var(--av-accent))]">
                          {m.val}
                        </div>
                        <div className="text-[10px] font-mono-tech text-faint leading-tight mt-0.5">
                          {lang === 'ru' ? m.labelRu : m.labelEn}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Deliverables List */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-mono-tech uppercase tracking-wider text-faint font-semibold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[hsl(var(--av-accent))]" />
                      <span>{lang === 'ru' ? 'Результат этапа:' : 'Stage Deliverables:'}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(lang === 'ru' ? currentStage.deliverablesRu : currentStage.deliverablesEn).map(
                        (item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-xs font-medium text-foreground bg-[hsl(var(--av-bg-panel))] p-2.5 rounded-xl border border-line"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="truncate">{item}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Action CTA Button */}
                  <div className="pt-2">
                    <button
                      onClick={() =>
                        openOrderModal(
                          `${currentStage.id}: ${lang === 'ru' ? currentStage.titleRu : currentStage.titleEn}`
                        )
                      }
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[hsl(var(--av-accent))] to-cyan-400 text-black font-bold px-7 py-3.5 text-xs sm:text-sm hover:brightness-110 transition-all shadow-lg shadow-[hsl(var(--av-accent-glow))]"
                    >
                      <span>
                        {lang === 'ru' ? `Обсудить этап ${currentStage.id}` : `Discuss ${currentStage.id} Stage`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Rich Visual Card (7 Cols) */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStage.id}
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="relative rounded-3xl border border-[hsl(var(--av-accent)/0.3)] bg-[hsl(var(--av-bg-panel)/0.9)] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden min-h-[360px] sm:min-h-[420px] flex flex-col justify-between"
                >
                  {/* Ambient Backlight */}
                  <div
                    className="absolute -top-32 -right-32 w-72 h-72 rounded-full blur-[100px] opacity-25 pointer-events-none"
                    style={{ background: 'hsl(var(--av-accent))' }}
                  />

                  {/* Stage 1 Visual: IDEA */}
                  {currentStage.visualType === 'idea' && (
                    <div className="space-y-6 my-auto">
                      <div className="flex items-center justify-between border-b border-line pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-[hsl(var(--av-accent-soft))] border border-[hsl(var(--av-accent))] text-[hsl(var(--av-accent))] flex items-center justify-center font-bold">
                            01
                          </div>
                          <div>
                            <div className="font-display font-bold text-base text-foreground">
                              {lang === 'ru' ? 'Архитектурный Манифест & ROI' : 'Architecture Spec & ROI'}
                            </div>
                            <div className="font-mono-tech text-xs text-faint">unit_economics_v2.json</div>
                          </div>
                        </div>
                        <span className="font-mono-tech text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                          {lang === 'ru' ? 'ГОТОВО К СТАРТУ' : 'READY TO BUILD'}
                        </span>
                      </div>

                      {/* Mock Chart & Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[hsl(var(--av-bg))] p-4 rounded-2xl border border-line space-y-2">
                          <div className="text-xs text-faint font-mono-tech">
                            {lang === 'ru' ? 'Срок окупаемости (Payback):' : 'Payback Period:'}
                          </div>
                          <div className="font-display font-extrabold text-2xl text-[hsl(var(--av-accent))]">
                            1.5-3 мес.
                          </div>
                          <div className="h-1.5 w-full bg-[hsl(var(--av-bg-raise))] rounded-full overflow-hidden">
                            <div className="h-full bg-[hsl(var(--av-accent))] w-3/4 rounded-full" />
                          </div>
                        </div>
                        <div className="bg-[hsl(var(--av-bg))] p-4 rounded-2xl border border-line space-y-2">
                          <div className="text-xs text-faint font-mono-tech">
                            {lang === 'ru' ? 'Снижение рисков:' : 'Risk Mitigation:'}
                          </div>
                          <div className="font-display font-extrabold text-2xl text-emerald-400">
                            -85%
                          </div>
                          <div className="h-1.5 w-full bg-[hsl(var(--av-bg-raise))] rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 w-full rounded-full" />
                          </div>
                        </div>
                      </div>

                      {/* Target Stack Nodes */}
                      <div className="p-4 rounded-2xl border border-line bg-[hsl(var(--av-bg))] space-y-2">
                        <div className="text-xs font-mono-tech uppercase text-faint tracking-wider">
                          {lang === 'ru' ? 'Рекомендованный контур:' : 'Target Eco-Stack:'}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {['Next.js 15', 'Node.js', 'PostgreSQL', 'Telegram Bot', 'RAG AI'].map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 rounded-xl bg-[hsl(var(--av-bg-panel))] border border-[hsl(var(--av-accent)/0.3)] text-xs font-mono-tech text-foreground"
                            >
                              ⚡ {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stage 2 Visual: DESIGN */}
                  {currentStage.visualType === 'design' && (
                    <div className="space-y-6 my-auto">
                      <div className="flex items-center justify-between border-b border-line pb-4">
                        <div className="flex items-center gap-2">
                          <Palette className="w-5 h-5 text-[hsl(var(--av-accent))]" />
                          <span className="font-mono-tech text-xs uppercase font-bold text-foreground">
                            Figma UI Canvas System
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-3 h-3 rounded-full bg-red-500/80" />
                          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                          <span className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>
                      </div>

                      {/* Mock Figma Canvas */}
                      <div className="bg-[hsl(var(--av-bg))] p-5 rounded-2xl border border-line space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-mono-tech text-dim">
                            {lang === 'ru' ? 'Токены и UI-Kit:' : 'Design Tokens & UI-Kit:'}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-[hsl(var(--av-accent))]" />
                            <span className="w-4 h-4 rounded-full bg-emerald-400" />
                            <span className="w-4 h-4 rounded-full bg-purple-500" />
                          </div>
                        </div>

                        {/* Interactive UI Mock Card */}
                        <div className="p-4 rounded-2xl border border-[hsl(var(--av-accent)/0.5)] bg-[hsl(var(--av-bg-panel))] shadow-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[hsl(var(--av-accent))] font-mono-tech">
                              PREMIUM UI COMPONENT
                            </span>
                            <span className="text-[10px] bg-[hsl(var(--av-accent-soft))] text-[hsl(var(--av-accent))] px-2 py-0.5 rounded-full font-bold">
                              60 FPS
                            </span>
                          </div>
                          <div className="h-2 w-3/4 bg-foreground/20 rounded-full animate-pulse" />
                          <div className="h-2 w-1/2 bg-foreground/10 rounded-full" />
                          <div className="pt-2 flex justify-end">
                            <span className="px-4 py-1.5 rounded-xl bg-[hsl(var(--av-accent))] text-black font-bold text-xs">
                              Interactive Button
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stage 3 Visual: DEV */}
                  {currentStage.visualType === 'dev' && (
                    <div className="space-y-4 my-auto font-mono-tech text-xs">
                      {/* Code Editor Window */}
                      <div className="rounded-2xl border border-line bg-black/90 p-4 space-y-3 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <div className="flex items-center gap-2 text-faint">
                            <Terminal className="w-4 h-4 text-emerald-400" />
                            <span>src/app/page.tsx</span>
                          </div>
                          <span className="text-emerald-400 font-bold text-[11px]">Next.js 15 Server Comp</span>
                        </div>

                        {/* Code Lines */}
                        <div className="space-y-1 text-slate-300">
                          <div>
                            <span className="text-purple-400">export default async function</span>{' '}
                            <span className="text-blue-400">ProductPipeline</span>() {'{'}
                          </div>
                          <div className="pl-4">
                            <span className="text-purple-400">const</span> data ={' '}
                            <span className="text-purple-400">await</span>{' '}
                            <span className="text-yellow-300">fetchProductionData</span>()
                          </div>
                          <div className="pl-4">
                            <span className="text-purple-400">return</span> &lt;
                            <span className="text-emerald-400">HighPerformanceEngine</span> status=
                            <span className="text-amber-300">&quot;0.38s&quot;</span> /&gt;
                          </div>
                          <div>{'}'}</div>
                        </div>

                        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            ✓ TypeScript check: 0 errors
                          </span>
                          <span className="text-faint">Build: 100% Clean</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stage 4 Visual: AI */}
                  {currentStage.visualType === 'ai' && (
                    <div className="space-y-5 my-auto">
                      <div className="flex items-center justify-between border-b border-line pb-4">
                        <div className="flex items-center gap-2">
                          <Bot className="w-5 h-5 text-[hsl(var(--av-accent))]" />
                          <span className="font-mono-tech text-xs font-bold text-foreground">
                            Neural Sales Agent & RAG Pipeline
                          </span>
                        </div>
                        <span className="font-mono-tech text-xs text-cyan-400 font-bold bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                          ONLINE 24/7
                        </span>
                      </div>

                      {/* AI Agent Chat & Vector Node Sandbox */}
                      <div className="bg-[hsl(var(--av-bg))] p-4 rounded-2xl border border-line space-y-3">
                        <div className="p-3 rounded-xl bg-[hsl(var(--av-bg-panel))] border border-[hsl(var(--av-accent)/0.4)] text-xs space-y-1">
                          <div className="text-[hsl(var(--av-accent))] font-bold font-mono-tech flex items-center justify-between">
                            <span>🤖 AV AI Agent:</span>
                            <span className="text-[10px] text-faint">0.15s lat</span>
                          </div>
                          <p className="text-foreground text-xs leading-relaxed">
                            «Здравствуйте! Подготовил архитектурный расчет по вашему запросу. Заявка отправлена в 1С и Telegram.»
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-mono-tech text-faint pt-1">
                          <span>Vector DB Embeddings: 48,200</span>
                          <span className="text-emerald-400 font-bold">Accuracy: 99.8%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stage 5 Visual: GROWTH */}
                  {currentStage.visualType === 'growth' && (
                    <div className="space-y-6 my-auto">
                      <div className="flex items-center justify-between border-b border-line pb-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-emerald-400" />
                          <span className="font-mono-tech text-xs font-bold text-foreground">
                            Live Telemetry & SLA Dashboard
                          </span>
                        </div>
                        <span className="font-mono-tech text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                          SLA 99.99% GUARANTEED
                        </span>
                      </div>

                      {/* Growth Telemetry Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[hsl(var(--av-bg))] p-4 rounded-2xl border border-line space-y-1">
                          <div className="text-xs text-faint font-mono-tech">
                            {lang === 'ru' ? 'Вендор-локаут:' : 'Vendor Lock-in:'}
                          </div>
                          <div className="font-display font-extrabold text-2xl text-emerald-400">
                            0% (100% код ваш)
                          </div>
                        </div>

                        <div className="bg-[hsl(var(--av-bg))] p-4 rounded-2xl border border-line space-y-1">
                          <div className="text-xs text-faint font-mono-tech">
                            {lang === 'ru' ? 'Время реакции SLA:' : 'SLA Response Time:'}
                          </div>
                          <div className="font-display font-extrabold text-2xl text-[hsl(var(--av-accent))]">
                            &lt; 15 минут
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Footer status bar */}
                  <div className="border-t border-line pt-4 flex items-center justify-between text-xs font-mono-tech text-faint">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>{lang === 'ru' ? 'Гарантия качества AV Studio' : 'AV Studio Quality SLA'}</span>
                    </span>
                    <span className="text-[hsl(var(--av-accent))] font-bold">
                      {activeIndex + 1} / {STAGES.length}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Navigation Hint */}
          <div className="shrink-0 pt-2 flex items-center justify-between text-[11px] font-mono-tech text-faint">
            <span>{lang === 'ru' ? 'ЭТАП 01 (IDEA)' : 'STAGE 01 (IDEA)'}</span>
            <span className="text-[hsl(var(--av-accent))] font-bold">
              {lang === 'ru' ? 'ПРОГРЕСС СКРОЛЛА GSAP' : 'GSAP SCROLL PROGRESS'} {Math.round(progressPercent)}%
            </span>
            <span>{lang === 'ru' ? 'ЭТАП 05 (GROWTH)' : 'STAGE 05 (GROWTH)'}</span>
          </div>
        </div>
      </section>
    </>
  )
}
