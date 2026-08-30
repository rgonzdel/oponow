// Contenido original para el Cuerpo General Auxiliar de la Administración
// del Estado (C2/AAE), Tema 3 del Bloque I ("Las Cortes Generales:
// composición, atribuciones y funcionamiento del Congreso de los Diputados
// y Senado. El Defensor del Pueblo") — numeración y título oficiales según
// el Anexo I de la Resolución de 18 de diciembre de 2025 de la Secretaría
// de Estado de Función Pública (BOE-A-2025-26262, BOE núm. 306), texto
// administrativo de dominio público.
//
// El primer bloque de este tema NO se duplica aquí: la parte de Cortes
// Generales (arts. 66-80 CE) ya está redactada, con el mismo nivel de
// detalle que exige este temario, en TEMA4_BLOQUE_1_CORTES_CAMARAS
// (./ce-titulos-2-10.ts) — se reutiliza tal cual desde seed.ts para no
// mantener dos redacciones distintas del mismo artículo. Este archivo solo
// aporta el segundo bloque: el Defensor del Pueblo (art. 54 CE y Ley
// Orgánica 3/1981), que no está cubierto en ningún otro tema ya sembrado.
//
// Verificado contra el texto vigente de la Constitución Española y la Ley
// Orgánica 3/1981, de 6 de abril, del Defensor del Pueblo. Redacción propia,
// no copiada ni parafraseada de ningún manual comercial de terceros.

export const AAE_TEMA3_BLOQUE2 = `## El Defensor del Pueblo: naturaleza y designación
El artículo 54 de la Constitución remite a una ley orgánica la regulación del Defensor del Pueblo como alto comisionado de las Cortes Generales, designado por éstas para la defensa de los derechos comprendidos en el título I, con capacidad para supervisar la actividad de la Administración y dar cuenta de ello a las propias Cortes. Esa ley orgánica es la Ley Orgánica 3/1981, de 6 de abril.

Es elegido por el Congreso de los Diputados por mayoría de tres quintos y ratificado por el Senado con la misma mayoría; si no se alcanza en primera votación, la Ley Orgánica prevé un procedimiento subsidiario con nuevas votaciones. Su mandato dura cinco años. No está sujeto a mandato imperativo, no recibe instrucciones de ninguna autoridad y goza de inviolabilidad e inmunidad en términos similares a los de diputados y senadores. Para el ejercicio de sus funciones cuenta con un Adjunto Primero y un Adjunto Segundo, que él mismo nombra y cesa, con la conformidad de la Comisión Mixta Congreso-Senado que supervisa la institución.

## Funciones y límites de su actuación
Toda la Administración pública está obligada a auxiliarle con carácter preferente y urgente en sus investigaciones. Puede iniciar y proseguir de oficio, o a instancia de parte, cualquier investigación conducente al esclarecimiento de actos y resoluciones de la Administración y sus agentes en relación con los ciudadanos, a la luz del artículo 103.1 CE (objetividad, eficacia y sometimiento pleno a la ley y al Derecho) y del respeto debido a los derechos del título I. Cualquier persona natural o jurídica que invoque un interés legítimo puede dirigirse a él sin restricción alguna, sin necesidad de abogado ni procurador y sin coste.

Su instrumento es la recomendación, no la resolución vinculante: no puede modificar ni anular por sí mismo los actos y resoluciones de la Administración, aunque sí formular a los organismos afectados recomendaciones, recordatorios de sus deberes legales o sugerencias para la adopción de nuevas medidas; si no se le facilita la información pedida o persiste una actitud hostil o entorpecedora en su labor, puede hacerlo público y destacarlo en su informe a las Cortes.

Está legitimado, junto con el Presidente del Gobierno, 50 diputados, 50 senadores y los órganos colegiados ejecutivos de las Comunidades Autónomas, para interponer recurso de inconstitucionalidad (arts. 162.1.a y 32 LOTC) y, en defensa de los derechos y libertades susceptibles de amparo, recurso de amparo ante el Tribunal Constitucional (art. 162.1.b CE).

## Rendición de cuentas
Presenta a las Cortes Generales un informe anual, en el que da cuenta del número y tipo de quejas recibidas y tramitadas, de las que rechazó y sus motivos, y de las que investigó con su resultado, especificando las recomendaciones no admitidas por la Administración. Puede presentar además informes extraordinarios cuando la gravedad o la urgencia de los hechos lo aconsejen. Da cuenta de sus informes ante las Comisiones correspondientes de ambas Cámaras, y puede ser cesado antes de tiempo por renuncia, expiración del plazo, muerte, incapacidad sobrevenida, actuación con notoria negligencia en el ejercicio de sus funciones, condena por delito doloso mediante sentencia firme, o pérdida de la condición de ciudadano español.`;

