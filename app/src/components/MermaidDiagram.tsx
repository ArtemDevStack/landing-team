'use client'

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

interface MermaidDiagramProps {
  chart: string
  className?: string
}

export default function MermaidDiagram({ chart, className = '' }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svgContent, setSvgContent] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [renderId] = useState(() => 'mermaid-' + Math.random().toString(36).substring(2, 9))

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'var(--font-mono-tech), monospace',
      themeVariables: {
        darkMode: true,
        background: 'transparent',
        primaryColor: '#161e2e',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#10b981',
        lineColor: '#38bdf8',
        secondaryColor: '#1e293b',
        tertiaryColor: '#0f172a',
        edgeLabelBackground: '#0b0f19',
        fontSize: '13px',
      },
    })
  }, [])

  useEffect(() => {
    let isMounted = true

    async function renderChart() {
      if (!chart) return
      try {
        setError(null)
        // Clean previous content and render new SVG
        const uniqueId = renderId + '-' + Date.now()
        let { svg } = await mermaid.render(uniqueId, chart)
        if (isMounted) {
          // Post-process SVG to add rounded corners rx="14" ry="14" to node rectangles
          svg = svg.replace(/<rect(\s+[^>]*class="[^"]*node[^"]*"[^>]*)>/gi, (match) => {
            if (!match.includes('rx=')) {
              return match.replace('<rect', '<rect rx="14" ry="14"')
            }
            return match.replace(/rx="[^"]*"/, 'rx="14"').replace(/ry="[^"]*"/, 'ry="14"')
          })

          // Post-process cluster rectangles to add rx="18" ry="18"
          svg = svg.replace(/<rect(\s+[^>]*class="[^"]*cluster[^"]*"[^>]*)>/gi, (match) => {
            if (!match.includes('rx=')) {
              return match.replace('<rect', '<rect rx="18" ry="18"')
            }
            return match.replace(/rx="[^"]*"/, 'rx="18"').replace(/ry="[^"]*"/, 'ry="18"')
          })

          // Inject explicit style tag into SVG for 100% text contrast and glowing borders
          const styleTag = `
            <style>
              .node rect, .node polygon, .node circle {
                rx: 14px !important;
                ry: 14px !important;
                filter: drop-shadow(0 4px 14px rgba(0, 0, 0, 0.5)) !important;
              }
              .cluster rect {
                rx: 18px !important;
                ry: 18px !important;
                fill: rgba(15, 23, 42, 0.45) !important;
                stroke: rgba(255, 255, 255, 0.12) !important;
                stroke-dasharray: 4 4 !important;
              }
              .cluster text, .cluster span, .cluster tspan {
                fill: #cbd5e1 !important;
                color: #cbd5e1 !important;
                font-family: var(--font-mono-tech), monospace !important;
                font-size: 11px !important;
                font-weight: 800 !important;
                text-transform: uppercase !important;
                letter-spacing: 1.2px !important;
              }
              .node text, .node span, .node tspan, .node div {
                fill: #ffffff !important;
                color: #ffffff !important;
                font-family: var(--font-manrope), sans-serif !important;
                font-weight: 800 !important;
                font-size: 13px !important;
                text-shadow: 0 1px 4px rgba(0, 0, 0, 0.9) !important;
              }
              .edgeLabel rect {
                fill: #0b0f19 !important;
                opacity: 0.95 !important;
                rx: 6px !important;
                ry: 6px !important;
                stroke: rgba(56, 189, 248, 0.3) !important;
              }
              .edgeLabel text, .edgeLabel span, .edgeLabel tspan {
                fill: #38bdf8 !important;
                color: #38bdf8 !important;
                font-family: var(--font-mono-tech), monospace !important;
                font-size: 10px !important;
                font-weight: 700 !important;
              }
              .flowchart-link {
                stroke: #38bdf8 !important;
                stroke-width: 2px !important;
              }
              .marker {
                fill: #38bdf8 !important;
                stroke: #38bdf8 !important;
              }
            </style>
          `
          svg = svg.replace(/<svg[^>]*>/, `$&${styleTag}`)

          setSvgContent(svg)
        }
      } catch (err: any) {
        if (isMounted) {
          console.warn('[MermaidDiagram] Render error:', err)
          setError(err.message || 'Ошибка генерации Mermaid диаграммы')
        }
      }
    }

    renderChart()

    return () => {
      isMounted = false
    }
  }, [chart, renderId])

  if (error) {
    return (
      <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 font-mono-tech text-xs">
        ⚠️ Не удалось сгенерировать диаграмму Mermaid: {error}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-x-auto custom-scrollbar-x flex items-center justify-center p-4 min-h-[320px] [&_svg]:max-w-full [&_.node_rect]:rx-3 [&_.node_rect]:ry-3 [&_.cluster_rect]:rx-4 [&_.cluster_rect]:ry-4 [&_.cluster_rect]:fill-slate-900/60 [&_.cluster_rect]:stroke-slate-700/60 [&_.edgeLabel]:bg-[hsl(var(--av-bg))] [&_.edgeLabel]:px-1.5 [&_.edgeLabel]:py-0.5 [&_.edgeLabel]:rounded-md ${className}`}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  )
}
