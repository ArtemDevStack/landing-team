'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Reveal } from '../components/ui-bits'
import { useLang, ui } from '../i18n'
import { useOrderModal } from '../context/ModalContext'

const PIPELINE = {
  ru: [
    ['IDEA', 'Стратегия и экономика продукта'],
    ['DESIGN', 'UX/UI и дизайн-система'],
    ['DEVELOPMENT', 'Инженерия и код'],
    ['AI', 'Агенты, RAG, автоматизация'],
    ['GROWTH', 'Маркетинг и масштабирование'],
  ],
  en: [
    ['IDEA', 'Strategy & product economics'],
    ['DESIGN', 'UX/UI & design system'],
    ['DEVELOPMENT', 'Engineering & code'],
    ['AI', 'Agents, RAG, automation'],
    ['GROWTH', 'Marketing & scaling'],
  ],
} as const

function Pipeline() {
  const { lang } = useLang()
  const nodes = PIPELINE[lang]
  const [active, setActive] = useState(2)

  return (
    <div className="mt-16 md:mt-20">
      {/* Desktop / tablet: horizontal chain */}
      <div className="hidden md:grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] items-stretch gap-0">
        {nodes.map(([label, desc], idx) => (
          <div key={label} className="contents">
            <button
              onMouseEnter={() => setActive(idx)}
              onFocus={() => setActive(idx)}
              className={`group relative rounded-2xl border px-4 py-5 text-left transition-all duration-500 ${
                active === idx
                  ? 'border-[hsl(var(--av-accent)/0.7)] bg-[hsl(var(--av-accent)/0.07)] shadow-[0_0_40px_hsl(var(--av-accent-glow))]'
                  : 'border-line bg-[hsl(var(--av-bg-raise)/0.5)] hover:border-[hsl(var(--av-line-strong))]'
              }`}
            >
              <div className="font-mono-tech text-[10px] tracking-[0.25em] text-faint mb-2">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div
                className={`font-display font-bold text-sm lg:text-base tracking-tight transition-colors duration-500 ${
                  active === idx ? 'text-accent' : 'text-foreground'
                }`}
              >
                {label}
              </div>
              <div
                className={`mt-2 text-xs leading-snug transition-all duration-500 ${
                  active === idx ? 'text-dim opacity-100' : 'text-faint opacity-60'
                }`}
              >
                {desc}
              </div>
              <span
                className={`absolute -bottom-px left-4 right-4 h-px bg-[hsl(var(--av-accent))] transition-opacity duration-500 ${
                  active === idx ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </button>
            {idx < nodes.length - 1 && (
              <div className="flex items-center px-1 lg:px-2" aria-hidden>
                <svg width="40" height="12" viewBox="0 0 40 12" className="lg:w-12">
                  <line
                    x1="0" y1="6" x2="30" y2="6"
                    stroke={active === idx || active === idx + 1 ? 'hsl(var(--av-accent))' : 'hsl(var(--av-line-strong))'}
                    strokeWidth="1.5"
                    strokeDasharray="5 5"
                    className="anim-dash transition-colors duration-500"
                  />
                  <path
                    d="M30 2 L38 6 L30 10"
                    fill="none"
                    stroke={active === idx || active === idx + 1 ? 'hsl(var(--av-accent))' : 'hsl(var(--av-line-strong))'}
                    strokeWidth="1.5"
                    className="transition-colors duration-500"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: vertical chain */}
      <div className="md:hidden flex flex-col">
        {nodes.map(([label, desc], idx) => (
          <div key={label}>
            <button
              onClick={() => setActive(idx)}
              className={`w-full rounded-2xl border px-5 py-4 text-left transition-all duration-500 ${
                active === idx
                  ? 'border-[hsl(var(--av-accent)/0.7)] bg-[hsl(var(--av-accent)/0.07)]'
                  : 'border-line bg-[hsl(var(--av-bg-raise)/0.5)]'
              }`}
            >
              <div className="flex items-baseline justify-between">
                <span className={`font-display font-bold tracking-tight ${active === idx ? 'text-accent' : ''}`}>
                  {label}
                </span>
                <span className="font-mono-tech text-[10px] tracking-[0.25em] text-faint">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </div>
              <div className={`mt-1 text-xs ${active === idx ? 'text-dim' : 'text-faint'}`}>{desc}</div>
            </button>
            {idx < nodes.length - 1 && (
              <div className="flex justify-center py-1" aria-hidden>
                <svg width="12" height="20" viewBox="0 0 12 20">
                  <line x1="6" y1="0" x2="6" y2="13" stroke="hsl(var(--av-line-strong))" strokeWidth="1.5" strokeDasharray="4 4" className="anim-dash" />
                  <path d="M2 12 L6 19 L10 12" fill="none" stroke="hsl(var(--av-line-strong))" strokeWidth="1.5" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Hero() {
  const { lang } = useLang()
  const { openOrderModal } = useOrderModal()
  const t = ui[lang].hero

  return (
    <section id="top" className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-28 pb-20">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid mask-fade-b opacity-70" aria-hidden />
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[140px] opacity-[0.10]"
        style={{ background: 'hsl(var(--av-accent))' }}
        aria-hidden
      />
      <div
        className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full blur-[160px] opacity-[0.05]"
        style={{ background: 'hsl(210 80% 60%)' }}
        aria-hidden
      />
      {/* Watermark */}
      <div
        className="pointer-events-none select-none absolute -right-8 top-24 font-display font-extrabold text-stroke leading-none text-[38vw] lg:text-[26vw] opacity-[0.16]"
        aria-hidden
      >
        AV
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 w-full">
        <Reveal>
          <div className="inline-flex items-center gap-3 rounded-full border border-line bg-[hsl(var(--av-bg-raise)/0.6)] px-4 py-2 font-mono-tech text-[11px] tracking-[0.2em] uppercase text-dim">
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--av-accent))] anim-pulse-node" />
            {t.badge}
          </div>
        </Reveal>

        <Reveal i={1}>
          <h1 className="mt-8 font-display font-extrabold tracking-tight leading-[0.98] text-[13vw] sm:text-7xl lg:text-[5.6rem] max-w-5xl">
            {t.titleA}
            <br />
            <span className="text-accent text-glow">{t.titleB}</span>
          </h1>
        </Reveal>

        <Reveal i={2}>
          <p className="mt-8 max-w-xl text-base md:text-lg text-dim leading-relaxed">{t.sub}</p>
        </Reveal>

        <Reveal i={3}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <motion.button
              onClick={() => openOrderModal()}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 rounded-full bg-[hsl(var(--av-accent))] text-black font-bold px-8 py-4 text-base hover:shadow-[0_0_48px_hsl(var(--av-accent-glow))] transition-shadow duration-300"
            >
              {t.cta1}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 13 L13 3 M6 3 h7 v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
            <motion.a
              href="#cases"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 rounded-full border border-line-strong px-8 py-4 text-base font-semibold text-foreground hover:border-[hsl(var(--av-accent)/0.6)] hover:text-accent transition-colors duration-300"
            >
              {t.cta2}
            </motion.a>
          </div>
        </Reveal>

        {/* Stats */}
        <Reveal i={4}>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 border-t border-line">
            {t.stats.map(([num, label], idx) => (
              <div
                key={label}
                className={`py-6 pr-6 ${idx !== 0 ? 'md:border-l md:border-line md:pl-6' : ''}`}
              >
                <div className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">{num}</div>
                <div className="mt-1 text-xs md:text-sm text-faint">{label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal i={5}>
          <Pipeline />
        </Reveal>
      </div>
    </section>
  )
}
