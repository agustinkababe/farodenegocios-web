# CLAUDE.md — Faro de Negocios (contexto base del proyecto)

> Este documento es la fuente de verdad del proyecto. Leerlo antes de tomar cualquier decisión de diseño, producto o código. Ante una duda no resuelta acá, preguntar — no asumir. Ante un conflicto entre una instrucción puntual y las reglas innegociables de este documento, ganan las reglas: avisar y frenar.

---

## 1. La brújula (qué estamos construyendo)

Estamos construyendo **una sola cosa: un anzuelo que haga que la PyME correcta termine escribiéndole a fiable.**

Todo lo demás —el portal, los artículos, la encuesta, el informe, los avisos— son medios para ese fin. Si una decisión no sirve a esa brújula, está mal orientada. Cuando algo no se entienda, volver a esta frase.

## 2. Qué es el éxito (y qué NO)

- **Éxito = PyMEs que terminan siendo clientes de fiable con el portal como origen o influencia.** No importa el canal por el que contacten: si el informe le grabó la marca fiable en la retina y la PyME después llega por donde sea (la escribe directo, la busca en redes, la recomienda un conocido), es éxito igual — y de hecho mejor, porque significa que la marca prendió fuerte. La atribución real nunca es lineal; lo que cuenta es que el portal haya sembrado o empujado ese contacto.
- **NO es éxito**: tráfico alto, muchos emails capturados, o ingresos por avisos. Esos son indicadores secundarios, no el objetivo.
- Consecuencia de diseño: preferimos **poco tráfico pero muy calificado** antes que mucho tráfico irrelevante. No optimizamos para volumen; optimizamos para que la PyME correcta llegue convencida.

## 3. Quién es el usuario

El dueño de una **PyME argentina del día a día**: comercio, distribuidora, pequeño negocio. No grandes empresas. Perfil típico:

- Siente dolores operativos reales (caos de pedidos por WhatsApp, stock que no controla, consultas que no llega a responder) pero **no sabe ponerles nombre ni número**, y no anda buscando "un software".
- Desconfía por default. Le hablan en su idioma, no en jerga técnica.
- Tiene poca paciencia y poco tiempo. La primera interacción tiene que dar valor rápido y pedir poco.
- Es cliente potencial de fiable: implementa soluciones de bajo costo (USD 500–3000) y bajo mantenimiento.

## 4. Qué es fiable (el destino)

fiable es el estudio que desarrolla soluciones tecnológicas a medida para la PyME que quedó afuera del ERP: muy chica para los sistemas grandes, mal servida por el enlatado, y que nunca pudo pagar una software factory. El portal existe para alimentarle clientes a fiable.

## 5. Las piezas del producto

1. **Portal** con contenido para PyMEs argentinas. Es la cara pública y la base de SEO/tráfico.
2. **Artículos genéricos** sobre temas del mundo PyME argentino, generados con IA. Son *contenido de excusa*: traen tráfico y dan contexto, no son el corazón.
3. **Encuesta + diagnóstico gratuito** — EL CORAZÓN. La PyME comparte su dolor y algunos datos a cambio de un informe que le dice dónde está parada.
4. **Contacto con fiable** — el cierre. El informe deriva naturalmente a fiable.
5. **Avisos de Google (AdSense)** — monetización de fondo. Propina, no pilar (ver regla 11.4).

## 6. El flujo central (la cadena que importa)

**Curiosidad → Encuesta → Informe (espejo) → Contacto con fiable.**

1. La PyME entra picada por la curiosidad de **compararse con su rubro** (gancho de entrada barato, sobre sí misma).
2. Responde la encuesta de 11 preguntas (menos de 3 minutos; las 2 últimas antes del email son opcionales).
3. Recibe un informe que **le pega donde duele y le sirve aunque nunca contacte a fiable**.
4. El informe cierra mostrándole **cómo otra PyME de su rubro resolvió ese dolor** — ahí aparece fiable, como solución, no como aviso.

