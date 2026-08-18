'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../i18n'
import { useOrderModal } from '../context/ModalContext'

interface Message {
  id: string
  sender: 'ai' | 'user'
  text: string
  suggestOrder?: boolean
  serviceHint?: string
}

const KNOWLEDGE_BASE = [
  {
    keywords: ['ai', 'ии', 'агент', 'rag', 'mcp', 'нейросет', 'автоматизац'],
    answerRu: 'AV разрабатывает производственные AI-системы: AI Agents, RAG на базе корпоративных данных, Guardrails, Agent Harness и автоматизацию процессов. Внедряем LLM в CRM, бухгалтерию и поддержку.',
    answerEn: 'AV builds production AI systems: AI Agents, Enterprise RAG, Guardrails, Agent Harness, and automated workflows integrated into your CRM and business stack.',
    service: 'AI & Automation',
  },
  {
    keywords: ['стоимость', 'цена', 'сколько стоит', 'бюджет', 'price', 'cost'],
    answerRu: 'Стоимость зависит от масштаба: лендинги и MVP — от 250-400k ₽; CRM и B2B-порталы — от 800k ₽; сложная Enterprise-архитектура и AI-контуры — от 1.5M ₽. Рассчитать точный КП можно в 1 клик!',
    answerEn: 'Pricing depends on scope: Web & MVP from $3k-$5k; CRM & B2B portals from $9k+; Enterprise & AI systems from $18k+. We can prepare a detailed quote for you!',
    service: 'Full Cycle',
  },
  {
    keywords: ['crm', '1с', 'склад', 'учет', 'система', 'бизнес'],
    answerRu: 'Мы проектируем индивидуальные CRM под бизнес-процессы клиентов: личные кабинеты, учет заказов, интеграция с 1С, МойСклад, Ozon, Wildberries и аналитика.',
    answerEn: 'We design custom CRM and ERP systems tailored to your business model with seamless 1C, warehouse, marketplace, and payment integrations.',
    service: 'CRM & Business Systems',
  },
  {
    keywords: ['сроки', 'время', 'быстро', 'timeline', 'days', 'weeks'],
    answerRu: 'MVP запускаем за 4–8 недель. Сложные веб-сервисы и CRM — 2–4 месяца. Используем гибкий итеративный подход с показами каждые 2 недели.',
    answerEn: 'MVPs are launched in 4–8 weeks. Enterprise CRM & SaaS products take 2–4 months with bi-weekly demo releases.',
    service: 'SaaS & Product Dev',
  },
]

const STORAGE_KEY = 'av_ai_chat_history_v1'

