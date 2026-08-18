'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../i18n'
import { useOrderModal } from '../context/ModalContext'
import { ShieldCheck, TrendingUp, Cpu, ArrowRight, Zap, CheckCircle2 } from 'lucide-react'

interface RoleData {
  id: string
  titleRu: string
  titleEn: string
  badgeRu: string
  badgeEn: string
  icon: typeof TrendingUp
  headlineRu: string
  headlineEn: string
  subRu: string
  subEn: string
  metrics: { labelRu: string; labelEn: string; val: string; subRu: string; subEn: string }[]
  fearRu: string
  fearEn: string
  solutionRu: string
  solutionEn: string
}

const ROLES: RoleData[] = [
  {
    id: 'ceo',
    titleRu: 'CEO & Основатель',
    titleEn: 'CEO & Founder',
    badgeRu: 'Управление & Рост бизнеса',
    badgeEn: 'Business Growth & ROI',
    icon: TrendingUp,
    headlineRu: 'Запустите цифровой продукт с окупаемостью от 3 месяцев без сорванных сроков',
    headlineEn: 'Launch digital products with guaranteed ROI and zero missed deadlines',
    subRu: 'Единая команда отвечает за весь контур: от бизнес-модели и MVP до сквозной автоматизации и маркетинга. Вы получаете работающий капитал, а не абстрактные часы разработки.',
    subEn: 'Single full-cycle partner accountable for your entire digital stack from MVP to scaling.',
    metrics: [
      { labelRu: 'Окупаемость вложений', labelEn: 'Payback Period', val: '3–6 мес', subRu: 'средний показатель клиентов', subEn: 'average client metric' },
      { labelRu: 'Вывод MVP на рынок', labelEn: 'Time to Market', val: '4–6 нед', subRu: 'готовность к первому лиду', subEn: 'ready for first leads' },
      { labelRu: 'Единый центр ответственности', labelEn: 'Single SLA Partner', val: '100%', subRu: 'без сваливания вины', subEn: 'no vendor blaming' },
    ],
    fearRu: 'Главный страх: Подрядчик затянет проект на год, потратит бюджет и сдаст сырой код, который никто не может доработать.',
    fearEn: 'Core Fear: Agency delays product launch, burns budget, and delivers unmaintainable code.',
    solutionRu: 'Наше решение: Фиксированные спринты, договор с гарантией сроков, еженедельные демо и 100% передача прав и исходного кода.',
    solutionEn: 'Our Solution: Fixed sprint SLA, legal guarantees, weekly live demos, and 100% source code ownership.',
  },
  {
    id: 'cto',
    titleRu: 'CTO & ИТ-Директор',
    titleEn: 'CTO & Tech Lead',
    badgeRu: 'Инженерия & Архитектура',
    badgeEn: 'Architecture & Security',
    icon: Cpu,
    headlineRu: 'Clean Architecture, Microservices и 0% Vendor Lock-in для сложных систем',
    headlineEn: 'Clean Architecture, Microservices & 0% Vendor Lock-in for Enterprise',
    subRu: 'Проектируем отказоустойчивые системы на Next.js, Go/Node.js, PostgreSQL, Kubernetes и Event-driven шинах. Код полностью отчуждаем, документирован и покрыт тестами.',
    subEn: 'Fault-tolerant distributed systems built with modern stacks, CI/CD, and robust observability.',
    metrics: [
      { labelRu: 'Аптайм инфраструктуры', labelEn: 'Infrastructure SLA', val: '99.99%', subRu: 'отказоустойчивые кластеры', subEn: 'high availability clusters' },
      { labelRu: 'Привязка к вендору', labelEn: 'Vendor Lock-in', val: '0%', subRu: 'полный отчуждаемый код', subEn: 'fully transferable code' },
      { labelRu: 'Задержка API / RAG', labelEn: 'API / RAG Latency', val: '< 65 ms', subRu: 'оптимизированный слой', subEn: 'optimized data layer' },
    ],
    fearRu: 'Главный страх: Получить «спагетти-код» без документации, который упадет при первом пике нагрузки.',
    fearEn: 'Core Fear: Receiving undocumented spaghetti code that collapses under high load.',
    solutionRu: 'Наше решение: OpenAPI спецификации, Terraform/K8s IaC, RBAC, CI/CD пайплайны и полная передача репозиториев вашей команде.',
    solutionEn: 'Our Solution: OpenAPI specs, IaC Terraform/K8s, RBAC security, and full repo handoff.',
  },
  {
    id: 'cmo',
    titleRu: 'CMO & Маркетинг',
    titleEn: 'CMO & Growth',
    badgeRu: 'Конверсия & Аналитика',
    badgeEn: 'Conversion & Funnels',
    icon: Zap,
    headlineRu: 'Кратно растите конверсию сайта и LTV с помощью UX-дизайна и сквозных воронок',
    headlineEn: 'Scale conversion rate and LTV with high-converting UX & end-to-end analytics',
    subRu: 'Создаём продуктовые интерфейсы с безупречным UX, мгновенной загрузкой (<0.8с) и встроенными AI-инструментами удержания лидов. Сквозная аналитика до каждой продажи.',
    subEn: 'High-converting design systems, ultra-fast web performance, and AI-driven retention funnels.',
    metrics: [
      { labelRu: 'Рост конверсии в заявку', labelEn: 'Conversion Rate Boost', val: '+45–120%', subRu: 'после редизайна и UX', subEn: 'after redesign & UX' },
      { labelRu: 'Скорость загрузки (LCP)', labelEn: 'Page Load Speed', val: '< 0.8s', subRu: '100/100 Google PageSpeed', subEn: '100/100 PageSpeed' },
      { labelRu: 'Авто-обработка лидов', labelEn: 'Lead Auto-Processing', val: '24/7', subRu: 'AI-агентами в реальном времени', subEn: 'real-time AI agents' },
    ],
    fearRu: 'Главный страх: Красивый сайт, который не генерирует лиды и не интегрирован с маркетинг-стеком.',
    fearEn: 'Core Fear: A stylish site that yields zero leads and lacks analytics integration.',
    solutionRu: 'Наше решение: Проектирование от болей целевой аудитории, встроенные квизы, AI-чатботы и сквозные дата-панели.',
    solutionEn: 'Our Solution: Audience-first wireframing, embedded quizzes, AI chat triggers, and live marketing dashboards.',
  },
]

