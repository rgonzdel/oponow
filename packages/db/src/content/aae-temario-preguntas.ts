// Banco de preguntas para varios temas del temario de Auxiliar
// Administrativo del Estado (AAE), en el mismo formato que consume
// `schema.preguntas` (packages/db/src/schema/quiz.ts): enunciado + 4
// opciones + índice 0-based de la correcta + justificación + mnemotecnia +
// dificultad orientativa (1 fácil - 3 difícil).
//
// Cada pregunta se basa ÚNICAMENTE en hechos que ya están redactados en el
// contenido de bloque correspondiente a ese tema (ver content/aae-temario.ts,
// content/aae-temario-2.ts y content/aae-temario-3.ts), sin añadir artículos,
// fechas o cifras no presentes en esos bloques. Redacción propia.

// Tema 2 · El Tribunal Constitucional (AAE_TEMA2_BLOQUE1 + AAE_TEMA2_PARTE2)
export const AAE_TEMA2_PREGUNTAS = [
  {
    enunciado: "¿Cuántos miembros forman el Tribunal Constitucional?",
    opciones: ["10", "12", "15", "20"],
    respuestaCorrecta: 1,
    justificacionIa:
      "El Tribunal Constitucional está formado por 12 miembros, nombrados por el Rey a propuesta del Congreso (4), el Senado (4), el Gobierno (2) y el Consejo General del Poder Judicial (2).",
    mnemotecnia:
      "12 magistrados: 4 Congreso + 4 Senado + 2 Gobierno + 2 CGPJ = 12.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Con qué mayoría deben proponer el Congreso y el Senado a sus respectivos magistrados del Tribunal Constitucional?",
    opciones: [
      "Mayoría simple",
      "Mayoría absoluta",
      "Mayoría de tres quintos",
      "Unanimidad",
    ],
    respuestaCorrecta: 2,
    justificacionIa:
      "El Congreso propone 4 magistrados y el Senado otros 4, ambos por mayoría de tres quintos de sus respectivas Cámaras.",
    mnemotecnia:
      "Tres quintos, igual que para elegir al Defensor del Pueblo: mayorías reforzadas para cargos de garantía.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Cuánto dura el mandato de los magistrados del Tribunal Constitucional y cómo se renueva?",
    opciones: [
      "Cinco años, se renuevan todos a la vez",
      "Nueve años, renovados por terceras partes cada tres años",
      "Cuatro años, coincidiendo con la legislatura",
      "Vitalicio, hasta la jubilación",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El mandato es de nueve años, y el Tribunal se renueva por terceras partes cada tres años, lo que garantiza continuidad en su composición.",
    mnemotecnia: "9 años ÷ 3 tercios = renovación cada 3 años.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Quién puede plantear la cuestión de inconstitucionalidad ante el Tribunal Constitucional?",
    opciones: [
      "Cualquier ciudadano directamente",
      "Un juez, cuando duda de la constitucionalidad de una norma aplicable a un caso concreto",
      "Solo el Defensor del Pueblo",
      "Solo el Gobierno",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "La cuestión de inconstitucionalidad la plantea un juez cuando duda de la constitucionalidad de una norma aplicable a un caso concreto que está juzgando, a diferencia del recurso de inconstitucionalidad, que se dirige directamente contra leyes o disposiciones con rango de ley.",
    mnemotecnia:
      "Recurso = lo interpone quien recurre una ley; cuestión = la plantea un juez que duda mientras juzga.",
    dificultad: 2,
  },
  {
    enunciado:
      "El recurso de amparo ante el Tribunal Constitucional protege frente a la vulneración de:",
    opciones: [
      "Cualquier derecho reconocido en cualquier ley",
      "Los derechos y libertades del artículo 14 y la sección 1ª del capítulo II del título I",
      "Únicamente los principios rectores de la política social y económica",
      "Los derechos reconocidos en los Estatutos de Autonomía",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El Tribunal Constitucional conoce del recurso de amparo por vulneración de los derechos y libertades del artículo 14 (igualdad) y de la sección 1ª del capítulo II del título I.",
    mnemotecnia:
      "Amparo = art. 14 + sección 1ª: los derechos de máxima protección de la Constitución.",
    dificultad: 2,
  },
  {
    enunciado:
      "Los conflictos de competencia de los que conoce el Tribunal Constitucional pueden darse entre:",
    opciones: [
      "El Estado y las Comunidades Autónomas, o entre estas entre sí",
      "El Congreso y el Senado",
      "El Gobierno y el Poder Judicial",
      "Dos Ministerios de la Administración General del Estado",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El Tribunal Constitucional conoce de los conflictos de competencia entre el Estado y las Comunidades Autónomas, o entre estas entre sí.",
    mnemotecnia: "Conflictos de competencia: Estado vs CCAA, o CCAA vs CCAA.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Cómo se define al Defensor del Pueblo en relación con las Cortes Generales?",
    opciones: [
      "Un alto comisionado de las Cortes Generales, designado por ellas",
      "Un órgano del Gobierno con rango de Ministerio",
      "Un vocal más del Tribunal Constitucional",
      "Un funcionario de carrera elegido por concurso",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El Defensor del Pueblo es un alto comisionado de las Cortes Generales, designado por ellas, que supervisa la actividad de la Administración en defensa de los derechos del título I y da cuenta de ello a las Cortes mediante un informe anual.",
    mnemotecnia:
      "El Defensor 'trabaja para' las Cortes: ellas lo designan y él les rinde cuentas.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Quiénes están legitimados para interponer un recurso de amparo, según lo estudiado en este tema?",
    opciones: [
      "Solo la persona directamente afectada",
      "La persona afectada, el Defensor del Pueblo y el Ministerio Fiscal",
      "Cualquier partido político con representación parlamentaria",
      "Solo el Tribunal Supremo, de oficio",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "Están legitimados para interponer el recurso de amparo la persona directamente afectada, el Defensor del Pueblo y el Ministerio Fiscal.",
    mnemotecnia:
      "Tres legitimados para el amparo: la persona afectada + Defensor del Pueblo + Ministerio Fiscal.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Por qué se dice que el recurso de amparo es un recurso subsidiario?",
    opciones: [
      "Porque solo puede interponerse una vez agotada la vía judicial previa ordinaria",
      "Porque puede interponerse en cualquier momento, sin agotar otras vías",
      "Porque sustituye a la vía judicial ordinaria desde el principio",
      "Porque revisa de nuevo el fondo del asunto como una tercera instancia",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El recurso de amparo solo puede interponerse una vez agotada la vía judicial previa ordinaria: es subsidiario, no una tercera instancia para revisar de nuevo el fondo del asunto, sino para comprobar si se ha vulnerado un derecho fundamental concreto.",
    mnemotecnia:
      "Amparo = último recurso, no un atajo: primero hay que pasar por los tribunales ordinarios.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué efecto tienen las sentencias del Tribunal Constitucional que declaran la inconstitucionalidad de una ley?",
    opciones: [
      "Solo vinculan a quien interpuso el recurso",
      "Tienen efectos generales y, salvo que la sentencia diga otra cosa, no afectan a situaciones ya resueltas por sentencia firme anterior a su publicación",
      "No producen ningún efecto hasta que lo ratifiquen las Cortes Generales",
      "Solo son eficaces si se publican en el Boletín Oficial de la Comunidad Autónoma afectada",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "Cuando una sentencia del Tribunal Constitucional declara la inconstitucionalidad de una ley u otra norma con rango de ley, esa declaración tiene efectos generales y, salvo que la propia sentencia disponga otra cosa, no afecta a las situaciones jurídicas ya resueltas por sentencia firme anterior a su publicación.",
    mnemotecnia:
      "Inconstitucional 'para todos', pero no reabre lo ya juzgado en firme (salvo que la sentencia diga lo contrario).",
    dificultad: 3,
  },
];

// Tema 8 · La Administración General del Estado (AAE_TEMA8_BLOQUE1 + AAE_TEMA8_PARTE2)
export const AAE_TEMA8_PREGUNTAS = [
  {
    enunciado: "La Administración General del Estado (AGE) actúa:",
    opciones: [
      "Con total independencia del Gobierno",
      "Bajo la dirección del Gobierno",
      "Bajo la dirección exclusiva de las Cortes Generales",
      "Bajo la dirección de las Comunidades Autónomas",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "La AGE es la organización que, bajo la dirección del Gobierno, gestiona los servicios públicos de titularidad estatal y ejerce las competencias que le atribuye la Constitución.",
    mnemotecnia: "AGE = brazo administrativo del Gobierno.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Cuál de los siguientes NO es uno de los principios de organización y funcionamiento de la Ley 40/2015 que rigen la AGE?",
    opciones: [
      "Transparencia",
      "Servicio efectivo a los ciudadanos",
      "Racionalización y proximidad",
      "Ánimo de lucro",
    ],
    respuestaCorrecta: 3,
    justificacionIa:
      "La Ley 40/2015 fija como principios de organización y funcionamiento la transparencia, el servicio efectivo a los ciudadanos, la racionalización, la proximidad y la responsabilidad por la gestión; el ánimo de lucro no forma parte de ellos.",
    mnemotecnia:
      "La AGE se rige por servir, no por ganar: nada de ánimo de lucro.",
    dificultad: 2,
  },
  {
    enunciado:
      "Dentro de los órganos centrales de la AGE, ¿qué distingue a los órganos superiores de los órganos directivos?",
    opciones: [
      "Los superiores fijan objetivos y políticas; los directivos las desarrollan y ejecutan",
      "Los superiores solo actúan en el exterior; los directivos, en territorio nacional",
      "Los directivos tienen más rango jerárquico que los superiores",
      "No hay ninguna diferencia funcional entre ambos",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "Los órganos superiores (Ministros y Secretarios de Estado) fijan los objetivos y las políticas, mientras que los órganos directivos (Subsecretarios, Secretarios Generales, Secretarios Generales Técnicos, Directores Generales y Subdirectores Generales) las desarrollan y ejecutan.",
    mnemotecnia: "Superiores deciden el 'qué'; directivos ejecutan el 'cómo'.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué órganos de la AGE tienen la condición de altos cargos?",
    opciones: [
      "Todos los órganos superiores y directivos, sin excepción",
      "Los órganos superiores y directivos, salvo los Subdirectores Generales",
      "Solo los Ministros",
      "Solo los órganos territoriales",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "Los órganos superiores y directivos tienen la condición de altos cargos, salvo los Subdirectores Generales.",
    mnemotecnia:
      "Casi todos son altos cargos... menos el Subdirector General, la excepción de la lista.",
    dificultad: 2,
  },
  {
    enunciado:
      "En la organización territorial de la AGE, la Subdelegación del Gobierno actúa en el ámbito de:",
    opciones: [
      "La provincia, dependiendo de la Delegación del Gobierno correspondiente",
      "La Comunidad Autónoma, con independencia de la Delegación del Gobierno",
      "El municipio",
      "El extranjero",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "Las Subdelegaciones del Gobierno actúan en las provincias, bajo la dependencia de la Delegación del Gobierno correspondiente en la Comunidad Autónoma.",
    mnemotecnia: "Delegación = CCAA; Subdelegación = provincia (depende de la Delegación).",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Dónde existen Direcciones Insulares de la AGE?",
    opciones: [
      "En todas las provincias peninsulares",
      "En las islas donde no radique la sede de la Subdelegación del Gobierno",
      "Únicamente en las capitales de Comunidad Autónoma",
      "En el extranjero, junto a las Oficinas Consulares",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "Existen Direcciones Insulares en las islas donde no radique la sede de la Subdelegación del Gobierno correspondiente.",
    mnemotecnia: "Si la isla no tiene Subdelegación, tiene Dirección Insular.",
    dificultad: 2,
  },
  {
    enunciado:
      "Las Oficinas Consulares de la AGE en el exterior ejercen funciones de protección de los ciudadanos y de gestión administrativa, como por ejemplo:",
    opciones: [
      "Registro civil, notariales y de extranjería",
      "Aprobación de leyes orgánicas",
      "Nombramiento de Ministros",
      "Convocatoria de referéndums",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "Las Oficinas Consulares ejercen funciones de protección de los ciudadanos y de gestión administrativa (registro civil, notariales, de extranjería) en su demarcación.",
    mnemotecnia:
      "Consulado = 'ventanilla' de la Administración en el extranjero: civil, notarial y extranjería.",
    dificultad: 1,
  },
  {
    enunciado:
      "Los organismos autónomos, dentro del sector público institucional, se caracterizan por:",
    opciones: [
      "Depender de un Ministerio, regirse por Derecho administrativo y no tener ánimo de lucro",
      "Tener capital mayoritariamente privado",
      "Regirse siempre por Derecho privado, incluso en el ejercicio de potestades administrativas",
      "No depender de ningún Ministerio",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "Los organismos autónomos dependen de un Ministerio, se rigen por Derecho administrativo y no pueden tener ánimo de lucro.",
    mnemotecnia:
      "Organismo autónomo: depende de un Ministerio y juega con reglas de Derecho administrativo.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Cuál de los siguientes es un instrumento de la Administración electrónica mencionado en este tema, que permite consultar el estado de tramitación de los expedientes propios?",
    opciones: [
      "La sede electrónica",
      "El registro electrónico",
      "La carpeta ciudadana",
      "El convenio de colaboración",
    ],
    respuestaCorrecta: 2,
    justificacionIa:
      "La carpeta ciudadana permite consultar el estado de tramitación de los expedientes propios, junto a la sede electrónica (acceso a información y servicios) y el registro electrónico (presentación de documentos en cualquier momento).",
    mnemotecnia:
      "Carpeta ciudadana = 'mi expediente en una carpeta', para seguir su tramitación.",
    dificultad: 2,
  },
  {
    enunciado:
      "Las conferencias sectoriales, como mecanismo de coordinación entre la AGE y las Comunidades Autónomas, se caracterizan por ser:",
    opciones: [
      "Órganos de cooperación bilateral entre la AGE y una única Comunidad Autónoma",
      "Órganos de cooperación multilateral, presididos por un Ministro, con participación de los consejeros autonómicos competentes en cada materia",
      "Convenios firmados solo entre dos Comunidades Autónomas",
      "Órganos exclusivamente judiciales",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "Las conferencias sectoriales son órganos de cooperación de composición multilateral, presididas por un Ministro, con participación de los consejeros autonómicos competentes en cada materia; se distinguen de las comisiones bilaterales, que son entre la AGE y una Comunidad Autónoma concreta.",
    mnemotecnia:
      "Sectorial = multilateral (varias CCAA); bilateral = solo dos partes, AGE y una CCAA.",
    dificultad: 2,
  },
];

// Tema 11 · Las Leyes del Procedimiento Administrativo Común (AAE_TEMA11_BLOQUE1 + AAE_TEMA11_PARTE2)
export const AAE_TEMA11_PREGUNTAS = [
  {
    enunciado:
      "Desde 2015, ¿qué dos leyes sustituyeron a la antigua Ley 30/1992 en materia de procedimiento administrativo?",
    opciones: [
      "La Ley 39/2015 y la Ley 40/2015",
      "La Ley 30/2015 y la Ley 50/2015",
      "El Estatuto Básico del Empleado Público y la Ley 39/2015",
      "La Ley 39/2015 y el Real Decreto Legislativo 5/2015",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "Desde 2015, el procedimiento administrativo se rige por la Ley 39/2015, del Procedimiento Administrativo Común de las Administraciones Públicas, y la Ley 40/2015, de Régimen Jurídico del Sector Público, que sustituyeron a la antigua Ley 30/1992.",
    mnemotecnia: "39 y 40, hermanas gemelas de 2015 que jubilaron a la Ley 30/1992.",
    dificultad: 1,
  },
  {
    enunciado: "¿Qué regula específicamente la Ley 39/2015?",
    opciones: [
      "La organización y el funcionamiento interno de las Administraciones",
      "La relación entre la Administración y la ciudadanía",
      "El régimen disciplinario de los funcionarios",
      "El sistema electoral",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "La Ley 39/2015, del Procedimiento Administrativo Común, regula la relación entre la Administración y la ciudadanía, mientras que la Ley 40/2015 regula la organización y el funcionamiento interno de las Administraciones.",
    mnemotecnia: "39 = de puertas hacia fuera (ciudadanía); 40 = de puertas hacia dentro (organización).",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Cuáles son las tres fases en que se estructura todo procedimiento administrativo?",
    opciones: [
      "Iniciación, ordenación e instrucción, y terminación",
      "Alegación, prueba y sentencia",
      "Convocatoria, votación y publicación",
      "Solicitud, silencio y recurso",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "Todo procedimiento administrativo se estructura en tres fases: iniciación (de oficio o a solicitud de persona interesada), ordenación e instrucción (informes, prueba, audiencia) y terminación (normalmente resolución expresa, aunque también caben desistimiento, renuncia o caducidad).",
    mnemotecnia: "Inicia, instruye, termina: las tres 'I' (bueno, dos 'I' y una 'T').",
    dificultad: 1,
  },
  {
    enunciado:
      "Además de la resolución expresa, ¿de qué otras formas puede terminar un procedimiento administrativo, según lo estudiado?",
    opciones: [
      "Desistimiento, renuncia o caducidad",
      "Solo mediante silencio administrativo",
      "Únicamente mediante recurso de alzada",
      "Solo mediante sentencia judicial",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "La fase de terminación es normalmente por resolución expresa, aunque también caben el desistimiento, la renuncia o la caducidad.",
    mnemotecnia:
      "Un procedimiento no solo 'se resuelve': también puede desistirse, renunciarse o caducar.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Cuál es la regla general del silencio administrativo cuando la Administración no resuelve en plazo un procedimiento iniciado a solicitud de la persona interesada?",
    opciones: [
      "El silencio negativo, siempre",
      "El silencio positivo, salvo las excepciones tasadas por la ley",
      "El procedimiento se archiva automáticamente",
      "No existe regla general, depende de cada Comunidad Autónoma",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "La regla general es el silencio positivo (se entiende estimada la solicitud), salvo las excepciones tasadas por la ley, en las que el silencio es negativo.",
    mnemotecnia: "Regla general = silencio positivo; la negativa es la excepción tasada.",
    dificultad: 2,
  },
  {
    enunciado: "Un acto administrativo, para ser válido, necesita:",
    opciones: [
      "Un sujeto competente, un contenido lícito y posible, y seguir el procedimiento legalmente establecido",
      "Únicamente la firma del ciudadano interesado",
      "Ser aprobado siempre por las Cortes Generales",
      "Publicarse obligatoriamente en el BOE, sin excepción",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "Un acto administrativo necesita, para ser válido, un sujeto competente, un contenido lícito y posible, y seguir el procedimiento legalmente establecido.",
    mnemotecnia:
      "Tres requisitos de validez: sujeto competente + contenido lícito/posible + procedimiento correcto.",
    dificultad: 2,
  },
  {
    enunciado:
      "Como regla general, ¿desde cuándo son ejecutivos los actos administrativos?",
    opciones: [
      "Desde que se dictan, salvo que una disposición establezca otra cosa",
      "Desde que gana firmeza tras agotar todos los recursos",
      "Desde que se publican en el BOE, en todo caso",
      "Nunca son ejecutivos hasta que lo confirme un juez",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "Como regla general, los actos administrativos son ejecutivos desde que se dictan, salvo que una disposición establezca otra cosa.",
    mnemotecnia: "Ejecutivo desde el minuto uno, salvo que una norma diga lo contrario.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Cuándo se recurre a la publicación de un acto administrativo en lugar de a su notificación individual?",
    opciones: [
      "Cuando el acto tiene por destinatarios a una pluralidad indeterminada de personas, o la notificación individual no es posible o no está garantizada",
      "Siempre, la publicación sustituye por completo a la notificación",
      "Solo cuando lo pide expresamente la persona interesada",
      "Nunca, la notificación individual es siempre obligatoria",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "Se recurre a la publicación cuando el acto tiene por destinatarios a una pluralidad indeterminada de personas, cuando la Administración estima que la notificación individual no es posible o no está garantizada, o cuando un procedimiento así lo prevea.",
    mnemotecnia:
      "Destinatario concreto = notificación; destinatarios indeterminados = publicación.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Ante qué órgano se interpone el recurso de alzada, frente a un acto que no agota la vía administrativa?",
    opciones: [
      "Ante el órgano superior jerárquico de quien dictó el acto",
      "Ante el mismo órgano que dictó el acto",
      "Ante un juzgado de lo contencioso-administrativo",
      "Ante el Tribunal Constitucional",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "Frente a un acto que no agota la vía administrativa cabe el recurso de alzada, ante el órgano superior jerárquico de quien dictó el acto.",
    mnemotecnia: "Alzada = 'subes' un escalón, al superior jerárquico.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué tienen en común el recurso de reposición y el recurso extraordinario de revisión?",
    opciones: [
      "Ambos son de carácter obligatorio antes de acudir a la vía judicial",
      "El de reposición es potestativo y se interpone ante el mismo órgano que dictó el acto; el de revisión se basa en motivos tasados y puede caber incluso contra actos firmes en vía administrativa",
      "Ambos solo pueden interponerse contra actos que no agotan la vía administrativa",
      "Ninguno de los dos puede interponerse contra un acto que agota la vía administrativa",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El recurso de reposición es potestativo, se interpone ante el mismo órgano que dictó el acto y cabe frente a actos que agotan la vía administrativa antes de acudir a la vía judicial; el recurso extraordinario de revisión, por motivos tasados (error de hecho, aparición de documentos esenciales, cohecho, violencia u otra maquinación fraudulenta), puede interponerse incluso contra actos firmes en vía administrativa.",
    mnemotecnia:
      "Reposición: potestativo, mismo órgano. Revisión: motivos tasados, incluso contra actos firmes.",
    dificultad: 3,
  },
];

// Tema 13 · El personal funcionario (AAE_TEMA13_BLOQUE1 + AAE_TEMA13_PARTE2)
export const AAE_TEMA13_PREGUNTAS = [
  {
    enunciado:
      "¿Qué tipo de personal cesa cuando lo hace la autoridad a la que sirve?",
    opciones: [
      "El funcionario de carrera",
      "El funcionario interino",
      "El personal laboral",
      "El personal eventual",
    ],
    respuestaCorrecta: 3,
    justificacionIa:
      "El personal eventual desempeña funciones de confianza o asesoramiento especial, y cesa cuando lo hace la autoridad a la que sirve.",
    mnemotecnia: "Eventual = 'de confianza': se va cuando se va su jefe.",
    dificultad: 1,
  },
  {
    enunciado:
      "El funcionario interino cubre necesidades urgentes o temporales y se rige por:",
    opciones: [
      "El Estatuto de los Trabajadores en exclusiva",
      "El mismo régimen que el funcionario de carrera, salvo excepciones",
      "Un régimen contractual libremente pactado",
      "Ningún régimen específico",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El funcionario interino cubre necesidades urgentes o temporales, con el mismo régimen que el de carrera salvo excepciones.",
    mnemotecnia: "Interino = 'carrera' con fecha de caducidad.",
    dificultad: 2,
  },
  {
    enunciado: "El personal laboral de la Administración se vincula mediante:",
    opciones: [
      "Un contrato de trabajo, sujeto también al Estatuto de los Trabajadores",
      "Un nombramiento tras proceso selectivo",
      "Una designación de confianza política",
      "Una oposición libre exclusivamente pública",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El personal laboral está vinculado por contrato de trabajo, sujeto también al Estatuto de los Trabajadores.",
    mnemotecnia: "Laboral = contrato, como en la empresa privada.",
    dificultad: 1,
  },
  {
    enunciado:
      "El texto refundido del Estatuto Básico del Empleado Público se aprobó mediante:",
    opciones: [
      "Ley Orgánica 3/1981",
      "Ley 39/2015",
      "Real Decreto Legislativo 5/2015",
      "Ley 40/2015",
    ],
    respuestaCorrecta: 2,
    justificacionIa:
      "El texto refundido del Estatuto Básico del Empleado Público fue aprobado por el Real Decreto Legislativo 5/2015.",
    mnemotecnia: "EBEP = RDLeg 5/2015: la norma marco de todo el personal público.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Bajo qué principios se rige el acceso al empleo público, según el EBEP?",
    opciones: [
      "Igualdad, mérito y capacidad",
      "Antigüedad, confianza y designación política",
      "Sorteo, rotación y turno",
      "Herencia, recomendación y experiencia",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El EBEP establece que el acceso al empleo público se rige mediante los principios de igualdad, mérito y capacidad.",
    mnemotecnia: "Igualdad + Mérito + Capacidad = las tres claves del acceso al empleo público.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué requisitos deben cumplirse sucesivamente para adquirir la condición de funcionario de carrera?",
    opciones: [
      "Superar el proceso selectivo, ser nombrado, prestar juramento o promesa, y tomar posesión dentro de plazo",
      "Solo superar el proceso selectivo",
      "Solo ser nombrado por el órgano competente",
      "Prestar juramento y nada más",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "La condición de funcionario de carrera se adquiere por el cumplimiento sucesivo de: superar el proceso selectivo, ser nombrado por el órgano competente, prestar juramento o promesa, y tomar posesión del puesto dentro del plazo establecido.",
    mnemotecnia: "Cuatro pasos: superar, nombrar, jurar, tomar posesión.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Cuál de las siguientes NO es una causa de pérdida de la condición de funcionario mencionada en este tema?",
    opciones: [
      "Renuncia",
      "Jubilación",
      "Cambio de destino a otra provincia",
      "Sanción disciplinaria de separación del servicio",
    ],
    respuestaCorrecta: 2,
    justificacionIa:
      "La condición de funcionario se pierde por renuncia, pérdida de la nacionalidad, jubilación, sanción disciplinaria de separación del servicio, o pena de inhabilitación; un cambio de destino a otra provincia no figura entre esas causas.",
    mnemotecnia: "Cambiar de destino no te quita la condición de funcionario; renunciar, sí.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Cuál de los siguientes es un derecho colectivo del personal funcionario, según el EBEP?",
    opciones: [
      "La carrera profesional",
      "La formación continua",
      "La huelga, con el mantenimiento de los servicios esenciales",
      "La vacación retribuida",
    ],
    respuestaCorrecta: 2,
    justificacionIa:
      "El EBEP reconoce derechos individuales (carrera profesional, formación continua, negociación colectiva, vacación retribuida, permisos y licencias) y derechos colectivos (libertad sindical, negociación colectiva, huelga con el mantenimiento de los servicios esenciales).",
    mnemotecnia: "La huelga es colectiva por definición: se ejerce en grupo.",
    dificultad: 2,
  },
  {
    enunciado:
      "Un funcionario nombrado alto cargo pasa a la situación administrativa de:",
    opciones: [
      "Servicio activo",
      "Servicios especiales",
      "Excedencia voluntaria",
      "Suspensión de funciones",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El funcionario de carrera puede pasar a servicios especiales, por ejemplo, al ser nombrado alto cargo o elegido para un puesto de representación política.",
    mnemotecnia: "Alto cargo = servicios 'especiales', no servicio activo normal.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Cuál es la sanción disciplinaria más grave que puede imponerse a un funcionario, según lo estudiado?",
    opciones: [
      "El apercibimiento",
      "El traslado forzoso",
      "La separación del servicio, que implica la pérdida de la condición de funcionario",
      "La suspensión de funciones",
    ],
    respuestaCorrecta: 2,
    justificacionIa:
      "Las sanciones van desde la separación del servicio (la más grave, implica la pérdida de la condición de funcionario) hasta el apercibimiento, pasando por la suspensión de funciones o el traslado forzoso.",
    mnemotecnia: "Separación del servicio = la 'pena capital' administrativa: pierdes la condición de funcionario.",
    dificultad: 1,
  },
];

// Tema 17 · Atención al público (AAE_TEMA17_BLOQUE2 + AAE_TEMA17_PARTE2)
export const AAE_TEMA17_PREGUNTAS = [
  {
    enunciado:
      "Según la Ley 39/2015, ¿qué derecho tiene expresamente reconocida la ciudadanía en relación con los medios electrónicos?",
    opciones: [
      "Ser asistida en su uso y obtener información sobre los requisitos jurídicos o técnicos de cualquier trámite",
      "Exigir que todos los trámites sean exclusivamente electrónicos",
      "Recibir una respuesta inmediata a cualquier consulta",
      "Elegir libremente qué funcionario le atiende",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "La Ley 39/2015 reconoce expresamente el derecho de la ciudadanía a ser asistida en el uso de medios electrónicos y a obtener información sobre los requisitos jurídicos o técnicos de cualquier trámite.",
    mnemotecnia: "Derecho a ser asistido + informado: dos caras de la misma moneda en la atención electrónica.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué deben garantizar las oficinas públicas en relación con la atención a personas con discapacidad?",
    opciones: [
      "La accesibilidad universal: eliminación de barreras físicas y medios de apoyo",
      "Una ventanilla exclusiva solo para trámites urgentes",
      "Un horario reducido para evitar aglomeraciones",
      "El pago de una tasa reducida",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "Las oficinas públicas deben garantizar la accesibilidad universal: eliminación de barreras físicas, disponibilidad de medios de apoyo para personas con discapacidad auditiva o visual, y formatos alternativos de información cuando se soliciten.",
    mnemotecnia: "Accesibilidad universal = sin barreras, con apoyos, en formatos alternativos.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Cuál de las siguientes vías de la ciudadanía hacia la Administración corresponde a una disconformidad con un servicio concreto, buscando su corrección?",
    opciones: ["La sugerencia", "La reclamación", "La queja", "El derecho de petición"],
    respuestaCorrecta: 1,
    justificacionIa:
      "La reclamación expresa disconformidad con un servicio concreto, buscando su corrección, a diferencia de la queja (sobre el funcionamiento de los servicios, sin efectos jurídicos directos) o la sugerencia (propuesta de mejora).",
    mnemotecnia: "Reclamación = 'quiero que se corrija algo concreto'.",
    dificultad: 2,
  },
  {
    enunciado:
      "El derecho de petición, reconocido en el artículo 29 de la Constitución, permite:",
    opciones: [
      "Dirigirse a un poder público sobre cualquier asunto de su competencia, sin necesidad de ser parte en un procedimiento",
      "Exigir una indemnización económica automática",
      "Solicitar la revisión de una sentencia judicial firme",
      "Iniciar directamente un procedimiento disciplinario contra un funcionario",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El derecho de petición del artículo 29 CE es una solicitud dirigida a un poder público sobre cualquier asunto de su competencia, sin necesidad de ser parte en un procedimiento.",
    mnemotecnia: "Petición: no necesitas ser parte de nada, basta con dirigirte al poder público.",
    dificultad: 2,
  },
  {
    enunciado:
      "El registro electrónico general de una Administración debe ser accesible:",
    opciones: [
      "Solo en horario de oficina",
      "Las 24 horas del día durante todo el año",
      "Únicamente los días laborables",
      "Solo cuando lo autorice el órgano competente para resolver",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "Toda Administración debe disponer de un registro electrónico general, accesible las 24 horas del día durante todo el año.",
    mnemotecnia: "Registro electrónico = abierto 24/7, todo el año.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué determina, a todos los efectos, el momento en que se entiende iniciado un procedimiento?",
    opciones: [
      "La fecha y hora de presentación en el registro",
      "La fecha en que el documento llega efectivamente al órgano competente para resolver",
      "La fecha en que se notifica la resolución",
      "La fecha en que se publica el acto en el BOE",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "La fecha y hora de presentación en el registro determina, a todos los efectos, el momento en que se entiende iniciado el procedimiento o presentado un documento, con independencia de cuándo llegue efectivamente al órgano competente.",
    mnemotecnia: "Lo que cuenta es el sello del registro, no cuándo llega al despacho competente.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Cuál de los siguientes es un sistema de identificación y firma electrónica mencionado en este tema?",
    opciones: ["Cl@ve", "El registro de entrada en papel", "El libro de reclamaciones", "El tablón de anuncios"],
    respuestaCorrecta: 0,
    justificacionIa:
      "La identificación y la firma electrónica (mediante certificado digital, DNI electrónico o sistemas de clave concertada como Cl@ve) permiten realizar trámites con plena validez jurídica sin desplazarse a una oficina.",
    mnemotecnia: "Cl@ve, certificado digital y DNI electrónico: las tres llaves de la firma electrónica.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué debe ofrecer la Administración a quienes tengan dificultades para operar por medios electrónicos?",
    opciones: [
      "Ninguna alternativa, el trámite electrónico es siempre obligatorio",
      "Asistencia",
      "Una sanción por no adaptarse",
      "Un plazo de espera indefinido sin resolución",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "La Administración debe ofrecer asistencia a quienes tengan dificultades para operar por medios electrónicos, junto a la atención presencial.",
    mnemotecnia: "Dificultad con lo electrónico = derecho a asistencia, no a quedarse sin trámite.",
    dificultad: 1,
  },
  {
    enunciado:
      "Los datos personales recabados en la atención al público deben tratarse conforme a qué normativa, según este tema?",
    opciones: [
      "El Reglamento General de Protección de Datos (RGPD) y la legislación española de desarrollo",
      "Únicamente el Código Penal",
      "El Estatuto de los Trabajadores",
      "La Ley Orgánica del Régimen Electoral General",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "Cualquier dato personal recabado en la atención al público debe tratarse conforme al Reglamento General de Protección de Datos (RGPD) y a la legislación española de desarrollo.",
    mnemotecnia: "RGPD: la norma de cabecera para cualquier dato personal recogido en una oficina.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué derechos tiene la persona interesada sobre sus propios datos personales, según este tema?",
    opciones: [
      "Solo el derecho a que se conserven indefinidamente",
      "Derecho a acceder a ellos, a solicitar su rectificación si son erróneos y, en los casos que la ley permite, a su supresión",
      "Ningún derecho, salvo autorización judicial expresa",
      "Solo el derecho a impedir que se recojan, sin excepción",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "La persona interesada tiene derecho a acceder a sus propios datos, a solicitar su rectificación si son erróneos y, en los casos que la ley permite, a su supresión; además, los datos solo pueden usarse para la finalidad para la que se recogieron y deben conservarse el tiempo estrictamente necesario.",
    mnemotecnia: "Acceso + rectificación + supresión: los tres derechos básicos sobre tus propios datos.",
    dificultad: 2,
  },
];

// Tema 21 · Informática básica (AAE_TEMA21_BLOQUE1 + AAE_TEMA21_PARTE2)
export const AAE_TEMA21_PREGUNTAS = [
  {
    enunciado: "¿Cuál de los siguientes componentes es memoria volátil?",
    opciones: ["El disco duro (HDD)", "La memoria RAM", "La unidad de estado sólido (SSD)", "El escáner"],
    respuestaCorrecta: 1,
    justificacionIa:
      "La memoria RAM es volátil: almacenamiento de trabajo mientras el equipo está encendido. El HDD y el SSD son almacenamiento no volátil, y el escáner es un periférico de entrada.",
    mnemotecnia: "RAM = 'se olvida' al apagar el equipo; el disco (HDD/SSD) no.",
    dificultad: 1,
  },
  {
    enunciado: "¿Qué diferencia principal existe entre un HDD y un SSD?",
    opciones: [
      "El SSD es más rápido y no tiene partes móviles; el HDD es mecánico",
      "El HDD es más rápido que el SSD",
      "Ambos son memoria volátil",
      "El SSD solo puede usarse como periférico externo",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El disco duro mecánico (HDD) y la unidad de estado sólido (SSD) son ambos almacenamiento no volátil, pero el SSD es más rápido y no tiene partes móviles.",
    mnemotecnia: "SSD = 'Sin partes en movimiento' + más rápido.",
    dificultad: 1,
  },
  {
    enunciado: "¿Cómo se clasifican los periféricos según este tema?",
    opciones: [
      "En dispositivos de entrada, de salida, y de entrada/salida",
      "Solo en dispositivos de entrada y de salida",
      "En hardware y software",
      "En LAN y WAN",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "Los periféricos se clasifican en dispositivos de entrada (teclado, ratón, escáner), de salida (monitor, impresora) y de entrada/salida (pantallas táctiles, módems).",
    mnemotecnia: "Entrada, salida, y las dos cosas a la vez (E/S).",
    dificultad: 1,
  },
  {
    enunciado: "El software de sistema incluye:",
    opciones: [
      "El sistema operativo y los controladores o drivers",
      "Solo los programas de ofimática",
      "Solo los navegadores de internet",
      "Solo los antivirus",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El software de sistema comprende el sistema operativo y los controladores o drivers, que gestionan los recursos del equipo y sirven de intermediarios entre el hardware y los programas.",
    mnemotecnia: "Sistema = SO + drivers; el resto (ofimática, navegador...) es software de aplicación.",
    dificultad: 2,
  },
  {
    enunciado: "¿Qué gestiona un sistema operativo, según lo estudiado en este tema?",
    opciones: [
      "La memoria, los procesos, el sistema de archivos y la comunicación con los periféricos",
      "Únicamente la conexión a internet",
      "Únicamente el formato de los documentos de texto",
      "Únicamente las copias de seguridad",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El sistema operativo gestiona la memoria, los procesos, el sistema de archivos y la comunicación con los periféricos, siendo el software más importante del equipo.",
    mnemotecnia: "El SO hace de todo: memoria, procesos, archivos y periféricos.",
    dificultad: 2,
  },
  {
    enunciado: "¿Qué diferencia una red LAN de una red WAN?",
    opciones: [
      "La LAN es local (un edificio o campus); la WAN es extensa, como Internet",
      "La LAN es más extensa que la WAN",
      "La WAN solo conecta dos equipos",
      "No existe ninguna diferencia entre ambas",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "Según su alcance se distingue entre LAN (red local, un edificio o campus) y WAN (red extensa, como Internet).",
    mnemotecnia: "LAN = Local; WAN = 'World-sized' (piensa en Internet).",
    dificultad: 1,
  },
  {
    enunciado: "En la notación decimal habitual de almacenamiento, ¿cuántos bits tiene un byte?",
    opciones: ["4", "8", "16", "1024"],
    respuestaCorrecta: 1,
    justificacionIa:
      "La información se mide en bits (la unidad mínima) y bytes (8 bits); a partir de ahí, kilobyte, megabyte, gigabyte y terabyte.",
    mnemotecnia: "1 byte = 8 bits, siempre.",
    dificultad: 1,
  },
  {
    enunciado:
      "La seguridad informática busca proteger tres propiedades de la información. ¿Cuáles?",
    opciones: [
      "Confidencialidad, integridad y disponibilidad",
      "Velocidad, capacidad y portabilidad",
      "Legalidad, gratuidad y sencillez",
      "Compatibilidad, actualidad y estética",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "La seguridad informática busca proteger la confidencialidad (que solo acceda quien esté autorizado), la integridad (que no se altere de forma no autorizada) y la disponibilidad (que esté accesible cuando se necesite).",
    mnemotecnia: "CID: Confidencialidad, Integridad, Disponibilidad.",
    dificultad: 1,
  },
  {
    enunciado:
      "En un correo electrónico, ¿qué diferencia hay entre los campos 'CC' y 'CCO'?",
    opciones: [
      "'CC' es con copia visible para todos; 'CCO' es con copia oculta al resto de destinatarios",
      "'CC' es el destinatario principal; 'CCO' es el asunto del mensaje",
      "Ambos campos son exactamente iguales",
      "'CCO' solo puede usarse para adjuntar archivos",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "'CC' (con copia) mantiene informado sin exigir respuesta, y es visible para el resto de destinatarios; 'CCO' (con copia oculta) se usa cuando no procede que los destinatarios vean la lista completa.",
    mnemotecnia: "CC = copia visible; CCO = copia oculta ('la O es de oculto').",
    dificultad: 2,
  },
  {
    enunciado: "¿Cómo se identifica una conexión cifrada (HTTPS) en un navegador?",
    opciones: [
      "Por el candado en la barra de direcciones",
      "Por el color de fondo de la página",
      "Por la velocidad de carga",
      "Por el tamaño de la fuente del sitio",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El protocolo HTTPS es identificable por el candado en la barra de direcciones, y debe ser el estándar en cualquier gestión que implique datos personales o credenciales.",
    mnemotecnia: "Candado en la barra = HTTPS, conexión cifrada.",
    dificultad: 1,
  },
];

// Tema 25 · Hojas de cálculo: Excel 365 (AAE_TEMA25_BLOQUE2 + AAE_TEMA25_PARTE2)
export const AAE_TEMA25_PREGUNTAS = [
  {
    enunciado: "¿Con qué signo empiezan siempre las fórmulas en una hoja de cálculo?",
    opciones: ["Con \"#\"", "Con \"=\"", "Con \"@\"", "Con \"$\""],
    respuestaCorrecta: 1,
    justificacionIa:
      "Las fórmulas empiezan siempre por el signo \"=\" y permiten realizar cálculos referenciando el contenido de otras celdas (ej. =A1+B1).",
    mnemotecnia: "Sin \"=\" al principio, Excel no lo trata como fórmula.",
    dificultad: 1,
  },
  {
    enunciado: "¿Qué función de Excel se usa para evaluar condiciones?",
    opciones: ["SUMA", "PROMEDIO", "SI", "CONTAR"],
    respuestaCorrecta: 2,
    justificacionIa:
      "Entre las funciones más usadas en el trabajo administrativo diario están SUMA, PROMEDIO, CONTAR, SI (para condiciones), BUSCARV o BUSCARX (para buscar valores en otra tabla).",
    mnemotecnia: "SI = 'si se cumple esto, haz esto otro'.",
    dificultad: 1,
  },
  {
    enunciado: "¿Para qué se usan las funciones BUSCARV o BUSCARX?",
    opciones: [
      "Para buscar valores en otra tabla",
      "Para ordenar datos alfabéticamente",
      "Para crear gráficos automáticamente",
      "Para proteger una hoja con contraseña",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "BUSCARV o BUSCARX son funciones para buscar valores en otra tabla, de las más usadas en el trabajo administrativo diario.",
    mnemotecnia: "BUSCARV/BUSCARX: 'buscar' está en el propio nombre de la función.",
    dificultad: 2,
  },
  {
    enunciado: "¿Qué permite hacer el formato condicional en Excel?",
    opciones: [
      "Resaltar celdas automáticamente según su valor",
      "Congelar filas y columnas",
      "Grabar una macro",
      "Exportar la hoja a PDF",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "Excel permite aplicar formato condicional para resaltar celdas automáticamente según su valor, además de ordenar y filtrar datos y crear gráficos.",
    mnemotecnia: "Formato condicional = colorea la celda 'a condición de' cumplir un criterio.",
    dificultad: 1,
  },
  {
    enunciado: "¿Qué permiten hacer las tablas dinámicas?",
    opciones: [
      "Resumir y cruzar grandes volúmenes de datos sin necesidad de escribir fórmulas complejas",
      "Proteger una hoja con contraseña",
      "Congelar la primera fila de la hoja",
      "Definir el área de impresión",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "Las tablas dinámicas resumen y cruzan grandes volúmenes de datos sin necesidad de escribir fórmulas complejas.",
    mnemotecnia: "Tabla dinámica = resumen automático, sin fórmulas complicadas.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Para qué sirve congelar filas o columnas en Excel 365?",
    opciones: [
      "Para mantenerlas visibles al desplazarse por una hoja grande",
      "Para eliminarlas definitivamente",
      "Para convertirlas en una macro",
      "Para protegerlas con contraseña automáticamente",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "Excel 365 permite congelar filas o columnas para mantenerlas visibles al desplazarse por una hoja grande.",
    mnemotecnia: "Congelar = 'se queda fija' aunque te desplaces por el resto de la hoja.",
    dificultad: 1,
  },
  {
    enunciado: "¿Qué permite hacer la validación de datos en una celda?",
    opciones: [
      "Restringir lo que puede introducirse (por ejemplo, solo números en un rango, fechas, o valores de una lista desplegable)",
      "Grabar una macro automáticamente",
      "Exportar el libro completo a PDF",
      "Cambiar el idioma de la interfaz",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "La validación de datos permite restringir lo que puede introducirse en una celda: solo números dentro de un rango, solo fechas, o solo valores de una lista desplegable predefinida, reduciendo errores de introducción de datos.",
    mnemotecnia: "Validación de datos = un 'filtro' de entrada para evitar errores al escribir.",
    dificultad: 2,
  },
  {
    enunciado: "¿Con qué se puede combinar la protección de hojas o libros en Excel?",
    opciones: [
      "Con una contraseña, para restringir quién puede desbloquearla",
      "Con una macro obligatoria",
      "Con el área de impresión",
      "Con el formato condicional únicamente",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "La protección de hojas y libros puede combinarse con una contraseña para restringir quién puede desbloquear esa protección.",
    mnemotecnia: "Proteger + contraseña = doble cerrojo para la hoja.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué es una macro en Excel, según lo estudiado en este tema?",
    opciones: [
      "Una secuencia de acciones grabada o programada que se puede volver a ejecutar con un clic o atajo de teclado",
      "Una función matemática básica como SUMA",
      "Un tipo de gráfico dinámico",
      "Un formato de archivo de exportación",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "Una macro es una secuencia de acciones grabada o programada que se puede volver a ejecutar con un solo clic o atajo de teclado, útil para automatizar tareas repetitivas. Las más complejas se escriben en VBA.",
    mnemotecnia: "Macro = 'repetir con un clic' lo que antes hacías paso a paso.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué ventaja tiene exportar un documento a PDF frente a compartirlo en su formato original, según este tema?",
    opciones: [
      "Conserva el aspecto exacto del original con independencia del programa o sistema operativo con el que se abra",
      "Permite que cualquiera lo modifique libremente",
      "Convierte automáticamente todas las fórmulas en macros",
      "Reduce el número de hojas del libro",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "Para compartir un documento sin que pueda modificarse su contenido ni su formato, lo habitual es exportarlo a PDF, un formato que conserva el aspecto exacto del original con independencia del programa o sistema operativo con el que se abra después.",
    mnemotecnia: "PDF = 'foto fija' del documento, igual en cualquier programa o sistema.",
    dificultad: 1,
  },
];
