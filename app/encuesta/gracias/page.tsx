export default function GraciasPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="w-5 h-5 bg-amber-400 rounded-full" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Listo, recibimos todo
        </h1>
        <p className="mt-3 text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
          Estamos armando tu diagnóstico con datos reales de tu rubro. En breve
          te llega por email.
        </p>
        <div className="mt-10 h-1 bg-slate-200 rounded-full overflow-hidden max-w-xs mx-auto">
          <div className="h-full w-1/2 bg-amber-400 rounded-full animate-pulse" />
        </div>
        <p className="mt-3 text-xs text-slate-400">Procesando tu diagnóstico...</p>
      </div>
    </div>
  );
}