Esta cadena es lo primero que se construye y se valida. Todo lo demás es secundario.

## 7. Cómo se arma el informe (las dos capas)

El informe SIEMPRE combina dos capas. Esta estructura es la que genera la resonancia y no es negociable:

- **Capa de contexto (caracterización del sector).** Describe el momento del rubro del usuario con honestidad. Si hay un dato cargado en `datos_sector` para ese rubro (nota cualitativa, variación), se usa como apoyo. Si no hay dato específico, se hace una caracterización verdadera y general del comercio PyME argentino en ese tipo de rubro (consumo, inflación, qué resiste, qué no). **NUNCA se inventa una cifra exacta sin respaldo** (regla 11.1): se puede decir "viene golpeado" o "lo digital es de lo poco que crece", pero nunca "cayó 8,9% interanual" sin fuente verificable. Esta capa funciona para cualquier rubro, no depende de tener un registro numérico en la base.
- **Capa de espejo (el dolor del usuario, en sus palabras y, cuando hay datos, en números).** Sale de las respuestas de la encuesta: sobre todo de la pregunta abierta (qué tarea le pesa más), y cuando están disponibles, del volumen de consultas y las horas semanales que consume esa tarea. Cuando ambos datos están presentes y son relevantes al dolor expresado, el informe los combina para dar una dimensión concreta y aproximada ("manejás entre 30 y 50 consultas por día y esto te come unas 10 horas semanales: casi dos días de trabajo por semana en algo que no genera ventas"). Siempre como estimación declarada, nunca como cifra exacta.

El informe es bueno cuando el dueño piensa: *"entienden mi sector Y entienden mi problema puntual — y además me lo pusieron en números."*

La capa de contexto nunca bloquea el informe: si no hay dato de sector, el informe igual se genera con una caracterización honesta. Nunca falla ni queda vacío por falta de dato numérico.

### Arquitectura contenido / marco (decisión de diseño, no negociable)

El **texto del informe es agnóstico de fiable**. Ni el cuerpo de la sección sector, ni el espejo, ni el cierre mencionan la marca fiable ni contienen ningún CTA. El texto es contenido puro: genera deseo, no vende.

El **trabajo de marca y conversión lo hace el marco** que rodea al informe:
- **Bloque FOMO** (entre espejo y cierre): tarjeta de fondo oscuro (oculta en PDF) que refuerza cualitativamente la urgencia de adoptar tecnología. Sin cifras inventadas — solo afirmaciones verdaderas sobre la tendencia general.
- **CTA post-cierre**: tarjeta índigo que aparece inmediatamente después del cierre. Es donde fiable se presenta, en caliente. Copy propio (qué es fiable, por qué tiene sentido para una PyME) y llamado a la acción.
- **Footer**: refuerzo secundario de marca.

Separación estricta: **contenido genera deseo → marco capta**. Si en algún momento el texto del informe menciona "fiable" o incluye un CTA, está roto — hay que corregirlo.

### Visualización de contexto (indicadores cualitativos)

La sección "Así está el rubro" incluye tres indicadores visuales que orientan al lector antes del texto. Son **siempre cualitativos** y reflejan verdades estables del contexto PyME argentino:

| Indicador | Señal | Por qué es verdad estable |
|---|---|---|
| Consumo minorista | ↓ En baja | Refleja el contexto macro de 2024-2026 |
| Ventas digitales | ↑ En alza | Tendencia secular confirmada por CACE |
| Tecnología a medida | ↑ Ahora accesible | La IA bajó los costos de desarrollo radicalmente |

**NUNCA agregar un cuarto indicador con cifras de porcentaje o número de empresas.** Si se quiere enriquecer con dato real verificado (ej: variación CAME para ese rubro), puede mostrarse en el card de la sección, no en los indicadores de tendencia.

### PDF / Descarga

El informe tiene botón "Descargar PDF" que usa `window.print()` con estilos de impresión dedicados. El PDF imprime:
- Cabecera de impresión simple
- Los tres bloques de contenido (sector, espejo, cierre)
- Los indicadores cualitativos (se imprimen con fondos tenues)
- Footer con farodenegocios.com.ar

