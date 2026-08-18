import { NextResponse } from 'next/server'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, contact, service, budget, comment } = body

    if (!name || !contact) {
      return NextResponse.json(
        { success: false, message: 'Имя и контактные данные обязательны' },
        { status: 400 }
      )
    }

    const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })

    const TG_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN || ''
    const TG_CHAT_ID = process.env.TELEGRAM_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID || ''
    const EMAIL_ENDPOINT = process.env.EMAIL_ENDPOINT || process.env.VITE_EMAIL_ENDPOINT || ''
    const CONTACT_EMAIL = process.env.CONTACT_EMAIL || process.env.VITE_CONTACT_EMAIL || 'hello@av-studio.digital'

    let telegramSent = false
    let emailSent = false

    // Send Telegram Notification
    if (TG_BOT_TOKEN && TG_CHAT_ID) {
      try {
        const tgText = `
🚀 <b>НОВАЯ ЗАЯВКА С САЙТА AV TEAM</b>

👤 <b>Клиент:</b> ${escapeHtml(name)}
📞 <b>Контакты:</b> ${escapeHtml(contact)}
🛠 <b>Направление:</b> ${escapeHtml(service || 'Full Cycle')}
💰 <b>Бюджет:</b> ${escapeHtml(budget || 'По договоренности')}
📝 <b>Детали проекта:</b>
${escapeHtml(comment || 'Не указаны')}

⏱ <i>Дата: ${timestamp}</i>
`.trim()

        const tgRes = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TG_CHAT_ID,
            text: tgText,
            parse_mode: 'HTML',
          }),
        })

        if (tgRes.ok) telegramSent = true
      } catch (err) {
        console.error('Telegram notification error:', err)
      }
    }

    // Send Email Notification if configured
    if (EMAIL_ENDPOINT) {
      try {
        const emailRes = await fetch(EMAIL_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: CONTACT_EMAIL,
            subject: `Новая заявка AV Team: ${service} (${name})`,
            payload: body,
            timestamp,
          }),
        })

        if (emailRes.ok) emailSent = true
      } catch (err) {
        console.error('Email endpoint notification error:', err)
      }
    }

    console.log('[Next.js Server API Order Log]:', {
      body,
      telegramSent,
      emailSent,
      timestamp,
    })

    const isEnvConfigured = Boolean((TG_BOT_TOKEN && TG_CHAT_ID) || EMAIL_ENDPOINT)

    return NextResponse.json({
      success: true,
      telegramSent,
      emailSent,
      message: isEnvConfigured
        ? 'Заявка успешно отправлена! Наш архитектор свяжется с вами в течение 15 минут.'
        : 'Заявка принята! (Для автоматической отправки в TG/Email укажите TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в .env)',
    })
  } catch (error) {
    console.error('API /send-order error:', error)
    return NextResponse.json(
      { success: false, message: 'Внутренняя ошибка сервера при обработке заявки.' },
      { status: 500 }
    )
  }
}
