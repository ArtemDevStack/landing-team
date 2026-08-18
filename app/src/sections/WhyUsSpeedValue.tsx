'use client'

import { Reveal, Section, SectionHead, Rail } from '../components/ui-bits'
import { useLang } from '../i18n'
import { useOrderModal } from '../context/ModalContext'

export default function WhyUsSpeedValue() {
  const { lang } = useLang()
  const { openOrderModal } = useOrderModal()

  const ADVANTAGES = [
    {
      icon: '🧠',
      titleRu: 'От вас только идея — остальное додумаем мы',
      titleEn: 'Just an idea from you — we refine & build it all',
      descRu: 'Вам не нужно писать раздутые ТЗ. Достаточно рассказать задумку своими словами — мы сами доработаем логику, создадим структуру и отдадим готовый продукт.',
      descEn: 'No complex specs needed. Share your core concept and we will design, architect, and deliver a turn-key solution.',
      highlightRu: 'ТЗ и точная смета в день обращения',
      highlightEn: 'Detailed spec & quote on day one',
    },
    {
      icon: '⚡',
      titleRu: 'Запуск Лендинга или ИМ за 1-2 дня',
      titleEn: 'Landing or E-Shop Launch in 1-2 Days',
      descRu: 'Пока агентства 2 недели согласовывают договор, мы уже выгружаем готовый интернет-магазин или лендинг на сервер и подготавливаем прием заявок.',
      descEn: 'While agencies take weeks to sign contracts, we deploy your production-ready store or landing page in 24-48 hours.',
      highlightRu: 'Скорость запуска быстрее рынка в 5 раз',
      highlightEn: '5x Faster time-to-market',
    },
    {
      icon: '🤝',
      titleRu: 'Личные встречи вживую & Быстрые созвоны',
      titleEn: 'In-person Meetings & Instant Calls',
      descRu: 'Готовы встретиться лично для обсуждения деталей или созвониться за 15 минут. Прямой контакт с архитекторами без бюрократических аккаунт-менеджеров.',
      descEn: 'Available for in-person meetings or rapid 15-minute sync calls. Direct contact with core engineers without middle managers.',
      highlightRu: 'Прямой контакт без лишних звеньев',
      highlightEn: 'Direct lead architect access',
    },
    {
      icon: '💰',
      titleRu: 'Цены по низу рынка & Экономия бюджета',
      titleEn: 'Bottom-of-Market Rates & Budget Savings',
      descRu: 'У нас нет накруток за бренд и раздутые офисы студий. Вы получаете качество Enterprise-уровня по честной цене и экономно привлекаете первых лидов.',
      descEn: 'No inflated agency overhead. Get enterprise engineering quality at bottom-of-market rates to maximize your ROI.',
      highlightRu: 'Экономия до 60% бюджета компании',
      highlightEn: 'Save up to 60% budget',
    },
    {
      icon: '⚖️',
      titleRu: 'Полное сопровождение & Юридическая чистота',
      titleEn: 'Turnkey Support & Legal Compliance',
      descRu: 'Берем на себя весь цикл: хостинг, серверы, домены, SSL, 152-ФЗ, оферты, подключение эквайринга и рекомендации по привлечению целевых клиентов.',
      descEn: 'Full lifecycle coverage: hosting, servers, domains, SSL, legal compliance, payments, and lead generation advice.',
      highlightRu: '100% Готовый к работе бизнесу веб-продукт',
      highlightEn: '100% Ready-to-operate business setup',
    },
  ]

  const COMPARISON = [
    {
      featureRu: 'Сроки сметы и ТЗ',
      featureEn: 'Quote & Spec Timeline',
      agencyRu: '3 - 7 дней согласований',
      agencyEn: '3 - 7 days of paperwork',
      avRu: 'В день обращения (за пару часов)',
      avEn: 'Same day (within hours)',
    },
    {
      featureRu: 'Срок запуска Лендинга / ИМ',
      featureEn: 'Landing / Store Launch',
      agencyRu: 'От 3 до 6 недель',
      agencyEn: '3 to 6 weeks',
      avRu: '1 - 2 дня (Рекордная скорость)',
      avEn: '1 - 2 Days (Record speed)',
    },
    {
      featureRu: 'Участие заказчика',
      featureEn: 'Client Effort Required',
      agencyRu: 'Требуют детальное ТЗ и брифинг',
      agencyEn: 'Requires detailed technical specs',
      avRu: 'Только идея — остальное доработаем сами',
      avEn: 'Just an idea — we build the rest',
    },
    {
      featureRu: 'Коммуникация',
      featureEn: 'Communication',
      agencyRu: 'Переписка через менеджеров',
      agencyEn: 'Via account managers',
      avRu: 'Личные встречи вживую / Созвон в 15 мин',
      avEn: 'In-person / 15-min instant sync',
    },
    {
      featureRu: 'Уровень цен',
      featureEn: 'Pricing Level',
      agencyRu: 'Завышенные ценники студий (x3-x5)',
      agencyEn: 'Inflated agency prices (3x-5x)',
      avRu: 'Честные цены по низу рынка',
      avEn: 'Ultra-competitive market rates',
    },
  ]

  return (
    <>
      <Rail left={lang === 'ru' ? 'ПОЧЕМУ С НАМИ ВЫГОДНО' : 'WHY AV TEAM'} right="AV / VALUE & SPEED" />
      <Section id="why-us" className="pt-16 md:pt-24">
        <SectionHead
          eyebrow={lang === 'ru' ? 'Преимущество скорости и цены' : 'Speed & Cost Advantage'}
          title={
            lang === 'ru'
              ? 'Почему с нами работать в 5 раз выгоднее и быстрее, чем со студиями'
              : 'Why Working With Us is 5x Faster & Cheaper Than Agencies'
          }
          sub={
            lang === 'ru'
              ? 'Весь цикл от идеи до запуска берем на себя. От вас только задумать продукт — мы доработаем, напишем ТЗ, запустим за 1-2 дня и поможем с лидами.'
              : 'We handle the entire stack from raw idea to server deployment. You share the concept, we refine it, write specs, launch in 1-2 days, and help scale leads.'
          }
        />

        {/* 5 Core Advantage Cards */}
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ADVANTAGES.map((item, idx) => (
            <Reveal key={item.titleRu} i={idx}>
              <div className="group relative h-full rounded-3xl border border-line bg-[hsl(var(--av-bg-raise)/0.5)] p-7 md:p-8 flex flex-col justify-between hover:border-[hsl(var(--av-accent)/0.6)] hover:-translate-y-1 transition-all duration-500 shadow-xl overflow-hidden">
                <div
                  className="pointer-events-none absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[70px] opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                  style={{ background: 'hsl(var(--av-accent))' }}
                />

                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--av-accent-soft))] border border-[hsl(var(--av-accent)/0.4)] flex items-center justify-center text-2xl shadow-[0_0_16px_hsl(var(--av-accent-glow))]">
                    {item.icon}
                  </div>

                  <h3 className="mt-6 font-display font-bold text-xl md:text-22 tracking-tight group-hover:text-[hsl(var(--av-accent))] transition-colors">
                    {lang === 'ru' ? item.titleRu : item.titleEn}
                  </h3>

                  <p className="mt-3 text-sm text-dim leading-relaxed">
                    {lang === 'ru' ? item.descRu : item.descEn}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-line flex items-center gap-2 text-xs font-mono-tech text-[hsl(var(--av-accent))] font-semibold">
                  <span>✓</span>
                  <span>{lang === 'ru' ? item.highlightRu : item.highlightEn}</span>
                </div>
              </div>
            </Reveal>
          ))}

          {/* Quick Call Action Box */}
          <Reveal i={4}>
            <div className="h-full rounded-3xl border border-[hsl(var(--av-accent))] bg-[hsl(var(--av-accent-soft))] p-7 md:p-8 flex flex-col justify-between shadow-[0_0_36px_hsl(var(--av-accent-glow))]">
              <div>
                <div className="font-mono-tech text-xs uppercase tracking-widest text-[hsl(var(--av-accent))] font-bold mb-2">
                  ⚡ {lang === 'ru' ? 'Встреча или Созвон Сегодня' : 'Meet or Call Today'}
                </div>
                <h3 className="font-display font-extrabold text-2xl tracking-tight text-foreground">
                  {lang === 'ru' ? 'Есть идея проекта?' : 'Have a Project Idea?'}
                </h3>
                <p className="mt-3 text-sm text-dim leading-relaxed">
                  {lang === 'ru'
                    ? 'Составим ТЗ и детализированную смету в течение нескольких часов после созвона или личной встречи.'
                    : 'We will draft specs and an itemized quote within hours after a quick call or coffee meeting.'}
                </p>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => openOrderModal('Встреча & Быстрое ТЗ')}
                  className="w-full rounded-full bg-[hsl(var(--av-accent))] text-black font-bold px-6 py-3.5 text-sm hover:shadow-[0_0_32px_hsl(var(--av-accent-glow))] transition-all flex items-center justify-center gap-2"
                >
                  <span>{lang === 'ru' ? 'Обсудить идею вживую →' : 'Discuss Idea Live →'}</span>
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Direct Comparison Table */}
        <div className="mt-14 rounded-3xl border border-line bg-[hsl(var(--av-bg-raise)/0.4)] p-4 sm:p-6 md:p-10 shadow-2xl">
          <div className="font-mono-tech text-xs uppercase tracking-widest text-[hsl(var(--av-accent))] mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--av-accent))]" />
            {lang === 'ru' ? 'Прямое сравнение' : 'Direct Comparison'}
          </div>
          <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mb-6 sm:mb-8">
            {lang === 'ru' ? 'AV Team против обычных веб-студий' : 'AV Team vs Traditional Agencies'}
          </h3>

          {/* Mobile Cards (<640px) */}
          <div className="sm:hidden space-y-3">
            {COMPARISON.map((row) => (
              <div key={row.featureRu} className="rounded-2xl border border-line bg-[hsl(var(--av-bg))] p-4 space-y-2">
                <div className="font-display font-bold text-xs text-foreground border-b border-line pb-1.5">
                  {lang === 'ru' ? row.featureRu : row.featureEn}
                </div>
                <div className="text-xs space-y-1.5">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-300">
                    <span className="font-mono-tech text-[10px] text-rose-400 block font-bold">
                      {lang === 'ru' ? 'Обычные Студии:' : 'Traditional Agencies:'}
                    </span>
                    {lang === 'ru' ? row.agencyRu : row.agencyEn}
                  </div>
                  <div className="p-2 rounded-lg bg-[hsl(var(--av-accent-soft))] text-[hsl(var(--av-accent))] font-bold">
                    <span className="font-mono-tech text-[10px] block text-[hsl(var(--av-accent))]">
                      ⚡ AV Team:
                    </span>
                    {lang === 'ru' ? row.avRu : row.avEn}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (>=640px) */}
          <div className="hidden sm:block overflow-x-auto custom-scrollbar-x">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-line text-xs font-mono-tech uppercase text-faint">
                  <th className="py-4 px-4 font-semibold">{lang === 'ru' ? 'Критерий' : 'Criterion'}</th>
                  <th className="py-4 px-4 font-semibold text-rose-400">{lang === 'ru' ? 'Обычные Студии & Агентства' : 'Traditional Agencies'}</th>
                  <th className="py-4 px-4 font-semibold text-[hsl(var(--av-accent))]">{lang === 'ru' ? '⚡ AV Team' : '⚡ AV Team'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-sm">
                {COMPARISON.map((row) => (
                  <tr key={row.featureRu} className="hover:bg-[hsl(var(--av-bg))] transition-colors">
                    <td className="py-4 px-4 font-medium text-foreground">{lang === 'ru' ? row.featureRu : row.featureEn}</td>
                    <td className="py-4 px-4 text-faint bg-rose-500/5">{lang === 'ru' ? row.agencyRu : row.agencyEn}</td>
                    <td className="py-4 px-4 font-bold text-[hsl(var(--av-accent))] bg-[hsl(var(--av-accent-soft))]">
                      {lang === 'ru' ? row.avRu : row.avEn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>
    </>
  )
}
