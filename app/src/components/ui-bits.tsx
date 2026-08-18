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
export function Logo({ size = 38, showText = false }: { size?: number; showText?: boolean }) {
  return (
    <div className="flex items-center gap-3 select-none cursor-pointer group" aria-label="AV Logo">
      <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_16px_hsl(var(--av-accent-glow))]"
        >
          <defs>
            <linearGradient id="avGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--av-accent))" />
              <stop offset="100%" stopColor="hsl(45 100% 68%)" />
            </linearGradient>
            <linearGradient id="avGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--av-accent))" stopOpacity="0.9" />
              <stop offset="100%" stopColor="hsl(var(--av-accent-soft))" />
            </linearGradient>
          </defs>

          {/* Futuristic Hex Shield Contour */}
          <path
            d="M 20 3 L 36 11.5 V 28.5 L 20 37 L 4 28.5 V 11.5 Z"
            fill="hsl(var(--av-bg-raise))"
            stroke="url(#avGrad1)"
            strokeWidth="1.5"
            strokeOpacity="0.65"
          />

          {/* Interlocking Monogram A & V */}
          {/* A Left Leg */}
          <path
            d="M 10 28 L 20 8 L 24 8 L 14 28 Z"
            fill="url(#avGrad1)"
          />
          {/* A Right Leg */}
          <path
            d="M 30 28 L 20 8 L 16 8 L 26 28 Z"
            fill="url(#avGrad1)"
          />
          {/* V Downward Apex Overlay */}
          <path
            d="M 13 13 L 20 32 L 27 13 L 23 13 L 20 25 L 17 13 Z"
            fill="hsl(var(--av-accent))"
            fillOpacity="0.9"
          />

          {/* A Crossbar */}
          <line
            x1="12"
            y1="20"
            x2="28"
            y2="20"
            stroke="hsl(var(--av-accent))"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Glowing Tech Nodes */}
          <circle cx="20" cy="8" r="2" fill="#ffffff" />
          <circle cx="20" cy="32" r="2" fill="hsl(var(--av-accent))" />
          <circle cx="10" cy="28" r="1.5" fill="hsl(var(--av-accent))" />
          <circle cx="30" cy="28" r="1.5" fill="hsl(var(--av-accent))" />
        </svg>
      </div>
      {showText && (
        <span className="font-mono-tech font-bold text-lg tracking-wider text-foreground group-hover:text-accent transition-colors duration-300">
          AV<span className="text-accent">.</span>
        </span>
      )}
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
