import { Reveal, Section, SectionHead, Rail } from '../components/ui-bits'
import { useLang, ui } from '../i18n'

function CornerTicks() {
  const cls = 'absolute w-4 h-4 border-[hsl(var(--av-accent)/0.7)]'
  return (
    <>
      <span className={`${cls} top-0 left-0 border-t-2 border-l-2`} />
      <span className={`${cls} top-0 right-0 border-t-2 border-r-2`} />
      <span className={`${cls} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${cls} bottom-0 right-0 border-b-2 border-r-2`} />
    </>
  )
}

export default function Portfolio() {
  const { lang } = useLang()
  const t = ui[lang].cases
  const [L1, L2, L3, L4, L5] = t.labels

  return (
    <>
      <Rail left={t.eyebrow} right="AV / SELECTED WORK" />
      <Section id="cases" className="pt-16 md:pt-24">
        <SectionHead eyebrow={t.eyebrow} title={t.title} sub={t.sub} />

        <div className="flex flex-col gap-10 md:gap-16">
          {t.items.map((c, ci) => (
            <Reveal key={c.id}>
              <article className="group relative rounded-3xl border border-line bg-[hsl(var(--av-bg-raise)/0.45)] overflow-hidden hover:border-[hsl(var(--av-line-strong))] transition-colors duration-500">
                {/* Case header */}
                <div className="relative px-7 md:px-12 pt-9 md:pt-12 pb-8 border-b border-line bg-grid-fine">
                  <div className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                      <div className="font-mono-tech text-[11px] tracking-[0.25em] uppercase text-accent mb-3">
                        CASE {c.id} — {c.tag}
                      </div>
                      <h3 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight group-hover:text-accent transition-colors duration-500">
                        {c.name}
                      </h3>
                    </div>
                    <div className="font-display font-extrabold text-stroke text-7xl md:text-8xl leading-none opacity-60 select-none" aria-hidden>
                      {c.id}
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-0">
                  {/* Left: task + solution */}
                  <div className="px-7 md:px-12 py-9 md:py-12 flex flex-col gap-9 border-b lg:border-b-0 lg:border-r border-line">
                    <div>
                      <div className="font-mono-tech text-[11px] tracking-[0.22em] uppercase text-faint mb-3">{L1}</div>
                      <p className="text-dim leading-relaxed">{c.task}</p>
                    </div>
                    <div>
                      <div className="font-mono-tech text-[11px] tracking-[0.22em] uppercase text-faint mb-3">{L2}</div>
                      <p className="leading-relaxed">{c.solution}</p>
                    </div>
                    <div className="mt-auto">
                      <div className="font-mono-tech text-[11px] tracking-[0.22em] uppercase text-faint mb-4">{L5}</div>
                      <div className="flex flex-wrap gap-2">
                        {c.stack.map((s) => (
                          <span
                            key={s}
                            className="font-mono-tech text-xs px-3 py-1.5 rounded-full border border-line text-dim hover:border-[hsl(var(--av-accent)/0.6)] hover:text-accent transition-colors duration-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: architecture + result */}
                  <div className="px-7 md:px-12 py-9 md:py-12 flex flex-col gap-9">
                    <div>
                      <div className="font-mono-tech text-[11px] tracking-[0.22em] uppercase text-faint mb-3">{L3}</div>
                      <div className="relative bg-[hsl(var(--av-bg))] border border-line p-5 md:p-6">
                        <CornerTicks />
                        <p className="font-mono-tech text-xs md:text-[13px] leading-relaxed text-dim">{c.arch}</p>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <div className="font-mono-tech text-[11px] tracking-[0.22em] uppercase text-faint mb-3">{L4}</div>
                      <div className="relative rounded-2xl border border-[hsl(var(--av-accent)/0.35)] bg-[hsl(var(--av-accent)/0.06)] p-5 md:p-6">
                        <span className="absolute -top-px left-6 right-6 h-px bg-[hsl(var(--av-accent))]" aria-hidden />
                        <p className="text-base md:text-lg font-semibold leading-relaxed">{c.result}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {ci === 0 && (
                  <span className="pointer-events-none absolute -inset-24 bg-[radial-gradient(circle_at_70%_10%,hsl(var(--av-accent)/0.05),transparent_55%)]" aria-hidden />
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  )
}
