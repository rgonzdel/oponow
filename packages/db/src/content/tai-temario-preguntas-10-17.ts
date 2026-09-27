// Banco de preguntas para los Temas 10 a 17 del temario de TAI (Técnico
// Auxiliar de Informática). Cada constante se corresponde con los bloques
// de contenido ya sembrados en seed.ts (función seedTemarioDemo):
// Tema 10 y Tema 11 usan ce-titulos-2-10.ts (Títulos IX y X de la CE);
// Temas 12 a 17 usan tai-temario-2.ts (bloque principal) y
// tai-temario-3.ts (segunda parte de cada tema). Todas las preguntas se
// basan exclusivamente en hechos explícitos en esos bloques de contenido.

export const TAI_TEMA10_PREGUNTAS = [
  {
    enunciado:
      "Según el artículo 159 de la Constitución, ¿de cuántos miembros se compone el Tribunal Constitucional y por cuánto tiempo son nombrados?",
    opciones: [
      "12 miembros, por un mandato de 9 años",
      "20 miembros, por un mandato de 5 años",
      "12 miembros, por un mandato de 6 años",
      "9 miembros, por un mandato de 12 años",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El art. 159 CE dispone que el Tribunal Constitucional se compone de 12 miembros nombrados por el Rey por un mandato de 9 años, renovándose por terceras partes cada 3 años. La cifra de 20 miembros y 5 años corresponde al Consejo General del Poder Judicial (art. 122 CE), no al Tribunal Constitucional.",
    mnemotecnia:
      "TC = 12 y 9: 12 miembros, 9 años de mandato (no confundir con los 20 miembros y 5 años del CGPJ).",
    dificultad: 2,
  },
  {
    enunciado:
      "De los 12 miembros del Tribunal Constitucional, ¿cómo se distribuye su propuesta según el artículo 159 CE?",
    opciones: [
      "6 los propone el Congreso y 6 el Senado, por mayoría absoluta",
      "4 el Congreso, 4 el Senado (ambos por mayoría de 3/5), 2 el Gobierno y 2 el CGPJ",
      "4 el Gobierno, 4 el CGPJ y 4 el Tribunal Supremo",
      "6 el Gobierno y 6 las Cortes Generales en sesión conjunta",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El art. 159 CE distribuye la propuesta de los 12 miembros así: 4 los propone el Congreso por mayoría de 3/5, 4 el Senado con la misma mayoría, 2 el Gobierno y 2 el Consejo General del Poder Judicial. No hay propuesta directa del Tribunal Supremo ni de las Cortes en sesión conjunta.",
    mnemotecnia:
      "4-4-2-2: Congreso 4, Senado 4 (los dos con 3/5), Gobierno 2, CGPJ 2 — suman los 12 del Tribunal Constitucional.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué requisito exige el artículo 159 CE para poder ser miembro del Tribunal Constitucional?",
    opciones: [
      "Ser Diputado o Senador en el momento del nombramiento",
      "Ser jurista de reconocida competencia con al menos 15 años de ejercicio profesional",
      "Haber sido Magistrado del Tribunal Supremo durante 10 años",
      "Ser funcionario de carrera del Cuerpo Superior de la Administración",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El art. 159 CE exige que los miembros del Tribunal Constitucional sean juristas de reconocida competencia con al menos 15 años de ejercicio profesional. No se exige ser parlamentario, ni haber sido Magistrado del Tribunal Supremo específicamente, ni ser funcionario de un cuerpo concreto.",
    mnemotecnia:
      "15 años de jurista: el requisito del art. 159 es competencia jurídica reconocida y 15 años de ejercicio, no un cargo político o judicial previo concreto.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Quién nombra al Presidente del Tribunal Constitucional y a propuesta de quién, según el artículo 160 CE?",
    opciones: [
      "El Rey, a propuesta del Consejo General del Poder Judicial, por 5 años",
      "El Congreso de los Diputados, a propuesta del Gobierno, por 9 años",
      "El Rey, de entre los miembros del Tribunal, a propuesta del Pleno del Tribunal, por 3 años",
      "El Gobierno, de entre los miembros del Tribunal, por 3 años",
    ],
    respuestaCorrecta: 2,
    justificacionIa:
      "El art. 160 CE dispone que el Presidente del Tribunal Constitucional es nombrado por el Rey, de entre sus miembros, a propuesta del propio Pleno del Tribunal, por un periodo de 3 años. No interviene el CGPJ ni el Congreso en este nombramiento concreto.",
    mnemotecnia:
      "El Tribunal se elige a sí mismo: propone el Pleno, nombra el Rey, dura 3 años (la mitad del ciclo de renovación por tercios del art. 159).",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Cuál de las siguientes NO es una competencia del Tribunal Constitucional según el artículo 161 CE?",
    opciones: [
      "El recurso de inconstitucionalidad contra leyes y disposiciones con fuerza de ley",
      "El recurso de amparo por violación de derechos y libertades",
      "Los conflictos de competencia entre el Estado y las Comunidades Autónomas",
      "Resolver en última instancia los recursos de casación penal",
    ],
    respuestaCorrecta: 3,
    justificacionIa:
      "El art. 161 CE atribuye al Tribunal Constitucional el recurso de inconstitucionalidad, el recurso de amparo, los conflictos de competencia entre el Estado y las Comunidades Autónomas (o de estas entre sí) y las demás materias que le atribuyan la Constitución o las leyes orgánicas. La casación penal corresponde al Tribunal Supremo (art. 123 CE), no al Tribunal Constitucional.",
    mnemotecnia:
      "El TC no es un Supremo más: no casa sentencias penales, controla la constitucionalidad (inconstitucionalidad, amparo, conflictos de competencia).",
    dificultad: 2,
  },
  {
    enunciado:
      "Cuando el Gobierno impugna ante el Tribunal Constitucional una disposición de un órgano de una Comunidad Autónoma, ¿qué efecto produce esa impugnación según el artículo 161 CE?",
    opciones: [
      "Ninguno, la disposición sigue vigente hasta la sentencia",
      "La suspensión de la disposición recurrida, que el Tribunal debe ratificar o levantar en un plazo no superior a 5 meses",
      "La derogación automática y definitiva de la disposición",
      "La suspensión indefinida hasta que la Comunidad Autónoma renuncie al recurso",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El art. 161 CE establece que esa impugnación del Gobierno produce la suspensión de la disposición recurrida, y el Tribunal Constitucional debe ratificar o levantar dicha suspensión en un plazo no superior a 5 meses. No es una derogación automática ni una suspensión sin plazo.",
    mnemotecnia:
      "5 meses de suspensión: el Gobierno impugna, la norma autonómica queda en suspenso, y el TC tiene hasta 5 meses para decidir si la levanta o la mantiene.",
    dificultad: 3,
  },
  {
    enunciado:
      "¿Quiénes están legitimados para interponer el recurso de inconstitucionalidad según el artículo 162 CE?",
    opciones: [
      "El Presidente del Gobierno, el Defensor del Pueblo, 50 Diputados, 50 Senadores y los órganos colegiados ejecutivos de las Comunidades Autónomas (y, en su caso, sus Asambleas)",
      "Cualquier ciudadano que acredite un interés legítimo",
      "Solo el Presidente del Gobierno y el Presidente del Congreso",
      "El Ministerio Fiscal y el Consejo General del Poder Judicial",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El art. 162 CE legitima para el recurso de inconstitucionalidad al Presidente del Gobierno, al Defensor del Pueblo, a 50 Diputados, a 50 Senadores y a los órganos colegiados ejecutivos de las Comunidades Autónomas y, en su caso, sus Asambleas. La legitimación de 'cualquier persona con interés legítimo' corresponde al recurso de amparo, no al de inconstitucionalidad.",
    mnemotecnia:
      "50 y 50: para el recurso de inconstitucionalidad hacen falta 50 Diputados o 50 Senadores (además del Presidente del Gobierno, el Defensor del Pueblo y las CCAA).",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Quién puede interponer un recurso de amparo ante el Tribunal Constitucional según el artículo 162 CE?",
    opciones: [
      "Solo el Defensor del Pueblo",
      "Toda persona natural o jurídica que invoque un interés legítimo, el Defensor del Pueblo y el Ministerio Fiscal",
      "Únicamente 50 Diputados o 50 Senadores",
      "Solo las Comunidades Autónomas afectadas",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El art. 162 CE legitima para el recurso de amparo a toda persona natural o jurídica que invoque un interés legítimo, así como al Defensor del Pueblo y al Ministerio Fiscal. Los 50 Diputados o Senadores están legitimados para el recurso de inconstitucionalidad, no para el amparo.",
    mnemotecnia:
      "Amparo es para todos: a diferencia del recurso de inconstitucionalidad (reservado a sujetos institucionales), el amparo lo puede pedir cualquier persona con interés legítimo.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué es la cuestión de inconstitucionalidad regulada en el artículo 163 CE?",
    opciones: [
      "Un recurso que puede plantear cualquier ciudadano directamente ante el Tribunal Constitucional",
      "El mecanismo por el que un órgano judicial, cuando en un proceso considera que una norma con rango de ley de la que depende el fallo puede ser contraria a la Constitución, la plantea ante el Tribunal Constitucional, sin efectos suspensivos",
      "El recurso que interpone el Gobierno contra una ley autonómica",
      "Un trámite previo obligatorio antes de aprobar cualquier ley orgánica",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El art. 163 CE define la cuestión de inconstitucionalidad como el mecanismo por el que un órgano judicial, dentro de un proceso, plantea ante el Tribunal Constitucional su duda sobre la constitucionalidad de una norma con rango de ley de cuya validez depende el fallo; esto no tiene efectos suspensivos. No es un recurso directo del ciudadano ni un trámite previo a la aprobación de leyes.",
    mnemotecnia:
      "La duda es del juez, no del ciudadano: en la cuestión de inconstitucionalidad quien plantea la duda es el órgano judicial que está resolviendo el caso.",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 164 CE, ¿qué valor tienen las sentencias del Tribunal Constitucional que declaran la inconstitucionalidad de una norma con rango de ley?",
    opciones: [
      "Solo afectan a las partes del proceso concreto",
      "Se publican en el BOE, tienen valor de cosa juzgada desde el día siguiente a su publicación, no cabe recurso alguno contra ellas y producen plenos efectos frente a todos",
      "Deben ser ratificadas por las Cortes Generales para tener efecto",
      "Tienen efectos solo dentro de la Comunidad Autónoma afectada",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El art. 164 CE establece que las sentencias del Tribunal Constitucional se publican en el BOE, tienen valor de cosa juzgada a partir del día siguiente a su publicación, no cabe recurso alguno contra ellas, y las que declaran la inconstitucionalidad de una norma con rango de ley tienen plenos efectos frente a todos (efecto erga omnes), sin necesidad de ratificación de las Cortes.",
    mnemotecnia:
      "Erga omnes y sin recurso: las sentencias del TC sobre inconstitucionalidad valen para todos, publicadas en el BOE, y nadie puede recurrirlas.",
    dificultad: 2,
  },
];

export const TAI_TEMA11_PREGUNTAS = [
  {
    enunciado:
      "¿A quién corresponde la iniciativa de reforma constitucional según el artículo 166 CE?",
    opciones: [
      "Exclusivamente al Gobierno",
      "A los mismos sujetos que la iniciativa legislativa ordinaria del artículo 87.1 y 2: el Gobierno, el Congreso y el Senado",
      "Solo a las Cortes Generales en sesión conjunta",
      "A cualquier Comunidad Autónoma por mayoría de su Asamblea",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El art. 166 CE remite a los mismos términos previstos para la iniciativa legislativa en el art. 87, apartados 1 y 2, es decir: corresponde al Gobierno, al Congreso y al Senado. No se atribuye en exclusiva al Gobierno ni directamente a las Comunidades Autónomas.",
    mnemotecnia:
      "La reforma constitucional 'copia' la iniciativa legislativa: mismos tres sujetos del art. 87.1-2 (Gobierno, Congreso, Senado).",
    dificultad: 1,
  },
  {
    enunciado:
      "En el procedimiento ordinario de reforma constitucional (artículo 167 CE), ¿qué mayoría se exige en cada Cámara para aprobar el proyecto?",
    opciones: [
      "Mayoría simple",
      "Mayoría absoluta",
      "Mayoría de 3/5",
      "Mayoría de 2/3",
    ],
    respuestaCorrecta: 2,
    justificacionIa:
      "El art. 167 CE exige que los proyectos de reforma se aprueben por una mayoría de 3/5 de cada Cámara en el procedimiento ordinario. La mayoría de 2/3 se reserva para el procedimiento agravado del art. 168 y para el caso en que, sin acuerdo, el Congreso apruebe la reforma tras el visto bueno por mayoría absoluta del Senado.",
    mnemotecnia:
      "Ordinario = 3/5, agravado = 2/3: cuanto más profunda la reforma, más alta la mayoría exigida.",
    dificultad: 2,
  },
  {
    enunciado:
      "Si el Congreso y el Senado no llegan a un acuerdo sobre un proyecto de reforma constitucional por el procedimiento ordinario, ¿qué prevé el artículo 167 CE?",
    opciones: [
      "El proyecto decae automáticamente",
      "Se crea una comisión mixta paritaria de Diputados y Senadores que presenta un texto, sometido después a votación de ambas Cámaras",
      "Decide directamente el Tribunal Constitucional",
      "El Rey dirime el desacuerdo mediante decreto",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El art. 167 CE prevé que, ante la falta de acuerdo entre Congreso y Senado, se cree una comisión mixta paritaria de Diputados y Senadores que presente un texto, sometido a votación del Congreso y del Senado. Ni el Tribunal Constitucional ni el Rey intervienen en ese desacuerdo, y el proyecto no decae automáticamente.",
    mnemotecnia:
      "Comisión mixta paritaria: mismo mecanismo de 'árbitro' que en la elaboración de leyes cuando Congreso y Senado no coinciden.",
    dificultad: 2,
  },
  {
    enunciado:
      "Aprobada una reforma constitucional por el procedimiento ordinario, ¿cuándo se somete a referéndum de ratificación según el artículo 167 CE?",
    opciones: [
      "Siempre, en todo caso, sin excepción",
      "Nunca, el referéndum solo existe en el procedimiento agravado",
      "Si lo solicita, dentro de los 15 días siguientes a su aprobación, una décima parte de los miembros de cualquiera de las Cámaras",
      "Si lo solicita la mayoría absoluta del Congreso en el plazo de un mes",
    ],
    respuestaCorrecta: 2,
    justificacionIa:
      "El art. 167 CE dispone que la reforma aprobada por el procedimiento ordinario se somete a referéndum para su ratificación si, dentro de los 15 días siguientes a su aprobación, lo solicita una décima parte de los miembros de cualquiera de las Cámaras. No es automático ni exclusivo del procedimiento agravado.",
    mnemotecnia:
      "1/10 y 15 días: para forzar el referéndum en la reforma ordinaria hace falta que lo pida una décima parte de una Cámara, en solo 15 días.",
    dificultad: 3,
  },
  {
    enunciado:
      "¿Cuándo se debe seguir el procedimiento agravado de reforma constitucional del artículo 168 CE?",
    opciones: [
      "Siempre que se reforme cualquier artículo de la Constitución",
      "Solo cuando lo pida el Tribunal Constitucional",
      "Cuando se proponga una revisión total de la Constitución, o una revisión parcial que afecte al Título Preliminar, a la Sección 1ª del Capítulo II del Título I, o al Título II (la Corona)",
      "Únicamente cuando la reforma afecte a la organización territorial del Estado",
    ],
    respuestaCorrecta: 2,
    justificacionIa:
      "El art. 168 CE reserva el procedimiento agravado para la revisión total de la Constitución o para la revisión parcial que afecte al Título Preliminar, a la Sección 1ª del Capítulo II del Título I (derechos fundamentales y libertades públicas), o al Título II (la Corona). No se aplica a cualquier reforma ni está vinculado al Título VIII.",
    mnemotecnia:
      "Lo más sagrado, procedimiento más duro: Título Preliminar, derechos fundamentales (Sección 1ª) y la Corona exigen el procedimiento agravado del art. 168.",
    dificultad: 2,
  },
  {
    enunciado:
      "En el procedimiento agravado de reforma constitucional (artículo 168 CE), ¿qué ocurre inmediatamente después de aprobarse el principio de la reforma por mayoría de 2/3 de cada Cámara?",
    opciones: [
      "Se somete directamente a referéndum sin más trámites",
      "Se disuelven inmediatamente las Cortes",
      "El Rey sanciona la reforma sin más trámite",
      "Se crea una comisión mixta paritaria como en el procedimiento ordinario",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El art. 168 CE establece que, aprobado el principio de la reforma por mayoría de 2/3 de cada Cámara, deben disolverse inmediatamente las Cortes. Las Cámaras elegidas después deben ratificar la decisión y estudiar el nuevo texto, que se aprueba por 2/3 de ambas Cámaras y se somete a referéndum. No hay comisión mixta paritaria en este procedimiento.",
    mnemotecnia:
      "2/3 y disolución: en el procedimiento agravado, aprobar el principio de la reforma implica disolver las Cortes de inmediato.",
    dificultad: 2,
  },
  {
    enunciado:
      "Tras la disolución de las Cortes en el procedimiento agravado del artículo 168 CE, ¿qué deben hacer las nuevas Cámaras elegidas?",
    opciones: [
      "Nada, el proceso de reforma queda automáticamente cerrado",
      "Ratificar la decisión y proceder al estudio del nuevo texto constitucional, que debe aprobarse por mayoría de 2/3 de ambas Cámaras y sometido después a referéndum",
      "Convocar directamente elecciones de nuevo sin tramitar la reforma",
      "Delegar el estudio del texto en el Tribunal Constitucional",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El art. 168 CE exige que las Cámaras elegidas tras la disolución ratifiquen la decisión y estudien el nuevo texto constitucional, que debe ser aprobado por mayoría de 2/3 de ambas Cámaras y se somete después a referéndum para su ratificación. El proceso no queda cerrado con la disolución ni se delega en el Tribunal Constitucional.",
    mnemotecnia:
      "Ratificar, estudiar, aprobar (2/3) y referéndum: el ciclo completo que deben seguir las nuevas Cortes en el procedimiento agravado.",
    dificultad: 3,
  },
  {
    enunciado:
      "¿En qué circunstancias NO puede iniciarse la reforma constitucional, según el artículo 169 CE?",
    opciones: [
      "En tiempo de guerra ni durante la vigencia de los estados de alarma, excepción o sitio",
      "Cuando el Gobierno esté en funciones",
      "Durante los dos primeros años de una legislatura",
      "Cuando el Tribunal Constitucional tenga pendiente un recurso de inconstitucionalidad",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El art. 169 CE prohíbe iniciar la reforma constitucional en tiempo de guerra o mientras estén vigentes los estados de alarma, excepción o sitio regulados en el art. 116 CE. No hay ninguna limitación constitucional referida a un Gobierno en funciones, a los primeros años de legislatura o a recursos pendientes ante el Tribunal Constitucional.",
    mnemotecnia:
      "Ni guerra ni estados excepcionales: el art. 169 blinda la reforma constitucional frente a los mismos supuestos del art. 116 (alarma, excepción, sitio) y la guerra.",
    dificultad: 1,
  },
  {
    enunciado:
      "Además del articulado, ¿qué disposiciones incluye la Constitución Española tras el Título X, según el contenido del temario?",
    opciones: [
      "Solo una disposición final que fija su entrada en vigor",
      "Cuatro disposiciones adicionales, nueve disposiciones transitorias, una disposición derogatoria y una disposición final",
      "Diez disposiciones transitorias y dos disposiciones derogatorias",
      "Únicamente disposiciones adicionales relativas a las Comunidades Autónomas",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "Tras el articulado, la Constitución incluye cuatro disposiciones adicionales, nueve disposiciones transitorias, una disposición derogatoria y una disposición final, según recoge expresamente el contenido del tema. No se trata solo de una disposición final ni de diez transitorias.",
    mnemotecnia:
      "4-9-1-1: cuatro adicionales, nueve transitorias, una derogatoria, una final — el cierre de la Constitución tras el Título X.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué deroga expresamente la disposición derogatoria de la Constitución Española, según el contenido del temario?",
    opciones: [
      "Únicamente el Fuero de los Españoles de 1945",
      "La Ley 1/1977 para la Reforma Política y el resto de la legislación fundamental franquista anterior",
      "Los Estatutos de Autonomía aprobados antes de 1978",
      "Todas las leyes orgánicas anteriores a 1978",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "Según el contenido del tema, la disposición derogatoria de la Constitución deroga la Ley 1/1977 para la Reforma Política y el resto de la legislación fundamental franquista anterior. No se menciona la derogación de Estatutos de Autonomía ni de leyes orgánicas como categoría general.",
    mnemotecnia:
      "La derogatoria cierra el franquismo: deroga la Ley 1/1977 para la Reforma Política y la legislación fundamental anterior a la Constitución.",
    dificultad: 2,
  },
];

export const TAI_TEMA12_PREGUNTAS = [
  {
    enunciado:
      "¿Cuáles son los elementos constitutivos de un sistema de información según el contenido del tema?",
    opciones: [
      "Entrada, procesamiento, salida, almacenamiento y retroalimentación",
      "Hardware, software y firmware únicamente",
      "CPU, memoria y disco duro",
      "Usuario, red y servidor",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema define los elementos constitutivos de un sistema de información como la entrada (captura de datos), el procesamiento (transformación según reglas definidas), la salida (resultados), el almacenamiento y la retroalimentación (control sobre el propio proceso). Las otras opciones mezclan componentes de hardware, no los elementos funcionales del sistema de información.",
    mnemotecnia:
      "E-P-S-A-R: Entrada, Procesamiento, Salida, Almacenamiento y Retroalimentación, los cinco elementos de un sistema de información.",
    dificultad: 1,
  },
  {
    enunciado:
      "Sobre la representación interna de la información, ¿cuál de las siguientes afirmaciones es correcta según el temario?",
    opciones: [
      "Toda la información se representa internamente en binario, en bits agrupados en bytes de 8 bits",
      "La información se representa siempre en decimal, salvo en redes",
      "Un byte equivale siempre a 1.000 bits",
      "Las unidades de medida crecen siempre en potencias de 100",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema indica que toda la información se representa internamente en binario (bits, agrupados en bytes de 8 bits), y que las unidades de medida crecen en potencias de 1.024 (uso tradicional) o de 1.000 (Sistema Internacional estricto), de ahí la distinción entre KB y KiB. No se representa en decimal ni crecen en potencias de 100.",
    mnemotecnia:
      "8 bits = 1 byte: la unidad básica de toda representación digital, con la confusión clásica de 1.024 frente a 1.000 al subir de escala.",
    dificultad: 1,
  },
  {
    enunciado:
      "En la arquitectura de Von Neumann, ¿qué integra la CPU (unidad central de proceso)?",
    opciones: [
      "Solo la memoria principal",
      "La unidad de control y la unidad aritmético-lógica",
      "Los buses de datos, direcciones y control",
      "Los dispositivos de entrada/salida",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "Según el tema, la arquitectura de Von Neumann describe una CPU que integra la unidad de control y la unidad aritmético-lógica, junto con memoria principal (donde conviven instrucciones y datos) y dispositivos de entrada/salida, todo comunicado por buses. La memoria, los buses y los dispositivos de E/S son elementos distintos de la CPU, no parte de ella.",
    mnemotecnia:
      "CPU = control + ALU: las dos unidades que integra el 'cerebro' del ordenador según Von Neumann.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué componente de un equipo microinformático gestiona la comunicación entre CPU, memoria y periféricos?",
    opciones: [
      "La fuente de alimentación",
      "El chipset de la placa base",
      "El bus PCIe exclusivamente",
      "La memoria RAM",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El tema señala que el chipset de la placa base gestiona la comunicación entre CPU, memoria y periféricos, mientras que la placa base interconecta el resto de componentes (procesador, RAM, almacenamiento, fuente de alimentación, buses de expansión). La fuente de alimentación y la RAM no cumplen esa función de gestión de comunicación.",
    mnemotecnia:
      "El chipset es el 'director de tráfico': coordina la comunicación entre CPU, memoria y periféricos dentro de la placa base.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Cuáles son las cuatro libertades básicas que garantiza el software libre según el temario?",
    opciones: [
      "Usarlo con cualquier propósito, estudiar y modificar su código fuente, redistribuir copias y distribuir versiones modificadas",
      "Usarlo gratis, venderlo, patentarlo y cerrarlo",
      "Descargarlo, instalarlo, actualizarlo y desinstalarlo",
      "Ver el código, compilarlo, firmarlo digitalmente y certificarlo",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema define las cuatro libertades del software libre: usarlo con cualquier propósito, estudiar y modificar su código fuente, redistribuir copias, y distribuir versiones modificadas. No se trata de gratuidad comercial, ni de operaciones técnicas genéricas como instalar o actualizar.",
    mnemotecnia:
      "USAR-ESTUDIAR-REDISTRIBUIR-MODIFICAR-Y-DISTRIBUIR: las cuatro libertades clásicas que definen el software libre frente al propietario.",
    dificultad: 1,
  },
  {
    enunciado:
      "Según el temario, ¿qué diferencia principal existe entre software libre y código abierto (open source)?",
    opciones: [
      "Son términos idénticos sin ninguna diferencia",
      "El código abierto nunca publica el código fuente",
      "Comparten la publicación del código fuente, aunque con matices distintos de filosofía y condiciones de licencia",
      "El código abierto es siempre de pago y el software libre siempre gratuito",
    ],
    respuestaCorrecta: 2,
    justificacionIa:
      "El tema explica que el código abierto comparte con el software libre la publicación del código fuente, aunque con matices distintos en cuanto a filosofía y condiciones de licencia. No es correcto afirmar que sean idénticos sin matices, ni que el código abierto oculte el código fuente, ni vincular ambos conceptos al precio.",
    mnemotecnia:
      "Mismo código, distinta filosofía: software libre y open source comparten la apertura del código pero difieren en enfoque y licencia.",
    dificultad: 2,
  },
  {
    enunciado:
      "En virtualización, ¿qué caracteriza a un hipervisor de tipo 1 o 'bare metal' frente a uno de tipo 2?",
    opciones: [
      "Se ejecuta como una aplicación más sobre un sistema operativo ya instalado",
      "Se instala directamente sobre el hardware, sin sistema operativo anfitrión, y es típico en servidores",
      "Solo puede virtualizar un sistema operativo a la vez",
      "No permite clonar ni eliminar equipos virtuales",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El tema define el hipervisor de tipo 1 como aquel que se instala directamente sobre el hardware, sin sistema operativo anfitrión, típico en servidores; el de tipo 2 se ejecuta como una aplicación sobre un sistema operativo ya instalado, típico en equipos de escritorio para pruebas. Ambos tipos permiten crear, clonar y eliminar máquinas virtuales.",
    mnemotecnia:
      "Tipo 1 pisa el metal (bare metal, sin SO debajo, en servidores); tipo 2 vive sobre un SO (en escritorio, para pruebas).",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Cuáles son las ventajas de la virtualización mencionadas en el temario?",
    opciones: [
      "Mejor aprovechamiento del hardware, aislamiento entre entornos, y facilidad para crear, clonar o eliminar equipos virtuales sin tocar la máquina física",
      "Reducción del consumo eléctrico exclusivamente",
      "Eliminación total de la necesidad de copias de seguridad",
      "Sustitución completa de la necesidad de sistemas operativos",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema atribuye a la virtualización un mejor aprovechamiento del hardware, aislamiento entre entornos, y facilidad para crear, clonar o eliminar equipos virtuales sin tocar la máquina física. No se menciona una reducción específica de consumo eléctrico ni que elimine la necesidad de copias de seguridad o de sistemas operativos.",
    mnemotecnia:
      "Aprovechar + aislar + clonar fácil: las tres ventajas de virtualizar que cita el temario.",
    dificultad: 2,
  },
  {
    enunciado:
      "En computación en la nube, ¿qué modelo de servicio corresponde a IaaS según el temario?",
    opciones: [
      "El proveedor da servidores, almacenamiento y red virtualizados, y el cliente instala y gestiona su propio sistema operativo y aplicaciones",
      "El cliente usa directamente una aplicación ya completa, como el correo web",
      "El proveedor añade el sistema operativo y el entorno de ejecución, y el cliente solo despliega su aplicación",
      "El cliente gestiona íntegramente el hardware físico del proveedor",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema define IaaS (infraestructura como servicio) como el modelo en que el proveedor da servidores, almacenamiento y red virtualizados, y el cliente instala y gestiona su propio sistema operativo y aplicaciones. La opción sobre usar una aplicación completa describe SaaS, y la de añadir SO y entorno de ejecución describe PaaS.",
    mnemotecnia:
      "IaaS = solo la 'I' de infraestructura: el proveedor pone hardware virtual, tú pones el resto (SO y apps).",
    dificultad: 2,
  },
  {
    enunciado:
      "¿En qué se diferencian PaaS y SaaS según el temario?",
    opciones: [
      "En PaaS el proveedor añade el sistema operativo y el entorno de ejecución y el cliente solo despliega su aplicación; en SaaS el cliente usa directamente una aplicación ya completa",
      "PaaS y SaaS son exactamente el mismo modelo con distinto nombre",
      "En SaaS el cliente gestiona el sistema operativo y en PaaS no existe sistema operativo alguno",
      "PaaS es exclusivo de servidores físicos y SaaS de servidores virtuales",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema distingue PaaS (el proveedor añade además el sistema operativo y el entorno de ejecución, y el cliente solo despliega su aplicación) de SaaS (el cliente usa directamente una aplicación ya completa, como el correo web). No son el mismo modelo, y la gestión del sistema operativo no se describe como se plantea en las otras opciones.",
    mnemotecnia:
      "PaaS despliegas tu app sobre una plataforma lista; SaaS ni siquiera despliegas, solo usas la aplicación final.",
    dificultad: 2,
  },
];

export const TAI_TEMA13_PREGUNTAS = [
  {
    enunciado:
      "¿Cuáles son los elementos principales de un sistema operativo según el temario?",
    opciones: [
      "El núcleo o kernel, el sistema de archivos y la interfaz de usuario",
      "La CPU, la RAM y el disco duro",
      "El navegador, el correo y el procesador de textos",
      "El BIOS, la placa base y el chipset",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema define los elementos principales de un sistema operativo como el núcleo o kernel (gestión de procesos, memoria y dispositivos), el sistema de archivos (organización del almacenamiento) y la interfaz de usuario (línea de comandos o gráfica). Las demás opciones corresponden a hardware o aplicaciones, no a elementos del sistema operativo.",
    mnemotecnia:
      "Kernel + archivos + interfaz: los tres pilares de cualquier sistema operativo.",
    dificultad: 1,
  },
  {
    enunciado:
      "En Windows, ¿qué elemento centraliza la configuración del sistema y las aplicaciones instaladas según el temario?",
    opciones: [
      "El Registro de Windows",
      "El sistema de archivos jerárquico único",
      "El gestor de paquetes",
      "El entorno de escritorio",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema indica que el registro de Windows centraliza la configuración del sistema y de las aplicaciones instaladas. El sistema de archivos jerárquico único desde la raíz '/' es característico de Unix/Linux, y el gestor de paquetes y el entorno de escritorio se asocian a las distribuciones Linux, no a Windows.",
    mnemotecnia:
      "Windows = Registro: la base de datos de configuración central de todo Windows.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué principio, característico de Unix, resume la idea de que los dispositivos también se tratan como ficheros?",
    opciones: [
      "El principio de 'todo es un fichero'",
      "El principio de sandboxing",
      "El principio de tipado dinámico",
      "El principio de virtualización total",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema atribuye a Unix el principio de que 'todo es un fichero' (incluidos los dispositivos), junto con el sistema de archivos jerárquico único desde la raíz '/' y los permisos de lectura/escritura/ejecución por usuario-grupo-otros. El sandboxing es propio de los sistemas móviles, no de este principio de Unix.",
    mnemotecnia:
      "En Unix, todo (hasta un disco) es un fichero: el principio unificador que hereda Linux.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué relación existe entre Linux y las distribuciones como Ubuntu, Red Hat o Debian según el temario?",
    opciones: [
      "Linux es un núcleo de tipo Unix, de código abierto, sobre el que se construyen esas distribuciones, que añaden gestores de paquetes y entornos de escritorio",
      "Ubuntu, Red Hat y Debian son núcleos distintos, sin relación con Linux",
      "Linux es propietario de Microsoft y las distribuciones son versiones piratas",
      "Las distribuciones son simplemente temas visuales distintos del mismo núcleo sin ningún añadido funcional",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema explica que Linux es un núcleo de tipo Unix, de código abierto, sobre el que se construyen distribuciones (Ubuntu, Red Hat, Debian) que añaden gestores de paquetes y entornos de escritorio. Linux no es propietario de Microsoft, y las distribuciones no son solo temas visuales, sino que añaden funcionalidad real.",
    mnemotecnia:
      "Linux es el núcleo, las distros son el 'traje completo': gestor de paquetes + entorno de escritorio añadidos al mismo núcleo.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué característica comparten Android e iOS en la gestión de aplicaciones, según el temario?",
    opciones: [
      "Un modelo de aplicaciones en espacios aislados (sandboxing) con permisos concedidos explícitamente por la persona usuaria",
      "Ambos comparten exactamente el mismo núcleo",
      "Ninguno de los dos gestiona permisos de aplicaciones",
      "Ambos permiten a las aplicaciones acceder a todos los recursos del sistema sin restricción",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema señala que Android (basado en el núcleo Linux) e iOS son los sistemas dominantes en móviles y ambos aplican un modelo de sandboxing con permisos concedidos explícitamente, además de una gestión de energía más agresiva que en sistemas de escritorio. No comparten núcleo (Android usa Linux, iOS no) ni dan acceso sin restricción.",
    mnemotecnia:
      "Sandboxing + permisos explícitos: la seña de identidad de seguridad compartida por Android e iOS.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Cuáles son los posibles estados de un proceso según el temario?",
    opciones: [
      "En ejecución, listo (esperando turno de CPU) o bloqueado (esperando un recurso)",
      "Instalado, desinstalado o en pausa",
      "Comprimido, descomprimido o cifrado",
      "Público, privado o compartido",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema describe los estados de un proceso como en ejecución, listo (esperando turno de CPU) o bloqueado (esperando un recurso, como una operación de entrada/salida). Las demás opciones no corresponden a estados de un proceso en el sistema operativo.",
    mnemotecnia:
      "Ejecuta, espera turno o espera recurso: los tres estados básicos de un proceso.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué es un hilo o thread según el temario?",
    opciones: [
      "Una unidad de ejecución más ligera dentro de un mismo proceso, que comparte memoria con los demás hilos del proceso pero puede ejecutarse de forma independiente",
      "Un proceso completo con su propio espacio de memoria exclusivo",
      "Un dispositivo físico de entrada/salida",
      "Un fichero de configuración del planificador",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema define el hilo o thread como una unidad de ejecución más ligera dentro de un mismo proceso, que comparte memoria con los demás hilos del proceso pero puede ejecutarse de forma independiente. Un proceso, en cambio, tiene su propio espacio de memoria y estado propios.",
    mnemotecnia:
      "El hilo es 'ligero' porque comparte memoria con sus hermanos del mismo proceso, a diferencia de un proceso completo.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué función cumple la memoria virtual y el swap según el temario?",
    opciones: [
      "Permitir que cada proceso trabaje como si tuviera un espacio de memoria propio y continuo, traduciendo direcciones virtuales a físicas y llevando a disco (swap) las partes de memoria menos usadas",
      "Duplicar físicamente la RAM instalada sin ningún coste de rendimiento",
      "Eliminar por completo la necesidad de RAM física",
      "Cifrar automáticamente todos los datos en memoria",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema explica que la memoria virtual permite a cada proceso trabajar como si dispusiera de un espacio de memoria propio y continuo, traduciendo direcciones virtuales a físicas mediante tablas de páginas, y que el sistema puede llevar temporalmente a disco (swap) las partes de memoria menos usadas, a costa de posible pérdida de rendimiento si se recurre al swap con demasiada frecuencia.",
    mnemotecnia:
      "Memoria virtual = ilusión + swap: cada proceso 'cree' tener su memoria propia, y lo menos usado se aparca en disco.",
    dificultad: 3,
  },
  {
    enunciado:
      "¿Qué diferencia principal existe entre un contenedor y una máquina virtual según el temario?",
    opciones: [
      "El contenedor comparte el núcleo del sistema operativo anfitrión, mientras que la máquina virtual incluye un sistema operativo completo propio",
      "La máquina virtual siempre es más ligera y rápida de arrancar que un contenedor",
      "Un contenedor requiere siempre un hipervisor de tipo 1",
      "No hay ninguna diferencia relevante entre ambos conceptos",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema señala que un contenedor empaqueta una aplicación junto con sus dependencias, pero compartiendo el núcleo del sistema operativo anfitrión, a diferencia de una máquina virtual, que incluye un sistema operativo completo propio; esto hace a los contenedores más ligeros y rápidos de arrancar, aunque con un aislamiento algo menor. La afirmación de que la VM es más ligera es, por tanto, incorrecta.",
    mnemotecnia:
      "Contenedor comparte núcleo (ligero); VM lleva su propio SO completo (más pesado pero más aislado).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el temario, ¿qué papel desempeñan Docker y Kubernetes?",
    opciones: [
      "Docker es la herramienta de contenedores más extendida y Kubernetes el sistema más habitual para orquestar grandes conjuntos de contenedores en producción",
      "Docker es un sistema operativo y Kubernetes un lenguaje de programación",
      "Kubernetes sustituye por completo a los hipervisores de tipo 1",
      "Docker gestiona exclusivamente máquinas virtuales, no contenedores",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema afirma explícitamente que Docker es la herramienta de contenedores más extendida y Kubernetes el sistema más habitual para orquestar (desplegar, escalar y gestionar) grandes conjuntos de contenedores en producción. Ni Docker es un sistema operativo ni Kubernetes sustituye a los hipervisores.",
    mnemotecnia:
      "Docker crea contenedores, Kubernetes los orquesta a gran escala.",
    dificultad: 1,
  },
];

export const TAI_TEMA14_PREGUNTAS = [
  {
    enunciado:
      "¿Qué diferencia a un lenguaje de tipado estático de uno de tipado dinámico según el temario?",
    opciones: [
      "El de tipado estático (como Java o C) exige declarar el tipo de cada variable en tiempo de compilación; el de tipado dinámico (como Python o JavaScript) lo infiere en tiempo de ejecución",
      "El de tipado dinámico siempre es más rápido en ejecución que el estático",
      "El de tipado estático no admite variables numéricas",
      "Ambos tipos de tipado son idénticos en la práctica",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema explica que los lenguajes con tipado estático (Java, C) exigen declarar el tipo de cada variable en tiempo de compilación, mientras que los de tipado dinámico (Python, JavaScript) lo infieren en tiempo de ejecución. No se afirma que el dinámico sea siempre más rápido, ni que el estático excluya tipos numéricos.",
    mnemotecnia:
      "Estático declara antes (compilar), dinámico infiere después (ejecutar).",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué es una función recursiva según el temario?",
    opciones: [
      "Una función que se llama a sí misma para resolver un problema dividiéndolo en subproblemas más pequeños del mismo tipo, hasta llegar a un caso base",
      "Una función que solo puede ejecutarse una vez",
      "Una función que nunca puede recibir parámetros",
      "Una función exclusiva de los lenguajes de tipado dinámico",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema define la recursividad como el mecanismo por el que una función se llama a sí misma para resolver un problema dividiéndolo en subproblemas más pequeños del mismo tipo, hasta llegar a un caso base que se resuelve sin más llamadas, siendo una alternativa a los bucles. No hay restricción de que solo se ejecute una vez ni que sea exclusiva de un tipo de tipado.",
    mnemotecnia:
      "Recursión = llamarse a uno mismo hasta el caso base: la clave para no acabar en un bucle infinito.",
    dificultad: 1,
  },
  {
    enunciado:
      "Según el temario, ¿en qué se diferencian un vector (array) y un registro (struct)?",
    opciones: [
      "El vector almacena elementos del mismo tipo accesibles por índice; el registro agrupa campos de distinto tipo bajo un mismo nombre",
      "El vector solo admite un elemento y el registro admite varios",
      "El registro siempre es más rápido de recorrer que un vector",
      "Ambos son términos sinónimos sin diferencia práctica",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema describe los vectores (arrays) como colecciones de elementos del mismo tipo accesibles por índice, y los registros (structs o similares) como agrupaciones de campos de distinto tipo bajo un mismo nombre. No son sinónimos ni se afirma nada sobre velocidad relativa de recorrido.",
    mnemotecnia:
      "Vector: mismo tipo, por índice. Registro: distinto tipo, por nombre de campo.",
    dificultad: 2,
  },
  {
    enunciado:
      "En programación orientada a objetos, ¿qué es el polimorfismo según el temario?",
    opciones: [
      "Que un mismo método se comporte de forma distinta según el objeto que lo invoca",
      "Ocultar los detalles internos de un objeto",
      "Que una clase reutilice y extienda el comportamiento de otra",
      "Que una función se llame a sí misma repetidamente",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema define el polimorfismo como que un mismo método se comporte de forma distinta según el objeto que lo invoca. Ocultar los detalles internos corresponde al encapsulamiento, reutilizar y extender comportamiento de otra clase corresponde a la herencia, y llamarse a sí misma repetidamente es recursividad.",
    mnemotecnia:
      "Poli-morfismo: 'muchas formas' para un mismo método, según qué objeto lo use.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué característica define a la programación funcional según el temario?",
    opciones: [
      "Trata la computación como la evaluación de funciones matemáticas, evitando el estado mutable y los efectos secundarios",
      "Organiza el programa exclusivamente en secuencias, condicionales y bucles",
      "Modela el problema como objetos con atributos y métodos",
      "Exige siempre compilar el código antes de ejecutarlo",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema describe la programación funcional como aquella que trata la computación como la evaluación de funciones matemáticas, evitando el estado mutable y los efectos secundarios. Organizar el programa en secuencias, condicionales y bucles es propio de la programación estructurada, y modelar el problema como objetos es propio de la POO.",
    mnemotecnia:
      "Funcional = sin efectos secundarios, como una función matemática pura.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué diferencia principal existe entre un compilador y un intérprete según el temario?",
    opciones: [
      "El compilador traduce el código fuente completo a código máquina antes de ejecutarlo, generando un ejecutable independiente; el intérprete traduce y ejecuta el código línea a línea en el momento",
      "El intérprete siempre genera un ejecutable independiente",
      "El compilador nunca requiere recompilar tras un cambio en el código",
      "Ambos generan exactamente el mismo tipo de archivo de salida",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema explica que un compilador traduce el código fuente completo antes de ejecutarlo, generando un ejecutable independiente (típico de C o C++), mientras que un intérprete traduce y ejecuta el código línea a línea en el momento, sin generar un ejecutable previo (típico de Python o JavaScript en su forma más básica). El compilador sí exige recompilar tras cualquier cambio.",
    mnemotecnia:
      "Compilador traduce todo antes; intérprete traduce sobre la marcha, línea a línea.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué enfoque intermedio usan lenguajes como Java o C# según el temario?",
    opciones: [
      "Compilan a un código intermedio (bytecode) que después ejecuta o compila en el momento una máquina virtual específica del lenguaje",
      "No se compilan ni se interpretan en ningún momento",
      "Se ejecutan directamente como código máquina sin ninguna traducción previa",
      "Requieren siempre un hipervisor de tipo 1 para funcionar",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema indica que Java y C# usan un enfoque intermedio: compilan a un código intermedio (bytecode) que después ejecuta o compila en el momento una máquina virtual específica del lenguaje. No es cierto que carezcan de compilación/interpretación, ni que se ejecuten como código máquina directo, ni que dependan de un hipervisor.",
    mnemotecnia:
      "Bytecode + máquina virtual del lenguaje: el punto medio entre compilar del todo e interpretar del todo.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué orden de acceso sigue una pila (stack) según el temario?",
    opciones: [
      "LIFO: último en entrar, primero en salir",
      "FIFO: primero en entrar, primero en salir",
      "Acceso aleatorio sin orden definido",
      "Orden alfabético de los elementos",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema define la pila (stack) como una estructura que sigue el orden LIFO ('último en entrar, primero en salir'), típica en la gestión de llamadas a funciones. El orden FIFO corresponde a la cola (queue), no a la pila.",
    mnemotecnia:
      "Pila = LIFO, como un montón de platos: el último que pones es el primero que quitas.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿En qué se diferencia una cola (queue) de una pila (stack) según el temario?",
    opciones: [
      "La cola sigue el orden FIFO (primero en entrar, primero en salir), típica en la gestión de tareas pendientes; la pila sigue el orden LIFO",
      "La cola y la pila siguen exactamente el mismo orden de acceso",
      "La cola solo puede contener números y la pila solo texto",
      "La pila se usa exclusivamente en bases de datos y la cola en redes",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema contrapone la cola (FIFO: primero en entrar, primero en salir, típica en la gestión de tareas pendientes o peticiones en espera) con la pila (LIFO, típica en la gestión de llamadas a funciones). No siguen el mismo orden, y no hay restricción de tipo de datos ni de ámbito de uso como se plantea en las otras opciones.",
    mnemotecnia:
      "Cola = FIFO, como una fila del supermercado: el primero que llega es el primero que sale.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué ventaja e inconveniente tiene una lista enlazada frente a un array según el temario?",
    opciones: [
      "Tiene inserciones y borrados más ágiles, pero un acceso secuencial más lento que el array",
      "Tiene siempre acceso directo por índice, igual que el array",
      "Ocupa siempre menos memoria que cualquier array del mismo tamaño",
      "No permite añadir ni eliminar elementos una vez creada",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema indica que la lista enlazada encadena elementos mediante punteros o referencias, con inserciones y borrados más ágiles que en un array, pero con un acceso secuencial más lento; el array, en cambio, almacena elementos en posiciones consecutivas accesibles directamente por índice. La lista enlazada no tiene acceso directo por índice como el array.",
    mnemotecnia:
      "Lista enlazada: fácil insertar/borrar, difícil acceder rápido; array: al revés.",
    dificultad: 2,
  },
];

export const TAI_TEMA15_PREGUNTAS = [
  {
    enunciado:
      "¿Qué diferencia al front-end del back-end en una aplicación web según el temario?",
    opciones: [
      "El front-end se ejecuta en el navegador de la persona usuaria (interfaz, interacción); el back-end procesa la lógica de negocio y el acceso a datos, devolviendo respuestas al navegador",
      "El front-end procesa la base de datos y el back-end la interfaz gráfica",
      "Ambos términos designan exactamente lo mismo",
      "El front-end solo existe en aplicaciones móviles, no en web",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema define el front-end como la parte de la aplicación web que se ejecuta en el navegador (interfaz, interacción) y el back-end como el que procesa la lógica de negocio y el acceso a datos, devolviendo respuestas al navegador; ambos se comunican típicamente mediante peticiones HTTP a una API. No son lo mismo ni el front-end es exclusivo de móvil.",
    mnemotecnia:
      "Front-end = lo que ve el navegador; back-end = lo que procesa el servidor.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué es HTML según el temario?",
    opciones: [
      "Un lenguaje que estructura el contenido de una página web mediante etiquetas (elementos) anidadas: encabezados, párrafos, enlaces, imágenes, formularios",
      "Un metalenguaje de marcado general para intercambiar datos estructurados entre sistemas",
      "Un lenguaje de programación compilado para el servidor",
      "Un protocolo de red equivalente a TCP",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema define HTML (HyperText Markup Language) como el lenguaje que estructura el contenido de una página web mediante etiquetas anidadas (encabezados, párrafos, enlaces, imágenes, formularios). El metalenguaje de marcado general para intercambiar datos estructurados es XML, no HTML.",
    mnemotecnia:
      "HTML estructura la página; XML estructura datos entre sistemas.",
    dificultad: 1,
  },
  {
    enunciado:
      "Según el temario, ¿qué fue XHTML?",
    opciones: [
      "Un intento de reformular HTML siguiendo las reglas estrictas de XML",
      "Un lenguaje de programación para el back-end",
      "Un protocolo de transporte de red",
      "Una base de datos NoSQL orientada a documentos",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema describe XHTML como un intento de reformular HTML siguiendo las reglas estrictas de XML. No se trata de un lenguaje de programación de servidor, ni de un protocolo de red, ni de una base de datos.",
    mnemotecnia:
      "XHTML = HTML con la disciplina estricta de XML.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué interpreta el navegador para renderizar una página web según el temario?",
    opciones: [
      "HTML (estructura), CSS (presentación) y JavaScript (comportamiento/interactividad)",
      "Solo HTML, sin ningún otro lenguaje",
      "Únicamente código máquina compilado",
      "Exclusivamente ficheros XML sin etiquetas HTML",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema indica que el navegador interpreta HTML (estructura), CSS (presentación) y JavaScript (comportamiento/interactividad) para renderizar la página, mientras que en el lado servidor se usan lenguajes como PHP, Python, Java o Node.js. No se limita solo a HTML ni a código máquina compilado.",
    mnemotecnia:
      "HTML+CSS+JS: estructura, estilo y comportamiento, el trío que interpreta el navegador.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué caracteriza a un lenguaje de script según el temario?",
    opciones: [
      "Se ejecuta de forma interpretada, sin compilación previa a código máquina, y suele emplearse para automatizar tareas o añadir comportamiento dinámico",
      "Siempre requiere compilación previa a código máquina",
      "Solo puede ejecutarse dentro del navegador",
      "No puede usarse para administración de sistemas",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema define el lenguaje de script como aquel que se ejecuta de forma interpretada, sin compilación previa a código máquina, empleado para automatizar tareas o añadir comportamiento dinámico, citando como ejemplos JavaScript (navegador y Node.js), Python o los scripts de shell (Bash, PowerShell) en administración de sistemas. No requiere compilación previa ni se limita al navegador.",
    mnemotecnia:
      "Script = interpretado y para automatizar, no solo cosa de navegador (Bash y PowerShell también son scripts).",
    dificultad: 2,
  },
  {
    enunciado:
      "En el estilo REST, ¿qué verbo HTTP se usa para consultar un recurso según el temario?",
    opciones: [
      "GET",
      "POST",
      "DELETE",
      "PUT",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema indica que el estilo REST usa los verbos HTTP GET para consultar, POST para crear, PUT/PATCH para modificar y DELETE para eliminar, sobre URLs que identifican recursos, intercambiando datos habitualmente en formato JSON. POST, DELETE y PUT corresponden a crear, eliminar y modificar, respectivamente, no a consultar.",
    mnemotecnia:
      "GET consulta, POST crea, PUT/PATCH modifica, DELETE elimina: los cuatro verbos REST básicos.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué propiedades ACID garantiza una base de datos relacional según el temario?",
    opciones: [
      "Atomicidad, consistencia, aislamiento y durabilidad",
      "Autenticación, confidencialidad, integridad y disponibilidad",
      "Acceso, cifrado, indexado y disponibilidad",
      "Agregación, consulta, inserción y borrado",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema explica que una base de datos relacional, consultada con SQL, garantiza las propiedades ACID (atomicidad, consistencia, aislamiento y durabilidad), que aseguran la fiabilidad de las transacciones, algo especialmente relevante en sistemas de la Administración. Las otras opciones confunden ACID con otras siglas de seguridad o con operaciones básicas de bases de datos.",
    mnemotecnia:
      "ACID: Atomicidad, Consistencia, Aislamiento, Durabilidad — las garantías de una transacción relacional.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Cómo puede organizar los datos una base de datos no relacional (NoSQL) según el temario?",
    opciones: [
      "Como documentos (JSON), pares clave-valor, grafos o columnas anchas",
      "Exclusivamente en tablas con filas y columnas relacionadas por claves",
      "Únicamente en ficheros de texto plano sin ninguna estructura",
      "Solo como hojas de cálculo",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema indica que una base de datos NoSQL prescinde del esquema rígido de tablas para ganar flexibilidad y escalabilidad horizontal, organizando los datos como documentos (JSON), pares clave-valor, grafos o columnas anchas, según el caso de uso, a costa habitualmente de garantías transaccionales más débiles que una base relacional. La organización en tablas con filas y columnas es propia del modelo relacional, no del NoSQL.",
    mnemotecnia:
      "NoSQL: documentos, clave-valor, grafos o columnas anchas — flexibilidad frente al esquema rígido de tablas.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿En qué consiste la inyección SQL como vulnerabilidad web según el temario?",
    opciones: [
      "Insertar código malicioso en un campo de entrada mal validado para manipular una consulta a la base de datos",
      "Inyectar scripts que se ejecutan en el navegador de otras personas usuarias al visitar la página",
      "Permitir a una persona usuaria autenticada acceder a recursos que no le corresponden",
      "Cifrar las comunicaciones sin usar HTTPS",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema define la inyección SQL como insertar código malicioso en un campo de entrada mal validado para manipular una consulta a la base de datos. Inyectar scripts que se ejecutan en el navegador de otras personas usuarias describe el Cross-Site Scripting (XSS), y permitir acceso a recursos indebidos describe la falta de control de acceso, ambas vulnerabilidades distintas mencionadas en el mismo bloque.",
    mnemotecnia:
      "Inyección SQL ataca la base de datos; XSS ataca el navegador de otros usuarios.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Cuáles son las medidas básicas de defensa frente a vulnerabilidades web citadas en el temario?",
    opciones: [
      "Validar y depurar toda entrada de datos, usar consultas parametrizadas, cifrar las comunicaciones con HTTPS y mantener actualizadas las dependencias del proyecto",
      "Desactivar por completo la validación de entradas para mejorar el rendimiento",
      "Usar siempre SQL concatenado con texto de entrada del usuario",
      "Evitar el uso de HTTPS para reducir la carga del servidor",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema enumera como medidas básicas de defensa validar y depurar toda entrada de datos, usar consultas parametrizadas en vez de construir SQL a partir de texto concatenado, cifrar las comunicaciones con HTTPS y mantener actualizadas las dependencias del proyecto. Las demás opciones describen justo las malas prácticas que el tema advierte evitar.",
    mnemotecnia:
      "Validar + parametrizar + HTTPS + actualizar: las cuatro defensas básicas frente a inyección SQL y XSS.",
    dificultad: 2,
  },
];

export const TAI_TEMA16_PREGUNTAS = [
  {
    enunciado:
      "¿Qué diferencia a la seguridad física de la seguridad lógica según el temario?",
    opciones: [
      "La física protege los equipos y el acceso a ellos; la lógica protege la información y los sistemas mediante mecanismos software como autenticación, cifrado y control de acceso",
      "Ambas designan exactamente el mismo concepto",
      "La seguridad lógica solo se aplica a los CPD",
      "La seguridad física se ocupa exclusivamente del cifrado de datos",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema distingue la seguridad física (protege los equipos y el acceso a ellos: control de acceso a un CPD, protección ante incendios o cortes de suministro) de la seguridad lógica (protege la información y los sistemas mediante mecanismos software: autenticación, cifrado, control de acceso a ficheros y aplicaciones). No son el mismo concepto, y el cifrado corresponde a la seguridad lógica, no a la física.",
    mnemotecnia:
      "Física protege el edificio; lógica protege los datos y el software.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Cómo distingue el temario entre vulnerabilidad y amenaza?",
    opciones: [
      "La vulnerabilidad es una debilidad de un sistema que puede ser explotada; la amenaza es cualquier circunstancia con potencial de causar daño aprovechando esa vulnerabilidad",
      "Son términos exactamente equivalentes",
      "La amenaza es siempre interna y la vulnerabilidad siempre externa",
      "La vulnerabilidad solo existe en el hardware, nunca en el software",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema define la vulnerabilidad como una debilidad de un sistema que puede ser explotada, y la amenaza como cualquier circunstancia con potencial de causar daño aprovechando esa vulnerabilidad, citando como amenazas comunes el malware, la ingeniería social (phishing), los ataques de denegación de servicio y la explotación de software desactualizado o mal configurado.",
    mnemotecnia:
      "Vulnerabilidad = la grieta; amenaza = quien puede colarse por ella.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué diferencia existe entre cifrado simétrico y asimétrico según el temario?",
    opciones: [
      "El simétrico usa la misma clave para cifrar y descifrar; el asimétrico usa un par de claves pública/privada, más lento pero resuelve el problema del intercambio de claves",
      "El asimétrico usa siempre la misma clave para cifrar y descifrar",
      "El simétrico es siempre más lento que el asimétrico",
      "Ambos requieren obligatoriamente el mismo número de claves",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema explica que el cifrado simétrico usa la misma clave para cifrar y descifrar (rápido, pero requiere compartir la clave de forma segura), mientras que el asimétrico usa un par de claves pública/privada (la pública cifra, solo la privada correspondiente descifra), más lento pero resuelve el problema del intercambio de claves.",
    mnemotecnia:
      "Simétrico: una clave, rápido. Asimétrico: dos claves (pública/privada), más lento pero sin problema de reparto.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Cómo combina el protocolo TLS el cifrado simétrico y asimétrico según el temario?",
    opciones: [
      "Usa cifrado asimétrico para el intercambio inicial de claves y cifrado simétrico para el resto de la comunicación por rendimiento",
      "Usa únicamente cifrado simétrico en todo el proceso",
      "Usa únicamente cifrado asimétrico en todo el proceso",
      "No usa ningún tipo de cifrado, solo firma digital",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema indica que protocolos como TLS (que da la 'S' a HTTPS) combinan cifrado asimétrico para el intercambio inicial de claves y simétrico para el resto de la comunicación por rendimiento. No usa un solo tipo de cifrado en exclusiva ni sustituye el cifrado por la firma digital.",
    mnemotecnia:
      "TLS empieza asimétrico (intercambio) y sigue simétrico (rendimiento).",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué garantiza la firma digital según el temario?",
    opciones: [
      "Autenticidad e integridad del documento firmado, usando la clave privada de quien firma para generar un sello verificable con su clave pública",
      "La confidencialidad total del contenido del documento frente a cualquier lector",
      "Que el documento nunca pueda modificarse aunque no se detecte la modificación",
      "La disponibilidad permanente del documento en cualquier servidor",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema define la firma digital como el uso de la clave privada de quien firma para generar un sello verificable con su clave pública, garantizando autenticidad e integridad del documento firmado. No garantiza confidencialidad del contenido ni disponibilidad del documento; esas son propiedades distintas de la seguridad de la información.",
    mnemotecnia:
      "Firma digital = privada firma, pública verifica: autenticidad + integridad.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué requiere la infraestructura de un centro de proceso de datos (CPD) según el temario?",
    opciones: [
      "Climatización adecuada, sistemas de alimentación ininterrumpida (SAI), extinción de incendios específica para equipos electrónicos y sistemas de gestión de incidencias",
      "Únicamente una conexión a Internet de alta velocidad",
      "Solo cámaras de videovigilancia, sin ningún otro requisito",
      "Exclusivamente un sistema de cifrado simétrico instalado",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema enumera como requisitos de un CPD la climatización adecuada, los sistemas de alimentación ininterrumpida (SAI), la extinción de incendios específica para equipos electrónicos y los sistemas de gestión de incidencias que registren y escalen cualquier anomalía detectada. No se limita a conectividad, videovigilancia o cifrado.",
    mnemotecnia:
      "Un CPD necesita frío (climatización), luz constante (SAI), fuego controlado (extinción) e incidencias registradas.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué es la autenticación multifactor (MFA) según el temario?",
    opciones: [
      "La combinación de al menos dos factores de autenticación: algo que se sabe, algo que se tiene o algo que se es",
      "El uso exclusivo de una contraseña muy larga",
      "Un sistema que elimina por completo la necesidad de contraseñas",
      "Un tipo de cifrado asimétrico específico",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema define la autenticación multifactor (MFA) como la combinación de al menos dos de los tres factores: algo que se sabe (una contraseña), algo que se tiene (un token o el móvil) o algo que se es (biometría), reduciendo drásticamente el riesgo de que una contraseña filtrada sea suficiente para acceder a una cuenta.",
    mnemotecnia:
      "MFA = saber + tener + ser, combinando al menos dos de los tres factores.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Cómo deben almacenarse las contraseñas en un sistema bien diseñado según el temario?",
    opciones: [
      "Nunca en texto plano; se guarda un resumen o hash irreversible, de modo que ni el propio sistema puede recuperar la contraseña original",
      "Siempre en texto plano para facilitar su recuperación",
      "Cifradas con la misma clave que el resto de la base de datos",
      "En un fichero de configuración accesible por cualquier usuario del sistema",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema afirma que las contraseñas nunca deben almacenarse en texto plano: los sistemas bien diseñados guardan un resumen o hash (transformación irreversible), de modo que ni siquiera el propio sistema puede recuperar la contraseña original a partir de lo almacenado. Guardarlas en texto plano o accesibles a cualquier usuario contradice justamente esta buena práctica.",
    mnemotecnia:
      "Hash = sin vuelta atrás: ni el sistema puede 'deshacer' el hash para ver la contraseña original.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué regla básica de copias de seguridad describe el temario?",
    opciones: [
      "Mantener al menos tres copias, en dos soportes distintos, con una de ellas fuera de las instalaciones principales",
      "Una única copia completa basta si se guarda en el mismo servidor",
      "Las copias incrementales sustituyen siempre por completo a las copias completas",
      "No es necesario guardar ninguna copia fuera de las instalaciones",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema describe la estrategia habitual de combinar copias completas con incrementales, siguiendo la regla básica de mantener al menos tres copias, en dos soportes distintos, con una de ellas fuera de las instalaciones principales. Una sola copia en el mismo servidor no cumple esa regla, y las incrementales complementan, no sustituyen, a las completas.",
    mnemotecnia:
      "Regla 3-2-1: 3 copias, 2 soportes, 1 fuera de las instalaciones.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué es el Esquema Nacional de Seguridad (ENS) según el temario?",
    opciones: [
      "El marco normativo que fija los principios básicos y requisitos mínimos de seguridad de los sistemas de información de las Administraciones Públicas españolas, clasificando los sistemas en categorías básica, media y alta",
      "Un producto comercial de cifrado desarrollado por una empresa privada",
      "Un protocolo de red equivalente a TLS",
      "Una certificación exclusiva para empresas de telecomunicaciones",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema define el ENS como el marco normativo que fija los principios básicos y requisitos mínimos de seguridad de los sistemas de información de las Administraciones Públicas españolas, clasificando los sistemas en tres categorías (básica, media y alta) según el impacto de un incidente, y cita al CCN-CERT, dependiente del Centro Criptológico Nacional, como organismo de referencia para la respuesta a incidentes en el sector público español.",
    mnemotecnia:
      "ENS = básica/media/alta según impacto, con el CCN-CERT como referencia de respuesta a incidentes.",
    dificultad: 2,
  },
];

export const TAI_TEMA17_PREGUNTAS = [
  {
    enunciado:
      "¿En cuántas capas divide el modelo OSI la comunicación en redes según el temario?",
    opciones: [
      "4 capas",
      "7 capas: física, enlace, red, transporte, sesión, presentación y aplicación",
      "5 capas",
      "3 capas",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El tema indica que el modelo OSI de ISO divide la comunicación en redes en 7 capas: física, enlace, red, transporte, sesión, presentación y aplicación. El modelo de 4 capas es el TCP/IP, no el OSI.",
    mnemotecnia:
      "OSI tiene 7 capas: Física-Enlace-Red-Transporte-Sesión-Presentación-Aplicación (de abajo a arriba).",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Cómo simplifica el modelo TCP/IP el esquema de capas OSI según el temario?",
    opciones: [
      "En 4 capas: acceso a red, internet, transporte y aplicación",
      "Manteniendo exactamente las mismas 7 capas que OSI",
      "En 2 capas: física y aplicación",
      "En 8 capas, añadiendo una capa adicional a OSI",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema explica que el modelo TCP/IP, base real de Internet, simplifica el esquema OSI en 4 capas: acceso a red (física+enlace), internet (red, protocolo IP), transporte (TCP/UDP) y aplicación (sesión+presentación+aplicación de OSI), siendo el modelo que efectivamente implementan los sistemas operativos y dispositivos de red actuales.",
    mnemotecnia:
      "TCP/IP = 4 capas que agrupan las 7 de OSI: acceso a red, internet, transporte, aplicación.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué caracteriza al protocolo TCP frente a UDP según el temario?",
    opciones: [
      "TCP es orientado a conexión y garantiza entrega ordenada y sin pérdidas mediante confirmaciones y retransmisiones, a costa de más sobrecarga",
      "TCP no garantiza entrega ni orden, pero es más ligero y rápido",
      "TCP y UDP son exactamente el mismo protocolo con distinto nombre",
      "TCP se usa exclusivamente para streaming y videollamadas",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema describe TCP como orientado a conexión, que garantiza entrega ordenada y sin pérdidas mediante confirmaciones y retransmisiones (adecuado para navegación web o correo), a costa de más sobrecarga. Las características de no garantizar entrega ni orden pero ser más ligero corresponden a UDP, típico de streaming o videollamadas, no a TCP.",
    mnemotecnia:
      "TCP confirma y reenvía (fiable, con sobrecarga); UDP no confirma (ligero, para streaming).",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Por qué se prefiere UDP frente a TCP en streaming o videollamadas según el temario?",
    opciones: [
      "Porque es más ligero y rápido, y perder algún paquete es preferible a introducir retrasos",
      "Porque UDP garantiza entrega ordenada y sin pérdidas",
      "Porque UDP requiere más sobrecarga que TCP",
      "Porque UDP es el único protocolo orientado a conexión",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema explica que UDP (User Datagram Protocol) no garantiza entrega ni orden, pero es más ligero y rápido, siendo adecuado para streaming o videollamadas, donde perder algún paquete es preferible a introducir retrasos. Es TCP, no UDP, el protocolo orientado a conexión que garantiza entrega ordenada.",
    mnemotecnia:
      "En streaming, mejor perder un paquete que llegar tarde: por eso UDP gana a TCP ahí.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Cuántos bits usa una dirección IPv4 y cuántos una dirección IPv6 según el temario?",
    opciones: [
      "IPv4 usa 32 bits e IPv6 usa 128 bits",
      "IPv4 usa 128 bits e IPv6 usa 32 bits",
      "Ambas usan 64 bits",
      "IPv4 usa 16 bits e IPv6 usa 32 bits",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema indica que IPv4 usa 32 bits (formato decimal con puntos, ej. 192.168.1.1, con un espacio de direcciones ya agotado a nivel global) e IPv6 usa 128 bits para resolver ese agotamiento. La relación inversa u otras cifras no corresponden a lo indicado en el tema.",
    mnemotecnia:
      "32 bits IPv4, 128 bits IPv6: cuatro veces más bits para resolver el agotamiento de direcciones.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué determina la máscara de subred según el temario?",
    opciones: [
      "Qué parte de la dirección IP identifica la red y cuál identifica el equipo dentro de ella",
      "El protocolo de transporte que debe usarse (TCP o UDP)",
      "El número de capas del modelo OSI que se van a usar",
      "La velocidad máxima de transmisión de la red",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema define la máscara de subred como el elemento que determina qué parte de la dirección IP identifica la red y cuál identifica el equipo dentro de ella. No tiene relación con la elección de protocolo de transporte, con el número de capas OSI ni con la velocidad de transmisión.",
    mnemotecnia:
      "La máscara 'recorta' la IP en dos partes: red y equipo.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Cómo funciona el DNS para resolver un nombre de dominio según el temario?",
    opciones: [
      "De forma jerárquica y distribuida: un servidor raíz remite al servidor del dominio de nivel superior, este al servidor autoritativo del dominio concreto, que devuelve la dirección IP",
      "De forma centralizada en un único servidor mundial sin jerarquía",
      "Traduciendo direcciones IP a nombres de dominio exclusivamente, nunca al revés",
      "Sin ningún tipo de caché de resultados",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema describe el DNS como un sistema que traduce nombres de dominio a direcciones IP funcionando de forma jerárquica y distribuida: un servidor raíz remite a los servidores del dominio de nivel superior (.com, .es), estos remiten al servidor autoritativo del dominio concreto, y este devuelve la IP correspondiente. No es un sistema centralizado en un único servidor ni funciona solo en sentido inverso.",
    mnemotecnia:
      "DNS es una cadena: raíz → TLD (.com, .es) → autoritativo → IP.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué función cumplen los servidores DNS recursivos según el temario?",
    opciones: [
      "Resuelven la cadena de consultas DNS en nombre del equipo cliente y guardan el resultado en caché durante un tiempo para agilizar peticiones futuras",
      "Son los únicos servidores DNS que existen, sin jerarquía adicional",
      "Sustituyen por completo al servidor autoritativo del dominio",
      "Nunca almacenan resultados en caché",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema indica que los servidores DNS recursivos (habitualmente los del proveedor de Internet) resuelven la cadena de consultas en nombre del equipo cliente y guardan el resultado en caché durante un tiempo para agilizar peticiones futuras al mismo dominio, sin sustituir al servidor autoritativo ni prescindir de la jerarquía DNS.",
    mnemotecnia:
      "El recursivo hace el trabajo por ti y se acuerda (caché) para la próxima vez.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué diferencia a un switch de un hub según el temario?",
    opciones: [
      "El switch reenvía el tráfico solo al puerto donde está conectado el destinatario, mientras que el hub reenvía indiscriminadamente a todos los puertos",
      "El hub reenvía el tráfico solo al puerto de destino y el switch a todos los puertos",
      "Ambos dispositivos funcionan de forma idéntica",
      "El switch solo puede conectar redes distintas, nunca dispositivos de la misma red",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema explica que un switch o conmutador conecta dispositivos dentro de una misma red local y reenvía el tráfico solo al puerto donde está conectado el destinatario, a diferencia de un hub, que reenvía indiscriminadamente a todos los puertos; conectar redes distintas es la función del router, no del switch.",
    mnemotecnia:
      "Switch es selectivo (solo al destino); hub es indiscriminado (a todos los puertos).",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué es el NAT (Network Address Translation) y qué problema alivia según el temario?",
    opciones: [
      "Permite que varios equipos de una red privada compartan una única dirección IP pública, traduciendo direcciones y puertos, y alivia la escasez de direcciones IPv4",
      "Es un protocolo de cifrado equivalente a TLS",
      "Sustituye por completo la necesidad de direcciones IP",
      "Solo funciona en redes que usan exclusivamente IPv6",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El tema explica que mientras se completa la transición a IPv6, muchas redes IPv4 usan NAT para que varios equipos de una red privada (con direcciones no enrutables públicamente, como el rango 192.168.x.x) compartan una única dirección IP pública para salir a Internet, traduciendo direcciones y puertos de cada conexión, lo que alivia la escasez de direcciones IPv4 y añade una capa adicional de aislamiento entre la red interna y el exterior.",
    mnemotecnia:
      "NAT: muchas IPs privadas, una sola IP pública compartida — el parche clásico a la escasez de IPv4.",
    dificultad: 2,
  },
];
