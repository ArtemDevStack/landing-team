'use client'

import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

/* ---------- Scroll reveal wrapper ---------- */
const revealVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function Reveal({
  children,
  i = 0,
  className,
  once = true,
}: {
  children: ReactNode
  i?: number
  className?: string
  once?: boolean
}) {
  return (
    <motion.div
      className={className}
      variants={revealVariants}
      custom={i}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-80px' }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Section heading block ---------- */
export function SectionHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string
  title: string
  sub?: string
}) {
  return (
    <div className="mb-14 md:mb-20 max-w-3xl">
      <Reveal>
        <div className="font-mono-tech text-[11px] md:text-xs tracking-[0.25em] uppercase text-accent mb-5 flex items-center gap-3">
          <span className="inline-block w-8 h-px bg-[hsl(var(--av-accent))]" />
          {eyebrow}
        </div>
      </Reveal>
      <Reveal i={1}>
        <h2 className="font-display text-4xl md:text-6xl font-bold leading-[1.04]">{title}</h2>
      </Reveal>
      {sub && (
        <Reveal i={2}>
          <p className="mt-6 text-base md:text-lg text-dim leading-relaxed max-w-2xl">{sub}</p>
        </Reveal>
      )}
    </div>
  )
}

/* ---------- Top coordinates rail ---------- */
export function Rail({ left, right }: { left: string; right: string }) {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 pt-6 flex items-center justify-between font-mono-tech text-[10px] tracking-[0.2em] uppercase text-faint border-t border-line">
      <span>{left}</span>
      <span className="hidden sm:block">{right}</span>
    </div>
  )
}

/* ---------- AVT Monogram Logo ---------- */
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center select-none cursor-pointer group" aria-label="AVT Logo">
      <div
        style={{ width: size, height: size }}
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--av-bg-panel))] to-[hsl(var(--av-bg-raise))] border border-[hsl(var(--av-accent)/0.65)] shadow-[0_0_22px_hsl(var(--av-accent-glow))] group-hover:border-[hsl(var(--av-accent))] group-hover:shadow-[0_0_32px_hsl(var(--av-accent-glow))] transition-all duration-300"
      >
        <svg width={size - 10} height={size - 10} viewBox="0 0 36 36" fill="none">
          <defs>
            <linearGradient id="avtLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--av-accent))" />
              <stop offset="100%" stopColor="hsl(42 100% 68%)" />
            </linearGradient>
          </defs>
          {/* Top T-Bar */}
          <path
            d="M 6 8 H 30"
            stroke="url(#avtLogoGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Central T stem */}
          <path
            d="M 18 8 V 28"
            stroke="url(#avtLogoGrad)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* A & V Angled Wings */}
          <path
            d="M 7 28 L 18 8 L 29 28"
            stroke="url(#avtLogoGrad)"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* A Crossbar */}
          <path
            d="M 11 19 H 25"
            stroke="hsl(var(--av-text))"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Node Points */}
          <circle cx="18" cy="8" r="2.2" fill="hsl(var(--av-accent))" />
          <circle cx="6" cy="8" r="2" fill="hsl(var(--av-accent))" />
          <circle cx="30" cy="8" r="2" fill="hsl(var(--av-accent))" />
          <circle cx="18" cy="28" r="2" fill="hsl(var(--av-accent))" />
        </svg>
      </div>
    </div>
  )
}

/* ---------- Section shell ---------- */
export function Section({
  id,
  children,
  className = '',
}: {
  id?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={`relative py-24 md:py-36 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">{children}</div>
    </section>
  )
}
