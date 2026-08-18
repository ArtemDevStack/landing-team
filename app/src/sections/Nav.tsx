'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Logo } from '../components/ui-bits'
import { useLang, ui } from '../i18n'
import { useOrderModal } from '../context/ModalContext'

export default function Nav() {
  const { lang, setLang } = useLang()
  const { openOrderModal } = useOrderModal()
  const t = ui[lang].nav
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const fn = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100)
      }
      setScrolled(window.scrollY > 24)
    }
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    ['#solutions', t.services],
    ['#architecture', t.architecture],
    ['#sandbox', t.sandbox],
    ['#process', t.process],
  ] as const

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        scrolled ? 'backdrop-blur-xl bg-[hsl(var(--av-bg)/0.85)] border-b border-line shadow-lg' : 'bg-transparent'
      }`}
    >
      {/* Neon Top Scroll Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-[hsl(var(--av-bg-raise))] overflow-hidden z-50">
        <div
          className="h-full bg-gradient-to-r from-[hsl(var(--av-accent))] via-amber-400 to-[hsl(var(--av-accent))] transition-all duration-150 ease-out shadow-[0_0_12px_hsl(var(--av-accent-glow))]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 md:h-[72px] flex items-center justify-between">
        <a href="#top" aria-label="AV Studio — Home" className="transition-transform active:scale-95">
          <Logo />
        </a>

        <nav className="hidden lg:flex items-center gap-7">
          {links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="text-xs font-mono-tech uppercase tracking-wider text-dim hover:text-[hsl(var(--av-accent))] transition-colors duration-300"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center rounded-full border border-line p-0.5 font-mono-tech text-[11px] bg-[hsl(var(--av-bg-raise)/0.6)]">
            {(['ru', 'en'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 rounded-full uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  lang === l ? 'bg-[hsl(var(--av-accent))] text-black font-bold shadow-md' : 'text-faint hover:text-dim'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => openOrderModal()}
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-[hsl(var(--av-accent))] text-black text-xs font-mono-tech uppercase font-bold px-5 py-2.5 hover:shadow-[0_0_28px_hsl(var(--av-accent-glow))] transition-all duration-300 cursor-pointer"
          >
            {t.cta}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 11 L11 3 M5 3 h6 v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>

          {/* Mobile burger */}
          <button
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-full border border-line bg-[hsl(var(--av-bg-raise))]"
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
            <div className="px-6 py-6 flex flex-col gap-4 font-mono-tech">
              {links.map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="text-sm uppercase tracking-wider text-dim hover:text-[hsl(var(--av-accent))] transition-colors"
                >
                  {label}
                </a>
              ))}
              <button
                onClick={() => {
                  setOpen(false)
                  openOrderModal()
                }}
                className="mt-2 inline-flex w-full justify-center items-center gap-2 rounded-full bg-[hsl(var(--av-accent))] text-black font-bold text-xs uppercase px-6 py-3 shadow-lg"
              >
                {t.cta}
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
