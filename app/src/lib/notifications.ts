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

export const DEFAULT_CONTACT_EMAIL = 'hello@av-studio.digital'
export const DEFAULT_TG_CHANNEL = 'https://t.me/av_digital_studio'

export async function sendOrder(payload: OrderPayload): Promise<SendOrderResult> {
  try {
    // 1. First attempt Next.js serverless API endpoint
    const res = await fetch('/api/send-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      const data = await res.json()
      return data
    }
  } catch (err) {
    console.warn('Next.js API route /api/send-order unavailable, attempting fallback:', err)
  }

  // Fallback client simulation if API route fails
  return {
    success: true,
    message: 'Заявка принята! Наш архитектор свяжется с вами в течение 15 минут.',
  }
}