**El PDF omite** (todos con `print:hidden`): header web, botón de descarga, bloque FOMO, CTA fiable.

## 8. La encuesta (11 preguntas)

Orden psicológico: fácil → contexto operativo → dolor → cuantificación del dolor → email al final (nunca el email primero).

1. ¿A qué se dedica tu negocio? *(define el rubro)*
2. ¿Cuántas personas trabajan con vos? (solo / 2-5 / 6-20 / más)
3. ¿Hace cuánto que tenés el negocio?
4. ¿Cómo te llegan la mayoría de los pedidos o consultas? (WhatsApp / teléfono / local / redes / web)
5. ¿Cómo llevás el control de lo que vendés y tenés en stock? (papel o memoria / Excel / un sistema / no lo llevo)
6. Cuando te llega una consulta, ¿en cuánto solés responder? (al toque / en horas / al otro día / como puedo)
7. ¿Vendés online? (no / por redes a mano / tengo tienda online)
8. Si pudieras sacarte de encima una sola tarea repetitiva, ¿cuál sería? *(TEXTO LIBRE — la pregunta más valiosa; alimenta el espejo)*
9. ¿Cuántos clientes o consultas manejás por día, más o menos? *(OPCIONAL — rangos: <10 / 10-30 / 30-50 / >50; alimenta la cuantificación del espejo)*
10. ¿Cuántas horas por semana, más o menos, te consume esa tarea que más te pesa? *(OPCIONAL — rangos: <5 / 5-10 / 10-20 / >20; alimenta la cuantificación del espejo)*
11. ¿A dónde te mandamos tu informe? (email)

Preguntas 9 y 10 van después del dolor (pregunta 8) porque el usuario ya nombró su tarea — en ese contexto, ponerle número se siente natural, no intrusivo. Son opcionales: si el usuario las saltea, el informe sigue funcionando en modo cualitativo. Si las responde, el espejo gana una dimensión concreta que hace la diferencia.

No agregar preguntas sin que sirvan a la capa de contexto o a la capa de espejo (cada pregunta extra es fricción).

## 9. Tono y voz

- Argentino, cercano, de igual a igual. Nada de jerga técnica ni corporativa.
- El informe acompaña, no vende. Suena a "te entendemos", no a "contratanos".
- Honesto siempre. Antes que exagerar, se dice menos.
- **El texto del informe no menciona "fiable" en ningún lado.** La marca aparece solo en el CTA que sigue al informe (ver sección 7 — Arquitectura contenido/marco). Esto es intencional: un informe que suena a aviso pierde credibilidad; uno que da valor real genera el deseo que el CTA capitaliza.

## 10. Orden de construcción

1. **Primero el corazón**: el flujo encuesta → informe → contacto, jugable de punta a punta.
2. **Después el cuerpo**: artículos con IA, SEO, diseño fino, gráficos del informe, avisos.
3. La regla: nada del cuerpo se construye antes de que el corazón funcione y esté validado con una PyME real.

## 11. Reglas innegociables

1. **El dato no se falsea, porque el dato es el producto.** Si no hay dato real para respaldar una afirmación del informe, no se inventa: se usa un dato real disponible, un rango prudente y declarado, o se omite. Una IA generando "informe del sector X" sin datos reales detrás INVENTA números — eso está prohibido. Esto vale para informes, artículos, **y visualizaciones**: ningún gráfico, indicador o barra puede mostrar una cifra estadística (porcentaje, número de empresas, retorno de inversión en meses) que no esté verificada. Los indicadores cualitativos ("en baja", "en alza") están permitidos porque son caracterizaciones verdaderas — un número falso puesto en un gráfico no.
2. **El cierre del informe siempre afirma que esto se resuelve — sin fabricar nunca un caso puntual falso.** El cierre nunca se omite: es la oportunidad de decirle al interesado justo lo que vino a escuchar (que su problema tiene solución y que fiable lo resuelve). Pero la línea que NO se cruza es inventar un caso específico verificable ("trabajamos con una mueblería de Rosario con tu mismo problema") que no existe — en un rubro chico donde los dueños se conocen, un caso falso mata la credibilidad, que es el único activo. La distinción clave: **afirmación general segura SÍ, caso específico inventado NO.** Escalera de tres niveles, de mejor a peor caso, para que siempre haya qué decir sin inventar:
   1. Si hay **caso real del mismo rubro** → se usa (lo más potente).
   2. Si no, **caso real análogo de otro rubro** ("un comercio con un problema parecido al tuyo…").
   3. Si tampoco, **afirmación general verdadera y confiada**: "este tipo de problema se resuelve, y soluciones así ya están funcionando en PyMEs como la tuya. En fiable lo resolvemos." — agresivo, seguro, y sin un solo dato falso.
