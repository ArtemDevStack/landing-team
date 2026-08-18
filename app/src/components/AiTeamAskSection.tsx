'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, Bot, Cpu, CheckCircle2, ArrowRight, CornerDownLeft } from 'lucide-react'
import { SectionHead } from './ui-bits'
import { useLang } from '../i18n'
import { useOrderModal } from '../context/ModalContext'

import FormattedMarkdown from './FormattedMarkdown'

const PRESET_QUESTIONS = {
  ru: [
    '👥 Из кого состоит команда и каков опыт?',
    '⚡ Какой стек технологий вы используете?',
    '🛡 Какие гарантии и договор вы даете?',
    '⏱ Каковы сроки разработки MVP и SaaS?',
    '🤖 Как вы внедряете AI-агентов в бизнес?',
  ],
  en: [
    '👥 Who is in the team and what is their experience?',
    '⚡ What tech stack do you build with?',
    '🛡 What code warranty and NDA do you offer?',
    '⏱ What are the MVP & SaaS timelines?',
    '🤖 How do you integrate AI Agents into businesses?',
  ],
}

export default function AiTeamAskSection() {
  const { lang } = useLang()
  const { openOrderModal } = useOrderModal()
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<string | null>(null)
  const [isThinking, setIsThinking] = useState(false)
  const [askedPrompt, setAskedPrompt] = useState<string>('')

  const presets = PRESET_QUESTIONS[lang]

  const handleAsk = async (textToAsk?: string) => {
    const q = textToAsk || question
    if (!q.trim() || isThinking) return

    setIsThinking(true)
    setAskedPrompt(q.trim())
    setAnswer(null)
    if (!textToAsk) setQuestion('')

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ sender: 'user', text: q.trim() }],
          lang,
        }),
      })

      const data = await res.json()
      if (data.reply) {
        setAnswer(data.reply)
      } else {
        setAnswer(
          lang === 'ru'
            ? 'Команда AV Studio состоит из Senior Full-Stack разработчиков, системных архитекторов и AI-инженеров (опыт 9+ лет). Мы создаем веб-приложения, CRM, SaaS и AI-системы под ключ с 12 месяцами гарантии.'
            : 'AV Studio consists of Senior Full-Stack engineers, system architects, and AI developers (9+ years experience). We build websites, CRM, SaaS, and AI systems with 12 months warranty.'
        )
      }
    } catch {
      setAnswer(
        lang === 'ru'
          ? 'AV Studio — технологическая студия полного цикла. Мы разрабатываем сайты, CRM, B2B SaaS и внедряем AI-агентов с гарантией по договору.'
          : 'AV Studio is a full-cycle software studio. We engineer websites, CRM, B2B SaaS, and custom AI agents under strict SLAs.'
      )
    } finally {
      setIsThinking(false)
    }
  }

  return (
    <section id="ai-ask" className="py-20 md:py-28 relative overflow-hidden">
      {/* Background Glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full blur-[140px] opacity-15"
        style={{ background: 'hsl(var(--av-accent))' }}
        aria-hidden
      />

      <div className="max-w-5xl mx-auto px-6 md:px-10 relative z-10">
        <SectionHead
          eyebrow={lang === 'ru' ? 'AI Нейро-Архитектор' : 'AI Neural Architect'}
          title={
            lang === 'ru'
              ? 'Задайте вопрос нейросети о команде, стеке и проектах'
              : 'Ask our Neural AI anything about team, stack & pricing'
          }
          sub={
            lang === 'ru'
              ? 'Наш ИИ-Архитектор проконсультирует по компетенциям команды, гарантиям, интеграциям 1С/CRM и срокам запуска.'
              : 'Our Neural Engine answers questions on team stack, SLAs, 1C integrations, and project timelines.'
          }
        />

        <div className="mt-10 rounded-3xl border border-line bg-[hsl(var(--av-bg-panel)/0.85)] p-6 md:p-10 backdrop-blur-2xl shadow-2xl space-y-6">
          {/* Preset Buttons */}
          <div className="space-y-2">
            <div className="font-mono-tech text-xs uppercase tracking-wider text-faint flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--av-accent))]" />
              <span>{lang === 'ru' ? 'Частые вопросы посетителей:' : 'Frequent questions:'}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p}
                  disabled={isThinking}
                  onClick={() => handleAsk(p)}
                  className="px-3.5 py-2 rounded-xl border border-line bg-[hsl(var(--av-bg))] text-xs text-dim hover:text-foreground hover:border-[hsl(var(--av-accent))] transition-all text-left disabled:opacity-50"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleAsk()
            }}
            className="relative flex flex-col sm:flex-row gap-3 pt-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={
                  lang === 'ru'
                    ? 'Например: За сколько недель сделаете MVP для сайта или CRM?'
                    : 'E.g., How fast can you deploy an MVP for our startup?'
                }
                className="w-full rounded-2xl border border-line bg-[hsl(var(--av-bg))] px-5 py-4 text-sm text-foreground placeholder:text-faint focus:border-[hsl(var(--av-accent))] focus:outline-none pr-12"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-faint text-[10px] font-mono-tech">
                <CornerDownLeft className="w-3 h-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isThinking || !question.trim()}
              className="rounded-2xl bg-[hsl(var(--av-accent))] text-black font-extrabold px-7 py-4 text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_24px_hsl(var(--av-accent-glow))] transition-all disabled:opacity-50 shrink-0 cursor-pointer"
            >
              <span>{lang === 'ru' ? 'Спросить ИИ' : 'Ask Neural AI'}</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Thinking State */}
          {isThinking && (
            <div className="p-6 rounded-2xl border border-line bg-[hsl(var(--av-bg))] flex items-center gap-3 text-xs font-mono-tech text-faint animate-pulse">
              <Cpu className="w-4 h-4 text-[hsl(var(--av-accent))] animate-spin" />
              <span>{lang === 'ru' ? 'ИИ-Архитектор AV Studio формирует ответ по базе знаний...' : 'AV Neural Engine computing reply...'}</span>
            </div>
          )}

          {/* Neural Answer Stream Box */}
          <AnimatePresence>
            {answer && !isThinking && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-[hsl(var(--av-accent)/0.3)] bg-[hsl(var(--av-bg-raise))] p-6 space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[hsl(var(--av-accent-soft))] border border-[hsl(var(--av-accent))] flex items-center justify-center text-[hsl(var(--av-accent))] font-bold text-xs font-mono-tech">
                      AI
                    </div>
                    <div>
                      <div className="font-display text-xs font-bold text-foreground">
                        {lang === 'ru' ? 'Ответ Нейро-Архитектора' : 'Neural Architect Response'}
                      </div>
                      <div className="text-[10px] font-mono-tech text-faint">
                        {askedPrompt}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono-tech text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>AV Neural Engine 3.0</span>
                  </span>
                </div>

                {/* Main Response Text */}
                <FormattedMarkdown content={answer} className="text-sm md:text-base" />

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-dim">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'ru' ? 'Готовы обсудить ваш проект с командой?' : 'Ready to discuss your project with our architect?'}</span>
                  </div>

                  <button
                    onClick={() => openOrderModal()}
                    className="inline-flex items-center gap-2 text-xs font-bold font-mono-tech text-black bg-[hsl(var(--av-accent))] px-4 py-2.5 rounded-xl hover:shadow-[0_0_16px_hsl(var(--av-accent-glow))] transition-shadow"
                  >
                    <span>{lang === 'ru' ? 'Обсудить в модалке' : 'Discuss Project'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
