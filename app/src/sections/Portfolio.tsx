'use client'

import { Reveal, Section, SectionHead, Rail } from '../components/ui-bits'
import { useLang, ui } from '../i18n'
import { FolderGit2, Sparkles, Clock, Layers } from 'lucide-react'

export default function Portfolio() {
  const { lang } = useLang()
  const t = ui[lang].cases

  return (
    <>
      <Rail left={t.eyebrow} right="AV / PORTFOLIO" />
      <Section id="cases" className="pt-16 md:pt-24">
        <SectionHead eyebrow={t.eyebrow} title={t.title} sub={t.sub} />

        <Reveal>
          <div className="relative rounded-3xl border border-line bg-[hsl(var(--av-bg-raise)/0.4)] p-8 md:p-16 text-center overflow-hidden backdrop-blur-xl shadow-2xl">
            {/* Ambient Background Glow */}
            <div
              className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[140px] opacity-25 pointer-events-none"
              style={{ background: 'hsl(var(--av-accent))' }}
            />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              {/* Icon Badge */}
              <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--av-accent-soft))] border border-[hsl(var(--av-accent)/0.4)] flex items-center justify-center mx-auto text-[hsl(var(--av-accent))] shadow-lg shadow-[hsl(var(--av-accent-glow))]">
                <FolderGit2 className="w-8 h-8" />
              </div>

              {/* Tag / Status Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[hsl(var(--av-accent)/0.4)] bg-[hsl(var(--av-accent-soft))] font-mono-tech text-xs font-bold text-[hsl(var(--av-accent))] uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[hsl(var(--av-accent))] animate-pulse" />
                {lang === 'ru' ? 'Портфолио обновляется' : 'Portfolio In Progress'}
              </div>

              {/* Headline requested by user */}
              <h3 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                {lang === 'ru' ? 'Проекты добавлю попозже' : 'Projects will be added later'}
              </h3>

              {/* Subtext */}
              <p className="text-sm md:text-base text-dim leading-relaxed font-sans max-w-xl mx-auto">
                {lang === 'ru'
                  ? 'В данный момент мы оформляем кейсы и архитектурные разборы реализованных систем. Скоро здесь появятся подробные материалы.'
                  : 'We are currently preparing detailed case studies and architectural specifications for our projects. Detailed materials will be added soon.'}
              </p>

              {/* Tech details grid */}
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                <div className="p-4 rounded-xl border border-line bg-[hsl(var(--av-bg))] space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono-tech text-[hsl(var(--av-accent))] font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>{lang === 'ru' ? 'Кейсы & Метрики' : 'Cases & Metrics'}</span>
                  </div>
                  <p className="text-[11px] text-faint">
                    {lang === 'ru' ? 'Реальные цифры окупаемости' : 'Real ROI & payback numbers'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-line bg-[hsl(var(--av-bg))] space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono-tech text-[hsl(var(--av-accent))] font-bold">
                    <Layers className="w-4 h-4" />
                    <span>{lang === 'ru' ? 'Архитектура' : 'Architecture'}</span>
                  </div>
                  <p className="text-[11px] text-faint">
                    {lang === 'ru' ? 'Схемы сервисов и API' : 'Service & API diagrams'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-line bg-[hsl(var(--av-bg))] space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono-tech text-[hsl(var(--av-accent))] font-bold">
                    <Clock className="w-4 h-4" />
                    <span>{lang === 'ru' ? 'Скоро публикация' : 'Coming Soon'}</span>
                  </div>
                  <p className="text-[11px] text-faint">
                    {lang === 'ru' ? 'Обновление в ближайшее время' : 'Updating materials shortly'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  )
}