3. **Privacidad por diseño.** Pedir el mínimo dato necesario. No persistir datos sensibles que no se usen. Si en el futuro se procesan documentos del usuario, usar proveedores de IA con retención cero y comunicarlo como ventaja.
4. **Los avisos jamás ensucian la experiencia del informe ni de la encuesta.** El informe es lo que vende a fiable; su profesionalismo y confianza valen más que cualquier clic de AdSense. Avisos sí en artículos; en el corazón, no.
5. **El informe tiene que dar valor real aunque la PyME nunca contacte a fiable.** Si se siente como una trampa para vender, el dueño lo huele y se va quemado. Útil primero, anzuelo en consecuencia.

## 12. Fuentes de datos (capa de contexto)

La capa de contexto es **cualitativa por defecto** y no requiere un dato numérico por rubro para funcionar. Las fuentes abajo son para enriquecer esa caracterización con datos concretos cuando están disponibles — no son un prerrequisito.

- **CAME** — Índice de Ventas Minoristas Pyme. Mensual, gratuito, desagregado por rubro (alimentos y bebidas; bazar/decoración/textiles de hogar y muebles; calzado y marroquinería; farmacia y perfumería; ferretería/materiales eléctricos y de construcción; textiles e indumentaria). Útil como apoyo numérico cuando está disponible. **Limitación: cubre solo 6 rubros** — el informe no puede depender de él para funcionar.
- **INDEC** — indicadores de actividad, encuesta de supermercados, etc.
- **CACE** — estudios de e-commerce por rubro (útil para el argumento digital).
- **Cámaras y observatorios sectoriales** — según rubro.

Cuando no hay dato específico cargado en `datos_sector`, el informe usa una caracterización honesta y general: contexto macro PyME argentino, qué está golpeado, qué resiste, el vector digital. Esto es verdad estable que aplica a prácticamente cualquier rubro del comercio minorista. No tiene fecha de vencimiento mensual ni depende de scrapers.

Estrategia de datos: la base propia (`datos_sector_staging` → validación → producción) es el mecanismo para enriquecer con datos reales. A medida que crece, los informes ganan precisión. Pero la calidad base del informe no esperá a que la base esté completa.

## 13. Sistema de email

**Proveedor:** Resend (`lib/email.ts`). API key en variable de entorno `RESEND_API_KEY` (solo backend, nunca `NEXT_PUBLIC_`).

### Cadencia de mails

| # | Cuándo | Asunto | Propósito |
|---|---|---|---|
| 1 | Inmediato (al generar el informe) | `Tu diagnóstico ya está — [título]` | Entrega el informe + primer CTA a fiable |
| 2 | ~3 días después | `Re: [título]` | Retoma el dolor, aporta ángulo del costo oculto, link al informe |
| 3 | ~7 días después | `Para cuando tengas un momento — [título]` | Cierre suave, sin presión, puerta abierta |

