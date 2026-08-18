import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

async function callTelegramApi(token: string, method: string, payload: any) {
  const endpoints = [
    `https://api.telegram.org/bot${token}/${method}`,
    `https://botapi.telegram.org/bot${token}/${method}`,
  ]

  for (const ep of endpoints) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 4500)

      const res = await fetch(ep, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      if (res.ok) return await res.json()
    } catch (err) {
      // Continue to next endpoint mirror
    }
  }
  return null
}

async function queryNeuralAi(userText: string, userName: string): Promise<string> {
  const lower = userText.toLowerCase()

  if (lower.includes('1с') || lower.includes('erp') || lower.includes('мойсклад')) {
    return `Синхронизация с 1С / ERP в AV Studio выполняется через отказоустойчивую шину **RabbitMQ / Kafka**. Это обеспечивает асинхронный обмен данными без задержек и 100% сохранность транзакций даже при перезагрузках 1С.`
  }

  if (lower.includes('цена') || lower.includes('стоимость') || lower.includes('прайс') || lower.includes('бюджет')) {
    return `Стоимость разработки в AV Studio зависит от объёма задач:\n\n• **Лендинг / Promo**: от 60 000 ₽ (3–5 дней)\n• **Корпоративный сайт / E-commerce**: от 140 000 ₽ (2–3 недели)\n• **Сложная CRM / B2B Портал / SaaS**: от 300 000 ₽ (4–8 недель)\n• **AI-Агенты & RAG База знаний**: от 120 000 ₽\n\nНажмите кнопку «⚡ Рассчитать проект» ниже для точного расчета сметы!`
  }

  if (lower.includes('срок') || lower.includes('время') || lower.includes('mvp')) {
    return `Первую рабочую версию (MVP) мы выкатываем за **2–4 недели**. Каждую неделю проводим демонстрацию промежуточных результатов в виде работающего кода.`
  }

  if (lower.includes('стек') || lower.includes('технолог') || lower.includes('язык')) {
    return `Наш основной стек:\n• **Frontend**: Next.js 15 (App Router), React, TypeScript, TailwindCSS\n• **Backend**: Node.js / Go, PostgreSQL, Redis, RabbitMQ\n• **AI & Infra**: RAG Vector DB, Python LLM Harness, Docker, Kubernetes`
  }

  return `Уважаемый ${userName}! Я **ИИ-Архитектор AV Studio**.\n\nМы разрабатываем высоконагруженные сайты, CRM, 1С-интеграции и AI-агентов под ключ.\n\nВы можете вызывать интерактивный расчёт сметы по кнопке ниже или написать напрямую нашему главному архитектору: @av_digital_studio`
}

