import { Reveal, Section, Rail } from '../components/ui-bits'
import { useLang, ui } from '../i18n'

export default function Enterprise() {
  const { lang } = useLang()
  const t = ui[lang].enterprise

  return (
    <>
      <Rail left={t.eyebrow} right="AV / ENTERPRISE GRADE" />
      <Section id="enterprise" className="pt-16 md:pt-24">
        <div className="relative rounded-[2rem] border border-line overflow-hidden bg-[hsl(var(--av-bg-raise)/0.5)]">
          <div className="absolute inset-0 bg-grid-fine opacity-60" aria-hidden />
          <div
            className="absolute -top-32 left-1/4 w-[600px] h-[400px] rounded-full blur-[130px] opacity-[0.08]"
            style={{ background: 'hsl(var(--av-accent))' }}
            aria-hidden
          />

          <div className="relative px-7 md:px-14 py-14 md:py-20">
            <Reveal>
              <div className="font-mono-tech text-[11px] md:text-xs tracking-[0.25em] uppercase text-accent mb-6 flex items-center gap-3">
                <span className="inline-block w-8 h-px bg-[hsl(var(--av-accent))]" />
                {t.eyebrow}
              </div>
            </Reveal>
            <Reveal i={1}>
              <h2 className="font-display text-4xl md:text-6xl font-bold leading-[1.02] max-w-3xl">
                {t.title}
              </h2>
            </Reveal>
            <Reveal i={2}>
              <p className="mt-6 max-w-2xl text-dim text-base md:text-lg leading-relaxed">{t.sub}</p>
            </Reveal>

            <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[hsl(var(--av-line))] border border-line rounded-2xl overflow-hidden">
              {t.items.map(([title, desc], idx) => (
                <Reveal key={title} i={idx % 3} className="h-full">
                  <div className="group h-full bg-[hsl(var(--av-bg))] p-7 md:p-8 hover:bg-[hsl(var(--av-bg-raise))] transition-colors duration-500">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-sm bg-[hsl(var(--av-accent))] group-hover:shadow-[0_0_12px_hsl(var(--av-accent-glow))] transition-shadow duration-500" />
                      <h3 className="font-display font-bold text-lg tracking-tight">{title}</h3>
                    </div>
                    <p className="mt-3 text-sm text-faint group-hover:text-dim leading-relaxed transition-colors duration-500">
                      {desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal i={2}>
              <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-px bg-[hsl(var(--av-line))] border border-line rounded-2xl overflow-hidden">
                {t.stats.map(([num, label]) => (
                  <div key={label} className="bg-[hsl(var(--av-bg))] px-7 py-6 text-center">
                    <div className="font-mono-tech text-2xl md:text-3xl font-semibold text-accent">{num}</div>
                    <div className="mt-1.5 text-xs text-faint uppercase tracking-wider">{label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  )
}
