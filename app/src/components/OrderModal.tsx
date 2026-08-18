'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { sendOrder } from '../lib/notifications'
import { useLang } from '../i18n'

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
  const [comment, setComment] = useState('')

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    setService(initialService)
  }, [initialService])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !contact.trim()) return

    setLoading(true)
    const finalBudget = budget.trim() || (lang === 'ru' ? 'По договоренности' : 'By agreement')

    try {
      const res = await sendOrder({
        name: name.trim(),
        contact: contact.trim(),
        service,
        budget: finalBudget,
        comment: comment.trim(),
      })

      setSubmitted(true)
      setStatusMessage(res.message)
    } catch (err) {
      console.error(err)
      setStatusMessage(lang === 'ru' ? 'Ошибка отправки. Попробуйте еще раз или напишите напрямую.' : 'Submission error. Please try again or contact directly.')
    } finally {
      setLoading(false)
    }
  }

  const resetAndClose = () => {
    setSubmitted(false)
    setName('')
    setContact('')
    setBudget('По договоренности')
    setComment('')
    onClose()
  }

  const serviceOptions = [
    { ru: 'Web & E-commerce', en: 'Web & E-commerce' },
    { ru: 'CRM & Системы', en: 'CRM & Business Systems' },
    { ru: 'SaaS & Продукты', en: 'SaaS & Product Dev' },
    { ru: 'AI & Автоматизация', en: 'AI & Automation' },
    { ru: 'Enterprise Архитектура', en: 'Enterprise Engineering' },
    { ru: 'Полный цикл (Digital-контур)', en: 'Full Cycle' },
  ]

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto pointer-events-auto">
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
            className="relative w-full max-w-2xl rounded-2xl border border-[hsl(var(--av-line-strong))] bg-[hsl(var(--av-bg-raise))] p-6 sm:p-8 shadow-2xl overflow-hidden z-10 my-auto pointer-events-auto"
          >
            {/* Ambient Background Glow */}
            <div
              className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-[100px] opacity-15 pointer-events-none"
              style={{ background: 'hsl(var(--av-accent))' }}
            />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 rounded-full border border-line flex items-center justify-center text-dim hover:text-foreground hover:border-[hsl(var(--av-accent))] transition-colors"
              aria-label="Close"
            >
              ✕
            </button>

            {!submitted ? (
              <>
                {/* Header */}
                <div className="mb-6">
                  <div className="font-mono-tech text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--av-accent))] mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--av-accent))] anim-pulse-node" />
                    {lang === 'ru' ? 'Заявка на разработку • AV Team' : 'Project Request • AV Team'}
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {lang === 'ru' ? 'Обсудить ваш проект' : 'Discuss Your Project'}
                  </h3>
                  <p className="text-sm text-dim mt-1">
                    {lang === 'ru'
                      ? 'Заполните форму ниже, и наш архитектор свяжется с вами.'
                      : 'Fill out the form below and our architect will contact you.'}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Service selection */}
                  <div>
                    <label className="block text-xs font-mono-tech uppercase text-dim tracking-wider mb-2">
                      {lang === 'ru' ? '1. Направление проекта' : '1. Project Scope'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {serviceOptions.map((item) => {
                        const label = lang === 'ru' ? item.ru : item.en
                        const isSelected =
                          service === item.en ||
                          service === item.ru ||
                          (service && (item.en.toLowerCase().includes(service.toLowerCase()) || service.toLowerCase().includes(item.en.toLowerCase().split(' ')[0])))
                        return (
                          <button
                            type="button"
                            key={item.en}
                            onClick={() => setService(item.en)}
                            className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
                              isSelected
                                ? 'border-[hsl(var(--av-accent))] bg-[hsl(var(--av-accent-soft))] text-[hsl(var(--av-accent))] font-semibold shadow-[0_0_12px_hsl(var(--av-accent-glow))]'
                                : 'border-line text-dim hover:text-foreground hover:border-line-strong'
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
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={lang === 'ru' ? 'Алексей (ООО Вектор)' : 'Alex (Acme Corp)'}
                        className="w-full rounded-lg border border-line bg-[hsl(var(--av-bg))] px-3.5 py-2.5 text-sm text-foreground placeholder:text-faint focus:border-[hsl(var(--av-accent))] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono-tech uppercase text-dim tracking-wider mb-1.5">
                        {lang === 'ru' ? 'Телефон, Telegram или Email *' : 'Phone, Telegram or Email *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder={lang === 'ru' ? '+7 (999) 000-00-00 или @username' : '+1 555-0192 or @user'}
                        className="w-full rounded-lg border border-line bg-[hsl(var(--av-bg))] px-3.5 py-2.5 text-sm text-foreground placeholder:text-faint focus:border-[hsl(var(--av-accent))] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Optional Budget Input */}
                  <div>
                    <label className="block text-xs font-mono-tech uppercase text-dim tracking-wider mb-1.5 flex items-center justify-between">
                      <span>{lang === 'ru' ? 'Планируемый бюджет (необязательно)' : 'Estimated Budget (optional)'}</span>
                    </label>
                    <input
                      type="text"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder={lang === 'ru' ? 'По договоренности' : 'By agreement'}
                      className="w-full rounded-lg border border-line bg-[hsl(var(--av-bg))] px-3.5 py-2.5 text-sm text-foreground placeholder:text-faint focus:border-[hsl(var(--av-accent))] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Details / Comment */}
                  <div>
                    <label className="block text-xs font-mono-tech uppercase text-dim tracking-wider mb-1.5">
                      {lang === 'ru' ? 'Описание проекта / задачи' : 'Project Details / Task'}
                    </label>
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={
                        lang === 'ru'
                          ? 'Расскажите в свободной форме о проекте, сроках и основных пожеланиях...'
                          : 'Briefly describe your goals, timeframe, and requirements...'
                      }
                      className="w-full rounded-lg border border-line bg-[hsl(var(--av-bg))] px-3.5 py-2.5 text-sm text-foreground placeholder:text-faint focus:border-[hsl(var(--av-accent))] focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="pt-2 flex items-center justify-between gap-4">
                    <span className="text-[11px] text-faint font-mono-tech">
                      {lang === 'ru' ? '🔒 Конфиденциальность гарантирована' : '🔒 NDA on demand'}
                    </span>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[hsl(var(--av-accent))] text-black font-bold px-7 py-3 text-sm hover:shadow-[0_0_32px_hsl(var(--av-accent-glow))] transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                          {lang === 'ru' ? 'Отправка...' : 'Sending...'}
                        </>
                      ) : (
                        <>
                          {lang === 'ru' ? 'Отправить заявку' : 'Submit Request'}
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path
                              d="M3 11 L11 3 M5 3 h6 v6"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* Success Screen */
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[hsl(var(--av-accent-soft))] text-[hsl(var(--av-accent))] flex items-center justify-center mx-auto text-2xl font-mono-tech border border-[hsl(var(--av-accent))]">
                  ✓
                </div>
                <h3 className="font-display text-2xl font-extrabold">
                  {lang === 'ru' ? 'Заявка принята в обработку!' : 'Request Successfully Received!'}
                </h3>
                <p className="text-sm text-dim max-w-md mx-auto leading-relaxed">{statusMessage}</p>
                <div className="pt-4">
                  <button
                    onClick={resetAndClose}
                    className="rounded-full border border-line-strong px-8 py-3 text-xs font-mono-tech text-dim hover:text-foreground hover:border-[hsl(var(--av-accent))] transition-colors"
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
