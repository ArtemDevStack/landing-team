'use client'

import { Reveal, Section, SectionHead, Rail } from '../components/ui-bits'
import { useLang, ui } from '../i18n'
import { useOrderModal } from '../context/ModalContext'

export default function FullCycle() {
  const { lang } = useLang()
  const { openOrderModal } = useOrderModal()
  const t = ui[lang].cycle

  return (
    <>
      <Rail left={t.eyebrow} right="AV / FULL CYCLE" />
      <Section className="pt-16 md:pt-24">
        <SectionHead eyebrow={t.eyebrow} title={t.title} sub={t.sub} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[hsl(var(--av-line))] rounded-2xl overflow-hidden border border-line">
          {t.steps.map(([name, desc], idx) => (
            <Reveal key={name} i={idx % 4} className="h-full">
              <div className="group relative h-full bg-[hsl(var(--av-bg))] hover:bg-[hsl(var(--av-bg-raise))] transition-colors duration-500 p-7 md:p-8 flex flex-col min-h-[190px]">
                <div className="font-mono-tech text-xs text-faint group-hover:text-accent transition-colors duration-500">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div className="mt-auto pt-8">
                  <div className="font-display font-bold text-lg md:text-xl tracking-tight group-hover:text-accent transition-colors duration-500">
                    {name}
                  </div>
                  <div className="mt-2 text-sm text-faint group-hover:text-dim leading-snug transition-colors duration-500">
                    {desc}
                  </div>
                </div>
                <span className="absolute top-0 left-0 h-[2px] w-0 bg-[hsl(var(--av-accent))] group-hover:w-full transition-all duration-700 ease-out" />
              </div>
            </Reveal>
          ))}
          {/* Filler cell with CTA */}
          <Reveal i={3} className="h-full">
            <div className="relative h-full bg-[hsl(var(--av-bg-raise)/0.4)] p-7 md:p-8 flex flex-col min-h-[190px] items-start justify-between">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" className="anim-float">
                <path
                  d="M24 15 a9 9 0 1 1 -3 -6.7"
                  stroke="hsl(var(--av-accent))"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path d="M21 3.5 v5 h-5" stroke="hsl(var(--av-accent))" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              <div>
                <p className="font-mono-tech text-[11px] tracking-[0.18em] uppercase text-faint leading-relaxed">
                  {lang === 'ru' ? 'Цикл не заканчивается — продукт растёт' : 'The loop never ends — the product keeps growing'}
                </p>
                <button
                  onClick={() => openOrderModal('Full Cycle')}
                  className="mt-3 font-mono-tech text-xs text-[hsl(var(--av-accent))] hover:underline flex items-center gap-1"
                >
                  {lang === 'ru' ? 'Запустить цикл →' : 'Start Full Cycle →'}
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  )
}
