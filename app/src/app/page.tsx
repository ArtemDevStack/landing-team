'use client'

import Preloader from '../components/Preloader'
import Nav from '../sections/Nav'
import Hero from '../sections/Hero'
import AgencyComparison from '../components/AgencyComparison'
import WhyUsSpeedValue from '../sections/WhyUsSpeedValue'
import SolutionsOverview from '../components/SolutionsOverview'
import BusinessDiagnosticQuiz from '../components/BusinessDiagnosticQuiz'
import InteractiveArchitecture from '../components/InteractiveArchitecture'
import InteractiveDemoSandbox from '../components/InteractiveDemoSandbox'
import FullCycle from '../sections/FullCycle'
import Process from '../sections/Process'
import FinalCta from '../sections/FinalCta'

export default function HomePage() {
  return (
    <>
      <Preloader />
      <Nav />
      <main>
        <Hero />

        {/* Секция "Почему AV Studio" (Сравнительный анализ с GSAP Pinning) */}
        <AgencyComparison />

        {/* Преимущество скорости и цены */}
        <WhyUsSpeedValue />

        <SolutionsOverview />

        {/* 60-Second Express Business Diagnostic Audit */}
        <section className="max-w-7xl mx-auto px-6 md:px-10">
          <BusinessDiagnosticQuiz />
        </section>

        {/* Live Ecosystem Architecture Configurator */}
        <section className="max-w-7xl mx-auto px-6 md:px-10">
          <InteractiveArchitecture />
        </section>

        {/* Interactive Demo Sandbox: Neural AI, DnD CRM & SLA */}
        <section className="max-w-7xl mx-auto px-6 md:px-10">
          <InteractiveDemoSandbox />
        </section>

        <FullCycle />
        <Process />
        <FinalCta />
      </main>
    </>
  )
}
