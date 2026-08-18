'use client'

import { useRef } from 'react'
import { Reveal, Section, SectionHead, Rail } from '../components/ui-bits'
import { useLang, ui } from '../i18n'

export default function Process() {
  const { lang } = useLang()
  const t = ui[lang].process
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -320 : 320
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' })
    }
  }

  return (
    <>
      <Rail left={t.eyebrow} right="AV / DELIVERY" />
      <Section id="process" className="pt-16 md:pt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <SectionHead eyebrow={t.eyebrow} title={t.title} sub={t.sub} />

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 shrink-0 mb-14 sm:mb-20">
            <button
              onClick={() => scroll('left')}
              className="w-11 h-11 rounded-full border border-line flex items-center justify-center text-dim hover:text-accent hover:border-[hsl(var(--av-accent))] transition-colors"
              aria-label="Scroll left"
            >
              ←
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-11 h-11 rounded-full border border-line flex items-center justify-center text-dim hover:text-accent hover:border-[hsl(var(--av-accent))] transition-colors"
              aria-label="Scroll right"
            >
              →
            </button>
          </div>
        </div>

        <Reveal>
          <div
            ref={scrollRef}
            data-lenis-prevent
            className="relative -mx-6 md:-mx-10 px-6 md:px-10 overflow-x-auto pb-6 cursor-grab active:cursor-grabbing custom-scrollbar-x"
          >
            <div className="flex gap-5 min-w-max">
              {t.steps.map(([name, desc, dur], idx) => (
                <div key={name} className="group relative w-[280px] md:w-[320px] shrink-0">
                  {/* connector line */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-[hsl(var(--av-accent))] bg-[hsl(var(--av-bg))] group-hover:bg-[hsl(var(--av-accent))] group-hover:shadow-[0_0_16px_hsl(var(--av-accent-glow))] transition-all duration-500 shrink-0" />
                    <span className="h-px flex-1 bg-[hsl(var(--av-line-strong))]" />
                    <span className="font-mono-tech text-[10px] tracking-widest text-faint">{dur}</span>
                  </div>

                  <div className="rounded-2xl border border-line bg-[hsl(var(--av-bg-raise)/0.4)] p-6 h-[220px] flex flex-col justify-between group-hover:border-[hsl(var(--av-accent)/0.45)] group-hover:-translate-y-1 transition-all duration-500">
                    <div className="font-display text-4xl font-extrabold text-stroke group-hover:text-accent group-hover:[-webkit-text-stroke:0px] transition-all duration-500">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xl tracking-tight">{name}</h3>
                      <p className="mt-2 text-xs md:text-sm text-faint group-hover:text-dim leading-relaxed transition-colors duration-500">
                        {desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  )
}
