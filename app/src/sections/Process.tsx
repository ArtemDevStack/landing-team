import { Reveal, Section, SectionHead, Rail } from '../components/ui-bits'
import { useLang, ui } from '../i18n'

export default function Process() {
  const { lang } = useLang()
  const t = ui[lang].process

  return (
    <>
      <Rail left={t.eyebrow} right="AV / DELIVERY" />
      <Section id="process" className="pt-16 md:pt-24">
        <SectionHead eyebrow={t.eyebrow} title={t.title} sub={t.sub} />

        <Reveal>
          <div className="relative -mx-6 md:-mx-10 px-6 md:px-10 overflow-x-auto pb-4 [scrollbar-width:thin]">
            <div className="flex gap-4 min-w-max">
              {t.steps.map(([name, desc, dur], idx) => (
                <div key={name} className="group relative w-[270px] md:w-[300px] shrink-0">
                  {/* connector line */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className="w-3 h-3 rounded-full border-2 border-[hsl(var(--av-accent))] bg-[hsl(var(--av-bg))] group-hover:bg-[hsl(var(--av-accent))] group-hover:shadow-[0_0_14px_hsl(var(--av-accent-glow))] transition-all duration-500 shrink-0" />
                    <span className="h-px flex-1 bg-[hsl(var(--av-line-strong))]" />
                    <span className="font-mono-tech text-[10px] tracking-widest text-faint">{dur}</span>
                  </div>

                  <div className="rounded-2xl border border-line bg-[hsl(var(--av-bg-raise)/0.4)] p-6 h-[210px] flex flex-col group-hover:border-[hsl(var(--av-accent)/0.45)] group-hover:-translate-y-1 transition-all duration-500">
                    <div className="font-display text-4xl font-extrabold text-stroke group-hover:text-accent group-hover:[-webkit-text-stroke:0px] transition-all duration-500">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <h3 className="mt-auto font-display font-bold text-xl tracking-tight">{name}</h3>
                    <p className="mt-2 text-sm text-faint group-hover:text-dim leading-snug transition-colors duration-500">
                      {desc}
                    </p>
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
