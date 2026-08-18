'use client'

import { useState, useEffect } from 'react'

export type AccentColor = 'amber' | 'cyan' | 'emerald' | 'purple'

const ACCENTS: Record<AccentColor, { label: string; accent: string; soft: string; glow: string; hex: string }> = {
  amber: {
    label: 'Amber Gold',
    accent: '38 96% 56%',
    soft: '38 96% 56% / 0.12',
    glow: '38 100% 60% / 0.35',
    hex: '#f59e0b',
  },
  cyan: {
    label: 'Cyber Cyan',
    accent: '190 95% 50%',
    soft: '190 95% 50% / 0.14',
    glow: '190 100% 55% / 0.4',
    hex: '#06b6d4',
  },
  emerald: {
    label: 'Neon Emerald',
    accent: '150 90% 50%',
    soft: '150 90% 50% / 0.14',
    glow: '150 95% 55% / 0.4',
    hex: '#10b981',
  },
  purple: {
    label: 'Royal Purple',
    accent: '270 95% 65%',
    soft: '270 95% 65% / 0.16',
    glow: '270 100% 70% / 0.45',
    hex: '#a855f7',
  },
}

export default function ThemeSwitcher() {
  const [current, setCurrent] = useState<AccentColor>('amber')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('av_theme_accent') as AccentColor
      if (saved && ACCENTS[saved]) {
        applyAccent(saved)
      }
    }
  }, [])

  const applyAccent = (color: AccentColor) => {
    setCurrent(color)
    if (typeof window !== 'undefined') {
      localStorage.setItem('av_theme_accent', color)
      const root = document.documentElement
      const cfg = ACCENTS[color]
      root.style.setProperty('--av-accent', cfg.accent)
      root.style.setProperty('--av-accent-soft', cfg.soft)
      root.style.setProperty('--av-accent-glow', cfg.glow)
    }
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2 p-2 rounded-full border border-line bg-[hsl(var(--av-bg-panel)/0.9)] backdrop-blur-md shadow-2xl">
      <span className="text-[10px] font-mono-tech uppercase text-faint pl-2 pr-1 hidden sm:inline">Theme</span>
      {(Object.keys(ACCENTS) as AccentColor[]).map((key) => {
        const item = ACCENTS[key]
        const isActive = current === key
        return (
          <button
            key={key}
            onClick={() => applyAccent(key)}
            title={item.label}
            className={`w-5 h-5 rounded-full transition-all duration-300 relative ${
              isActive ? 'scale-125 ring-2 ring-white/60 shadow-[0_0_12px_currentColor]' : 'opacity-60 hover:opacity-100 hover:scale-110'
            }`}
            style={{ backgroundColor: item.hex, color: item.hex }}
          />
        )
      })}
    </div>
  )
}
