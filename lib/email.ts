import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY no configurada");
    _resend = new Resend(key);
  }
  return _resend;
}

function primerParrafo(texto: string): string {
  return (
    texto
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(
        (p) =>
          p.length > 0 &&
          !p.match(/^#+\s/) &&
          !p.match(/^.{0,60}:$/)
      )[0] ?? ""
  );
}

function truncar(texto: string, max = 80): string {
  return texto.length <= max ? texto : texto.slice(0, max - 3) + "...";
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─── Tipos públicos ────────────────────────────────────────────────────────────

export type DatosMailInforme = {
  email: string;
  rubro: string;
  titulo: string;
  seccion_espejo: string;
  informeUrl: string;     // /r/[id] — registra clic antes de redirigir
  unsubscribeUrl: string; // /baja/[token]
};

export type DatosMailSeguimiento = {
  email: string;
  rubro: string;
  tarea_repetitiva: string;
  titulo: string;
  fiableUrl: string;    // /f/[id] — registra clic_fiable_at y redirige a fiable.com.ar
  informeUrl: string;   // /r/[id] — link secundario al informe
  unsubscribeUrl: string;
};

// ─── Mail inmediato (informe) ──────────────────────────────────────────────────

export async function enviarMailInforme(datos: DatosMailInforme): Promise<void> {
  const resend = getResend();
  const from   = process.env.EMAIL_FROM ?? "onboarding@resend.dev";
  const extracto = primerParrafo(datos.seccion_espejo);

  await resend.emails.send({
    from,
    to:      datos.email,
    subject: `Tu diagnóstico ya está — ${datos.titulo}`,
    html:    buildHtmlInforme({ ...datos, extracto }),
  });
}

function buildHtmlInforme({
  titulo,
  extracto,
  informeUrl,
  unsubscribeUrl,
}: DatosMailInforme & { extracto: string }): string {
  return wrapBase(
    `
    <h1 style="margin:0 0 6px;font-size:20px;font-weight:700;color:#0C2236;
               line-height:1.3;font-family:Georgia,'Times New Roman',serif;">
      ${escHtml(titulo)}
    </h1>
    <p style="margin:0 0 24px;font-size:13px;color:#7A746A;
              font-family:Arial,Helvetica,sans-serif;">
      Tu diagnóstico gratuito ya está listo.
    </p>

    ${extracto ? `
    <div style="background:#FAF7F0;border-radius:6px;padding:16px;margin-bottom:24px;
                border-left:3px solid #0C2236;">
      <p style="margin:0;font-size:14px;color:#423E36;line-height:1.65;
                font-family:Arial,Helvetica,sans-serif;">
        ${escHtml(extracto)}
      </p>
    </div>` : ""}

    <p style="margin:0 0 28px;font-size:14px;color:#423E36;line-height:1.65;
              font-family:Arial,Helvetica,sans-serif;">
      En el informe completo encontrás el contexto de tu rubro,
      un análisis de tu situación y una orientación concreta sobre
      por dónde arrancar.
    </p>

    ${botonCta("Ver mi informe completo", informeUrl)}

    <p style="margin:28px 0 0;font-size:13px;color:#7A746A;line-height:1.65;
              border-top:1px solid #E4DECF;padding-top:20px;
              font-family:Arial,Helvetica,sans-serif;">
      Si algo de lo que describe resonó con tu negocio,
      <a href="https://fiable.com.ar"
         style="color:#18405F;text-decoration:none;font-weight:600;">fiable</a>
      desarrolla exactamente ese tipo de solución para PyMEs argentinas —
      sin el costo ni los tiempos de antes.
    </p>
    `,
    unsubscribeUrl
  );
}

// ─── Seguimiento 1 (~3 días) — FOMO + CTA a fiable ───────────────────────────

export async function enviarMailSeguimiento1(datos: DatosMailSeguimiento): Promise<void> {
  const resend = getResend();
  const from   = process.env.EMAIL_FROM ?? "onboarding@resend.dev";

  await resend.emails.send({
    from,
    to:      datos.email,
    subject: "Lo que está cambiando en el comercio PyME",
    html:    buildHtmlSeguimiento1(datos),
  });
}

function buildHtmlSeguimiento1({
  rubro,
  tarea_repetitiva,
  fiableUrl,
  informeUrl,
  unsubscribeUrl,
}: DatosMailSeguimiento): string {
  const tarea = tarea_repetitiva ? escHtml(truncar(tarea_repetitiva, 70)) : "";

  const bloquePersonal = tarea
    ? `<p style="margin:0 0 16px;font-size:14px;color:#423E36;line-height:1.65;
                font-family:Arial,Helvetica,sans-serif;">
        En tu caso — lo de
        "<span style="color:#423E36;font-style:italic;">${tarea}</span>" —
        es exactamente el tipo de cosa que hoy se puede resolver sin
        una inversión de empresa grande.
       </p>`
    : "";

  const rubroShort = escHtml(truncar(rubro, 50));

  return wrapBase(
    `
    <p style="margin:0 0 20px;font-size:15px;font-weight:700;color:#0C2236;line-height:1.35;
              font-family:Georgia,'Times New Roman',serif;">
      Cada vez más comercios como el tuyo están incorporando tecnología a medida.
    </p>

    <p style="margin:0 0 16px;font-size:14px;color:#423E36;line-height:1.65;
              font-family:Arial,Helvetica,sans-serif;">
      En ${rubroShort} y en casi todos los rubros, los negocios que se están
      sosteniendo mejor en este contexto tienen algo en común: dejaron de hacer
      a mano lo que puede hacer una herramienta — y liberaron ese tiempo
      para lo que realmente importa.
    </p>

    <p style="margin:0 0 16px;font-size:14px;color:#423E36;line-height:1.65;
              font-family:Arial,Helvetica,sans-serif;">
      Lo que cambió en los últimos años es el costo. La IA bajó fuerte
      los costos de desarrollo: lo que antes requería meses y un equipo
      de software, hoy se puede armar en semanas a una fracción del precio.
      Eso abrió una puerta que antes era solo para las empresas grandes.
    </p>

    ${bloquePersonal}

    <p style="margin:0 0 28px;font-size:14px;color:#423E36;line-height:1.65;
              font-family:Arial,Helvetica,sans-serif;">
      Los que se mueven primero llevan ventaja. No porque corran más rápido —
      sino porque cuando el consumo rebote, van a estar mejor parados.
    </p>

    ${botonCta("Ver cómo lo hacemos en fiable", fiableUrl)}

    <p style="margin:24px 0 0;font-size:13px;color:#7A746A;line-height:1.65;
              font-family:Arial,Helvetica,sans-serif;">
      Tu informe también sigue disponible:
      <a href="${informeUrl}"
         style="color:#7A746A;text-decoration:underline;">verlo acá</a>.
    </p>
    `,
    unsubscribeUrl
  );
}

// ─── Seguimiento 2 (~7 días) — cierre suave ───────────────────────────────────

export async function enviarMailSeguimiento2(datos: DatosMailSeguimiento): Promise<void> {
  const resend = getResend();
  const from   = process.env.EMAIL_FROM ?? "onboarding@resend.dev";

  await resend.emails.send({
    from,
    to:      datos.email,
    subject: "Antes de cerrar — te dejo esto",
    html:    buildHtmlSeguimiento2(datos),
  });
}

function buildHtmlSeguimiento2({
  tarea_repetitiva,
  fiableUrl,
  informeUrl,
  unsubscribeUrl,
}: DatosMailSeguimiento): string {
  const tarea = tarea_repetitiva ? escHtml(truncar(tarea_repetitiva, 60)) : "";

  const bloquePersonal = tarea
    ? `<p style="margin:0 0 16px;font-size:14px;color:#423E36;line-height:1.65;
                font-family:Arial,Helvetica,sans-serif;">
        Si en algún momento querés retomar lo de
        "<span style="color:#423E36;font-style:italic;">${tarea}</span>",
        estamos para eso.
       </p>`
    : "";

  return wrapBase(
    `
    <p style="margin:0 0 6px;font-size:13px;color:#7A746A;
              font-family:Arial,Helvetica,sans-serif;">
      Último mail de esta serie.
    </p>

    <p style="margin:0 0 20px;font-size:15px;font-weight:700;color:#0C2236;line-height:1.35;
              font-family:Georgia,'Times New Roman',serif;">
      La ventana para hacer esto antes que otros se está cerrando.
    </p>

    <p style="margin:0 0 16px;font-size:14px;color:#423E36;line-height:1.65;
              font-family:Arial,Helvetica,sans-serif;">
      La tecnología a medida para PyMEs ya no es algo del futuro ni solo
      para empresas grandes. Los costos bajaron, los tiempos bajaron,
      y cada vez más comercios lo están aprovechando.
    </p>

    <p style="margin:0 0 16px;font-size:14px;color:#423E36;line-height:1.65;
              font-family:Arial,Helvetica,sans-serif;">
      Los que esperan también lo terminan haciendo — pero con más tiempo
      perdido en el medio. No es presión: es lo que venimos viendo.
    </p>

    ${bloquePersonal}

    <p style="margin:0 0 28px;font-size:14px;color:#423E36;line-height:1.65;
              font-family:Arial,Helvetica,sans-serif;">
      Si llegó el momento, en fiable respondemos directo. Sin compromiso,
      sin burocracia.
    </p>

    ${botonCta("Contactar a fiable", fiableUrl)}

    <p style="margin:24px 0 0;font-size:13px;color:#7A746A;line-height:1.65;
              font-family:Arial,Helvetica,sans-serif;">
      Tu informe:
      <a href="${informeUrl}"
         style="color:#7A746A;text-decoration:underline;">seguir leyendo</a>.
    </p>
    `,
    unsubscribeUrl
  );
}

// ─── Helpers de layout ────────────────────────────────────────────────────────

function botonCta(texto: string, url: string): string {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:#E0A33E;border-radius:6px;">
        <a href="${url}"
           style="display:inline-block;padding:13px 28px;font-size:14px;
                  font-weight:600;color:#0C2236;text-decoration:none;
                  letter-spacing:0.01em;font-family:Arial,Helvetica,sans-serif;">
          ${escHtml(texto)}
        </a>
      </td>
    </tr>
  </table>`;
}

function wrapBase(body: string, unsubscribeUrl: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#FAF7F0;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
         style="background:#FAF7F0;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="max-width:560px;">

          <tr>
            <td style="padding-bottom:20px;">
              <span style="font-size:11px;font-weight:700;color:#0C2236;
                           letter-spacing:0.09em;text-transform:uppercase;
                           font-family:Georgia,'Times New Roman',serif;">
                Faro de Negocios
              </span>
            </td>
          </tr>

          <tr>
            <td style="background:#FFFDF8;border-radius:8px;
                       border:1px solid #E4DECF;padding:32px;">
              ${body}
            </td>
          </tr>

          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#7A746A;line-height:1.7;
                        font-family:Arial,Helvetica,sans-serif;">
                Faro de Negocios &middot; farodenegocios.com.ar<br />
                Recibís este mail porque completaste el diagnóstico gratuito.<br />
                <a href="${unsubscribeUrl}"
                   style="color:#A09A90;text-decoration:underline;">
                  Cancelar suscripción
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
