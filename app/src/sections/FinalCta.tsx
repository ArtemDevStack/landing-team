'use client'

import { motion } from 'framer-motion'
import { Logo, Reveal } from '../components/ui-bits'
import { useLang, ui } from '../i18n'
import { useOrderModal } from '../context/ModalContext'
import { DEFAULT_CONTACT_EMAIL } from '../lib/notifications'

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
  const { openOrderModal } = useOrderModal()
  const t = ui[lang].cta
  const f = ui[lang].footer
  const contactMail = DEFAULT_CONTACT_EMAIL || t.mail

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
            <div className="mt-9 sm:mt-11 flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={() => openOrderModal()}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-[hsl(var(--av-accent))] text-black font-bold px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg hover:shadow-[0_0_56px_hsl(var(--av-accent-glow))] transition-all duration-300"
              >
                {t.button}
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <path d="M3 13 L13 3 M6 3 h7 v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
              <a
                href={`mailto:${contactMail}`}
                className="font-mono-tech text-sm text-dim hover:text-accent transition-colors duration-300 border-b border-dashed border-[hsl(var(--av-line-strong))] hover:border-[hsl(var(--av-accent))] pb-0.5"
              >
                {contactMail}
              </a>
            </div>
          </Reveal>
          <Reveal i={3}>
            <p className="mt-8 text-xs text-faint font-mono-tech">{t.note}</p>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line bg-[hsl(var(--av-bg-panel)/0.4)]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr] gap-8 sm:gap-10 md:gap-12">
          <div>
            <Logo />
            <p className="mt-5 text-xs text-dim max-w-xs leading-relaxed font-mono-tech">{f.tagline}</p>
            <div className="mt-4 flex flex-col gap-1 text-xs font-mono-tech text-dim">
              <span>Email: <a href={`mailto:${contactMail}`} className="text-accent hover:underline font-bold">{contactMail}</a></span>
              <span>Telegram: <a href="https://t.me/av_digital_studio" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-bold">@av_digital_studio</a></span>
            </div>
          </div>
          {f.cols.map(([title, links], colIdx) => (
            <div key={title}>
              <div className="font-mono-tech text-[11px] tracking-[0.22em] uppercase text-faint mb-5 font-bold">{title}</div>
              <ul className="flex flex-col gap-3">
                {links.map((l, li) => {
                  const hrefsCol0 = ['#solutions', '#solutions', '#sandbox', '#integrations', '#architecture']
                  const hrefsCol1 = ['#pipeline-scroll', '#architecture', '#sandbox', '#process', '#contact']
                  const targetHref = colIdx === 0 ? (hrefsCol0[li] || '#solutions') : (hrefsCol1[li] || '#contact')
                  return (
                    <li key={l}>
                      <a
                        href={targetHref}
                        className="text-xs font-mono-tech text-dim hover:text-[hsl(var(--av-accent))] transition-colors duration-300"
                      >
                        {l}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-line">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex flex-wrap items-center justify-between gap-4 font-mono-tech text-[11px] text-faint">
            <span>{f.rights}</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {lang === 'ru' ? 'Все системы в норме • 99.99% SLA' : 'All systems operational • 99.99% SLA'}
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}
