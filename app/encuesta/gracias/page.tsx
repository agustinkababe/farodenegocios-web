export default function GraciasPage() {
  return (
    <div className="min-h-screen bg-bg font-sans flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-12 h-12 bg-accent/15 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M4 10l4 4 8-8"
              stroke="#C7872A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-semibold text-ink">
          Listo, recibimos todo
        </h1>
        <p className="mt-3 font-sans text-muted text-sm leading-relaxed max-w-sm mx-auto">
          Estamos armando tu diagnóstico con datos reales de tu rubro. En breve
          te llega por email.
        </p>
        <div className="mt-10 h-1 bg-line rounded-full overflow-hidden max-w-xs mx-auto">
          <div className="h-full w-1/2 bg-accent rounded-full animate-pulse" />
        </div>
        <p className="mt-3 text-xs text-muted">Procesando tu diagnóstico...</p>
      </div>
    </div>
  );
}