**Reglas de frenado por mail:**
- **Mail inmediato**: siempre se envía (no tiene freno de cadencia).
- **Seguimiento 1**: se envía salvo `unsubscribed_at IS NOT NULL`. El clic al informe (`clickeo_at`) NO frena — es solo analytics.
- **Seguimiento 2**: se envía salvo `unsubscribed_at IS NOT NULL` O `clic_fiable_at IS NOT NULL`. Si la persona ya clickeó el link a fiable (señal de interés alto), no tiene sentido seguir empujando.

**TODO:** frenar la cadencia también si el contacto ya contrató con fiable (cuando los sistemas se integren — hoy están separados).

### Tracking de clics (dos rutas)

| Ruta | Registra | Redirige a | Frena cadencia |
|---|---|---|---|
| `/r/[id]` | `clickeo_at` (analytics) | `/informe/[id]` | No |
| `/f/[id]` | `clic_fiable_at` (señal de interés) | `fiable.com.ar` | Sí (para seg2) |

El mail inmediato usa `/r/[id]` para el CTA del informe. Los mails de seguimiento usan `/f/[id]` para el CTA principal (fiable) y `/r/[id]` como link secundario al informe.

### Unsubscribe

Cada encuesta tiene `unsubscribe_token` (UUID no adivinable generado por Postgres). El link de baja en cada mail apunta a `/baja/[token]`, que muestra una página de confirmación. Al confirmar, `POST /api/baja/[token]` marca `unsubscribed_at`.

### Estado de cadencia (columnas en `encuestas`)

| Columna | Qué registra |
|---|---|
| `unsubscribe_token` | UUID único de baja |
| `unsubscribed_at` | Timestamp de la baja |
| `clickeo_at` | Primer clic en el link del informe (analytics, no frena cadencia) |
| `clic_fiable_at` | Primer clic en el link a fiable (señal de interés — frena seg2) |
| `enviado_seguimiento1_at` | Timestamp de envío del mail 2 |
| `enviado_seguimiento2_at` | Timestamp de envío del mail 3 |
| `informes.email_enviado_at` | Timestamp de envío del mail 1 |

### Motor de envío (cron)

`/api/cron/cadencia` corre diariamente a las 10:00 UTC (configurado en `vercel.json`). Protegido con `Authorization: Bearer ${CRON_SECRET}`. Idempotente: verifica estado antes de enviar y marca inmediatamente después — un cron que corra dos veces no reenvía.

**Modo test (solo en development):** `GET /api/cron/cadencia?test=1` con header correcto usa umbrales de 1 y 2 minutos en vez de 3 y 7 días.

### Robustez — regla de oro

El envío de mail NO rompe el flujo principal. Si Resend falla en el inmediato, el lead y el informe ya están guardados. Si falla un envío en el cron batch, se loguea y se continúa con el siguiente contacto.

### Variables de entorno

| Variable | Valor | Dónde |
|---|---|---|
| `RESEND_API_KEY` | Clave de Resend | Backend only |
| `EMAIL_FROM` | `diagnostico@farodenegocios.com.ar` (dev: `onboarding@resend.dev`) | Backend only |
| `SITE_URL` | `https://farodenegocios.com.ar` | Backend only |
| `CRON_SECRET` | String aleatorio largo | Backend only |

## 14. Anti-objetivos (lo que NO hacer)

- NO empezar por el portal lindo / los artículos. Empezar por el corazón.
- NO construir una mini-versión gratis de lo que vende fiable (un mini-stock, mini-turnos). El anzuelo revela el problema, no regala la solución.
- NO perseguir tráfico masivo de términos saturados. Ganar en lo específico y bien hecho.
- NO depender de publicidad paga para validar. Validar a mano primero; escalar con paga después, solo cuando se sepa que el informe convierte.
- NO inventar datos bajo ninguna circunstancia (ver 11.1).

## 14. Stack técnico

**Stack base (firme, mismo que el proyecto Nuria):**
- **Front:** Next.js
- **Backend:** Next.js API routes
- **Base de datos + auth:** Supabase (Postgres)
- **Hosting:** Vercel

