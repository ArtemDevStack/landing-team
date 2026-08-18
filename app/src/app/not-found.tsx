import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[hsl(var(--av-bg))] text-foreground p-6 text-center">
      <h1 className="font-display font-extrabold text-6xl text-[hsl(var(--av-accent))]">404</h1>
      <h2 className="mt-4 font-display font-bold text-2xl">Страница не найдена</h2>
      <p className="mt-2 text-sm text-dim max-w-md">
        Запрошенная страница не существует или была перемещена.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-[hsl(var(--av-accent))] text-black font-bold px-6 py-3 text-xs uppercase font-mono-tech"
      >
        Вернуться на главную →
      </Link>
    </div>
  )
}