export async function POST(request: Request) {
  try {
    const update = await request.json()

    const CLIENT_BOT_TOKEN = (
      process.env.TELEGRAM_CLIENT_BOT_TOKEN ||
      process.env.TELEGRAM_BOT_TOKEN ||
      '8454963309:AAF5-gq8o_1yx6XIN1L3TRt_45fAi_IyBIo'
    ).trim()

    const ADMIN_BOT_TOKEN = (
      process.env.TELEGRAM_ADMIN_BOT_TOKEN || '8764760592:AAESv7tJScWn5zAM5sov5HH6V--QOyCcRhw'
    ).trim()

    const ADMIN_CHAT_ID = (process.env.TELEGRAM_ADMIN_CHAT_ID || '947745046').trim()

    if (!CLIENT_BOT_TOKEN) {
      return NextResponse.json({ ok: true })
    }

    // -------------------------------------------------------------
    // 1. HANDLE CALLBACK QUERIES (Inline Buttons Clicks)
    // -------------------------------------------------------------
    if (update.callback_query) {
      const cb = update.callback_query
      const chatId = cb.message.chat.id
      const data = cb.data
      const user = cb.from
      const userName = user.first_name || user.username || 'Посетитель'

      // Answer callback to remove loading animation in TG app
      await callTelegramApi(CLIENT_BOT_TOKEN, 'answerCallbackQuery', {
        callback_query_id: cb.id,
      })

      if (data === 'client_order') {
        const text = `
⚡ <b>Расчет стоимости проекта — AV Studio</b>

Выберите направление разработки для вашего бизнеса:
`.trim()

        await callTelegramApi(CLIENT_BOT_TOKEN, 'sendMessage', {
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [{ text: '🌐 Сайт / E-Commerce (от 80k ₽)', callback_data: 'srv_web' }],
              [{ text: '📊 CRM / 1С / Интеграции (от 180k ₽)', callback_data: 'srv_crm' }],
              [{ text: '🤖 AI-Агент / RAG Система (от 120k ₽)', callback_data: 'srv_ai' }],
              [{ text: '🏢 Enterprise / Highload SaaS', callback_data: 'srv_enterprise' }],
              [{ text: '⬅️ Назад в меню', callback_data: 'menu_start' }],
            ],
          },
        })
      } else if (data.startsWith('srv_')) {
        const srvName =
          data === 'srv_web'
            ? 'Сайт / E-Commerce'
            : data === 'srv_crm'
            ? 'CRM & 1С Интеграция'
            : data === 'srv_ai'
            ? 'AI-Агент / RAG'
            : 'Enterprise SaaS'

        const text = `
✅ <b>Отличный выбор: ${srvName}</b>

Наш ИИ-Архитектор зафиксировал ваш запрос. Выберите ориентировочный бюджет или удобное время для звонка:
`.trim()

        // Send alert notification to Admin
        if (ADMIN_BOT_TOKEN && ADMIN_CHAT_ID) {
          const adminNotice = `
⚡ <b>ЛИД В КЛИЕНТСКОМ TELEGRAM БОТЕ!</b>

👤 <b>Клиент:</b> ${escapeHtml(userName)} (${user.username ? '@' + user.username : 'без username'})
🛠 <b>Направление:</b> ${srvName}
🆔 <b>Chat ID:</b> <code>${chatId}</code>
⏱ <i>Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}</i>
`.trim()

          callTelegramApi(ADMIN_BOT_TOKEN, 'sendMessage', {
            chat_id: ADMIN_CHAT_ID,
            text: adminNotice,
            parse_mode: 'HTML',
          })
        }

        await callTelegramApi(CLIENT_BOT_TOKEN, 'sendMessage', {
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '💬 Обсудить в Telegram с архитектором',
                  url: 'https://t.me/av_digital_studio',
                },
              ],
              [{ text: '📞 Запросить звонок архитектора (15 мин)', callback_data: 'client_call' }],
              [{ text: '🌐 Открыть WebApp калькулятор', web_app: { url: 'https://av-team.digital' } }],
            ],
          },
        })
      } else if (data === 'client_call') {
        const text = `
📞 <b>Запрос звонка принят!</b>

Архитектор AV Studio получит ваш запрос и свяжется с вами в Telegram или по указанному контакту в течение 15 минут.

Вы также можете написать напрямую: <b>@av_digital_studio</b>
`.trim()

        if (ADMIN_BOT_TOKEN && ADMIN_CHAT_ID) {
          const adminNotice = `
📞 <b>ЗАПРОС ЗВОНКА ИЗ ТЕЛЕГРАМ БОТА!</b>

👤 <b>Клиент:</b> ${escapeHtml(userName)} (${user.username ? '@' + user.username : 'без username'})
💬 <b>Ссылка:</b> t.me/${user.username || ''}
🆔 <b>Chat ID:</b> <code>${chatId}</code>
`.trim()

          callTelegramApi(ADMIN_BOT_TOKEN, 'sendMessage', {
            chat_id: ADMIN_CHAT_ID,
            text: adminNotice,
            parse_mode: 'HTML',
          })
        }

        await callTelegramApi(CLIENT_BOT_TOKEN, 'sendMessage', {
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
        })
      } else if (data === 'menu_start') {
        // Return to main menu
        await sendWelcomeMenu(CLIENT_BOT_TOKEN, chatId, userName)
      }

      return NextResponse.json({ ok: true })
    }

    // -------------------------------------------------------------
    // 2. HANDLE INCOMING TEXT MESSAGES
    // -------------------------------------------------------------
    const message = update.message || update.edited_message
    if (!message || !message.chat) {
      return NextResponse.json({ ok: true })
    }

    const chatId = message.chat.id
    const text = (message.text || '').trim()
    const userName = message.from?.first_name || message.from?.username || 'Посетитель'

    // Show "typing..." indicator in Telegram
    callTelegramApi(CLIENT_BOT_TOKEN, 'sendChatAction', {
      chat_id: chatId,
      action: 'typing',
    })

    if (text.startsWith('/start') || text.includes('старт') || text.includes('меню')) {
      await sendWelcomeMenu(CLIENT_BOT_TOKEN, chatId, userName)
      return NextResponse.json({ ok: true })
    }

    // -------------------------------------------------------------
    // 3. AI NEURAL RESPONSE FOR ANY CUSTOM USER TEXT
    // -------------------------------------------------------------
    const aiReply = await queryNeuralAi(text, userName)

    await callTelegramApi(CLIENT_BOT_TOKEN, 'sendMessage', {
      chat_id: chatId,
      text: aiReply,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '⚡ Рассчитать стоимость проекта', callback_data: 'client_order' }],
          [{ text: '🌐 Открыть WebApp на сайте', web_app: { url: 'https://av-team.digital' } }],
          [{ text: '💬 Связаться с архитектором', url: 'https://t.me/av_digital_studio' }],
        ],
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Client Telegram Bot Webhook Error:', error)
    return NextResponse.json({ ok: true })
  }
}

async function sendWelcomeMenu(token: string, chatId: number, userName: string) {
  const welcomeText = `
⚡ <b>Добро пожаловать в AV Team Digital Studio!</b>

Здравствуйте, <b>${escapeHtml(userName)}</b>!
Мы проектируем и создаем Highload-сайты, CRM, B2B-порталы, 1С-интеграции и автономных <b>AI-агентов</b> под ключ.

🤖 <b>Задайте любой вопрос прямо здесь</b> — наш нейро-архитектор проконсультирует вас по стеку, срокам и ценам в реальном времени!
`.trim()

  await callTelegramApi(token, 'sendMessage', {
    chat_id: chatId,
    text: welcomeText,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🌐 Открыть WebApp (Сайт AV Studio)',
            web_app: { url: 'https://av-team.digital' },
          },
        ],
        [
          { text: '⚡ Рассчитать стоимость проекта', callback_data: 'client_order' },
          { text: '📞 Запросить звонок (15 мин)', callback_data: 'client_call' },
        ],
        [
          { text: '💬 Написать архитектору в Telegram', url: 'https://t.me/av_digital_studio' },
        ],
      ],
    },
  })
}

export async function GET() {
  return NextResponse.json({
    status: 'Client Telegram AI WebApp Bot Webhook Ready',
    timestamp: new Date().toISOString(),
  })
}