// Banco de preguntas del Tema 3, en el mismo formato que consume
// `schema.preguntas` (packages/db/src/schema/quiz.ts): enunciado + 4
// opciones + índice 0-based de la correcta + justificación citando el
// artículo/norma exacta + dificultad orientativa (1 fácil - 3 difícil).
// Cubre tanto el bloque 1 (Cortes Generales, redactado en ce-titulos-2-10)
// como el bloque 2 de este mismo archivo (Defensor del Pueblo).
export const AAE_TEMA3_PREGUNTAS = [
  {
    enunciado:
      "Según el artículo 66 de la Constitución, ¿cuál de las siguientes NO es una función atribuida a las Cortes Generales?",
    opciones: [
      "Ejercer la potestad legislativa del Estado",
      "Aprobar los Presupuestos del Estado",
      "Controlar la acción del Gobierno",
      "Ejercer la potestad reglamentaria del Estado",
    ],
    respuestaCorrecta: 3,
    justificacionIa:
      "El art. 66.2 CE atribuye a las Cortes Generales la potestad legislativa, la aprobación de los Presupuestos, el control de la acción del Gobierno y las demás competencias que les atribuya la Constitución. La potestad reglamentaria corresponde al Gobierno (art. 97 CE), no a las Cortes.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Cuántos diputados fija la Ley Orgánica del Régimen Electoral General para el Congreso, dentro de la horquilla que permite el artículo 68 CE?",
    opciones: ["300", "350", "400", "400, cifra fija por la Constitución"],
    respuestaCorrecta: 1,
    justificacionIa:
      "El art. 68.1 CE permite entre 300 y 400 diputados; la LOREG concreta esa cifra en 350, que es la que rige actualmente el Congreso.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Cuántos senadores corresponden a cada provincia peninsular por elección directa, según el artículo 69 CE?",
    opciones: ["Dos", "Tres", "Cuatro", "Uno por cada 500.000 habitantes"],
    respuestaCorrecta: 2,
    justificacionIa:
      "El art. 69.2 CE asigna cuatro senadores a cada provincia peninsular, elegidos por sufragio universal, libre, igual, directo y secreto.",
    dificultad: 1,
  },
  {
    enunciado:
      "Las Comunidades Autónomas designan senadores conforme al artículo 69.5 CE. ¿Cuál es la regla de designación?",
    opciones: [
      "Dos senadores fijos por Comunidad Autónoma, con independencia de su población",
      "Un senador y otro más por cada millón de habitantes",
      "Un senador por cada provincia integrada en la Comunidad Autónoma",
      "El número que fije libremente cada Estatuto de Autonomía, sin límite constitucional",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El art. 69.5 CE establece que las Comunidades Autónomas designarán además un senador y otro más por cada millón de habitantes de su respectivo territorio, a través de sus Asambleas Legislativas.",
    dificultad: 2,
  },
  {
    enunciado:
      "La inmunidad parlamentaria reconocida en el artículo 71 CE implica que un diputado o senador...",
    opciones: [
      "No puede ser detenido ni siquiera en caso de flagrante delito",
      "Solo puede ser detenido en caso de flagrante delito, y necesita autorización de la Cámara para ser inculpado o procesado",
      "Nunca puede ser juzgado por ningún tribunal mientras dure su mandato",
      "Solo responde ante el Tribunal Constitucional por cualquier delito",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El art. 71.2 CE limita la detención al caso de flagrante delito y exige la autorización de la Cámara respectiva (suplicatorio) para poder inculpar o procesar a un diputado o senador; el art. 71.3 atribuye la causa a la Sala de lo Penal del Tribunal Supremo.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué mayoría exige el artículo 81 CE para aprobar una ley orgánica en votación final sobre el conjunto del proyecto?",
    opciones: [
      "Mayoría simple del Congreso",
      "Mayoría absoluta del Congreso",
      "Mayoría de tres quintos del Congreso y el Senado",
      "Mayoría absoluta del Congreso y del Senado",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El art. 81.2 CE exige la mayoría absoluta del Congreso en una votación final sobre el conjunto del proyecto para la aprobación, modificación o derogación de las leyes orgánicas.",
    dificultad: 2,
  },
  {
    enunciado:
      "El Defensor del Pueblo se regula, por mandato del artículo 54 CE, mediante:",
    opciones: [
      "Un Real Decreto del Gobierno",
      "Una Ley Orgánica",
      "Un Reglamento del Congreso de los Diputados",
      "Una ley ordinaria de las Cortes Generales",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El art. 54 CE remite a una ley orgánica la regulación de la institución; es la Ley Orgánica 3/1981, de 6 de abril, del Defensor del Pueblo.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Cuál de las siguientes afirmaciones sobre el Defensor del Pueblo es correcta?",
    opciones: [
      "Puede anular directamente los actos administrativos que considere irregulares",
      "Es elegido por el Gobierno y ratificado por el Rey",
      "Está legitimado para interponer recurso de inconstitucionalidad y recurso de amparo",
      "Su mandato dura cuatro años, igual que el del Congreso",
    ],
    respuestaCorrecta: 2,
    justificacionIa:
      "El art. 162 CE legitima al Defensor del Pueblo para interponer recurso de inconstitucionalidad y recurso de amparo. No tiene potestad anulatoria (solo formula recomendaciones) y es elegido por el Congreso y ratificado por el Senado por mayoría de tres quintos, con un mandato de cinco años (LO 3/1981).",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Con qué mayoría es elegido el Defensor del Pueblo por el Congreso de los Diputados?",
    opciones: [
      "Mayoría simple",
      "Mayoría absoluta",
      "Mayoría de tres quintos",
      "Unanimidad",
    ],
    respuestaCorrecta: 2,
    justificacionIa:
      "La Ley Orgánica 3/1981 exige mayoría de tres quintos del Congreso, ratificada por la misma mayoría en el Senado (con un procedimiento subsidiario si no se alcanza en primera votación).",
    dificultad: 2,
  },
];
