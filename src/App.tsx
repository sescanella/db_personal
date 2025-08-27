export default function App() {
  return (
    <main className="min-h-dvh bg-neutral-50 text-neutral-900">
      <section className="mx-auto max-w-3xl p-6">
        <h1 className="text-3xl font-bold tracking-tight">
          db_personal <span className="text-primary">MVP</span>
        </h1>
        <p className="mt-2 text-sm opacity-80">Stack: Vite + React + TypeScript + Tailwind v4</p>

        <div className="mt-6 rounded-xl border bg-white p-5 shadow-sm">
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>Tailwind v4 activo (prueba clases utilitarias)</li>
            <li>
              Color corporativo <code className="bg-neutral-100 px-1 rounded">text-primary</code>
            </li>
            <li>Estructura base de carpetas creada</li>
          </ul>
        </div>
      </section>
    </main>
  )
}
