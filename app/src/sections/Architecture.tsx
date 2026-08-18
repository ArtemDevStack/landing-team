'use client'

import { useState } from 'react'
import { Reveal, Section, SectionHead, Rail } from '../components/ui-bits'
import { useLang, ui } from '../i18n'

export default function Architecture() {
  const { lang } = useLang()
  const t = ui[lang].arch
  const [active, setActive] = useState<number | null>(null)

  return (
    <>
      <Rail left={t.eyebrow} right="AV / SYSTEM DESIGN" />
      <Section id="arch" className="pt-16 md:pt-24">
        <SectionHead eyebrow={t.eyebrow} title={t.title} sub={t.sub} />

        <Reveal>
          <div className="relative max-w-4xl mx-auto">
            {/* side flow line */}
            <div className="absolute left-[7px] md:left-[9px] top-4 bottom-4 w-px bg-[hsl(var(--av-line-strong))]" aria-hidden>
              <span className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--av-accent))] via-transparent to-[hsl(var(--av-accent))] opacity-40" />
            </div>

            <div className="flex flex-col gap-3">
              {t.layers.map(([name, desc, tech], idx) => {
                const isActive = active === idx
                return (
                  <div key={name}>
                    <button
                      onMouseEnter={() => setActive(idx)}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive(idx)}
                      onBlur={() => setActive(null)}
                      className={`relative w-full text-left rounded-2xl border pl-10 md:pl-14 pr-6 md:pr-8 py-5 md:py-6 transition-all duration-500 ${
                        isActive
                          ? 'border-[hsl(var(--av-accent)/0.6)] bg-[hsl(var(--av-accent)/0.05)] translate-x-1.5'
                          : 'border-line bg-[hsl(var(--av-bg-raise)/0.4)] hover:border-[hsl(var(--av-line-strong))]'
                      }`}
                    >
                      {/* node dot on the flow line */}
                      <span
                        className={`absolute left-0 top-1/2 -translate-y-1/2 w-[15px] h-[15px] md:w-[19px] md:h-[19px] rounded-full border-2 transition-all duration-500 ${
                          isActive
                            ? 'border-[hsl(var(--av-accent))] bg-[hsl(var(--av-accent))] shadow-[0_0_16px_hsl(var(--av-accent-glow))]'
                            : 'border-[hsl(var(--av-line-strong))] bg-[hsl(var(--av-bg))]'
                        }`}
                      />
                      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
                        <div className="flex items-baseline gap-4 md:gap-6 min-w-0">
                          <span className="font-mono-tech text-xs text-faint shrink-0">
                            L{idx + 1}
                          </span>
                          <div className="min-w-0">
                            <span className={`font-display font-bold text-xl md:text-2xl tracking-tight transition-colors duration-500 ${isActive ? 'text-accent' : ''}`}>
                              {name}
                            </span>
                            <p className="mt-1 text-xs md:text-sm text-faint">{desc}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {tech.map((x) => (
                            <span
                              key={x}
                              className={`font-mono-tech text-[11px] px-2.5 py-1 rounded-md border transition-colors duration-500 ${
                                isActive ? 'border-[hsl(var(--av-accent)/0.5)] text-accent' : 'border-line text-faint'
                              }`}
                            >
                              {x}
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>
                    {idx < t.layers.length - 1 && (
                      <div className="flex justify-start pl-2 md:pl-2.5 py-0.5" aria-hidden>
                        <svg width="12" height="16" viewBox="0 0 12 16">
                          <line x1="6" y1="0" x2="6" y2="10" stroke="hsl(var(--av-line-strong))" strokeWidth="1.4" strokeDasharray="3 3" className="anim-dash" />
                          <path d="M2.5 9 L6 15 L9.5 9" fill="none" stroke="hsl(var(--av-line-strong))" strokeWidth="1.4" />
                        </svg>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  )
}
