'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../i18n'
import { Section, SectionHead, Rail } from './ui-bits'
import { useOrderModal } from '../context/ModalContext'
import MermaidDiagram from './MermaidDiagram'
import {
  Globe,
  Bot,
  Layers,
  ShieldCheck,
  Database,
  Server,
  RefreshCw,
  Cpu,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  Code2,
} from 'lucide-react'

interface ArchitectureNode {
  id: string
  nameRu: string
  nameEn: string
  tier: 1 | 2 | 3 | 4
  categoryRu: string
  categoryEn: string
  descRu: string
  descEn: string
  protocol: string
  latency: string
  icon: typeof Globe
}

const NODES: ArchitectureNode[] = [
  // TIER 1: CHANNELS
  {
    id: 'web',
    nameRu: 'Next.js Storefront / B2B',
    nameEn: 'Next.js Storefront / B2B',
    tier: 1,
    categoryRu: 'Входной канал',
    categoryEn: 'Channel',
    descRu: 'Высоконагруженный веб-портал на Next.js 15 с LCP < 0.8s',
    descEn: 'High-load storefront with LCP < 0.8s',
    protocol: 'HTTPS / HTTP3',
    latency: '< 18ms',
    icon: Globe,
  },
  {
    id: 'pwa',
    nameRu: 'PWA Mobile App',
    nameEn: 'PWA Mobile App',
    tier: 1,
    categoryRu: 'Входной канал',
    categoryEn: 'Channel',
    descRu: 'Кроссплатформенное приложение с push-уведомлениями',
    descEn: 'Cross-platform PWA with push support',
    protocol: 'WebPush / SSL',
    latency: '< 24ms',
    icon: Layers,
  },
  {
    id: 'tg',
    nameRu: 'Telegram / WhatsApp Bot',
    nameEn: 'Telegram / WhatsApp Bot',
    tier: 1,
    categoryRu: 'Входной канал',
    categoryEn: 'Channel',
    descRu: 'Интерактивный чат-канал авто-продаж и поддержки 24/7',
    descEn: 'Interactive AI sales and support bot',
    protocol: 'Telegram Webhook',
    latency: '< 12ms',
    icon: Bot,
  },

  // TIER 2: API GATEWAY & BUS
  {
    id: 'api',
    nameRu: 'API Gateway & RBAC Auth',
    nameEn: 'API Gateway & RBAC Auth',
    tier: 2,
    categoryRu: 'Шлюз и Защита',
    categoryEn: 'Gateway & Security',
    descRu: 'Единая точка входа с авторизацией, шифрованием и rate-limiting',
    descEn: 'Unified entry point with RBAC & rate-limiting',
    protocol: 'OAuth2 / JWT',
    latency: '< 4ms',
    icon: ShieldCheck,
  },
  {
    id: 'event',
    nameRu: 'Event Bus (RabbitMQ/Kafka)',
    nameEn: 'Event Bus (RabbitMQ/Kafka)',
    tier: 2,
    categoryRu: 'Шлюз и Защита',
    categoryEn: 'Gateway & Security',
    descRu: 'Асинхронная шина событий для гарантированной доставки данных',
    descEn: 'Asynchronous event bus for zero-block tasks',
    protocol: 'AMQP / Kafka Protocol',
    latency: '< 3ms',
    icon: Server,
  },

  // TIER 3: CORE BACKEND & AI
  {
    id: 'db',
    nameRu: 'PostgreSQL + Redis Cache',
    nameEn: 'PostgreSQL + Redis Cache',
    tier: 3,
    categoryRu: 'Ядро и Данные',
    categoryEn: 'Core Data',
    descRu: 'Основная реляционная БД с репликацией и распределенным кэшем',
    descEn: 'Primary relational DB with distributed caching',
    protocol: 'TCP / Postgres Native',
    latency: '< 2ms',
    icon: Database,
  },
  {
    id: 'ai_harness',
    nameRu: 'AI Harness & RAG Vector DB',
    nameEn: 'AI Harness & RAG Vector DB',
    tier: 3,
    categoryRu: 'Ядро и Данные',
    categoryEn: 'Core Data',
    descRu: 'Управление автономными AI-агентами с векторным поиском',
    descEn: 'Autonomous agent runtime with vector DB',
    protocol: 'gRPC / Vector Embedding',
    latency: '< 15ms',
    icon: Cpu,
  },

  // TIER 4: INTEGRATIONS & ERP
  {
    id: '1c',
    nameRu: '1C & МойСклад Sync',
    nameEn: '1C & ERP Sync',
    tier: 4,
    categoryRu: 'Внешние Интеграции',
    categoryEn: 'External ERP',
    descRu: 'Двусторонняя синхронизация цен, остатков и заказов в реальном времени',
    descEn: 'Bi-directional real-time stock & price sync',
    protocol: 'REST / OData 1C API',
    latency: '< 45ms',
    icon: RefreshCw,
  },
  {
    id: 'wb',
    nameRu: 'Ozon & WB API Gateway',
    nameEn: 'Ozon & WB API Gateway',
    tier: 4,
    categoryRu: 'Внешние Интеграции',
    categoryEn: 'External ERP',
    descRu: 'Автоматическое обновление остатков и заказов на маркетплейсах',
    descEn: 'Automated marketplace inventory management',
    protocol: 'Marketplace OpenAPI',
    latency: '< 60ms',
    icon: Globe,
  },
  {
    id: 'pay',
    nameRu: 'Payment & Fiscal 54-ФЗ',
    nameEn: 'Payment & Fiscal Gateway',
    tier: 4,
    categoryRu: 'Внешние Интеграции',
    categoryEn: 'External ERP',
    descRu: 'Эквайринг, СБП и автоматическая фискализация чеков',
    descEn: 'Instant acquiring, SBP & auto-invoicing',
    protocol: 'TLS 1.3 / Bank API',
    latency: '< 20ms',
    icon: Zap,
  },
]

