'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../i18n'
import { sendOrder } from '../lib/notifications'
import { formatPhoneOrContact } from '../lib/phoneMask'

export default function QuizModal() {
  const { lang } = useLang()
  const [isOpen, setIsOpen] = useState(false)

  const [step, setStep] = useState(1)
  const [goal, setGoal] = useState('')
  const [timeline, setTimeline] = useState('')
  const [model, setModel] = useState('')

  const [name, setName] = useState('')
  const [contact, setContact] = useState('')

  const [nameError, setNameError] = useState('')
  const [contactError, setContactError] = useState('')
  const [touched, setTouched] = useState<{ name?: boolean; contact?: boolean }>({})

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')

  const validateName = (val: string): string => {
    const trimmed = val.trim()
    if (!trimmed) {
      return lang === 'ru' ? 'Пожалуйста, введите имя' : 'Please enter name'
    }
    if (trimmed.length < 2) {
      return lang === 'ru' ? 'Имя должно быть не короче 2 символов' : 'Name must be at least 2 characters'
    }
    return ''
  }

  const validateContact = (val: string): string => {
    const trimmed = val.trim()
    if (!trimmed) {
      return lang === 'ru' ? 'Пожалуйста, укажите контакт' : 'Please enter contact'
    }
    if (trimmed.startsWith('@')) {
      if (trimmed.length < 4) {
        return lang === 'ru' ? 'Никнейм Telegram от 4 символов' : 'Telegram username must be at least 4 chars'
      }
      return ''
    }
    if (trimmed.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(trimmed)) {
        return lang === 'ru' ? 'Введите корректный email' : 'Please enter a valid email'
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

  const resetQuiz = () => {
    setStep(1)
    setGoal('')
    setTimeline('')
    setModel('')
    setName('')
    setContact('')
    setNameError('')
    setContactError('')
    setTouched({})
    setSubmitted(false)
    setIsOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errName = validateName(name)
    const errContact = validateContact(contact)

    setNameError(errName)
    setContactError(errContact)
    setTouched({ name: true, contact: true })

    if (errName || errContact) return

    setLoading(true)
    const summary = `Квиз-Анализ: Цель=[${goal}], Сроки=[${timeline}], Модель=[${model}]`

    try {
      const res = await sendOrder({
        name: name.trim(),
        contact: contact.trim(),
        service: 'Квиз-Подбор Спека',
        comment: summary,
      })
      setSubmitted(true)
      setStatusMsg(res.message)
    } catch {
      setStatusMsg(lang === 'ru' ? 'Ошибка отправки' : 'Submission error')
    } finally {
      setLoading(false)
    }
  }

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
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
  }, [isOpen])

  return (
    <>
      {/* Quiz Launcher Badge Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 sm:right-6 z-40 flex items-center gap-2 rounded-full border border-[hsl(var(--av-accent))] bg-[hsl(var(--av-bg-panel)/0.95)] px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-mono-tech uppercase font-semibold text-[hsl(var(--av-accent))] shadow-[0_0_24px_hsl(var(--av-accent-glow))] hover:scale-105 transition-all duration-300 backdrop-blur-md"
      >
        <span className="w-2 h-2 rounded-full bg-[hsl(var(--av-accent))] anim-pulse-node" />
        <span>{lang === 'ru' ? '⚡ Подобрать стек за 30с' : '⚡ 30s Stack Quiz'}</span>
      </button>

      {/* Quiz Modal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 overflow-x-hidden overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/85 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                data-lenis-prevent
                className="relative w-full max-w-xl rounded-2xl border border-[hsl(var(--av-line-strong))] bg-[hsl(var(--av-bg-raise))] p-5 sm:p-8 shadow-2xl overflow-x-hidden overflow-y-auto max-h-[92vh] custom-scrollbar-y overscroll-contain z-10 my-auto"
              >
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full border border-line flex items-center justify-center text-dim hover:text-foreground"
                >
                  ✕
                </button>

                {!submitted ? (
                  <>
                    {/* Header */}
                    <div className="mb-6">
                      <div className="font-mono-tech text-[11px] uppercase tracking-widest text-[hsl(var(--av-accent))] mb-1">
                        {lang === 'ru' ? `Шаг ${step} из 4 • Экспресс-Анализ` : `Step ${step} of 4 • Quick Assessment`}
                      </div>
                      <h3 className="font-display text-2xl font-bold">
                        {lang === 'ru' ? 'Подбор архитектуры и технологии' : 'Technology & Architecture Selector'}
                      </h3>
                    </div>

                    {/* Step 1: Goal */}
                    {step === 1 && (
                      <div className="space-y-3">
                        <p className="text-sm text-dim mb-4">
                          {lang === 'ru' ? '1. Какая главная задача вашего проекта?' : '1. What is your primary project goal?'}
                        </p>
                        {[
                          'Запустить продукт / MVP с нуля',
                          'Автоматизировать CRM & B2B процессы',
                          'Внедрить AI-ассистента и ИИ-модели',
                          'Масштабировать существующий Enterprise-сервис',
                        ].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              setGoal(opt)
                              setStep(2)
                            }}
                            className="w-full p-3.5 rounded-xl border border-line bg-[hsl(var(--av-bg))] text-left text-xs font-medium text-dim hover:text-foreground hover:border-[hsl(var(--av-accent))] transition-all flex items-center justify-between"
                          >
                            <span>{opt}</span>
                            <span>→</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Step 2: Timeline */}
                    {step === 2 && (
                      <div className="space-y-3">
                        <p className="text-sm text-dim mb-4">
                          {lang === 'ru' ? '2. Когда планируется старт разработки?' : '2. When do you plan to start development?'}
                        </p>
                        {[
                          'Ближайшие 1-2 недели (Срочный запуск)',
                          'В течение 1 месяца',
                          'Планируем бюджет на квартал',
                        ].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              setTimeline(opt)
                              setStep(3)
                            }}
                            className="w-full p-3.5 rounded-xl border border-line bg-[hsl(var(--av-bg))] text-left text-xs font-medium text-dim hover:text-foreground hover:border-[hsl(var(--av-accent))] transition-all flex items-center justify-between"
                          >
                            <span>{opt}</span>
                            <span>→</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Step 3: Collaboration Model */}
                    {step === 3 && (
                      <div className="space-y-3">
                        <p className="text-sm text-dim mb-4">
                          {lang === 'ru' ? '3. Предпочтительный формат работы?' : '3. Preferred collaboration model?'}
                        </p>
                        {[
                          'Разработка под ключ (Full Cycle)',
                          'Выделенная Senior-команда',
                          'Архитектурный аудит & Консультация',
                        ].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              setModel(opt)
                              setStep(4)
                            }}
                            className="w-full p-3.5 rounded-xl border border-line bg-[hsl(var(--av-bg))] text-left text-xs font-medium text-dim hover:text-foreground hover:border-[hsl(var(--av-accent))] transition-all flex items-center justify-between"
                          >
                            <span>{opt}</span>
                            <span>→</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Step 4: Contact & Recommendation */}
                    {step === 4 && (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="p-4 rounded-xl border border-[hsl(var(--av-accent)/0.5)] bg-[hsl(var(--av-accent-soft))] text-xs space-y-1">
                          <div className="font-bold text-[hsl(var(--av-accent))]">
                            💡 Рекомендуемый стек: Next.js 15 + Node.js + AI Pipeline
                          </div>
                          <div className="text-faint font-mono-tech">
                            Ориентировочные сроки разработки: 4-8 недель.
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono-tech uppercase text-dim mb-1">
                            {lang === 'ru' ? 'Ваше имя / Компания *' : 'Name / Company *'}
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                            onBlur={handleNameBlur}
                            placeholder="Иван (ООО Вектор)"
                            className={`w-full rounded-lg border bg-[hsl(var(--av-bg))] p-2.5 text-xs text-foreground focus:outline-none transition-colors ${
                              nameError
                                ? 'border-red-500/80 focus:border-red-500 bg-red-500/5'
                                : 'border-line focus:border-[hsl(var(--av-accent))]'
                            }`}
                          />
                          {nameError && (
                            <p className="text-[11px] text-red-400 font-mono-tech flex items-center gap-1 mt-1">
                              <span>⚠️</span> {nameError}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-mono-tech uppercase text-dim mb-1">
                            {lang === 'ru' ? 'Телефон, Telegram или Email *' : 'Contact *'}
                          </label>
                          <input
                            type="text"
                            value={contact}
                            onChange={handleContactChange}
                            onBlur={handleContactBlur}
                            placeholder="+7 (999) 000-00-00 или @username"
                            className={`w-full rounded-lg border bg-[hsl(var(--av-bg))] p-2.5 text-xs text-foreground focus:outline-none transition-colors ${
                              contactError
                                ? 'border-red-500/80 focus:border-red-500 bg-red-500/5'
                                : 'border-line focus:border-[hsl(var(--av-accent))]'
                            }`}
                          />
                          {contactError && (
                            <p className="text-[11px] text-red-400 font-mono-tech flex items-center gap-1 mt-1">
                              <span>⚠️</span> {contactError}
                            </p>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3 rounded-full bg-[hsl(var(--av-accent))] text-black font-bold text-xs font-mono-tech uppercase hover:shadow-[0_0_24px_hsl(var(--av-accent-glow))] transition-all disabled:opacity-50"
                        >
                          {loading ? (lang === 'ru' ? 'Отправка...' : 'Sending...') : (lang === 'ru' ? 'Получить персональный расчет →' : 'Get Tailored Proposal →')}
                        </button>
                      </form>
                    )}
                  </>
                ) : (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-[hsl(var(--av-accent-soft))] text-[hsl(var(--av-accent))] flex items-center justify-center mx-auto text-xl border border-[hsl(var(--av-accent))]">
                      ✓
                    </div>
                    <h3 className="font-display text-xl font-bold">
                      {lang === 'ru' ? 'Анализ отправлен архитектору!' : 'Proposal Sent to Architect!'}
                    </h3>
                    <p className="text-xs text-dim">{statusMsg}</p>
                    <button
                      onClick={resetQuiz}
                      className="px-6 py-2 rounded-full border border-line text-xs font-mono-tech text-dim hover:text-foreground"
                    >
                      {lang === 'ru' ? 'Закрыть' : 'Close'}
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
