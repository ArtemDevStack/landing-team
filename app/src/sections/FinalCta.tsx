import { motion } from 'framer-motion'
import { Logo, Reveal } from '../components/ui-bits'
import { useLang, ui } from '../i18n'

const TICKER = [
  'WEB', 'E-COMMERCE', 'CRM', 'SAAS', 'AI AGENTS', 'RAG', 'INTEGRATIONS',
  'KUBERNETES', 'SEO', 'ANALYTICS', 'B2B PORTALS', 'AUTOMATION',
]

function Marquee() {
  const row = [...TICKER, ...TICKER]
  return (
    <div className="relative overflow-hidden border-y border-line py-5 mask-fade-x" aria-hidden>
      <div className="flex w-max anim-marquee gap-10">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-10 font-mono-tech text-sm tracking-[0.3em] text-faint whitespace-nowrap">
            {w}
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--av-accent)/0.6)]" />
          </span>
        ))}
      </div>
    </div>
  )
}

export default function FinalCta() {
  const { lang } = useLang()
  const t = ui[lang].cta
  const f = ui[lang].footer

  return (
    <>
      <Marquee />

      {/* Final CTA */}
      <section id="contact" className="relative py-28 md:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-50" aria-hidden />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[150px] opacity-[0.09]"
          style={{ background: 'hsl(var(--av-accent))' }}
          aria-hidden
        />
        <div className="relative max-w-4xl mx-auto px-6 md:px-10 text-center">
          <Reveal>
            <h2 className="font-display font-extrabold tracking-tight leading-[1.02] text-4xl sm:text-6xl md:text-7xl">
              {t.title}
            </h2>
          </Reveal>
          <Reveal i={1}>
            <p className="mt-7 text-dim text-base md:text-lg max-w-xl mx-auto leading-relaxed">{t.sub}</p>
          </Reveal>
          <Reveal i={2}>
            <div className="mt-11 flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href={`mailto:${t.mail}`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-3 rounded-full bg-[hsl(var(--av-accent))] text-black font-bold px-10 py-5 text-lg hover:shadow-[0_0_56px_hsl(var(--av-accent-glow))] transition-shadow duration-300"
              >
                {t.button}
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <path d="M3 13 L13 3 M6 3 h7 v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.a>
              <a
                href={`mailto:${t.mail}`}
                className="font-mono-tech text-sm text-dim hover:text-accent transition-colors duration-300 border-b border-dashed border-[hsl(var(--av-line-strong))] hover:border-[hsl(var(--av-accent))] pb-0.5"
              >
                {t.mail}
              </a>
            </div>
          </Reveal>
          <Reveal i={3}>
            <p className="mt-8 text-xs text-faint">{t.note}</p>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-14 grid md:grid-cols-[1.4fr_1fr_1fr] gap-12">
          <div>
            <Logo />
            <p className="mt-5 text-dim max-w-xs leading-relaxed">{f.tagline}</p>
          </div>
          {f.cols.map(([title, links], colIdx) => (
            <div key={title}>
              <div className="font-mono-tech text-[11px] tracking-[0.22em] uppercase text-faint mb-5">{title}</div>
              <ul className="flex flex-col gap-3">
                {links.map((l, li) => (
                  <li key={l}>
                    <a
                      href={colIdx === 0 ? '#services' : ['#cases', '#process', '#arch', '#contact'][li] ?? '#top'}
                      className="text-sm text-dim hover:text-accent transition-colors duration-300"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-line">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex flex-wrap items-center justify-between gap-4 font-mono-tech text-[11px] text-faint">
            <span>{f.rights}</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--av-accent))] anim-pulse-node" />
              {lang === 'ru' ? 'Системы в норме' : 'All systems operational'}
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}
