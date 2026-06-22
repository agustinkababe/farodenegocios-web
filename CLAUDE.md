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
2. Responde la encuesta de 9 preguntas (menos de 3 minutos).
3. Recibe un informe que **le pega donde duele y le sirve aunque nunca contacte a fiable**.
4. El informe cierra mostrándole **cómo otra PyME de su rubro resolvió ese dolor** — ahí aparece fiable, como solución, no como aviso.

Esta cadena es lo primero que se construye y se valida. Todo lo demás es secundario.

## 7. Cómo se arma el informe (las dos capas)

El informe SIEMPRE combina dos capas. Esta estructura es la que genera la resonancia y no es negociable:

- **Capa de contexto (datos reales del sector).** Sale de fuentes públicas (ver sección 12). Da autoridad. Ejemplo: "el rubro X cayó 8,9% interanual; los que reforzaron lo digital son los que aguantaron". NUNCA se inventa (ver regla 11.1).
- **Capa de espejo (el dolor del usuario, en sus palabras).** Sale de las respuestas de la encuesta, sobre todo de la pregunta abierta. Le devuelve su propio problema, nombrado y puesto en número. Es lo que genera el "estos me entienden".

El informe es bueno cuando el dueño piensa: *"entienden mi sector Y entienden mi problema puntual."*

## 8. La encuesta (9 preguntas)

Orden psicológico: fácil → dolor → email al final (nunca el email primero).

1. ¿A qué se dedica tu negocio? *(define el rubro y el benchmark)*
2. ¿Cuántas personas trabajan con vos? (solo / 2-5 / 6-20 / más)
3. ¿Hace cuánto que tenés el negocio?
4. ¿Cómo te llegan la mayoría de los pedidos o consultas? (WhatsApp / teléfono / local / redes / web)
5. ¿Cómo llevás el control de lo que vendés y tenés en stock? (papel o memoria / Excel / un sistema / no lo llevo)
6. Cuando te llega una consulta, ¿en cuánto solés responder? (al toque / en horas / al otro día / como puedo)
7. ¿Vendés online? (no / por redes a mano / tengo tienda online)
8. Si pudieras sacarte de encima una sola tarea repetitiva, ¿cuál sería? *(TEXTO LIBRE — la pregunta más valiosa; alimenta el espejo)*
9. ¿A dónde te mandamos tu informe? (email)

Cada pregunta cerrada alimenta el benchmark; la 8 alimenta el espejo. No agregar preguntas sin que sirvan a una de las dos capas (cada pregunta extra es fricción).

## 9. Tono y voz

- Argentino, cercano, de igual a igual. Nada de jerga técnica ni corporativa.
- El informe acompaña, no vende. Suena a "te entendemos", no a "contratanos".
- Honesto siempre. Antes que exagerar, se dice menos.

## 10. Orden de construcción

1. **Primero el corazón**: el flujo encuesta → informe → contacto, jugable de punta a punta.
2. **Después el cuerpo**: artículos con IA, SEO, diseño fino, gráficos del informe, avisos.
3. La regla: nada del cuerpo se construye antes de que el corazón funcione y esté validado con una PyME real.

## 11. Reglas innegociables

1. **El dato no se falsea, porque el dato es el producto.** Si no hay dato real para respaldar una afirmación del informe, no se inventa: se usa un dato real disponible, un rango prudente y declarado, o se omite. Una IA generando "informe del sector X" sin datos reales detrás INVENTA números — eso está prohibido. Esto vale para informes y para artículos.
2. **El cierre del informe siempre afirma que esto se resuelve — sin fabricar nunca un caso puntual falso.** El cierre nunca se omite: es la oportunidad de decirle al interesado justo lo que vino a escuchar (que su problema tiene solución y que fiable lo resuelve). Pero la línea que NO se cruza es inventar un caso específico verificable ("trabajamos con una mueblería de Rosario con tu mismo problema") que no existe — en un rubro chico donde los dueños se conocen, un caso falso mata la credibilidad, que es el único activo. La distinción clave: **afirmación general segura SÍ, caso específico inventado NO.** Escalera de tres niveles, de mejor a peor caso, para que siempre haya qué decir sin inventar:
   1. Si hay **caso real del mismo rubro** → se usa (lo más potente).
   2. Si no, **caso real análogo de otro rubro** ("un comercio con un problema parecido al tuyo…").
   3. Si tampoco, **afirmación general verdadera y confiada**: "este tipo de problema se resuelve, y soluciones así ya están funcionando en PyMEs como la tuya. En fiable lo resolvemos." — agresivo, seguro, y sin un solo dato falso.
3. **Privacidad por diseño.** Pedir el mínimo dato necesario. No persistir datos sensibles que no se usen. Si en el futuro se procesan documentos del usuario, usar proveedores de IA con retención cero y comunicarlo como ventaja.
4. **Los avisos jamás ensucian la experiencia del informe ni de la encuesta.** El informe es lo que vende a fiable; su profesionalismo y confianza valen más que cualquier clic de AdSense. Avisos sí en artículos; en el corazón, no.
5. **El informe tiene que dar valor real aunque la PyME nunca contacte a fiable.** Si se siente como una trampa para vender, el dueño lo huele y se va quemado. Útil primero, anzuelo en consecuencia.

## 12. Fuentes de datos (capa de contexto)

- **CAME** — Índice de Ventas Minoristas Pyme. Mensual, gratuito, **desagregado por rubro** (alimentos y bebidas; bazar/decoración/textiles de hogar y muebles; calzado y marroquinería; farmacia y perfumería; ferretería/materiales eléctricos y de construcción; textiles e indumentaria). Fuente principal de arranque.
- **INDEC** — indicadores de actividad, encuesta de supermercados, etc. (verificar cobertura y formato al integrar).
- **CACE** — estudios de e-commerce por rubro (útil para el argumento digital).
- **Cámaras y observatorios sectoriales** — según rubro.

Estrategia de datos: arrancar con datos públicos genéricos por rubro. A medida que la base propia (encuestas acumuladas) crece, usar menos IA y más datos reales propios. Los datos propios son un activo que se vuelve más valioso con el tiempo.

## 13. Anti-objetivos (lo que NO hacer)

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
- Próximo hito: construir el corazón (flujo encuesta → informe → contacto) y validarlo con UNA PyME real.
- Nombre/dominio del portal: **Faro de Negocios** — farodenegocios.com.ar (dominio disponible en nic.ar al momento de definirlo). Handle de Instagram @farodenegocios también disponible. Universo de marca asociado: luz, guía, navegar, rumbo en la tormenta (conecta con la coyuntura de crisis PyME sin envejecer con ella).
