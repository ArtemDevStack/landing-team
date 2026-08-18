'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Reveal } from '../components/ui-bits'
import { useLang, ui } from '../i18n'
import { useOrderModal } from '../context/ModalContext'


function AnimatedCounter({ value, duration = 2 }: { value: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/)
  const targetNum = match ? parseFloat(match[2]) : 0

  useEffect(() => {
    if (!isInView || targetNum <= 0) return

    let startTime: number | null = null
    let animationFrameId: number

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = (timestamp - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)

      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = targetNum * easeOut

      setCount(current)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step)
      }
    }

    animationFrameId = requestAnimationFrame(step)

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [isInView, targetNum, duration])

  if (!match) return <span>{value}</span>

  const prefix = match[1]
  const suffix = match[3]
  const isFloat = match[2].includes('.')
  const formatted = isFloat ? count.toFixed(1) : Math.floor(count)

  return (
    <span ref={ref} className="inline-block tabular-nums">
      {prefix}
      {isInView ? formatted : '0'}
      {suffix}
    </span>
  )
}



export default function Hero() {
  const { lang } = useLang()
  const { openOrderModal } = useOrderModal()
  const t = ui[lang].hero

  return (
    <section id="top" className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-28 pb-16">
      {/* Dynamic Ambient Background layers */}
      <div className="absolute inset-0 bg-grid mask-fade-b opacity-70" aria-hidden />
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[140px] opacity-[0.12]"
        style={{ background: 'hsl(var(--av-accent))' }}
        aria-hidden
      />
      <div
        className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full blur-[160px] opacity-[0.07]"
        style={{ background: 'hsl(210 80% 60%)' }}
        aria-hidden
      />

      {/* Futuristic Watermark */}
      <div
        className="pointer-events-none select-none absolute -right-8 top-24 font-display font-extrabold text-stroke leading-none text-[38vw] lg:text-[26vw] opacity-[0.14]"
        aria-hidden
      >
        AV
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 w-full">
        <Reveal>
          <div className="inline-flex items-center gap-3 rounded-full border border-line bg-[hsl(var(--av-bg-raise)/0.6)] px-4 py-2 font-mono-tech text-[11px] tracking-[0.2em] uppercase text-dim shadow-md backdrop-blur-md">
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
              className="inline-flex items-center gap-3 rounded-full bg-[hsl(var(--av-accent))] text-black font-bold px-8 py-4 text-base hover:shadow-[0_0_48px_hsl(var(--av-accent-glow))] transition-all duration-300"
            >
              {t.cta1}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 13 L13 3 M6 3 h7 v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
            <motion.a
              href="#why-us"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 rounded-full border border-line-strong px-8 py-4 text-base font-semibold text-foreground hover:border-[hsl(var(--av-accent)/0.6)] hover:text-accent transition-colors duration-300 bg-[hsl(var(--av-bg-raise)/0.4)]"
            >
              {lang === 'ru' ? '⚡ Почему с нами выгоднее' : '⚡ Why Choose AV Team'}
            </motion.a>
          </div>
        </Reveal>

        {/* Animated Counting Stats */}
        <Reveal i={4}>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 border-t border-line pt-4">
            {t.stats.map(([num, label], idx) => (
              <div
                key={label}
                className={`py-5 pr-6 ${idx !== 0 ? 'md:border-l md:border-line md:pl-6' : ''}`}
              >
                <div className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-foreground group">
                  <span className="text-[hsl(var(--av-accent))] text-glow">
                    <AnimatedCounter value={num} duration={2.2} />
                  </span>
                </div>
                <div className="mt-1.5 text-xs md:text-sm font-mono-tech text-faint uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </Reveal>


      </div>
    </section>
  )
}
