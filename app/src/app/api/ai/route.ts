import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { messages, lang } = await req.json()

    const apiKey = process.env.OPENROUTER_API_KEY || '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'
    const baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'
    const primaryModel = process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash:free'

    const systemPrompt =
      lang === 'en'
        ? `You are AV Studio's Chief AI Architect. AV Studio is an elite digital agency & software studio.
Key studio facts:
- Team: Senior Full-Stack Developers, AI Engineers, System Architects, UX/UI Designers, QA Lead, Project Managers (9+ years experience).
- Stack: Next.js, React 19, TypeScript, Node.js, Python, PostgreSQL, Redis, Docker, FastAPI, PyTorch/LangChain, 1C/Marketplace APIs.
- Services: Web Apps, E-commerce, Custom CRM/ERP, SaaS, AI Agents & Enterprise RAG, SLA 24/7 support.
- Timelines: MVP in 4-8 weeks, Enterprise systems in 2-4 months.
- Guarantee: 12 months code warranty, 24/7 SLA support, official NDA & contract.
CRITICAL: Answer concisely, expertly, and clearly in markdown format. ALWAYS finish all your sentences completely. Never cut off mid-sentence.`
        : `Ты — Главный ИИ-Архитектор AV Studio (технологическая студия и digital-агентство полного цикла).
Информация о команде и студии:
- Команда: Senior Full-Stack инженеры, AI/ML-разработчики, системные архитекторы, UX/UI дизайнеры, QA и проджект-менеджеры (опыт команды 9+ лет).
- Стек: Next.js, React 19, TypeScript, Node.js, Python, PostgreSQL, Redis, Docker, FastAPI, PyTorch, 1С / МойСклад / WB / Ozon API.
- Услуги: Высоконагруженные сайты, интернет-магазины, кастомные CRM/ERP, B2B SaaS, AI-агенты, RAG-системы, SLA-поддержка 24/7.
- Сроки: MVP за 4–8 недель, сложные Enterprise-системы за 2–4 месяца.
- Гарантия: 12 месяцев гарантии на код, SLA 24/7, работа по NDA и официальному договору.
ВАЖНОЕ ТРЕБОВАНИЕ: Отвечай структурированно, вежливо, экспертно и по существу. ОБЯЗАТЕЛЬНО дописывай все предложения и мысли до самого конца, ни в коем случае не обрывай ответ на полуслове.`

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...(Array.isArray(messages)
        ? messages
            .map((m: any) => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.text,
            }))
            .slice(-6)
        : []),
    ]

    const modelsToTry = Array.from(
      new Set([
        primaryModel,
        'google/gemini-2.5-flash:free',
        'meta-llama/llama-3.3-70b-instruct:free',
        'qwen/qwen-2.5-72b-instruct:free',
        'nvidia/nemotron-3-nano-30b-a3b:free',
        'deepseek/deepseek-r1:free',
      ])
    )

    let replyText = ''

    for (const model of modelsToTry) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 20000)

        const response = await fetch(`${baseUrl.replace(/\/+$/, '')}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://av-studio.digital',
            'X-Title': 'AV Studio AI Assistant',
          },
          body: JSON.stringify({
            model: model,
            messages: formattedMessages,
            temperature: 0.7,
            max_tokens: 1500,
          }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          const content = data?.choices?.[0]?.message?.content
          if (content && typeof content === 'string' && content.trim()) {
            replyText = content.trim()
            break
          }
        }
      } catch (e) {
        console.warn(`OpenRouter attempt failed for model ${model}:`, e)
      }
    }

    if (replyText) {
      return NextResponse.json({ reply: replyText })
    }

    // Backup provider (Pollinations) if OpenRouter free quota or timeout occurs
    const pollController = new AbortController()
    const pollTimeoutId = setTimeout(() => pollController.abort(), 5000)

    const pollRes = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: formattedMessages,
        model: 'openai',
      }),
      signal: pollController.signal,
    })

    clearTimeout(pollTimeoutId)

    if (pollRes.ok) {
      const pollText = await pollRes.text()
      if (pollText.trim()) {
        return NextResponse.json({ reply: pollText.trim() })
      }
    }

    return NextResponse.json({ reply: null, fallback: true })
  } catch (err: any) {
    console.error('AI Route Error:', err)
    return NextResponse.json({ reply: null, fallback: true })
  }
}
