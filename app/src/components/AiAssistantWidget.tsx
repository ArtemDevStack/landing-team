'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../i18n'
import { useOrderModal } from '../context/ModalContext'
import FormattedMarkdown from './FormattedMarkdown'

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

  // Close on Click Outside
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
    }
  }, [isOpen])

  const handleClose = () => {
    setIsOpen(false)
  }

  const [isThinking, setIsThinking] = useState(false)

  const handleSend = async (userText: string) => {
    if (!userText.trim() || isThinking) return

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: userText.trim() }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setIsThinking(true)

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, lang }),
      })
      const data = await res.json()

      let replyText = data.reply
      let serviceHint = 'Full Cycle'

      if (!replyText) {
        const lower = userText.toLowerCase()
        const match = KNOWLEDGE_BASE.find((k) => k.keywords.some((w) => lower.includes(w)))
        if (match) {
          replyText = lang === 'ru' ? match.answerRu : match.answerEn
          serviceHint = match.service
        } else {
          replyText =
            lang === 'ru'
              ? 'Мы разрабатываем высоконагруженные сайты, e-commerce, CRM, SaaS и AI-системы под ключ. Оставьте заявку, и наш ведущий архитектор обсудит детали проекта!'
              : 'We build enterprise websites, CRM, SaaS, and AI systems. Feel free to request a project consultation with our architect!'
        }
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        suggestOrder: true,
        serviceHint,
      }

      setMessages((prev) => [...prev, aiMsg])
    } catch (err) {
      const lower = userText.toLowerCase()
      const match = KNOWLEDGE_BASE.find((k) => k.keywords.some((w) => lower.includes(w)))
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: match
          ? (lang === 'ru' ? match.answerRu : match.answerEn)
          : (lang === 'ru'
            ? 'Мы разрабатываем сайты, CRM, SaaS и AI-агентов под ключ. Нажмите "Обсудить проект", чтобы получить консультацию!'
            : 'We engineer full-cycle digital products. Request a consultation with our team!'),
        suggestOrder: true,
        serviceHint: match ? match.service : 'Full Cycle',
      }
      setMessages((prev) => [...prev, aiMsg])
    } finally {
      setIsThinking(false)
    }
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
    <div ref={widgetRef} className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end pointer-events-auto">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="w-[calc(100vw-32px)] xs:w-[360px] sm:w-[380px] h-[78vh] max-h-[520px] rounded-2xl border border-[hsl(var(--av-line-strong))] bg-[hsl(var(--av-bg-raise))] shadow-2xl flex flex-col overflow-x-hidden overflow-y-hidden"
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
                  </div>
                  <div className="font-mono-tech text-[10px] text-faint">
                    {lang === 'ru' ? 'Сохранено локально' : 'Saved locally'}
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
              className="flex-1 overflow-x-hidden overflow-y-auto p-4 space-y-3.5 text-xs custom-scrollbar-y overscroll-contain"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-xl px-3.5 py-2.5 leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[hsl(var(--av-accent))] text-black font-medium rounded-br-none text-xs'
                        : 'bg-[hsl(var(--av-bg-panel))] border border-line text-foreground rounded-bl-none'
                    }`}
                  >
                    {m.sender === 'user' ? m.text : <FormattedMarkdown content={m.text} className="text-xs" />}
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
              {isThinking && (
                <div className="flex items-center gap-2 text-faint text-[11px] font-mono-tech animate-pulse py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--av-accent))] animate-ping" />
                  <span>{lang === 'ru' ? 'Нейросеть пишет ответ...' : 'AI neural network typing...'}</span>
                </div>
              )}
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
            onClick={() => setIsOpen(true)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.2 }}
            className="relative group rounded-full bg-gradient-to-r from-[hsl(var(--av-accent))] via-amber-400 to-[hsl(var(--av-accent))] text-black font-extrabold px-4 py-3.5 shadow-[0_0_32px_hsl(var(--av-accent-glow))] flex items-center gap-2.5 border border-amber-300/40 cursor-pointer"
            aria-label="Open AI Assistant"
          >
            <div className="relative flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                <path d="M4 11a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7z" />
                <path d="M9 15h.01" />
                <path d="M15 15h.01" />
              </svg>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            </div>
            <span className="font-mono-tech text-xs font-bold uppercase tracking-wider">AI Assistant</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
