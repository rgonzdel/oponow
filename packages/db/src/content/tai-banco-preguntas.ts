// Banco de 101 preguntas validadas de TAI (Técnico Auxiliar de Informática),
// temas 1 a 16, generado con Gemini y revisado pregunta a pregunta antes de
// importarlo: se corrigieron distractores que también eran correctos, citas no
// literales, mnemotecnias falsas y comentarios del generador. Se descartaron las
// preguntas que repetían el mismo dato que CE_TEMA1_PREGUNTAS o
// TAI_TEMA2_PREGUNTAS. La posición de la respuesta correcta está equilibrada.
//
// Validación (2026-10-06):
// - Normativa (77 preguntas: CE, Ley 50/1997, RD 311/2022, LOTC, LOREG): cada
//   cita entre «» comprobada de forma literal contra el texto consolidado
//   vigente descargado de la API de datos abiertos del BOE, y la respuesta y
//   los distractores revisados contra el artículo completo. Única cita fuera
//   del texto vigente: la redacción original del art. 49 CE (1978), citada como
//   tal en tai-t01-003 y comprobada en la versión de 1978 del propio BOE.
// - Técnicas: contrastadas con la especificación oficial que indica `fuente`
//   (RFC 9110/8259/8017, WHATWG, W3C, Oracle JLS/JVMS, POSIX, kernel Linux,
//   Microsoft Learn, NIST, USB-IF). Sin fuente oficial en línea, solo manual de
//   referencia: las 9 de TAI_BANCO_PENDIENTES_FUENTE, al final del fichero,
//   que no se importan hasta que se decida.
//
// `fuente` es solo trazabilidad (no se guarda en la base de datos).
//
// Se importa con: pnpm --filter @oponow/db import-banco-tai

export interface PreguntaBancoTai {
  id: string;
  temaOrden: number;
  fuente: string;
  enunciado: string;
  opciones: string[];
  respuestaCorrecta: number;
  justificacionIa: string;
  mnemotecnia: string;
  dificultad: number;
}