export default function AiAssistantWidget() {
  const { lang } = useLang()
  const { openOrderModal } = useOrderModal()
  const [isOpen, setIsOpen] = useState(false)
  const widgetRef = useRef<HTMLDivElement>(null)

  const defaultMessages = (): Message[] => [
    {
      id: 'default_1',
      sender: 'ai',
      text:
        lang === 'ru'
          ? 'Привет! Я AI-ассистент AV Studio. Подсказать по услугам, стеку, срокам или стоимости проекта?'
          : 'Hello! I am the AV Studio AI Assistant. Need info on our stack, pricing, or timelines?',
    },
  ]

  // Main Page Scroll Locking Helpers
  const lockMainScroll = () => {
    document.documentElement.classList.add('lenis-stopped')
    document.body.style.overflow = 'hidden'
  }

  const unlockMainScroll = () => {
    document.documentElement.classList.remove('lenis-stopped')
    document.body.style.overflow = ''
  }

  // Persistent Chat State
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) return parsed
        }
      } catch {
        // quiet fallback
      }
    }
    return defaultMessages()
  })

  const [input, setInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Save messages to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
      } catch {
        // quiet fallback
      }
    }
  }, [messages])

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  // Close on Click Outside & unlock scroll on unmount/close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (isOpen && widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        handleClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      unlockMainScroll()
    }
  }, [isOpen])

  const handleClose = () => {
    unlockMainScroll()
    setIsOpen(false)
  }

  const handleSend = (userText: string) => {
    if (!userText.trim()) return

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: userText.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    setTimeout(() => {
      const lower = userText.toLowerCase()
      const match = KNOWLEDGE_BASE.find((k) => k.keywords.some((w) => lower.includes(w)))

      let replyText = ''
      let serviceHint = 'Full Cycle'

      if (match) {
        replyText = lang === 'ru' ? match.answerRu : match.answerEn
        serviceHint = match.service
      } else {
        replyText =
          lang === 'ru'
            ? 'Мы разрабатываем сайты, e-commerce, CRM, SaaS и AI-системы под ключ. Вы можете оставить заявку, и наш архитектор обсудит детали вашего проекта!'
            : 'We engineer full-cycle websites, e-commerce, CRM, SaaS, and AI systems. Feel free to request a project consultation with our architect!';
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        suggestOrder: true,
        serviceHint,
      }

      setMessages((prev) => [...prev, aiMsg])
    }, 350)
  }

  const clearHistory = () => {
    const initial = defaultMessages()
    setMessages(initial)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error(e)
    }
  }

  const quickPrompts =
    lang === 'ru'
      ? ['Какие AI-системы делаете?', 'Сроки разработки MVP?', 'Сколько стоит CRM?']
      : ['What AI systems do you build?', 'MVP timelines?', 'CRM pricing?']

  return (
    <div ref={widgetRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={lockMainScroll}
            onMouseLeave={unlockMainScroll}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="w-[92vw] sm:w-[380px] h-[520px] rounded-2xl border border-[hsl(var(--av-line-strong))] bg-[hsl(var(--av-bg-raise))] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3.5 border-b border-line bg-[hsl(var(--av-bg-panel))] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full bg-[hsl(var(--av-accent-soft))] border border-[hsl(var(--av-accent))] flex items-center justify-center font-mono-tech text-xs font-bold text-[hsl(var(--av-accent))]">
                  AI
                </div>
                <div>
                  <div className="font-display text-sm font-bold flex items-center gap-2">
                    AV AI Assistant
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 anim-pulse-node" />
                  </div>
                  <div className="font-mono-tech text-[10px] text-faint">
                    {lang === 'ru' ? 'Онлайн • Сохранено локально' : 'Online • Saved locally'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Clear History Button */}
                <button
                  onClick={clearHistory}
                  title={lang === 'ru' ? 'Очистить историю' : 'Clear history'}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-faint hover:text-red-400 hover:bg-red-500/10 transition-colors text-xs"
                  aria-label="Clear chat history"
                >
                  🗑
                </button>
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="w-7 h-7 rounded-full border border-line flex items-center justify-center text-dim hover:text-foreground hover:border-[hsl(var(--av-accent))] text-xs transition-colors"
                  aria-label="Close assistant"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Chat Messages Container with isolated scroll */}
            <div
              data-lenis-prevent
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs custom-scrollbar-y"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[hsl(var(--av-accent))] text-black font-medium rounded-br-none'
                        : 'bg-[hsl(var(--av-bg-panel))] border border-line text-foreground rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>

                  {m.suggestOrder && (
                    <button
                      onClick={() => {
                        handleClose()
                        openOrderModal(m.serviceHint)
                      }}
                      className="mt-2 text-[11px] font-mono-tech text-[hsl(var(--av-accent))] hover:underline flex items-center gap-1 bg-[hsl(var(--av-accent-soft))] px-3 py-1.5 rounded-lg border border-[hsl(var(--av-accent)/0.3)] transition-colors"
                    >
                      🚀 {lang === 'ru' ? 'Обсудить в модалке заказа' : 'Discuss in Order Modal'} →
                    </button>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts - Neat thin horizontal scrollbar */}
            <div
              data-lenis-prevent
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              className="px-3 py-2 border-t border-line bg-[hsl(var(--av-bg))] flex gap-1.5 overflow-x-auto custom-scrollbar-x shrink-0"
            >
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => handleSend(p)}
                  className="whitespace-nowrap px-2.5 py-1 mb-1 rounded-full border border-line text-[10px] text-dim hover:text-foreground hover:border-[hsl(var(--av-accent))] transition-colors shrink-0"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend(input)
              }}
              className="p-3 border-t border-line bg-[hsl(var(--av-bg-panel))] flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={lang === 'ru' ? 'Задать вопрос...' : 'Type a message...'}
                className="flex-1 rounded-lg border border-line bg-[hsl(var(--av-bg))] px-3 py-2 text-xs text-foreground placeholder:text-faint focus:border-[hsl(var(--av-accent))] focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-[hsl(var(--av-accent))] text-black font-bold px-3 py-2 text-xs hover:shadow-[0_0_16px_hsl(var(--av-accent-glow))] transition-shadow"
              >
                ➔
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.button
            key="toggle-button"
            onClick={() => {
              setIsOpen(true)
              lockMainScroll()
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.2 }}
            className="relative group rounded-full bg-[hsl(var(--av-accent))] text-black font-bold p-4 shadow-[0_0_36px_hsl(var(--av-accent-glow))] flex items-center justify-center"
            aria-label="Open AI Assistant"
          >
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-black anim-pulse-node" />
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
