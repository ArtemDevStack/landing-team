'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '../i18n'
import { Section, SectionHead, Rail } from './ui-bits'
import { CheckCircle2, XCircle, AlertCircle, ShieldCheck } from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function AgencyComparison() {
  const { lang } = useLang()
  const sectionWrapperRef = useRef<HTMLDivElement>(null)
  const columnsBlockRef = useRef<HTMLDivElement>(null)

  const COMPARISONS = [
    {
      criterionRu: 'Область ответственности',
      criterionEn: 'Scope & Ownership',
      freelanceRu: 'Только отдельный кусок (только код или только дизайн)',
      freelanceEn: 'Isolated tasks only',
      agencyRu: 'Продажа часов без ответственности за окупаемость',
      agencyEn: 'Selling hours without ROI accountability',
      avRu: 'Весь digital-контур под ключ с гарантией результата',
      avEn: 'Full digital stack turnkey with SLA & ROI focus',
    },
    {
      criterionRu: 'Передача прав & Код',
      criterionEn: 'Source Code Rights',
      freelanceRu: 'Часто сомнительные лицензии и хаотичный код',
      freelanceEn: 'Undocumented code & licensing risks',
      agencyRu: 'Вендор-лок на собственных CMS / дорогой доработке',
      agencyEn: 'Vendor lock-in on proprietary CMS',
      avRu: '100% отчуждаемый код, чистая архитектура, без вендор-лока',
      avEn: '100% owned source code, 0% vendor lock-in',
    },
    {
      criterionRu: 'Сроки и Запуск MVP',
      criterionEn: 'Speed to Market',
      freelanceRu: 'Высокий риск срыва и «пропадания» на недели',
      freelanceEn: 'High risk of ghosting and missed deadlines',
      agencyRu: 'Согласования длятся месяцами до первого релиза',
      agencyEn: 'Months of bureaucacy before MVP',
      avRu: 'Фиксированные спринты, запуск MVP за 4–6 недель',
      avEn: 'Fixed sprints, working MVP in 4–6 weeks',
    },
    {
      criterionRu: 'Сложные интеграции & AI',
      criterionEn: 'Integrations & AI',
      freelanceRu: 'Не умеют работать с 1С, Kubernetes и RAG',
      freelanceEn: 'No enterprise ERP/AI expertise',
      agencyRu: 'Берут плагины, которые падают под нагрузкой',
      agencyEn: 'Fragile plugins that break at peak load',
      avRu: 'Собственная шина данных, AI-агенты и RAG под нишу',
      avEn: 'Custom event-bus, RAG, and AI Agents',
    },
    {
      criterionRu: 'Сопровождение & SLA',
      criterionEn: 'Support & SLA',
      freelanceRu: 'Отсутствует, при багах ищут замену',
      freelanceEn: 'Non-existent, no bug warranty',
      agencyRu: 'Кабальные ежемесячные чеки за мелкие правки',
      agencyEn: 'Expensive retainer fees for minor tweaks',
      avRu: 'Партнёрское сопровождение, SLA 99.99% и развитие',
      avEn: 'Partner growth, 99.99% SLA guarantee',
    },
  ]

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionWrapperRef.current || !columnsBlockRef.current) return

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768

      // GSAP Pinned Zoom-In Timeline:
      // Pins page scroll while expanding the columns block from far away 3D scale to full view
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionWrapperRef.current,
          start: 'top top',
          end: isMobile ? '+=60%' : '+=90%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })

      tl.fromTo(
        columnsBlockRef.current,
        {
          scale: isMobile ? 0.65 : 0.45,
          opacity: 0.1,
          rotateX: 16,
          y: isMobile ? 40 : 80,
          transformPerspective: 1200,
        },
        {
          scale: 1,
          opacity: 1,
          rotateX: 0,
          y: 0,
          ease: 'power2.out',
        }
      )
    }, sectionWrapperRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionWrapperRef} className="w-full flex flex-col justify-center min-h-screen py-8 overflow-hidden">
      <Rail left={lang === 'ru' ? 'СРАВНИТЕЛЬНЫЙ АНАЛИЗ' : 'COMPARATIVE ANALYSIS'} right="AV / VS" />
      <Section id="comparison" className="pt-6 md:pt-10">
        <SectionHead
          eyebrow={lang === 'ru' ? 'Почему AV Studio' : 'Why AV Studio'}
          title={
            lang === 'ru'
              ? 'Прозрачное сравнение: Почему с нами выигрывает бизнес'
              : 'Clear Comparison: Why Businesses Choose AV'
          }
          sub={
            lang === 'ru'
              ? 'Мы не продаём «часы разработки». Мы проектируем и сопровождаем весь digital-контур бизнеса.'
              : 'We don’t sell billable hours. We architect, build, and support your entire digital ecosystem.'
          }
        />

        <div
          ref={columnsBlockRef}
          className="mt-8 rounded-3xl border border-line bg-[hsl(var(--av-bg-panel)/0.85)] p-6 md:p-8 backdrop-blur-2xl shadow-2xl overflow-x-auto will-change-transform"
        >
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-line text-xs font-mono-tech uppercase">
                <th className="py-4 px-4 text-dim w-1/4">
                  {lang === 'ru' ? 'Критерий оценки' : 'Evaluation Criteria'}
                </th>
                <th className="py-4 px-4 text-faint w-1/4">
                  {lang === 'ru' ? 'Фриланс / Инди' : 'Freelance / Individual'}
                </th>
                <th className="py-4 px-4 text-faint w-1/4">
                  {lang === 'ru' ? 'Классическое агентство' : 'Traditional Agency'}
                </th>
                <th className="py-4 px-4 text-[hsl(var(--av-accent))] font-bold w-1/4 bg-[hsl(var(--av-accent-soft))] rounded-t-xl">
                  {lang === 'ru' ? 'AV Studio' : 'AV Studio'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-xs md:text-sm">
              {COMPARISONS.map((row, idx) => (
                <tr key={idx} className="hover:bg-[hsl(var(--av-bg-raise)/0.5)] transition-colors">
                  <td className="py-4 px-4 font-display font-bold text-foreground">
                    {lang === 'ru' ? row.criterionRu : row.criterionEn}
                  </td>
                  <td className="py-4 px-4 text-dim">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>{lang === 'ru' ? row.freelanceRu : row.freelanceEn}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-dim">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{lang === 'ru' ? row.agencyRu : row.agencyEn}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-foreground font-medium bg-[hsl(var(--av-accent-soft)/0.5)]">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[hsl(var(--av-accent))] shrink-0 mt-0.5" />
                      <span className="font-semibold">{lang === 'ru' ? row.avRu : row.avEn}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 pt-4 border-t border-line flex items-center justify-between text-xs text-dim">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ru' ? 'NDA подписывается до первого обсуждения проекта' : 'NDA signed prior to project discussion'}</span>
            </span>
            <span className="font-mono-tech text-[hsl(var(--av-accent))]">100% CODE OWNERSHIP GUARANTEED</span>
          </div>
        </div>
      </Section>
    </div>
  )
}
