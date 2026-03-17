import Anthropic from "@anthropic-ai/sdk";

export const SYSTEM_PROMPT = `Sos el Creative Builder de Rufus Social, un agente conversacional que arma cualquier tipo de caso que Rufus produce: pitches, propuestas de campaña, estrategias tácticas y estrategias ongoing.

# CONTEXTO DE NEGOCIO
Rufus Social es una agencia de performance creative especializada en creator & influencer marketing, UGC, y creative studio para marcas medianas-grandes de LATAM. Opera en Argentina y México. Clientes: MercadoLibre, Danone, Disney, Rappi, Despegar, PedidosYa, CCU, NaranjaX.
El agente lo usa el equipo interno de Rufus (estrategas, account managers, directores creativos). El output final siempre va al cliente.

# IDENTIDAD RUFUS
- **Social First / Native First**: Todo se piensa desde la plataforma, no se adapta de ATL.
- **Semáforo creativo**: On Platform (formato nativo), On Trend (relevancia cultural), On Quality (nivel de ejecución).
- **Creative Sprints**: Metodología ágil de producción creativa en sprints de 2-4 semanas.
- **Data-informed creativity**: Las decisiones creativas se basan en datos de performance, no en opiniones.
- **Pilares → Ángulos → Key Messages**: Jerarquía de contenido (3-5 territorios temáticos → abordajes específicos → mensajes clave).
- **Funnel TOFU-MOFU-BOFU**: Reach (trends, entretenimiento) → Trust (valor, BTS, storytelling) → Convert (producto, testimonios, CTA).
- **3 Fases campaña**: Previa (teasing) → Durante (hero, activaciones) → Post (recap, UGC).

# TIPOS DE TRABAJO
Clasificá el input en uno de estos:
A) **PITCH / LICITACIÓN** — hay competencia, hay que ganar, deadline duro
B) **PROPUESTA DE CAMPAÑA** — cliente existente o potencial, piden idea + ejecución
C) **ESTRATEGIA TÁCTICA** — fecha o evento específico (CyberMonday, lanzamiento, temporada, promo)
D) **ESTRATEGIA ONGOING** — cómo manejamos la cuenta de acá en adelante

El tipo determina qué capas son obligatorias, opcionales o irrelevantes.

---

# LÓGICA DE ESTADOS — SEGUÍ ESTE FLUJO SIEMPRE

## ESTADO 1: INTAKE
Arrancás siempre acá. Detectá qué tipo de input recibiste:
- Brief completo en texto → extraé datos clave, confirmá con el usuario, avanzá
- Transcripción de call o reunión → analizá, identificá gaps, preguntá lo que falta
- Solo nombre del cliente + oportunidad → arrancá el cuestionario guiado
- Formulario o datos sueltos → validá y avanzá

Datos que SIEMPRE capturás (si no están, preguntá):
1. **Cliente** → nombre, mercado (ARG / MEX / LATAM), ¿cuenta activa o potencial?
2. **Qué pidieron** → en las palabras del cliente, sin reinterpretar todavía
3. **Tipo de trabajo** → clasificá en A, B, C o D
4. **Deadline** → ¿cuándo hay que entregar?
5. **Quién lo recibe** → ¿va al cliente directo, es interno, es para un pitch formal?
6. **Qué material tienen** → ¿hay brief escrito, transcripción, solo una conversación?

El INTAKE no empieza a construir estrategia. No opina. No sugiere conceptos. Solo captura, clasifica y confirma.
Siempre terminá el intake con:
"Entendido. Tenemos un [tipo de trabajo] para [cliente], con deadline [fecha]. Voy a trabajar [capas activas según el tipo]. ¿Arrancamos?"

## ESTADO 2: SCOPE
Preguntá qué nivel de entrega se necesita:

| NIVEL | DESCRIPCIÓN |
|-------|-------------|
| 1 | **Estrategia** — cómo pensamos el problema |
| 2 | **Concepto creativo** — la idea que organiza todo |
| 3 | **Plan de contenido** — qué, cuándo, dónde, en qué formato |
| 4 | **Brief y guías para creators** — qué decirles, cómo dirigirlos |
| 5 | **Producción** — storyboard, script, shot list, moodboard |

Matriz de activación por tipo:
            | PITCH | CAMPAÑA | TÁCTICA | ONGOING
NIVEL 1     |  OBL  |   OBL   |   OBL   |   OBL
NIVEL 2     |  OBL  |   OBL   |   OPC   |   OPC
NIVEL 3     |  REF  |   DET   |  M.DET  |   DET
NIVEL 4     |  OPC  |   FRE   |   FRE   |   FRE
NIVEL 5     |  OPC  |   FRE   |   FRE   |   RAR

OBL=Obligatorio | OPC=Opcional | REF=Referencial | DET=Detallado | M.DET=Muy detallado | FRE=Frecuente | RAR=Raro

Nunca asumás — siempre confirmá el scope antes de avanzar.

## ESTADO 3: BUILD
Recorré cada capa activa en orden. Si ya tenés la info del input, no vuelvas a preguntar. Si falta algo crítico, pará y preguntá. Si algo es opcional, marcalo y seguí.

### CAPA 1 — ESTRATEGIA
Preguntas clave:
- ¿Cuál es el problema real del cliente (más allá de lo que dice el brief)?
- ¿Qué está haciendo hoy en redes / creators / digital?
- ¿Cuál es el objetivo de negocio detrás del pedido?
- ¿A quién le habla la marca? ¿Hay un segmento clave?
- ¿Qué puede aportar Rufus que otros no?
Output: Diagnóstico + Thesis Statement + Pilares estratégicos con KPIs

### CAPA 2 — CONCEPTO CREATIVO
Preguntas clave:
- ¿Hay un insight de audiencia que inspire la idea?
- ¿Qué territorio de marca se quiere ocupar?
- ¿Hay referencias creativas del cliente o del mercado?
- ¿Es una campaña puntual o un sistema de contenido ongoing?
Output: Big idea + Nombre del concepto + Traducción por plataforma

### CAPA 3 — PLAN DE CONTENIDO
Preguntas clave:
- ¿En qué plataformas se activa? (IG, TikTok, YT, LinkedIn, etc.)
- ¿Cuál es la frecuencia esperada?
- ¿Qué mix de formatos? (Reels, carruseles, stories, UGC, lives, etc.)
- ¿Hay fechas clave, lanzamientos, eventos en el período?
Output: Calendario editorial + Pilares de contenido + Mix de formatos por red

### CAPA 4 — BRIEF Y GUÍAS PARA CREATORS
Preguntas clave:
- ¿El caso incluye creators o es solo contenido de marca?
- ¿Qué perfil de creator? (macro, micro, nano, nicho específico)
- ¿Libertad creativa o guión cerrado?
- ¿Cuáles son los mandatorios de marca?
Output: Estrategia de casting + Creator brief + Guiones orientativos + Dos y no dos

### CAPA 5 — PRODUCCIÓN
Preguntas clave:
- ¿Se pide contenido producido por Rufus o UGC del creator?
- ¿Hay moodboard o referencia estética?
- ¿Se necesita storyboard o shot list?
- ¿Hay presupuesto de producción definido?
Output: Storyboard / Shot list / Script de producción / Moodboard de referencia

## ESTADO 4: OUTPUT
Cuando tenés todo el material de las capas activas, generá los entregables llamando a la herramienta generate_case. Los entregables incluyen:
1. Documento de estrategia completo (el cerebro del caso)
2. Narrativa del caso (texto listo para el deck, por sección)
3. Estructura de slides (título por slide + qué va adentro)
4. Briefs derivados si aplica (para equipo creativo y/o creators)

---

# ESTRUCTURA DE SLIDES POR TIPO

## PITCH:
1. Portada
2. Entendimiento del cliente / diagnóstico
3. El problema real (insight estratégico)
4. Nuestro punto de vista (thesis)
5-7. Pilares estratégicos (uno por slide)
8. Concepto creativo
9. Ejemplos / referencias visuales
10. Plan de activación
11. Por qué Rufus
12. Next steps

## CAMPAÑA / TÁCTICA:
1. Portada
2. Contexto y objetivo
3. Insight / oportunidad
4. Concepto creativo
5-6. Plan de contenido y formatos
7. Creators / activación
8. Timeline
9. KPIs y medición

## ONGOING:
1. Portada
2. Diagnóstico de la cuenta
3. Estrategia
4. Pilares de contenido
5. Mix de formatos y frecuencia
6. Modelo de trabajo y equipo
7. KPIs

---

# FRAMEWORKS COMPLEMENTARIOS

## 17 Tipos de Hooks
1. Dramatizar el problema | 2. Estilo Podcast | 3. Evolución/Antes-Después | 4. Hook Negativo | 5. Dato impactante | 6. Contrarian | 7. Storytelling personal | 8. Tutorial/How-to | 9. Lista/Ranking | 10. Reacción a trend | 11. POV | 12. Challenge/Reto | 13. Behind the scenes | 14. Comparación | 15. Predicción/Futuro | 16. Myth busting | 17. Social proof/Testimonio

## Niveles de Consciencia de Audiencia
1. No Consciente → 2. Consciente del Problema → 3. Consciente de la Solución → 4. Consciente del Producto → 5. Muy Consciente

## Sofisticación de Mercado
Nivel 1: Claim directo | Nivel 2: Claim ampliado | Nivel 3: Mecanismo único | Nivel 4: Prueba social | Nivel 5: Identificación + experiencia

---

# REGLAS DEL AGENTE
1. Nunca generás output sin tener cerradas las Capas 1 y 2 (estrategia y concepto) si están activas
2. Nunca hacés todas las preguntas juntas — una capa a la vez
3. Nunca reinterpretás el brief del cliente sin señalarlo explícitamente
4. Nunca proponés TODO el catálogo de Rufus — proponés lo que el caso necesita
5. Nunca inventás datos sobre el cliente — si no tenés info, lo decís y preguntás
6. Siempre confirmás el scope antes de construir
7. Siempre terminás con la estructura de slides lista para pasar a PPT
8. Si el usuario adjunta un brief o documento, usalo como contexto principal

# FORMATO DE RESPUESTA
- Hablá en español rioplatense (vos, ché, etc.)
- Sé directo y profesional
- Cuando tengas todo, llamá a generate_case para generar el PPTX
- Podés generar entregables adicionales con generate_deliverable. Tipos disponibles:
  - DOCX: guia (estrategia completa), guiones (scripts shot-by-shot), creator_briefs, one_pager, strategy_canvas, brief_template (aprobación del cliente)
  - XLSX: excel_pauta (COPY OUTS — formato Natura. Tab TOC con entregas + tabs por entrega/etapa de funnel. Cada tab tiene: rows 1-2 título+etapa con fondo sage, rows 3-4 headers azules (PLATAFORMA, NOMENCLATURA, PREVIEW, LINK, FORMATOS, COPY OUTS, LINK YOUTUBE), separadores violetas por tipo de pieza, nomenclatura Rufus_{Brand}_E{n}_{Stage}{Platform}{Type}_{Format}___{version}, copy fields con LEN(), formatos con fondo verde, slides de carrusel en columnas J-O), content_calendar, storyboard, casting_grid, testing_matrix (creative sprints)
- Si el caso incluye scripts/guiones, ofrecé generar el DOCX de guiones además del PPTX
- Si hay calendario de contenido, ofrecé el Excel
- Si hay creators, ofrecé el casting grid y los creator briefs
- Si el cliente quiere algo rápido, proponé el One Pager
- Si piden "copy outs", "textos de ads", "la pauta", "excel de pauta" → generá excel_pauta con la estructura operativa completa (formato Natura: TOC + tabs por entrega/etapa, con plataformas Meta/TikTok/YouTube/DV360 y sus copy fields específicos)
- Si piden "testing matrix", "qué testeo", "variaciones", "creative sprint" → generá testing_matrix
- Siempre explicá tu razonamiento estratégico
`;

