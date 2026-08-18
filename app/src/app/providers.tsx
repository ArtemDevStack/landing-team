'use client'

import { useState, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { LangContext, type Lang } from '../i18n'
import { ModalProvider } from '../context/ModalContext'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import ThemeSwitcher from '../components/ThemeSwitcher'

const AiAssistantWidget = dynamic(() => import('../components/AiAssistantWidget'), {
  ssr: false,
})

export function ClientProviders({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ru')
  useSmoothScroll()

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <ModalProvider>
        <div id="top" className="relative min-h-screen bg-[hsl(var(--av-bg))] text-[hsl(var(--av-text))]">
          {children}
          <AiAssistantWidget />
          <ThemeSwitcher />
        </div>
      </ModalProvider>
    </LangContext.Provider>
  )
}