**IA — dos motores separados (modelos a definir):**
El proyecto usa DOS motores de IA distintos, con trabajos y exigencias diferentes. No tienen por qué ser el mismo modelo:
1. **IA de artículos** — genera el contenido genérico del portal. Prima el volumen y el costo (candidato a modelo económico). **Requisito de diseño: sistema de hasheo** que evite regenerar artículos que ya existen — no gastar llamadas de IA (ni dinero) produciendo contenido duplicado. Aplica el principio "mientras más datos/contenido tenemos, menos IA usamos".
2. **IA de informes** — genera el informe-espejo de cada lead. Acá la calidad de redacción ES el producto (el informe es el corazón), así que puede justificar un modelo mejor que el de artículos. Sigue las reglas de la sección 7 (dos capas) y 11 (no inventar datos).

*Modelos concretos: a definir más adelante. Referencia: la landing de fiable usa OpenAI GPT-4o mini para su flujo de leads.*

**Datos / contactos:**
- Los **contactos generados por este portal van en su propia base, separados de los leads de la landing de fiable.** Decisión revisable a futuro (probablemente haya más claridad con el avance), pero por ahora se mantienen separados — es más fácil unificar después que desenredar.

## 15. Estado actual

- Modelo de negocio: **validado conceptualmente** de punta a punta.
- Informe de muestra: **probado** con datos reales de CAME (rubro decoración/textiles de hogar) sobre una PyME ficticia. Resultado: el modelo entrega.
- Corazón funcional: flujo encuesta → informe → mail inmediato → cadencia de seguimiento → baja, todo operativo.
- Motor de artículos completo: backend (generación IA, auto-publicación, admin) + front público (/articulos, /articulos/[slug]) + vidriera en home.
- Publicación de artículos: **automatizada** — cron lunes/miércoles/viernes a las 08:00 UTC. Cuatro tipos: `educativo`, `como-hacer`, `casos`, `coyuntura`. Los cuatro se generan y publican automáticamente sin revisión manual. `coyuntura` en modo auto usa prosa cualitativa honesta (sin placeholders); los placeholders `[DATO: ...]` solo aparecen en el flujo manual.
- Próximo hito: validar con UNA PyME real.
- Nombre/dominio del portal: **Faro de Negocios** — farodenegocios.com.ar (dominio disponible en nic.ar al momento de definirlo). Handle de Instagram @farodenegocios también disponible. Universo de marca asociado: luz, guía, navegar, rumbo en la tormenta (conecta con la coyuntura de crisis PyME sin envejecer con ella).

## 16. Características pausadas o pendientes de construir

Este registro existe para que nadie borre código "sin uso" sin entender el contexto, y para que el próximo sprint arranque con mapa claro.

### Pipeline de datos de sector (PAUSADO — conservar el código)

**Qué es:** Sistema staging → validación manual → producción para cargar datos numéricos de sector por rubro (variaciones CAME, notas cualitativas, fuente). Incluye:
- `app/api/admin/staging/` — endpoints de listado, aprobación y rechazo
- `app/admin/datos/` — UI de validación
- Tabla `datos_sector_staging` (DB)
- Tipo `DatosSectorStagingRow` en `types/index.ts`

**Por qué está pausado:** El enfoque de datos de sector cambió. El informe hoy usa contexto cualitativo generado por IA, sin depender de datos numéricos por rubro. La tabla `datos_sector` (producción) sigue viva — si tiene registros para un rubro, el informe los usa como apoyo; si no tiene, genera contexto igualmente.

**Para retomar:** Implementar ingesta de datos (scraper CAME, carga manual via CSV, etc.) y reemplazar la auth `x-admin-secret` por algo real antes de producción.

**NO borrar este código** — es infraestructura lista que solo necesita datos.

### Motor de artículos — Partes A y B (ACTIVO — completo)

**Qué es:** Motor IA de generación y publicación automática de artículos genéricos para SEO/tráfico. Dos tablas propias, pipeline automático con cron + disparo manual, admin UI para el flujo manual si se necesita.

