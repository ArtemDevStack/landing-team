import { useState } from 'react'
import { LangContext, type Lang } from '../i18n'
import Nav from '../sections/Nav'
import Hero from '../sections/Hero'
import FullCycle from '../sections/FullCycle'
import Portfolio from '../sections/Portfolio'
import Services from '../sections/Services'
import Integrations from '../sections/Integrations'
import Enterprise from '../sections/Enterprise'
import Architecture from '../sections/Architecture'
import Process from '../sections/Process'
import FinalCta from '../sections/FinalCta'

export default function Home() {
  const [lang, setLang] = useState<Lang>('ru')

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <div className="relative min-h-screen bg-[hsl(var(--av-bg))] text-[hsl(var(--av-text))]">
        <Nav />
        <main>
          <Hero />
          <FullCycle />
          <Portfolio />
          <Services />
          <Integrations />
          <Enterprise />
          <Architecture />
          <Process />
          <FinalCta />
        </main>
      </div>
    </LangContext.Provider>
  )
}
