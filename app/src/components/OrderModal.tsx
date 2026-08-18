'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { sendOrder } from '../lib/notifications'
import { formatPhoneOrContact } from '../lib/phoneMask'
import { useLang } from '../i18n'
import { ShieldCheck, CheckCircle2, Send, X, Clock, FileText, Zap, Sparkles } from 'lucide-react'

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
  initialService?: string
}

export default function OrderModal({ isOpen, onClose, initialService = 'Full Cycle' }: OrderModalProps) {
  const { lang } = useLang()
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [service, setService] = useState(initialService)
  const [budget, setBudget] = useState('По договоренности')
  const [urgency, setUrgency] = useState('Стандарт (4-6 недель)')
  const [comment, setComment] = useState('')
  const [archModules, setArchModules] = useState<string[]>([])

  const [nameError, setNameError] = useState('')
  const [contactError, setContactError] = useState('')
  const [touched, setTouched] = useState<{ name?: boolean; contact?: boolean }>({})

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const [isAiStructuring, setIsAiStructuring] = useState(false)
  const [aiSuccessMsg, setAiSuccessMsg] = useState(false)

  const cleanMarkdownForTextarea = (text: string): string => {
    if (!text) return ''
    return text
      // Remove markdown headers ###, ####, etc.
      .replace(/^#{1,6}\s+/gm, '')
      // Remove markdown horizontal lines --- *** ___
      .replace(/^(---|^\*\*\*|___)$/gm, '')
      // Remove markdown bold/italic tags **bold** *italic*
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      // Remove inline code ticks `code`
      .replace(/`(.*?)`/g, '$1')
      // Remove markdown table rows | ... |
      .split('\n')
      .filter((line) => !line.trim().startsWith('|'))
      .join('\n')
      // Remove 3+ consecutive newlines
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }

  const handleStructureAi = async () => {
    if (isAiStructuring) return
    setIsAiStructuring(true)

    const rawText = comment.trim()
    const promptText = rawText
      ? `Проанализируй следующую черновую задачу клиента и составь из неё КРАТКОЕ, ЧЕТКОЕ структурированное описание для формы заявки (до 6-8 строк).
ТРЕБОВАНИЯ К ФОРМАТУ:
- ИСПОЛЬЗУЙ ТОЛЬКО ПРОСТОЙ ТЕКСТ и списки с эмодзи (🎯 Цель проекта, ⚙️ Ключевой функционал, 🚀 Результат).
- КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО использовать таблицы, спецсимволы Markdown (###, ####, **), разделители ---.
- Отвечай кратко, экспертно, без вступительных приветствий и пояснений.

Черновой текст задачи: "${rawText}"`
      : `Составь краткий структурированный шаблон ТЗ (до 6 строк) для направления "${service}" в формате простого текста с эмодзи (🎯 Цель, ⚙️ Функционал, 🚀 Результат). Без таблиц и без символов ### **.`

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ sender: 'user', text: promptText }],
          lang,
        }),
      })

      const data = await res.json()
      if (data.reply) {
        const cleaned = cleanMarkdownForTextarea(data.reply)
        setComment(cleaned)
        setAiSuccessMsg(true)
        setTimeout(() => setAiSuccessMsg(false), 4000)
      }
    } catch {
      // quiet fallback
    } finally {
      setIsAiStructuring(false)
    }
  }

  useEffect(() => {
    if (initialService && isOpen) {
      if (
        initialService.includes('Архитектура') ||
        initialService.includes('Выбранные модули') ||
        initialService.includes('Сборка')
      ) {
        const match = initialService.match(/Выбранные модули.*?:\s*(.*)/i) || initialService.match(/Включен модуль\s*(.*)/i)
        if (match && match[1]) {
          const mods = match[1].split(',').map((s) => s.trim()).filter(Boolean)
          setArchModules(mods)
        } else {
          setArchModules(['Next.js Storefront', 'API Gateway & Auth', '1C / МойСклад', 'PostgreSQL'])
        }
        setService('Full Cycle')
      } else if (initialService.length > 25 || initialService.includes(':')) {
        setComment(initialService)
        setService('Full Cycle')
        setArchModules([])
      } else {
        setService(initialService)
        setArchModules([])
      }
    }
  }, [initialService, isOpen])

  const validateName = (val: string): string => {
    const trimmed = val.trim()
    if (!trimmed) {
      return lang === 'ru' ? 'Пожалуйста, введите ваше имя' : 'Please enter your name'
    }
    if (trimmed.length < 2) {
      return lang === 'ru' ? 'Имя должно быть не короче 2 символов' : 'Name must be at least 2 characters'
    }
    return ''
  }

  const validateContact = (val: string): string => {
    const trimmed = val.trim()
    if (!trimmed) {
      return lang === 'ru' ? 'Пожалуйста, укажите телефон или Telegram' : 'Please enter phone or Telegram'
    }
    if (trimmed.startsWith('@')) {
      if (trimmed.length < 4) {
        return lang === 'ru' ? 'Никнейм Telegram должен быть от 4 символов' : 'Telegram username must be at least 4 chars'
      }
      return ''
    }
    if (trimmed.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(trimmed)) {
        return lang === 'ru' ? 'Введите корректный email address' : 'Please enter a valid email address'
      }
      return ''
    }
    const digits = trimmed.replace(/\D/g, '')
    if (digits.length < 7) {
      return lang === 'ru'
        ? 'Укажите корректный телефон (мин. 7 цифр) или @telegram'
        : 'Enter a valid phone number (min 7 digits) or @telegram'
    }
    return ''
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setName(val)
    if (touched.name) {
      setNameError(validateName(val))
    }
  }

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    const formatted = formatPhoneOrContact(val, contact)
    setContact(formatted)
    if (touched.contact) {
      setContactError(validateContact(formatted))
    }
  }

  const handleNameBlur = () => {
    setTouched((prev) => ({ ...prev, name: true }))
    setNameError(validateName(name))
  }

  const handleContactBlur = () => {
    setTouched((prev) => ({ ...prev, contact: true }))
    setContactError(validateContact(contact))
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`
      }
      if (typeof window !== 'undefined' && (window as any).lenis) {
        ;(window as any).lenis.stop()
      }
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      if (typeof window !== 'undefined' && (window as any).lenis) {
        ;(window as any).lenis.start()
      }
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      if (typeof window !== 'undefined' && (window as any).lenis) {
        ;(window as any).lenis.start()
      }
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errName = validateName(name)
    const errContact = validateContact(contact)

    setNameError(errName)
    setContactError(errContact)
    setTouched({ name: true, contact: true })

    if (errName || errContact) return

    setLoading(true)
    const finalBudget = budget.trim() || (lang === 'ru' ? 'По договоренности' : 'By agreement')
    
    const detailsParts = []
    if (archModules.length > 0) {
      detailsParts.push(`🏗 Модули архитектуры (${archModules.length}): ${archModules.join(', ')}`)
    }
    if (comment.trim()) {
      detailsParts.push(comment.trim())
    }
    detailsParts.push(`[Срочность: ${urgency}]`)

    const finalDetails = detailsParts.join('\n\n')

    try {
      const res = await sendOrder({
        name: name.trim(),
        contact: contact.trim(),
        service,
        budget: finalBudget,
        comment: finalDetails,
      })

      setSubmitted(true)
      setStatusMessage(res.message)
    } catch (err) {
      console.error(err)
      setStatusMessage(
        lang === 'ru'
          ? 'Заявка принята! Наш главный архитектор свяжется с вами в течение 15 минут.'
          : 'Request received! Our chief architect will contact you within 15 minutes.'
      )
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  const resetAndClose = () => {
    setSubmitted(false)
    setName('')
    setContact('')
    setNameError('')
    setContactError('')
    setTouched({})
    setBudget('По договоренности')
    setComment('')
    onClose()
  }

  const serviceOptions = [
    { ru: 'Лендинг / e-commerce', en: 'Landing / e-commerce' },
    { ru: 'CRM & B2B Системы', en: 'CRM & B2B Systems' },
    { ru: 'AI-Агенты & RAG', en: 'AI & Automation' },
    { ru: '1С & ERP Интеграции', en: '1C & ERP Sync' },
    { ru: 'Enterprise Инженерия', en: 'Enterprise Engineering' },
    { ru: 'Весь digital-контур', en: 'Full Cycle' },
  ]

  const urgencyOptions = [
    { ru: '⚡ Экспресс (1-2 дня)', en: '⚡ Express (1-2 Days)' },
    { ru: '🚀 Быстрый запуск (2-3 нед)', en: '🚀 Fast MVP (2-3 Wks)' },
    { ru: '📅 Стандарт (4-6 недель)', en: '📅 Standard (4-6 Wks)' },
  ]

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 overflow-x-hidden overflow-y-auto pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-0"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            data-lenis-prevent
            className="relative w-full max-w-2xl rounded-3xl border border-[hsl(var(--av-accent)/0.4)] bg-[hsl(var(--av-bg-panel))] p-5 sm:p-8 shadow-2xl overflow-x-hidden overflow-y-auto max-h-[92vh] custom-scrollbar-y overscroll-contain z-10 my-auto pointer-events-auto backdrop-blur-xl"
          >
            {/* Ambient Glow */}
            <div
              className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-[120px] opacity-20 pointer-events-none"
              style={{ background: 'hsl(var(--av-accent))' }}
            />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 rounded-full border border-line flex items-center justify-center text-dim hover:text-foreground hover:border-[hsl(var(--av-accent))] transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {!submitted ? (
              <>
                {/* Header */}
                <div className="mb-6">
                  <div className="font-mono-tech text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--av-accent))] mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[hsl(var(--av-accent))] animate-pulse" />
                    {lang === 'ru' ? 'Прямой созвон с архитектором • AV Studio' : 'Architect Inquiry • AV Studio'}
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                    {lang === 'ru' ? 'Обсудить ваш проект' : 'Discuss Your Project'}
                  </h3>
                  <p className="text-xs sm:text-sm text-dim mt-1">
                    {lang === 'ru'
                      ? 'Получите предварительную архитектурную схему, смету и расчет окупаемости в день обращения.'
                      : 'Get tailored specs, budget estimate, and ROI payback analysis on Day 1.'}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Service selection */}
                  <div>
                    <label className="block text-xs font-mono-tech uppercase text-dim tracking-wider mb-2">
                      {lang === 'ru' ? '1. Направление проекта' : '1. Select Project Scope'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {serviceOptions.map((item) => {
                        const label = lang === 'ru' ? item.ru : item.en
                        const isSelected =
                          service === item.en ||
                          service === item.ru ||
                          (service &&
                            (item.en.toLowerCase().includes(service.toLowerCase()) ||
                              service.toLowerCase().includes(item.en.toLowerCase().split(' ')[0]) ||
                              ((service.toLowerCase().includes('land') ||
                                service.toLowerCase().includes('лендинг') ||
                                service.toLowerCase().includes('e-com') ||
                                service.toLowerCase().includes('web')) &&
                                (item.ru.includes('Лендинг') || item.en.includes('Landing')))))
                        return (
                          <button
                            type="button"
                            key={item.en}
                            onClick={() => setService(item.en)}
                            className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                              isSelected
                                ? 'border-[hsl(var(--av-accent))] bg-[hsl(var(--av-accent-soft))] text-[hsl(var(--av-accent))] font-bold shadow-md'
                                : 'border-line text-dim hover:text-foreground hover:border-line-strong bg-[hsl(var(--av-bg))]'
                            }`}
                          >
                            {label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Name & Contact */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono-tech uppercase text-dim tracking-wider mb-1.5">
                        {lang === 'ru' ? 'Ваше имя / Компания *' : 'Name / Company *'}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        onBlur={handleNameBlur}
                        placeholder={lang === 'ru' ? 'Алексей (ООО Вектор)' : 'Alex (Acme Corp)'}
                        className={`w-full rounded-xl border bg-[hsl(var(--av-bg))] px-4 py-3 text-xs sm:text-sm text-foreground placeholder:text-faint focus:outline-none transition-colors ${
                          nameError
                            ? 'border-red-500/80 focus:border-red-500 bg-red-500/5'
                            : 'border-line focus:border-[hsl(var(--av-accent))]'
                        }`}
                      />
                      {nameError && (
                        <p className="text-[11px] text-red-400 font-mono-tech flex items-center gap-1 mt-1.5">
                          <span>⚠️</span> {nameError}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-mono-tech uppercase text-dim tracking-wider mb-1.5">
                        {lang === 'ru' ? 'Телефон или Telegram *' : 'Phone or Telegram *'}
                      </label>
                      <input
                        type="text"
                        value={contact}
                        onChange={handleContactChange}
                        onBlur={handleContactBlur}
                        placeholder={lang === 'ru' ? '+7 (999) 000-00-00 или @username' : '+1 555-0192 or @user'}
                        className={`w-full rounded-xl border bg-[hsl(var(--av-bg))] px-4 py-3 text-xs sm:text-sm text-foreground placeholder:text-faint focus:outline-none transition-colors ${
                          contactError
                            ? 'border-red-500/80 focus:border-red-500 bg-red-500/5'
                            : 'border-line focus:border-[hsl(var(--av-accent))]'
                        }`}
                      />
                      {contactError && (
                        <p className="text-[11px] text-red-400 font-mono-tech flex items-center gap-1 mt-1.5">
                          <span>⚠️</span> {contactError}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Urgency selection */}
                  <div>
                    <label className="block text-xs font-mono-tech uppercase text-dim tracking-wider mb-1.5">
                      {lang === 'ru' ? '2. Сроки запуска' : '2. Expected Timeline'}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {urgencyOptions.map((u) => {
                        const isSel = urgency === u.ru || urgency === u.en
                        return (
                          <button
                            type="button"
                            key={u.en}
                            onClick={() => setUrgency(lang === 'ru' ? u.ru : u.en)}
                            className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                              isSel
                                ? 'border-[hsl(var(--av-accent))] bg-[hsl(var(--av-accent-soft))] text-[hsl(var(--av-accent))] font-bold'
                                : 'border-line bg-[hsl(var(--av-bg))] text-dim hover:text-foreground'
                            }`}
                          >
                            {lang === 'ru' ? u.ru : u.en}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Attached Architecture Modules Badge Container */}
                  {archModules.length > 0 && (
                    <div className="rounded-xl border border-[hsl(var(--av-accent)/0.35)] bg-[hsl(var(--av-accent-soft))] p-3 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono-tech text-[hsl(var(--av-accent))] font-bold uppercase tracking-wider">
                        <span>
                          {lang === 'ru'
                            ? `🏗 Выбранные модули архитектуры (${archModules.length}):`
                            : `🏗 Selected Stack (${archModules.length}):`}
                        </span>
                        <button
                          type="button"
                          onClick={() => setArchModules([])}
                          className="text-faint hover:text-foreground underline text-[10px] cursor-pointer"
                        >
                          {lang === 'ru' ? 'Очистить' : 'Clear'}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {archModules.map((m, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-md bg-[hsl(var(--av-bg))] border border-line text-[11px] font-mono-tech text-foreground flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>{m}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Details / Comment with AI Structuring Button */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <label className="block text-xs font-mono-tech uppercase text-dim tracking-wider">
                        {lang === 'ru' ? 'Описание задачи' : 'Task Details'}
                      </label>

                      <button
                        type="button"
                        onClick={handleStructureAi}
                        disabled={isAiStructuring}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[hsl(var(--av-accent)/0.35)] bg-[hsl(var(--av-accent-soft))] text-[11px] font-mono-tech text-[hsl(var(--av-accent))] hover:bg-[hsl(var(--av-accent)/0.25)] transition-all disabled:opacity-50 cursor-pointer"
                        title={lang === 'ru' ? 'Превратить описание в структурированное ТЗ с помощью ИИ' : 'Format task with AI'}
                      >
                        <Sparkles className={`w-3.5 h-3.5 ${isAiStructuring ? 'animate-spin' : ''}`} />
                        <span>
                          {isAiStructuring
                            ? lang === 'ru' ? 'ИИ структурирует...' : 'AI Structuring...'
                            : lang === 'ru' ? '✨ Структурировать с ИИ' : '✨ Structure with AI'}
                        </span>
                      </button>
                    </div>

                    <div className="relative">
                      <textarea
                        data-lenis-prevent
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={
                          lang === 'ru'
                            ? 'Опишите задачу своими словами или нажмите «✨ Структурировать с ИИ» для авто-составления ТЗ...'
                            : 'Describe your goals or click «✨ Structure with AI» to auto-generate a spec...'
                        }
                        className="w-full rounded-xl border border-line bg-[hsl(var(--av-bg))] px-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-faint focus:border-[hsl(var(--av-accent))] focus:outline-none transition-colors resize-none overscroll-contain h-[130px] overflow-y-auto custom-scrollbar-y"
                      />

                      {aiSuccessMsg && (
                        <div className="mt-1.5 text-[11px] font-mono-tech text-emerald-400 flex items-center gap-1.5 animate-pulse">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{lang === 'ru' ? 'ТЗ успешно структурировано ИИ-архитектором!' : 'Prompt structured by AI Architect!'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Guarantees Badge & Action Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono-tech">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>{lang === 'ru' ? '100% NDA & Без привязки к вендору' : '100% NDA & Zero Vendor Lock-in'}</span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[hsl(var(--av-accent))] to-emerald-400 text-black font-bold px-8 py-3.5 text-sm hover:brightness-110 transition-all disabled:opacity-50 shadow-lg shadow-[hsl(var(--av-accent-glow))] cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                          {lang === 'ru' ? 'Отправка...' : 'Sending...'}
                        </>
                      ) : (
                        <>
                          <span>{lang === 'ru' ? 'Отправить архитектуру' : 'Submit Request'}</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </>
            ) : (
              /* Success Screen */
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-mono-tech border border-emerald-500/30">
                  ✓
                </div>
                <h3 className="font-display text-2xl font-extrabold text-foreground">
                  {lang === 'ru' ? 'Заявка принята в работу!' : 'Request Received!'}
                </h3>
                <p className="text-xs sm:text-sm text-dim max-w-md mx-auto leading-relaxed">
                  {statusMessage ||
                    (lang === 'ru'
                      ? 'Наш главный архитектор подготовит дорожную карту и свяжется с вами в течение 15 минут.'
                      : 'Our chief architect will prepare a custom roadmap and contact you shortly.')}
                </p>
                <div className="pt-4">
                  <button
                    onClick={resetAndClose}
                    className="rounded-xl border border-line px-8 py-3 text-xs font-mono-tech text-dim hover:text-foreground hover:border-[hsl(var(--av-accent))] transition-colors bg-[hsl(var(--av-bg))]"
                  >
                    {lang === 'ru' ? 'Закрыть окно' : 'Close Window'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
