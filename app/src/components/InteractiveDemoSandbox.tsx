'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../i18n'
import FormattedMarkdown from './FormattedMarkdown'
import { Section, SectionHead, Rail } from './ui-bits'
import { useOrderModal } from '../context/ModalContext'
import {
  Bot,
  LayoutGrid,
  Activity,
  Send,
  CheckCircle2,
  Cpu,
  Shield,
  Zap,
  Server,
  AlertCircle,
  Sparkles,
  Layers,
  Terminal,
  Plus,
  Globe,
  Radio,
  Bell,
  Database,
  Network,
  X,
  Flame,
  RefreshCw,
} from 'lucide-react'

interface Deal {
  id: number
  client: string
  amount: string
  stage: 'new' | 'proc' | 'done'
  tag: string
  updatedAt?: string
}

function TypewriterMarkdown({ content }: { content: string }) {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    let index = 0
    setDisplayedText('')
    const interval = setInterval(() => {
      index += 4
      if (index >= content.length) {
        setDisplayedText(content)
        clearInterval(interval)
      } else {
        setDisplayedText(content.slice(0, index))
      }
    }, 12)

    return () => clearInterval(interval)
  }, [content])

  return (
    <div className="relative">
      <FormattedMarkdown content={displayedText} className="text-xs md:text-sm" />
      {displayedText.length < content.length && (
        <span className="inline-block w-2 h-4 ml-1 bg-[hsl(var(--av-accent))] animate-pulse align-middle" />
      )}
    </div>
  )
}

