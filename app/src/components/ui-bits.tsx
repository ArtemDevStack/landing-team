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

/* ---------- AV logo mark ---------- */
export function Logo({ size = 34 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden>
        <rect x="0.5" y="0.5" width="35" height="35" rx="9" stroke="hsl(var(--av-line-strong))" />
        <path d="M9 26 L18 9 L27 26" stroke="hsl(var(--av-accent))" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M13.2 20.4 H22.8" stroke="hsl(var(--av-text))" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="font-display font-extrabold text-xl tracking-tight">AV</span>
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
