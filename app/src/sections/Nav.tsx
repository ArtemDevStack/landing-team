import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Logo } from '../components/ui-bits'
import { useLang, ui } from '../i18n'

export default function Nav() {
  const { lang, setLang } = useLang()
  const t = ui[lang].nav
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    ['#cases', t.cases],
    ['#services', t.services],
    ['#integrations', t.integrations],
    ['#enterprise', t.enterprise],
    ['#process', t.process],
  ] as const

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'backdrop-blur-xl bg-[hsl(var(--av-bg)/0.82)] border-b border-line' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 md:h-[72px] flex items-center justify-between">
        <a href="#top" aria-label="AV — home">
          <Logo />
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="text-sm text-dim hover:text-foreground transition-colors duration-300"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Lang switch */}
          <div className="flex items-center rounded-full border border-line p-0.5 font-mono-tech text-[11px]">
            {(['ru', 'en'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 rounded-full uppercase tracking-wider transition-all duration-300 ${
                  lang === l ? 'bg-[hsl(var(--av-accent))] text-black font-semibold' : 'text-faint hover:text-dim'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <a
            href="#contact"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-[hsl(var(--av-accent))] text-black text-sm font-semibold px-5 py-2.5 hover:shadow-[0_0_28px_hsl(var(--av-accent-glow))] transition-shadow duration-300"
          >
            {t.cta}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 11 L11 3 M5 3 h6 v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          {/* Mobile burger */}
          <button
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-full border border-line"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <span className={`block w-4 h-px bg-foreground transition-transform duration-300 ${open ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
            <span className={`block w-4 h-px bg-foreground transition-transform duration-300 ${open ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden border-b border-line bg-[hsl(var(--av-bg)/0.96)] backdrop-blur-xl"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {links.map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="text-lg text-dim hover:text-foreground transition-colors"
                >
                  {label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-[hsl(var(--av-accent))] text-black font-semibold px-6 py-3"
              >
                {t.cta}
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
