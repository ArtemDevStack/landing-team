'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Reveal, Section, SectionHead, Rail } from './ui-bits'
import { useLang } from '../i18n'
import { useOrderModal } from '../context/ModalContext'
import { Calculator, TrendingUp, Clock, ShieldCheck, ArrowRight, Zap, Check } from 'lucide-react'

interface ModuleOption {
  id: string
  ru: string
  en: string
  price: number
}

export default function ProjectCalculator() {
  const { lang } = useLang()
  const { openOrderModal } = useOrderModal()

  // Active Tab: 'roi' or 'estimate'
  const [calcMode, setCalcMode] = useState<'roi' | 'estimate'>('roi')

  // --- ROI Simulator State ---
  const [staffCount, setStaffCount] = useState<number>(12)
  const [hoursPerDay, setHoursPerDay] = useState<number>(3)
  const [hourlyRate, setHourlyRate] = useState<number>(850)

  // Calculations for ROI:
  // Assuming AV automation saves ~65% of manual routine time
  const monthlyWorkingDays = 21
  const totalRoutineHoursMonth = staffCount * hoursPerDay * monthlyWorkingDays
  const hoursSavedMonth = Math.round(totalRoutineHoursMonth * 0.65)
  const moneySavedMonth = hoursSavedMonth * hourlyRate
  const moneySavedYear = moneySavedMonth * 12
  // Average AV solution investment estimated around 250,000 RUB for medium team automation
  const estimatedInvestment = Math.min(380000, Math.max(120000, Math.round(moneySavedMonth * 0.85)))
  const paybackMonths = Math.max(1, Number((estimatedInvestment / Math.max(1, moneySavedMonth)).toFixed(1)))

  // --- Estimate State ---
  const [projectType, setProjectType] = useState<string>('crm')
  const [selectedModules, setSelectedModules] = useState<string[]>(['ai', '1c'])
  const [express, setExpress] = useState<boolean>(false)

  const TYPES = [
    { id: 'web', ru: 'Лендинг / Промо-сайт', en: 'Landing & Promo Site', base: 49000, days: '1-2 дня' },
    { id: 'eshop', ru: 'Интернет-Магазин / B2B', en: 'E-Commerce & Store', base: 89000, days: '2-3 дня' },
    { id: 'crm', ru: 'CRM & B2B Системы', en: 'CRM & B2B Systems', base: 149000, days: '1-2 недели' },
    { id: 'ai', ru: 'AI & Чат-боты / Автоматизация', en: 'AI & Automation', base: 99000, days: '2-4 дня' },
    { id: 'enterprise', ru: 'Enterprise Продукт', en: 'Enterprise System', base: 290000, days: '2-3 недели' },
  ]

  const MODULES: ModuleOption[] = [
    { id: 'ai', ru: 'AI-Ассистент / Чат-бот', en: 'AI Assistant / Bot', price: 45000 },
    { id: '1c', ru: 'Интеграция 1С / МойСклад', en: '1C & ERP Sync', price: 55000 },
    { id: 'payments', ru: 'Эквайринг & Маркетплейсы', en: 'Payments & Marketplaces', price: 35000 },
    { id: 'mobile', ru: 'Адаптивный PWA-сервис', en: 'Mobile PWA Service', price: 49000 },
    { id: 'security', ru: 'Юр. пакет + 152-ФЗ & SSL', en: 'Legal Package & SSL', price: 25000 },
  ]

  const toggleModule = (id: string) => {
    setSelectedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  const selectedTypeObj = TYPES.find((t) => t.id === projectType) || TYPES[0]
  const modulesPrice = selectedModules.reduce((acc, mid) => {
    const m = MODULES.find((mod) => mod.id === mid)
    return acc + (m ? m.price : 0)
  }, 0)

  const rawTotal = selectedTypeObj.base + modulesPrice
  const finalTotal = express ? Math.round(rawTotal * 1.25) : rawTotal

  const handleOrderEstimate = () => {
    const typeLabel = lang === 'ru' ? selectedTypeObj.ru : selectedTypeObj.en
    const formattedPrice = `${(finalTotal / 1000).toFixed(0)}k ₽`
    const details = `Калькулятор сметы: ${typeLabel}, Модули: ${selectedModules.join(', ')}, Срочность: ${
      express ? 'Экспресс' : 'Стандарт'
    }`
    openOrderModal(`${typeLabel} (~${formattedPrice}) • ${details}`)
  }

  const handleOrderRoi = () => {
    const details = `Калькулятор ROI: Сотрудников=${staffCount}, Ручные часы/день=${hoursPerDay}, Экономия в мес=~${(moneySavedMonth / 1000).toFixed(0)}k ₽`
    openOrderModal(
      lang === 'ru'
        ? `Запрос аудита окупаемости: Экономия ${(moneySavedMonth / 1000).toFixed(0)}k ₽/мес`
        : `ROI Audit Request: Savings ~${(moneySavedMonth / 1000).toFixed(0)}k RUB/mo`
    )
  }

  return (
    <>
      <Rail left={lang === 'ru' ? 'КАЛЬКУЛЯТОР & ROI' : 'ESTIMATE & ROI CALCULATOR'} right="AV / ROI & ESTIMATE" />
      <Section id="calculator" className="pt-16 md:pt-24">
        <SectionHead
          eyebrow={lang === 'ru' ? 'Интерактивный расчет' : 'Interactive Calculator'}
          title={
            lang === 'ru'
              ? 'Рассчитайте окупаемость и смету вашего проекта за 1 минуту'
              : 'Calculate Project ROI & Budget Estimate in 1 Minute'
          }
          sub={
            lang === 'ru'
              ? 'Используйте симулятор выгоды от автоматизации или составьте предварительную смету разработки.'
              : 'Simulate financial savings from automation or build an instant project cost estimation.'
          }
        />

        {/* Mode Switcher Tabs */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl border border-line bg-[hsl(var(--av-bg-panel))] shadow-lg">
            <button
              onClick={() => setCalcMode('roi')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-display font-semibold text-sm transition-all ${
                calcMode === 'roi'
                  ? 'bg-[hsl(var(--av-accent))] text-black shadow-md shadow-[hsl(var(--av-accent-glow))]'
                  : 'text-dim hover:text-foreground'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>{lang === 'ru' ? '1. Симулятор окупаемости (ROI)' : '1. ROI & Cost Savings'}</span>
            </button>
            <button
              onClick={() => setCalcMode('estimate')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-display font-semibold text-sm transition-all ${
                calcMode === 'estimate'
                  ? 'bg-[hsl(var(--av-accent))] text-black shadow-md shadow-[hsl(var(--av-accent-glow))]'
                  : 'text-dim hover:text-foreground'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>{lang === 'ru' ? '2. Расчет сметы & сроков' : '2. Budget & Timeline Estimate'}</span>
            </button>
          </div>
        </div>

        {/* Calculator Body */}
        <div className="mt-8 rounded-3xl border border-line bg-[hsl(var(--av-bg-raise)/0.5)] p-6 md:p-10 relative overflow-hidden backdrop-blur-sm shadow-2xl">
          <AnimatePresence mode="wait">
            {calcMode === 'roi' ? (
              <motion.div
                key="roi"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
                className="grid lg:grid-cols-12 gap-8 items-start"
              >
                {/* Sliders Area */}
                <div className="lg:col-span-7 space-y-8">
                  {/* Slider 1: Staff count */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-mono-tech uppercase text-dim tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[hsl(var(--av-accent))]" />
                        {lang === 'ru' ? 'Количество сотрудников / менеджеров' : 'Number of Employees / Managers'}
                      </label>
                      <span className="font-display font-bold text-lg text-[hsl(var(--av-accent))]">
                        {staffCount} {lang === 'ru' ? 'чел.' : 'people'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={100}
                      value={staffCount}
                      onChange={(e) => setStaffCount(Number(e.target.value))}
                      className="w-full h-2 bg-[hsl(var(--av-bg))] rounded-lg appearance-none cursor-pointer accent-[hsl(var(--av-accent))]"
                    />
                    <div className="flex justify-between text-[10px] font-mono-tech text-faint mt-1">
                      <span>2 чел</span>
                      <span>50 чел</span>
                      <span>100 чел</span>
                    </div>
                  </div>

                  {/* Slider 2: Hours spent per day on routine */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-mono-tech uppercase text-dim tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[hsl(var(--av-accent))]" />
                        {lang === 'ru' ? 'Ручные рутинные часы (в день на человека)' : 'Routine Hours Lost per Person / Day'}
                      </label>
                      <span className="font-display font-bold text-lg text-[hsl(var(--av-accent))]">
                        {hoursPerDay} {lang === 'ru' ? 'ч / день' : 'hrs / day'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={8}
                      value={hoursPerDay}
                      onChange={(e) => setHoursPerDay(Number(e.target.value))}
                      className="w-full h-2 bg-[hsl(var(--av-bg))] rounded-lg appearance-none cursor-pointer accent-[hsl(var(--av-accent))]"
                    />
                    <div className="flex justify-between text-[10px] font-mono-tech text-faint mt-1">
                      <span>1 час</span>
                      <span>4 часа</span>
                      <span>8 часов</span>
                    </div>
                  </div>

                  {/* Slider 3: Hourly rate */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-mono-tech uppercase text-dim tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[hsl(var(--av-accent))]" />
                        {lang === 'ru' ? 'Средняя ставка сотрудника в час' : 'Average Hourly Rate'}
                      </label>
                      <span className="font-display font-bold text-lg text-[hsl(var(--av-accent))]">
                        {hourlyRate} ₽ {lang === 'ru' ? '/ час' : '/ hr'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={400}
                      max={3000}
                      step={50}
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Number(e.target.value))}
                      className="w-full h-2 bg-[hsl(var(--av-bg))] rounded-lg appearance-none cursor-pointer accent-[hsl(var(--av-accent))]"
                    />
                    <div className="flex justify-between text-[10px] font-mono-tech text-faint mt-1">
                      <span>400 ₽</span>
                      <span>1 500 ₽</span>
                      <span>3 000 ₽</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-line bg-[hsl(var(--av-bg)/0.6)] p-4 text-xs text-dim flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>
                      {lang === 'ru'
                        ? 'Расчет основан на статистике AV Studio: внедрение AI-агентов и CRM высвобождает до 65% рутинного времени.'
                        : 'Calculated using AV Studio metrics: AI & CRM automation saves ~65% of manual staff routine time.'}
                    </span>
                  </div>
                </div>

                {/* Output Card */}
                <div className="lg:col-span-5 rounded-2xl border border-[hsl(var(--av-accent)/0.5)] bg-gradient-to-b from-[hsl(var(--av-bg-panel))] to-[hsl(var(--av-bg))] p-6 space-y-6 shadow-xl">
                  <div className="flex items-center justify-between border-b border-line pb-4">
                    <span className="text-xs font-mono-tech uppercase text-dim tracking-wider">
                      {lang === 'ru' ? 'Прогноз финансового эффекта' : 'Financial Impact Forecast'}
                    </span>
                    <Zap className="w-5 h-5 text-[hsl(var(--av-accent))]" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-faint font-mono-tech uppercase">
                        {lang === 'ru' ? 'Высвобождаем человеко-часов' : 'Hours Saved per Month'}
                      </div>
                      <div className="text-2xl font-display font-extrabold text-foreground mt-1">
                        ~{hoursSavedMonth.toLocaleString()} {lang === 'ru' ? 'часов / мес' : 'hrs / mo'}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-faint font-mono-tech uppercase">
                        {lang === 'ru' ? 'Прямая экономия ФОТ в месяц' : 'Monthly Payroll Savings'}
                      </div>
                      <div className="text-3xl font-display font-extrabold text-emerald-400 mt-1 tracking-tight">
                        +{(moneySavedMonth / 1000).toFixed(0)} 000 ₽
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-faint font-mono-tech uppercase">
                        {lang === 'ru' ? 'Экономия за 1-й год работы' : '1-Year Total Savings'}
                      </div>
                      <div className="text-2xl font-display font-extrabold text-foreground mt-1">
                        ~{(moneySavedYear / 1000000).toFixed(2)} млн ₽
                      </div>
                    </div>

                    <div className="pt-3 border-t border-line flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-faint font-mono-tech uppercase">
                          {lang === 'ru' ? 'Прогнозируемый срок окупаемости' : 'Estimated Payback Period'}
                        </div>
                        <div className="text-lg font-bold text-[hsl(var(--av-accent))] mt-0.5">
                          ~{paybackMonths} {lang === 'ru' ? 'мес.' : 'months'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] text-faint font-mono-tech uppercase">
                          {lang === 'ru' ? 'Гарантия SLA' : 'SLA Guarantee'}
                        </div>
                        <div className="text-xs font-semibold text-emerald-400 mt-0.5">100% В ДОВОГОРЕ</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleOrderRoi}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[hsl(var(--av-accent))] to-emerald-400 text-black font-display font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[hsl(var(--av-accent-glow))]"
                  >
                    <span>
                      {lang === 'ru' ? 'Получить детальный аудит окупаемости' : 'Get Detailed ROI Audit Report'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="estimate"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="grid lg:grid-cols-12 gap-8 items-start"
              >
                {/* Options Column */}
                <div className="lg:col-span-8 space-y-8">
                  {/* 1. Type Selection */}
                  <div>
                    <label className="block text-xs font-mono-tech uppercase text-dim tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[hsl(var(--av-accent))]" />
                      {lang === 'ru' ? '1. Тип и направление решения' : '1. Select Solution Type'}
                    </label>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {TYPES.map((t) => {
                        const isSel = projectType === t.id
                        return (
                          <button
                            type="button"
                            key={t.id}
                            onClick={() => setProjectType(t.id)}
                            className={`p-4 rounded-xl border text-left transition-all ${
                              isSel
                                ? 'border-[hsl(var(--av-accent))] bg-[hsl(var(--av-accent-soft))] shadow-[0_0_16px_hsl(var(--av-accent-glow))]'
                                : 'border-line bg-[hsl(var(--av-bg))] text-dim hover:text-foreground hover:border-line-strong'
                            }`}
                          >
                            <div className={`font-display font-bold text-sm ${isSel ? 'text-[hsl(var(--av-accent))]' : 'text-foreground'}`}>
                              {lang === 'ru' ? t.ru : t.en}
                            </div>
                            <div className="mt-2 text-xs font-mono-tech text-faint">
                              {lang === 'ru' ? `от ${(t.base / 1000).toFixed(0)}k ₽` : `from $${(t.base / 90).toFixed(0)}`}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* 2. Modules Selection */}
                  <div>
                    <label className="block text-xs font-mono-tech uppercase text-dim tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[hsl(var(--av-accent))]" />
                      {lang === 'ru' ? '2. Дополнительные модули & функции' : '2. Extra Modules & Features'}
                    </label>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {MODULES.map((m) => {
                        const isChecked = selectedModules.includes(m.id)
                        return (
                          <button
                            type="button"
                            key={m.id}
                            onClick={() => toggleModule(m.id)}
                            className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                              isChecked
                                ? 'border-[hsl(var(--av-accent))] bg-[hsl(var(--av-bg-panel))] text-foreground'
                                : 'border-line bg-[hsl(var(--av-bg))] text-faint hover:text-dim'
                            }`}
                          >
                            <span className="text-xs font-medium">{lang === 'ru' ? m.ru : m.en}</span>
                            <span className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${isChecked ? 'bg-[hsl(var(--av-accent))] text-black border-transparent font-bold' : 'border-line'}`}>
                              {isChecked ? '✓' : ''}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* 3. Speed selection */}
                  <div>
                    <label className="block text-xs font-mono-tech uppercase text-dim tracking-wider mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[hsl(var(--av-accent))]" />
                      {lang === 'ru' ? '3. Срочность реализации' : '3. Urgency / Timeline'}
                    </label>
                    <div className="flex items-center gap-4 bg-[hsl(var(--av-bg))] p-3.5 rounded-xl border border-line max-w-md">
                      <button
                        type="button"
                        onClick={() => setExpress(false)}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                          !express ? 'bg-[hsl(var(--av-accent))] text-black font-bold' : 'text-dim hover:text-foreground'
                        }`}
                      >
                        {lang === 'ru' ? 'Стандартный срок' : 'Standard Speed'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpress(true)}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                          express ? 'bg-[hsl(var(--av-accent))] text-black font-bold' : 'text-dim hover:text-foreground'
                        }`}
                      >
                        {lang === 'ru' ? 'Ускоренный (+25%)' : 'Express Speed (+25%)'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Estimate Summary */}
                <div className="lg:col-span-4 rounded-2xl border border-[hsl(var(--av-accent)/0.4)] bg-[hsl(var(--av-bg-panel))] p-6 space-y-6 shadow-xl">
                  <div className="text-xs font-mono-tech uppercase text-dim tracking-wider border-b border-line pb-3">
                    {lang === 'ru' ? 'Смета и сроки' : 'Estimate & Delivery'}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-dim">{lang === 'ru' ? 'Базовый тип:' : 'Base Solution:'}</span>
                      <span className="text-xs font-bold text-foreground">{lang === 'ru' ? selectedTypeObj.ru : selectedTypeObj.en}</span>
                    </div>

                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-dim">{lang === 'ru' ? 'Модулей выбрано:' : 'Modules Selected:'}</span>
                      <span className="text-xs font-bold text-[hsl(var(--av-accent))]">{selectedModules.length} шт</span>
                    </div>

                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-dim">{lang === 'ru' ? 'Срок реализации:' : 'Estimated Time:'}</span>
                      <span className="text-xs font-bold text-foreground">{selectedTypeObj.days}</span>
                    </div>

                    <div className="pt-4 border-t border-line">
                      <div className="text-[10px] font-mono-tech text-faint uppercase">
                        {lang === 'ru' ? 'Ориентировочный бюджет' : 'Estimated Investment'}
                      </div>
                      <div className="text-3xl font-display font-extrabold text-[hsl(var(--av-accent))] mt-1">
                        ~{(finalTotal / 1000).toFixed(0)} 000 ₽
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleOrderEstimate}
                    className="w-full py-3.5 rounded-xl bg-[hsl(var(--av-accent))] text-black font-display font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[hsl(var(--av-accent-glow))]"
                  >
                    <span>{lang === 'ru' ? 'Зафиксировать смету' : 'Lock In Estimate'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Section>
    </>
  )
}
