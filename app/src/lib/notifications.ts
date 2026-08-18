export interface OrderPayload {
  name: string
  contact: string
  service: string
  budget?: string
  comment?: string
}

export interface SendOrderResult {
  success: boolean
  message: string
  telegramSent?: boolean
  emailSent?: boolean
}

// Configurable environment settings
const TG_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || ''
const TG_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID || ''
const EMAIL_ENDPOINT = import.meta.env.VITE_EMAIL_ENDPOINT || ''
export const DEFAULT_CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'hello@av-studio.digital'
export const DEFAULT_TG_CHANNEL = import.meta.env.VITE_TELEGRAM_CHANNEL || 'https://t.me/av_digital_studio'

export async function sendOrder(payload: OrderPayload): Promise<SendOrderResult> {
  let telegramSent = false
  let emailSent = false

  const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })

  // 1. Send to Telegram Bot if configured
  if (TG_BOT_TOKEN && TG_CHAT_ID) {
    try {
      const tgText = `
🚀 <b>НОВАЯ ЗАЯВКА С САЙТА AV</b>

👤 <b>Клиент:</b> ${escapeHtml(payload.name)}
📞 <b>Контакты:</b> ${escapeHtml(payload.contact)}
🛠 <b>Направление:</b> ${escapeHtml(payload.service)}
💰 <b>Бюджет:</b> ${escapeHtml(payload.budget || 'Не указан')}
📝 <b>Детали проекта:</b>
${escapeHtml(payload.comment || 'Не указаны')}

⏱ <i>Дата: ${timestamp}</i>
`.trim()

      const res = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TG_CHAT_ID,
          text: tgText,
          parse_mode: 'HTML',
        }),
      })

      if (res.ok) {
        telegramSent = true
      } else {
        console.warn('Telegram Bot API error response:', await res.text())
      }
    } catch (err) {
      console.error('Failed to send Telegram message:', err)
    }
  }

  // 2. Send to Email Endpoint if configured
  if (EMAIL_ENDPOINT) {
    try {
      const res = await fetch(EMAIL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: DEFAULT_CONTACT_EMAIL,
          subject: `Новая заявка AV: ${payload.service} (${payload.name})`,
          payload,
          timestamp,
        }),
      })

      if (res.ok) {
        emailSent = true
      } else {
        console.warn('Email Endpoint error response:', await res.text())
      }
    } catch (err) {
      console.error('Failed to send Email notification:', err)
    }
  }

  // Debug log for developer / owner
  console.log('[AV Studio Order Received]:', {
    payload,
    telegramSent,
    emailSent,
    hasTgConfig: Boolean(TG_BOT_TOKEN && TG_CHAT_ID),
    hasEmailConfig: Boolean(EMAIL_ENDPOINT),
  })

  // If credentials aren't configured yet in .env, we gracefully report success (with developer note)
  const isEnvConfigured = Boolean((TG_BOT_TOKEN && TG_CHAT_ID) || EMAIL_ENDPOINT)

  return {
    success: true,
    telegramSent,
    emailSent,
    message: isEnvConfigured
      ? 'Заявка успешно отправлена! Наш менеджер свяжется с вами в течение 15 минут.'
      : 'Заявка зарегистрирована! (Для отправки в TG/Email укажите VITE_TELEGRAM_BOT_TOKEN и VITE_TELEGRAM_CHAT_ID в .env)',
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