export const TAI_BANCO_PREGUNTAS: PreguntaBancoTai[] = [
  {
    "id": "tai-t01-003",
    "temaOrden": 1,
    "fuente": "CE art. 49",
    "enunciado": "Tras la reforma constitucional de febrero de 2024, según el artículo 49 de la Constitución, los poderes públicos impulsarán las políticas que garanticen la plena autonomía personal y la inclusión social de:",
    "opciones": [
      "Los disminuidos físicos, sensoriales y psíquicos.",
      "Los minusválidos y dependientes.",
      "Las personas con diversidad funcional.",
      "Las personas con discapacidad."
    ],
    "respuestaCorrecta": 3,
    "justificacionIa": "La reforma de 15 de febrero de 2024 sustituyó la redacción original del artículo 49, que se refería a los «disminuidos físicos, sensoriales y psíquicos», por la expresión «personas con discapacidad». Su apartado 2 dispone ahora que «Los poderes públicos impulsarán las políticas que garanticen la plena autonomía personal y la inclusión social de las personas con discapacidad, en entornos universalmente accesibles».",
    "mnemotecnia": "Reforma del 49: desaparece «disminuidos» y entra «personas con discapacidad».",
    "dificultad": 2
  },
  {
    "id": "tai-t01-005",
    "temaOrden": 1,
    "fuente": "CE art. 81.2",
    "enunciado": "Según la Constitución Española, la aprobación, modificación o derogación de las leyes orgánicas exigirá:",
    "opciones": [
      "Mayoría absoluta del Congreso, en una votación final sobre el conjunto del proyecto.",
      "Mayoría simple del Congreso en una votación final sobre el conjunto del proyecto.",
      "Mayoría absoluta del Congreso y del Senado.",
      "Mayoría de tres quintos de cada una de las Cámaras."
    ],
    "respuestaCorrecta": 0,
    "justificacionIa": "El artículo 81.2 dispone que «La aprobación, modificación o derogación de las leyes orgánicas exigirá mayoría absoluta del Congreso, en una votación final sobre el conjunto del proyecto». No requiere mayoría cualificada en el Senado.",
    "mnemotecnia": "Ley orgánica = mayoría absoluta del CONGRESO en una votación final sobre el conjunto.",
    "dificultad": 1
  },
  {
    "id": "tai-t03-018",
    "temaOrden": 3,
    "fuente": "CE art. 56.1",
    "enunciado": "Según el artículo 56.1 de la Constitución Española, el Rey ejerce las funciones que le atribuyen expresamente:",
    "opciones": [
      "La Constitución y los tratados internacionales suscritos por España.",
      "Las Cortes Generales y el Consejo de Ministros.",
      "La Constitución y las leyes.",
      "La Constitución, las leyes orgánicas y la costumbre constitucional."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "El artículo 56.1 establece que el Rey asume la más alta representación del Estado español en las relaciones internacionales y «ejerce las funciones que le atribuyen expresamente la Constitución y las leyes».",
    "mnemotecnia": "El Rey no inventa funciones: solo las que le dan la Constitución y las Leyes (C + L).",
    "dificultad": 1
  },
  {
    "id": "tai-t03-019",
    "temaOrden": 3,
    "fuente": "CE art. 57.1",
    "enunciado": "Según las reglas de sucesión a la Corona establecidas en el artículo 57.1 de la Constitución Española, dentro de una misma línea de sucesión se prefiere siempre:",
    "opciones": [
      "El grado más próximo al más remoto.",
      "El grado más remoto al más próximo, para asegurar la continuidad.",
      "El varón a la mujer, y en el mismo sexo, el de mayor edad al menor.",
      "La mujer al varón, siempre que ostente un título de mayor rango."
    ],
    "respuestaCorrecta": 0,
    "justificacionIa": "El orden de preferencia en la misma línea es, según el art. 57.1, «el grado más próximo al más remoto». La preferencia del varón sobre la mujer opera después, dentro del mismo grado.",
    "mnemotecnia": "Línea → Grado → Sexo → Edad. La pregunta acota «dentro de una misma línea», así que decide el grado.",
    "dificultad": 2
  },
  {
    "id": "tai-t03-020",
    "temaOrden": 3,
    "fuente": "CE art. 59.2",
    "enunciado": "Si el Rey se inhabilitare para el ejercicio de su autoridad y las Cortes Generales reconocieran esa imposibilidad, siendo el Príncipe heredero menor de edad, ¿qué prevé la Constitución respecto a la Regencia?",
    "opciones": [
      "Entrará a ejercer inmediatamente la Regencia el Príncipe heredero.",
      "Las Cortes Generales nombrarán una Regencia de una, tres o cinco personas.",
      "Se procederá de la manera prevista para la minoría de edad del Rey, hasta que el Príncipe heredero alcance la mayoría de edad.",
      "El Presidente del Gobierno asumirá interinamente las funciones de la Jefatura del Estado."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "El art. 59.2 CE dispone que, reconocida la inhabilitación por las Cortes, entra a ejercer la Regencia el Príncipe heredero «si fuere mayor de edad. Si no lo fuere, se procederá de la manera prevista en el apartado anterior, hasta que el Príncipe heredero alcance la mayoría de edad». La Regencia nombrada por las Cortes (59.3) solo procede si no hay ninguna persona a quien corresponda.",
    "mnemotecnia": "Inhabilitación: heredero mayor → regente él; heredero menor → reglas del 59.1; nadie → las Cortes (1, 3 o 5).",
    "dificultad": 3
  },
  {
    "id": "tai-t03-021",
    "temaOrden": 3,
    "fuente": "CE art. 62.a",
    "enunciado": "Corresponde al Rey, según el artículo 62 de la Constitución Española:",
    "opciones": [
      "Aprobar los Presupuestos Generales del Estado.",
      "Sancionar y promulgar las leyes.",
      "Nombrar al Defensor del Pueblo.",
      "Interponer el recurso de inconstitucionalidad."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "El artículo 62.a) atribuye expresamente al Rey la función de «Sancionar y promulgar las leyes». Los Presupuestos los aprueban las Cortes Generales y el Defensor del Pueblo es designado por ellas.",
    "mnemotecnia": "Las Cortes aprueban, el Gobierno ejecuta y el Rey sanciona y promulga (62.a).",
    "dificultad": 1
  },
  {
    "id": "tai-t03-022",
    "temaOrden": 3,
    "fuente": "CE art. 63.3",
    "enunciado": "Según el artículo 63.3 de la Constitución, para que el Rey pueda declarar la guerra y hacer la paz, ¿qué requisito previo es indispensable?",
    "opciones": [
      "La autorización expresa del Consejo de Seguridad Nacional.",
      "El refrendo del Presidente del Gobierno en exclusiva.",
      "La aprobación del Consejo de Ministros mediante Real Decreto.",
      "La previa autorización de las Cortes Generales."
    ],
    "respuestaCorrecta": 3,
    "justificacionIa": "El artículo 63.3 establece: «Al Rey corresponde, previa autorización de las Cortes Generales, declarar la guerra y hacer la paz».",
    "mnemotecnia": "Guerra y paz = decisión extrema: necesita a las Cortes Generales, que representan al pueblo.",
    "dificultad": 2
  },
  {
    "id": "tai-t03-023",
    "temaOrden": 3,
    "fuente": "CE art. 64.1",
    "enunciado": "Como regla general, los actos del Rey son refrendados por el Presidente del Gobierno y los Ministros. Sin embargo, según el artículo 64.1 de la Constitución, ¿quién refrenda la propuesta y el nombramiento del Presidente del Gobierno?",
    "opciones": [
      "El Presidente del Senado.",
      "El Presidente del Tribunal Constitucional.",
      "El Presidente del Gobierno saliente o en funciones.",
      "El Presidente del Congreso de los Diputados."
    ],
    "respuestaCorrecta": 3,
    "justificacionIa": "El art. 64.1 excepciona la regla general al establecer que «La propuesta y el nombramiento del Presidente del Gobierno, y la disolución prevista en el artículo 99, serán refrendados por el Presidente del Congreso».",
    "mnemotecnia": "Para nombrar Presidente del Gobierno firma el otro «Presidente» con peso en ese momento: el del Congreso.",
    "dificultad": 2
  },
  {
    "id": "tai-t03-024",
    "temaOrden": 3,
    "fuente": "CE art. 65.1",
    "enunciado": "Respecto al presupuesto de la Casa de Su Majestad el Rey, el artículo 65.1 de la Constitución dispone que el Rey:",
    "opciones": [
      "Recibe de los Presupuestos del Estado una cantidad global para el sostenimiento de su Familia y Casa, y distribuye libremente la misma.",
      "Propone la cantidad a las Cortes Generales para su debate.",
      "Carece de dotación económica específica, asumiéndose los gastos por el Ministerio de la Presidencia.",
      "Tiene una partida presupuestaria desglosada por conceptos que aprueba cada año el Consejo de Ministros."
    ],
    "respuestaCorrecta": 0,
    "justificacionIa": "El artículo 65.1 CE dispone: «El Rey recibe de los Presupuestos del Estado una cantidad global para el sostenimiento de su Familia y Casa, y distribuye libremente la misma».",
    "mnemotecnia": "Cantidad Global + Libre distribución: no se justifica partida a partida.",
    "dificultad": 1
  },
  {
    "id": "tai-t03-025",
    "temaOrden": 3,
    "fuente": "CE art. 60.1",
    "enunciado": "Según el artículo 60.1 de la Constitución, ¿puede el Rey difunto nombrar en su testamento al tutor del Rey menor?",
    "opciones": [
      "No, el tutor del Rey menor siempre será designado por las Cortes Generales.",
      "Sí, siempre que el nombrado sea mayor de edad y español de nacimiento.",
      "Sí, pero requerirá la ratificación del Presidente del Gobierno en todo caso.",
      "No, la tutela del Rey menor recae automáticamente y sin excepción en el padre o la madre que sobreviva."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "El art. 60.1 establece que será tutor del Rey menor «la persona que en su testamento hubiese nombrado el Rey difunto, siempre que sea mayor de edad y español de nacimiento». Esta designación prevalece sobre el padre o la madre viudos.",
    "mnemotecnia": "Tutela del Rey menor: 1º el nombrado en testamento, 2º el padre o la madre viudos, 3º las Cortes. Requisitos: mayor de edad y español DE NACIMIENTO.",
    "dificultad": 2
  },
  {
    "id": "tai-t04-026",
    "temaOrden": 4,
    "fuente": "CE art. 68.1",
    "enunciado": "Según el artículo 68.1 de la Constitución Española, el Congreso se compone de un número de Diputados comprendido entre:",
    "opciones": [
      "Un mínimo de 350 y un máximo de 450 Diputados.",
      "Un mínimo de 300 y un máximo de 350 Diputados.",
      "Un mínimo de 300 y un máximo de 400 Diputados.",
      "Un mínimo de 400 y un máximo de 500 Diputados."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "El artículo 68.1 de la CE establece que «El Congreso se compone de un mínimo de 300 y un máximo de 400 Diputados, elegidos por sufragio universal, libre, igual, directo y secreto». La cifra exacta de 350 la fija la LOREG.",
    "mnemotecnia": "Horquilla del Congreso: de 3 a 4 (300 a 400). La LOREG la fija en 350.",
    "dificultad": 1
  },
  {
    "id": "tai-t04-027",
    "temaOrden": 4,
    "fuente": "CE art. 69.5",
    "enunciado": "Conforme al artículo 69 de la Constitución, relativo a la composición del Senado, ¿cuántos Senadores designa cada Comunidad Autónoma por población?",
    "opciones": [
      "Dos Senadores fijos y otro más por cada millón y medio de habitantes de su territorio.",
      "Un Senador y otro más por cada millón de habitantes de su respectivo territorio.",
      "Un Senador por cada 500.000 habitantes de su respectivo territorio.",
      "Un Senador y otro más por cada dos millones de habitantes de su respectivo territorio."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "El artículo 69.5 de la CE indica que las Comunidades Autónomas designarán «además un Senador y otro más por cada millón de habitantes de su respectivo territorio».",
    "mnemotecnia": "Senadores autonómicos: 1 de base + 1 por cada millón de habitantes.",
    "dificultad": 2
  },
  {
    "id": "tai-t04-028",
    "temaOrden": 4,
    "fuente": "CE art. 73.1",
    "enunciado": "Las Cámaras se reunirán anualmente en dos períodos ordinarios de sesiones. Según el artículo 73.1 de la Constitución, ¿cuáles son estos períodos?",
    "opciones": [
      "El primero, de septiembre a diciembre; el segundo, de febrero a junio.",
      "El primero, de octubre a enero; el segundo, de marzo a julio.",
      "El primero, de enero a mayo; el segundo, de septiembre a diciembre.",
      "El primero, de febrero a junio; el segundo, de agosto a diciembre."
    ],
    "respuestaCorrecta": 0,
    "justificacionIa": "El art. 73.1 CE dispone: «Las Cámaras se reunirán anualmente en dos períodos ordinarios de sesiones: el primero, de septiembre a diciembre, y el segundo, de febrero a junio». Quedan fuera de los periodos ordinarios enero, julio y agosto.",
    "mnemotecnia": "Fuera de periodo ordinario: enero, julio y agosto. El resto son Sep-Dic y Feb-Jun.",
    "dificultad": 1
  },
  {
    "id": "tai-t04-029",
    "temaOrden": 4,
    "fuente": "CE art. 78.1",
    "enunciado": "Según el artículo 78.1 de la Constitución, las Diputaciones Permanentes del Congreso y del Senado estarán compuestas por:",
    "opciones": [
      "Un mínimo de 15 miembros, que representarán paritariamente a todos los grupos parlamentarios.",
      "Un mínimo de 25 miembros, elegidos exclusivamente por la Mesa de cada Cámara.",
      "Un mínimo de 21 miembros, que representarán a los grupos parlamentarios, en proporción a su importancia numérica.",
      "Un máximo de 21 miembros, designados por el Presidente de cada Cámara."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "El art. 78.1 CE establece: «En cada Cámara habrá una Diputación Permanente compuesta por un mínimo de veintiún miembros, que representarán a los grupos parlamentarios, en proporción a su importancia numérica».",
    "mnemotecnia": "Diputación Permanente: MÍNIMO de 21 miembros, en proporción al peso de cada grupo.",
    "dificultad": 2
  },
  {
    "id": "tai-t04-030",
    "temaOrden": 4,
    "fuente": "CE art. 71.2",
    "enunciado": "En relación con las prerrogativas de los Diputados y Senadores, el artículo 71 de la Constitución señala que:",
    "opciones": [
      "Gozarán de inviolabilidad, pero podrán ser detenidos por cualquier delito si lo autoriza el Tribunal Supremo.",
      "No podrán ser procesados en ningún caso durante el tiempo que dure su mandato representativo.",
      "Su inmunidad impide que sean juzgados, salvo que renuncien voluntariamente al escaño.",
      "Gozarán asimismo de inmunidad y sólo podrán ser detenidos en caso de flagrante delito."
    ],
    "respuestaCorrecta": 3,
    "justificacionIa": "El artículo 71.2 CE señala: «Durante el período de su mandato los Diputados y Senadores gozarán asimismo de inmunidad y sólo podrán ser detenidos en caso de flagrante delito. No podrán ser inculpados ni procesados sin la previa autorización de la Cámara respectiva».",
    "mnemotecnia": "Inviolabilidad = opiniones. Inmunidad = detenciones (solo en flagrante delito) y procesamiento (con autorización de la Cámara).",
    "dificultad": 2
  },
  {
    "id": "tai-t04-031",
    "temaOrden": 4,
    "fuente": "CE art. 74.2",
    "enunciado": "Según el artículo 74.2 de la Constitución, cuando no haya acuerdo entre el Congreso y el Senado sobre las decisiones relativas a la autorización de Tratados Internacionales o al Fondo de Compensación Interterritorial, las discrepancias se intentarán resolver:",
    "opciones": [
      "Mediante la disolución anticipada de las Cortes Generales y la convocatoria de elecciones.",
      "Atribuyendo directamente el voto de calidad al Presidente del Congreso de los Diputados.",
      "Por una Comisión Mixta paritaria de Diputados y Senadores que presentará un texto para su votación en ambas Cámaras.",
      "Por mayoría absoluta del Senado, al tener esta Cámara la última palabra en asuntos territoriales."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "El artículo 74.2 prevé que, para las decisiones de los arts. 94.1, 145.2 y 158.2, si no hay acuerdo se intentará obtener «por una Comisión Mixta compuesta de igual número de Diputados y Senadores». Si el texto tampoco se aprueba, decide el Congreso por mayoría absoluta.",
    "mnemotecnia": "Discrepancia Congreso-Senado en tratados o Fondo de Compensación = Comisión Mixta paritaria. Si fracasa, decide el Congreso.",
    "dificultad": 3
  },
  {
    "id": "tai-t04-032",
    "temaOrden": 4,
    "fuente": "CE art. 54",
    "enunciado": "Conforme al artículo 54 de la Constitución, el Defensor del Pueblo es:",
    "opciones": [
      "Un órgano dependiente del Ministerio de Justicia que defiende a los ciudadanos en vía judicial.",
      "Un cargo nombrado directamente por el Rey a propuesta del Presidente del Gobierno.",
      "Un magistrado especial del Tribunal Constitucional para velar por los derechos fundamentales.",
      "Un alto comisionado de las Cortes Generales, designado por éstas para la defensa de los derechos comprendidos en el Título I."
    ],
    "respuestaCorrecta": 3,
    "justificacionIa": "El art. 54 lo define como «alto comisionado de las Cortes Generales, designado por éstas para la defensa de los derechos comprendidos en este Título, a cuyo efecto podrá supervisar la actividad de la Administración, dando cuenta a las Cortes Generales».",
    "mnemotecnia": "Defensor del Pueblo = alto comisionado de las CORTES: el legislativo vigila a la Administración.",
    "dificultad": 1
  },
  {
    "id": "tai-t04-033",
    "temaOrden": 4,
    "fuente": "CE art. 72.1",
    "enunciado": "Según el artículo 72.1 de la Constitución, ¿qué mayoría se exige para la aprobación o modificación de los Reglamentos de las Cámaras?",
    "opciones": [
      "Mayoría absoluta en una votación final sobre su totalidad.",
      "Mayoría de tres quintos en una votación final sobre su totalidad.",
      "Mayoría simple en cada una de las Cámaras.",
      "Mayoría absoluta del Congreso, independientemente del reglamento que se apruebe."
    ],
    "respuestaCorrecta": 0,
    "justificacionIa": "El artículo 72.1 establece que las Cámaras establecen sus propios Reglamentos y que «Los Reglamentos y su reforma serán sometidos a una votación final sobre su totalidad, que requerirá la mayoría absoluta».",
    "mnemotecnia": "Reglamentos de las Cámaras: votación final sobre su totalidad por mayoría absoluta, el mismo quórum que una ley orgánica.",
    "dificultad": 2
  },
  {
    "id": "tai-t05-034",
    "temaOrden": 5,
    "fuente": "CE arts. 97 y 134.1",
    "enunciado": "¿Cuál de las siguientes funciones NO atribuye la Constitución Española al Gobierno?",
    "opciones": [
      "Dirigir la política interior y exterior.",
      "Aprobar los Presupuestos Generales del Estado.",
      "Dirigir la Administración civil y militar y la defensa del Estado.",
      "Ejercer la función ejecutiva y la potestad reglamentaria de acuerdo con la Constitución y las leyes."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "Dirigir la política interior y exterior, la Administración civil y militar y la defensa del Estado, y ejercer la función ejecutiva y la potestad reglamentaria, son funciones del Gobierno según el art. 97 CE. En cambio, el art. 134.1 dispone que «Corresponde al Gobierno la elaboración de los Presupuestos Generales del Estado y a las Cortes Generales, su examen, enmienda y aprobación».",
    "mnemotecnia": "Presupuestos: el Gobierno los ELABORA y las Cortes los APRUEBAN.",
    "dificultad": 1
  },
  {
    "id": "tai-t05-035",
    "temaOrden": 5,
    "fuente": "CE art. 98.1",
    "enunciado": "Según dispone el artículo 98.1 de la Constitución, el Gobierno se compone de:",
    "opciones": [
      "El Presidente, los Vicepresidentes, los Ministros y los Secretarios de Estado.",
      "El Presidente, los Ministros, los Secretarios Generales y los Subsecretarios.",
      "El Presidente, los Vicepresidentes, en su caso, los Ministros y los demás miembros que establezca la ley.",
      "El Presidente, los Ministros y los Directores Generales, así como de otros miembros si una Ley Orgánica lo prevé."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "El artículo 98.1 dice: «El Gobierno se compone del Presidente, de los Vicepresidentes, en su caso, de los Ministros y de los demás miembros que establezca la ley». La Ley 50/1997 no ha añadido otros miembros, y los Secretarios de Estado no forman parte del Gobierno.",
    "mnemotecnia": "Presidente, Vicepresidentes (en su caso), Ministros y los demás que diga la ley. Los Secretarios de Estado NO son Gobierno.",
    "dificultad": 1
  },
  {
    "id": "tai-t05-036",
    "temaOrden": 5,
    "fuente": "Ley 50/1997 art. 1.3",
    "enunciado": "De acuerdo con el artículo 1.3 de la Ley 50/1997, del Gobierno, ¿en qué órganos se reúnen los miembros del Gobierno?",
    "opciones": [
      "Exclusivamente en Consejo de Ministros.",
      "En Consejo de Ministros y en la Comisión General de Secretarios de Estado y Subsecretarios.",
      "En Consejo de Ministros, Comisiones Delegadas del Gobierno y el Consejo de Estado.",
      "En Consejo de Ministros y en Comisiones Delegadas del Gobierno."
    ],
    "respuestaCorrecta": 3,
    "justificacionIa": "El artículo 1.3 de la Ley 50/1997 dispone: «Los miembros del Gobierno se reúnen en Consejo de Ministros y en Comisiones Delegadas del Gobierno». La Comisión General de Secretarios de Estado y Subsecretarios no está formada por miembros del Gobierno.",
    "mnemotecnia": "Miembros del Gobierno = Consejo de Ministros + Comisiones Delegadas.",
    "dificultad": 2
  },
  {
    "id": "tai-t05-037",
    "temaOrden": 5,
    "fuente": "CE art. 101.1",
    "enunciado": "Según el artículo 101 de la Constitución, el Gobierno cesa por varias causas. ¿Cuál de las siguientes es una causa expresamente contemplada?",
    "opciones": [
      "La dimisión de más de la mitad de los Ministros.",
      "La pérdida de la confianza parlamentaria prevista en la Constitución.",
      "La solicitud directa y vinculante del Jefe del Estado.",
      "La aprobación de una proposición no de ley en contra del Presidente del Gobierno."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "El art. 101.1 CE establece que «El Gobierno cesa tras la celebración de elecciones generales, en los casos de pérdida de la confianza parlamentaria previstos en la Constitución, o por dimisión o fallecimiento de su Presidente».",
    "mnemotecnia": "El Gobierno cesa por EPDF: Elecciones, Pérdida de confianza, Dimisión del Presidente, Fallecimiento del Presidente.",
    "dificultad": 1
  },
  {
    "id": "tai-t05-038",
    "temaOrden": 5,
    "fuente": "Ley 50/1997 art. 4.1.d",
    "enunciado": "Según el artículo 4 de la Ley 50/1997, de las funciones de los Ministros, les corresponde, además de ejercer la potestad reglamentaria en su departamento:",
    "opciones": [
      "Refrendar, en su caso, los actos del Rey en materia de su competencia.",
      "Plantear ante el Congreso la cuestión de confianza previa deliberación del Consejo.",
      "Proponer al Rey la disolución de las Cámaras.",
      "Convocar y presidir las reuniones del Consejo de Ministros."
    ],
    "respuestaCorrecta": 0,
    "justificacionIa": "El art. 4.1.d) de la Ley 50/1997 atribuye a los Ministros la función de «Refrendar, en su caso, los actos del Rey en materia de su competencia». Plantear la cuestión de confianza, proponer la disolución y convocar y presidir el Consejo de Ministros son funciones del Presidente del Gobierno.",
    "mnemotecnia": "El Ministro dirige su casa (su Ministerio) y refrenda al Rey en lo suyo.",
    "dificultad": 2
  },
  {
    "id": "tai-t05-039",
    "temaOrden": 5,
    "fuente": "CE art. 100",
    "enunciado": "Según el artículo 100 de la Constitución, ¿quién nombra y separa a los Ministros del Gobierno?",
    "opciones": [
      "El Rey, a propuesta del Presidente del Gobierno.",
      "Las Cortes Generales por mayoría absoluta.",
      "El Presidente del Gobierno directamente por Real Decreto.",
      "El Congreso de los Diputados, a propuesta del Rey."
    ],
    "respuestaCorrecta": 0,
    "justificacionIa": "El artículo 100 de la CE dispone: «Los demás miembros del Gobierno serán nombrados y separados por el Rey, a propuesta de su Presidente».",
    "mnemotecnia": "El Presidente elige y propone; el nombramiento y la separación los firma el Rey.",
    "dificultad": 1
  },
  {
    "id": "tai-t05-040",
    "temaOrden": 5,
    "fuente": "CE art. 99.3",
    "enunciado": "En el proceso de investidura regulado en el artículo 99 de la Constitución, si el candidato propuesto no obtiene la mayoría absoluta en la primera votación del Congreso, ¿qué mayoría requerirá en la siguiente votación celebrada 48 horas después?",
    "opciones": [
      "Mayoría absoluta nuevamente, tras modificar su programa político.",
      "Mayoría de tres quintos del Congreso.",
      "Mayoría simple del Congreso y del Senado en sesión conjunta.",
      "Mayoría simple."
    ],
    "respuestaCorrecta": 3,
    "justificacionIa": "El artículo 99.3 CE dispone que, si no se alcanza la mayoría absoluta, se someterá la misma propuesta a nueva votación cuarenta y ocho horas después de la anterior, y «la confianza se entenderá otorgada si obtuviere la mayoría simple».",
    "mnemotecnia": "Investidura: 1ª votación, mayoría absoluta. Si falla, 48 h después, mayoría simple (más síes que noes).",
    "dificultad": 2
  },
  {
    "id": "tai-t05-041",
    "temaOrden": 5,
    "fuente": "Ley 50/1997 art. 2.2.j",
    "enunciado": "Según el artículo 2.2 de la Ley 50/1997, ¿a quién corresponde crear, modificar y suprimir, por Real Decreto, los Departamentos Ministeriales, así como las Secretarías de Estado?",
    "opciones": [
      "Al Consejo de Ministros.",
      "A las Cortes Generales mediante Ley Orgánica.",
      "Al Presidente del Gobierno.",
      "Al Rey de forma exclusiva."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "El artículo 2.2.j) de la Ley 50/1997 señala que corresponde al Presidente del Gobierno «Crear, modificar y suprimir, por Real Decreto, los Departamentos Ministeriales, así como las Secretarías de Estado».",
    "mnemotecnia": "La estructura de Ministerios la decide el Presidente: es su equipo y él lo organiza.",
    "dificultad": 2
  },
  {
    "id": "tai-t05-042",
    "temaOrden": 5,
    "fuente": "Ley 50/1997 art. 8.5.a y 8.4",
    "enunciado": "Según la Ley 50/1997, del Gobierno, ¿qué función principal ejerce la Comisión General de Secretarios de Estado y Subsecretarios?",
    "opciones": [
      "Dirigir y coordinar la acción de los Delegados del Gobierno en las Comunidades Autónomas.",
      "El examen de todos los asuntos que vayan a someterse a aprobación del Consejo de Ministros, salvo los nombramientos, ceses, ascensos a oficial general y los asuntos urgentes que deban ir directamente al Consejo.",
      "Aprobar mediante potestad reglamentaria aquellas normas que no requieran deliberación del Consejo de Ministros.",
      "Resolver los conflictos de atribuciones entre distintos Ministerios."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "El art. 8.5.a) de la Ley 50/1997 atribuye a la Comisión General «El examen de todos los asuntos que vayan a someterse a aprobación del Consejo de Ministros, excepto los nombramientos, ceses, ascensos a cualquiera de los empleos de la categoría de oficiales generales y aquéllos que, excepcionalmente y por razones de urgencia, deban ser sometidos directamente al Consejo de Ministros». Además, el art. 8.4 dispone que «En ningún caso la Comisión podrá adoptar decisiones o acuerdos por delegación del Gobierno». Resolver los conflictos de atribuciones entre Ministerios corresponde al Presidente del Gobierno (art. 2.2.l).",
    "mnemotecnia": "La Comisión General es la «cocina» del Consejo de Ministros: examina casi todo antes (salvo nombramientos, ceses y urgencias), pero no decide nada por delegación.",
    "dificultad": 3
  },
  {
    "id": "tai-t06-043",
    "temaOrden": 6,
    "fuente": "CE art. 108",
    "enunciado": "El artículo 108 de la Constitución establece que el Gobierno responde solidariamente en su gestión política ante:",
    "opciones": [
      "El Rey y las Cortes Generales.",
      "El Senado, por ser cámara de representación territorial.",
      "El Congreso de los Diputados.",
      "Ambas Cámaras de forma paritaria y conjunta."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "El artículo 108 de la CE dispone: «El Gobierno responde solidariamente en su gestión política ante el Congreso de los Diputados». No ante el Senado ni ante las Cortes en su conjunto.",
    "mnemotecnia": "El Gobierno nace en el Congreso (investidura) y responde ante el Congreso (moción de censura, cuestión de confianza y art. 108).",
    "dificultad": 1
  },
  {
    "id": "tai-t06-044",
    "temaOrden": 6,
    "fuente": "CE art. 111.2",
    "enunciado": "Según el artículo 111 de la Constitución, relativo al control parlamentario, ¿qué consecuencia puede derivar de toda interpelación al Gobierno en las Cámaras?",
    "opciones": [
      "La comparecencia obligatoria del Presidente del Gobierno ante la comisión de investigación correspondiente.",
      "Podrá dar lugar a una moción en la que la Cámara manifieste su posición.",
      "La obligación de presentar una cuestión de confianza por parte del Gobierno en el plazo de un mes.",
      "La reprobación automática del Ministro interpelado si no contesta en tres días."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "El artículo 111.2 CE señala que «Toda interpelación podrá dar lugar a una moción en la que la Cámara manifieste su posición».",
    "mnemotecnia": "Pregunta → información. Interpelación → debate más amplio → moción (la Cámara se posiciona).",
    "dificultad": 2
  },
  {
    "id": "tai-t06-045",
    "temaOrden": 6,
    "fuente": "CE art. 112",
    "enunciado": "Conforme al artículo 112 de la Constitución, ¿quién y bajo qué requisitos puede plantear ante el Congreso de los Diputados la cuestión de confianza?",
    "opciones": [
      "Cualquier Ministro, con la autorización expresa del Presidente del Gobierno.",
      "El Gobierno, mediante acuerdo mayoritario de sus miembros, sin necesidad de autorización del Presidente.",
      "El Presidente del Congreso, previa solicitud de una décima parte de los Diputados.",
      "El Presidente del Gobierno, previa deliberación del Consejo de Ministros."
    ],
    "respuestaCorrecta": 3,
    "justificacionIa": "El artículo 112 CE indica que «El Presidente del Gobierno, previa deliberación del Consejo de Ministros, puede plantear ante el Congreso de los Diputados la cuestión de confianza sobre su programa o sobre una declaración de política general».",
    "mnemotecnia": "Cuestión de confianza = arma del Presidente: la plantea él tras DELIBERAR (no aprobar) con sus Ministros.",
    "dificultad": 2
  },
  {
    "id": "tai-t06-046",
    "temaOrden": 6,
    "fuente": "CE art. 113.2",
    "enunciado": "El artículo 113 de la Constitución permite al Congreso exigir la responsabilidad política del Gobierno mediante la moción de censura. Para ser propuesta, la moción deberá ser apoyada por al menos:",
    "opciones": [
      "Una décima parte de los Diputados.",
      "Una quinta parte de los Diputados.",
      "La mayoría absoluta de los Diputados.",
      "Una cuarta parte de los Diputados."
    ],
    "respuestaCorrecta": 0,
    "justificacionIa": "El artículo 113.2 de la CE establece que «La moción de censura deberá ser propuesta al menos por la décima parte de los Diputados, y habrá de incluir un candidato a la Presidencia del Gobierno».",
    "mnemotecnia": "Moción de censura: la proponen 1/10 de los Diputados y se aprueba por mayoría absoluta.",
    "dificultad": 2
  },
  {
    "id": "tai-t06-047",
    "temaOrden": 6,
    "fuente": "CE art. 113.3",
    "enunciado": "En la tramitación de una moción de censura, según el artículo 113 de la Constitución, ¿durante qué plazo pueden presentarse mociones alternativas?",
    "opciones": [
      "Durante los cinco días siguientes a la presentación de la primera moción.",
      "Dentro de las veinticuatro horas previas a la votación definitiva en el Pleno.",
      "En cualquier momento hasta el inicio del debate en el Congreso.",
      "En los dos primeros días de los cinco que deben transcurrir hasta su votación."
    ],
    "respuestaCorrecta": 3,
    "justificacionIa": "El artículo 113.3 CE dispone que la moción de censura no podrá ser votada hasta que transcurran cinco días desde su presentación, y que «En los dos primeros días de dicho plazo podrán presentarse mociones alternativas».",
    "mnemotecnia": "Moción: 5 días de enfriamiento. Los 2 primeros sirven para presentar alternativas.",
    "dificultad": 3
  },
  {
    "id": "tai-t06-048",
    "temaOrden": 6,
    "fuente": "CE art. 114.2",
    "enunciado": "Si el Congreso adopta una moción de censura, ¿qué efectos produce según el artículo 114.2 de la Constitución?",
    "opciones": [
      "El Gobierno presentará su dimisión al Rey y el candidato incluido en aquella se entenderá investido de la confianza de la Cámara.",
      "El Presidente del Gobierno deberá disolver las Cortes Generales inmediatamente.",
      "El Gobierno queda en funciones y el Rey inicia una nueva ronda de consultas para proponer candidato.",
      "Se convocarán elecciones generales en el plazo máximo de sesenta días."
    ],
    "respuestaCorrecta": 0,
    "justificacionIa": "El artículo 114.2 CE dispone: «Si el Congreso adopta una moción de censura, el Gobierno presentará su dimisión al Rey y el candidato incluido en aquélla se entenderá investido de la confianza de la Cámara a los efectos previstos en el artículo 99. El Rey le nombrará Presidente del Gobierno». No hay nuevas consultas ni elecciones.",
    "mnemotecnia": "Moción constructiva: cae un Presidente y entra el candidato de la moción, sin elecciones.",
    "dificultad": 2
  },
  {
    "id": "tai-t06-049",
    "temaOrden": 6,
    "fuente": "CE art. 115.2",
    "enunciado": "Según el artículo 115 de la Constitución, relativo a la disolución de las Cortes Generales, dicha propuesta NO podrá presentarse:",
    "opciones": [
      "En el primer año de legislatura bajo ninguna circunstancia.",
      "Durante la tramitación del proyecto de Presupuestos Generales del Estado.",
      "Cuando esté en trámite una moción de censura.",
      "Durante los períodos extraordinarios de sesiones."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "El art. 115.2 CE dispone que «La propuesta de disolución no podrá presentarse cuando esté en trámite una moción de censura». La Constitución no prevé como límite ninguno de los demás supuestos. El límite temporal del art. 115.3 se cuenta desde la disolución anterior, no desde el inicio de la legislatura.",
    "mnemotecnia": "La moción de censura bloquea el «botón rojo» del Presidente: mientras se tramita, no puede disolver.",
    "dificultad": 1
  },
  {
    "id": "tai-t06-050",
    "temaOrden": 6,
    "fuente": "CE art. 115.3",
    "enunciado": "En relación con el límite para disolver nuevamente las Cortes Generales, el artículo 115.3 de la Constitución dispone que no procederá nueva disolución antes de que transcurra:",
    "opciones": [
      "Seis meses desde la anterior, salvo en caso de declaración del estado de sitio.",
      "Un año desde la anterior, salvo lo dispuesto en el artículo 99, apartado 5.",
      "Dos años desde el comienzo de la legislatura.",
      "Un año desde la toma de posesión del nuevo Gobierno, sin excepciones."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "El artículo 115.3 señala: «No procederá nueva disolución antes de que transcurra un año desde la anterior, salvo lo dispuesto en el artículo 99, apartado 5». El art. 99.5 regula la disolución cuando, transcurridos dos meses desde la primera votación de investidura, ningún candidato ha obtenido la confianza del Congreso.",
    "mnemotecnia": "Tras una disolución hay que esperar 1 año, salvo bloqueo de la investidura (99.5).",
    "dificultad": 2
  },
  {
    "id": "tai-t07-052",
    "temaOrden": 7,
    "fuente": "CE art. 117.1",
    "enunciado": "Conforme al artículo 117.1 de la Constitución, la justicia emana del pueblo y se administra:",
    "opciones": [
      "En nombre de la Nación Española por los Tribunales de Justicia.",
      "En nombre de la Ley por Jueces y Magistrados.",
      "En nombre del Estado por el Consejo General del Poder Judicial.",
      "En nombre del Rey por Jueces y Magistrados."
    ],
    "respuestaCorrecta": 3,
    "justificacionIa": "El artículo 117.1 establece: «La justicia emana del pueblo y se administra en nombre del Rey por Jueces y Magistrados integrantes del poder judicial, independientes, inamovibles, responsables y sometidos únicamente al imperio de la ley».",
    "mnemotecnia": "La justicia emana del Pueblo (origen), se administra en nombre del Rey (símbolo) y la ejercen Jueces y Magistrados.",
    "dificultad": 1
  },
  {
    "id": "tai-t07-053",
    "temaOrden": 7,
    "fuente": "CE art. 122.3",
    "enunciado": "Según el artículo 122.3 de la Constitución, el Consejo General del Poder Judicial estará integrado por el Presidente del Tribunal Supremo, que lo presidirá, y por veinte miembros nombrados por el Rey por un periodo de:",
    "opciones": [
      "Cuatro años.",
      "Cinco años.",
      "Seis años.",
      "Siete años."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "El artículo 122.3 de la CE dispone que los veinte miembros del Consejo General del Poder Judicial son «nombrados por el Rey por un período de cinco años».",
    "mnemotecnia": "Mandatos: Cortes 4 años, CGPJ 5 y Tribunal Constitucional 9.",
    "dificultad": 1
  },
  {
    "id": "tai-t07-054",
    "temaOrden": 7,
    "fuente": "CE art. 124.4",
    "enunciado": "De acuerdo con el artículo 124.4 de la Constitución, ¿cuál es el procedimiento para el nombramiento del Fiscal General del Estado?",
    "opciones": [
      "Es nombrado por el Rey, a propuesta del Consejo General del Poder Judicial, oído el Gobierno.",
      "Es elegido por mayoría absoluta del Congreso de los Diputados, a propuesta del Gobierno.",
      "Es nombrado por el Rey, a propuesta del Gobierno, oído el Consejo General del Poder Judicial.",
      "Es nombrado por el Presidente del Gobierno, previo informe favorable del Consejo General del Poder Judicial."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "El artículo 124.4 CE dispone: «El Fiscal General del Estado será nombrado por el Rey, a propuesta del Gobierno, oído el Consejo General del Poder Judicial». El Gobierno propone; al CGPJ solo se le oye.",
    "mnemotecnia": "Fiscal General: lo PROPONE el Gobierno y se OYE al CGPJ. No al revés.",
    "dificultad": 2
  },
  {
    "id": "tai-t07-055",
    "temaOrden": 7,
    "fuente": "CE art. 117.5",
    "enunciado": "La Constitución prohíbe los Tribunales de excepción. Sin embargo, en su artículo 117.5 reconoce la existencia de la jurisdicción militar. ¿En qué ámbitos permite la Constitución que opere la jurisdicción militar?",
    "opciones": [
      "En el ámbito estrictamente castrense y en los supuestos de estado de sitio.",
      "Sólo en el ámbito castrense y en los supuestos de estado de excepción o sitio.",
      "En el ámbito castrense, y para el enjuiciamiento de civiles en estado de alarma, excepción y sitio.",
      "Únicamente en el ámbito castrense y en tiempo de guerra declarada por las Cortes."
    ],
    "respuestaCorrecta": 0,
    "justificacionIa": "El art. 117.5 CE dispone que «La ley regulará el ejercicio de la jurisdicción militar en el ámbito estrictamente castrense y en los supuestos de estado de sitio, de acuerdo con los principios de la Constitución». No se extiende a los estados de alarma ni de excepción.",
    "mnemotecnia": "Jurisdicción militar = ámbito castrense + estado de SITIO (el más grave). Nunca en alarma ni en excepción.",
    "dificultad": 2
  },
  {
    "id": "tai-t07-056",
    "temaOrden": 7,
    "fuente": "CE art. 123.1",
    "enunciado": "Según el artículo 123.1 de la Constitución, el Tribunal Supremo es el órgano jurisdiccional superior en todos los órdenes. ¿En qué materia NO es el órgano jurisdiccional superior?",
    "opciones": [
      "En lo dispuesto en materia contencioso-administrativa.",
      "En materia de garantías constitucionales.",
      "En lo relativo a la jurisdicción militar.",
      "En el orden jurisdiccional social."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "El artículo 123.1 CE indica que «El Tribunal Supremo, con jurisdicción en toda España, es el órgano jurisdiccional superior en todos los órdenes, salvo lo dispuesto en materia de garantías constitucionales», materia que corresponde al Tribunal Constitucional.",
    "mnemotecnia": "Tribunal Supremo = el más alto en todo, EXCEPTO en garantías constitucionales (ahí manda el TC).",
    "dificultad": 1
  },
  {
    "id": "tai-t07-057",
    "temaOrden": 7,
    "fuente": "CE art. 127.1",
    "enunciado": "Conforme al artículo 127.1 de la Constitución, los Jueces, Magistrados y Fiscales en activo tienen expresamente prohibido:",
    "opciones": [
      "Pertenecer a asociaciones profesionales de su ámbito sectorial.",
      "Ejercer la docencia universitaria a tiempo parcial.",
      "Participar como electores en las elecciones generales.",
      "Pertenecer a partidos políticos o sindicatos."
    ],
    "respuestaCorrecta": 3,
    "justificacionIa": "El artículo 127.1 CE establece: «Los Jueces y Magistrados así como los Fiscales, mientras se hallen en activo, no podrán desempeñar otros cargos públicos, ni pertenecer a partidos políticos o sindicatos». El mismo apartado remite a la ley el sistema y modalidades de asociación profesional.",
    "mnemotecnia": "Jueces y Fiscales en activo: ni partidos ni sindicatos. Asociaciones profesionales, sí.",
    "dificultad": 1
  },
  {
    "id": "tai-t07-058",
    "temaOrden": 7,
    "fuente": "CE art. 125",
    "enunciado": "Un ciudadano es acusado de un delito y su abogado le informa de que el juicio se celebrará mediante la institución del Jurado. Según el artículo 125 de la Constitución, ¿a quién corresponde participar en la Administración de Justicia mediante esta figura?",
    "opciones": [
      "A los miembros de la carrera judicial en situación de excedencia.",
      "A los jueces legos de paz, exclusivamente en los municipios que no sean capital de provincia.",
      "A los ciudadanos, en la forma y con respecto a aquellos procesos penales que la ley determine.",
      "A un tribunal colegiado formado obligatoriamente por cinco ciudadanos y tres magistrados profesionales."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "El artículo 125 CE dispone que «Los ciudadanos podrán ejercer la acción popular y participar en la Administración de Justicia mediante la institución del Jurado, en la forma y con respecto a aquellos procesos penales que la ley determine, así como en los Tribunales consuetudinarios y tradicionales». La Constitución no fija la composición del jurado: remite su diseño a la ley.",
    "mnemotecnia": "Jurado (art. 125): los ciudadanos juzgan, pero solo en los procesos PENALES que diga la ley. La acción popular es otra institución.",
    "dificultad": 2
  },
  {
    "id": "tai-t07-059",
    "temaOrden": 7,
    "fuente": "CE art. 122.1",
    "enunciado": "Según el artículo 122.1 de la Constitución, ¿qué norma es la encargada de determinar la constitución, funcionamiento y gobierno de los Juzgados y Tribunales?",
    "opciones": [
      "La Ley de Enjuiciamiento Civil.",
      "La Ley Orgánica del Poder Judicial.",
      "Un Real Decreto del Consejo de Ministros.",
      "Una Ley Ordinaria de bases del régimen judicial."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "El artículo 122.1 CE señala: «La ley orgánica del poder judicial determinará la constitución, funcionamiento y gobierno de los Juzgados y Tribunales, así como el estatuto jurídico de los Jueces y Magistrados de carrera, que formarán un Cuerpo único, y del personal al servicio de la Administración de Justicia». Es la propia Constitución la que reserva esta materia a ley orgánica.",
    "mnemotecnia": "Todo lo esencial de los Tribunales (constitución, funcionamiento, estatuto de los jueces) = LOPJ.",
    "dificultad": 1
  },
  {
    "id": "tai-t02-016",
    "temaOrden": 8,
    "fuente": "CE art. 132.1",
    "enunciado": "En relación con los bienes de dominio público estatal, el artículo 132.1 de la Constitución determina que los principios que inspiran el régimen jurídico de estos bienes son:",
    "opciones": [
      "Inalienabilidad, imprescriptibilidad y gratuidad.",
      "Inalienabilidad, imprescriptibilidad e inembargabilidad, así como su desafectación.",
      "Inembargabilidad, rentabilidad y publicidad.",
      "Inalienabilidad, imprescriptibilidad e inembargabilidad, sin posibilidad de desafectación."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "El artículo 132.1 dispone que la ley regulará el régimen jurídico de los bienes de dominio público y de los comunales, «inspirándose en los principios de inalienabilidad, imprescriptibilidad e inembargabilidad, así como su desafectación».",
    "mnemotecnia": "Las 3 «IN»: no se vende, no se embarga y no se adquiere por el paso del tiempo (usucapión). Y sí puede desafectarse.",
    "dificultad": 2
  },
  {
    "id": "tai-t08-060",
    "temaOrden": 8,
    "fuente": "CE art. 128.2",
    "enunciado": "De acuerdo con el artículo 128.2 de la Constitución Española, se reconoce la iniciativa pública en la actividad económica. Asimismo, ¿qué medida permite este artículo adoptar mediante ley en relación con los recursos o servicios esenciales?",
    "opciones": [
      "Su reserva al sector público, especialmente en caso de monopolio, y la intervención de empresas cuando así lo exigiere el interés general.",
      "Su privatización obligatoria si generan déficit presupuestario continuo.",
      "La expropiación forzosa sin derecho a indemnización si existe monopolio privado.",
      "La prohibición de cualquier forma de participación de capital extranjero en dichas empresas."
    ],
    "respuestaCorrecta": 0,
    "justificacionIa": "El art. 128.2 CE indica: «Se reconoce la iniciativa pública en la actividad económica. Mediante ley se podrá reservar al sector público recursos o servicios esenciales, especialmente en caso de monopolio y asimismo acordar la intervención de empresas cuando así lo exigiere el interés general».",
    "mnemotecnia": "128.2: el Estado puede ser empresario (iniciativa pública) y, por ley, reservarse servicios esenciales, sobre todo si hay monopolio.",
    "dificultad": 2
  },
  {
    "id": "tai-t08-061",
    "temaOrden": 8,
    "fuente": "CE art. 133.1",
    "enunciado": "El artículo 133.1 de la Constitución establece a quién corresponde la potestad originaria para establecer los tributos. ¿Quién ostenta esta competencia exclusiva?",
    "opciones": [
      "El Estado y las Comunidades Autónomas, de forma concurrente mediante ley.",
      "Las Cortes Generales y el Gobierno, a través de Ley y de Real Decreto Legislativo, respectivamente.",
      "El Estado, las Comunidades Autónomas y las Corporaciones Locales por igual, en sus respectivos ámbitos.",
      "Exclusivamente el Estado, mediante ley."
    ],
    "respuestaCorrecta": 3,
    "justificacionIa": "El artículo 133.1 de la CE dispone: «La potestad originaria para establecer los tributos corresponde exclusivamente al Estado, mediante ley». Las Comunidades Autónomas y las Corporaciones locales pueden establecer y exigir tributos, de acuerdo con la Constitución y las leyes (133.2), pero no tienen la potestad originaria.",
    "mnemotecnia": "Potestad ORIGINARIA = solo el ESTADO. CCAA y entes locales tienen potestad derivada.",
    "dificultad": 2
  },
  {
    "id": "tai-t08-062",
    "temaOrden": 8,
    "fuente": "CE art. 134.3",
    "enunciado": "Según el artículo 134.3 de la Constitución, ¿cuál es el plazo que tiene el Gobierno para presentar ante el Congreso de los Diputados el proyecto de Presupuestos Generales del Estado?",
    "opciones": [
      "Antes del 1 de noviembre del año anterior.",
      "Al menos tres meses antes de la expiración de los del año anterior.",
      "Al menos dos meses antes de la expiración de los del año anterior.",
      "Dentro de los quince primeros días del mes de octubre."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "El artículo 134.3 CE dispone que «El Gobierno deberá presentar ante el Congreso de los Diputados los Presupuestos Generales del Estado al menos tres meses antes de la expiración de los del año anterior». Como expiran el 31 de diciembre, en la práctica la presentación debe hacerse antes del 1 de octubre.",
    "mnemotecnia": "Proyecto de PGE al Congreso: al menos 3 meses antes de que expiren los del año anterior.",
    "dificultad": 2
  },
  {
    "id": "tai-t08-063",
    "temaOrden": 8,
    "fuente": "CE art. 134.6",
    "enunciado": "Conforme al artículo 134.6 de la Constitución, toda proposición o enmienda parlamentaria que suponga un aumento de los créditos presupuestarios requerirá obligatoriamente:",
    "opciones": [
      "El respaldo de una quinta parte de los miembros del Congreso.",
      "Un informe técnico favorable de la Intervención General de la Administración del Estado.",
      "La conformidad del Gobierno para su tramitación.",
      "La aprobación por mayoría absoluta del Congreso de los Diputados."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "El artículo 134.6 CE dispone que «Toda proposición o enmienda que suponga aumento de los créditos o disminución de los ingresos presupuestarios requerirá la conformidad del Gobierno para su tramitación». Es un mecanismo para proteger el equilibrio presupuestario fijado por el Ejecutivo.",
    "mnemotecnia": "Veto presupuestario del Gobierno: si tu enmienda cuesta dinero o quita ingresos, sin el visto bueno del Gobierno no se tramita.",
    "dificultad": 2
  },
  {
    "id": "tai-t08-064",
    "temaOrden": 8,
    "fuente": "CE art. 135.4",
    "enunciado": "El artículo 135 de la Constitución fue reformado en 2011 para consagrar el principio de estabilidad presupuestaria. Según este precepto, los límites de déficit estructural y de volumen de deuda pública sólo podrán superarse en caso de:",
    "opciones": [
      "Catástrofes naturales, recesión económica o situaciones de emergencia extraordinaria que escapen al control del Estado, apreciadas por la mayoría absoluta de los miembros del Congreso de los Diputados.",
      "Catástrofes naturales, recesión económica o situaciones de emergencia extraordinaria que escapen al control del Estado, apreciadas por el Gobierno.",
      "Acuerdo de la Conferencia de Presidentes Autonómicos con el Gobierno, ratificado por mayoría simple de ambas Cámaras.",
      "Cualquier situación de crisis económica general declarada por Real Decreto del Consejo de Ministros."
    ],
    "respuestaCorrecta": 0,
    "justificacionIa": "El art. 135.4 CE dispone que los límites de déficit estructural y de volumen de deuda pública «sólo podrán superarse en caso de catástrofes naturales, recesión económica o situaciones de emergencia extraordinaria que escapen al control del Estado y perjudiquen considerablemente la situación financiera o la sostenibilidad económica o social del Estado, apreciadas por la mayoría absoluta de los miembros del Congreso de los Diputados».",
    "mnemotecnia": "Saltarse los límites del art. 135 exige causa grave (catástrofe, recesión, emergencia) y que lo aprecie la MAYORÍA ABSOLUTA DEL CONGRESO.",
    "dificultad": 3
  },
  {
    "id": "tai-t08-065",
    "temaOrden": 8,
    "fuente": "CE art. 136.2",
    "enunciado": "De acuerdo con el artículo 136 de la Constitución, el Tribunal de Cuentas remite su informe anual, en el que comunica las infracciones o responsabilidades en que, a su juicio, se hubiere incurrido, a:",
    "opciones": [
      "El Rey.",
      "Las Cortes Generales.",
      "El Gobierno.",
      "El Tribunal Supremo."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "El artículo 136.2 CE determina que «El Tribunal de Cuentas, sin perjuicio de su propia jurisdicción, remitirá a las Cortes Generales un informe anual en el que, cuando proceda, comunicará las infracciones o responsabilidades en que, a su juicio, se hubiere incurrido». Depende directamente de las Cortes Generales (art. 136.1).",
    "mnemotecnia": "Tribunal de Cuentas = actúa por delegación de las Cortes, así que su informe anual va a las Cortes.",
    "dificultad": 1
  },
  {
    "id": "tai-t08-066",
    "temaOrden": 8,
    "fuente": "CE art. 134.4",
    "enunciado": "Si la Ley de Presupuestos no se aprueba antes del primer día del ejercicio económico correspondiente, el artículo 134.4 de la Constitución establece que:",
    "opciones": [
      "El Gobierno deberá aprobar unos presupuestos de urgencia por Real Decreto-ley.",
      "El Estado funcionará sin presupuesto formal, limitándose al gasto corriente mínimo ineludible.",
      "Se disuelven las Cortes Generales por bloqueo institucional presupuestario.",
      "Se consideran automáticamente prorrogados los presupuestos del ejercicio anterior hasta la aprobación de los nuevos."
    ],
    "respuestaCorrecta": 3,
    "justificacionIa": "El artículo 134.4 CE dispone: «Si la Ley de Presupuestos no se aprobara antes del primer día del ejercicio económico correspondiente, se considerarán automáticamente prorrogados los Presupuestos del ejercicio anterior hasta la aprobación de los nuevos».",
    "mnemotecnia": "Sin PGE aprobados el 1 de enero = prórroga automática de los del año anterior.",
    "dificultad": 1
  },
  {
    "id": "tai-t09-067",
    "temaOrden": 9,
    "fuente": "CE art. 137",
    "enunciado": "El artículo 137 de la Constitución Española organiza territorialmente el Estado en:",
    "opciones": [
      "Municipios, provincias y en las Comunidades Autónomas que se constituyan.",
      "Municipios, provincias, comarcas y Comunidades Autónomas que se constituyan.",
      "Entidades locales menores, Municipios, Provincias y Regiones.",
      "Municipios, Cabildos, Consejos Insulares, Provincias y Comunidades Autónomas."
    ],
    "respuestaCorrecta": 0,
    "justificacionIa": "El artículo 137 establece: «El Estado se organiza territorialmente en municipios, en provincias y en las Comunidades Autónomas que se constituyan. Todas estas entidades gozan de autonomía para la gestión de sus respectivos intereses». No menciona comarcas ni cabildos.",
    "mnemotecnia": "Art. 137: tres niveles territoriales (MPC): Municipios, Provincias y Comunidades Autónomas.",
    "dificultad": 1
  },
  {
    "id": "tai-t09-068",
    "temaOrden": 9,
    "fuente": "CE art. 140",
    "enunciado": "Según el artículo 140 de la Constitución, los concejales de los Ayuntamientos son elegidos:",
    "opciones": [
      "Por el Pleno de la Diputación Provincial, a propuesta de los partidos con representación municipal.",
      "Por sufragio universal, igual, libre, directo y secreto, por los residentes mayores de edad inscritos en el padrón.",
      "Por los vecinos del municipio mediante sufragio universal, igual, libre, directo y secreto, en la forma establecida por la ley.",
      "Por los vecinos, correspondiendo la elección del Alcalde en todo caso exclusivamente a los concejales."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "El artículo 140 CE dispone que los Concejales «serán elegidos por los vecinos del municipio mediante sufragio universal, igual, libre, directo y secreto, en la forma establecida por la ley» y que «Los Alcaldes serán elegidos por los Concejales o por los vecinos», por lo que la elección del Alcalde no corresponde en todo caso a los concejales.",
    "mnemotecnia": "Concejales: los eligen los vecinos. Alcaldes: los concejales O los vecinos.",
    "dificultad": 2
  },
  {
    "id": "tai-t09-069",
    "temaOrden": 9,
    "fuente": "CE art. 141.1",
    "enunciado": "Conforme al artículo 141.1 de la Constitución, cualquier alteración de los límites provinciales habrá de ser aprobada por:",
    "opciones": [
      "La Asamblea Legislativa de la Comunidad Autónoma afectada.",
      "Las Cortes Generales mediante ley orgánica.",
      "El Gobierno mediante Real Decreto, previa audiencia a las Diputaciones.",
      "El Consejo de Ministros, previo dictamen vinculante del Consejo de Estado."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "El artículo 141.1 CE establece: «La provincia es una entidad local con personalidad jurídica propia, determinada por la agrupación de municipios y división territorial para el cumplimiento de las actividades del Estado. Cualquier alteración de los límites provinciales habrá de ser aprobada por las Cortes Generales mediante ley orgánica».",
    "mnemotecnia": "Límites provinciales = asunto de Estado = Cortes Generales + ley orgánica.",
    "dificultad": 2
  },
  {
    "id": "tai-t09-070",
    "temaOrden": 9,
    "fuente": "CE art. 143.2",
    "enunciado": "Según la vía ordinaria del artículo 143.2 de la Constitución, la iniciativa del proceso autonómico corresponde a todas las Diputaciones interesadas y a las dos terceras partes de los municipios cuya población represente, al menos:",
    "opciones": [
      "La mayoría del censo electoral de cada provincia o isla.",
      "Un tercio del censo electoral de cada provincia o isla.",
      "La mayoría simple del censo electoral de la suma de las provincias implicadas.",
      "Dos tercios del censo electoral de cada provincia."
    ],
    "respuestaCorrecta": 0,
    "justificacionIa": "El art. 143.2 CE atribuye la iniciativa a todas las Diputaciones interesadas o al órgano interinsular correspondiente y «a las dos terceras partes de los municipios cuya población represente, al menos, la mayoría del censo electoral de cada provincia o isla». El requisito se exige en cada provincia o isla, no en el conjunto de ellas.",
    "mnemotecnia": "Iniciativa autonómica (vía ordinaria): 2/3 de los municipios + mayoría del censo de CADA provincia o isla.",
    "dificultad": 3
  },
  {
    "id": "tai-t09-071",
    "temaOrden": 9,
    "fuente": "CE art. 149.1.2ª",
    "enunciado": "De acuerdo con el artículo 149.1 de la Constitución, ¿cuál de las siguientes materias es competencia exclusiva del Estado?",
    "opciones": [
      "La asistencia social.",
      "La ordenación del territorio, el urbanismo y la vivienda.",
      "Nacionalidad, inmigración, emigración, extranjería y derecho de asilo.",
      "La artesanía."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "El art. 149.1.2ª CE atribuye al Estado la competencia exclusiva sobre «Nacionalidad, inmigración, emigración, extranjería y derecho de asilo». La asistencia social (148.1.20ª), la ordenación del territorio, urbanismo y vivienda (148.1.3ª) y la artesanía (148.1.14ª) son materias que las Comunidades Autónomas pueden asumir según el art. 148.",
    "mnemotecnia": "Quién es español y quién entra en el país lo decide solo el Estado (149.1.2ª).",
    "dificultad": 1
  },
  {
    "id": "tai-t09-072",
    "temaOrden": 9,
    "fuente": "CE art. 150.3",
    "enunciado": "El artículo 150.3 de la Constitución permite al Estado dictar leyes que establezcan los principios necesarios para armonizar las disposiciones normativas de las Comunidades Autónomas. ¿Quién debe apreciar la necesidad de dictar dichas leyes?",
    "opciones": [
      "El Gobierno, mediante acuerdo del Consejo de Ministros.",
      "El Tribunal Constitucional, a instancia del Presidente del Gobierno.",
      "El Congreso de los Diputados, por mayoría de tres quintos.",
      "Las Cortes Generales, por mayoría absoluta de cada Cámara."
    ],
    "respuestaCorrecta": 3,
    "justificacionIa": "El artículo 150.3 CE dispone que el Estado podrá dictar leyes de armonización cuando así lo exija el interés general y que «Corresponde a las Cortes Generales, por mayoría absoluta de cada Cámara, la apreciación de esta necesidad».",
    "mnemotecnia": "Leyes de armonización = mayoría absoluta en el Congreso Y en el Senado.",
    "dificultad": 2
  },
  {
    "id": "tai-t09-073",
    "temaOrden": 9,
    "fuente": "CE art. 152.1",
    "enunciado": "Según el artículo 152.1 de la Constitución, en las Comunidades Autónomas cuyos Estatutos se aprobaron por el procedimiento del artículo 151, la organización institucional autonómica se basará en:",
    "opciones": [
      "Una Asamblea Legislativa, un Senado autonómico y un Presidente.",
      "Un Parlamento autonómico, un Delegado del Gobierno y un Tribunal Superior de Justicia.",
      "Un Congreso regional, un Consejo de Gobierno y una Diputación Permanente.",
      "Una Asamblea Legislativa elegida por sufragio universal, un Consejo de Gobierno con funciones ejecutivas y administrativas y un Presidente."
    ],
    "respuestaCorrecta": 3,
    "justificacionIa": "El artículo 152.1 CE establece que la organización institucional autonómica se basará en «una Asamblea Legislativa, elegida por sufragio universal, con arreglo a un sistema de representación proporcional», un Consejo de Gobierno con funciones ejecutivas y administrativas y un Presidente elegido por la Asamblea. El Delegado del Gobierno (art. 154) es un órgano del Estado, no de la Comunidad Autónoma.",
    "mnemotecnia": "Instituciones del 152: Asamblea (legislativo), Consejo de Gobierno (ejecutivo) y Presidente. No hay «Senado autonómico».",
    "dificultad": 1
  },
  {
    "id": "tai-t09-074",
    "temaOrden": 9,
    "fuente": "CE art. 155.1",
    "enunciado": "Para que el Gobierno pueda adoptar las medidas necesarias para obligar a una Comunidad Autónoma al cumplimiento forzoso de sus obligaciones constitucionales o legales, el artículo 155.1 de la Constitución exige:",
    "opciones": [
      "Un requerimiento previo al Presidente de la Comunidad Autónoma y, en caso de no ser atendido, la aprobación por mayoría absoluta del Congreso de los Diputados.",
      "Un requerimiento previo al Presidente de la Comunidad Autónoma y, en caso de no ser atendido, la aprobación por mayoría absoluta del Senado.",
      "Únicamente la aprobación por mayoría de tres quintos del Senado, como cámara de representación territorial.",
      "El dictamen vinculante del Tribunal Constitucional autorizando la intervención de la autonomía."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "El artículo 155.1 de la CE exige dos pasos: «previo requerimiento al Presidente de la Comunidad Autónoma y, en el caso de no ser atendido, con la aprobación por mayoría absoluta del Senado», el Gobierno podrá adoptar las medidas necesarias.",
    "mnemotecnia": "Art. 155 = requerimiento previo al Presidente autonómico + mayoría absoluta del SENADO.",
    "dificultad": 2
  },
  {
    "id": "tai-t10-075",
    "temaOrden": 10,
    "fuente": "CE art. 159.1",
    "enunciado": "Según el artículo 159.1 de la Constitución, el Tribunal Constitucional se compone de 12 miembros nombrados por el Rey. De ellos, ¿cuántos son propuestos por el Congreso de los Diputados?",
    "opciones": [
      "Dos, por mayoría de tres quintos de sus miembros.",
      "Cuatro, por mayoría absoluta de sus miembros.",
      "Cuatro, por mayoría de tres quintos de sus miembros.",
      "Seis, por mayoría de dos tercios de sus miembros."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "El artículo 159.1 CE indica la procedencia de los doce miembros: «cuatro a propuesta del Congreso por mayoría de tres quintos de sus miembros; cuatro a propuesta del Senado, con idéntica mayoría; dos a propuesta del Gobierno, y dos a propuesta del Consejo General del Poder Judicial».",
    "mnemotecnia": "Los 12 del TC: 4 Congreso, 4 Senado, 2 Gobierno y 2 CGPJ. En las Cámaras, por 3/5.",
    "dificultad": 2
  },
  {
    "id": "tai-t10-076",
    "temaOrden": 10,
    "fuente": "CE art. 159.2",
    "enunciado": "Según el artículo 159.2 de la Constitución, los miembros del Tribunal Constitucional deberán ser nombrados entre Magistrados y Fiscales, Profesores de Universidad, funcionarios públicos y Abogados, que reúnan las siguientes condiciones:",
    "opciones": [
      "Ser juristas de reconocida competencia con más de quince años de ejercicio profesional.",
      "Ser juristas de reconocida competencia con más de diez años de ejercicio profesional.",
      "Ser Licenciados o Graduados en Derecho, con más de quince años de servicio activo en la Administración del Estado.",
      "Tener más de veinte años de ejercicio en cualquier rama de las ciencias jurídicas o sociales."
    ],
    "respuestaCorrecta": 0,
    "justificacionIa": "El artículo 159.2 de la Constitución exige que sean «todos ellos juristas de reconocida competencia con más de quince años de ejercicio profesional».",
    "mnemotecnia": "TC: juristas de reconocida competencia con MÁS DE 15 años. No basta con 10 ni hacen falta 20.",
    "dificultad": 1
  },
  {
    "id": "tai-t10-077",
    "temaOrden": 10,
    "fuente": "CE art. 159.3",
    "enunciado": "Según el artículo 159.3 de la Constitución, los miembros del Tribunal Constitucional serán designados por un período de:",
    "opciones": [
      "Nueve años, y se renovarán por terceras partes cada tres.",
      "Cinco años, y se renovarán en su totalidad al finalizar el mandato.",
      "Siete años, y se renovarán por mitades cada tres años y medio.",
      "Nueve años, y se renovarán por cuartas partes cada tres años."
    ],
    "respuestaCorrecta": 0,
    "justificacionIa": "El artículo 159.3 CE dispone: «Los miembros del Tribunal Constitucional serán designados por un período de nueve años y se renovarán por terceras partes cada tres».",
    "mnemotecnia": "TC: 9 años, y se renueva un tercio (4 de los 12 magistrados) cada 3 años. 3 × 3 = 9.",
    "dificultad": 1
  },
  {
    "id": "tai-t10-078",
    "temaOrden": 10,
    "fuente": "CE art. 162.1.a",
    "enunciado": "Una Asamblea Legislativa de una Comunidad Autónoma aprueba una ley que, según 40 Senadores y el Defensor del Pueblo, vulnera el reparto competencial de la Constitución. De acuerdo con el artículo 162.1.a) de la CE, ¿están legitimados para interponer el recurso de inconstitucionalidad contra dicha ley autonómica?",
    "opciones": [
      "Ambos están legitimados de forma conjunta, sumando sus firmas en un único escrito de interposición.",
      "Ni el Defensor del Pueblo ni los 40 Senadores pueden recurrir, pues contra leyes autonómicas la Constitución sólo legitima al Presidente del Gobierno y a la jurisdicción ordinaria.",
      "El Defensor del Pueblo sí está legitimado por sí solo, pero los 40 Senadores no, por no alcanzar el número mínimo exigido.",
      "Los 40 Senadores pueden recurrir al ser cámara territorial, pero el Defensor del Pueblo carece de legitimación para impugnar normas autonómicas."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "El artículo 162.1.a) legitima para interponer el recurso de inconstitucionalidad al Presidente del Gobierno, al Defensor del Pueblo, a 50 Diputados, a 50 Senadores, a los órganos colegiados ejecutivos de las Comunidades Autónomas y, en su caso, a sus Asambleas. 40 Senadores no alcanzan el mínimo de 50; el Defensor del Pueblo está legitimado por sí solo.",
    "mnemotecnia": "Recurso de inconstitucionalidad: el «billete» parlamentario es de 50, sean Diputados o Senadores. 40 no bastan.",
    "dificultad": 3
  },
  {
    "id": "tai-t10-079",
    "temaOrden": 10,
    "fuente": "CE art. 163; LOTC art. 35.3",
    "enunciado": "Un órgano judicial considera que una norma con rango de ley aplicable al caso, de cuya validez depende el fallo, puede ser contraria a la Constitución. Según el artículo 163 CE, la cuestión que plantee ante el Tribunal Constitucional tendrá los supuestos, forma y efectos que establezca la ley, con un límite constitucional expreso. ¿Cuál?",
    "opciones": [
      "Que el juez deberá abstenerse y remitir los autos al Tribunal Supremo.",
      "Que producirá la nulidad de las actuaciones practicadas desde la entrada en vigor de la ley cuestionada.",
      "Que solo podrá plantearse a instancia de alguna de las partes del proceso.",
      "Que sus efectos en ningún caso serán suspensivos."
    ],
    "respuestaCorrecta": 3,
    "justificacionIa": "El art. 163 CE dispone que el órgano judicial planteará la cuestión «en los supuestos, en la forma y con los efectos que establezca la ley, que en ningún caso serán suspensivos». Este límite se refiere a la vigencia de la ley cuestionada, que sigue aplicándose. No impide que la LOTC (art. 35.3) suspenda provisionalmente el proceso concreto en el que se plantea la cuestión.",
    "mnemotecnia": "La cuestión de inconstitucionalidad no suspende la LEY. El proceso concreto sí queda en pausa, pero eso lo dice la LOTC, no la CE.",
    "dificultad": 3
  },
  {
    "id": "tai-t10-080",
    "temaOrden": 10,
    "fuente": "CE art. 161.2",
    "enunciado": "De acuerdo con el artículo 161.2 de la Constitución, cuando el Gobierno impugne ante el Tribunal Constitucional disposiciones y resoluciones adoptadas por los órganos de las Comunidades Autónomas, se producirá su suspensión. ¿En qué plazo máximo deberá el Tribunal ratificarla o levantarla?",
    "opciones": [
      "En un plazo no superior a tres meses.",
      "En un plazo no superior a cinco meses.",
      "En un plazo improrrogable de un año.",
      "Dentro de los veinte días siguientes a la admisión del recurso."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "El artículo 161.2 establece que la impugnación por el Gobierno producirá la suspensión de la disposición o resolución recurrida, «pero el Tribunal, en su caso, deberá ratificarla o levantarla en un plazo no superior a cinco meses».",
    "mnemotecnia": "Art. 161.2: el Gobierno frena la norma con la mano; la mano tiene 5 dedos = 5 meses para que el TC decida.",
    "dificultad": 1
  },
  {
    "id": "tai-t10-081",
    "temaOrden": 10,
    "fuente": "CE art. 161.1.b",
    "enunciado": "Según el artículo 161.1 de la Constitución, el Tribunal Constitucional tiene jurisdicción en todo el territorio español y es competente, entre otras materias, para conocer:",
    "opciones": [
      "Del recurso de amparo por violación de los derechos y libertades referidos en el artículo 53.2 de la Constitución.",
      "Del recurso de casación para la unificación de doctrina en materia de derechos fundamentales.",
      "De los conflictos de jurisdicción que surjan entre la Administración Pública y los Juzgados y Tribunales.",
      "Del enjuiciamiento criminal del Presidente del Gobierno y de los Ministros por delitos de traición."
    ],
    "respuestaCorrecta": 0,
    "justificacionIa": "El artículo 161.1.b) de la CE atribuye al TC el conocimiento «Del recurso de amparo por violación de los derechos y libertades referidos en el artículo 53, 2, de esta Constitución, en los casos y formas que la ley establezca». La casación y el enjuiciamiento penal de los miembros del Gobierno (art. 102) corresponden al Tribunal Supremo.",
    "mnemotecnia": "Competencias clásicas del TC (art. 161): inconstitucionalidad, amparo y conflictos de competencia Estado-CCAA.",
    "dificultad": 2
  },
  {
    "id": "tai-t10-082",
    "temaOrden": 10,
    "fuente": "CE art. 160",
    "enunciado": "El artículo 160 de la Constitución dispone el procedimiento para nombrar al Presidente del Tribunal Constitucional. ¿Cómo y por cuánto tiempo se realiza dicho nombramiento?",
    "opciones": [
      "Será nombrado entre sus miembros por el Rey, a propuesta del Gobierno, por un período de tres años.",
      "Será nombrado por el Congreso de los Diputados, a propuesta del Consejo General del Poder Judicial, por un período de cinco años.",
      "Será nombrado por el Rey, a propuesta conjunta de las Cortes Generales, por un período inamovible de nueve años.",
      "Será nombrado entre sus miembros por el Rey, a propuesta del mismo Tribunal en pleno y por un período de tres años."
    ],
    "respuestaCorrecta": 3,
    "justificacionIa": "El artículo 160 de la CE señala: «El Presidente del Tribunal Constitucional será nombrado entre sus miembros por el Rey, a propuesta del mismo Tribunal en pleno y por un período de tres años».",
    "mnemotecnia": "Presidente del TC: lo eligen sus compañeros (el Pleno) y dura 3 años, un tercio del mandato de 9.",
    "dificultad": 1
  },
  {
    "id": "tai-t11-083",
    "temaOrden": 11,
    "fuente": "CE arts. 166 y 87",
    "enunciado": "Según los artículos 166 y 87 de la Constitución Española, ¿puede iniciarse un procedimiento de reforma constitucional mediante una iniciativa legislativa popular?",
    "opciones": [
      "Sí, siempre que la proposición cuente con al menos quinientas mil firmas acreditadas y no afecte al Título Preliminar.",
      "Sí, pero requiere el aval previo del cincuenta por ciento de los Ayuntamientos españoles.",
      "No, porque el artículo 166 solo admite la iniciativa de reforma en los términos de los apartados 1 y 2 del artículo 87, lo que excluye la iniciativa popular.",
      "No, salvo que la iniciativa popular sea ratificada en el plazo de quince días por la Mesa del Congreso de los Diputados."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "El art. 166 CE dispone que «La iniciativa de reforma constitucional se ejercerá en los términos previstos en los apartados 1 y 2 del artículo 87». Al no remitir al apartado 3, que regula la iniciativa popular, esta queda excluida para la reforma constitucional. La exclusión no está en la lista de materias vetadas del art. 87.3, sino que deriva de esa remisión.",
    "mnemotecnia": "La iniciativa popular NO sirve para reformar la Constitución: solo Gobierno, Congreso, Senado y Asambleas de las CCAA.",
    "dificultad": 2
  },
  {
    "id": "tai-t11-084",
    "temaOrden": 11,
    "fuente": "CE art. 167.1",
    "enunciado": "De acuerdo con el procedimiento ordinario de reforma constitucional, consagrado en el artículo 167.1 de la Constitución, los proyectos de reforma deberán ser aprobados por una mayoría de:",
    "opciones": [
      "Dos tercios de cada una de las Cámaras.",
      "Tres quintos de cada una de las Cámaras.",
      "Mayoría absoluta del Congreso y tres quintos del Senado.",
      "Tres quintos del Congreso, bastando la mayoría absoluta del Senado si el texto no sufre enmiendas."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "El artículo 167.1 CE exige: «Los proyectos de reforma constitucional deberán ser aprobados por una mayoría de tres quintos de cada una de las Cámaras». Otras mayorías operan como salida al bloqueo (167.2) o en la vía agravada (168).",
    "mnemotecnia": "Reforma ordinaria (167) = tres quintos. Reforma agravada (168) = dos tercios.",
    "dificultad": 1
  },
  {
    "id": "tai-t11-085",
    "temaOrden": 11,
    "fuente": "CE art. 167.2",
    "enunciado": "Durante la tramitación de una reforma constitucional por la vía del artículo 167 no hay acuerdo entre las Cámaras. Se crea una Comisión paritaria que presenta un texto, pero éste no logra los tres quintos en el Senado, obteniendo solo mayoría absoluta. Si el Congreso decidiera seguir adelante con la reforma, ¿qué exigencia le impone el artículo 167.2 para poder aprobarla?",
    "opciones": [
      "Aprobar el texto de la Comisión por mayoría de tres quintos, supliendo así el déficit de votos del Senado.",
      "Someter obligatoriamente el texto a referéndum nacional antes de su votación definitiva en el Congreso.",
      "Modificar el texto para recoger las objeciones del Senado y volver a remitirlo a la Cámara Alta.",
      "Aprobar la reforma por mayoría de dos tercios del Congreso."
    ],
    "respuestaCorrecta": 3,
    "justificacionIa": "El art. 167.2 CE dispone que, si no se logra la aprobación por el procedimiento del apartado anterior, «y siempre que el texto hubiere obtenido el voto favorable de la mayoría absoluta del Senado, el Congreso, por mayoría de dos tercios, podrá aprobar la reforma».",
    "mnemotecnia": "Si el Senado se queda en mayoría absoluta, el Congreso puede salvar la reforma, pero pagando peaje: dos tercios.",
    "dificultad": 3
  },
  {
    "id": "tai-t11-086",
    "temaOrden": 11,
    "fuente": "CE art. 167.3",
    "enunciado": "En el procedimiento ordinario de reforma constitucional (artículo 167), ¿en qué supuesto será sometida a referéndum para su ratificación la reforma aprobada por las Cortes Generales?",
    "opciones": [
      "Cuando lo acuerde el Presidente del Gobierno, previa autorización de la mayoría absoluta del Congreso de los Diputados.",
      "Obligatoriamente en todos los casos, debiendo convocarse en el plazo de sesenta días tras su publicación.",
      "Cuando lo solicite, dentro de los quince días siguientes a su aprobación, una décima parte de los miembros de cualquiera de las Cámaras.",
      "Cuando lo solicite al menos una quinta parte de los Diputados o una quinta parte de los Senadores, en el plazo de treinta días."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "El artículo 167.3 CE dispone que la reforma aprobada por las Cortes Generales «será sometida a referéndum para su ratificación cuando así lo soliciten, dentro de los quince días siguientes a su aprobación, una décima parte de los miembros de cualquiera de las Cámaras».",
    "mnemotecnia": "Referéndum en la reforma ordinaria: lo pide 1/10 de una Cámara en 15 días (regla del 10/15).",
    "dificultad": 2
  },
  {
    "id": "tai-t11-087",
    "temaOrden": 11,
    "fuente": "CE art. 168.1",
    "enunciado": "Según el artículo 168.1 de la Constitución, la aplicación del procedimiento agravado de reforma es obligatoria cuando se proponga la revisión total del texto o una parcial que afecte a:",
    "opciones": [
      "El Título Preliminar, al Capítulo segundo, Sección primera del Título I, o al Título II (De la Corona).",
      "El Título Preliminar, al Capítulo primero, Sección primera del Título I, o al Título VIII (De la Organización Territorial del Estado).",
      "Cualquier precepto contenido dentro del Título I (De los derechos y deberes fundamentales) en su integridad.",
      "El Título II (De la Corona), el Título III (De las Cortes Generales) y el Título VI (Del Poder Judicial)."
    ],
    "respuestaCorrecta": 0,
    "justificacionIa": "El artículo 168.1 CE limita la vía agravada, además de a la revisión total, a la reforma parcial que afecte «al Título preliminar, al Capítulo segundo, Sección primera del Título I, o al Título II». Todo lo demás, incluidos el Título VIII y la Sección segunda del Capítulo segundo del Título I, se reforma por la vía ordinaria del 167.",
    "mnemotecnia": "El «núcleo duro» (vía 168): Título Preliminar, derechos fundamentales de la Sección 1ª y la Corona (Título II).",
    "dificultad": 1
  },
  {
    "id": "tai-t11-088",
    "temaOrden": 11,
    "fuente": "CE art. 168.1",
    "enunciado": "Conforme al artículo 168.1 de la Constitución, en un proceso de reforma constitucional por la vía agravada, ¿qué paso procedimental sigue de forma inmediata a la aprobación del principio de reforma por mayoría de dos tercios de cada Cámara?",
    "opciones": [
      "La redacción del nuevo texto constitucional por una ponencia conjunta designada al efecto.",
      "La disolución inmediata de las Cortes Generales.",
      "La convocatoria automática de un referéndum consultivo para refrendar la decisión de las Cortes.",
      "La sanción y promulgación del texto por el Rey en el plazo de quince días."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "El artículo 168.1 CE dispone que «se procederá a la aprobación del principio por mayoría de dos tercios de cada Cámara, y a la disolución inmediata de las Cortes». Las nuevas Cámaras elegidas deberán ratificar la decisión, estudiar el nuevo texto y aprobarlo.",
    "mnemotecnia": "Reforma agravada: las Cortes aprueban la idea e inmediatamente se disuelven.",
    "dificultad": 2
  },
  {
    "id": "tai-t11-089",
    "temaOrden": 11,
    "fuente": "CE art. 168.3",
    "enunciado": "En el procedimiento agravado de reforma constitucional (artículo 168), una vez que las nuevas Cortes Generales han ratificado la decisión y aprobado el nuevo texto constitucional, ¿es exigible su sometimiento a referéndum?",
    "opciones": [
      "Sí, la reforma aprobada será sometida a referéndum para su ratificación en todo caso.",
      "No, salvo que lo solicite expresamente una décima parte de los miembros del Congreso o del Senado.",
      "No, el referéndum queda reservado exclusivamente para el procedimiento ordinario del artículo 167.",
      "Solo será preceptivo si la reforma altera sustancialmente el régimen electoral o la Jefatura del Estado."
    ],
    "respuestaCorrecta": 0,
    "justificacionIa": "El artículo 168.3 CE establece: «Aprobada la reforma por las Cortes Generales, será sometida a referéndum para su ratificación». A diferencia de la vía ordinaria, donde es facultativo, en la agravada es siempre obligatorio.",
    "mnemotecnia": "Vía agravada (168): el referéndum NO es a petición, es OBLIGATORIO siempre.",
    "dificultad": 1
  },
  {
    "id": "tai-t11-090",
    "temaOrden": 11,
    "fuente": "CE art. 169",
    "enunciado": "Durante la vigencia de un estado de alarma declarado y prorrogado con arreglo a la ley, varios grupos parlamentarios registran una proposición en el Congreso para iniciar una reforma parcial de la Constitución. De acuerdo con el artículo 169 de la Constitución, ¿es lícito iniciar esta reforma?",
    "opciones": [
      "Sí, el estado de alarma no impide iniciar reformas constitucionales, limitación que la Constitución reserva en exclusiva a los estados de excepción y de sitio.",
      "Sí, pero la posterior disolución de las Cámaras (si fuera vía agravada) o el referéndum quedarán paralizados hasta que finalice el estado de alarma.",
      "No, a menos que la toma en consideración sea respaldada por la unanimidad de los Plenos del Congreso y del Senado.",
      "No, la Constitución prohíbe iniciar la reforma constitucional en tiempo de guerra o de vigencia de cualquiera de los estados previstos en el artículo 116."
    ],
    "respuestaCorrecta": 3,
    "justificacionIa": "El artículo 169 de la CE dispone: «No podrá iniciarse la reforma constitucional en tiempo de guerra o de vigencia de alguno de los estados previstos en el artículo 116». El estado de alarma es uno de ellos, así que la prohibición se aplica sin salvedades.",
    "mnemotecnia": "Art. 169: con guerra, alarma, excepción o sitio NO se puede ni empezar a reformar la Constitución.",
    "dificultad": 3
  },
  {
    "id": "tai-t12-091",
    "temaOrden": 12,
    "fuente": "ISO/IEC 80000-13",
    "enunciado": "Un byte se compone de 8 bits. Atendiendo al sistema de numeración binaria, ¿cuál es el número total de valores diferentes que puede representar un solo byte?",
    "opciones": [
      "64 valores.",
      "128 valores.",
      "256 valores.",
      "512 valores."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "Cada bit admite 2 estados (0 o 1), así que 8 bits permiten 2^8 combinaciones: 256 valores distintos, que como entero sin signo van del 0 al 255.",
    "mnemotecnia": "8 bits = 2^8 = 256. Por eso cada octeto de una IPv4 o cada canal RGB va de 0 a 255.",
    "dificultad": 1
  },
  {
    "id": "tai-t12-097",
    "temaOrden": 12,
    "fuente": "NIST, Prefixes for binary multiples (IEC)",
    "enunciado": "De acuerdo con los prefijos binarios normalizados por la Comisión Electrotécnica Internacional (IEC), que se distinguen de los prefijos del Sistema Internacional (SI) basados en potencias de 10, ¿cuál es la equivalencia exacta de un mebibyte (1 MiB)?",
    "opciones": [
      "1.000 kilobytes (kB).",
      "1.000.000 de bytes exactos.",
      "1.024 kilobytes decimales (kB).",
      "1.024 kibibytes (KiB)."
    ],
    "respuestaCorrecta": 3,
    "justificacionIa": "Los prefijos binarios (kibi, mebi, gibi) designan potencias de 2. Así, 1 mebibyte (2^20 bytes) equivale exactamente a 1.024 kibibytes (2^10 bytes cada uno). Los prefijos kilo y mega del SI son potencias de 10: 1 MB son 1.000.000 de bytes.",
    "mnemotecnia": "Kibi, Mebi, Gibi, Tebi = base binaria (1.024). Kilo, Mega, Giga, Tera = base decimal (1.000).",
    "dificultad": 2
  },
  {
    "id": "tai-t12-098",
    "temaOrden": 12,
    "fuente": "USB-IF, USB Charger (USB Power Delivery): USB PD 3.1 hasta 240 W sobre USB Type-C",
    "enunciado": "En las especificaciones del estándar USB, ¿qué tipo de conector se diseñó con una disposición de pines simétrica (lo que lo hace reversible al insertarlo), permite entregar hasta 240 W con USB Power Delivery y puede transportar señales de vídeo mediante modos alternativos como DisplayPort?",
    "opciones": [
      "El conector USB Type-A tradicional.",
      "El conector USB Type-C.",
      "El conector Micro-USB Type-B SuperSpeed.",
      "El conector Mini-USB."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "El conector USB Type-C introdujo un diseño con pines simétricos que evita el problema de la orientación al enchufar. Además, es el conector asociado a USB4, a los perfiles avanzados de USB Power Delivery (hasta 240 W) y a los modos alternativos (Alternate Modes), como DisplayPort o Thunderbolt.",
    "mnemotecnia": "USB-C: C de «cualquier lado» (reversible) y de «carga y pantalla» (Power Delivery y modo DisplayPort).",
    "dificultad": 2
  },
  {
    "id": "tai-t13-099",
    "temaOrden": 13,
    "fuente": "POSIX.1-2017, System Interfaces cap. 2, política SCHED_RR",
    "enunciado": "En un sistema operativo con planificación expulsiva por turno rotatorio (Round Robin), un proceso en estado «Ejecución» agota el cuanto de tiempo (quantum) que tenía asignado, sin haber solicitado ninguna operación de entrada/salida. Según el modelo estándar de estados, ¿a qué estado pasa inmediatamente este proceso?",
    "opciones": [
      "Al estado «Bloqueado» o «En espera», aguardando a que el usuario introduzca nuevas órdenes por teclado.",
      "Al estado «Terminado», ya que el sistema operativo finaliza forzosamente las tareas que exceden la cuota en su primer intento.",
      "Al estado «Listo» o «Preparado», reincorporándose a la cola de procesos que compiten por volver a usar la CPU.",
      "Se mantiene en el estado «Ejecución», pero el planificador le degrada temporalmente la prioridad hasta que haya ciclos ociosos."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "Al agotarse el quantum, la interrupción del reloj provoca una expulsión (preemption). Como el proceso no espera a ningún periférico y aún tiene trabajo pendiente, el sistema operativo lo desaloja y lo pasa al estado «Listo», al final de la cola correspondiente.",
    "mnemotecnia": "Se te acaba el tiempo = vuelves a la cola de «Listos». Solo pasas a «Bloqueado» si tienes que esperar de verdad a un dato del disco o la red.",
    "dificultad": 3
  },
  {
    "id": "tai-t13-101",
    "temaOrden": 13,
    "fuente": "POSIX.1-2017 (IEEE Std 1003.1), File Access Permissions",
    "enunciado": "Un administrador de sistemas Linux ejecuta el comando `chmod 750 archivo.txt`. De acuerdo con la representación octal de los permisos de UNIX, ¿qué permisos tendrá el grupo propietario sobre el archivo?",
    "opciones": [
      "Lectura, escritura y ejecución.",
      "Lectura y escritura, sin permiso de ejecución.",
      "Ningún permiso, ya que el cero final se aplica al grupo.",
      "Lectura y ejecución, sin permiso de escritura."
    ],
    "respuestaCorrecta": 3,
    "justificacionIa": "En la notación octal, los tres dígitos se aplican, por orden, al usuario propietario (u), al grupo (g) y a los demás (o). El 7 da al usuario lectura, escritura y ejecución (4+2+1); el 5 da al grupo lectura y ejecución (4+1); y el 0 deja a los demás sin ningún permiso.",
    "mnemotecnia": "Lectura = 4, escritura = 2, ejecución = 1. Un 5 en el grupo es 4 + 1: lectura y ejecución.",
    "dificultad": 3
  },
  {
    "id": "tai-t13-103",
    "temaOrden": 13,
    "fuente": "Documentación del kernel Linux, ext4: Directory Entries",
    "enunciado": "En los sistemas de archivos derivados de UNIX (como ext4), la información administrativa de cada archivo se separa de su contenido y de su ubicación en el árbol de directorios. ¿Qué dato NO se almacena dentro de un inodo (nodo-i)?",
    "opciones": [
      "El nombre del archivo.",
      "El tamaño del archivo en bytes.",
      "El identificador del usuario propietario (UID).",
      "Los permisos de acceso (modo)."
    ],
    "respuestaCorrecta": 0,
    "justificacionIa": "El inodo contiene los metadatos del archivo: tamaño, permisos, propietario, fechas y punteros a los bloques de datos. El nombre se guarda en el directorio, que asocia cada nombre con un número de inodo. Por eso un mismo inodo puede tener varios nombres (enlaces duros).",
    "mnemotecnia": "El inodo es el DNI del archivo: tiene todos sus datos menos el nombre, que se lo pone el directorio que lo contiene.",
    "dificultad": 2
  },
  {
    "id": "tai-t13-104",
    "temaOrden": 13,
    "fuente": "Microsoft Learn, Windows registry information for advanced users",
    "enunciado": "En la jerarquía del Registro de Windows, ¿qué clave raíz contiene la información de configuración del equipo local (hardware, controladores y software instalado) que se aplica a todos los usuarios del sistema?",
    "opciones": [
      "HKEY_CURRENT_USER",
      "HKEY_CLASSES_ROOT",
      "HKEY_USERS",
      "HKEY_LOCAL_MACHINE"
    ],
    "respuestaCorrecta": 3,
    "justificacionIa": "HKEY_LOCAL_MACHINE (HKLM) almacena la configuración del equipo en su conjunto, como los controladores de dispositivo y los servicios, con independencia del usuario que inicie sesión. HKEY_CURRENT_USER guarda la configuración del usuario con la sesión iniciada y HKEY_USERS, la de todos los perfiles cargados.",
    "mnemotecnia": "LOCAL MACHINE = la máquina: lo que afecta al equipo entero y a todos sus usuarios va aquí.",
    "dificultad": 1
  },
  {
    "id": "tai-t13-105",
    "temaOrden": 13,
    "fuente": "Documentación del kernel Linux, mm/page_tables: MMU, TLB, and Page Faults",
    "enunciado": "En un sistema con memoria virtual basada en paginación bajo demanda, ¿qué sucede cuando un proceso intenta acceder a una dirección lógica cuya página tiene el bit de presencia a cero (es decir, no está cargada en la memoria RAM)?",
    "opciones": [
      "El proceso termina inmediatamente emitiendo un volcado de memoria (core dump).",
      "El disco escribe directamente los datos que faltan en la memoria caché L1, sin pasar por la CPU.",
      "La Unidad de Gestión de Memoria (MMU) genera una excepción conocida como fallo de página (page fault).",
      "Se produce un desbordamiento de pila (stack overflow) que detiene la ejecución del núcleo del sistema."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "Al acceder a una página ausente, la MMU genera una excepción de fallo de página (page fault). Se interrumpe la instrucción en curso y el sistema operativo toma el control: lee la página del almacenamiento secundario, la carga en RAM, actualiza la tabla de páginas y reanuda la instrucción.",
    "mnemotecnia": "Vas a leer una página del libro y no está en la mesa (RAM) = FALLO DE PÁGINA. El sistema la trae de la estantería (disco) y sigues leyendo.",
    "dificultad": 2
  },
  {
    "id": "tai-t13-106",
    "temaOrden": 13,
    "fuente": "POSIX.1-2017, Base Definitions cap. 3, definición de Thread",
    "enunciado": "¿Qué conjunto de elementos pertenece de forma exclusiva a cada hilo (thread) y NO se comparte con los demás hilos del mismo proceso?",
    "opciones": [
      "El espacio de direcciones de memoria y los descriptores de archivos abiertos.",
      "Las variables globales, el código ejecutable y las credenciales de seguridad.",
      "El contador de programa, los registros del procesador y la pila (stack).",
      "Los sockets de red activos y los permisos de usuario."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "Los hilos de un proceso comparten el espacio de direcciones, las variables globales, los archivos abiertos y demás recursos del proceso. Cada hilo mantiene su propio estado de ejecución: el contador de programa (por dónde va), los registros y su propia pila para las llamadas y variables locales.",
    "mnemotecnia": "En una casa (proceso), los hermanos (hilos) comparten el salón y la nevera (memoria y archivos), pero cada uno tiene su cuaderno (registros) y su mochila (pila).",
    "dificultad": 2
  },
  {
    "id": "tai-t14-108",
    "temaOrden": 14,
    "fuente": "Oracle, The Java Tutorials: Polymorphism",
    "enunciado": "Dentro de la Programación Orientada a Objetos (POO), el principio que permite a objetos de distintas clases responder de forma diferente a la llamada a un mismo método se denomina:",
    "opciones": [
      "Abstracción de datos.",
      "Herencia múltiple.",
      "Encapsulamiento.",
      "Polimorfismo."
    ],
    "respuestaCorrecta": 3,
    "justificacionIa": "El polimorfismo es la propiedad por la que una misma operación se comporta de forma distinta según el objeto sobre el que se invoca. Suele implementarse mediante enlace dinámico (dynamic binding), con clases derivadas de una misma clase base o que implementan una interfaz común.",
    "mnemotecnia": "Poli (muchas) + morfos (formas): si le dices «habla()» a un Perro, ladra; si se lo dices a un Gato, maúlla.",
    "dificultad": 2
  },
  {
    "id": "tai-t14-109",
    "temaOrden": 14,
    "fuente": "Java Language Specification SE 21, §8.4.1",
    "enunciado": "En Java, cuando se pasa una variable de tipo primitivo (por ejemplo, un `int`) como argumento a un método y dicho método le asigna internamente un nuevo valor, ¿qué ocurre con la variable original tras finalizar la llamada?",
    "opciones": [
      "Mantiene su valor original, puesto que Java pasa los tipos primitivos copiando su valor.",
      "Adopta el nuevo valor de forma permanente, ya que en Java el paso de parámetros primitivos se realiza por referencia.",
      "Se lanza una excepción en tiempo de ejecución por intentar modificar un argumento de ámbito externo.",
      "Pierde su tipo primitivo y se convierte automáticamente (autoboxing) en un objeto inmutable de la clase Integer."
    ],
    "respuestaCorrecta": 0,
    "justificacionIa": "En Java el paso de parámetros es siempre por valor: al invocar el método, el valor del argumento se copia en una nueva variable local (el parámetro). Si el método reasigna esa copia, la variable original del código que hizo la llamada no cambia.",
    "mnemotecnia": "Java pasa los primitivos como una fotocopia: si el método la tacha, tu original sigue intacto.",
    "dificultad": 3
  },
  {
    "id": "tai-t14-110",
    "temaOrden": 14,
    "fuente": "Java Virtual Machine Specification SE 21, §1.2",
    "enunciado": "La portabilidad de Java se resume en el lema «escribe una vez, ejecuta en cualquier parte». ¿Qué formato intermedio generado por su compilador permite que el programa no quede atado a la arquitectura de hardware de la máquina donde se compiló?",
    "opciones": [
      "El código ensamblador del procesador predominante, emulado mediante una capa de compatibilidad del kernel.",
      "Un archivo binario nativo enlazado dinámicamente con las bibliotecas POSIX del sistema anfitrión.",
      "Un script de texto plano minificado que el navegador interpreta mediante su motor V8.",
      "El bytecode, almacenado habitualmente en archivos `.class` que después ejecuta la máquina virtual de Java."
    ],
    "respuestaCorrecta": 3,
    "justificacionIa": "El compilador `javac` no genera código máquina de un procesador concreto (x86, ARM), sino bytecode, un formato intermedio neutral que se guarda en archivos `.class`. La máquina virtual de Java (JVM), que sí es específica de cada plataforma, se encarga de ejecutarlo, interpretándolo o compilándolo en tiempo de ejecución (JIT).",
    "mnemotecnia": "Código Java → bytecode (neutro) → la JVM de cada máquina lo ejecuta en su hardware.",
    "dificultad": 1
  },
  {
    "id": "tai-t14-111",
    "temaOrden": 14,
    "fuente": "Oracle, Java SE 21 API: java.util.Deque (LIFO)",
    "enunciado": "Un algoritmo necesita una estructura de datos que devuelva los elementos en el orden inverso al que fueron introducidos (política LIFO: Last In, First Out). ¿Qué estructura lineal cumple por definición este requisito?",
    "opciones": [
      "Una cola (queue).",
      "Una pila (stack).",
      "Un árbol binario completo.",
      "Un grafo dirigido acíclico."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "Una pila (stack) sigue el principio LIFO (último en entrar, primero en salir): las inserciones (push) y las extracciones (pop) se hacen por el mismo extremo, llamado cima. La cola (queue), en cambio, sigue el principio FIFO (primero en entrar, primero en salir). Árboles y grafos no son estructuras lineales.",
    "mnemotecnia": "Pila LIFO = pila de platos: el último que pones encima es el primero que coges para fregar.",
    "dificultad": 1
  },
  {
    "id": "tai-t14-112",
    "temaOrden": 14,
    "fuente": "Java Language Specification SE 21, §14.20.2",
    "enunciado": "En la gestión de errores mediante bloques `try-catch-finally`, presente en lenguajes como C# o Java, ¿qué comportamiento es propio del bloque `finally`?",
    "opciones": [
      "Se ejecuta siempre al abandonar los bloques anteriores, se produzca o no una excepción en el `try` y se capture o no en un `catch`.",
      "Se ejecuta única y exclusivamente cuando el bloque `try` finaliza correctamente sin lanzar ninguna excepción.",
      "Sustituye a los bloques `catch` capturando automáticamente cualquier error no declarado por el programador.",
      "Interrumpe el hilo principal del programa a la espera de que un administrador autorice su continuación."
    ],
    "respuestaCorrecta": 0,
    "justificacionIa": "El bloque `finally` sirve para asegurar operaciones de limpieza (cerrar archivos, conexiones o transacciones). Se ejecuta antes de salir de la estructura tanto si el `try` termina con éxito como si se lanza una excepción, se capture o no, e incluso si el bloque se abandona con un `return`.",
    "mnemotecnia": "Finally = «al final, pase lo que pase»: la limpieza se hace sí o sí.",
    "dificultad": 2
  },
  {
    "id": "tai-t14-114",
    "temaOrden": 14,
    "fuente": "Python 3 Language Reference: 3 Data model y 6.7 Binary arithmetic operations",
    "enunciado": "En Python se pueden crear variables sin declarar su tipo y reasignarles valores de tipos distintos sobre la marcha, pero no se permiten operaciones implícitas entre tipos incompatibles (por ejemplo, concatenar la cadena \"hola\" con el entero 5). Estas dos características hacen de Python un lenguaje de tipado:",
    "opciones": [
      "Estático y fuerte.",
      "Estático y débil.",
      "Dinámico y fuerte.",
      "Dinámico y débil."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "El tipado es dinámico porque los tipos se comprueban en tiempo de ejecución y una misma variable puede referenciar primero un número y después un texto. Es fuerte porque el intérprete no convierte tipos automáticamente ante operaciones incoherentes: `\"hola\" + 5` lanza un TypeError.",
    "mnemotecnia": "Dinámico = cajas sin etiqueta previa. Fuerte = no mezcla lo que hay dentro de las cajas sin que se lo pidas.",
    "dificultad": 2
  },
  {
    "id": "tai-t15-115",
    "temaOrden": 15,
    "fuente": "Microsoft Learn, Overview of ASP.NET Core MVC",
    "enunciado": "En el patrón de arquitectura Modelo-Vista-Controlador (MVC), muy extendido en el desarrollo web, ¿cuál es la tarea propia del Controlador?",
    "opciones": [
      "Generar el código HTML y el árbol DOM que el navegador del usuario mostrará en pantalla.",
      "Recibir las peticiones del usuario, solicitar al Modelo la información o las acciones necesarias y seleccionar la Vista adecuada para la respuesta.",
      "Almacenar el estado persistente y ejecutar en exclusiva las consultas SQL contra la base de datos.",
      "Garantizar el cifrado de las conexiones de red y mantener abiertos los túneles TCP durante la sesión."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "El Controlador es el punto de entrada y el coordinador del flujo: recibe las interacciones del usuario (peticiones HTTP, clics), le dice al Modelo (lógica y datos) lo que tiene que hacer y decide qué Vista debe construirse con el resultado.",
    "mnemotecnia": "MVC como un restaurante: la Vista es el plato servido, el Modelo es la cocina y el Controlador es el camarero que toma la comanda y coordina la entrega.",
    "dificultad": 2
  },
  {
    "id": "tai-t15-116",
    "temaOrden": 15,
    "fuente": "WHATWG HTML Living Standard, §4.3.4 The nav element",
    "enunciado": "Entre los elementos semánticos que introdujo HTML5, ¿qué etiqueta se destina a delimitar una sección de la página que agrupa los enlaces principales de navegación?",
    "opciones": [
      "`<nav>`",
      "`<header>`",
      "`<aside>`",
      "`<main>`"
    ],
    "respuestaCorrecta": 0,
    "justificacionIa": "La especificación HTML define el elemento `<nav>` como una sección de la página que enlaza con otras páginas o con partes de la misma página: una sección con enlaces de navegación. Los demás son la cabecera (`<header>`), el contenido complementario (`<aside>`) y el contenido principal (`<main>`).",
    "mnemotecnia": "NAV de NAVegación. Header = cabecera, aside = contenido lateral, main = contenido principal.",
    "dificultad": 1
  },
  {
    "id": "tai-t15-117",
    "temaOrden": 15,
    "fuente": "W3C Selectors Level 4, §17 Calculating a selector's specificity",
    "enunciado": "En el cálculo de la especificidad de las hojas de estilo en cascada (CSS), y sin que intervenga la declaración `!important`, ¿cuál de los siguientes selectores tiene mayor prioridad para aplicar un estilo sobre un mismo elemento en caso de conflicto?",
    "opciones": [
      "El selector de etiquetas `body main section`.",
      "El selector de clases `.contenedor .menu .enlace`.",
      "El selector con pseudoclases `a:hover:focus`.",
      "El selector de identificador `#cabecera`."
    ],
    "respuestaCorrecta": 3,
    "justificacionIa": "La especificidad se compara por columnas: identificadores, después clases, atributos y pseudoclases, y por último etiquetas y pseudoelementos. `#cabecera` vale (1,0,0) y gana a `.contenedor .menu .enlace` (0,3,0), a `a:hover:focus` (0,2,1) y a `body main section` (0,0,3), porque una columna superior prevalece sobre cualquier número de unidades en las inferiores.",
    "mnemotecnia": "Especificidad: ID (1,0,0) > clases y pseudoclases (0,1,0) > etiquetas (0,0,1). Una sola # gana a cualquier número de puntos.",
    "dificultad": 3
  },
  {
    "id": "tai-t15-118",
    "temaOrden": 15,
    "fuente": "RFC 9110 (HTTP Semantics), §9.2.2 Idempotent Methods",
    "enunciado": "La RFC 9110, que define la semántica del protocolo HTTP y sustituye a la RFC 7231, clasifica los métodos según sean o no «idempotentes». ¿Cuál de estos métodos HTTP NO es idempotente?",
    "opciones": [
      "GET",
      "PUT",
      "DELETE",
      "POST"
    ],
    "respuestaCorrecta": 3,
    "justificacionIa": "Un método es idempotente si enviar varias veces la misma petición produce en el servidor el mismo efecto que enviarla una sola vez. GET solo lee; borrar cinco veces el mismo recurso con DELETE deja el mismo resultado (no existe), y sobrescribirlo cinco veces con PUT deja el mismo valor final. POST no es idempotente: cinco peticiones iguales pueden crear cinco registros o generar cinco cargos.",
    "mnemotecnia": "POST no es idempotente: si pulsas tres veces «Enviar» en un formulario, puedes acabar con tres altas duplicadas.",
    "dificultad": 2
  },
  {
    "id": "tai-t15-119",
    "temaOrden": 15,
    "fuente": "RFC 8259 (JSON), §4 Objects",
    "enunciado": "Según la especificación del formato de intercambio de datos JSON (RFC 8259), la sintaxis de un objeto exige que:",
    "opciones": [
      "El objeto se abra y cierre con llaves `{ }` y todas las claves sean cadenas rodeadas por comillas dobles.",
      "El objeto se abra y cierre con corchetes `[ ]` y los pares estén separados por punto y coma.",
      "El objeto se abra y cierre con llaves `{ }` y se puedan omitir las comillas en las claves que no contengan espacios.",
      "El objeto se abra y cierre con corchetes angulares `< >`, siguiendo el formato jerárquico de XML."
    ],
    "respuestaCorrecta": 0,
    "justificacionIa": "En JSON, un objeto se delimita con `{` y `}` y contiene pares nombre/valor separados por comas. Cada nombre (clave) debe ser una cadena entre comillas dobles, separada de su valor por dos puntos. Las claves sin comillas o con comillas simples no son JSON válido.",
    "mnemotecnia": "JSON es estricto: objetos entre llaves {} y claves SIEMPRE con comillas dobles.",
    "dificultad": 1
  },
  {
    "id": "tai-t15-120",
    "temaOrden": 15,
    "fuente": "Fielding, Architectural Styles and the Design of Network-based Software Architectures, cap. 5 (§5.1.3)",
    "enunciado": "En el estilo arquitectónico REST (Representational State Transfer), una de las restricciones es la comunicación «sin estado» (stateless). ¿Qué implica este principio en la relación entre cliente y servidor?",
    "opciones": [
      "El cliente no puede almacenar cookies ni tokens de sesión de forma persistente.",
      "El servidor no guarda información de contexto de la sesión del cliente entre peticiones, así que cada petición debe contener todo lo necesario para entenderla.",
      "El protocolo de transporte deja de usar TCP y pasa a enviar los datos sin conexión, como UDP.",
      "La base de datos del servidor no puede almacenar el histórico de transacciones realizadas."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "La restricción stateless de REST exige que cada petición del cliente incluya toda la información necesaria para entenderla (por ejemplo, el token de autorización), sin depender de un contexto de sesión guardado en el servidor. El estado de la sesión lo mantiene el cliente. Esto facilita la escalabilidad y el balanceo de carga.",
    "mnemotecnia": "Stateless = el servidor tiene amnesia entre peticiones: en cada una tienes que recordarle quién eres y qué quieres.",
    "dificultad": 3
  },
  {
    "id": "tai-t15-121",
    "temaOrden": 15,
    "fuente": "W3C, WCAG 2.2 (Introduction: four principles)",
    "enunciado": "Las Pautas de Accesibilidad para el Contenido Web (WCAG), publicadas por el W3C, se organizan en torno a cuatro principios. Estos cuatro principios son:",
    "opciones": [
      "Rápido, intuitivo, universal y confiable.",
      "Semántico, visual, adaptable y seguro.",
      "Perceptible, operable, comprensible y robusto.",
      "Navegable, legible, escalable y resiliente."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "Las WCAG agrupan todas sus pautas y criterios de conformidad (niveles A, AA y AAA) bajo cuatro principios: perceptible (la información debe poder percibirse), operable (la interfaz debe poder manejarse), comprensible (la información y el manejo deben entenderse) y robusto (compatible con distintas tecnologías, incluidos los productos de apoyo).",
    "mnemotecnia": "En inglés, POUR: Perceivable, Operable, Understandable, Robust. En español: Perceptible, Operable, Comprensible, Robusto.",
    "dificultad": 2
  },
  {
    "id": "tai-t15-122",
    "temaOrden": 15,
    "fuente": "WHATWG DOM Living Standard",
    "enunciado": "En las tecnologías web, ¿qué interfaz de programación (API) estándar representa un documento HTML como un árbol de nodos en memoria y permite a los scripts (como JavaScript) leer y modificar dinámicamente su contenido y estructura?",
    "opciones": [
      "AJAX (Asynchronous JavaScript and XML).",
      "DOM (Document Object Model).",
      "CORS (Cross-Origin Resource Sharing).",
      "BOM (Browser Object Model)."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "El Document Object Model (DOM) es la representación en objetos del documento web y la interfaz estándar para acceder a sus elementos y modificarlos. Funciones como `document.createElement()` forman parte de la especificación del DOM, no del lenguaje JavaScript en sí.",
    "mnemotecnia": "DOM = modelo del Documento (las etiquetas). BOM = modelo del navegador (historial, ventana). Para tocar las etiquetas, el DOM.",
    "dificultad": 1
  },
  {
    "id": "tai-t16-123",
    "temaOrden": 16,
    "fuente": "RD 311/2022 (ENS), anexo IV (glosario); NIST CSRC Glossary: information security",
    "enunciado": "La llamada «tríada CIA» resume las tres dimensiones básicas que la seguridad de la información debe preservar. ¿Cuáles son?",
    "opciones": [
      "Control de acceso, integridad y auditoría continua.",
      "Criptografía, identidad del usuario y autorización de perfiles.",
      "Conformidad legal, inmutabilidad de los registros y accesibilidad remota.",
      "Confidencialidad, integridad y disponibilidad."
    ],
    "respuestaCorrecta": 3,
    "justificacionIa": "El glosario del Esquema Nacional de Seguridad (RD 311/2022) las define así: «Confidencialidad: propiedad o característica consistente en que la información ni se pone a disposición, ni se revela a individuos, entidades o procesos no autorizados»; «Integridad: propiedad o característica consistente en que el activo de información no ha sido alterado de manera no autorizada»; y «Disponibilidad: propiedad o característica de los activos consistente en que las entidades o procesos autorizados tienen acceso a los mismos cuando lo requieren». CIA son sus iniciales en inglés: Confidentiality, Integrity, Availability.",
    "mnemotecnia": "CIA = Confidencialidad (el secreto), Integridad (que no se altere) y Disponibilidad (acceso cuando hace falta).",
    "dificultad": 1
  },
  {
    "id": "tai-t16-124",
    "temaOrden": 16,
    "fuente": "RD 311/2022 (ENS), art. 7",
    "enunciado": "El Real Decreto 311/2022 regula el Esquema Nacional de Seguridad (ENS). Entre sus principios básicos, el artículo 7 recoge aquel en el que debe basarse la adopción de medidas de protección proporcionadas en los sistemas de información. ¿Cómo se denomina?",
    "opciones": [
      "Gestión de la seguridad basada en los riesgos.",
      "Seguridad por defecto.",
      "Defensa en profundidad.",
      "Diferenciación estricta de las responsabilidades directivas."
    ],
    "respuestaCorrecta": 0,
    "justificacionIa": "El artículo 7 del RD 311/2022 se titula «Gestión de la seguridad basada en los riesgos»: el análisis y la gestión de riesgos permiten mantener un entorno controlado y adoptar medidas proporcionadas. La existencia de líneas de defensa (art. 9) y la diferenciación de responsabilidades (art. 11) son otros principios básicos distintos.",
    "mnemotecnia": "En el ENS la altura de la muralla depende del peligro y de lo que haya dentro: todo se basa en el RIESGO.",
    "dificultad": 2
  },
  {
    "id": "tai-t16-125",
    "temaOrden": 16,
    "fuente": "RFC 8017 (PKCS #1 v2.2), §7 Encryption Schemes",
    "enunciado": "Con un sistema criptográfico asimétrico de clave pública, una funcionaria (Ana) necesita enviar un documento confidencial a un compañero (Carlos). Para que únicamente Carlos pueda leer su contenido, ¿qué clave debe usar Ana para cifrarlo?",
    "opciones": [
      "La clave privada de la propia Ana.",
      "La clave privada de Carlos, que le ha sido compartida previamente.",
      "La clave pública de Carlos.",
      "La clave pública de la propia Ana."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "En criptografía asimétrica (por ejemplo, RSA), lo que se cifra con una clave del par solo puede descifrarse con la otra. Si Ana cifra con la clave pública de Carlos, que está al alcance de todos, solo la clave privada de Carlos, que únicamente tiene él, podrá descifrarlo.",
    "mnemotecnia": "Confidencialidad: cifro con la clave pública de QUIEN RECIBE. Firma: firmo con la clave privada de QUIEN ENVÍA.",
    "dificultad": 3
  }
];

// Teoría correcta pero sin fuente oficial publicada (solo manuales de
// referencia). No se importa: import-banco-tai.ts solo usa TAI_BANCO_PREGUNTAS.
export const TAI_BANCO_PENDIENTES_FUENTE: PreguntaBancoTai[] = [
  {
    "id": "tai-t12-092",
    "temaOrden": 12,
    "fuente": "Stallings, Computer Organization and Architecture, 10.ª ed., cap. 1",
    "enunciado": "Dentro de la arquitectura clásica de Von Neumann, ¿qué componente de la Unidad Central de Proceso (CPU) se encarga de extraer la instrucción de la memoria principal, decodificarla y emitir las señales necesarias al resto del sistema para su ejecución?",
    "opciones": [
      "La Unidad Aritmético Lógica (ALU).",
      "El banco de registros internos y el acumulador.",
      "La Unidad de Control (UC).",
      "El controlador de acceso directo a memoria (DMA)."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "En la arquitectura de Von Neumann, la Unidad de Control gestiona el ciclo de instrucción (captación, decodificación y ejecución): extrae la instrucción, la interpreta y genera las señales de control y temporización para que la ALU, la memoria y la E/S realicen el trabajo.",
    "mnemotecnia": "La Unidad de Control es el director de orquesta: no toca los instrumentos (los cálculos son de la ALU), pero lee la partitura y dice quién actúa y cuándo.",
    "dificultad": 2
  },
  {
    "id": "tai-t12-093",
    "temaOrden": 12,
    "fuente": "Stallings, Computer Organization and Architecture, 10.ª ed., cap. 4",
    "enunciado": "En la jerarquía de memoria de un sistema informático actual, ¿cuál es el orden correcto de los subsistemas, si partimos desde la menor capacidad (y mayor velocidad) hacia la mayor capacidad (y menor velocidad)?",
    "opciones": [
      "Registros de la CPU → Memoria principal (RAM) → Memoria caché → Almacenamiento secundario (SSD/HDD).",
      "Registros de la CPU → Memoria caché → Memoria principal (RAM) → Almacenamiento secundario (SSD/HDD).",
      "Memoria caché → Registros de la CPU → Memoria principal (RAM) → Almacenamiento secundario (SSD/HDD).",
      "Memoria principal (RAM) → Memoria caché → Registros de la CPU → Almacenamiento secundario (SSD/HDD)."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "La jerarquía de memoria va de lo más próximo al procesador (muy rápido y escaso) a lo más alejado (lento y masivo): registros de la CPU, caché (L1, L2, L3), memoria principal (RAM) y almacenamiento secundario (discos).",
    "mnemotecnia": "Pirámide de memoria: arriba los registros (rápidos y pequeños); al bajar, caché, RAM y, en la base, el disco (lento y enorme).",
    "dificultad": 2
  },
  {
    "id": "tai-t12-094",
    "temaOrden": 12,
    "fuente": "Stallings, Computer Organization and Architecture, 10.ª ed., cap. 3",
    "enunciado": "Un controlador de disco acaba de finalizar una transferencia de datos hacia la memoria empleando Acceso Directo a Memoria (DMA) y necesita avisar al microprocesador de que la operación ha concluido. ¿A través de qué medio transmite el controlador este aviso a la CPU?",
    "opciones": [
      "A través de una línea específica del bus de direcciones, que indica la dirección en memoria del vector de interrupción.",
      "A través de una línea de petición de interrupción (IRQ) del bus de control.",
      "Mediante un paquete de difusión enviado por el bus de datos hacia el registro contador de programa.",
      "Utilizando el reloj del sistema para invertir la polaridad del ciclo de máquina actual."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "Los buses del sistema se dividen funcionalmente en bus de datos, de direcciones y de control. Las señales de mando y estado, como el reloj, las órdenes de lectura/escritura y las peticiones de interrupción (IRQ, Interrupt Request), viajan por las líneas del bus de control.",
    "mnemotecnia": "Bus de datos: «el qué». Bus de direcciones: «a dónde». Bus de control: las órdenes y los avisos (interrupciones).",
    "dificultad": 3
  },
  {
    "id": "tai-t12-095",
    "temaOrden": 12,
    "fuente": "Stallings, Computer Organization and Architecture, 10.ª ed., cap. 6",
    "enunciado": "¿Qué tecnología de almacenamiento masivo y persistente basa su funcionamiento en celdas de memoria no volátil, típicamente memoria flash NAND, sin ningún componente mecánico ni disco giratorio?",
    "opciones": [
      "HDD (Hard Disk Drive).",
      "LTO (Linear Tape-Open).",
      "SSD (Solid State Drive).",
      "Blu-ray Disc de doble capa."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "Las unidades de estado sólido (SSD) utilizan chips de memoria flash NAND para retener los datos de forma persistente. A diferencia de los HDD (magnéticos), las cintas LTO o los discos ópticos (Blu-ray), carecen de partes mecánicas móviles, lo que reduce la latencia.",
    "mnemotecnia": "Solid State = estado sólido: dentro no se mueve nada (ni motor, ni láser, ni platos girando), solo chips NAND.",
    "dificultad": 1
  },
  {
    "id": "tai-t12-096",
    "temaOrden": 12,
    "fuente": "Stallings, Computer Organization and Architecture, 10.ª ed., cap. 5",
    "enunciado": "En la arquitectura básica de un PC, ¿cómo se denomina genéricamente al programa de bajo nivel, almacenado en memoria no volátil de la placa base (como EEPROM o flash), que actúa como interfaz entre el hardware y el sistema operativo y se encarga de rutinas iniciales como el POST?",
    "opciones": [
      "El firmware (por ejemplo, BIOS o UEFI).",
      "El gestor de arranque (bootloader) del sistema operativo.",
      "El kernel o núcleo del sistema operativo.",
      "El paquete de controladores de dispositivo (drivers)."
    ],
    "respuestaCorrecta": 0,
    "justificacionIa": "El software embebido en el hardware que proporciona su control de bajo nivel se denomina firmware. En el arranque de un PC, las implementaciones de este firmware de placa son la BIOS clásica o el estándar UEFI, que ejecutan el POST y ceden después el control al gestor de arranque.",
    "mnemotecnia": "Firmware = software «firme», grabado en la placa. BIOS/UEFI despiertan la máquina antes de que el sistema operativo esté en memoria.",
    "dificultad": 1
  },
  {
    "id": "tai-t13-100",
    "temaOrden": 13,
    "fuente": "Tanenbaum y Bos, Sistemas operativos modernos, 4.ª ed., cap. 3",
    "enunciado": "Dentro de los modelos de gestión de la memoria de un sistema operativo, ¿cuál es la principal diferencia conceptual entre la paginación pura y la segmentación pura?",
    "opciones": [
      "La paginación divide el espacio de direcciones lógicas en bloques de tamaño fijo (páginas), mientras que la segmentación lo divide en bloques de tamaño variable que se corresponden con la lógica del programa (código, datos, pila).",
      "La paginación padece fragmentación externa severa, problema que la segmentación resuelve al asignar marcos fijos contiguos de disco.",
      "La segmentación siempre requiere que todo el proceso resida contiguo en la memoria RAM, regla de la que la paginación está exenta.",
      "La paginación divide el almacenamiento secundario según las cuotas de usuario, mientras que la segmentación es una técnica exclusiva de la caché de nivel 1."
    ],
    "respuestaCorrecta": 0,
    "justificacionIa": "La paginación responde a la estructura del hardware: divide la memoria en bloques de tamaño fijo e indiferentes al contenido (páginas y marcos). La segmentación responde a la estructura lógica del programa y la divide en piezas de tamaño variable según su función (segmento de código, de datos, de pila).",
    "mnemotecnia": "Páginas = folios todos del mismo tamaño. Segmentos = capítulos de un libro, cada uno de distinto grosor.",
    "dificultad": 2
  },
  {
    "id": "tai-t13-102",
    "temaOrden": 13,
    "fuente": "Tanenbaum y Bos, Sistemas operativos modernos, 4.ª ed., cap. 6",
    "enunciado": "Según la teoría de sistemas operativos, para que se produzca un interbloqueo (deadlock) entre procesos deben darse simultáneamente cuatro condiciones, formuladas por Coffman y otros. ¿Cuál de las siguientes es una de esas condiciones?",
    "opciones": [
      "Expropiación forzosa de recursos.",
      "Espera circular.",
      "Asignación de memoria contigua.",
      "Fragmentación externa concurrente."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "Las cuatro condiciones de Coffman son: exclusión mutua, retención y espera, no expropiación (los recursos no se pueden quitar por la fuerza) y espera circular (una cadena cerrada de procesos en la que cada uno espera un recurso retenido por el siguiente).",
    "mnemotecnia": "Para el interbloqueo hace falta ERSE: Exclusión mutua, Retención y espera, Sin expropiación y Espera circular.",
    "dificultad": 2
  },
  {
    "id": "tai-t14-107",
    "temaOrden": 14,
    "fuente": "Sebesta, Concepts of Programming Languages, 10.ª ed., cap. 1",
    "enunciado": "En la teoría de lenguajes de programación, ¿cuál es la diferencia esencial entre un intérprete puro y un compilador puro?",
    "opciones": [
      "El intérprete produce un archivo binario independiente que se distribuye al usuario final, mientras que el compilador requiere distribuir siempre el código fuente original.",
      "El intérprete traduce y ejecuta el código fuente instrucción por instrucción en tiempo de ejecución, mientras que el compilador traduce todo el código a lenguaje máquina antes de ejecutarlo.",
      "El compilador exige que el lenguaje carezca de sistema de tipos, mientras que el intérprete impone un tipado estático.",
      "El intérprete optimiza de forma global el árbol sintáctico y reescribe los bucles ineficientes antes de iniciar la ejecución, fase que el compilador no puede realizar."
    ],
    "respuestaCorrecta": 1,
    "justificacionIa": "La compilación es una traducción completa y previa: se analiza todo el programa y se genera un ejecutable en código máquina antes de poder ejecutarlo. La interpretación pura procesa el código fuente sobre la marcha, instrucción a instrucción, sin generar un binario persistente.",
    "mnemotecnia": "Compilador = traduce el libro entero y te lo da impreso. Intérprete = traductor simultáneo que te lo va diciendo frase a frase.",
    "dificultad": 1
  },
  {
    "id": "tai-t14-113",
    "temaOrden": 14,
    "fuente": "Aho, Hopcroft y Ullman, Estructuras de datos y algoritmos, cap. 2",
    "enunciado": "Un programador está implementando una función recursiva. Para que la ejecución no se repita indefinidamente hasta provocar un desbordamiento de pila (stack overflow), es obligatorio que la función incluya:",
    "opciones": [
      "Un bucle de iteración externo (`for` o `while`) que envuelva la declaración de la función.",
      "Una instrucción explícita que vacíe la pila del sistema operativo antes de cada nueva autoinvocación.",
      "Un caso base (o condición de parada) que resuelva el problema directamente sin realizar nuevas llamadas recursivas.",
      "La ejecución del código de la función dentro de un hilo independiente."
    ],
    "respuestaCorrecta": 2,
    "justificacionIa": "Toda función recursiva correcta tiene dos partes: el paso recursivo, que llama a la propia función con un caso más pequeño del problema, y el caso base, una condición que devuelve directamente el resultado sin nuevas llamadas. Sin caso base, las llamadas se acumulan en la pila hasta desbordarla.",
    "mnemotecnia": "Recursividad sin caso base = dos espejos enfrentados: infinito. El caso base es la salida.",
    "dificultad": 2
  }
];
