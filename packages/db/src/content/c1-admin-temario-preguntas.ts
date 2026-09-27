// Banco de preguntas para varios temas del temario de Administrativo del
// Estado (C1), redactadas usando ÚNICAMENTE los hechos ya presentes en el
// contenido de los bloques de cada tema (ver content/c1-admin-temario.ts,
// content/c1-admin-temario-2.ts y content/c1-admin-temario-3.ts, importados
// desde seed.ts en las llamadas a upsertTema/upsertBloque correspondientes).

export const C1_TEMA3_PREGUNTAS = [
  {
    enunciado:
      "Según el contenido del tema, ¿qué órganos forman las Cortes Generales?",
    opciones: [
      "El Congreso de los Diputados y el Senado",
      "El Congreso de los Diputados y el Gobierno",
      "El Senado y el Tribunal Constitucional",
      "El Congreso de los Diputados, el Senado y el Gobierno",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto indica que las Cortes Generales «están formadas por dos Cámaras: el Congreso de los Diputados... y el Senado». El Gobierno y el Tribunal Constitucional no forman parte de las Cortes Generales.",
    mnemotecnia: "Cortes = Congreso + Senado, dos cámaras y nada más.",
    dificultad: 1,
  },
  {
    enunciado:
      "De acuerdo con el tema, ¿cuántos diputados componen el Congreso de los Diputados?",
    opciones: [
      "Entre 200 y 300",
      "Entre 300 y 400",
      "Exactamente 350",
      "Entre 350 y 400",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El texto señala que el Congreso tiene «entre 300 y 400 diputados, elegidos por sufragio universal mediante listas provinciales cerradas y sistema proporcional D'Hondt». No se cita la cifra fija de 350.",
    mnemotecnia: "Congreso: horquilla 300-400, no un número fijo.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Cómo se eligen los diputados del Congreso según el tema?",
    opciones: [
      "Por sufragio universal, listas provinciales cerradas y sistema proporcional D'Hondt",
      "Por designación de los Parlamentos autonómicos",
      "Por sufragio universal y listas abiertas",
      "Por mayoría simple en circunscripción única nacional",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema describe la elección del Congreso mediante «sufragio universal mediante listas provinciales cerradas y sistema proporcional D'Hondt». La designación por Parlamentos autonómicos corresponde a parte del Senado, no al Congreso.",
    mnemotecnia: "Congreso: universal + listas cerradas + D'Hondt.",
    dificultad: 1,
  },
  {
    enunciado:
      "El Senado, según el tema, se caracteriza por ser una Cámara de representación:",
    opciones: ["Territorial", "Sectorial", "Profesional", "Municipal"],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto define el Senado como «Cámara de representación territorial, con senadores elegidos por provincia y otros designados por los Parlamentos autonómicos».",
    mnemotecnia: "Senado = territorio: provincias + CCAA.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué función atribuye el tema en exclusiva al Congreso frente al Senado?",
    opciones: [
      "Otorgar o retirar la confianza al Gobierno mediante investidura, moción de censura y cuestión de confianza",
      "Autorizar medidas excepcionales frente a Comunidades Autónomas del artículo 155 CE",
      "Vetar los proyectos de ley por mayoría absoluta",
      "Nombrar a todos los cargos institucionales sin intervención del Senado",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto dice que «el Congreso... es el que otorga o retira la confianza al Gobierno mediante la investidura, la moción de censura y la cuestión de confianza». La autorización de medidas del art. 155 CE corresponde al Senado, según el propio tema.",
    mnemotecnia: "Confianza al Gobierno = cosa del Congreso.",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el tema, si el Senado veta un proyecto de ley, ¿qué puede hacer el Congreso?",
    opciones: [
      "Nada, el veto del Senado es definitivo",
      "Levantar el veto por mayoría absoluta",
      "Levantar el veto por mayoría simple en todo caso",
      "Convocar un referéndum para resolver la discrepancia",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El texto explica que el Senado «puede introducir enmiendas o vetar un proyecto, aunque el Congreso puede levantar ese veto por mayoría absoluta».",
    mnemotecnia: "Veto del Senado: se levanta con mayoría absoluta del Congreso.",
    dificultad: 2,
  },
  {
    enunciado:
      "El artículo 155 de la Constitución, mencionado en el tema, se refiere a:",
    opciones: [
      "La disolución automática de las Cortes",
      "La autorización de medidas excepcionales frente a Comunidades Autónomas que incumplan obligaciones constitucionales",
      "La convocatoria de elecciones generales",
      "El procedimiento de investidura del Presidente del Gobierno",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El tema indica que el Senado «autoriza medidas excepcionales frente a Comunidades Autónomas que incumplan sus obligaciones constitucionales (art. 155 CE)».",
    mnemotecnia: "155 = Senado autoriza medidas contra CCAA incumplidoras.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿En qué formaciones funcionan las Cámaras según el tema?",
    opciones: [
      "Solo en Pleno",
      "En Pleno y en Comisiones",
      "Solo en Comisiones",
      "En Pleno, Comisiones y Juntas de Gobierno",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El texto afirma que «las Cámaras funcionan en Pleno y en Comisiones (permanentes legislativas, especializadas por materia)».",
    mnemotecnia: "Cámaras: Pleno + Comisiones, nada de \"Juntas de Gobierno\".",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Cómo se adoptan por regla general los acuerdos en las Cámaras, según el tema?",
    opciones: [
      "Por mayoría absoluta siempre",
      "Por mayoría simple, salvo que se exija mayoría cualificada para una materia concreta",
      "Por unanimidad",
      "Por mayoría de dos tercios en todos los casos",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El tema señala que «los acuerdos se adoptan por mayoría simple salvo que la Constitución o las leyes orgánicas exijan una mayoría cualificada para una materia concreta».",
    mnemotecnia: "Regla general = mayoría simple; la cualificada es la excepción tasada.",
    dificultad: 2,
  },
  {
    enunciado:
      "Respecto a la publicidad de las sesiones de las Cámaras, el tema indica que son:",
    opciones: [
      "Siempre secretas",
      "Públicas salvo acuerdo en contrario",
      "Secretas salvo acuerdo en contrario",
      "Públicas únicamente en el Congreso, nunca en el Senado",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El texto establece que «las sesiones son públicas salvo acuerdo en contrario».",
    mnemotecnia: "Publicidad es la regla; el secreto es la excepción por acuerdo.",
    dificultad: 1,
  },
];

export const C1_TEMA16_PREGUNTAS = [
  {
    enunciado:
      "Según el tema, ¿cuál es la norma jerárquicamente superior a todas las demás en el sistema de fuentes del derecho administrativo?",
    opciones: [
      "La ley orgánica",
      "La Constitución",
      "El reglamento",
      "Los tratados internacionales",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El texto ordena las fuentes indicando que la Constitución está «por encima de todas» las demás.",
    mnemotecnia: "CE siempre en la cúspide de la pirámide normativa.",
    dificultad: 1,
  },
  {
    enunciado:
      "En el orden jerárquico descrito en el tema, tras la Constitución se sitúan:",
    opciones: [
      "Los reglamentos",
      "Los tratados internacionales y el derecho de la Unión Europea",
      "La costumbre",
      "Los principios generales del derecho",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El tema enumera el orden: Constitución, «los tratados internacionales y el derecho de la Unión Europea», después las leyes y, por último, los reglamentos.",
    mnemotecnia: "Tras la CE: tratados y UE, antes que leyes y reglamentos.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué papel atribuye el tema a la costumbre y a los principios generales del derecho?",
    opciones: [
      "Son las fuentes de mayor rango del ordenamiento",
      "Tienen un papel complementario dentro del sistema de fuentes",
      "Sustituyen siempre a la ley cuando esta existe",
      "Solo se aplican en materia penal",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El texto sitúa a «la costumbre y los principios generales del derecho» con «un papel complementario» al final de la jerarquía de fuentes.",
    mnemotecnia: "Costumbre y principios = papel complementario, no protagonista.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué mayoría requiere, según el tema, la aprobación de una ley orgánica?",
    opciones: [
      "Mayoría simple del Congreso",
      "Mayoría absoluta del Congreso",
      "Mayoría de dos tercios del Congreso",
      "Unanimidad de ambas Cámaras",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El tema indica que «la ley orgánica exige mayoría absoluta del Congreso y se reserva a materias tasadas por la Constitución».",
    mnemotecnia: "Orgánica = mayoría absoluta + materias tasadas.",
    dificultad: 1,
  },
  {
    enunciado:
      "Según el tema, ¿a qué materias se reserva la ley orgánica?",
    opciones: [
      "Cualquier materia que el Gobierno considere relevante",
      "Desarrollo de derechos fundamentales, Estatutos de Autonomía y régimen electoral general, entre otras tasadas por la Constitución",
      "Exclusivamente el desarrollo de derechos fundamentales",
      "Solo la aprobación de los Presupuestos Generales del Estado",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El texto cita como ejemplos de materias reservadas a ley orgánica el «desarrollo de derechos fundamentales, Estatutos de Autonomía y régimen electoral general», siempre dentro de las materias tasadas por la Constitución.",
    mnemotecnia: "Orgánica: derechos fundamentales + Estatutos + régimen electoral.",
    dificultad: 2,
  },
  {
    enunciado:
      "El decreto-ley, tal como lo describe el tema, lo dicta:",
    opciones: [
      "Las Cortes Generales, por delegación del Gobierno",
      "El Gobierno, en casos de extraordinaria y urgente necesidad",
      "El Rey, a propuesta del Gobierno",
      "El Congreso, mediante ley de bases",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El tema define el decreto-ley como «una norma con fuerza de ley que dicta el Gobierno en casos de extraordinaria y urgente necesidad».",
    mnemotecnia: "Decreto-ley: Gobierno + urgencia extraordinaria.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿En qué plazo debe ser convalidado el decreto-ley por el Congreso, según el tema?",
    opciones: ["15 días", "20 días", "30 días", "60 días"],
    respuestaCorrecta: 2,
    justificacionIa:
      "El texto indica que el decreto-ley está «sujeta a convalidación por el Congreso en 30 días».",
    mnemotecnia: "Decreto-ley: 30 días para que el Congreso lo convalide.",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el tema, la diferencia entre un decreto legislativo dictado mediante ley de bases y uno dictado mediante ley ordinaria es que el primero da lugar a:",
    opciones: [
      "Un texto refundido",
      "Un texto articulado",
      "Un reglamento ejecutivo",
      "Un reglamento independiente",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El tema precisa que el decreto legislativo se dicta «mediante una ley de bases (para un texto articulado) o una ley ordinaria (para un texto refundido)».",
    mnemotecnia: "Bases → articulado; ordinaria → refundido.",
    dificultad: 3,
  },
  {
    enunciado:
      "¿Qué límite fundamental tiene la potestad reglamentaria según el tema?",
    opciones: [
      "Ninguno, el reglamento puede regular cualquier materia",
      "Estar siempre subordinado a la ley, sin poder contradecirla ni regular materias reservadas a ella",
      "Solo puede ejercerla el Gobierno central",
      "Solo puede aplicarse a materias tributarias",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El texto afirma que el reglamento «es siempre subordinada a la ley: no puede contradecirla ni regular materias reservadas a ella».",
    mnemotecnia: "Reglamento siempre por debajo de la ley, sin excepción.",
    dificultad: 1,
  },
  {
    enunciado:
      "Según su relación con la ley, el tema clasifica los reglamentos en:",
    opciones: [
      "Ejecutivos, independientes y de necesidad",
      "Estatales, autonómicos y locales",
      "Orgánicos, ordinarios y delegados",
      "Provisionales y definitivos",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema clasifica los reglamentos «por su relación con la ley (ejecutivos, que desarrollan una ley; independientes, sobre materias sin reserva legal; de necesidad, ante circunstancias excepcionales)»; la clasificación por origen (estatales, autonómicos, locales) es una categoría distinta según el propio texto.",
    mnemotecnia: "Por relación con la ley: ejecutivo, independiente, de necesidad.",
    dificultad: 2,
  },
];

export const C1_TEMA18_PREGUNTAS = [
  {
    enunciado:
      "¿Qué dos leyes sustituyeron en 2015 a la antigua Ley 30/1992, según el tema?",
    opciones: [
      "La Ley 39/2015 y la Ley 40/2015",
      "La Ley 30/2015 y la Ley 39/2015",
      "La Ley 19/2013 y la Ley 39/2015",
      "La Ley 39/2015 y el Real Decreto Legislativo 5/2015",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema indica que la Ley 30/1992 fue sustituida «desde 2015, por dos leyes... la Ley 39/2015, del Procedimiento Administrativo Común de las Administraciones Públicas (LPACAP)... y la Ley 40/2015, de Régimen Jurídico del Sector Público (LRJSP)».",
    mnemotecnia: "2015: 39 = procedimiento común; 40 = régimen jurídico interno.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué regula la Ley 39/2015 (LPACAP) según el tema?",
    opciones: [
      "La organización y funcionamiento interno de la Administración",
      "La relación externa entre la Administración y la ciudadanía",
      "Exclusivamente el régimen presupuestario",
      "El régimen disciplinario del personal funcionario",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El texto precisa que la LPACAP «regula la relación externa entre la Administración y la ciudadanía», mientras que la LRJSP regula la organización interna.",
    mnemotecnia: "39 = de puertas hacia afuera (ciudadanía).",
    dificultad: 1,
  },
  {
    enunciado:
      "¿En cuántas fases estructura el tema el procedimiento administrativo común?",
    opciones: ["Dos", "Tres", "Cuatro", "Cinco"],
    respuestaCorrecta: 1,
    justificacionIa:
      "El texto afirma que «el procedimiento se estructura en tres fases»: iniciación, ordenación e instrucción, y terminación.",
    mnemotecnia: "3 fases: iniciación, instrucción, terminación.",
    dificultad: 1,
  },
  {
    enunciado:
      "Según el tema, la iniciación de un procedimiento administrativo puede producirse:",
    opciones: [
      "Solo de oficio",
      "Solo a solicitud de persona interesada",
      "De oficio o a solicitud de persona interesada",
      "Únicamente por denuncia de un tercero",
    ],
    respuestaCorrecta: 2,
    justificacionIa:
      "El texto indica que la iniciación es «de oficio (por acuerdo del propio órgano competente, por orden superior, a petición razonada de otros órganos o por denuncia) o a solicitud de persona interesada».",
    mnemotecnia: "Iniciación: de oficio o a instancia de parte, dos vías.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué trámite cita el tema como propio de la fase de ordenación e instrucción, previo a la resolución?",
    opciones: [
      "El trámite de audiencia a las personas interesadas",
      "La convalidación por el Congreso",
      "La declaración de caducidad",
      "La terminación convencional",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema cita como actos de instrucción «los informes..., la prueba y el trámite de audiencia a las personas interesadas antes de resolver». La caducidad y la terminación convencional son formas de terminación, no de instrucción.",
    mnemotecnia: "Instrucción: informes, prueba, audiencia.",
    dificultad: 2,
  },
  {
    enunciado:
      "Además de la resolución expresa, ¿qué otras formas de terminación del procedimiento cita el tema?",
    opciones: [
      "El desistimiento, la renuncia, la caducidad o la terminación convencional",
      "El recurso de alzada y el de reposición",
      "La revisión de oficio y el recurso extraordinario de revisión",
      "El silencio positivo y el silencio negativo",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto señala que la terminación es «normalmente por resolución expresa, aunque también caben el desistimiento, la renuncia, la declaración de caducidad o la terminación convencional».",
    mnemotecnia: "Terminación no expresa: desistir, renunciar, caducar o pactar.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Cuál es la regla general del silencio administrativo en procedimientos iniciados a solicitud de la persona interesada, según el tema?",
    opciones: [
      "El silencio negativo",
      "El silencio positivo, salvo excepciones tasadas",
      "La caducidad automática del procedimiento",
      "La suspensión indefinida del plazo",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El tema afirma que «la regla general es el silencio positivo (se entiende estimada la solicitud), salvo las excepciones tasadas en el artículo 24 LPACAP».",
    mnemotecnia: "A instancia de parte: silencio = sí, salvo excepción tasada.",
    dificultad: 2,
  },
  {
    enunciado:
      "En los procedimientos iniciados de oficio, ¿qué efecto produce el silencio si el procedimiento puede generar efectos desfavorables, según el tema?",
    opciones: [
      "El silencio positivo",
      "La caducidad",
      "La desestimación",
      "La nulidad de pleno derecho",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El texto indica que «en los procedimientos iniciados de oficio, el silencio produce la caducidad si el procedimiento puede generar efectos desfavorables, o la desestimación si puede reconocer derechos».",
    mnemotecnia: "De oficio: desfavorable → caducidad; reconoce derechos → desestimación.",
    dificultad: 3,
  },
  {
    enunciado:
      "¿Qué diferencia el recurso de alzada del recurso potestativo de reposición, según el tema?",
    opciones: [
      "El de alzada se interpone ante el órgano superior jerárquico cuando el acto no pone fin a la vía administrativa; el de reposición, ante el mismo órgano que dictó un acto que sí pone fin a esa vía",
      "El de alzada es siempre potestativo y el de reposición siempre obligatorio",
      "El de reposición solo cabe contra actos firmes",
      "No hay diferencia, son el mismo recurso con distinto nombre",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema define el recurso de alzada como el interpuesto «ante el órgano superior jerárquico del que dictó el acto, cuando este no pone fin a la vía administrativa», y el de reposición como potestativo, «ante el mismo órgano que dictó el acto que sí pone fin a la vía administrativa».",
    mnemotecnia: "Alzada = sube de órgano; reposición = mismo órgano, potestativo.",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el tema, en el recurso contencioso-administrativo, ¿cómo deben actuar las partes?",
    opciones: [
      "Sin necesidad de representación ni asistencia jurídica",
      "Representadas por procurador y asistidas de letrado, con las particularidades de su ley reguladora",
      "Únicamente asistidas de letrado, sin procurador en ningún caso",
      "Representadas exclusivamente por un funcionario público",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El texto establece que las partes «deben actuar representadas por procurador y asistidas de letrado, con las particularidades que prevé la ley reguladora de esta jurisdicción».",
    mnemotecnia: "Contencioso: procurador + letrado, con matices de su ley propia.",
    dificultad: 2,
  },
];

export const C1_TEMA19_PREGUNTAS = [
  {
    enunciado:
      "¿Qué ley regula, según el tema, la contratación pública española y traspone las directivas europeas en esta materia?",
    opciones: [
      "La Ley 39/2015",
      "La Ley 9/2017, de Contratos del Sector Público",
      "El Real Decreto Legislativo 5/2015",
      "La Ley 40/2015",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El tema identifica «la Ley 9/2017, de Contratos del Sector Público», que «traspone al ordenamiento español las directivas europeas de contratación pública».",
    mnemotecnia: "LCSP = Ley 9/2017, contratación pública.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Cuáles son los principios rectores de la contratación pública citados en el tema?",
    opciones: [
      "Libertad de acceso a las licitaciones, publicidad y transparencia, no discriminación e igualdad de trato, y uso eficiente de los fondos públicos",
      "Confidencialidad, celeridad y economía procesal",
      "Jerarquía, competencia y buena fe",
      "Mérito, capacidad y publicidad",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto enumera como principios rectores «la libertad de acceso a las licitaciones, la publicidad y transparencia, la no discriminación e igualdad de trato, y el uso eficiente de los fondos públicos».",
    mnemotecnia: "LCSP: libertad, publicidad, no discriminación, eficiencia.",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el tema, en el contrato de concesión, ¿qué asume el contratista que no asume en los demás contratos administrativos típicos?",
    opciones: [
      "El riesgo operacional de la explotación",
      "La titularidad del bien objeto del contrato",
      "La potestad reglamentaria",
      "La función de órgano de contratación",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema describe los contratos de concesión, de obras o de servicios, «en los que el contratista asume el riesgo operacional de la explotación».",
    mnemotecnia: "Concesión = riesgo operacional para el contratista.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué incluye la fase de preparación de un contrato según el tema?",
    opciones: [
      "La justificación de la necesidad, la elaboración de los pliegos y la fijación del presupuesto base de licitación",
      "Únicamente la firma del contrato",
      "La resolución anticipada del contrato",
      "El nombramiento del órgano de contratación",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto señala que la preparación «incluye la justificación de la necesidad, la elaboración de los pliegos (de cláusulas administrativas y de prescripciones técnicas) y la fijación del presupuesto base de licitación».",
    mnemotecnia: "Preparar: justificar, hacer pliegos, fijar presupuesto.",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el tema, ¿qué caracteriza al procedimiento abierto de adjudicación?",
    opciones: [
      "Solo pueden presentar oferta los candidatos previamente seleccionados",
      "Cualquier interesado puede presentar oferta",
      "Se reserva a contratos especialmente complejos",
      "Solo se usa en supuestos tasados por la ley",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El tema define el procedimiento abierto como aquel en que «cualquier interesado puede presentar oferta», frente al restringido (candidatos seleccionados), el negociado (supuestos tasados) o el diálogo competitivo (contratos complejos).",
    mnemotecnia: "Abierto = todos pueden ofertar.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Para qué tipo de contratos se reserva el diálogo competitivo, según el tema?",
    opciones: [
      "Contratos de importe reducido",
      "Contratos especialmente complejos",
      "Contratos de suministro únicamente",
      "Contratos menores",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El texto indica que el diálogo competitivo se emplea «para contratos especialmente complejos».",
    mnemotecnia: "Diálogo competitivo = complejidad alta.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué órgano califica la documentación administrativa de los licitadores y valora sus ofertas, elevando propuesta de adjudicación, según el tema?",
    opciones: [
      "El órgano de contratación",
      "La mesa de contratación",
      "El comité de expertos independientes",
      "La Intervención General",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El tema describe a «la mesa de contratación (órgano colegiado que califica la documentación administrativa presentada por los licitadores y valora sus ofertas, elevando una propuesta de adjudicación al órgano de contratación)».",
    mnemotecnia: "Mesa de contratación: califica, valora y propone.",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el tema, ¿qué diferencia principal hay entre la garantía provisional y la garantía definitiva?",
    opciones: [
      "La provisional es obligatoria y la definitiva potestativa",
      "La provisional es potestativa y responde del mantenimiento de las ofertas; la definitiva es obligatoria con carácter general y responde del cumplimiento del contrato",
      "Ambas son siempre obligatorias y cubren lo mismo",
      "La provisional se devuelve antes de la adjudicación en todo caso, y la definitiva nunca se devuelve",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El texto indica que «la garantía provisional, de carácter potestativo... responde del mantenimiento de las ofertas... hasta la adjudicación», mientras que «la garantía definitiva, obligatoria con carácter general, responde del cumplimiento de las obligaciones del contratista durante toda la ejecución».",
    mnemotecnia: "Provisional = potestativa, ofertas; definitiva = obligatoria, ejecución.",
    dificultad: 3,
  },
  {
    enunciado:
      "¿Qué exige la ley, según el tema, respecto del uso de los contratos menores?",
    opciones: [
      "No exige ningún requisito especial, se adjudican libremente",
      "Justificar que no se está fraccionando artificialmente un contrato de mayor importe para eludir los principios de publicidad y concurrencia",
      "Que se tramite siempre un procedimiento de licitación ordinario",
      "Que se constituya obligatoriamente una mesa de contratación",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El tema señala que, al ser una excepción a los principios de publicidad y concurrencia, la ley «exige justificar que no se está fraccionando artificialmente un contrato de mayor importe para eludir esos principios».",
    mnemotecnia: "Contrato menor: cuidado con el fraccionamiento fraudulento.",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el tema, los contratos administrativos pueden ser inválidos por vicios de dos tipos. ¿Cuáles?",
    opciones: [
      "Nulos (vicios graves, imprescriptibles) o anulables (vicios menos graves, subsanables)",
      "Definitivos o provisionales",
      "Menores o mayores",
      "Expresos o presuntos",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema indica que los contratos «pueden ser nulos (vicios graves, imprescriptibles) o anulables (vicios menos graves, subsanables)».",
    mnemotecnia: "Nulo = grave e imprescriptible; anulable = leve y subsanable.",
    dificultad: 2,
  },
];

export const C1_TEMA23_PREGUNTAS = [
  {
    enunciado:
      "Según el tema, ¿qué distingue básicamente al personal funcionario del personal laboral?",
    opciones: [
      "El funcionario está vinculado por contrato de trabajo y el laboral por proceso selectivo",
      "El personal laboral está vinculado por contrato de trabajo, mientras que el funcionario accede mediante proceso selectivo",
      "No existe diferencia entre ambos regímenes",
      "El personal laboral siempre es de carácter eventual",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El tema distingue entre «personal funcionario (de carrera, con vinculación permanente tras superar un proceso selectivo...) y personal laboral (vinculado por contrato de trabajo)».",
    mnemotecnia: "Funcionario = proceso selectivo; laboral = contrato de trabajo.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué tipo de personal funcionario se emplea, según el tema, para necesidades urgentes o temporales?",
    opciones: ["El funcionario de carrera", "El funcionario interino", "El personal eventual", "El personal laboral fijo"],
    respuestaCorrecta: 1,
    justificacionIa:
      "El texto define al funcionario «interino, para necesidades urgentes o temporales», frente al de carrera, con vinculación permanente.",
    mnemotecnia: "Interino = urgencia y temporalidad.",
    dificultad: 1,
  },
  {
    enunciado:
      "Según el tema, ¿cuándo cesa automáticamente el personal eventual?",
    opciones: [
      "Al cumplir 65 años",
      "Cuando cesa la autoridad a la que sirve",
      "Tras cinco años de servicio",
      "Nunca cesa automáticamente",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El tema indica que el personal eventual «cesa automáticamente cuando lo hace la autoridad a la que sirve».",
    mnemotecnia: "Eventual: su suerte va ligada a la autoridad que lo nombró.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Por qué instrumento normativo se aprobó el texto refundido del Estatuto Básico del Empleado Público, según el tema?",
    opciones: [
      "Ley 9/2017",
      "Real Decreto Legislativo 5/2015",
      "Ley 39/2015",
      "Ley 40/2015",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El texto señala que el Estatuto Básico del Empleado Público fue «Aprobado por Real Decreto Legislativo 5/2015».",
    mnemotecnia: "EBEP = RDLeg 5/2015.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué principios de acceso al empleo público establece, según el tema, el Estatuto Básico del Empleado Público?",
    opciones: [
      "Igualdad, mérito y capacidad, publicidad",
      "Antigüedad, confianza y jerarquía",
      "Rapidez, economía y eficacia",
      "Concurso, oposición y libre designación",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema cita como principios de acceso al empleo público «igualdad, mérito y capacidad, publicidad».",
    mnemotecnia: "Acceso al empleo: igualdad + mérito y capacidad + publicidad.",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el tema, ¿qué órgano tiene la planificación general de recursos humanos de la AGE?",
    opciones: [
      "Las unidades de personal de cada departamento",
      "El Ministerio competente en función pública",
      "El Tribunal de Cuentas",
      "El Registro Central de Personal",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El texto indica que «la planificación general de recursos humanos corresponde al Ministerio competente en función pública, mientras que la gestión ordinaria... recae en las unidades de personal de cada departamento u organismo».",
    mnemotecnia: "Planificar = Ministerio; gestión diaria = unidades de personal.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué información recoge el Registro Central de Personal, según el tema?",
    opciones: [
      "Solo los datos académicos del personal",
      "Datos personales, académicos, profesionales y administrativos de todo el personal de la AGE",
      "Únicamente las nóminas del personal",
      "Solo los datos del personal eventual",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El tema describe el Registro Central de Personal como la base de datos que «recoge la información esencial de todo el personal al servicio de la Administración General del Estado: datos personales, académicos, profesionales y administrativos».",
    mnemotecnia: "Registro Central: personales + académicos + profesionales + administrativos.",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el tema, la excedencia forzosa se caracteriza por:",
    opciones: [
      "Ser por interés particular, sin reserva de plaza",
      "Ser por causas ajenas a la voluntad del funcionario, con reserva de plaza y cómputo de antigüedad",
      "Ser consecuencia de un expediente disciplinario",
      "Suponer el ejercicio efectivo de las funciones del puesto",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El texto define la excedencia forzosa como aquella producida «por causas ajenas a su voluntad, con reserva de plaza y cómputo de antigüedad», a diferencia de la voluntaria (interés particular, sin reserva de plaza).",
    mnemotecnia: "Forzosa: no depende de mí, pero conservo plaza y antigüedad.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué vía de progreso permite, según el tema, ascender de cuerpo o escala sin necesidad de cambiar de puesto?",
    opciones: [
      "La promoción interna",
      "La carrera horizontal",
      "La excedencia voluntaria",
      "Los servicios especiales",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El tema define la carrera horizontal como «progresar en grado, categoría, escalón u otros conceptos análogos sin necesidad de cambiar de puesto de trabajo», a diferencia de la promoción interna, que sí implica cambiar de cuerpo o escala.",
    mnemotecnia: "Horizontal = progreso sin moverse de puesto.",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el tema, ¿qué retribuye el complemento específico?",
    opciones: [
      "El grupo de clasificación profesional",
      "Cada tres años de servicio",
      "Las condiciones particulares del puesto, como dificultad técnica, dedicación o incompatibilidad",
      "El nivel del puesto que se ocupa",
    ],
    respuestaCorrecta: 2,
    justificacionIa:
      "El texto indica que «el complemento específico... retribuye las condiciones particulares del puesto como su dificultad técnica, dedicación o incompatibilidad», distinto del complemento de destino (ligado al nivel del puesto) y de los trienios (cada tres años).",
    mnemotecnia: "Específico = condiciones particulares del puesto.",
    dificultad: 3,
  },
];

export const C1_TEMA33_PREGUNTAS = [
  {
    enunciado:
      "Según el tema, ¿qué es el presupuesto del Estado?",
    opciones: [
      "Un plan de inversiones a diez años",
      "La expresión cifrada, conjunta y sistemática de los derechos y obligaciones a liquidar durante el ejercicio por el sector público estatal",
      "Un informe de la Intervención General del Estado",
      "Un registro contable de la deuda pública",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El tema define el presupuesto del Estado como «la expresión cifrada, conjunta y sistemática de los derechos y obligaciones a liquidar durante el ejercicio por el sector público estatal».",
    mnemotecnia: "Presupuesto: expresión cifrada, conjunta y sistemática.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿En qué dos estados se estructura el presupuesto, según el tema?",
    opciones: [
      "Estado de ingresos y estado de gastos",
      "Estado de deuda y estado de tesorería",
      "Estado orgánico y estado funcional",
      "Estado de inversiones y estado de subvenciones",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto indica que el presupuesto se estructura «en un estado de ingresos (previsión de recursos...) y un estado de gastos (dotaciones para cada política y programa)».",
    mnemotecnia: "Presupuesto = ingresos + gastos, dos estados básicos.",
    dificultad: 1,
  },
  {
    enunciado:
      "El tema menciona tres criterios de clasificación del gasto presupuestario. ¿Cuáles son?",
    opciones: [
      "Orgánico, funcional o por programas, y económico",
      "Territorial, sectorial y temporal",
      "Legal, reglamentario y consuetudinario",
      "Directo, indirecto y mixto",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto señala que los gastos se clasifican por criterio «orgánico (qué órgano gasta), funcional o por programas (para qué se gasta) y económico (en qué tipo de gasto...)».",
    mnemotecnia: "Gasto: quién (orgánico), para qué (funcional), en qué (económico).",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué es, según el tema, un crédito presupuestario de carácter limitativo?",
    opciones: [
      "Uno que puede superarse libremente",
      "La dotación máxima autorizada para un gasto concreto, que no puede superarse",
      "Un crédito destinado exclusivamente a gastos plurianuales",
      "Un anticipo de tesorería",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El tema indica que un crédito presupuestario limitativo implica que «no puede gastarse por encima de lo autorizado», frente a los créditos ampliables, admitidos solo en casos tasados.",
    mnemotecnia: "Limitativo = tope que no se puede rebasar.",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el tema, ¿qué modificación presupuestaria se emplea para gastos no previstos que carecen de crédito adecuado?",
    opciones: [
      "El suplemento de crédito",
      "El crédito extraordinario",
      "La transferencia de crédito",
      "La incorporación de crédito",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El tema define los créditos extraordinarios como aquellos «para gastos no previstos, sin crédito adecuado», distintos del suplemento de crédito (crédito existente insuficiente).",
    mnemotecnia: "Extraordinario = gasto no previsto, sin crédito adecuado.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué modificación presupuestaria traslada remanentes de un ejercicio al siguiente, según el tema?",
    opciones: [
      "La generación de crédito",
      "La incorporación de crédito",
      "La ampliación de crédito",
      "La transferencia de crédito",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El texto indica que las «incorporaciones de crédito... trasladan remanentes de un ejercicio al siguiente», mientras que las generaciones de crédito se financian con ingresos específicos no previstos y las transferencias traspasan dotación entre partidas.",
    mnemotecnia: "Incorporación = remanente que viaja al año siguiente.",
    dificultad: 3,
  },
  {
    enunciado:
      "Según el tema, ¿para qué sirven los anticipos de tesorería?",
    opciones: [
      "Para financiar inversiones a largo plazo",
      "Para atender gastos urgentes e inaplazables cuando no existe crédito presupuestario suficiente o adecuado",
      "Para sustituir de forma permanente al presupuesto aprobado",
      "Para pagar los trienios del personal funcionario",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El tema define los anticipos de tesorería como «mecanismos excepcionales de financiación para atender gastos urgentes e inaplazables cuando no existe crédito presupuestario suficiente o adecuado, a justificar y regularizar posteriormente».",
    mnemotecnia: "Anticipo de tesorería = urgencia sin crédito, a regularizar después.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué distingue, según el tema, a los impuestos frente a las tasas?",
    opciones: [
      "Los impuestos exigen una contraprestación individualizada y las tasas no",
      "Los impuestos no exigen contraprestación individualizada, se pagan por la mera realización de un hecho imponible",
      "Las tasas financian el gasto público en general sin afectación concreta",
      "No existe ninguna diferencia entre impuestos y tasas",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El tema señala que «los impuestos, a diferencia de las tasas, no exigen una contraprestación individualizada: se pagan por la mera realización de un hecho imponible... y su recaudación financia el gasto público en general, sin afectación a un servicio concreto».",
    mnemotecnia: "Impuesto = sin contraprestación directa; tasa = sí la exige.",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el tema, ¿quién prepara el anteproyecto de Presupuestos Generales del Estado?",
    opciones: [
      "Las Cortes Generales",
      "El Gobierno, a través del Ministerio competente en Hacienda",
      "El Tribunal de Cuentas",
      "La Intervención General de la Administración del Estado",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El texto indica que en la fase de elaboración «el Gobierno, a través del Ministerio competente en Hacienda, prepara el anteproyecto de Presupuestos Generales del Estado».",
    mnemotecnia: "Elaborar el anteproyecto = Gobierno + Hacienda.",
    dificultad: 1,
  },
  {
    enunciado:
      "Según el tema, ¿qué diferencia hay entre el control interno y el control externo del gasto público?",
    opciones: [
      "El interno lo ejerce la IGAE mediante función interventora y control financiero permanente; el externo corresponde al Tribunal de Cuentas",
      "El interno corresponde al Tribunal de Cuentas y el externo a la IGAE",
      "Ambos controles los ejerce siempre el mismo órgano",
      "El control externo lo realizan las unidades de personal de cada departamento",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema explica que «el control interno lo ejerce la Intervención General de la Administración del Estado (IGAE)... El control externo corresponde al Tribunal de Cuentas, órgano fiscalizador supremo que depende directamente de las Cortes Generales».",
    mnemotecnia: "Interno = IGAE; externo = Tribunal de Cuentas, ante las Cortes.",
    dificultad: 2,
  },
];

export const C1_TEMA38_PREGUNTAS = [
  {
    enunciado:
      "Según el tema, ¿qué combina un sistema informático?",
    opciones: [
      "Hardware y software",
      "CPU y RAM únicamente",
      "Periféricos de entrada y de salida",
      "Redes LAN y WAN",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto indica que «un sistema informático combina hardware (los componentes físicos) y software (los programas que se ejecutan sobre ellos)».",
    mnemotecnia: "Sistema informático = hardware + software.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué característica de la memoria RAM señala el tema?",
    opciones: [
      "Es no volátil y conserva los datos al apagar el equipo",
      "Es volátil, se pierde al apagar el equipo",
      "Es un dispositivo de almacenamiento óptico",
      "Sustituye a la CPU en la ejecución de instrucciones",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El tema describe la RAM como «(volátil, se pierde al apagar el equipo, sirve de espacio de trabajo mientras funciona)».",
    mnemotecnia: "RAM: volátil, se apaga y se olvida.",
    dificultad: 1,
  },
  {
    enunciado:
      "Según el tema, ¿por qué son más rápidas las unidades SSD que los discos duros HDD?",
    opciones: [
      "Porque tienen mayor capacidad de almacenamiento",
      "Porque no tienen partes móviles",
      "Porque funcionan exclusivamente en la nube",
      "Porque son periféricos de entrada",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El tema señala que las SSD son «más rápidas al no tener partes móviles», frente a los HDD, que son mecánicos.",
    mnemotecnia: "SSD rápido = sin partes móviles.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué función cumple el sistema operativo, según el tema?",
    opciones: [
      "Gestiona la memoria, los procesos, el sistema de archivos y la comunicación con los periféricos",
      "Ejecuta directamente las tareas de ofimática",
      "Sustituye a los drivers en la comunicación con el hardware",
      "Solo gestiona la conexión a Internet",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema define el sistema operativo como el software que «gestiona la memoria, los procesos, el sistema de archivos y la comunicación con los periféricos».",
    mnemotecnia: "SO: memoria + procesos + archivos + periféricos.",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el tema, ¿qué función cumplen los controladores o drivers?",
    opciones: [
      "Permiten al sistema operativo dialogar con cada pieza de hardware",
      "Sustituyen al software de aplicación",
      "Miden la información en bits y bytes",
      "Gestionan la seguridad frente al phishing",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto indica que los drivers «permiten a ese sistema operativo dialogar con cada pieza de hardware».",
    mnemotecnia: "Driver = traductor entre SO y hardware.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Cuántos bits forman un byte, según el tema?",
    opciones: ["4", "8", "16", "1024"],
    respuestaCorrecta: 1,
    justificacionIa:
      "El tema indica que la información se agrupa «en bytes (8 bits)».",
    mnemotecnia: "1 byte = 8 bits.",
    dificultad: 1,
  },
  {
    enunciado:
      "Según el tema, ¿cuáles son las tres propiedades que persigue proteger la seguridad informática?",
    opciones: [
      "Confidencialidad, integridad y disponibilidad",
      "Velocidad, capacidad y compatibilidad",
      "Autenticidad, trazabilidad y legalidad",
      "Accesibilidad, usabilidad y portabilidad",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema afirma que «la seguridad informática persigue proteger tres propiedades: la confidencialidad..., la integridad... y la disponibilidad».",
    mnemotecnia: "Seguridad: CID (confidencialidad, integridad, disponibilidad).",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué es el phishing, según el tema?",
    opciones: [
      "Un tipo de almacenamiento en la nube",
      "Un protocolo de red para el direccionamiento de paquetes",
      "Un intento de suplantación para obtener credenciales o datos personales mediante engaño",
      "Una medida de copia de seguridad",
    ],
    respuestaCorrecta: 2,
    justificacionIa:
      "El tema define el phishing como «intentos de suplantación para obtener credenciales o datos personales mediante engaño».",
    mnemotecnia: "Phishing = engaño para robar credenciales.",
    dificultad: 1,
  },
  {
    enunciado:
      "Según el tema, ¿cuál es la diferencia de funciones entre IP y TCP dentro del protocolo TCP/IP?",
    opciones: [
      "IP se encarga del direccionamiento y encaminamiento de paquetes; TCP garantiza que lleguen completos y en orden, retransmitiendo los perdidos",
      "TCP se encarga del direccionamiento y IP garantiza la integridad de los paquetes",
      "Ambos cumplen exactamente la misma función",
      "IP solo funciona en redes LAN y TCP solo en redes WAN",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema explica que «IP se encarga del direccionamiento y encaminamiento de los paquetes de datos entre redes, mientras que TCP garantiza que esos paquetes lleguen completos y en el orden correcto, retransmitiendo los que se pierdan por el camino».",
    mnemotecnia: "IP = dirección y ruta; TCP = orden y control de llegada.",
    dificultad: 3,
  },
  {
    enunciado:
      "¿Qué sistemas de identificación electrónica para la ciudadanía cita el tema que no requieren un certificado instalado en el equipo?",
    opciones: [
      "El certificado digital y el DNI electrónico",
      "Los sistemas de clave concertada, como Cl@ve",
      "La firma electrónica avanzada",
      "El protocolo TCP/IP",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El tema señala como sistemas de identificación «el certificado digital, el DNI electrónico y los sistemas de clave concertada (como Cl@ve), que no requieren un certificado instalado en el equipo», precisando esta última característica solo para la clave concertada.",
    mnemotecnia: "Cl@ve = sin certificado instalado, clave concertada.",
    dificultad: 3,
  },
];