export default function InteractiveDemoSandbox() {
  const { lang } = useLang()
  const { openOrderModal } = useOrderModal()
  const [activeTab, setActiveTab] = useState<'ai' | 'crm' | 'monitor' | 'bus'>('ai')

  // Toast System for interactive feedback
  const [toast, setToast] = useState<{ id: string; text: string; icon: string; bg: string } | null>(null)

  const showToast = (text: string, icon: string = '⚡', bg: string = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300') => {
    const id = Date.now().toString()
    setToast({ id, text, icon, bg })
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev))
    }, 4000)
  }

  // ==========================================
  // 1. LIVE NEURAL AI CHAT WITH REAL STREAMING
  // ==========================================
  const [messages, setMessages] = useState<
    Array<{ id: string; sender: 'user' | 'ai'; text: string; tool?: string; isNew?: boolean }>
  >([
    {
      id: 'msg-init',
      sender: 'ai',
      text:
        lang === 'ru'
          ? 'Привет! Я живой **ИИ-Архитектор AV Studio**, подключенный к нашей базе знаний. Задайте любой вопрос по стеку, интеграциям 1С, срокам или стоимости разработки!'
          : 'Hello! I am **AV Studio Live Neural Architect** connected to our tech knowledge base. Ask any question about tech stack, 1C integrations, timelines or budget!',
      tool: 'AV_Neural_RAG_V3',
      isNew: false,
    },
  ])

  const [inputVal, setInputVal] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  const chatScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let interval: any
    if (isThinking) {
      const start = Date.now()
      setElapsedSeconds(0)
      interval = setInterval(() => {
        setElapsedSeconds(Number(((Date.now() - start) / 1000).toFixed(1)))
      }, 100)
    } else {
      setElapsedSeconds(0)
    }
    return () => clearInterval(interval)
  }, [isThinking])

  const PRESET_PROMPTS = [
    {
      tagRu: '1С / ERP',
      tagEn: '1C ERP',
      textRu: 'Как вы связываете 1С с веб-сайтом без сбоев?',
      textEn: 'How do you sync 1C ERP with site without downtime?',
    },
    {
      tagRu: 'Стек & Скорость',
      tagEn: 'Stack & Speed',
      textRu: 'Какой стек лучше использовать для высоконагруженного B2B портала?',
      textEn: 'Which stack is best for a high-load B2B portal?',
    },
    {
      tagRu: 'Сроки & MVP',
      tagEn: 'Timelines',
      textRu: 'За сколько недель сделаете MVP для AI-сервиса или SaaS?',
      textEn: 'How fast can you deliver an AI MVP?',
    },
    {
      tagRu: 'Гарантия & Код',
      tagEn: 'SLA & IP',
      textRu: 'Какие гарантии окупаемости и прав на код даете?',
      textEn: 'What code warranty and IP rights do you provide?',
    },
  ]

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [messages, isThinking, elapsedSeconds])

  const handleSendAi = async (textToSend?: string) => {
    const text = textToSend || inputVal
    if (!text.trim() || isThinking) return

    const userMsgId = 'user-' + Date.now()
    const newMessages = [...messages, { id: userMsgId, sender: 'user' as const, text }]
    setMessages(newMessages)
    if (!textToSend) setInputVal('')
    setIsThinking(true)

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, lang }),
      })
      const data = await res.json()

      let aiReply = data.reply

      if (!aiReply) {
        const lower = text.toLowerCase()
        if (lower.includes('1с') || lower.includes('erp')) {
          aiReply =
            lang === 'ru'
              ? 'Синхронизация с 1С выполняется через отказоустойчивую шину **RabbitMQ / Kafka** с гарантированным подтверждением транзакций. Даже при сбоях на стороне 1С все заказы буферизуются в очереди без потери данных.'
              : '1C ERP sync executes via decoupled RabbitMQ event bus with transaction acknowledgment. Zero data loss during 1C downtime.'
        } else if (lower.includes('стек') || lower.includes('stack') || lower.includes('b2b')) {
          aiReply =
            lang === 'ru'
              ? 'Для высоконагруженных B2B-порталов мы используем **Next.js 15 (App Router)** на фронтенде, **Node.js/Go** на бэкенде, **PostgreSQL** с партиционированием и **Redis** для моментального кэша (< 20мс).'
              : 'For high-load B2B portals we use Next.js 15, Node.js/Go backend, PostgreSQL partitioning, and Redis distributed cache.'
        } else {
          aiReply =
            lang === 'ru'
              ? 'AV Studio проектирует системы под ключ: от интерфейсов и мобильных PWA до микросервисов, интеграций с 1С и AI-агентов. Все исключительные права на исходный код на 100% передаются вашему юрлицу.'
              : 'AV Studio delivers full-cycle products: frontends, microservices, 1C integrations, and AI Agents with 100% IP ownership.'
        }
      }

      const aiMsgId = 'ai-' + Date.now()
      setMessages((prev) => [
        ...prev,
        { id: aiMsgId, sender: 'ai', text: aiReply, isNew: true },
      ])
    } catch {
      const aiMsgId = 'ai-err-' + Date.now()
      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          sender: 'ai',
          text:
            lang === 'ru'
              ? 'Мы разрабатываем сайты, CRM, SaaS и AI-агентов под ключ. Нажмите кнопку ниже, чтобы обсудить ваш проект с ведущим архитектором!'
              : 'We build enterprise web products, CRM, and AI systems. Click below to consult with our chief architect!',
          isNew: true,
        },
      ])
    } finally {
      setIsThinking(false)
    }
  }

  // ==========================================
  // 2. ENHANCED DRAG AND DROP CRM KANBAN
  // ==========================================
  const [deals, setDeals] = useState<Deal[]>([
    { id: 1, client: 'ООО «ТехноПром»', amount: '1 450 000 ₽', stage: 'new', tag: 'B2B Portal' },
    { id: 2, client: 'Сеть клиник «МедЛайн»', amount: '890 000 ₽', stage: 'proc', tag: 'CRM & App' },
    { id: 3, client: 'Nordic Logistics', amount: '2 100 000 ₽', stage: 'done', tag: 'Enterprise' },
    { id: 4, client: 'Альфа-Спецтехника', amount: '670 000 ₽', stage: 'new', tag: 'AI Agent' },
  ])
  const [draggedDealId, setDraggedDealId] = useState<number | null>(null)
  const [dragOverStage, setDragOverStage] = useState<string | null>(null)
  const [showAddDealForm, setShowAddDealForm] = useState(false)
  const [newClientName, setNewClientName] = useState('')
  const [newClientAmount, setNewClientAmount] = useState('')
  const [newClientTag, setNewClientTag] = useState('B2B Portal')

  const getStageTotal = (stage: 'new' | 'proc' | 'done') => {
    const total = deals
      .filter((d) => d.stage === stage)
      .reduce((acc, deal) => {
        const num = parseInt(deal.amount.replace(/\D/g, ''), 10) || 0
        return acc + num
      }, 0)
    return total.toLocaleString('ru-RU') + ' ₽'
  }

  const handleAddDealSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClientName.trim()) return
    const numericAmount = parseInt(newClientAmount.replace(/\D/g, ''), 10) || 500000
    const formattedAmount = numericAmount.toLocaleString('ru-RU') + ' ₽'

    const newDealObj: Deal = {
      id: Date.now(),
      client: newClientName,
      amount: formattedAmount,
      stage: 'new',
      tag: newClientTag || 'Custom Order',
      updatedAt: 'Только что',
    }

    setDeals((prev) => [newDealObj, ...prev])
    setNewClientName('')
    setNewClientAmount('')
    setShowAddDealForm(false)

    showToast(
      lang === 'ru' ? `Новая сделка «${newDealObj.client}» создана!` : `New deal "${newDealObj.client}" created!`,
      '✨',
      'border-[hsl(var(--av-accent))] bg-[hsl(var(--av-accent-soft))] text-[hsl(var(--av-accent))] font-bold'
    )
  }

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedDealId(id)
    e.dataTransfer.setData('text/plain', id.toString())
  }

  const handleDragOver = (e: React.DragEvent, stage: string) => {
    e.preventDefault()
    setDragOverStage(stage)
  }

  const handleDragLeave = () => {
    setDragOverStage(null)
  }

  const moveDealToStage = (id: number, targetStage: 'new' | 'proc' | 'done') => {
    const movedDeal = deals.find((d) => d.id === id)
    if (!movedDeal || movedDeal.stage === targetStage) return
    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, stage: targetStage, updatedAt: 'Только что' } : d))
    )
    if (targetStage === 'proc') {
      showToast(
        lang === 'ru'
          ? `[1С:Enterprise API] Выставлен счет на ${movedDeal.amount} для ${movedDeal.client}!`
          : `[1C ERP API] Invoice generated for ${movedDeal.client}!`,
        '📄',
        'border-amber-500/50 bg-amber-500/10 text-amber-300 font-bold'
      )
    } else if (targetStage === 'done') {
      showToast(
        lang === 'ru'
          ? `[Telegram & 1С] 🎉 Сделка ${movedDeal.client} на ${movedDeal.amount} закрыта! Акт сформирован.`
          : `[Telegram & 1C] 🎉 Deal with ${movedDeal.client} closed & verified!`,
        '🎉',
        'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 font-bold'
      )
    }
  }

  const handleDrop = (e: React.DragEvent, targetStage: 'new' | 'proc' | 'done') => {
    e.preventDefault()
    setDragOverStage(null)
    const dealIdStr = e.dataTransfer.getData('text/plain')
    const id = parseInt(dealIdStr, 10) || draggedDealId
    if (id) {
      moveDealToStage(id, targetStage)
      setDraggedDealId(null)
    }
  }

  // ==========================================
  // 3. REAL-TIME MONITORING & LOAD SIMULATOR
  // ==========================================
  const [loadLevel, setLoadLevel] = useState<'normal' | 'peak' | 'stress'>('peak')
  const [selectedRegion, setSelectedRegion] = useState<'msk' | 'fra' | 'tas' | 'nyc'>('msk')
  const [isDdosTesting, setIsDdosTesting] = useState(false)
  const [metricsHistory, setMetricsHistory] = useState<number[]>([
    12000, 14500, 13800, 15200, 14900, 16100, 15800, 14200, 16500, 17100, 16800, 17500, 18000, 17200, 17900,
  ])

  const REGIONS = [
    { id: 'msk', nameRu: 'Москва (RU)', nameEn: 'Moscow (RU)', basePing: 4 },
    { id: 'fra', nameRu: 'Франкфурт (EU)', nameEn: 'Frankfurt (EU)', basePing: 19 },
    { id: 'tas', nameRu: 'Ташкент (UZ)', nameEn: 'Tashkent (UZ)', basePing: 26 },
    { id: 'nyc', nameRu: 'Нью-Йорк (US)', nameEn: 'New York (US)', basePing: 84 },
  ]

  const [metrics, setMetrics] = useState({
    rps: 14200,
    latency: 18.2,
    cpu: 42,
    pods: 8,
    activeSockets: 3240,
  })

  const [logs, setLogs] = useState<string[]>([
    '[00:00:01] [API Gateway] Rate-limiter: 0 blocked requests',
    '[00:00:02] [K8s Autoscaler] HPA target CPU load: 45% (Nominal)',
    '[00:00:03] [Redis Cluster] Cache hit ratio: 98.4%',
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      const pingModifier = REGIONS.find((r) => r.id === selectedRegion)?.basePing || 4
      const targetRps =
        isDdosTesting ? 142000 : loadLevel === 'normal' ? 2400 : loadLevel === 'peak' ? 24800 : 98500
      const targetPods = isDdosTesting ? 48 : loadLevel === 'normal' ? 4 : loadLevel === 'peak' ? 12 : 36
      const targetCpu = isDdosTesting ? 98 : loadLevel === 'normal' ? 28 : loadLevel === 'peak' ? 62 : 91
      const targetLatency =
        (loadLevel === 'normal' ? 8.4 : loadLevel === 'peak' ? 14.8 : 28.2) + pingModifier * 0.5

      const currentRps = Math.round(targetRps + (Math.random() * 800 - 400))
      setMetrics({
        rps: currentRps,
        latency: Number((targetLatency + (Math.random() * 2 - 1)).toFixed(1)),
        cpu: Math.min(99, Math.max(15, Math.round(targetCpu + (Math.random() * 6 - 3)))),
        pods: targetPods,
        activeSockets: Math.round(currentRps * 0.25 + Math.random() * 200),
      })

      setMetricsHistory((prev) => [...prev.slice(1), currentRps])

      const timestamp = new Date().toLocaleTimeString()
      let logLine = ''
      if (isDdosTesting) {
        logLine =
          lang === 'ru'
            ? `[${timestamp}] ⚡ K8s Самовосстановление: Нода node-04 перезапущена за 280мс. (0 потерянных запросов)`
            : `[${timestamp}] ⚡ K8s Self-Healing: Pod node-04 auto-rescheduled in 280ms. (0 dropped requests)`
      } else if (loadLevel === 'stress') {
        logLine =
          lang === 'ru'
            ? `[${timestamp}] [K8s Автомасштабирование] ⚡ Кластер расширен до ${targetPods} подов (Всплеск трафика)`
            : `[${timestamp}] [K8s Autoscaler] ⚡ Auto-scaled cluster to ${targetPods} pods (Traffic spike detected)`
      } else if (loadLevel === 'peak') {
        logLine =
          lang === 'ru'
            ? `[${timestamp}] [1С Синхронизация] 🔄 Пакет из 420 событий synchronized via RabbitMQ (< 15мс)`
            : `[${timestamp}] [1C Sync Engine] 🔄 420 events batch synchronized via RabbitMQ (< 15ms)`
      } else {
        logLine =
          lang === 'ru'
            ? `[${timestamp}] [Postgres БД] ✅ Основная реплика чтения исправна (Пул подключений: 12%)`
            : `[${timestamp}] [Postgres DB] ✅ Primary Read Replica healthy (Connection pool: 12%)`
      }

      setLogs((prev) => [logLine, ...prev.slice(0, 4)])
    }, 1200)

    return () => clearInterval(interval)
  }, [loadLevel, selectedRegion, isDdosTesting, lang])

  const handleSimulateDdos = () => {
    setIsDdosTesting(true)
    setLoadLevel('stress')
    showToast(
      lang === 'ru'
        ? '🔥 Имитация DDoS-атаки (140,000 RPS). K8s Self-Healing запущен!'
        : '🔥 Simulated 140k RPS DDoS attack! K8s Self-Healing active!',
      '🔥',
      'border-red-500/60 bg-red-500/20 text-red-300 font-bold'
    )
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [
      lang === 'ru'
        ? `[${timestamp}] ⚠️ ТРЕВОГА: Всплеск трафика +850%! Загрузка CPU достигла 98%`
        : `[${timestamp}] ⚠️ ALERT: Traffic surge +850%! CPU load reached 98%`,
      lang === 'ru'
        ? `[${timestamp}] ⚡ K8s Автомасштабирование: Масштабирование кластера с 12 до 48 подов (< 350мс)`
        : `[${timestamp}] ⚡ K8s Autoscaler: Scaling cluster from 12 to 48 pods (< 350ms)`,
      lang === 'ru'
        ? `[${timestamp}] 🛡️ Cloudflare Rate-Limiter: Заблокировано 14 200 вредоносных IP`
        : `[${timestamp}] 🛡️ Cloudflare Rate-Limiter: 14,200 malicious IPs throttled`,
      ...prev,
    ])

    setTimeout(() => {
      setIsDdosTesting(false)
      showToast(
        lang === 'ru' ? '✅ Атака отражена! Кластер самовосстановился за 350мс.' : '✅ Attack mitigated! Cluster self-healed in 350ms.',
        '🛡️',
        'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 font-bold'
      )
    }, 4500)
  }

  // ==========================================
  // 4. EVENT BUS & API INTEGRATIONS (NEW TAB)
  // ==========================================
  const [selectedBusNode, setSelectedBusNode] = useState<'next' | 'rabbitmq' | '1c' | 'telegram' | 'db'>('rabbitmq')

  const BUS_NODES = [
    {
      id: 'next' as const,
      title: 'Next.js 15 Edge App',
      icon: Layers,
      typeRu: 'Фронтенд Edge',
      typeEn: 'Frontend Edge',
      statusRu: '200 OK (3мс)',
      statusEn: '200 OK (3ms)',
      descriptionRu: 'Генерирует клиентские события, формы заказов и фильтрации каталога.',
      descriptionEn: 'Generates client orders, catalog filters and interactive events.',
      json: `{\n  "event": "CLIENT_CHECKOUT",\n  "client": "ООО МедЛайн",\n  "amount": 890000,\n  "timestamp": "${new Date().toISOString()}"\n}`,
    },
    {
      id: 'rabbitmq' as const,
      title: 'RabbitMQ Event Bus',
      icon: Zap,
      typeRu: 'Шина событий',
      typeEn: 'Event Bus',
      statusRu: 'Очередь: без задержки',
      statusEn: 'Queue: 0 delay',
      descriptionRu: 'Отказоустойчивая шина. Гарантирует доставку 100% данных без потерь даже при оффлайне 1С.',
      descriptionEn: 'Decoupled message broker guaranteeing zero data loss during peak loads.',
      json: `{\n  "broker": "RabbitMQCluster_v3",\n  "exchange": "enterprise_events",\n  "routingKey": "order.created",\n  "deliveryAck": true\n}`,
    },
    {
      id: '1c' as const,
      title: '1С:Предприятие 8.3',
      icon: Server,
      typeRu: 'Ядро ERP',
      typeEn: 'ERP Core',
      statusRu: '1С OData Синхро',
      statusEn: '1C OData Sync',
      descriptionRu: 'Автоматически регистрирует заказы, выставляет счета и списывает остатки на складе.',
      descriptionEn: 'Auto-generates 1C ERP invoices, syncs stock levels and contracts.',
      json: `{\n  "1C_Document": "СчетНаОплату_№48291",\n  "status": "Выставлен",\n  "contract": "Оферта №8812",\n  "syncTimeMs": 14\n}`,
    },
    {
      id: 'telegram' as const,
      title: 'Telegram Client Bot',
      icon: Send,
      typeRu: 'Бот уведомлений',
      typeEn: 'Bot Notification',
      statusRu: 'Вебхуки активны',
      statusEn: 'Webhooks Active',
      descriptionRu: 'Моментально отправляет Push-уведомление руководителю и менеджеру в Telegram.',
      descriptionEn: 'Sends real-time high-priority deal notifications directly to Telegram.',
      json: `{\n  "chatId": "@av_management",\n  "text": "⚡ Новая оплата 1С: 890,000 ₽! Акт отправлен на email.",\n  "delivered": true\n}`,
    },
    {
      id: 'db' as const,
      title: 'PostgreSQL & Redis',
      icon: Database,
      typeRu: 'Хранилище данных',
      typeEn: 'Persistent Storage',
      statusRu: 'Реплика чтения активна',
      statusEn: 'Read Replica Live',
      descriptionRu: 'Партиционированная реляционная БД с репликацией и Redis-кэшем (< 2ms).',
      descriptionEn: 'Partitioned relational database cluster with Redis edge cache (< 2ms).',
      json: `{\n  "db": "PostgreSQL_16_Primary",\n  "connections": 42,\n  "cacheHitRatio": "98.8%",\n  "replicaLagMs": 1\n}`,
    },
  ]

  // Render helper for SVG sparkline graph
  const maxMetric = Math.max(...metricsHistory, 150000)
  const svgPoints = metricsHistory
    .map((val, idx) => {
      const x = (idx / (metricsHistory.length - 1)) * 300
      const y = 80 - (val / maxMetric) * 70
      return `${x},${y}`
    })
    .join(' ')

  return (
    <>
      <Rail left={lang === 'ru' ? 'ИНТЕРАКТИВНАЯ ПЕСОЧНИЦА' : 'LIVE DEMO SANDBOX'} right="AV / LIVE INTERACTION" />

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-24 right-6 z-50 p-4 rounded-2xl border ${toast.bg} shadow-2xl backdrop-blur-xl flex items-center gap-3 max-w-sm`}
          >
            <span className="text-xl">{toast.icon}</span>
            <div className="text-xs font-mono-tech leading-snug">{toast.text}</div>
            <button onClick={() => setToast(null)} className="ml-auto text-dim hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Section id="sandbox" className="pt-16 md:pt-24">
        <SectionHead
          eyebrow={lang === 'ru' ? 'Потрогать вживую' : 'Interactive Sandbox'}
          title={
            lang === 'ru'
              ? 'Протестируйте AI, Drag-and-Drop, Мониторинг и 1С Event Bus вживую'
              : 'Test Live Neural AI, DnD CRM Kanban, Cluster Monitoring & 1C Event Bus'
          }
          sub={
            lang === 'ru'
              ? 'Интерактивный ИИ-Архитектор, создание и перетаскивание сделок, симуляция DDoS-атаки и живая шина событий 1С.'
              : 'Chat with live Neural AI, drag & drop deals, simulate 100k RPS DDoS spikes, and inspect real-time 1C webhooks.'
          }
        />

        {/* Tab Selector */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex flex-wrap gap-2 p-1.5 rounded-2xl border border-line bg-[hsl(var(--av-bg-panel))] shadow-xl justify-center">
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-semibold text-xs md:text-sm transition-all ${
                activeTab === 'ai'
                  ? 'bg-[hsl(var(--av-accent))] text-black shadow-md shadow-[hsl(var(--av-accent-glow))]'
                  : 'text-dim hover:text-foreground'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>{lang === 'ru' ? '1. Живой ИИ-Чат' : '1. Neural AI Live'}</span>
            </button>

            <button
              onClick={() => setActiveTab('crm')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-semibold text-xs md:text-sm transition-all ${
                activeTab === 'crm'
                  ? 'bg-[hsl(var(--av-accent))] text-black shadow-md shadow-[hsl(var(--av-accent-glow))]'
                  : 'text-dim hover:text-foreground'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>{lang === 'ru' ? '2. CRM Канбан & 1С' : '2. Real DnD CRM'}</span>
            </button>

            <button
              onClick={() => setActiveTab('monitor')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-semibold text-xs md:text-sm transition-all ${
                activeTab === 'monitor'
                  ? 'bg-[hsl(var(--av-accent))] text-black shadow-md shadow-[hsl(var(--av-accent-glow))]'
                  : 'text-dim hover:text-foreground'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>{lang === 'ru' ? '3. Мониторинг & DDoS' : '3. Load & DDoS Simulator'}</span>
            </button>

            <button
              onClick={() => setActiveTab('bus')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-semibold text-xs md:text-sm transition-all ${
                activeTab === 'bus'
                  ? 'bg-[hsl(var(--av-accent))] text-black shadow-md shadow-[hsl(var(--av-accent-glow))]'
                  : 'text-dim hover:text-foreground'
              }`}
            >
              <Network className="w-4 h-4" />
              <span>{lang === 'ru' ? '4. 1С & Event Bus' : '4. 1C & Event Bus'}</span>
            </button>
          </div>
        </div>

        {/* Sandbox Panel */}
        <div className="mt-8 rounded-3xl border border-[hsl(var(--av-accent)/0.3)] bg-[hsl(var(--av-bg-panel)/0.9)] p-6 md:p-8 backdrop-blur-2xl shadow-2xl relative min-h-[480px]">
          <AnimatePresence mode="wait">
            {/* ================= TAB 1: REAL AI CHAT WITH STREAMING ================= */}
            {activeTab === 'ai' && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-line pb-3.5 gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[hsl(var(--av-accent-soft))] border border-[hsl(var(--av-accent)/0.4)] flex items-center justify-center text-[hsl(var(--av-accent))] shadow-inner">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-xs sm:text-sm text-foreground flex items-center gap-2">
                        <span>{lang === 'ru' ? 'Консультация с ИИ-Архитектором' : 'AI Architect Consultation'}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono-tech text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          OpenRouter AI
                        </span>
                      </div>
                      <div className="text-[11px] font-mono-tech text-faint">
                        {lang === 'ru'
                          ? 'Интерактивный анализ стека, интеграций 1С и сроков реализации'
                          : 'Interactive analysis of stack, 1C sync & timelines'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Message Stream Box */}
                <div
                  ref={chatScrollRef}
                  data-lenis-prevent
                  onWheel={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  className="rounded-2xl border border-line bg-[hsl(var(--av-bg))] p-4 sm:p-5 h-[380px] md:h-[430px] overflow-y-auto space-y-4 custom-scrollbar-y overscroll-contain"
                >
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      {m.sender === 'user' ? (
                        <div className="flex flex-col items-end space-y-1 max-w-[85%] sm:max-w-[75%]">
                          <span className="text-[10px] font-mono-tech text-faint uppercase font-bold tracking-wider">
                            {lang === 'ru' ? 'Вы' : 'You'}
                          </span>
                          <div className="p-3.5 sm:p-4 rounded-2xl rounded-tr-none bg-[hsl(var(--av-accent))] text-black font-sans font-bold text-xs sm:text-sm shadow-md leading-relaxed">
                            {m.text}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2.5 max-w-[95%] sm:max-w-[88%]">
                          <div className="w-7 h-7 rounded-lg bg-[hsl(var(--av-accent-soft))] border border-[hsl(var(--av-accent)/0.4)] flex items-center justify-center text-[hsl(var(--av-accent))] text-xs font-mono-tech font-bold shrink-0 mt-5">
                            AI
                          </div>
                          <div className="flex flex-col items-start space-y-1 flex-1 min-w-0">
                            <span className="text-[10px] font-mono-tech text-dim uppercase font-bold tracking-wider">
                              {lang === 'ru' ? 'ИИ-Архитектор AV Studio' : 'AV Studio AI Architect'}
                            </span>
                            <div className="p-3.5 sm:p-4 rounded-2xl rounded-tl-none bg-[hsl(var(--av-bg-panel))] border border-line text-foreground text-xs sm:text-sm shadow-lg leading-relaxed w-full">
                              {m.isNew ? (
                                <TypewriterMarkdown content={m.text} />
                              ) : (
                                <FormattedMarkdown content={m.text} className="text-xs sm:text-sm" />
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Real-time AI Query Processing Indicator */}
                  {isThinking && (
                    <div className="p-3.5 rounded-2xl border border-[hsl(var(--av-accent)/0.35)] bg-[hsl(var(--av-accent-soft))] space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono-tech text-[hsl(var(--av-accent))] font-bold">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 animate-spin text-[hsl(var(--av-accent))]" />
                          <span>
                            {lang === 'ru'
                              ? 'Запрос обрабатывается ИИ-Архитектором...'
                              : 'AI Architect is formulating response...'}
                          </span>
                        </div>
                        <span className="bg-[hsl(var(--av-bg))] px-2.5 py-0.5 rounded-md border border-line text-[11px] font-mono-tech text-emerald-400">
                          {elapsedSeconds.toFixed(1)}s
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-[hsl(var(--av-bg))] rounded-full overflow-hidden relative">
                        <div className="h-full bg-gradient-to-r from-[hsl(var(--av-accent))] via-amber-400 to-[hsl(var(--av-accent))] animate-pulse w-full rounded-full" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Interactive Preset Prompts */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono-tech uppercase text-faint flex items-center gap-1.5 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--av-accent))]" />
                    <span>{lang === 'ru' ? 'Быстрые вопросы для тестирования:' : 'Quick Prompts:'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_PROMPTS.map((item, idx) => (
                      <button
                        key={idx}
                        disabled={isThinking}
                        onClick={() => handleSendAi(lang === 'ru' ? item.textRu : item.textEn)}
                        className="px-3 py-1.5 rounded-xl border border-line bg-[hsl(var(--av-bg))] text-[11px] font-mono-tech text-dim hover:text-foreground hover:border-[hsl(var(--av-accent))] transition-all text-left flex items-center gap-1.5"
                      >
                        <span className="text-[hsl(var(--av-accent))] font-bold">
                          [{lang === 'ru' ? item.tagRu : item.tagEn}]
                        </span>
                        <span>{lang === 'ru' ? item.textRu : item.textEn}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendAi()
                  }}
                  className="flex gap-2 pt-1"
                >
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder={
                      lang === 'ru'
                        ? 'Спросите у нейросети всё, что угодно о проекте...'
                        : 'Ask Neural AI anything about your project requirements...'
                    }
                    className="flex-1 px-4 py-3.5 rounded-xl border border-line bg-[hsl(var(--av-bg))] text-xs sm:text-sm text-foreground focus:outline-none focus:border-[hsl(var(--av-accent))] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isThinking || !inputVal.trim()}
                    className="px-6 py-3.5 rounded-xl bg-[hsl(var(--av-accent))] text-black font-bold text-xs font-mono-tech uppercase flex items-center gap-2 hover:shadow-[0_0_24px_hsl(var(--av-accent-glow))] transition-all disabled:opacity-50"
                  >
                    <span>{lang === 'ru' ? 'Спросить ИИ' : 'Send Prompt'}</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}

            {/* ================= TAB 2: REAL DRAG AND DROP KANBAN ================= */}
            {activeTab === 'crm' && (
              <motion.div
                key="crm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-line pb-3 gap-3">
                  <div className="flex items-center gap-2 text-foreground font-semibold text-xs sm:text-sm">
                    <LayoutGrid className="w-4 h-4 text-[hsl(var(--av-accent))]" />
                    <span>
                      {lang === 'ru'
                        ? 'Перетаскивайте сделки для симуляции синхронизации с 1С и Telegram'
                        : 'Drag & Drop deal cards between pipeline columns to trigger 1C sync'}
                    </span>
                  </div>

                  <button
                    onClick={() => setShowAddDealForm(!showAddDealForm)}
                    className="px-3 py-1.5 rounded-xl border border-[hsl(var(--av-accent)/0.5)] bg-[hsl(var(--av-accent-soft))] text-[hsl(var(--av-accent))] text-xs font-mono-tech font-bold flex items-center gap-1.5 hover:bg-[hsl(var(--av-accent))] hover:text-black transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{lang === 'ru' ? '+ Создать сделку' : '+ Add Test Deal'}</span>
                  </button>
                </div>

                {/* Inline Deal Add Form */}
                <AnimatePresence>
                  {showAddDealForm && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleAddDealSubmit}
                      className="p-4 rounded-2xl border border-[hsl(var(--av-accent)/0.4)] bg-[hsl(var(--av-bg))] space-y-3 overflow-hidden"
                    >
                      <div className="text-xs font-bold text-[hsl(var(--av-accent))] flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{lang === 'ru' ? 'Добавление новой тестовой сделки' : 'Add New Test Deal'}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          required
                          placeholder={lang === 'ru' ? 'Название компании (напр. ООО "Гарант")' : 'Company Name'}
                          value={newClientName}
                          onChange={(e) => setNewClientName(e.target.value)}
                          className="px-3 py-2 rounded-xl border border-line bg-[hsl(var(--av-bg-panel))] text-xs text-foreground focus:outline-none focus:border-[hsl(var(--av-accent))]"
                        />
                        <input
                          type="text"
                          required
                          placeholder={lang === 'ru' ? 'Сумма (напр. 1 200 000 ₽)' : 'Deal Amount'}
                          value={newClientAmount}
                          onChange={(e) => setNewClientAmount(e.target.value)}
                          className="px-3 py-2 rounded-xl border border-line bg-[hsl(var(--av-bg-panel))] text-xs text-foreground focus:outline-none focus:border-[hsl(var(--av-accent))]"
                        />
                        <select
                          value={newClientTag}
                          onChange={(e) => setNewClientTag(e.target.value)}
                          className="px-3 py-2 rounded-xl border border-line bg-[hsl(var(--av-bg-panel))] text-xs text-foreground focus:outline-none focus:border-[hsl(var(--av-accent))]"
                        >
                          <option value="B2B Portal">B2B Portal</option>
                          <option value="CRM & App">CRM & App</option>
                          <option value="AI Agent">AI Agent</option>
                          <option value="1C Sync">1C Sync</option>
                          <option value="Enterprise">Enterprise</option>
                        </select>
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowAddDealForm(false)}
                          className="px-3 py-1.5 rounded-lg border border-line text-xs font-mono-tech text-dim hover:text-foreground"
                        >
                          {lang === 'ru' ? 'Отмена' : 'Cancel'}
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg bg-[hsl(var(--av-accent))] text-black font-bold text-xs font-mono-tech uppercase shadow-md"
                        >
                          {lang === 'ru' ? 'Добавить в CRM' : 'Create Deal'}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="grid md:grid-cols-3 gap-4">
                  {/* Column 1: New */}
                  <div
                    onDragOver={(e) => handleDragOver(e, 'new')}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'new')}
                    className={`rounded-2xl border p-4 space-y-3 transition-all min-h-[320px] ${
                      dragOverStage === 'new'
                        ? 'border-[hsl(var(--av-accent))] bg-[hsl(var(--av-accent-soft)/0.5)] shadow-lg scale-[1.01]'
                        : 'border-line bg-[hsl(var(--av-bg))]'
                    }`}
                  >
                    <div className="flex flex-col border-b border-line pb-2.5 gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">1. Новый лид</span>
                        <span className="text-[10px] font-mono-tech bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-bold">
                          {deals.filter((d) => d.stage === 'new').length}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono-tech text-emerald-400 font-bold">
                        Итого: {getStageTotal('new')}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {deals
                        .filter((d) => d.stage === 'new')
                        .map((deal) => (
                          <div
                            key={deal.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, deal.id)}
                            className="p-4 rounded-xl border border-line bg-[hsl(var(--av-bg-raise))] hover:border-[hsl(var(--av-accent))] cursor-grab active:cursor-grabbing transition-all space-y-2 group shadow-md"
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-bold text-xs text-foreground group-hover:text-[hsl(var(--av-accent))]">
                                {deal.client}
                              </span>
                              <span className="text-[10px] font-mono-tech text-faint bg-[hsl(var(--av-bg))] px-2 py-0.5 rounded">
                                {deal.tag}
                              </span>
                            </div>
                            <div className="text-xs font-mono-tech text-emerald-400 font-bold">{deal.amount}</div>
                            {deal.updatedAt && (
                              <div className="text-[10px] font-mono-tech text-emerald-400/80">{deal.updatedAt}</div>
                            )}
                            <div className="text-[10px] text-faint flex items-center justify-between pt-2 border-t border-line">
                              <span className="hidden sm:inline flex items-center gap-1 cursor-grab">
                                <span className="text-[hsl(var(--av-accent))]">⣿</span> {lang === 'ru' ? 'Перетащите' : 'Drag'}
                              </span>
                              <button
                                type="button"
                                onClick={() => moveDealToStage(deal.id, 'proc')}
                                className="px-2 py-1 rounded-md bg-[hsl(var(--av-accent-soft))] text-[hsl(var(--av-accent))] font-bold text-[10px] hover:bg-[hsl(var(--av-accent))] hover:text-black transition-all ml-auto"
                              >
                                {lang === 'ru' ? 'Выставить счет →' : 'Move to Proc →'}
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Column 2: In Process */}
                  <div
                    onDragOver={(e) => handleDragOver(e, 'proc')}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'proc')}
                    className={`rounded-2xl border p-4 space-y-3 transition-all min-h-[320px] ${
                      dragOverStage === 'proc'
                        ? 'border-[hsl(var(--av-accent))] bg-[hsl(var(--av-accent-soft)/0.5)] shadow-lg scale-[1.01]'
                        : 'border-line bg-[hsl(var(--av-bg))]'
                    }`}
                  >
                    <div className="flex flex-col border-b border-line pb-2.5 gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">2. 1С Счет выставлен</span>
                        <span className="text-[10px] font-mono-tech bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                          {deals.filter((d) => d.stage === 'proc').length}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono-tech text-amber-400 font-bold">
                        Итого: {getStageTotal('proc')}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {deals
                        .filter((d) => d.stage === 'proc')
                        .map((deal) => (
                          <div
                            key={deal.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, deal.id)}
                            className="p-4 rounded-xl border border-amber-500/30 bg-[hsl(var(--av-bg-raise))] hover:border-[hsl(var(--av-accent))] cursor-grab active:cursor-grabbing transition-all space-y-2 group shadow-md"
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-bold text-xs text-foreground group-hover:text-[hsl(var(--av-accent))]">
                                {deal.client}
                              </span>
                              <span className="text-[10px] font-mono-tech text-faint bg-[hsl(var(--av-bg))] px-2 py-0.5 rounded">
                                {deal.tag}
                              </span>
                            </div>
                            <div className="text-xs font-mono-tech text-amber-400 font-bold">{deal.amount}</div>
                            {deal.updatedAt && (
                              <div className="text-[10px] font-mono-tech text-emerald-400/80">{deal.updatedAt}</div>
                            )}
                            <div className="text-[10px] text-faint flex items-center justify-between pt-2 border-t border-line gap-1">
                              <button
                                type="button"
                                onClick={() => moveDealToStage(deal.id, 'new')}
                                className="px-2 py-1 rounded-md bg-[hsl(var(--av-bg))] text-faint text-[10px] hover:text-foreground"
                              >
                                ← {lang === 'ru' ? 'Назад' : 'Back'}
                              </button>
                              <button
                                type="button"
                                onClick={() => moveDealToStage(deal.id, 'done')}
                                className="px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px] hover:bg-emerald-500 hover:text-black transition-all"
                              >
                                {lang === 'ru' ? '✓ Оплачено' : '✓ Mark Paid'}
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Column 3: Done */}
                  <div
                    onDragOver={(e) => handleDragOver(e, 'done')}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'done')}
                    className={`rounded-2xl border p-4 space-y-3 transition-all min-h-[320px] ${
                      dragOverStage === 'done'
                        ? 'border-emerald-400 bg-emerald-500/10 shadow-lg scale-[1.01]'
                        : 'border-line bg-[hsl(var(--av-bg))]'
                    }`}
                  >
                    <div className="flex flex-col border-b border-line pb-2.5 gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400">3. Успешно закрыто</span>
                        <span className="text-[10px] font-mono-tech bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                          {deals.filter((d) => d.stage === 'done').length}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono-tech text-emerald-400 font-bold">
                        Итого: {getStageTotal('done')}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {deals
                        .filter((d) => d.stage === 'done')
                        .map((deal) => (
                          <div
                            key={deal.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, deal.id)}
                            className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/5 hover:border-[hsl(var(--av-accent))] cursor-grab active:cursor-grabbing transition-all space-y-2 group shadow-md"
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-bold text-xs text-emerald-400">{deal.client}</span>
                              <span className="text-[10px] font-mono-tech text-faint bg-[hsl(var(--av-bg))] px-2 py-0.5 rounded">
                                {deal.tag}
                              </span>
                            </div>
                            <div className="text-xs font-mono-tech text-emerald-400 font-bold">{deal.amount}</div>
                            <div className="text-[10px] text-emerald-400/90 flex items-center justify-between pt-2 border-t border-line">
                              <div className="flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>1С Оплата</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => moveDealToStage(deal.id, 'proc')}
                                className="px-2 py-0.5 rounded bg-[hsl(var(--av-bg))] text-faint hover:text-foreground text-[10px]"
                              >
                                ← {lang === 'ru' ? 'В работу' : 'Reopen'}
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ================= TAB 3: REAL-TIME MONITORING & DDOS SIMULATOR ================= */}
            {activeTab === 'monitor' && (
              <motion.div
                key="monitor"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Controls Bar */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl border border-line bg-[hsl(var(--av-bg))]">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-foreground flex items-center gap-2">
                      <span>{lang === 'ru' ? 'Дашборд нагрузки и K8s Self-Healing' : 'Live Cluster & Stress Dashboard'}</span>
                      {isDdosTesting && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-tech bg-red-500/20 border border-red-500 text-red-400 animate-pulse font-bold">
                          {lang === 'ru' ? '🔥 DDOS АТАКА' : '🔥 DDoS ACTIVE'}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-faint">
                      {lang === 'ru'
                        ? 'Переключайте трафик или спровоцируйте DDoS-атаку для проверки авто-масштабирования'
                        : 'Simulate high RPS traffic or provoke a DDoS attack to test cluster auto-healing'}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                    {/* Traffic Buttons */}
                    <div className="flex gap-1 bg-[hsl(var(--av-bg-panel))] p-1 rounded-xl border border-line">
                      <button
                        onClick={() => setLoadLevel('normal')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech transition-all ${
                          loadLevel === 'normal'
                            ? 'bg-[hsl(var(--av-accent))] text-black font-bold'
                            : 'text-dim hover:text-foreground'
                        }`}
                      >
                        1k RPS
                      </button>
                      <button
                        onClick={() => setLoadLevel('peak')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech transition-all ${
                          loadLevel === 'peak'
                            ? 'bg-amber-400 text-black font-bold'
                            : 'text-dim hover:text-foreground'
                        }`}
                      >
                        25k RPS
                      </button>
                      <button
                        onClick={() => setLoadLevel('stress')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech transition-all ${
                          loadLevel === 'stress' && !isDdosTesting
                            ? 'bg-red-500 text-white font-bold'
                            : 'text-dim hover:text-foreground'
                        }`}
                      >
                        100k RPS
                      </button>
                    </div>

                    {/* DDoS Test Trigger Button */}
                    <button
                      onClick={handleSimulateDdos}
                      disabled={isDdosTesting}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white font-mono-tech text-xs font-bold uppercase flex items-center gap-1.5 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all disabled:opacity-50"
                    >
                      <Flame className="w-4 h-4 animate-bounce text-yellow-300" />
                      <span>{lang === 'ru' ? '🔥 ТЕСТ DDOS (140k)' : '🔥 DDOS TEST'}</span>
                    </button>
                  </div>
                </div>

                {/* Region Selector */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[hsl(var(--av-bg-panel))] p-3 rounded-2xl border border-line text-xs font-mono-tech gap-2.5">
                  <span className="text-dim flex items-center gap-1.5 font-bold">
                    <Globe className="w-4 h-4 text-[hsl(var(--av-accent))]" />
                    <span>{lang === 'ru' ? 'Выбор CDN Edge узла:' : 'CDN Edge Location:'}</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {REGIONS.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setSelectedRegion(r.id as any)}
                        className={`px-2.5 py-1 rounded-lg border transition-all text-xs ${
                          selectedRegion === r.id
                            ? 'border-[hsl(var(--av-accent))] bg-[hsl(var(--av-accent-soft))] text-[hsl(var(--av-accent))] font-bold'
                            : 'border-line text-faint hover:text-foreground'
                        }`}
                      >
                        {lang === 'ru' ? r.nameRu : r.nameEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live SVG Graph & Metrics Grid */}
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="md:col-span-2 p-4 rounded-2xl border border-line bg-[hsl(var(--av-bg))] space-y-3 relative overflow-hidden flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                      <div className="text-[10px] font-mono-tech text-faint uppercase font-bold">
                        {lang === 'ru' ? 'Живой график RPS (Поток Grafana)' : 'Live RPS Stream (Grafana)'}
                      </div>
                      <div className="text-[10px] text-emerald-400 font-mono-tech flex items-center gap-1 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        {metrics.rps.toLocaleString()} RPS
                      </div>
                    </div>

                    {/* SVG Sparkline Chart */}
                    <div className="h-20 w-full relative pt-2">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--av-accent))" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="hsl(var(--av-accent))" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <polygon points={`0,80 ${svgPoints} 300,80`} fill="url(#chartGrad)" />
                        <polyline
                          fill="none"
                          stroke="hsl(var(--av-accent))"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={svgPoints}
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-line bg-[hsl(var(--av-bg))] space-y-1">
                    <div className="text-[10px] font-mono-tech text-faint uppercase">p99 Задержка API</div>
                    <div className="text-2xl font-display font-extrabold text-emerald-400 font-mono-tech">
                      {metrics.latency} {lang === 'ru' ? 'мс' : 'ms'}
                    </div>
                    <div className="text-[10px] text-faint font-mono-tech">
                      CDN Edge ({REGIONS.find((r) => r.id === selectedRegion)?.basePing}{lang === 'ru' ? 'мс базовый пинг' : 'ms base ping'})
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-line bg-[hsl(var(--av-bg))] space-y-1">
                    <div className="text-[10px] font-mono-tech text-faint uppercase">Загрузка CPU / K8s Pods</div>
                    <div className="text-2xl font-display font-extrabold text-[hsl(var(--av-accent))] font-mono-tech">
                      {metrics.cpu}% ({metrics.pods} подов)
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono-tech">
                      {lang === 'ru' ? 'HPA Автомасштабирование активно' : 'HPA Autoscaler Active'}
                    </div>
                  </div>
                </div>

                {/* Console Log Stream */}
                <div className="rounded-2xl border border-line bg-[hsl(var(--av-bg))] p-4 font-mono-tech text-xs space-y-2">
                  <div className="flex items-center justify-between border-b border-line pb-2 text-faint text-[10px]">
                    <span className="flex items-center gap-1.5 text-foreground font-bold">
                      <Server className="w-3.5 h-3.5 text-[hsl(var(--av-accent))]" />
                      {lang === 'ru' ? 'ПОТОК ЛОГОВ КЛАСТЕРА В РЕАЛЬНОМ ВРЕМЕНИ' : 'LIVE CLUSTER LOG STREAM'}
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {lang === 'ru' ? 'SLA 99.99% АКТИВЕН' : '99.99% SLA ACTIVE'}
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px]">
                    {logs.map((log, i) => (
                      <div
                        key={i}
                        className={`${
                          log.includes('ALERT') || log.includes('ТРЕВОГА') || log.includes('⚡ K8s Self-Healing') || log.includes('Самовосстановление')
                            ? 'text-amber-400 font-bold'
                            : log.includes('🔄')
                            ? 'text-[hsl(var(--av-accent))]'
                            : 'text-dim'
                        }`}
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ================= TAB 4: 1C & EVENT BUS INTEGRATIONS (NEW) ================= */}
            {activeTab === 'bus' && (
              <motion.div
                key="bus"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-line pb-3 gap-2">
                  <div>
                    <div className="text-xs font-bold text-foreground flex items-center gap-2">
                      <Network className="w-4 h-4 text-[hsl(var(--av-accent))]" />
                      <span>{lang === 'ru' ? 'Шина событий и архитектура 1С Интеграции' : 'Event Bus & 1C Sync Topology'}</span>
                    </div>
                    <div className="text-[11px] text-faint">
                      {lang === 'ru'
                        ? 'Кликните по узлу системы, чтобы проверить вебхуки и структуры JSON-транзакций'
                        : 'Click on any node to inspect webhooks and real-time JSON transaction payloads'}
                    </div>
                  </div>

                  <span className="text-[10px] font-mono-tech text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 font-bold">
                    {lang === 'ru' ? 'ШИНА СОБЫТИЙ RABBITMQ АКТИВНА' : 'RABBITMQ EVENT BUS LIVE'}
                  </span>
                </div>

                {/* Interactive Network Graph Cards */}
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {BUS_NODES.map((node) => {
                    const IconComp = node.icon
                    const isSelected = selectedBusNode === node.id
                    return (
                      <button
                        key={node.id}
                        onClick={() => setSelectedBusNode(node.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden space-y-2 ${
                          isSelected
                            ? 'border-[hsl(var(--av-accent))] bg-[hsl(var(--av-accent-soft))] shadow-lg shadow-[hsl(var(--av-accent-glow))/0.2] scale-[1.02]'
                            : 'border-line bg-[hsl(var(--av-bg))] hover:border-foreground/30'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                              isSelected
                                ? 'bg-[hsl(var(--av-accent))] text-black'
                                : 'bg-[hsl(var(--av-bg-panel))] text-[hsl(var(--av-accent))]'
                            }`}
                          >
                            <IconComp className="w-4 h-4" />
                          </div>
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-foreground truncate">{node.title}</div>
                          <div className="text-[10px] font-mono-tech text-faint">
                            {lang === 'ru' ? node.typeRu : node.typeEn}
                          </div>
                        </div>
                        <div className="text-[10px] font-mono-tech text-emerald-400 font-bold truncate">
                          {lang === 'ru' ? node.statusRu : node.statusEn}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Selected Node Details & Live JSON Viewer */}
                {selectedBusNode && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl border border-line bg-[hsl(var(--av-bg))] space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-mono-tech text-[hsl(var(--av-accent))] uppercase font-bold tracking-wider">
                          {lang === 'ru' ? 'Узел:' : 'Node:'} {BUS_NODES.find((n) => n.id === selectedBusNode)?.title}
                        </div>
                        <div className="text-sm font-bold text-foreground mt-1">
                          {lang === 'ru'
                            ? BUS_NODES.find((n) => n.id === selectedBusNode)?.typeRu
                            : BUS_NODES.find((n) => n.id === selectedBusNode)?.typeEn}
                        </div>
                        <p className="text-xs text-dim leading-relaxed mt-2">
                          {lang === 'ru'
                            ? BUS_NODES.find((n) => n.id === selectedBusNode)?.descriptionRu
                            : BUS_NODES.find((n) => n.id === selectedBusNode)?.descriptionEn}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-[hsl(var(--av-bg-panel))] border border-line space-y-1 text-xs font-mono-tech">
                        <div className="text-[10px] text-faint uppercase font-bold">
                          {lang === 'ru' ? 'Гарантия отказоустойчивости:' : 'Fault Tolerance Guarantee:'}
                        </div>
                        <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>
                            {lang === 'ru'
                              ? '100% Доставка данных (Гарантия без потерь)'
                              : '100% Data Delivery (Zero Loss Guarantee)'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Live JSON Payload Inspector */}
                    <div className="p-4 rounded-2xl border border-line bg-[hsl(var(--av-bg))] space-y-2 font-mono-tech">
                      <div className="flex justify-between items-center border-b border-line pb-2 text-[10px]">
                        <span className="text-foreground font-bold flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-[hsl(var(--av-accent))]" />
                          {lang === 'ru' ? 'JSON PAYLOAD ВЕБХУКА В РЕАЛЬНОМ ВРЕМЕНИ' : 'LIVE JSON WEBHOOK PAYLOAD'}
                        </span>
                        <span className="text-emerald-400">
                          {lang === 'ru' ? 'ПОДТВЕРЖДЕНО (ACK)' : 'ACKNOWLEDGED'}
                        </span>
                      </div>
                      <pre className="text-[11px] text-[hsl(var(--av-accent))] bg-[hsl(var(--av-bg-panel))] p-3.5 rounded-xl border border-line overflow-x-auto leading-relaxed">
                        {BUS_NODES.find((n) => n.id === selectedBusNode)?.json}
                      </pre>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Section>
    </>
  )
}
