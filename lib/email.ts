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

// Devuelve el primer párrafo limpio de un texto multi-párrafo generado por IA.
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

export type DatosMailInforme = {
  email: string;
  rubro: string;
  titulo: string;
  seccion_espejo: string;
  informeUrl: string;
};

export async function enviarMailInforme(datos: DatosMailInforme): Promise<void> {
  const resend = getResend();
  const from = process.env.EMAIL_FROM ?? "onboarding@resend.dev";

  const extracto = primerParrafo(datos.seccion_espejo);

  await resend.emails.send({
    from,
    to: datos.email,
    subject: `Tu diagnóstico ya está — ${datos.titulo}`,
    html: buildHtml({ ...datos, extracto }),
  });
}

function buildHtml({
  titulo,
  extracto,
  informeUrl,
}: DatosMailInforme & { extracto: string }): string {
  // Inline-CSS obligatorio para compatibilidad con clientes de mail.
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>Tu diagnóstico PyME</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
         style="background:#f8fafc;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="max-width:560px;">

          <!-- Marca -->
          <tr>
            <td style="padding-bottom:20px;">
              <span style="font-size:12px;font-weight:700;color:#64748b;
                           letter-spacing:0.08em;text-transform:uppercase;">
                Faro de Negocios
              </span>
            </td>
          </tr>

          <!-- Card principal -->
          <tr>
            <td style="background:#ffffff;border-radius:12px;
                       border:1px solid #e2e8f0;padding:32px;">

              <h1 style="margin:0 0 6px;font-size:20px;font-weight:700;
                         color:#0f172a;line-height:1.3;">
                ${escHtml(titulo)}
              </h1>
              <p style="margin:0 0 24px;font-size:13px;color:#64748b;">
                Tu diagnóstico gratuito ya está listo.
              </p>

              ${
                extracto
                  ? `<div style="background:#f1f5f9;border-radius:8px;
                                 padding:16px;margin-bottom:24px;
                                 border-left:3px solid #4f46e5;">
                       <p style="margin:0;font-size:14px;color:#334155;
                                 line-height:1.65;">
                         ${escHtml(extracto)}
                       </p>
                     </div>`
                  : ""
              }

              <p style="margin:0 0 28px;font-size:14px;color:#475569;
                        line-height:1.65;">
                En el informe completo encontrás el contexto de tu rubro,
                un análisis de tu situación y una orientación concreta sobre
                por dónde arrancar.
              </p>

              <!-- Botón CTA -->
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#4f46e5;border-radius:8px;">
                    <a href="${informeUrl}"
                       style="display:inline-block;padding:13px 28px;
                              font-size:14px;font-weight:600;color:#ffffff;
                              text-decoration:none;letter-spacing:0.01em;">
                      Ver mi informe completo
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Mención suave de fiable -->
              <p style="margin:28px 0 0;font-size:13px;color:#64748b;
                        line-height:1.65;border-top:1px solid #f1f5f9;
                        padding-top:20px;">
                Si algo de lo que describe resonó con tu negocio,
                <a href="https://fiable.com.ar"
                   style="color:#4f46e5;text-decoration:none;font-weight:600;">
                  fiable</a>
                desarrolla exactamente ese tipo de solución para PyMEs
                argentinas — sin el costo ni los tiempos de antes.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.7;">
                Faro de Negocios &middot; farodenegocios.com.ar<br />
                Recibís este mail porque completaste el diagnóstico gratuito.<br />
                <!-- UNSUBSCRIBE_LINK: reemplazar cuando implementemos cadencia -->
                <a href="#" style="color:#cbd5e1;text-decoration:underline;">
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

// Escapa caracteres HTML para evitar XSS en el cuerpo del mail.
function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