function generateMermaidChart(activeNodeIds: string[]): string {
  const hasWeb = activeNodeIds.includes('web')
  const hasPwa = activeNodeIds.includes('pwa')
  const hasTg = activeNodeIds.includes('tg')
  const hasApi = activeNodeIds.includes('api')
  const hasEvent = activeNodeIds.includes('event')
  const hasDb = activeNodeIds.includes('db')
  const hasAi = activeNodeIds.includes('ai_harness')
  const has1c = activeNodeIds.includes('1c')
  const hasWb = activeNodeIds.includes('wb')
  const hasPay = activeNodeIds.includes('pay')

  let code = 'flowchart LR\n'

  code += '  subgraph T1 ["🌐 1. Входные Каналы"]\n'
  code += `    WEB["🌐 Storefront Next.js"]\n`
  code += `    PWA["📱 PWA Mobile App"]\n`
  code += `    TG["🤖 Telegram / WA Bot"]\n`
  code += '  end\n'

  code += '  subgraph T2 ["🛡️ 2. Шлюз & Шина"]\n'
  code += `    API["🛡️ API Gateway & Auth"]\n`
  code += `    BUS["⚡ RabbitMQ Event Bus"]\n`
  code += '  end\n'

  code += '  subgraph T3 ["🧠 3. Ядро & ИИ"]\n'
  code += `    DB[("🗄️ Postgres + Redis")]\n`
  code += `    AI["🧠 AI Harness & RAG"]\n`
  code += '  end\n'

  code += '  subgraph T4 ["🔄 4. 1С & Интеграции"]\n'
  code += `    ERP["🔄 1С / МойСклад"]\n`
  code += `    WB["🛍️ WB & Ozon API"]\n`
  code += `    PAY["💳 Эквайринг 54-ФЗ"]\n`
  code += '  end\n\n'

  if (hasWeb && hasApi) code += '  WEB ==>|HTTPS| API\n'
  if (hasPwa && hasApi) code += '  PWA ==>|REST| API\n'
  if (hasTg && hasApi) code += '  TG ==>|Webhook| API\n'
  if (hasTg && hasAi && !hasApi) code += '  TG ==>|gRPC| AI\n'

  if (hasApi && hasEvent) code += '  API ==>|Events| BUS\n'
  if (hasApi && hasDb && !hasEvent) code += '  API ==>|Query| DB\n'
  if (hasApi && hasAi) code += '  API ==>|Inference| AI\n'
  if (hasApi && hasPay) code += '  API ==>|Acquiring| PAY\n'

  if (hasEvent && hasDb) code += '  BUS ==>|Async Write| DB\n'
  if (hasEvent && has1c) code += '  BUS ==>|Sync Batch| ERP\n'
  if (hasEvent && hasWb) code += '  BUS ==>|Stocks| WB\n'

  if (hasAi && hasDb) code += '  AI <==>|RAG Vector| DB\n'
  if (has1c && hasDb && !hasEvent) code += '  ERP <==>|Sync| DB\n'

  // Custom node class styling
  code += '\n  classDef activeChan fill:#312e81,stroke:#818cf8,stroke-width:2px,color:#ffffff;\n'
  code += '  classDef activeGate fill:#164e63,stroke:#22d3ee,stroke-width:2px,color:#ffffff;\n'
  code += '  classDef activeCore fill:#581c87,stroke:#e879f9,stroke-width:2px,color:#ffffff;\n'
  code += '  classDef activeInteg fill:#065f46,stroke:#34d399,stroke-width:2px,color:#ffffff;\n'
  code += '  classDef inactive fill:#1e293b,stroke:#475569,stroke-width:1.5px,color:#cbd5e1;\n\n'

  code += `  class WEB ${hasWeb ? 'activeChan' : 'inactive'};\n`
  code += `  class PWA ${hasPwa ? 'activeChan' : 'inactive'};\n`
  code += `  class TG ${hasTg ? 'activeChan' : 'inactive'};\n`

  code += `  class API ${hasApi ? 'activeGate' : 'inactive'};\n`
  code += `  class BUS ${hasEvent ? 'activeGate' : 'inactive'};\n`

  code += `  class DB ${hasDb ? 'activeCore' : 'inactive'};\n`
  code += `  class AI ${hasAi ? 'activeCore' : 'inactive'};\n`

  code += `  class ERP ${has1c ? 'activeInteg' : 'inactive'};\n`
  code += `  class WB ${hasWb ? 'activeInteg' : 'inactive'};\n`
  code += `  class PAY ${hasPay ? 'activeInteg' : 'inactive'};\n`

  code += '  linkStyle default stroke:#38bdf8,stroke-width:2px;\n'

  return code
}