**Flujo por defecto (automático):**
1. `GET /api/cron/publicar-articulos` (cron lunes/miércoles/viernes 08:00 UTC) — llama a `autoPublicarArticulos(N)`.
2. `autoPublicarArticulos()` busca temas `aprobado` (cualquier tipo) sin artículo. Si no hay suficientes, genera un lote nuevo con `proponerTemas()` y los auto-aprueba todos. Genera artículos en `modo: "auto"` y los inserta directamente en `estado: "publicado"` sin pasar por borrador.
3. `coyuntura` en modo auto se escribe con prosa cualitativa honesta — sin placeholders `[DATO: ...]`. Es publicable directo.

**Disparo manual:**
- `POST /api/admin/articulos/auto-publicar` (header `x-admin-secret`) — misma lógica que el cron, disparo inmediato. Body opcional: `{ "limite": N }` para sobreescribir `ARTICULOS_POR_CORRIDA` en esa corrida.

**Flujo manual (conservado, no por defecto):**
- `POST /api/admin/articulos/temas/proponer` → propone temas
- `POST /api/admin/articulos/temas/[id]/aprobar` → aprueba manualmente
- `POST /api/admin/articulos/temas/[id]/generar` → genera en borrador, en `modo: "manual"` (coyuntura incluye `[DATO: ...]`)
- `POST /api/admin/articulos/[id]/publicar` → publica manualmente tras revisión
- UI: `app/admin/articulos/`

**Tipos de artículo (cuatro):**
- `educativo`: atemporal, conceptual. Sin datos estadísticos.
- `como-hacer`: guía paso a paso con **Paso N:** en negrita. Accionable.
- `casos`: historia ilustrativa. Abre aclarando que es un caso ilustrativo, nunca un caso real. Sin cifras inventadas.
- `coyuntura`: contexto del mercado. Auto = cualitativo honesto. Manual = `[DATO: ...]` para revisión.

**Barandas anti-duplicado (automáticas, nunca desactivar):**
1. Hash SHA-256 del título normalizado — columna `UNIQUE` en `articulos_temas` y en `articulos`. Bloquea temas y contenido duplicado.
2. Chequeo de `tema_id` antes de generar — no genera si ya existe artículo para ese tema.
3. Tope estricto por corrida — `ARTICULOS_POR_CORRIDA` (env var). El loop nunca supera ese número. Límite máximo hardcoded: 20.

**Re-procesamiento de imágenes:**
- `POST /api/admin/articulos/[id]/reimagen` — re-busca portada para un artículo específico (sin regenerar contenido).
- `POST /api/admin/articulos/reimagen-batch` — re-busca portadas para todos los artículos sin imagen.
- `buscarPortada()` en `lib/generarArticulo.ts` usa cascada: keyword específica → primer término → genéricos ("small business", "shop interior", "store").

**Anti-dedup:** SHA-256 sobre título normalizado (lowercase, sin acentos, sin puntuación), guardado en columna `hash UNIQUE`. Previene duplicados en temas y en artículos independientemente.

**Env vars:**
- `OPENAI_MODEL_ARTICULOS` (opcional; fallback: `OPENAI_MODEL` → `gpt-4o-mini`)
- `UNSPLASH_ACCESS_KEY` — API key de Unsplash para imágenes de portada. Sin prefijo NEXT_PUBLIC; solo backend. Sin esta key las portadas se generan como null y los artículos muestran el placeholder de marca.
- `ARTICULOS_POR_CORRIDA` — máximo de artículos que publica el cron por ejecución (default: 3; rango válido: 1–20). Subir este número aumenta el costo por corrida (IA + Unsplash).

**Estado Parte B (completo):**
- `app/articulos/page.tsx` — índice público; tarjetas con portada (imagen Unsplash o placeholder de marca), extracto, tipo, fecha; revalidación ISR 60s
- `app/articulos/[slug]/page.tsx` — artículo individual: portada con atribución Unsplash, markdown → HTML, SEO completo (title, description, OG con imagen, Twitter card `summary_large_image`), solo artículos `publicado` son accesibles
- `app/components/SiteHeader.tsx` + `SiteFooter.tsx` — componentes compartidos con logo y nav
- `app/page.tsx` — home con vidriera de 3 artículos recientes + bloque CTA diagnóstico intercalado
- `marked` — paquete para renderizar markdown → HTML en el servidor
- **Prose styles** en `globals.css`: `.prose a[href="/encuesta"]` auto-estiliza el CTA de cierre como botón ámbar

