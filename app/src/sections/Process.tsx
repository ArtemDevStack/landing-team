'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { SectionHead, Rail } from '../components/ui-bits'
import { useLang, ui } from '../i18n'
import { CheckCircle2, Clock, Sparkles } from 'lucide-react'

export default function Process() {
  const { lang } = useLang()
  const t = ui[lang].process

  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  })

  // Map 0 -> 1 vertical scroll into horizontal translation (-64% width offset)
  const x = useTransform(scrollYProgress, [0.05, 0.95], ['0%', '-64%'])
  const progressWidth = useTransform(scrollYProgress, [0.05, 0.95], ['0%', '100%'])

  const DELIVERABLES = [
    { ru: ['Бизнес-анализ & Юнит-экономика', 'Customer Journey Map', 'Архитектурный план ТЗ'], en: ['Business & Unit Economics', 'Customer Journey Map', 'Tech Architecture Specs'] },
    { ru: ['Интерактивные Figma-прототипы', 'UI-дизайн система & UI-Kit', 'UX-тестирование гипотез'], en: ['Interactive Figma Prototypes', 'UI Design System & Kit', 'UX Usability Validation'] },
    { ru: ['Чистый код Next.js / Node.js / Go', 'Отказоустойчивая PostgreSQL DB', 'CI/CD Пайплайны & Автодеплой'], en: ['Clean Next.js / Node.js / Go Code', 'Fault-tolerant PostgreSQL DB', 'CI/CD Pipelines & Auto-deploy'] },
    { ru: ['Автоматическое e2e / Unit тестирование', 'Нагрузочный стресс-тест 100k RPS', 'Аудит безопасности & Guardrails'], en: ['Automated e2e / Unit Testing', '100k RPS Stress Testing', 'Security & Guardrails Audit'] },
    { ru: ['Бесшовный релиз в Prod без простоя', 'Подключение мониторинга & логов', 'Обучение команды и передачи документации'], en: ['Zero-downtime Prod Rollout', 'Observability & Log Setup', 'Team Training & Handover'] },
    { ru: ['SEO-оптимизация & Перформанс', 'Сквозная аналитика & CRO', 'Гипотезы роста & A/B тесты'], en: ['SEO & Performance Tuning', 'End-to-end Analytics & CRO', 'Growth Hypotheses & A/B Tests'] },
    { ru: ['Гарантия SLA 99.99% в договоре', '100% Передача всех прав на код', 'Круглосуточный мониторинг 24/7'], en: ['99.99% SLA Guarantee', '100% IP & Code Ownership', '24/7 On-Call Support'] },
  ]

  return (
    <>
      <Rail left={t.eyebrow} right="AV / PROCESS HORIZONTAL STICKY" />

      {/* Target container height controls horizontal scroll duration */}
      <section id="process" ref={targetRef} className="relative h-[260vh] bg-[hsl(var(--av-bg))]">
        {/* Sticky viewport frame */}
        <div className="sticky top-16 md:top-20 min-h-[88vh] flex flex-col justify-between overflow-hidden pt-4 pb-6">
          {/* Header */}
          <div className="max-w-7xl mx-auto px-6 md:px-10 w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0 relative z-10">
            <SectionHead eyebrow={t.eyebrow} title={t.title} sub={t.sub} />
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[hsl(var(--av-accent)/0.4)] bg-[hsl(var(--av-accent-soft))] text-[hsl(var(--av-accent))] text-xs font-mono-tech uppercase tracking-wider shrink-0 mb-4 sm:mb-8 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--av-accent))] animate-pulse" />
              <span>{lang === 'ru' ? 'Крутите страницу вниз для скролла этапов →' : 'Scroll down to move cards horizontally →'}</span>
            </div>
          </div>

          {/* Horizontal Scrolling Card Track (Strictly positioned ABOVE progress bar with z-20) */}
          <div className="my-auto overflow-hidden py-4 relative z-20">
            <motion.div style={{ x }} className="flex gap-6 px-6 md:px-10 min-w-max">
              {t.steps.map(([name, desc, dur], idx) => {
                const deliv = DELIVERABLES[idx] || DELIVERABLES[0]
                const points = lang === 'ru' ? deliv.ru : deliv.en

                return (
                  <div
                    key={name}
                    className="group relative w-[340px] sm:w-[420px] shrink-0 rounded-3xl border border-line bg-[hsl(var(--av-bg-panel)/0.85)] p-6 sm:p-8 backdrop-blur-2xl flex flex-col justify-between hover:border-[hsl(var(--av-accent)/0.6)] hover:shadow-2xl hover:shadow-[hsl(var(--av-accent-glow))] transition-all duration-500"
                  >
                    <div>
                      {/* Step Number & Duration Header */}
                      <div className="flex items-center justify-between border-b border-line pb-4 mb-5">
                        <span className="font-display font-extrabold text-3xl sm:text-4xl text-[hsl(var(--av-accent))] tracking-tight">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-mono-tech text-faint bg-[hsl(var(--av-bg))] px-3 py-1.5 rounded-full border border-line">
                          <Clock className="w-3.5 h-3.5 text-[hsl(var(--av-accent))]" />
                          <span>{dur}</span>
                        </div>
                      </div>

                      {/* Step Title & Subtitle */}
                      <h3 className="font-display font-bold text-xl sm:text-2xl text-foreground tracking-tight group-hover:text-[hsl(var(--av-accent))] transition-colors">
                        {name}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-dim leading-relaxed">
                        {desc}
                      </p>
                    </div>

                    {/* Step Deliverables List */}
                    <div className="mt-6 pt-4 border-t border-line space-y-2">
                      <div className="text-[10px] font-mono-tech uppercase text-faint tracking-wider mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[hsl(var(--av-accent))]" />
                        <span>{lang === 'ru' ? 'Артефакты на выходе:' : 'Key Deliverables:'}</span>
                      </div>
                      {points.map((p, pIdx) => (
                        <div key={pIdx} className="flex items-center gap-2 text-xs text-foreground font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </motion.div>
          </div>

          {/* Bottom Interactive Progress Bar (Positioned below cards with z-10) */}
          <div className="max-w-7xl mx-auto px-6 md:px-10 w-full shrink-0 relative z-10 mt-6 pt-2">
            <div className="flex items-center justify-between text-[11px] font-mono-tech text-faint mb-2">
              <span>{lang === 'ru' ? 'ЭТАП 01 (СТРАТЕГИЯ)' : 'STEP 01 (STRATEGY)'}</span>
              <span className="text-[hsl(var(--av-accent))] font-bold">
                {lang === 'ru' ? 'ПРОЦЕСС РАЗРАБОТКИ AV STUDIO' : 'AV STUDIO ENGINEERING TIMELINE'}
              </span>
              <span>{lang === 'ru' ? 'ЭТАП 06 (SLA ПОДДЕРЖКА)' : 'STEP 06 (SLA SUPPORT)'}</span>
            </div>
            <div className="w-full h-1.5 bg-[hsl(var(--av-bg-raise))] rounded-full overflow-hidden border border-line">
              <motion.div
                style={{ width: progressWidth }}
                className="h-full bg-gradient-to-r from-[hsl(var(--av-accent))] to-emerald-400 rounded-full"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
