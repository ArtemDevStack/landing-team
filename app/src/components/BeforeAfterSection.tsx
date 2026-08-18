'use client'

import { useLang } from '../i18n'
import { Section, SectionHead, Rail, Reveal } from './ui-bits'
import { ShieldCheck } from 'lucide-react'

export default function BeforeAfterSection() {
  const { lang } = useLang()

  const METRICS = [
    {
      metric: '⚡ x8.4',
      labelRu: 'Ускорение отклика сайтов и каталога',
      labelEn: 'Page load & catalog speedup',
      descRu: 'Среднее время загрузки с 3.8с сокращается до 0.45с за счет SSR & Redis L2',
      descEn: 'Average load time drops from 3.8s to 0.45s via SSR & Redis L2 cache',
    },
    {
      metric: '🛡️ 100%',
      labelRu: 'Сохранность заказов при интеграции с 1С',
      labelEn: 'Order preservation with 1C sync',
      descRu: 'Шина RabbitMQ буферизует все транзакции, исключая «потерянные чеки»',
      descEn: 'RabbitMQ event bus buffers all events, eliminating dropped orders',
    },
    {
      metric: '📈 +340%',
      labelRu: 'Рост конверсии в первичную заявку',
      labelEn: 'Increase in primary lead conversion',
      descRu: 'Интерактивные ИИ-ассистенты и удобные квизы увеличивают отклик клиентов',
      descEn: 'Interactive AI assistants & fast quizzes boost overall conversion rate',
    },
  ]

  return (
    <>
      <Rail left={lang === 'ru' ? 'БИЗНЕС-ТРАНСФОРМАЦИЯ' : 'BUSINESS TRANSFORMATION'} right="AV / METRICS" />
      <Section id="transformation" className="pt-16 md:pt-24">
        <SectionHead
          eyebrow={lang === 'ru' ? 'Измеримый результат' : 'Measurable Business Impact'}
          title={
            lang === 'ru'
              ? 'Измеримые показатели трансформации после внедрения AV Studio'
              : 'Measurable Performance Transformation with AV Architecture'
          }
          sub={
            lang === 'ru'
              ? 'Реальные метрики эффективности, доказанные на реальных высоконагруженных проектах.'
              : 'Empirical ROI and performance benchmarks measured on enterprise projects.'
          }
        />

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {METRICS.map((item, idx) => (
            <Reveal key={idx}>
              <div className="h-full rounded-3xl border border-line hover:border-[hsl(var(--av-accent)/0.5)] bg-[hsl(var(--av-bg-panel)/0.85)] p-7 md:p-8 backdrop-blur-2xl shadow-xl hover:shadow-[0_0_35px_hsl(var(--av-accent-soft))] transition-all duration-500 flex flex-col justify-between group">
                <div>
                  <div className="text-3xl md:text-4xl font-display font-extrabold text-[hsl(var(--av-accent))] tracking-tight group-hover:scale-105 transition-transform duration-300">
                    {item.metric}
                  </div>
                  <h4 className="mt-3 font-display font-bold text-base md:text-lg text-foreground">
                    {lang === 'ru' ? item.labelRu : item.labelEn}
                  </h4>
                  <p className="mt-2 text-xs md:text-sm font-mono-tech text-dim leading-relaxed">
                    {lang === 'ru' ? item.descRu : item.descEn}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-line/40 flex items-center gap-2 text-xs font-mono-tech text-emerald-400">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{lang === 'ru' ? 'Подтвержденная метрика SLA' : 'Verified SLA Metric'}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  )
}