**Portadas Unsplash:**
- La IA genera `portada_keywords` (1-2 palabras en inglés) junto con cada artículo
- `buscarPortada()` busca en Unsplash API y guarda `portada_url` + `portada_credito` (JSON con nombre/perfil/foto del autor)
- Atribución mostrada en el pie de la imagen: "Foto de [nombre] en Unsplash" con links obligatorios por ToS
- El endpoint de descarga de Unsplash se llama como fire-and-forget al elegir la foto (requerido por sus API guidelines)
- Fallback cuando no hay imagen: placeholder marino con símbolo de marca tenue

### Columnas de telemetría sin dashboard aún

Las siguientes columnas de DB se escriben pero aún no se consumen en ningún dashboard o lógica de negocio:
- `encuestas.clickeo_at` — registra el primer clic en el link del informe (`/r/[id]`). Útil para analytics de apertura, pero hoy no frena ninguna lógica de cadencia (eso lo hace `clic_fiable_at`).
- `informes.email_enviado_at` — registra cuándo se envió el mail inmediato. La cadencia usa `encuestas.enviado_informe_at` como referencia; esta columna es redundante pero tiene valor archivístico.

**No borrar estas columnas** — los datos acumulados van a alimentar analytics cuando se construya el dashboard.

## 17. SQL pendiente de correr en Supabase

### Motor de artículos (Parte A)

```sql
-- Catálogo de temas propuestos por IA
create table if not exists articulos_temas (
  id         uuid primary key default gen_random_uuid(),
  titulo     text not null,
  tipo       text not null check (tipo in ('educativo', 'coyuntura')),
  estado     text not null default 'propuesto'
               check (estado in ('propuesto', 'aprobado', 'rechazado')),
  hash       text not null unique,
  created_at timestamptz not null default now()
);

-- Artículos generados
create table if not exists articulos (
  id           uuid primary key default gen_random_uuid(),
  tema_id      uuid references articulos_temas(id) on delete set null,
  titulo       text not null,
  slug         text not null unique,
  cuerpo       text not null,
  tipo         text not null check (tipo in ('educativo', 'coyuntura')),
  estado       text not null default 'borrador'
                 check (estado in ('borrador', 'publicado', 'rechazado')),
  hash         text not null unique,
  modelo_usado text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Índices útiles
create index if not exists articulos_temas_estado_idx on articulos_temas(estado);
create index if not exists articulos_estado_idx       on articulos(estado);
create index if not exists articulos_slug_idx         on articulos(slug);

-- RLS (las tablas son de acceso admin-only vía API routes con checkAuth — RLS deshabilitado como el resto)
alter table articulos_temas disable row level security;
alter table articulos       disable row level security;
```

### Portadas Unsplash (columnas nuevas en `articulos`)

```sql
-- Correr sobre la tabla ya existente
alter table articulos
  add column if not exists portada_url      text,
  add column if not exists portada_keywords text,
  add column if not exists portada_credito  text;
```

### Tipos nuevos de artículo: como-hacer y casos

```sql
-- Ampliar el CHECK de tipo en ambas tablas para aceptar los cuatro tipos
alter table articulos_temas drop constraint if exists articulos_temas_tipo_check;
alter table articulos_temas add constraint articulos_temas_tipo_check
  check (tipo in ('educativo', 'coyuntura', 'como-hacer', 'casos'));

alter table articulos drop constraint if exists articulos_tipo_check;
alter table articulos add constraint articulos_tipo_check
  check (tipo in ('educativo', 'coyuntura', 'como-hacer', 'casos'));
```