export const TOOLS: Anthropic.Tool[] = [
  {
    name: "generate_deliverable",
    description:
      "Genera un entregable específico en DOCX o XLSX. Usá esta herramienta para generar guías, guiones, creator briefs, one pagers, strategy canvas, briefs de aprobación, calendarios de contenido, storyboards o casting grids.",
    input_schema: {
      type: "object" as const,
      properties: {
        deliverable_type: {
          type: "string",
          enum: [
            "guia",
            "guiones",
            "creator_briefs",
            "one_pager",
            "strategy_canvas",
            "brief_template",
            "content_calendar",
            "storyboard",
            "casting_grid",
            "excel_pauta",
            "testing_matrix",
          ],
          description:
            "Tipo de entregable: guia (DOCX estratégico completo), guiones (DOCX scripts de producción), creator_briefs (DOCX briefs para creators), one_pager (DOCX concepto rápido), strategy_canvas (DOCX mapa estratégico), brief_template (DOCX para aprobación del cliente), content_calendar (XLSX calendario editorial), storyboard (XLSX escenas), casting_grid (XLSX grid de creators), excel_pauta (XLSX copy outs formato Natura: tab TOC + tabs por E{n}|STAGE, nomenclatura Rufus, headers sage+azul, separadores violetas, copy fields con LEN(), slides carrusel en cols J-O — EL ENTREGABLE MÁS OPERATIVO), testing_matrix (XLSX matriz de testing creativo con variables, combinaciones y priorización)",
        },
        client_name: { type: "string", description: "Nombre del cliente" },
        work_type: {
          type: "string",
          enum: ["pitch", "campaign", "tactical", "ongoing"],
        },
        challenge: { type: "string" },
        diagnosis: { type: "string" },
        thesis: { type: "string" },
        insights: { type: "array", items: { type: "string" } },
        territory: { type: "string" },
        platforms: { type: "array", items: { type: "string" } },
        target_audience: { type: "string" },
        business_objective: { type: "string" },
        pillars: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              angles: { type: "array", items: { type: "string" } },
              key_messages: { type: "array", items: { type: "string" } },
            },
            required: ["name", "description"],
          },
        },
        creative_concepts: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              platform_translations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    platform: { type: "string" },
                    execution: { type: "string" },
                  },
                },
              },
              formats: { type: "array", items: { type: "string" } },
            },
            required: ["name", "description"],
          },
        },
        funnel_strategy: {
          type: "object",
          properties: {
            tofu: { type: "array", items: { type: "string" } },
            mofu: { type: "array", items: { type: "string" } },
            bofu: { type: "array", items: { type: "string" } },
          },
        },
        kpis: {
          type: "array",
          items: {
            type: "object",
            properties: {
              metric: { type: "string" },
              target: { type: "string" },
            },
          },
        },
        content_calendar: {
          type: "array",
          items: {
            type: "object",
            properties: {
              week: { type: "string" },
              posts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    day: { type: "string" },
                    platform: { type: "string" },
                    format: { type: "string" },
                    pillar: { type: "string" },
                    description: { type: "string" },
                  },
                },
              },
            },
          },
        },
        format_mix: {
          type: "array",
          items: {
            type: "object",
            properties: {
              platform: { type: "string" },
              formats: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string" },
                    frequency: { type: "string" },
                  },
                },
              },
            },
          },
        },
        creator_strategy: {
          type: "object",
          properties: {
            profile_types: { type: "array", items: { type: "string" } },
            casting_criteria: { type: "array", items: { type: "string" } },
            creative_freedom: { type: "string" },
            brand_mandatories: { type: "array", items: { type: "string" } },
            dos_and_donts: {
              type: "object",
              properties: {
                dos: { type: "array", items: { type: "string" } },
                donts: { type: "array", items: { type: "string" } },
              },
            },
          },
        },
        creator_briefs: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              objective: { type: "string" },
              key_message: { type: "string" },
              format: { type: "string" },
              script_guidance: { type: "string" },
            },
            required: ["title"],
          },
        },
        sample_scripts: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              hook_type: { type: "string" },
              hook: { type: "string" },
              body: { type: "string" },
              cta: { type: "string" },
              format: { type: "string" },
              visual_notes: { type: "string" },
            },
            required: ["title", "hook", "body", "format"],
          },
        },
        storyboards: {
          type: "array",
          items: {
            type: "object",
            properties: {
              scene: { type: "number" },
              duration: { type: "string" },
              visual: { type: "string" },
              audio: { type: "string" },
              text_overlay: { type: "string" },
              notes: { type: "string" },
            },
            required: ["scene", "duration", "visual", "audio"],
          },
        },
        casting_grid: {
          type: "array",
          items: {
            type: "object",
            properties: {
              role: { type: "string" },
              platform: { type: "string" },
              follower_range: { type: "string" },
              niche: { type: "string" },
              content_style: { type: "string" },
              budget_range: { type: "string" },
              notes: { type: "string" },
            },
            required: ["role", "platform", "follower_range", "niche", "content_style"],
          },
        },
        timeline: { type: "string" },
        next_steps: { type: "array", items: { type: "string" } },
        one_pager_summary: { type: "string" },
        campaign_name: { type: "string", description: "Nombre de la campaña (para excel_pauta)" },
        excel_pauta: {
          type: "object",
          description: "Datos para el Excel de Pauta / Copy Outs. Estructura: deliveries → funnel_stages → pieces con copy_fields.",
          properties: {
            deliveries: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  audience: { type: "string", description: "Audiencia de esta entrega" },
                  funnel_stages: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        stage: { type: "string", enum: ["AWARENESS", "CONSIDERACIÓN", "CONVERSIÓN"], description: "Etapa del funnel" },
                        pieces: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              platform: { type: "string", enum: ["Meta", "TikTok", "YouTube", "DV360", "Spotify", "Seedtag"] },
                              piece_type: { type: "string", enum: ["Producto", "UGC", "CRE"], description: "Tipo: Producto, UGC o CRE (creator)" },
                              format: { type: "string", enum: ["VID", "CAR", "IMG"], description: "VID=video, CAR=carrusel, IMG=estática" },
                              version: { type: "number", description: "Número de versión (1, 2, 3...)" },
                              copy_fields: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    field_name: { type: "string", description: "Ej: Título, Texto principal, Descripción, CTA" },
                                    char_limit: { type: "number", description: "Límite de caracteres para este campo" },
                                    copy: { type: "string", description: "El copy real que va en este campo" },
                                  },
                                  required: ["field_name", "char_limit", "copy"],
                                },
                              },
                              delivery_formats: { type: "array", items: { type: "string" }, description: "Formatos de entrega ej: 1080x1920, 1080x1350" },
                              slide_descriptions: { type: "array", items: { type: "string" }, description: "Descripción por slide (solo para carruseles)" },
                            },
                            required: ["platform", "piece_type", "format", "version", "copy_fields"],
                          },
                        },
                      },
                      required: ["stage", "pieces"],
                    },
                  },
                },
                required: ["name", "funnel_stages"],
              },
            },
          },
        },
        testing_matrix: {
          type: "object",
          description: "Datos para la Testing Matrix de creative sprints.",
          properties: {
            hypothesis: { type: "string", description: "Hipótesis general del test" },
            variables: {
              type: "object",
              properties: {
                hooks: { type: "array", items: { type: "string" } },
                angles: { type: "array", items: { type: "string" } },
                formats: { type: "array", items: { type: "string" } },
                copy_variants: { type: "array", items: { type: "string" } },
                audiences: { type: "array", items: { type: "string" } },
              },
            },
            combinations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  hook: { type: "string" },
                  angle: { type: "string" },
                  format: { type: "string" },
                  copy_variant: { type: "string" },
                  hypothesis: { type: "string" },
                  priority: { type: "string", enum: ["Alta", "Media", "Baja"] },
                  metrics: { type: "string" },
                },
                required: ["name", "hook", "angle", "format", "hypothesis", "priority", "metrics"],
              },
            },
            metrics_to_measure: { type: "array", items: { type: "string" } },
          },
        },
      },
      required: ["deliverable_type", "client_name", "work_type"],
    },
  },
  {
    name: "generate_case",
    description:
      "Genera un caso estratégico en formato PPTX con la identidad visual de Rufus Social. Llamá a esta herramienta cuando tengas toda la información de las capas activas completa y confirmada.",
    input_schema: {
      type: "object" as const,
      properties: {
        work_type: {
          type: "string",
          enum: ["pitch", "campaign", "tactical", "ongoing"],
          description:
            "Tipo de trabajo: pitch (licitación), campaign (propuesta de campaña), tactical (estrategia táctica), ongoing (estrategia de cuenta)",
        },
        active_levels: {
          type: "array",
          items: { type: "number" },
          description:
            "Niveles activos del 1 al 5 (1=Estrategia, 2=Concepto, 3=Plan contenido, 4=Brief creators, 5=Producción)",
        },
        client_name: {
          type: "string",
          description: "Nombre del cliente o marca",
        },
        client_market: {
          type: "string",
          enum: ["ARG", "MEX", "LATAM"],
          description: "Mercado del cliente",
        },
        industry: {
          type: "string",
          description:
            "Industria o categoría (ej: FMCG, Beauty, Tech, Food & Beverage, Fintech, Travel, Entertainment)",
        },
        is_active_client: {
          type: "boolean",
          description: "Si es cuenta activa de Rufus o potencial",
        },
        challenge: {
          type: "string",
          description:
            "Desafío o brief del cliente. El problema real que necesita resolver.",
        },
        business_objective: {
          type: "string",
          description: "Objetivo de negocio detrás del pedido",
        },
        target_audience: {
          type: "string",
          description: "A quién le habla la marca, segmento clave",
        },
        platforms: {
          type: "array",
          items: { type: "string" },
          description:
            "Plataformas objetivo (ej: Instagram, TikTok, YouTube, Twitter/X, LinkedIn)",
        },
        // Capa 1 - Estrategia
        diagnosis: {
          type: "string",
          description: "Diagnóstico de la situación actual del cliente en digital",
        },
        thesis: {
          type: "string",
          description: "Thesis statement — el punto de vista de Rufus sobre el problema",
        },
        insights: {
          type: "array",
          items: { type: "string" },
          description:
            "Insights clave de audiencia, mercado o cultura que fundamentan la estrategia",
        },
        territory: {
          type: "string",
          description:
            "Territorio de marca / posicionamiento propuesto",
        },
        pillars: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Nombre del pilar de contenido",
              },
              description: {
                type: "string",
                description: "Descripción del pilar",
              },
              angles: {
                type: "array",
                items: { type: "string" },
                description: "Ángulos creativos dentro de este pilar",
              },
              key_messages: {
                type: "array",
                items: { type: "string" },
                description: "Key messages de este pilar",
              },
            },
            required: ["name", "description", "angles"],
          },
          description: "Pilares de contenido con sus ángulos y key messages",
        },
        funnel_strategy: {
          type: "object",
          properties: {
            tofu: {
              type: "array",
              items: { type: "string" },
              description: "Tácticas/formatos TOFU (Reach)",
            },
            mofu: {
              type: "array",
              items: { type: "string" },
              description: "Tácticas/formatos MOFU (Trust)",
            },
            bofu: {
              type: "array",
              items: { type: "string" },
              description: "Tácticas/formatos BOFU (Convert)",
            },
          },
          description: "Estrategia de funnel orgánico",
        },
        kpis: {
          type: "array",
          items: {
            type: "object",
            properties: {
              metric: { type: "string" },
              target: { type: "string" },
            },
          },
          description: "KPIs y métricas de éxito",
        },
        // Capa 2 - Concepto
        creative_concepts: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Nombre del concepto creativo / big idea",
              },
              description: {
                type: "string",
                description: "Descripción del concepto",
              },
              platform_translations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    platform: { type: "string" },
                    execution: { type: "string" },
                  },
                },
                description: "Cómo se traduce el concepto en cada plataforma",
              },
              formats: {
                type: "array",
                items: { type: "string" },
                description: "Formatos de contenido (Reel, Carrusel, Story, etc.)",
              },
            },
            required: ["name", "description"],
          },
          description: "Conceptos creativos con traducciones por plataforma",
        },
        // Capa 3 - Plan de contenido
        content_calendar: {
          type: "array",
          items: {
            type: "object",
            properties: {
              week: { type: "string" },
              posts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    day: { type: "string" },
                    platform: { type: "string" },
                    format: { type: "string" },
                    pillar: { type: "string" },
                    description: { type: "string" },
                  },
                },
              },
            },
          },
          description: "Calendario de contenido",
        },
        format_mix: {
          type: "array",
          items: {
            type: "object",
            properties: {
              platform: { type: "string" },
              formats: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string" },
                    frequency: { type: "string" },
                  },
                },
              },
            },
          },
          description: "Mix de formatos por plataforma",
        },
        // Capa 4 - Brief creators
        creator_strategy: {
          type: "object",
          properties: {
            profile_types: {
              type: "array",
              items: { type: "string" },
              description: "Tipos de creator (macro, micro, nano, nicho)",
            },
            casting_criteria: {
              type: "array",
              items: { type: "string" },
              description: "Criterios de casting",
            },
            creative_freedom: {
              type: "string",
              description: "Nivel de libertad creativa vs guión cerrado",
            },
            brand_mandatories: {
              type: "array",
              items: { type: "string" },
              description: "Mandatorios de marca",
            },
            dos_and_donts: {
              type: "object",
              properties: {
                dos: { type: "array", items: { type: "string" } },
                donts: { type: "array", items: { type: "string" } },
              },
            },
          },
          description: "Estrategia de creators",
        },
        creator_briefs: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              objective: { type: "string" },
              key_message: { type: "string" },
              format: { type: "string" },
              script_guidance: { type: "string" },
            },
          },
          description: "Briefs individuales para creators",
        },
        // Capa 5 - Producción
        sample_scripts: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              hook_type: { type: "string", description: "Tipo de hook usado" },
              hook: { type: "string", description: "El hook de apertura" },
              body: { type: "string", description: "Desarrollo del guión" },
              cta: { type: "string", description: "Call to action" },
              format: {
                type: "string",
                description: "Formato (Reel 30s, Reel 60s, TikTok, etc.)",
              },
              visual_notes: {
                type: "string",
                description: "Notas visuales / shot list",
              },
            },
            required: ["title", "hook", "body", "format"],
          },
          description: "Guiones / scripts de producción",
        },
        // Meta
        timeline: {
          type: "string",
          description: "Timeline o fases del proyecto",
        },
        why_rufus: {
          type: "string",
          description: "Por qué Rufus es el partner ideal para este caso (solo para pitch)",
        },
        next_steps: {
          type: "array",
          items: { type: "string" },
          description: "Próximos pasos propuestos",
        },
      },
      required: [
        "work_type",
        "active_levels",
        "client_name",
        "industry",
        "challenge",
        "platforms",
        "pillars",
      ],
    },
  },
];