export default function InteractiveArchitecture() {
  const { lang } = useLang()
  const { openOrderModal } = useOrderModal()

  const [activeNodeIds, setActiveNodeIds] = useState<string[]>([
    'web',
    'api',
    'event',
    'db',
    '1c',
    'pay',
  ])

  const [selectedNodeId, setSelectedNodeId] = useState<string>('1c')
  const [copied, setCopied] = useState(false)
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [activePreset, setActivePreset] = useState<'ecom' | 'ai' | 'full' | 'custom'>('ecom')

  const toggleNode = (id: string) => {
    setActivePreset('custom')
    setActiveNodeIds((prev) =>
      prev.includes(id) ? (prev.length > 2 ? prev.filter((n) => n !== id) : prev) : [...prev, id]
    )
    setSelectedNodeId(id)
  }

  const applyPreset = (preset: 'ecom' | 'ai' | 'full') => {
    setActivePreset(preset)
    if (preset === 'ecom') {
      setActiveNodeIds(['web', 'api', 'event', 'db', '1c', 'pay'])
      setSelectedNodeId('1c')
    } else if (preset === 'ai') {
      setActiveNodeIds(['tg', 'web', 'api', 'event', 'ai_harness', 'db'])
      setSelectedNodeId('ai_harness')
    } else {
      setActiveNodeIds(NODES.map((n) => n.id))
      setSelectedNodeId('api')
    }
  }

  const selectedNode = NODES.find((n) => n.id === selectedNodeId) || NODES[0]
  const mermaidChartCode = generateMermaidChart(activeNodeIds)

  const handleCopyMermaid = () => {
    navigator.clipboard.writeText(mermaidChartCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Rail left={lang === 'ru' ? 'СВЯЗЬ ВСЕХ СИСТЕМ' : 'SYSTEM CONNECTIVITY'} right="AV / MERMAID ARCHITECTURE" />
      <Section id="architecture" className="pt-16 md:pt-24">
        <SectionHead
          eyebrow={lang === 'ru' ? 'Mermaid ИИ-Архитектура' : 'Mermaid Dynamic Architecture'}
          title={
            lang === 'ru'
              ? 'Живая Mermaid-Диаграмма системной архитектуры'
              : 'Interactive Live Mermaid Flowchart Diagram'
          }
          sub={
            lang === 'ru'
              ? 'Выбирайте готовые пресеты или переключайте модули — система в реальном времени собирает и рендерит Mermaid Flowchart схему.'
              : 'Select architecture presets or toggle system modules — watch Mermaid generate live SVG flowchart diagrams in real time.'
          }
        />

        {/* Preset Selector */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-[hsl(var(--av-accent)/0.3)] bg-[hsl(var(--av-bg-panel))] shadow-xl">
          <div className="flex items-center gap-2 text-xs font-mono-tech uppercase text-foreground font-bold">
            <Sparkles className="w-4 h-4 text-[hsl(var(--av-accent))]" />
            <span>{lang === 'ru' ? 'Готовые пресеты архитектуры:' : 'Ready Architecture Presets:'}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyPreset('ecom')}
              className={`px-4 py-2 rounded-xl text-xs font-mono-tech font-bold transition-all cursor-pointer ${
                activePreset === 'ecom'
                  ? 'border border-[hsl(var(--av-accent))] bg-[hsl(var(--av-accent-soft))] text-[hsl(var(--av-accent))] shadow-md'
                  : 'border border-line bg-[hsl(var(--av-bg))] text-dim hover:text-foreground hover:border-foreground/40'
              }`}
            >
              🛍️ {lang === 'ru' ? 'E-Commerce & 1С Sync' : 'E-Commerce & 1C Sync'}
            </button>
            <button
              type="button"
              onClick={() => applyPreset('ai')}
              className={`px-4 py-2 rounded-xl text-xs font-mono-tech font-bold transition-all cursor-pointer ${
                activePreset === 'ai'
                  ? 'border border-[hsl(var(--av-accent))] bg-[hsl(var(--av-accent-soft))] text-[hsl(var(--av-accent))] shadow-md'
                  : 'border border-line bg-[hsl(var(--av-bg))] text-dim hover:text-foreground hover:border-foreground/40'
              }`}
            >
              🤖 {lang === 'ru' ? 'AI Авто-Продажи' : 'Autonomous AI Bot'}
            </button>
            <button
              type="button"
              onClick={() => applyPreset('full')}
              className={`px-4 py-2 rounded-xl text-xs font-mono-tech font-bold transition-all cursor-pointer ${
                activePreset === 'full'
                  ? 'border border-[hsl(var(--av-accent))] bg-[hsl(var(--av-accent-soft))] text-[hsl(var(--av-accent))] shadow-md'
                  : 'border border-line bg-[hsl(var(--av-bg))] text-dim hover:text-foreground hover:border-foreground/40'
              }`}
            >
              ⚡ {lang === 'ru' ? 'Enterprise Full Cycle' : 'Enterprise Full Cycle'}
            </button>
          </div>
        </div>

        {/* Dynamic Diagram Flowchart Canvas */}
        <div className="mt-6 rounded-3xl border border-[hsl(var(--av-accent)/0.35)] bg-[hsl(var(--av-bg-panel)/0.9)] p-6 md:p-8 backdrop-blur-2xl shadow-2xl relative space-y-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-line pb-4 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <span className="text-xs font-mono-tech uppercase font-bold text-foreground tracking-wider flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[hsl(var(--av-accent))]" />
                <span>{lang === 'ru' ? 'Mermaid.js Динамический Генератор Диаграммы' : 'Live Mermaid.js Dynamic Diagram Engine'}</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyMermaid}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line bg-[hsl(var(--av-bg))] text-xs font-mono-tech text-dim hover:text-foreground transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (lang === 'ru' ? 'Код скопирован!' : 'Copied!') : (lang === 'ru' ? 'Скопировать Mermaid Код' : 'Copy Mermaid Code')}</span>
              </button>

              <span className="text-[10px] font-mono-tech text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                {activeNodeIds.length} {lang === 'ru' ? 'активных узлов' : 'Active Nodes'}
              </span>
            </div>
          </div>

          {/* Module Selector Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-2">
            {NODES.map((node) => {
              const isActive = activeNodeIds.includes(node.id)
              const isSelected = selectedNodeId === node.id
              const NodeIcon = node.icon

              return (
                <button
                  key={node.id}
                  onClick={() => toggleNode(node.id)}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-300 relative group flex items-center justify-between text-xs ${
                    isSelected
                      ? 'border-[hsl(var(--av-accent))] bg-[hsl(var(--av-accent-soft))] text-foreground font-bold shadow-md scale-[1.02]'
                      : isActive
                      ? 'border-emerald-500/40 bg-[hsl(var(--av-bg))] text-foreground'
                      : 'border-line bg-[hsl(var(--av-bg)/0.5)] text-faint opacity-50 hover:opacity-100'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <NodeIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[hsl(var(--av-accent))]' : 'text-faint'}`} />
                    <span className="truncate">{lang === 'ru' ? node.nameRu : node.nameEn}</span>
                  </span>
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-400' : 'opacity-20'}`} />
                </button>
              )
            })}
          </div>

          {/* Real Live Mermaid Flowchart Render Container */}
          <div className="rounded-2xl border border-line bg-[hsl(var(--av-bg))] p-4 relative overflow-x-auto custom-scrollbar-x shadow-inner">
            <div className="min-w-[650px] sm:min-w-0">
              <MermaidDiagram chart={mermaidChartCode} />
            </div>
          </div>

          {/* Node Inspector Detail Panel */}
          <div className="p-4 sm:p-6 rounded-2xl border border-[hsl(var(--av-accent)/0.4)] bg-[hsl(var(--av-bg-panel))] shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[hsl(var(--av-accent-soft))] border border-[hsl(var(--av-accent))] flex items-center justify-center text-[hsl(var(--av-accent))]">
                  <selectedNode.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-display font-bold text-base text-foreground">
                    {lang === 'ru' ? selectedNode.nameRu : selectedNode.nameEn}
                  </div>
                  <div className="text-xs font-mono-tech text-faint">
                    {lang === 'ru' ? selectedNode.categoryRu : selectedNode.categoryEn} • {selectedNode.protocol}
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  openOrderModal(
                    `Архитектура (${lang === 'ru' ? selectedNode.nameRu : selectedNode.nameEn}): Включен модуль ${lang === 'ru' ? selectedNode.nameRu : selectedNode.nameEn}`
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--av-accent))] text-black font-bold px-5 py-2.5 text-xs font-mono-tech uppercase hover:brightness-110 transition-all shadow-md cursor-pointer w-full sm:w-auto"
              >
                <span>{lang === 'ru' ? '+ Включить в ТЗ →' : '+ Add to Spec →'}</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-dim leading-relaxed">
              {lang === 'ru' ? selectedNode.descRu : selectedNode.descEn}
            </p>

            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs font-mono-tech">
              <div className="bg-[hsl(var(--av-bg))] p-3 rounded-xl border border-line">
                <span className="text-faint block text-[10px] uppercase">Протокол передачи:</span>
                <span className="font-bold text-[hsl(var(--av-accent))]">{selectedNode.protocol}</span>
              </div>
              <div className="bg-[hsl(var(--av-bg))] p-3 rounded-xl border border-line">
                <span className="text-faint block text-[10px] uppercase">Задержка шины:</span>
                <span className="font-bold text-emerald-400">{selectedNode.latency}</span>
              </div>
              <div className="bg-[hsl(var(--av-bg))] p-3 rounded-xl border border-line">
                <span className="text-faint block text-[10px] uppercase">{lang === 'ru' ? 'Изоляция прав:' : 'Rights Isolation:'}</span>
                <span className="font-bold text-foreground">{lang === 'ru' ? 'RBAC / Изолировано' : 'RBAC / Isolated'}</span>
              </div>
              <div className="bg-[hsl(var(--av-bg))] p-3 rounded-xl border border-line">
                <span className="text-faint block text-[10px] uppercase">Отказоустойчивость:</span>
                <span className="font-bold text-emerald-400">99.99% SLA</span>
              </div>
            </div>
          </div>

          {/* Architecture Action Bar without prices */}
          <div className="p-6 rounded-2xl border border-line bg-[hsl(var(--av-bg-panel))] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-tech text-emerald-400 uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  {lang === 'ru' ? 'Спроектировано модулей:' : 'Configured Modules:'} {activeNodeIds.length} из {NODES.length}
                </span>
              </div>
              <div className="text-sm md:text-base font-display font-bold text-foreground">
                {lang === 'ru'
                  ? 'Сборка готовой корпоративной архитектуры'
                  : 'Enterprise Architecture Ready'}
              </div>
              <div className="text-xs text-dim mt-0.5">
                {lang === 'ru'
                  ? 'Включает проектирование событийной шины, интеграции, нагрузочные тесты и 12 мес SLA.'
                  : 'Includes event bus design, integrations, load testing & 12 mo SLA.'}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                const activeNames = NODES.filter((n) => activeNodeIds.includes(n.id))
                  .map((n) => (lang === 'ru' ? n.nameRu : n.nameEn))
                  .join(', ')
                const specText =
                  lang === 'ru'
                    ? `Сборка архитектуры из Конфигуратора:\nВыбранные модули (${activeNodeIds.length}): ${activeNames}`
                    : `Architecture Assembly:\nSelected modules (${activeNodeIds.length}): ${activeNames}`
                openOrderModal(specText)
              }}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[hsl(var(--av-accent))] via-amber-400 to-[hsl(var(--av-accent))] text-black font-extrabold px-7 py-3.5 text-xs sm:text-sm font-mono-tech uppercase hover:shadow-[0_0_24px_hsl(var(--av-accent-glow))] transition-all shrink-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{lang === 'ru' ? 'Передать архитектуру в ТЗ →' : 'Transfer Stack to Spec →'}</span>
            </motion.button>
          </div>
        </div>
      </Section>
    </>
  )
}
