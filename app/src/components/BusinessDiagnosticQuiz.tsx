'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../i18n'
import { useOrderModal } from '../context/ModalContext'
import { Section, SectionHead, Rail } from './ui-bits'
import { CheckCircle2, AlertTriangle, ArrowRight, RefreshCcw, ShieldCheck, Sparkles, FileText } from 'lucide-react'

export default function BusinessDiagnosticQuiz() {
  const { lang } = useLang()
  const { openOrderModal } = useOrderModal()

  const [step, setStep] = useState<number>(1)
  const [niche, setNiche] = useState<string>('')
  const [bottleneck, setBottleneck] = useState<string>('')
  const [currentStack, setCurrentStack] = useState<string>('')
  const [isCompleted, setIsCompleted] = useState<boolean>(false)

  const NICHES = [
    { id: 'ecom', labelRu: 'E-Commerce & Ритейл', labelEn: 'E-Commerce & Retail' },
    { id: 'b2b', labelRu: 'B2B & Дистрибуция', labelEn: 'B2B & Wholesale' },
    { id: 'services', labelRu: 'Услуги & Сеть Клиник', labelEn: 'Services & Healthcare' },
    { id: 'saas', labelRu: 'IT, SaaS & Стартап', labelEn: 'IT, SaaS & Startup' },
  ]

  const BOTTLENECKS = [
    { id: 'leads', labelRu: 'Менеджеры упускают заявки / Ручной хаос', labelEn: 'Lost leads & manual chaos' },
    { id: 'slow', labelRu: 'Медленный сайт или устаревший UX', labelEn: 'Slow website or outdated UX' },
    { id: '1c_fail', labelRu: 'Сбой интеграции с 1С / Маркетплейсами', labelEn: 'Failed 1C or Marketplace sync' },
    { id: 'dev_delay', labelRu: 'Подрядчики срывают сроки и сметы', labelEn: 'Agencies miss deadlines & budget' },
  ]

  const STACKS = [
    { id: 'excel', labelRu: 'Excel / Ведём в мессенджерах', labelEn: 'Excel & Messaging apps' },
    { id: 'standard_crm', labelRu: 'Типовая Битрикс24 / AmoCRM', labelEn: 'Standard Bitrix24 / AmoCRM' },
    { id: 'legacy', labelRu: 'Самописная устаревшая система', labelEn: 'Legacy custom backend' },
    { id: 'none', labelRu: 'Запускаем проект с нуля', labelEn: 'Starting fresh from scratch' },
  ]

  const handleSelectNiche = (id: string) => {
    setNiche(id)
    setStep(2)
  }

  const handleSelectBottleneck = (id: string) => {
    setBottleneck(id)
    setStep(3)
  }

  const handleSelectStack = (id: string) => {
    setCurrentStack(id)
    setIsCompleted(true)
  }

  const handleReset = () => {
    setStep(1)
    setNiche('')
    setBottleneck('')
    setCurrentStack('')
    setIsCompleted(false)
  }

  const handleSendDiagnostic = () => {
    const details = `Экспресс-Диагностика: Ниша=${niche}, Проблема=${bottleneck}, Стек=${currentStack}`
    openOrderModal(
      lang === 'ru'
        ? `Запрос по итогам экспресс-аудита (${details})`
        : `Diagnostic Audit Followup (${details})`
    )
  }

  return (
    <>
      <Rail left={lang === 'ru' ? 'ЭКСПРЕСС-ДИАГНОСТИКА' : 'EXPRESS DIAGNOSTIC'} right="AV / AUDIT" />
      <Section id="audit-quiz" className="pt-16 md:pt-24">
        <SectionHead
          eyebrow={lang === 'ru' ? 'Аудит за 60 секунд' : '60-Second Business Audit'}
          title={
            lang === 'ru'
              ? 'Найдите узкие места в вашем IT-контуре и узнайте решение'
              : 'Identify IT Bottlenecks & Discover Solutions in 60 Sec'
          }
          sub={
            lang === 'ru'
              ? 'Ответьте на 3 вопроса и получите экспертную оценку потенциала автоматизации вашго бизнеса.'
              : 'Answer 3 quick questions to get an instant analysis of your automation potential.'
          }
        />

        <div className="mt-8 rounded-3xl border border-line bg-[hsl(var(--av-bg-panel)/0.7)] p-6 md:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {!isCompleted ? (
            <div>
              {/* Progress bar */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono-tech text-[hsl(var(--av-accent))] uppercase tracking-wider">
                  {lang === 'ru' ? `Шаг ${step} из 3` : `Step ${step} of 3`}
                </span>
                <span className="text-xs font-mono-tech text-faint">
                  {step === 1 && (lang === 'ru' ? 'Выберите вашу нишу' : 'Select Niche')}
                  {step === 2 && (lang === 'ru' ? 'Главное узкое место' : 'Main Bottleneck')}
                  {step === 3 && (lang === 'ru' ? 'Текущий IT-стек' : 'Current IT Stack')}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[hsl(var(--av-bg))] rounded-full overflow-hidden mb-8">
                <div
                  className="h-full bg-[hsl(var(--av-accent))] transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>

              {/* Step 1: Niche */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <h4 className="text-xl font-display font-bold text-foreground">
                    {lang === 'ru' ? 'В какой сфере работает ваш бизнес?' : 'What industry does your business operate in?'}
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {NICHES.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelectNiche(item.id)}
                        className="p-5 rounded-2xl border border-line bg-[hsl(var(--av-bg))] hover:border-[hsl(var(--av-accent))] hover:bg-[hsl(var(--av-accent-soft))] text-left transition-all font-display font-semibold text-sm flex items-center justify-between group"
                      >
                        <span>{lang === 'ru' ? item.labelRu : item.labelEn}</span>
                        <ArrowRight className="w-4 h-4 text-faint group-hover:text-[hsl(var(--av-accent))] group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Bottleneck */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <h4 className="text-xl font-display font-bold text-foreground">
                    {lang === 'ru' ? 'Какая проблема тормозит ваше развитие больше всего?' : 'What is your primary growth bottleneck?'}
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {BOTTLENECKS.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelectBottleneck(item.id)}
                        className="p-5 rounded-2xl border border-line bg-[hsl(var(--av-bg))] hover:border-[hsl(var(--av-accent))] hover:bg-[hsl(var(--av-accent-soft))] text-left transition-all font-display font-semibold text-sm flex items-center justify-between group"
                      >
                        <span>{lang === 'ru' ? item.labelRu : item.labelEn}</span>
                        <ArrowRight className="w-4 h-4 text-faint group-hover:text-[hsl(var(--av-accent))] group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Current Stack */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <h4 className="text-xl font-display font-bold text-foreground">
                    {lang === 'ru' ? 'На каком IT-стеке система работает сейчас?' : 'What IT stack do you currently rely on?'}
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {STACKS.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelectStack(item.id)}
                        className="p-5 rounded-2xl border border-line bg-[hsl(var(--av-bg))] hover:border-[hsl(var(--av-accent))] hover:bg-[hsl(var(--av-accent-soft))] text-left transition-all font-display font-semibold text-sm flex items-center justify-between group"
                      >
                        <span>{lang === 'ru' ? item.labelRu : item.labelEn}</span>
                        <ArrowRight className="w-4 h-4 text-faint group-hover:text-[hsl(var(--av-accent))] group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            /* Diagnostic Result Summary Card */
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div className="flex items-center gap-2 text-emerald-400 font-mono-tech text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>{lang === 'ru' ? 'Результат аудита сформирован' : 'Diagnostic Audit Complete'}</span>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs text-faint hover:text-foreground transition-all"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'ru' ? 'Пройти заново' : 'Retake Audit'}</span>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Risk Identification */}
                <div className="p-5 rounded-2xl border border-red-500/30 bg-red-500/5 space-y-3">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{lang === 'ru' ? 'Обнаруженные риски и потери' : 'Identified Risks & Losses'}</span>
                  </div>
                  <ul className="space-y-2 text-xs text-dim">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>
                        {lang === 'ru'
                          ? 'Утеря до 35% потенциальной выручки из-за человеческого фактора в ручных процессах.'
                          : 'Potential loss of up to 35% revenue from manual processing gaps.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>
                        {lang === 'ru'
                          ? 'Риск срыва синхронизации остатков при высокой нагрузке на сайт.'
                          : 'Risk of inventory sync breakdown during traffic spikes.'}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Proposed AV Solution */}
                <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{lang === 'ru' ? 'Рекомендованная архитектура AV' : 'Recommended AV Ecosystem Plan'}</span>
                  </div>
                  <ul className="space-y-2 text-xs text-dim">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>
                        {lang === 'ru'
                          ? 'Внедрение авто-пайплайна заявок с AI-ассистентом 24/7 (сокращение времени отклика до 5 сек).'
                          : 'Deployment of 24/7 AI-assisted lead pipeline (response under 5s).'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>
                        {lang === 'ru'
                          ? 'Бесшовная шина данных между веб-порталом, 1С и складом с гарантией 99.99% SLA.'
                          : 'Seamless event-bus between web app, 1C ERP, and warehouse with 99.99% SLA.'}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-line">
                <button
                  onClick={handleSendDiagnostic}
                  className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[hsl(var(--av-accent))] to-emerald-400 text-black font-display font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[hsl(var(--av-accent-glow))]"
                >
                  <FileText className="w-4 h-4" />
                  <span>
                    {lang === 'ru'
                      ? 'Получить расширенный дорожную карту под мой проект'
                      : 'Get Custom Architecture Roadmap'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </Section>
    </>
  )
}
