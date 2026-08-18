import { Reveal, Section, SectionHead, Rail } from '../components/ui-bits'
import { useLang, ui } from '../i18n'

const ICONS = [
  // Web
  <path key="w" d="M4 5 h24 v18 H4 Z M4 10 h24 M8 7.5 h.01 M11 7.5 h.01" strokeLinecap="round" />,
  // CRM
  <path key="c" d="M5 8 h22 M5 16 h22 M5 24 h14 M9 4 v8 M9 12 v8 M9 20 v8" strokeLinecap="round" />,
  // Integrations
  <path key="i" d="M8 16 a4 4 0 1 0 0.01 0 M24 8 a4 4 0 1 0 0.01 0 M24 24 a4 4 0 1 0 0.01 0 M11.5 14 l8.5-4 M11.5 18 l8.5 4" strokeLinecap="round" />,
  // SaaS
  <path key="s" d="M16 4 l10 6 v12 l-10 6 -10-6 V10 Z M16 4 v12 M16 16 l10-6 M16 16 L6 10" strokeLinejoin="round" />,
  // AI
  <path key="a" d="M16 6 v4 M16 22 v4 M6 16 h4 M22 16 h4 M9 9 l3 3 M20 20 l3 3 M23 9 l-3 3 M12 20 l-3 3 M12 12 h8 v8 h-8 Z" strokeLinecap="round" />,
  // Growth
  <path key="g" d="M5 26 h22 M8 22 l6-7 5 4 7-10 M26 9 v4 h-4" strokeLinecap="round" strokeLinejoin="round" />,
]

export default function Services() {
  const { lang } = useLang()
  const t = ui[lang].services

  return (
    <>
      <Rail left={t.eyebrow} right="AV / CAPABILITIES" />
      <Section id="services" className="pt-16 md:pt-24">
        <SectionHead eyebrow={t.eyebrow} title={t.title} sub={t.sub} />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.items.map((s, idx) => (
            <Reveal key={s.title} i={idx % 3} className="h-full">
              <div className="group relative h-full rounded-3xl border border-line bg-[hsl(var(--av-bg-raise)/0.45)] p-8 md:p-9 flex flex-col overflow-hidden hover:border-[hsl(var(--av-accent)/0.45)] hover:-translate-y-1.5 transition-all duration-500">
                <span
                  className="pointer-events-none absolute -top-24 -right-24 w-56 h-56 rounded-full blur-[80px] opacity-0 group-hover:opacity-[0.14] transition-opacity duration-700"
                  style={{ background: 'hsl(var(--av-accent))' }}
                  aria-hidden
                />
                <div className="flex items-start justify-between">
                  <svg
                    width="34" height="34" viewBox="0 0 32 32" fill="none"
                    stroke="hsl(var(--av-accent))" strokeWidth="1.6"
                    className="opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  >
                    {ICONS[idx]}
                  </svg>
                  <span className="font-mono-tech text-xs text-faint">{String(idx + 1).padStart(2, '0')}</span>
                </div>

                <h3 className="mt-8 font-display text-2xl font-bold tracking-tight">{s.title}</h3>
                <p className="mt-3 text-sm text-dim leading-relaxed">{s.desc}</p>

                <ul className="mt-6 pt-6 border-t border-line flex flex-col gap-2.5">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-3 text-sm text-faint group-hover:text-dim transition-colors duration-500">
                      <span className="w-1 h-1 rounded-full bg-[hsl(var(--av-accent))] shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  )
}
