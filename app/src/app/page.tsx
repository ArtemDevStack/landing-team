import dynamic from 'next/dynamic'
import Nav from '../sections/Nav'
import Hero from '../sections/Hero'
import FullCycle from '../sections/FullCycle'
import Portfolio from '../sections/Portfolio'
import Services from '../sections/Services'
import Enterprise from '../sections/Enterprise'
import Process from '../sections/Process'
import FinalCta from '../sections/FinalCta'

// Dynamically load heavy interactive visualizers below-the-fold for instant initial FCP/LCP
const Integrations = dynamic(() => import('../sections/Integrations'))
const Architecture = dynamic(() => import('../sections/Architecture'))

export default function HomePage() {
  return (
    <>
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
    </>
  )
}
