import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line py-8 px-6 bg-surface">
      <div className="max-w-5xl mx-auto flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Marca + copyright */}
        <div>
          <span className="font-display text-[13px] font-medium text-ink">
            FaroDeNegocios.com.ar
          </span>
          <span className="font-sans text-[12px] text-muted ml-2">
            © {year}
          </span>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2" aria-label="Links del pie">
          <Link href="/articulos" className="font-sans text-xs text-muted hover:text-ink transition-colors">
            Artículos
          </Link>
          <Link href="/nosotros" className="font-sans text-xs text-muted hover:text-ink transition-colors">
            Nosotros
          </Link>
          <Link href="/equipo" className="font-sans text-xs text-muted hover:text-ink transition-colors">
            Equipo editorial
          </Link>
          <Link href="/contacto" className="font-sans text-xs text-muted hover:text-ink transition-colors">
            Contacto
          </Link>
          <Link href="/privacidad" className="font-sans text-xs text-muted hover:text-ink transition-colors">
            Privacidad
          </Link>
          <Link href="/terminos" className="font-sans text-xs text-muted hover:text-ink transition-colors">
            Términos
          </Link>
          <Link
            href="/encuesta"
            className="font-sans text-xs font-semibold text-ink hover:text-navy-700 transition-colors"
          >
            Diagnóstico gratuito →
          </Link>
        </nav>
      </div>
    </footer>
  );
}
