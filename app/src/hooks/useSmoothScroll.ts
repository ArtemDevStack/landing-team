'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function useSmoothScroll() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger)
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const updateGSAPTicker = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(updateGSAPTicker)
    gsap.ticker.lagSmoothing(0)

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    const animationFrameId = requestAnimationFrame(raf)

    // Handle smooth scrolling for internal anchor links (e.g. href="#cases")
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (href && href.startsWith('#')) {
        if (href === '#top') {
          e.preventDefault()
          lenis.scrollTo(0)
        } else if (href.length > 1) {
          const targetEl = document.querySelector(href) as HTMLElement | null
          if (targetEl) {
            e.preventDefault()
            lenis.scrollTo(targetEl, { offset: -40 })
          }
        }
      }
    }

    document.addEventListener('click', handleAnchorClick)

    return () => {
      cancelAnimationFrame(animationFrameId)
      document.removeEventListener('click', handleAnchorClick)
      gsap.ticker.remove(updateGSAPTicker)
      lenis.destroy()
    }
  }, [])
}