export default function RoleSwitcher() {
  const { lang } = useLang()
  const { openOrderModal } = useOrderModal()
  const [activeTab, setActiveTab] = useState<string>('ceo')

  const currentRole = ROLES.find((r) => r.id === activeTab) || ROLES[0]
  const IconComponent = currentRole.icon

  return (
    <div className="my-12 rounded-3xl border border-line bg-[hsl(var(--av-bg-panel)/0.6)] p-6 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[hsl(var(--av-accent)/0.05)] rounded-full blur-3xl pointer-events-none" />

      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-line">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--av-accent)/0.1)] text-[hsl(var(--av-accent))] text-xs font-mono-tech uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--av-accent))] animate-pulse" />
            {lang === 'ru' ? 'Персонализация решений' : 'Role-Based Perspective'}
          </div>
          <h3 className="text-xl md:text-2xl font-display font-bold text-foreground">
            {lang === 'ru' ? 'Выберите вашу роль в проекте' : 'Select Your Role in the Project'}
          </h3>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 bg-[hsl(var(--av-bg))] p-1.5 rounded-2xl border border-line">
          {ROLES.map((role) => {
            const isActive = activeTab === role.id
            const RoleIcon = role.icon
            return (
              <button
                key={role.id}
                onClick={() => setActiveTab(role.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[hsl(var(--av-accent))] text-black font-semibold shadow-lg shadow-[hsl(var(--av-accent-glow))]'
                    : 'text-dim hover:text-foreground hover:bg-[hsl(var(--av-bg-raise)]'
                }`}
              >
                <RoleIcon className="w-4 h-4" />
                <span>{lang === 'ru' ? role.titleRu : role.titleEn}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Role Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="mt-8 grid lg:grid-cols-12 gap-8 items-stretch"
        >
          {/* Left Column: Narrative & Guarantee */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <span className="inline-block text-xs font-mono-tech uppercase tracking-widest text-[hsl(var(--av-accent))] mb-2">
                {lang === 'ru' ? currentRole.badgeRu : currentRole.badgeEn}
              </span>
              <h4 className="text-2xl md:text-3xl font-display font-extrabold text-foreground leading-tight">
                {lang === 'ru' ? currentRole.headlineRu : currentRole.headlineEn}
              </h4>
              <p className="mt-4 text-sm md:text-base text-dim leading-relaxed">
                {lang === 'ru' ? currentRole.subRu : currentRole.subEn}
              </p>
            </div>

            {/* Pain vs Solution Accordion Box */}
            <div className="rounded-2xl border border-line bg-[hsl(var(--av-bg)/0.8)] p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-500/10 text-red-400 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs md:text-sm text-dim">
                  <span className="font-semibold text-foreground block mb-1">
                    {lang === 'ru' ? currentRole.fearRu.split(':')[0] : currentRole.fearEn.split(':')[0]}:
                  </span>
                  {lang === 'ru' ? currentRole.fearRu.split(':')[1] : currentRole.fearEn.split(':')[1]}
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-line">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs md:text-sm text-dim">
                  <span className="font-semibold text-emerald-400 block mb-1">
                    {lang === 'ru' ? currentRole.solutionRu.split(':')[0] : currentRole.solutionEn.split(':')[0]}:
                  </span>
                  {lang === 'ru' ? currentRole.solutionRu.split(':')[1] : currentRole.solutionEn.split(':')[1]}
                </div>
              </div>
            </div>

            {/* CTA button */}
            <div>
              <button
                onClick={() =>
                  openOrderModal(
                    lang === 'ru'
                      ? `Обсуждение проекта под роль: ${currentRole.titleRu}`
                      : `Role-focused inquiry: ${currentRole.titleEn}`
                  )
                }
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[hsl(var(--av-accent))] to-emerald-400 text-black font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-[hsl(var(--av-accent-glow))]"
              >
                <span>
                  {lang === 'ru'
                    ? `Получить предложение для ${currentRole.titleRu}`
                    : `Get tailored proposal for ${currentRole.titleEn}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Key Target Metrics */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-[hsl(var(--av-accent)/0.3)] bg-gradient-to-b from-[hsl(var(--av-bg-raise))] to-[hsl(var(--av-bg))] p-6 relative">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-tech uppercase text-dim tracking-wider">
                  {lang === 'ru' ? 'Целевые показатели' : 'Target KPIs'}
                </span>
                <IconComponent className="w-5 h-5 text-[hsl(var(--av-accent))]" />
              </div>

              <div className="space-y-4">
                {currentRole.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-line bg-[hsl(var(--av-bg)/0.6)] hover:border-[hsl(var(--av-accent)/0.5)] transition-all"
                  >
                    <div className="text-2xl md:text-3xl font-display font-extrabold text-[hsl(var(--av-accent))] tracking-tight">
                      {m.val}
                    </div>
                    <div className="text-xs font-semibold text-foreground mt-1">
                      {lang === 'ru' ? m.labelRu : m.labelEn}
                    </div>
                    <div className="text-[11px] font-mono-tech text-faint mt-0.5">
                      {lang === 'ru' ? m.subRu : m.subEn}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-line flex items-center justify-between text-[11px] font-mono-tech text-faint">
              <span>AV TECHNOLOGY GUARANTEE</span>
              <span className="text-emerald-400 font-semibold">100% SLA COMPLIANT</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
