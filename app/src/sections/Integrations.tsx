import { useState } from 'react'
import { Reveal, Section, SectionHead, Rail } from '../components/ui-bits'
import { useLang, ui } from '../i18n'

const CENTER = { x: 450, y: 280 }
const POS = [
  { x: 786, y: 280 }, // 0°
  { x: 686, y: 418 }, // 45°
  { x: 450, y: 478 }, // 90°
  { x: 214, y: 418 }, // 135°
  { x: 114, y: 280 }, // 180°
  { x: 214, y: 142 }, // 225°
  { x: 450, y: 82 }, // 270°
  { x: 686, y: 142 }, // 315°
]

function pathTo(p: { x: number; y: number }, i: number) {
  const mx = (CENTER.x + p.x) / 2
  const my = (CENTER.y + p.y) / 2
  const bend = i % 2 === 0 ? 26 : -26
  // perpendicular offset for a gentle curve
  const dx = p.x - CENTER.x
  const dy = p.y - CENTER.y
  const len = Math.hypot(dx, dy) || 1
  const cx = mx + (-dy / len) * bend
  const cy = my + (dx / len) * bend
  return `M ${CENTER.x} ${CENTER.y} Q ${cx} ${cy} ${p.x} ${p.y}`
}

export default function Integrations() {
  const { lang } = useLang()
  const t = ui[lang].integrations
  const [active, setActive] = useState(6)

  return (
    <>
      <Rail left={t.eyebrow} right="AV / CONNECTED SYSTEMS" />
      <Section id="integrations" className="pt-16 md:pt-24">
        <SectionHead eyebrow={t.eyebrow} title={t.title} sub={t.sub} />

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 items-stretch">
          {/* Diagram (desktop) */}
          <Reveal className="h-full">
            <div className="relative h-full rounded-3xl border border-line bg-[hsl(var(--av-bg-raise)/0.35)] bg-grid-fine overflow-hidden">
              <svg viewBox="0 0 900 560" className="w-full h-full min-h-[420px] hidden md:block" role="img" aria-label="Integrations diagram">
                <defs>
                  <filter id="glowF" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="7" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Connectors */}
                {POS.map((p, i) => {
                  const d = pathTo(p, i)
                  const isActive = i === active
                  return (
                    <g key={`c${i}`}>
                      <path
                        d={d}
                        fill="none"
                        stroke={isActive ? 'hsl(var(--av-accent))' : 'hsl(var(--av-line-strong))'}
                        strokeWidth={isActive ? 1.8 : 1.1}
                        strokeDasharray="6 6"
                        className="anim-dash transition-all duration-500"
                        opacity={isActive ? 1 : 0.55}
                      />
                      <circle r="3.2" fill="hsl(var(--av-accent))" filter={isActive ? 'url(#glowF)' : undefined} opacity={isActive ? 1 : 0.5}>
                        <animateMotion dur={`${2.6 + i * 0.35}s`} repeatCount="indefinite" path={d} />
                      </circle>
                    </g>
                  )
                })}

                {/* Center node */}
                <g filter="url(#glowF)">
                  <rect
                    x={CENTER.x - 105} y={CENTER.y - 34} width="210" height="68" rx="34"
                    fill="hsl(var(--av-bg))"
                    stroke="hsl(var(--av-accent))"
                    strokeWidth="1.6"
                  />
                  <text
                    x={CENTER.x} y={CENTER.y + 5}
                    textAnchor="middle"
                    fill="hsl(var(--av-text))"
                    fontSize="17" fontWeight="700"
                    fontFamily="Manrope, sans-serif"
                  >
                    {t.center}
                  </text>
                </g>

                {/* Satellite nodes */}
                {POS.map((p, i) => {
                  const [name] = t.nodes[i]
                  const isActive = i === active
                  const w = name.length > 9 ? 168 : 140
                  return (
                    <g
                      key={`n${i}`}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => setActive(i)}
                      style={{ cursor: 'pointer' }}
                    >
                      <rect
                        x={p.x - w / 2} y={p.y - 24} width={w} height="48" rx="24"
                        fill={isActive ? 'hsl(var(--av-accent)/0.1)' : 'hsl(var(--av-bg))'}
                        stroke={isActive ? 'hsl(var(--av-accent))' : 'hsl(var(--av-line-strong))'}
                        strokeWidth={isActive ? 1.6 : 1.1}
                        style={{ transition: 'all .4s' }}
                      />
                      <text
                        x={p.x} y={p.y + 4.5}
                        textAnchor="middle"
                        fill={isActive ? 'hsl(var(--av-accent))' : 'hsl(var(--av-text-dim))'}
                        fontSize="13.5" fontWeight="600"
                        fontFamily="'JetBrains Mono', monospace"
                        style={{ transition: 'fill .4s' }}
                      >
                        {name}
                      </text>
                    </g>
                  )
                })}
              </svg>

              {/* Mobile fallback: interactive chip list */}
              <div className="md:hidden grid grid-cols-2 gap-2.5 p-5">
                {t.nodes.map(([name], i) => (
                  <button
                    key={name}
                    onClick={() => setActive(i)}
                    className={`rounded-full border px-4 py-3 font-mono-tech text-xs transition-all duration-300 ${
                      i === active
                        ? 'border-[hsl(var(--av-accent))] text-accent bg-[hsl(var(--av-accent)/0.08)]'
                        : 'border-line text-dim'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Detail panel */}
          <Reveal i={1} className="h-full">
            <div className="h-full rounded-3xl border border-line bg-[hsl(var(--av-bg-raise)/0.45)] p-8 md:p-10 flex flex-col">
              <div className="font-mono-tech text-[11px] tracking-[0.25em] uppercase text-faint flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--av-accent))] anim-pulse-node" />
                {t.sync}
              </div>
              <h3 className="mt-6 font-display text-3xl md:text-4xl font-extrabold tracking-tight text-accent">
                {t.nodes[active][0]}
              </h3>
              <p className="mt-4 text-dim leading-relaxed text-base md:text-lg">{t.nodes[active][1]}</p>

              <div className="mt-auto pt-10">
                <div className="grid grid-cols-4 gap-2">
                  {t.nodes.map(([name], i) => (
                    <button
                      key={name}
                      onClick={() => setActive(i)}
                      aria-label={name}
                      className={`h-1 rounded-full transition-all duration-400 ${
                        i === active ? 'bg-[hsl(var(--av-accent))]' : 'bg-[hsl(var(--av-line-strong))] hover:bg-[hsl(var(--av-text-faint))]'
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-5 font-mono-tech text-[11px] text-faint tracking-wider">
                  {String(active + 1).padStart(2, '0')} / {String(t.nodes.length).padStart(2, '0')}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  )
}
