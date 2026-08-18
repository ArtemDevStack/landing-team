'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../i18n'

export default function Preloader() {
  const { lang } = useLang()
  const [loading, setLoading] = useState(true)
  const [donutFrame, setDonutFrame] = useState('')

  // 3D Spinning Donut (Torus) ASCII Math Renderer
  useEffect(() => {
    let A = 0
    let B = 0
    const width = 46
    const height = 20

    const interval = setInterval(() => {
      A += 0.07
      B += 0.03
      const b: string[] = []
      const z: number[] = []

      for (let k = 0; k < width * height; k++) {
        b[k] = ' '
        z[k] = 0
      }

      for (let j = 0; j < 6.28; j += 0.12) {
        for (let i = 0; i < 6.28; i += 0.05) {
          const c = Math.sin(i)
          const d = Math.cos(j)
          const e = Math.sin(A)
          const f = Math.sin(j)
          const g = Math.cos(A)
          const h = d + 2
          const D = 1 / (c * h * e + f * g + 5)
          const l = Math.cos(i)
          const m = Math.cos(B)
          const n = Math.sin(B)
          const t = c * h * g - f * e
          const x = Math.floor(width / 2 + 20 * D * (l * h * m - t * n))
          const y = Math.floor(height / 2 + 10 * D * (l * h * n + t * m))
          const o = x + width * y
          const N = Math.floor(8 * ((f * e - c * d * g) * m - c * d * e - f * g - l * d * n))
          if (height > y && y >= 0 && width > x && x >= 0 && D > z[o]) {
            z[o] = D
            b[o] = '.,-~:;=!*#$@'[N > 0 ? N : 0]
          }
        }
      }

      let res = ''
      for (let k = 0; k < width * height; k++) {
        res += k % width === 0 ? '\n' + b[k] : b[k]
      }
      setDonutFrame(res)
    }, 40)

    return () => clearInterval(interval)
  }, [])

  // Auto hide preloader after brief display
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070a12] text-foreground p-6 overflow-hidden select-none"
        >
          {/* Ambient Glow */}
          <div
            className="absolute w-[500px] h-[500px] rounded-full blur-[160px] opacity-20 pointer-events-none"
            style={{ background: 'hsl(var(--av-accent))' }}
          />

          {/* 3D Spinning ASCII Donut */}
          <div className="relative font-mono text-[10px] leading-[1] text-[hsl(var(--av-accent))] whitespace-pre font-bold tracking-tighter opacity-90 drop-shadow-[0_0_14px_hsl(var(--av-accent-glow))]">
            {donutFrame}
          </div>

          {/* Concise Status Indicator */}
          <div className="mt-3 flex items-center gap-2 text-xs font-mono-tech text-dim tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{lang === 'ru' ? 'ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ...' : 'INITIALIZING...'}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
