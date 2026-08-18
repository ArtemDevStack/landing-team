import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export const dynamic = 'force-dynamic'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function formatCommentToList(commentText: string): string {
  if (!commentText || !commentText.trim()) {
    return '<li style="margin-bottom: 8px; color: #94a3b8; font-size: 13px;">• Детали не указаны (клиент заполнил только контакты)</li>'
  }

  // Split lines or bullet points for clear list layout
  const lines = commentText
    .split(/\n|,|;/)
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length === 1) {
    return `<li style="margin-bottom: 8px; color: #ffffff; font-size: 14px; line-height: 1.6;"><strong style="color: #10b981;">•</strong> ${escapeHtml(lines[0])}</li>`
  }

  return lines
    .map(
      (line) =>
        `<li style="margin-bottom: 8px; color: #ffffff; font-size: 14px; line-height: 1.5;"><strong style="color: #10b981;">•</strong> ${escapeHtml(line)}</li>`
    )
    .join('')
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

    // Parse contact for quick links
    let cleanPhone = ''
    let tgUser = ''
    if (contact.includes('@')) {
      tgUser = contact.replace(/^@/, '').trim()
    } else {
      const digits = contact.replace(/\D/g, '')
      if (digits.length >= 10) {
        cleanPhone = '+' + digits
      }
    }

    // Environment Variables
    const ADMIN_BOT_TOKEN = (process.env.TELEGRAM_ADMIN_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || '8764760592:AAESv7tJScWn5zAM5sov5HH6V--QOyCcRhw').trim()
    const ADMIN_CHAT_ID = (process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_CHAT_ID || '947745046').trim()

    const SMTP_HOST = (process.env.SMTP_HOST || 'smtp.gmail.com').trim()
    const SMTP_PORT = Number(process.env.SMTP_PORT) || 465
    const SMTP_USER = (process.env.SMTP_USER || 'artem2006pax@gmail.com').trim()
    const SMTP_PASSWORD = (process.env.SMTP_PASSWORD || 'wzojakwcncqeivkv').replace(/\s+/g, '')
    const CONTACT_EMAIL = (process.env.CONTACT_EMAIL || 'artem2006pax@gmail.com').trim()

    let telegramSent = false
    let emailSent = false
    let telegramError = ''
    let emailError = ''

    // 1. Send Email via Gmail SMTP Nodemailer
    if (SMTP_USER && SMTP_PASSWORD) {
      try {
        const transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: SMTP_PORT,
          secure: SMTP_PORT === 465,
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASSWORD,
          },
        })

        const mailHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #e2e8f0; padding: 28px; border-radius: 20px; max-width: 620px; margin: 0 auto; border: 1px solid #1e293b; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
            
            <!-- Header -->
            <div style="border-bottom: 2px solid #10b981; padding-bottom: 18px; margin-bottom: 24px;">
              <table style="width: 100%;">
                <tr>
                  <td>
                    <h1 style="color: #10b981; margin: 0; font-size: 22px; font-weight: 800;">⚡ НОВАЯ ЗАЯВКА — AV STUDIO</h1>
                    <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 13px;">Поступил новый запрос с сайта av.digital</p>
                  </td>
                  <td style="text-align: right; vertical-align: top;">
                    <span style="background-color: #064e3b; color: #34d399; font-size: 11px; font-weight: bold; padding: 6px 12px; border-radius: 12px; border: 1px solid #059669;">НОВЫЙ ЛИД</span>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Key Client Data List -->
            <div style="background-color: #161e2e; border-radius: 14px; padding: 20px; border: 1px solid #243147; margin-bottom: 24px;">
              <div style="font-size: 12px; font-weight: bold; color: #10b981; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px;">📋 ОСНОВНЫЕ ДАННЫЕ КЛИЕНТА</div>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr style="border-bottom: 1px solid #1e293b;">
                  <td style="padding: 10px 0; color: #94a3b8; width: 150px; font-weight: 600;">👤 Заказчик:</td>
                  <td style="padding: 10px 0; font-weight: 700; color: #ffffff;">${escapeHtml(name)}</td>
                </tr>
                <tr style="border-bottom: 1px solid #1e293b;">
                  <td style="padding: 10px 0; color: #94a3b8; font-weight: 600;">📞 Контакт связи:</td>
                  <td style="padding: 10px 0; font-weight: 700; color: #10b981; font-family: monospace; font-size: 15px;">${escapeHtml(contact)}</td>
                </tr>
                <tr style="border-bottom: 1px solid #1e293b;">
                  <td style="padding: 10px 0; color: #94a3b8; font-weight: 600;">🛠 Направление:</td>
                  <td style="padding: 10px 0; font-weight: 600; color: #ffffff;">${escapeHtml(service || 'Разработка цифрового продукта')}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #94a3b8; font-weight: 600;">💰 Ориентир бюджета:</td>
                  <td style="padding: 10px 0; font-weight: 700; color: #f59e0b;">${escapeHtml(budget || 'По договоренности')}</td>
                </tr>
              </table>
            </div>

            <!-- Project Details List -->
            <div style="background-color: #161e2e; border-radius: 14px; padding: 20px; border: 1px solid #243147; margin-bottom: 24px;">
              <div style="font-size: 12px; font-weight: bold; color: #10b981; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">📝 ДЕТАЛИ И ПОЖЕЛАНИЯ К ПРОЕКТУ</div>
              
              <ul style="margin: 0; padding-left: 6px; list-style-type: none;">
                ${formatCommentToList(comment)}
              </ul>
            </div>

            <!-- Quick Action Contact Buttons -->
            ${
              cleanPhone || tgUser
                ? `
            <div style="text-align: center; margin-bottom: 24px;">
              ${
                cleanPhone
                  ? `<a href="tel:${cleanPhone}" style="display: inline-block; background-color: #10b981; color: #000000; font-weight: 800; font-size: 13px; text-decoration: none; padding: 12px 20px; border-radius: 10px; margin: 4px;">📞 Позвонить (${cleanPhone})</a>`
                  : ''
              }
              ${
                tgUser
                  ? `<a href="https://t.me/${tgUser}" target="_blank" style="display: inline-block; background-color: #0284c7; color: #ffffff; font-weight: 800; font-size: 13px; text-decoration: none; padding: 12px 20px; border-radius: 10px; margin: 4px;">💬 Написать в Telegram (@${tgUser})</a>`
                  : ''
              }
            </div>`
                : ''
            }

            <!-- Footer info -->
            <div style="color: #64748b; font-size: 12px; border-top: 1px solid #1e293b; padding-top: 16px; text-align: justify;">
              <span>AV Studio Notification System</span> • <span>Время отправки: ${timestamp} (МСК)</span>
            </div>
          </div>
        `

        const info = await transporter.sendMail({
          from: `"AV Studio Landing" <${SMTP_USER}>`,
          to: CONTACT_EMAIL,
          subject: `⚡ Заявка AV Studio: ${service || 'Проект'} — ${name}`,
          html: mailHtml,
        })

        if (info.messageId) {
          emailSent = true
          console.log('[send-order] Gmail Email sent successfully:', info.messageId)
        }
      } catch (err: any) {
        emailError = err.message
        console.error('[send-order] Gmail Nodemailer error:', err)
      }
    }

    // 2. Send Admin Telegram Notification (with fallback mirrors)
    if (ADMIN_BOT_TOKEN && ADMIN_CHAT_ID) {
      const tgEndpoints = [
        `https://api.telegram.org/bot${ADMIN_BOT_TOKEN}/sendMessage`,
        `https://botapi.telegram.org/bot${ADMIN_BOT_TOKEN}/sendMessage`,
      ]

      let archSection = ''
      let detailsSection = comment || 'Не указаны'

      if (comment && comment.includes('🏗 Модули архитектуры')) {
        const parts = comment.split('\n\n')
        const archPart = parts.find((p: string) => p.includes('🏗 Модули архитектуры'))
        if (archPart) {
          archSection = `\n${archPart}`
          detailsSection = parts.filter((p: string) => !p.includes('🏗 Модули архитектуры')).join('\n\n') || 'Указана только структура архитектуры'
        }
      }

      const tgText = `
⚡ <b>НОВАЯ ЗАЯВКА С САЙТА AV STUDIO</b>

👤 <b>Имя / Заказчик:</b> ${escapeHtml(name)}
📞 <b>Контакты:</b> <code>${escapeHtml(contact)}</code>
🛠 <b>Направление:</b> ${escapeHtml(service || 'Full Cycle')}
💰 <b>Бюджет:</b> ${escapeHtml(budget || 'По договоренности')}${archSection ? `\n\n${escapeHtml(archSection)}` : ''}

📝 <b>Детали и пожелания к проекту:</b>
<i>${escapeHtml(detailsSection)}</i>

⏱ <i>Время: ${timestamp} (МСК)</i>
`.trim()

      for (const endpoint of tgEndpoints) {
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 4500)

          const tgRes = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: ADMIN_CHAT_ID,
              text: tgText,
              parse_mode: 'HTML',
            }),
            signal: controller.signal,
          })

          clearTimeout(timeoutId)

          if (tgRes.ok) {
            telegramSent = true
            console.log('[send-order] Telegram notification sent successfully via:', endpoint)
            break
          } else {
            const tgJson = await tgRes.json()
            telegramError = tgJson.description || 'Telegram API error'
            console.warn('[send-order] Telegram endpoint error:', endpoint, tgJson)
          }
        } catch (err: any) {
          telegramError = err.message
          console.warn('[send-order] Telegram endpoint fetch failed:', endpoint, err.message)
        }
      }
    }

    return NextResponse.json({
      success: true,
      emailSent,
      telegramSent,
      telegramError,
      emailError,
      message: 'Заявка успешно принята! Наш архитектор свяжется с вами в течение 15 минут.',
    })
  } catch (error) {
    console.error('API /send-order error:', error)
    return NextResponse.json(
      { success: false, message: 'Внутренняя ошибка сервера при обработке заявки.' },
      { status: 500 }
    )
  }
}
