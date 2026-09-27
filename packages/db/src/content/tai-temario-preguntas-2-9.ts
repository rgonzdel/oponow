// Bancos de preguntas para los Temas 2 a 9 de la oposición TAI (Técnico
// Auxiliar de Informática), redactados a partir EXCLUSIVAMENTE del contenido
// de bloque ya existente en el repo para cada tema:
//  - Tema 2: bloque inline en seed.ts (seedTemarioDemo, tema2Id), sobre el
//    artículo 9.3 CE y su relevancia para un TAI.
//  - Temas 3 a 9: constantes TEMA3_BLOQUE_1_CORONA, TEMA4_BLOQUE_1..3,
//    TEMA5_BLOQUE_1_GOBIERNO, TEMA6_BLOQUE_1_RELACIONES,
//    TEMA7_BLOQUE_1_PODER_JUDICIAL, TEMA8_BLOQUE_1_ECONOMIA y
//    TEMA9_BLOQUE_1..3, definidas en ./ce-titulos-2-10.ts.
//
// No se ha añadido ningún artículo, cifra, fecha ni afirmación que no esté ya
// en esos textos. El Tema 2 tiene menos de 10 preguntas porque su bloque de
// contenido es muy breve (un solo artículo, 9.3 CE, y dos frases sobre su
// relevancia para un TAI) y no da para más sin inventar información.

export const TAI_TEMA2_PREGUNTAS = [
  {
    enunciado:
      "¿Qué artículo de la Constitución Española recoge los principios que limitan y garantizan toda actuación de los poderes públicos, según el Tema 2 del temario?",
    opciones: ["El artículo 9.3", "El artículo 103.1", "El artículo 106", "El artículo 1.1"],
    respuestaCorrecta: 0,
    justificacionIa:
      "El bloque de Tema 2 indica expresamente que «el artículo 9.3 de la Constitución Española recoge los principios que limitan y garantizan toda actuación de los poderes públicos». El artículo 103.1 (principios de la Administración Pública) y el artículo 106 (control judicial) son otros artículos constitucionales relevantes para la actuación administrativa, pero no son los citados en este bloque como fuente de esos principios.",
    mnemotecnia:
      "Tema 2 = artículo 9.3: la matrícula de los principios que limitan a los poderes públicos.",
    dificultad: 1,
  },
  {
    enunciado:
      "Según el texto del artículo 9.3 de la Constitución citado en el Tema 2, ¿cuál de los siguientes principios NO figura entre los garantizados en ese precepto?",
    opciones: [
      "La jerarquía normativa",
      "La eficacia de la actuación administrativa",
      "La seguridad jurídica",
      "La interdicción de la arbitrariedad de los poderes públicos",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 9.3 CE, tal como se cita en el bloque, garantiza «el principio de legalidad, la jerarquía normativa, la publicidad de las normas, la irretroactividad de las disposiciones sancionadoras no favorables o restrictivas de derechos individuales, la seguridad jurídica, la responsabilidad y la interdicción de la arbitrariedad de los poderes públicos». La eficacia no aparece en esa enumeración.",
    mnemotecnia:
      "El 9.3 no habla de EFICACIA: esa palabra no está en la lista de siete principios que cita el bloque del Tema 2.",
    dificultad: 2,
  },
  {
    enunciado:
      "De acuerdo con el artículo 9.3 CE citado en el Tema 2, la irretroactividad que garantiza la Constitución se refiere a las disposiciones sancionadoras que sean:",
    opciones: [
      "Favorables o ampliatorias de derechos individuales",
      "No favorables o restrictivas de derechos individuales",
      "De cualquier tipo, sin distinción",
      "Dictadas por una Comunidad Autónoma",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El texto citado habla literalmente de «la irretroactividad de las disposiciones sancionadoras no favorables o restrictivas de derechos individuales». La irretroactividad constitucional se predica, por tanto, de las disposiciones desfavorables o restrictivas, no de las favorables.",
    mnemotecnia:
      "Solo lo DESFAVORABLE no puede aplicarse hacia atrás: irretroactividad = sancionadoras no favorables o restrictivas.",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el bloque de Tema 2, ¿cuáles son los dos principios del artículo 9.3 CE especialmente relevantes en el día a día de un TAI?",
    opciones: [
      "La legalidad y la jerarquía normativa",
      "La publicidad de las normas y la responsabilidad",
      "La seguridad jurídica y la interdicción de la arbitrariedad",
      "La jerarquía normativa y la interdicción de la arbitrariedad",
    ],
    respuestaCorrecta: 2,
    justificacionIa:
      "El bloque señala textualmente que «dos de estos principios son especialmente relevantes en el día a día [de un TAI]: la seguridad jurídica […] y la interdicción de la arbitrariedad […]». Los demás principios del 9.3 no reciben esa mención específica en el temario.",
    mnemotecnia:
      "Para el TAI, del 9.3 importan sobre todo dos: SEGURIDAD jurídica e INTERDICCIÓN de la arbitrariedad.",
    dificultad: 1,
  },
  {
    enunciado:
      "Según el Tema 2, ¿por qué es relevante para un TAI el principio de seguridad jurídica del artículo 9.3 CE?",
    opciones: [
      "Porque obliga a cifrar todas las bases de datos de la Administración",
      "Porque los sistemas de información deben reflejar fielmente lo que establece la norma vigente, no una interpretación particular",
      "Porque exige que los sistemas informáticos tengan siempre copia de seguridad diaria",
      "Porque obliga a que todo sistema informático público use software libre",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El bloque explica que la seguridad jurídica exige que «los sistemas de información deben reflejar fielmente lo que establece la norma vigente, no una interpretación particular». Las demás opciones son afirmaciones técnicas que el temario de este bloque no formula.",
    mnemotecnia:
      "Seguridad jurídica para el TAI: el sistema refleja la NORMA VIGENTE, no una interpretación propia.",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el Tema 2, ¿qué exige el principio de interdicción de la arbitrariedad respecto de una decisión automatizada o asistida por un sistema informático de la Administración?",
    opciones: [
      "Que la decisión pueda justificarse por referencia a una norma, no a un criterio discrecional no motivado",
      "Que la decisión sea revisada anualmente por el Tribunal de Cuentas",
      "Que la decisión se adopte siempre por unanimidad del Consejo de Ministros",
      "Que la decisión se publique en el Boletín Oficial del Estado en el plazo de 15 días",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El bloque indica que «cualquier decisión automatizada o asistida por un sistema informático de la Administración debe poder justificarse por referencia a una norma, no a un criterio discrecional no motivado». Las demás opciones no aparecen en ese texto.",
    mnemotecnia:
      "Nada de discrecionalidad no motivada: toda decisión automatizada se justifica con una NORMA.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Cuántos principios distintos enumera literalmente el artículo 9.3 de la Constitución, según el texto citado en el Tema 2?",
    opciones: ["Cinco", "Seis", "Siete", "Ocho"],
    respuestaCorrecta: 2,
    justificacionIa:
      "El texto citado enumera siete principios: legalidad, jerarquía normativa, publicidad de las normas, irretroactividad de las disposiciones sancionadoras no favorables o restrictivas de derechos individuales, seguridad jurídica, responsabilidad e interdicción de la arbitrariedad de los poderes públicos.",
    mnemotecnia:
      "Siete principios del 9.3: legalidad, jerarquía, publicidad, irretroactividad, seguridad jurídica, responsabilidad e interdicción de la arbitrariedad.",
    dificultad: 2,
  },
  {
    enunciado:
      "Complete el texto literal del artículo 9.3 CE citado en el Tema 2: «La Constitución garantiza el principio de legalidad, la jerarquía normativa, la publicidad de las normas, la irretroactividad de las disposiciones sancionadoras no favorables o restrictivas de derechos individuales, la seguridad jurídica, la ___ y la interdicción de la arbitrariedad de los poderes públicos.»",
    opciones: ["eficacia", "responsabilidad", "coordinación", "descentralización"],
    respuestaCorrecta: 1,
    justificacionIa:
      "El texto literal citado incluye «la responsabilidad» entre la seguridad jurídica y la interdicción de la arbitrariedad. Eficacia, coordinación y descentralización son principios de la actuación administrativa recogidos en otro artículo (103.1 CE), no en el 9.3.",
    mnemotecnia:
      "Entre seguridad jurídica y arbitrariedad se cuela la RESPONSABILIDAD: el penúltimo principio del 9.3.",
    dificultad: 3,
  },
];

export const TAI_TEMA3_PREGUNTAS = [
  {
    enunciado:
      "Según el artículo 56 de la Constitución, ¿qué título ostenta el Jefe del Estado español?",
    opciones: ["Rey de España", "Príncipe de Asturias", "Jefe de Estado y de Gobierno", "Rey de las Españas"],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 56 CE cierra su enumeración de funciones señalando que «su título es el de Rey de España». El «Príncipe de Asturias» es, según el artículo 57 CE, el título que ostenta el heredero de la Corona, no el Jefe del Estado.",
    mnemotecnia:
      "El Rey es Rey de España; el heredero es Príncipe de Asturias (art. 56 vs. art. 57).",
    dificultad: 1,
  },
  {
    enunciado:
      "Según el artículo 57 de la Constitución, en el orden de sucesión a la Corona, en el mismo grado se prefiere:",
    opciones: [
      "A la persona de más edad, sin distinción de sexo",
      "Al varón sobre la mujer",
      "A la mujer sobre el varón",
      "Al pariente de la línea posterior sobre el de la línea anterior",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 57 CE fija el orden de primogenitura y representación: «prefiriéndose siempre la línea anterior a las posteriores; en la misma línea, el grado más próximo al más remoto; en el mismo grado, el varón a la mujer, y en el mismo sexo, la persona de más edad a la de menos». En el mismo grado, por tanto, se prefiere al varón.",
    mnemotecnia:
      "Orden del art. 57: línea anterior > grado próximo > varón > más edad.",
    dificultad: 2,
  },
  {
    enunciado:
      "Conforme al artículo 57 de la Constitución, el príncipe heredero ostenta la dignidad de Príncipe de Asturias:",
    opciones: [
      "Solo tras cumplir la mayoría de edad",
      "Desde su nacimiento o desde que se produzca el hecho que origine el llamamiento",
      "Desde su proclamación ante las Cortes Generales",
      "Desde que preste el juramento previsto para el Rey",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 57 CE establece que «el príncipe heredero ostenta, desde su nacimiento o desde que se produzca el hecho que origine el llamamiento, la dignidad de Príncipe de Asturias». No se condiciona a la mayoría de edad, a una proclamación ni a un juramento.",
    mnemotecnia:
      "Príncipe de Asturias desde el minuto uno: nacimiento o hecho que origina el llamamiento (art. 57).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 58 de la Constitución, la Reina consorte o el consorte de la Reina:",
    opciones: [
      "Pueden asumir cualquier función constitucional del Rey por delegación expresa",
      "No pueden asumir funciones constitucionales, salvo lo dispuesto para la Regencia",
      "Ejercen automáticamente la Regencia si el Rey es menor de edad",
      "Forman parte del Consejo de Estado con voto",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 58 CE dispone, sin más matices, que «la Reina consorte o el consorte de la Reina no podrán asumir funciones constitucionales, salvo lo dispuesto para la Regencia». La Regencia, según el artículo 59 CE, corresponde en su caso al padre o la madre del Rey, no automáticamente al consorte.",
    mnemotecnia:
      "El consorte no pinta nada constitucionalmente, salvo la excepción de la Regencia (art. 58).",
    dificultad: 2,
  },
  {
    enunciado:
      "De acuerdo con el artículo 59 de la Constitución, si el Rey se inhabilita para el ejercicio de su autoridad, entra a ejercer la Regencia:",
    opciones: [
      "El Presidente del Gobierno",
      "El Presidente del Congreso de los Diputados",
      "El Príncipe heredero, si es mayor de edad",
      "El pariente mayor de edad más próximo a suceder en la Corona, en todo caso",
    ],
    respuestaCorrecta: 2,
    justificacionIa:
      "El artículo 59 CE establece que, si el Rey se inhabilita para el ejercicio de su autoridad, «entrará a ejercer inmediatamente la Regencia el Príncipe heredero, si fuera mayor de edad». El supuesto del pariente mayor de edad más próximo se prevé para el caso distinto de minoría de edad del Rey, en defecto del padre o la madre.",
    mnemotecnia:
      "Rey inhabilitado: Regencia para el Príncipe heredero mayor de edad (art. 59).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 60 de la Constitución, el cargo de tutor del Rey menor de edad:",
    opciones: [
      "Es compatible con el de regente, si concurren en la misma persona",
      "Es incompatible con el de regente",
      "Solo puede ejercerlo el Presidente del Gobierno",
      "Corresponde en todo caso al Presidente del Congreso",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El bloque señala que el artículo 60 CE «regula quién ejerce la tutela del Rey menor de edad; el cargo de tutor es incompatible con el de regente». Se trata, por tanto, de cargos que no pueden coincidir en la misma persona.",
    mnemotecnia:
      "Tutor y regente, cargos separados: el art. 60 los declara incompatibles entre sí.",
    dificultad: 2,
  },
  {
    enunciado:
      "Conforme al artículo 61 de la Constitución, el Rey presta juramento al ser proclamado:",
    opciones: [
      "Ante el Tribunal Constitucional",
      "Ante las Cortes Generales",
      "Ante el Consejo de Estado",
      "Ante el Consejo General del Poder Judicial",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 61 CE establece que «el Rey, al ser proclamado ante las Cortes Generales, prestará juramento de desempeñar fielmente sus funciones, guardar y hacer guardar la Constitución y las leyes y respetar los derechos de los ciudadanos y de las Comunidades Autónomas».",
    mnemotecnia:
      "El juramento del Rey se presta ante las CORTES GENERALES, no ante otro órgano (art. 61).",
    dificultad: 1,
  },
  {
    enunciado:
      "Según el artículo 62 de la Constitución, respecto del derecho de gracia, el Rey:",
    opciones: [
      "Puede ejercerlo, sin poder autorizar indultos generales",
      "No puede ejercerlo bajo ningún concepto",
      "Puede ejercerlo, incluyendo la autorización de indultos generales",
      "Solo puede ejercerlo previa autorización de las Cortes Generales en cada caso",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "Entre las funciones del artículo 62 CE se incluye «ejercer el derecho de gracia con arreglo a la ley, que no podrá autorizar indultos generales». El Rey sí puede ejercer el derecho de gracia, pero con esa limitación expresa.",
    mnemotecnia:
      "El Rey indulta, pero nunca en masa: derecho de gracia sí, indultos generales no (art. 62).",
    dificultad: 2,
  },
  {
    enunciado:
      "De acuerdo con el artículo 63 de la Constitución, para declarar la guerra y hacer la paz, el Rey necesita:",
    opciones: [
      "Actuar sin ningún requisito adicional, por ser el mando supremo de las Fuerzas Armadas",
      "La previa autorización de las Cortes Generales",
      "El refrendo exclusivo del Ministro de Defensa",
      "La aprobación previa del Consejo de Estado",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 63 CE dispone que el Rey, «previa autorización de las Cortes Generales, declara la guerra y hace la paz». No basta, por tanto, con su condición de mando supremo de las Fuerzas Armadas, prevista en el artículo 62 CE.",
    mnemotecnia:
      "Guerra y paz: el Rey necesita el visto bueno previo de las Cortes Generales (art. 63).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 64 de la Constitución, ¿quién refrenda la propuesta y el nombramiento del Presidente del Gobierno?",
    opciones: [
      "El propio Presidente del Gobierno saliente",
      "El Presidente del Congreso",
      "El Presidente del Tribunal Constitucional",
      "El Vicepresidente primero del Gobierno",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 64 CE establece que, con carácter general, los actos del Rey son refrendados por el Presidente del Gobierno y, en su caso, por los Ministros competentes, pero «la propuesta y el nombramiento del Presidente del Gobierno, y la disolución prevista en el artículo 99, serán refrendados por el Presidente del Congreso».",
    mnemotecnia:
      "Nombramiento del Presidente del Gobierno: lo refrenda el Presidente del CONGRESO, no el propio Gobierno (art. 64).",
    dificultad: 3,
  },
  {
    enunciado:
      "Conforme al artículo 64 de la Constitución, de los actos del Rey refrendados por otra persona, la responsabilidad corresponde a:",
    opciones: [
      "El propio Rey, siempre de forma solidaria con quien refrenda",
      "Las personas que autorizan el refrendo",
      "Las Cortes Generales en su conjunto",
      "El Tribunal Constitucional",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El bloque señala que «de ese refrendo son responsables las personas que lo autorizan — el propio Rey, según el artículo 56.3, es inviolable y no está sujeto a responsabilidad». La responsabilidad se traslada, por tanto, a quien refrenda, nunca al Rey.",
    mnemotecnia:
      "El Rey es inviolable; quien carga con la responsabilidad es quien REFRENDA (art. 64, con el art. 56.3).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 65 de la Constitución, la cantidad global que el Rey recibe de los Presupuestos Generales del Estado para el sostenimiento de su Familia y Casa:",
    opciones: [
      "La fija anualmente el Consejo de Ministros, partida por partida",
      "La distribuye libremente el Rey",
      "La administra el Consejo de Estado en su nombre",
      "Debe destinarse íntegramente a fines de representación internacional",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 65 CE dispone que el Rey «recibe de los Presupuestos del Estado una cantidad global para el sostenimiento de su Familia y Casa, y distribuye libremente la misma». El mismo artículo añade que nombra y releva con libertad a los miembros civiles y militares de su Casa.",
    mnemotecnia:
      "Cantidad global para la Casa Real: el Rey la distribuye LIBREMENTE (art. 65).",
    dificultad: 1,
  },
];

export const TAI_TEMA4_PREGUNTAS = [
  {
    enunciado:
      "Según el artículo 66 de la Constitución, las Cortes Generales están formadas por:",
    opciones: [
      "El Congreso de los Diputados y el Senado",
      "El Congreso de los Diputados, el Senado y el Consejo de Estado",
      "El Congreso de los Diputados y el Consejo General del Poder Judicial",
      "Únicamente el Congreso de los Diputados",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 66 CE dispone que «las Cortes Generales representan al pueblo español y están formadas por el Congreso de los Diputados y el Senado». Además, ejercen la potestad legislativa del Estado, aprueban sus Presupuestos, controlan la acción del Gobierno y son inviolables.",
    mnemotecnia:
      "Cortes Generales = Congreso + Senado, y nada más (art. 66).",
    dificultad: 1,
  },
  {
    enunciado:
      "De acuerdo con el artículo 67 de la Constitución, los miembros de las Cortes Generales:",
    opciones: [
      "Pueden ser simultáneamente Diputados y Senadores si así lo autoriza su partido",
      "No están ligados por mandato imperativo",
      "Están ligados por mandato imperativo respecto de su circunscripción",
      "Solo pueden votar según las instrucciones vinculantes de su grupo parlamentario",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 67 CE establece que «nadie podrá ser miembro de las dos Cámaras simultáneamente» y que «los miembros de las Cortes Generales no estarán ligados por mandato imperativo».",
    mnemotecnia:
      "En las Cortes no hay mandato imperativo ni doble militancia entre Cámaras (art. 67).",
    dificultad: 1,
  },
  {
    enunciado:
      "Según el artículo 68 de la Constitución, el Congreso de los Diputados se compone de un número de Diputados comprendido entre:",
    opciones: ["200 y 300", "300 y 400", "350 fijos, sin margen", "400 y 500"],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 68 CE fija que el Congreso «se compone de un mínimo de 300 y un máximo de 400 Diputados», elegidos por sufragio universal, libre, igual, directo y secreto, con la provincia como circunscripción electoral y un mandato de 4 años.",
    mnemotecnia:
      "Congreso: entre 300 y 400 Diputados, ni uno menos ni uno más (art. 68).",
    dificultad: 1,
  },
  {
    enunciado:
      "Conforme al artículo 69 de la Constitución, cada provincia elige un número de Senadores igual a:",
    opciones: ["2", "3", "4", "6"],
    respuestaCorrecta: 2,
    justificacionIa:
      "El artículo 69 CE, al definir el Senado como Cámara de representación territorial, establece que «en cada provincia se elegirán cuatro Senadores», con un mandato de 4 años, sin perjuicio de los Senadores adicionales que designan las Comunidades Autónomas.",
    mnemotecnia:
      "El Senado se reparte de 4 en 4 por provincia (art. 69).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 69 de la Constitución, además de los Senadores por provincia, las Comunidades Autónomas designan:",
    opciones: [
      "Un Senador y uno más por cada millón de habitantes de su territorio",
      "Dos Senadores fijos, sin relación con la población",
      "Un Senador por cada Diputación provincial",
      "Ningún Senador adicional, salvo Ceuta y Melilla",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 69 CE añade que «las Comunidades Autónomas designarán además un Senador y otro más por cada millón de habitantes de su territorio». Es un criterio poblacional, no fijo ni provincial.",
    mnemotecnia:
      "CCAA: 1 Senador fijo + 1 más por cada millón de habitantes (art. 69).",
    dificultad: 2,
  },
  {
    enunciado:
      "De acuerdo con el artículo 71 de la Constitución, Diputados y Senadores gozan durante su mandato de inmunidad, lo que significa que:",
    opciones: [
      "No pueden ser detenidos en ningún caso, ni siquiera en flagrante delito",
      "Solo pueden ser detenidos en caso de flagrante delito, y no inculpados ni procesados sin la previa autorización de la Cámara respectiva",
      "Pueden ser detenidos libremente, pero no procesados sin autorización judicial",
      "La inmunidad se limita a las opiniones manifestadas en el ejercicio de sus funciones",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 71 CE distingue inviolabilidad (por las opiniones manifestadas en el ejercicio de sus funciones) de inmunidad: durante su mandato, Diputados y Senadores «solo podrán ser detenidos en caso de flagrante delito», y «no podrán ser inculpados ni procesados sin la previa autorización de la Cámara respectiva». La causa contra ellos corresponde a la Sala de lo Penal del Tribunal Supremo.",
    mnemotecnia:
      "Inmunidad: detención solo en flagrante delito, y procesamiento solo con permiso de la Cámara (art. 71).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 73 de la Constitución, las Cortes Generales se reúnen anualmente en dos periodos ordinarios de sesiones:",
    opciones: [
      "De enero a junio y de septiembre a diciembre",
      "De septiembre a diciembre y de febrero a junio",
      "De marzo a julio y de octubre a diciembre",
      "De enero a marzo y de julio a septiembre",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 73 CE fija los dos periodos ordinarios de sesiones: «de septiembre a diciembre y de febrero a junio». También pueden reunirse en sesión extraordinaria a petición del Gobierno, de la Diputación Permanente o de la mayoría absoluta de los miembros de cualquiera de las Cámaras.",
    mnemotecnia:
      "Periodos ordinarios: sept-dic y feb-jun, con hueco navideño y veraniego (art. 73).",
    dificultad: 2,
  },
  {
    enunciado:
      "Conforme al artículo 78 de la Constitución, la Diputación Permanente de cada Cámara tiene un número mínimo de miembros de:",
    opciones: ["15", "21", "25", "30"],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 78 CE establece que cada Cámara tiene una Diputación Permanente «con un mínimo de 21 miembros», presidida por el Presidente de la Cámara, que vela por los poderes de la Cámara cuando esta no está reunida.",
    mnemotecnia:
      "Diputación Permanente: mínimo 21 miembros, ni uno menos (art. 78).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 81 de la Constitución, la aprobación, modificación o derogación de una ley orgánica exige:",
    opciones: [
      "Mayoría simple del Congreso",
      "Mayoría absoluta del Congreso, en una votación final sobre el conjunto del proyecto",
      "Mayoría de tres quintos de cada Cámara",
      "Mayoría absoluta del Senado exclusivamente",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 81 CE dispone que la aprobación, modificación o derogación de las leyes orgánicas «exigirá la mayoría absoluta del Congreso, en una votación final sobre el conjunto del proyecto». Son leyes orgánicas, entre otras, las relativas al desarrollo de los derechos fundamentales y las libertades públicas, y las que aprueben los Estatutos de Autonomía.",
    mnemotecnia:
      "Ley orgánica = mayoría absoluta del Congreso, votación final de conjunto (art. 81).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 86 de la Constitución, los Decretos-leyes que dicte el Gobierno en caso de extraordinaria y urgente necesidad deben someterse a debate y votación de totalidad del Congreso en el plazo de:",
    opciones: ["15 días", "30 días", "2 meses", "60 días"],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 86 CE establece que los Decretos-leyes «deberán ser inmediatamente sometidos a debate y votación de totalidad al Congreso de los Diputados, convocado a tal efecto si no estuviere reunido, en el plazo de los treinta días siguientes a su promulgación», para su convalidación o derogación.",
    mnemotecnia:
      "Decreto-ley: 30 días para que el Congreso lo convalide o lo tumbe (art. 86).",
    dificultad: 2,
  },
  {
    enunciado:
      "De acuerdo con el artículo 87 de la Constitución, la iniciativa legislativa popular exige no menos de:",
    opciones: ["100.000 firmas acreditadas", "250.000 firmas acreditadas", "500.000 firmas acreditadas", "1.000.000 de firmas acreditadas"],
    respuestaCorrecta: 2,
    justificacionIa:
      "El artículo 87 CE remite a una ley orgánica la regulación de la iniciativa popular, que «no procederá en materias propias de ley orgánica, tributarias o de carácter internacional, ni en lo relativo a la prerrogativa de gracia» y exige no menos de 500.000 firmas acreditadas.",
    mnemotecnia:
      "Iniciativa popular: mínimo medio millón de firmas, 500.000 (art. 87).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 94 de la Constitución, la prestación del consentimiento del Estado para obligarse por tratados internacionales requiere la previa autorización de las Cortes Generales, entre otros casos, cuando el tratado:",
    opciones: [
      "Sea de mero trámite administrativo entre Estados",
      "Implique obligaciones para la Hacienda Pública",
      "Se refiera exclusivamente a materia cultural",
      "Sea propuesto por una Comunidad Autónoma",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 94 CE exige la previa autorización de las Cortes Generales para los tratados de carácter político o militar, los que afecten a la integridad territorial o a los derechos y deberes del Título I, los que impliquen obligaciones para la Hacienda Pública, o los que supongan modificación o derogación de una ley.",
    mnemotecnia:
      "Tratado que toca la Hacienda Pública: necesita el visto bueno de las Cortes (art. 94).",
    dificultad: 2,
  },
];

export const TAI_TEMA5_PREGUNTAS = [
  {
    enunciado:
      "Según el artículo 97 de la Constitución, el Gobierno dirige la política interior y exterior, la Administración civil y militar y la defensa del Estado, y ejerce:",
    opciones: [
      "La función legislativa y la potestad jurisdiccional",
      "La función ejecutiva y la potestad reglamentaria",
      "Únicamente la potestad reglamentaria",
      "La función ejecutiva y la potestad legislativa ordinaria",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 97 CE dispone que el Gobierno «dirige la política interior y exterior, la Administración civil y militar y la defensa del Estado. Ejerce la función ejecutiva y la potestad reglamentaria de acuerdo con la Constitución y las leyes».",
    mnemotecnia:
      "El Gobierno EJECUTA y REGLAMENTA; legislar es cosa de las Cortes (art. 97).",
    dificultad: 1,
  },
  {
    enunciado:
      "De acuerdo con el artículo 98 de la Constitución, los miembros del Gobierno:",
    opciones: [
      "Pueden ejercer, además, actividad profesional o mercantil siempre que la declaren",
      "No pueden ejercer otras funciones representativas ni actividad profesional o mercantil alguna",
      "Solo tienen prohibida la actividad mercantil, pero no la profesional",
      "Pueden compatibilizar su cargo con un escaño en el Parlamento Europeo sin restricción",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 98 CE, tras fijar que el Gobierno se compone del Presidente, Vicepresidentes en su caso, Ministros y demás miembros que establezca la ley, añade que sus miembros «no podrán ejercer otras funciones representativas que las propias del mandato parlamentario, ni cualquier otra función pública que no derive de su cargo, ni actividad profesional o mercantil alguna».",
    mnemotecnia:
      "Ser ministro es incompatible con casi todo lo demás: ni otra representación, ni negocios (art. 98).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 99 de la Constitución, si el candidato propuesto por el Rey no obtiene la confianza del Congreso en la primera votación por mayoría absoluta, se somete a nueva votación 48 horas después, en la que basta:",
    opciones: [
      "La mayoría absoluta también en esta segunda votación",
      "La mayoría simple",
      "Los dos tercios de la Cámara",
      "La mayoría absoluta del Senado",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 99 CE prevé que, si el Congreso no otorga su confianza por mayoría absoluta en la primera votación, «se sometiera la misma propuesta a nueva votación cuarenta y ocho horas después de la anterior, y la confianza se entenderá otorgada si obtuviere la mayoría simple».",
    mnemotecnia:
      "Investidura: primera votación mayoría absoluta, segunda (48h después) mayoría simple (art. 99).",
    dificultad: 2,
  },
  {
    enunciado:
      "Conforme al artículo 99 de la Constitución, si transcurren dos meses desde la primera votación de investidura sin que ningún candidato haya obtenido la confianza del Congreso:",
    opciones: [
      "El Presidente en funciones continúa indefinidamente",
      "El Rey disuelve ambas Cámaras y convoca nuevas elecciones",
      "Asume la Presidencia automáticamente el candidato más votado",
      "El Senado elige un Presidente interino",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 99 CE dispone que, «si transcurrido el plazo de dos meses, a partir de la primera votación de investidura, ningún candidato hubiere obtenido la confianza del Congreso, el Rey disolverá ambas Cámaras y convocará nuevas elecciones con el refrendo del Presidente del Congreso».",
    mnemotecnia:
      "Dos meses sin investidura = disolución y elecciones (art. 99).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 100 de la Constitución, los miembros del Gobierno distintos del Presidente son nombrados y separados por:",
    opciones: [
      "El Rey, a propuesta de su Presidente",
      "El Congreso de los Diputados, por mayoría absoluta",
      "El propio Presidente, sin intervención del Rey",
      "El Consejo de Estado, a propuesta del Presidente",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 100 CE establece que «los demás miembros del Gobierno serán nombrados y separados por el Rey, a propuesta de su Presidente». La iniciativa corresponde al Presidente del Gobierno, pero el nombramiento formal es del Rey.",
    mnemotecnia:
      "Ministros: los propone el Presidente, pero los nombra el REY (art. 100).",
    dificultad: 1,
  },
  {
    enunciado:
      "De acuerdo con el artículo 101 de la Constitución, el Gobierno cesa, entre otros supuestos, tras:",
    opciones: [
      "La celebración de elecciones generales",
      "La disolución del Tribunal Constitucional",
      "El cambio de Legislatura en el Senado exclusivamente",
      "La aprobación de los Presupuestos Generales del Estado",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 101 CE señala que el Gobierno cesa «tras la celebración de elecciones generales, en los casos de pérdida de la confianza parlamentaria previstos en la Constitución, o por dimisión o fallecimiento de su Presidente». El Gobierno cesante continúa en funciones hasta la toma de posesión del nuevo Gobierno.",
    mnemotecnia:
      "El Gobierno cesa con elecciones, pérdida de confianza, dimisión o fallecimiento del Presidente (art. 101).",
    dificultad: 1,
  },
  {
    enunciado:
      "Según el artículo 102 de la Constitución, la responsabilidad criminal del Presidente y los demás miembros del Gobierno es exigible ante:",
    opciones: [
      "El Tribunal Constitucional",
      "La Sala de lo Penal del Tribunal Supremo",
      "El Consejo General del Poder Judicial",
      "El Congreso de los Diputados en Pleno",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 102 CE dispone que la responsabilidad criminal del Presidente y los demás miembros del Gobierno «será exigible, en su caso, ante la Sala de lo Penal del Tribunal Supremo». La acusación por traición o por delito contra la seguridad del Estado solo puede plantearse por iniciativa de una cuarta parte del Congreso y con la aprobación de la mayoría absoluta, sin que la prerrogativa real de gracia sea aplicable a estos supuestos.",
    mnemotecnia:
      "Ministros ante los tribunales: siempre en la Sala de lo Penal del Tribunal Supremo (art. 102).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 103 de la Constitución, la Administración Pública sirve con objetividad los intereses generales y actúa de acuerdo con los principios de eficacia, jerarquía, descentralización, desconcentración y coordinación, con:",
    opciones: [
      "Sometimiento pleno a la ley y al Derecho",
      "Autonomía plena respecto de los Tribunales",
      "Sometimiento exclusivo a los reglamentos internos de cada organismo",
      "Discrecionalidad plena en la aplicación de las normas",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 103.1 CE cierra la enumeración de principios con «sometimiento pleno a la ley y al Derecho». Además, la ley regula el acceso a la función pública de acuerdo con los principios de mérito y capacidad.",
    mnemotecnia:
      "La Administración se somete PLENAMENTE a la ley y al Derecho, sin excepciones (art. 103).",
    dificultad: 1,
  },
  {
    enunciado:
      "De acuerdo con el artículo 104 de la Constitución, las Fuerzas y Cuerpos de Seguridad, bajo la dependencia del Gobierno, tienen como misión:",
    opciones: [
      "Dirigir la política de defensa nacional",
      "Proteger el libre ejercicio de los derechos y libertades y garantizar la seguridad ciudadana",
      "Ejercer la jurisdicción penal militar",
      "Sustituir a la Administración de Justicia en los delitos leves",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 104 CE establece que las Fuerzas y Cuerpos de Seguridad, bajo la dependencia del Gobierno, «tendrán como misión proteger el libre ejercicio de los derechos y libertades y garantizar la seguridad ciudadana».",
    mnemotecnia:
      "Fuerzas de Seguridad: protegen derechos y garantizan seguridad ciudadana (art. 104).",
    dificultad: 1,
  },
  {
    enunciado:
      "Según el artículo 106 de la Constitución, los particulares tienen derecho a ser indemnizados por toda lesión que sufran en sus bienes y derechos como consecuencia del funcionamiento de los servicios públicos, salvo:",
    opciones: [
      "En casos de fuerza mayor",
      "Cuando la lesión sea de escasa cuantía",
      "Cuando el servicio público sea gestionado por una empresa privada",
      "En ningún caso: la indemnización es siempre exigible",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 106.2 CE reconoce el derecho de los particulares a ser indemnizados por toda lesión sufrida en sus bienes y derechos por el funcionamiento de los servicios públicos, «salvo en los casos de fuerza mayor». El propio artículo 106.1 CE atribuye a los Tribunales el control de la potestad reglamentaria y de la legalidad de la actuación administrativa.",
    mnemotecnia:
      "Responsabilidad patrimonial de la Administración: siempre, salvo FUERZA MAYOR (art. 106).",
    dificultad: 2,
  },
];

export const TAI_TEMA6_PREGUNTAS = [
  {
    enunciado:
      "Según el artículo 108 de la Constitución, el Gobierno responde de su gestión política:",
    opciones: [
      "Solidariamente ante el Congreso de los Diputados",
      "Individualmente cada ministro ante el Senado",
      "Ante el Tribunal Constitucional",
      "Ante el Rey exclusivamente",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 108 CE dispone, sin más matices, que «el Gobierno responde solidariamente en su gestión política ante el Congreso de los Diputados».",
    mnemotecnia:
      "Responsabilidad política del Gobierno: SOLIDARIA y ante el CONGRESO (art. 108).",
    dificultad: 1,
  },
  {
    enunciado:
      "De acuerdo con el artículo 109 de la Constitución, las Cámaras y sus Comisiones pueden recabar información y ayuda que precisen:",
    opciones: [
      "Solo del Gobierno, y nunca de las Comunidades Autónomas",
      "Del Gobierno y de sus departamentos, y de cualquier autoridad del Estado y de las Comunidades Autónomas",
      "Únicamente del Tribunal de Cuentas",
      "Del Consejo General del Poder Judicial exclusivamente",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 109 CE establece que «las Cámaras y sus Comisiones podrán recabar la información y ayuda que precisen del Gobierno y de sus Departamentos y de cualesquiera autoridades del Estado y de las Comunidades Autónomas».",
    mnemotecnia:
      "El derecho de información de las Cámaras alcanza al Gobierno y a cualquier autoridad, estatal o autonómica (art. 109).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según los artículos 110 y 111 de la Constitución, los miembros del Gobierno están sometidos a interpelaciones y preguntas que se formulen en las Cámaras, existiendo:",
    opciones: [
      "Un tiempo mínimo semanal reservado a ese tipo de debates",
      "Una única sesión anual dedicada a preguntas",
      "Solo la posibilidad de preguntas escritas, sin comparecencia oral",
      "Un límite máximo de una interpelación por Legislatura",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El bloque señala que, conforme a los artículos 110 y 111 CE, los miembros del Gobierno «están sometidos a interpelaciones y preguntas que se formulen en las Cámaras, con un tiempo mínimo semanal reservado a ello; toda interpelación puede dar lugar a una moción».",
    mnemotecnia:
      "Control parlamentario semanal: interpelaciones y preguntas con tiempo mínimo reservado cada semana (arts. 110-111).",
    dificultad: 2,
  },
  {
    enunciado:
      "De acuerdo con el artículo 112 de la Constitución, la cuestión de confianza sobre el programa o una declaración de política general se entiende otorgada cuando:",
    opciones: [
      "Vote a favor la mayoría absoluta de los Diputados",
      "Vote a favor la mayoría simple de los Diputados",
      "Vote a favor la mayoría absoluta del Senado",
      "Se apruebe por unanimidad del Consejo de Ministros",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 112 CE dispone que el Presidente del Gobierno, previa deliberación del Consejo de Ministros, puede plantear ante el Congreso la cuestión de confianza, y que «la confianza se entenderá otorgada cuando vote a favor de la misma la mayoría simple de los Diputados».",
    mnemotecnia:
      "Cuestión de confianza: basta la mayoría SIMPLE del Congreso (art. 112).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 113 de la Constitución, la moción de censura debe ser propuesta al menos por:",
    opciones: [
      "Una décima parte de los Diputados",
      "Una cuarta parte de los Diputados",
      "La mayoría absoluta de los Diputados",
      "Cincuenta Diputados y cincuenta Senadores conjuntamente",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 113 CE exige que la moción de censura sea «propuesta al menos por la décima parte de los Diputados, y habrá de incluir un candidato a la Presidencia del Gobierno» (la llamada moción de censura constructiva). Su adopción requiere mayoría absoluta, y no puede votarse hasta que transcurran cinco días desde su presentación.",
    mnemotecnia:
      "Moción de censura: la firma al menos 1/10 de los Diputados, con candidato incluido (art. 113).",
    dificultad: 2,
  },
  {
    enunciado:
      "Conforme al artículo 114 de la Constitución, si el Congreso adopta una moción de censura:",
    opciones: [
      "El Gobierno presenta su dimisión y el candidato incluido en la moción se entiende investido de la confianza de la Cámara",
      "El Rey disuelve automáticamente las Cortes Generales",
      "El Presidente saliente convoca directamente nuevas elecciones",
      "Se abre un periodo de dos meses para buscar un nuevo candidato",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 114 CE establece que, si el Congreso adopta una moción de censura, «el Gobierno presentará su dimisión al Rey, y el candidato incluido en aquélla se entenderá investido de la confianza de la Cámara». Es distinto del supuesto de negación de la confianza, en el que el Gobierno también dimite pero sin que haya un candidato ya investido.",
    mnemotecnia:
      "Moción de censura ganada: dimisión del Gobierno y el candidato de la moción queda investido sin más trámite (art. 114).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 115 de la Constitución, la propuesta de disolución de las Cortes Generales por el Presidente del Gobierno no puede presentarse:",
    opciones: [
      "Cuando esté en trámite una moción de censura",
      "Durante el primer año de la Legislatura, en ningún caso",
      "Si el Senado no lo autoriza previamente por mayoría absoluta",
      "Cuando el Congreso esté en periodo de sesiones ordinario",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 115 CE dispone que la propuesta de disolución, que decreta el Rey, «no procederá cuando esté en trámite una moción de censura», y añade que no puede haber una nueva disolución antes de que transcurra un año desde la anterior, salvo lo dispuesto en el artículo 99.5 CE.",
    mnemotecnia:
      "No se disuelve con una moción de censura en marcha: primero se resuelve esa, y luego se piensa en disolver (art. 115).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 116 de la Constitución, el estado de alarma lo declara el Gobierno mediante decreto, por un plazo máximo de:",
    opciones: ["15 días, dando cuenta al Congreso", "30 días, con autorización previa del Congreso", "60 días, prorrogables por otros 60", "10 días, sin necesidad de informar al Congreso"],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 116 CE dispone que «el estado de alarma será declarado por el Gobierno mediante decreto acordado en Consejo de Ministros por un plazo máximo de quince días, dando cuenta al Congreso de los Diputados».",
    mnemotecnia:
      "Alarma: 15 días, decreto del Gobierno, y luego se avisa al Congreso (art. 116).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 116 de la Constitución, el estado de excepción lo declara el Gobierno mediante decreto, por un plazo máximo de 30 días prorrogable por otro igual, previa:",
    opciones: [
      "Autorización del Congreso de los Diputados",
      "Autorización del Senado por mayoría absoluta",
      "Deliberación del Consejo de Estado",
      "Consulta al Tribunal Constitucional",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 116 CE exige que el estado de excepción sea declarado por el Gobierno mediante decreto, «previa autorización del Congreso de los Diputados», por un plazo máximo de treinta días, prorrogable por otro plazo igual, con los mismos requisitos.",
    mnemotecnia:
      "Excepción: 30 días prorrogables, pero antes hace falta el sí del Congreso (art. 116).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 116 de la Constitución, el estado de sitio se declara:",
    opciones: [
      "Por el Gobierno, mediante decreto, sin intervención de las Cortes",
      "Por el Congreso de los Diputados por mayoría absoluta, a propuesta exclusiva del Gobierno",
      "Por el Rey, a propuesta del Presidente del Gobierno",
      "Por el Senado, a propuesta del Congreso",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 116 CE atribuye la declaración del estado de sitio al «Congreso de los Diputados, por mayoría absoluta, a propuesta exclusiva del Gobierno». El bloque añade que, mientras estén declarados estos estados, no puede procederse a la disolución del Congreso.",
    mnemotecnia:
      "Sitio: lo declara el Congreso por mayoría absoluta, aunque la propuesta solo puede venir del Gobierno (art. 116).",
    dificultad: 2,
  },
];

export const TAI_TEMA7_PREGUNTAS = [
  {
    enunciado:
      "Según el artículo 117 de la Constitución, la justicia se administra en nombre del Rey por Jueces y Magistrados que son:",
    opciones: [
      "Independientes, inamovibles, responsables y sometidos únicamente al imperio de la ley",
      "Nombrados por el Congreso de los Diputados para cada mandato",
      "Dependientes jerárquicamente del Ministerio Fiscal",
      "Elegidos por sufragio universal en cada partido judicial",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 117 CE dispone que «la justicia emana del pueblo y se administra en nombre del Rey por Jueces y Magistrados integrantes del poder judicial, independientes, inamovibles, responsables y sometidos únicamente al imperio de la ley». Además, se prohíben los Tribunales de excepción.",
    mnemotecnia:
      "Jueces: independientes, inamovibles, responsables, sometidos solo a la LEY (art. 117).",
    dificultad: 1,
  },
  {
    enunciado:
      "De acuerdo con el artículo 118 de la Constitución, respecto de las sentencias y demás resoluciones firmes de los Jueces y Tribunales:",
    opciones: [
      "Su cumplimiento es potestativo para la Administración",
      "Es obligado cumplirlas, así como prestar la colaboración requerida por los Jueces y Tribunales",
      "Solo son de cumplimiento obligatorio si las dicta el Tribunal Supremo",
      "Pueden ser revisadas discrecionalmente por el Gobierno",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 118 CE establece que «es obligado cumplir las sentencias y demás resoluciones firmes de los Jueces y Tribunales, así como prestar la colaboración requerida por éstos en el curso del proceso y en la ejecución de lo resuelto».",
    mnemotecnia:
      "Sentencia firme: cumplimiento obligatorio y colaboración obligatoria con los Jueces (art. 118).",
    dificultad: 1,
  },
  {
    enunciado:
      "Según el artículo 119 de la Constitución, la justicia es gratuita:",
    opciones: [
      "En todo caso, sin excepciones",
      "Cuando así lo disponga la ley y, en todo caso, respecto de quienes acrediten insuficiencia de recursos para litigar",
      "Únicamente en el orden jurisdiccional penal",
      "Solo para las personas jurídicas sin ánimo de lucro",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 119 CE dispone que «la justicia será gratuita cuando así lo disponga la ley y, en todo caso, respecto de quienes acrediten insuficiencia de recursos para litigar».",
    mnemotecnia:
      "Justicia gratuita: lo que diga la ley, y siempre para quien no tenga recursos (art. 119).",
    dificultad: 1,
  },
  {
    enunciado:
      "Conforme al artículo 120 de la Constitución, las sentencias:",
    opciones: [
      "Se motivan siempre y se pronuncian en audiencia pública",
      "Solo se motivan en el orden penal",
      "No requieren motivación cuando exista conformidad de las partes",
      "Se pronuncian siempre a puerta cerrada",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 120 CE establece que las actuaciones judiciales son públicas, salvo excepciones previstas en las leyes de procedimiento, que el procedimiento será predominantemente oral, sobre todo en materia criminal, y que «las sentencias serán siempre motivadas y se pronunciarán en audiencia pública».",
    mnemotecnia:
      "Sentencias: SIEMPRE motivadas y en audiencia PÚBLICA, sin excepción (art. 120).",
    dificultad: 1,
  },
  {
    enunciado:
      "Según el artículo 121 de la Constitución, los daños causados por error judicial dan derecho a una indemnización a cargo de:",
    opciones: [
      "El Juez o Magistrado responsable, con su patrimonio personal",
      "El Estado, conforme a la ley",
      "El Consejo General del Poder Judicial, con cargo a su presupuesto",
      "El Colegio de Abogados que hubiera intervenido en el proceso",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 121 CE dispone que «los daños causados por error judicial, así como los que sean consecuencia del funcionamiento anormal de la Administración de Justicia, darán derecho a una indemnización a cargo del Estado, conforme a la ley».",
    mnemotecnia:
      "Error judicial: indemniza el ESTADO, no el juez con su bolsillo (art. 121).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 122 de la Constitución, el Consejo General del Poder Judicial está integrado por el Presidente del Tribunal Supremo, que lo preside, y veinte miembros nombrados por el Rey por un periodo de:",
    opciones: ["Cuatro años", "Cinco años", "Seis años", "Nueve años"],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 122 CE fija que el CGPJ está integrado por el Presidente del Tribunal Supremo, que lo preside, y veinte miembros nombrados por el Rey «por un período de cinco años», de los cuales doce entre Jueces y Magistrados, y ocho (cuatro a propuesta del Congreso y cuatro a propuesta del Senado) entre juristas de reconocida competencia.",
    mnemotecnia:
      "CGPJ: 20 vocales + el Presidente del TS, mandato de CINCO años (art. 122); no confundir con los 9 años del Tribunal Constitucional.",
    dificultad: 2,
  },
  {
    enunciado:
      "Conforme al artículo 122 de la Constitución, de los veinte miembros del Consejo General del Poder Judicial, ¿cuántos son nombrados entre juristas de reconocida competencia?",
    opciones: ["Cuatro", "Ocho", "Doce", "Veinte"],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 122 CE distribuye los veinte vocales en doce entre Jueces y Magistrados y ocho «entre abogados y otros juristas» de reconocida competencia, cuatro a propuesta del Congreso y cuatro a propuesta del Senado, por mayoría de 3/5.",
    mnemotecnia:
      "CGPJ: 12 togados + 8 juristas (4 del Congreso, 4 del Senado) = 20 (art. 122).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 123 de la Constitución, el Presidente del Tribunal Supremo es nombrado por el Rey:",
    opciones: [
      "A propuesta del Consejo General del Poder Judicial",
      "A propuesta del Gobierno, oído el Congreso",
      "Por elección directa entre los Magistrados del propio Tribunal",
      "A propuesta del Ministerio Fiscal",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 123 CE establece que el Tribunal Supremo, con jurisdicción en toda España, es el órgano jurisdiccional superior en todos los órdenes salvo lo dispuesto en materia de garantías constitucionales, y que «su Presidente será nombrado por el Rey, a propuesta del Consejo General del Poder Judicial».",
    mnemotecnia:
      "Presidente del TS: lo propone el CGPJ, lo nombra el Rey (art. 123).",
    dificultad: 2,
  },
  {
    enunciado:
      "De acuerdo con el artículo 124 de la Constitución, el Ministerio Fiscal ejerce sus funciones conforme a los principios de:",
    opciones: [
      "Unidad de actuación y dependencia jerárquica",
      "Independencia total y colegialidad",
      "Autonomía plena respecto del Fiscal General del Estado",
      "Elección directa de cada Fiscal por sufragio universal",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 124 CE dispone que el Ministerio Fiscal, que tiene por misión promover la acción de la justicia en defensa de la legalidad, de los derechos de los ciudadanos y del interés público tutelado por la ley, «ejercerá sus funciones por medio de órganos propios conforme a los principios de unidad de actuación y dependencia jerárquica». El Fiscal General del Estado es nombrado por el Rey, a propuesta del Gobierno, oído el Consejo General del Poder Judicial.",
    mnemotecnia:
      "Fiscalía: unidad de actuación y jerarquía, no independencia individual de cada fiscal (art. 124).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 125 de la Constitución, los ciudadanos pueden participar en la Administración de Justicia mediante:",
    opciones: [
      "La institución del Jurado",
      "El nombramiento directo de Jueces por sufragio",
      "La revisión ciudadana de las sentencias del Tribunal Supremo",
      "La designación popular del Fiscal General del Estado",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 125 CE reconoce que «los ciudadanos podrán ejercer la acción popular y participar en la Administración de Justicia mediante la institución del Jurado, en la forma y con respecto a aquellos procesos penales que la ley determine, así como en los Tribunales consuetudinarios y tradicionales».",
    mnemotecnia:
      "Participación ciudadana en la Justicia: acción popular + JURADO (art. 125).",
    dificultad: 2,
  },
];

export const TAI_TEMA8_PREGUNTAS = [
  {
    enunciado:
      "Según el artículo 128 de la Constitución, toda la riqueza del país, en sus distintas formas y sea cual fuere su titularidad, está subordinada a:",
    opciones: [
      "El interés general",
      "Los intereses de las Comunidades Autónomas",
      "La decisión exclusiva de las Cortes Generales",
      "El interés de los consumidores y usuarios",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 128.1 CE dispone que «toda la riqueza del país en sus distintas formas y sea cual fuere su titularidad está subordinada al interés general». El artículo 128.2 reconoce además la iniciativa pública en la actividad económica y permite reservar por ley al sector público recursos o servicios esenciales, especialmente en caso de monopolio.",
    mnemotecnia:
      "Toda riqueza, sea de quien sea, se subordina al INTERÉS GENERAL (art. 128.1).",
    dificultad: 1,
  },
  {
    enunciado:
      "De acuerdo con el artículo 128 de la Constitución, mediante ley se puede reservar al sector público recursos o servicios esenciales, especialmente en caso de:",
    opciones: ["Monopolio", "Déficit presupuestario", "Emergencia climática", "Conflicto bélico"],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 128.2 CE establece que «se reconoce la iniciativa pública en la actividad económica. Mediante ley se podrá reservar al sector público recursos o servicios esenciales, especialmente en caso de monopolio».",
    mnemotecnia:
      "Reserva al sector público: pensada especialmente para el caso de MONOPOLIO (art. 128.2).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 129 de la Constitución, los poderes públicos fomentan, mediante legislación adecuada:",
    opciones: [
      "Las sociedades cooperativas",
      "Las sociedades anónimas cotizadas",
      "Los monopolios estatales",
      "Las fundaciones privadas",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 129.2 CE dispone que «los poderes públicos promoverán eficazmente las diversas formas de participación en la empresa y fomentarán, mediante una legislación adecuada, las sociedades cooperativas».",
    mnemotecnia:
      "Participación en la empresa: fomento expreso de las COOPERATIVAS (art. 129).",
    dificultad: 2,
  },
  {
    enunciado:
      "Conforme al artículo 130 de la Constitución, los poderes públicos atienden a la modernización y desarrollo de todos los sectores económicos, en particular de:",
    opciones: [
      "La banca, los seguros y las telecomunicaciones",
      "La agricultura, la ganadería, la pesca y la artesanía",
      "La industria, el turismo y el comercio exterior",
      "La sanidad, la educación y la vivienda",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 130.1 CE señala expresamente que los poderes públicos «atenderán a la modernización y desarrollo de todos los sectores económicos y, en particular, de la agricultura, de la ganadería, de la pesca y de la artesanía».",
    mnemotecnia:
      "Sectores citados por el art. 130: agricultura, ganadería, pesca y artesanía, el campo y el mar.",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 131 de la Constitución, la planificación de la actividad económica general por el Estado se realiza:",
    opciones: [
      "Mediante ley",
      "Mediante decreto del Consejo de Ministros, sin intervención de las Cortes",
      "Mediante convenio con las Comunidades Autónomas exclusivamente",
      "Mediante reglamento de cada Ministerio",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 131.1 CE dispone que «el Estado, mediante ley, podrá planificar la actividad económica general para atender a las necesidades colectivas, equilibrar y armonizar el desarrollo regional y sectorial y estimular el crecimiento de la renta y de la riqueza y su más justa distribución».",
    mnemotecnia:
      "Planificación económica: siempre por LEY, nunca solo por decreto (art. 131).",
    dificultad: 2,
  },
  {
    enunciado:
      "De acuerdo con el artículo 132 de la Constitución, el régimen jurídico de los bienes de dominio público se inspira en los principios de:",
    opciones: [
      "Inalienabilidad, imprescriptibilidad e inembargabilidad",
      "Alienabilidad, prescriptibilidad y embargabilidad",
      "Titularidad exclusiva de las Comunidades Autónomas",
      "Libre disposición por el Gobierno",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 132.1 CE señala que la ley regula el régimen jurídico de los bienes de dominio público y de los comunales, «inspirándose en los principios de inalienabilidad, imprescriptibilidad e inembargabilidad, así como su desafectación».",
    mnemotecnia:
      "Bienes de dominio público: ni se venden, ni se prescriben, ni se embargan (art. 132).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 133 de la Constitución, la potestad originaria para establecer los tributos corresponde exclusivamente a:",
    opciones: [
      "El Estado, mediante ley",
      "Las Comunidades Autónomas",
      "Las Corporaciones Locales",
      "El Tribunal de Cuentas",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 133.1 CE dispone que «la potestad originaria para establecer los tributos corresponde exclusivamente al Estado, mediante ley», si bien las Comunidades Autónomas y las Corporaciones Locales pueden establecer y exigir tributos de acuerdo con la Constitución y las leyes.",
    mnemotecnia:
      "Potestad tributaria ORIGINARIA: solo el Estado, y solo por ley (art. 133).",
    dificultad: 2,
  },
  {
    enunciado:
      "De acuerdo con el artículo 134 de la Constitución, si la ley de Presupuestos no se aprueba antes del primer día del ejercicio económico correspondiente:",
    opciones: [
      "Se paralizan todos los gastos del Estado hasta su aprobación",
      "Se consideran automáticamente prorrogados los Presupuestos del ejercicio anterior hasta la aprobación de los nuevos",
      "Asume la elaboración presupuestaria el Tribunal de Cuentas",
      "El Gobierno queda obligado a dimitir",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 134.4 CE dispone que «si la Ley de Presupuestos no se aprobara antes del primer día del ejercicio económico correspondiente, se considerarán automáticamente prorrogados los Presupuestos del ejercicio anterior hasta la aprobación de los nuevos».",
    mnemotecnia:
      "Sin Presupuestos nuevos a tiempo, se prorrogan automáticamente los del año anterior (art. 134.4).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 135 de la Constitución, el pago de los intereses y el capital de la deuda pública de las Administraciones goza de:",
    opciones: [
      "Prioridad absoluta",
      "Prioridad solo si lo aprueban las Cortes Generales cada año",
      "La misma prioridad que el resto de gastos sociales",
      "Prioridad únicamente en situaciones de déficit estructural",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 135.3 CE establece que «los créditos para satisfacer los intereses y el capital de la deuda pública de las Administraciones se entenderán siempre incluidos en el estado de gastos de sus presupuestos y su pago gozará de prioridad absoluta». El mismo artículo fija que el Estado y las Comunidades Autónomas no pueden incurrir en un déficit estructural que supere los márgenes establecidos para sus Estados miembros por la Unión Europea.",
    mnemotecnia:
      "Deuda pública: su pago tiene PRIORIDAD ABSOLUTA sobre cualquier otro gasto (art. 135).",
    dificultad: 2,
  },
  {
    enunciado:
      "Conforme al artículo 136 de la Constitución, el Tribunal de Cuentas es el supremo órgano fiscalizador de las cuentas y de la gestión económica del Estado, y depende directamente de:",
    opciones: ["Las Cortes Generales", "El Gobierno", "El Tribunal Constitucional", "El Consejo de Estado"],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 136.1 CE dispone que el Tribunal de Cuentas «es el supremo órgano fiscalizador de las cuentas y de la gestión económica del Estado, así como del sector público», y que «depende directamente de las Cortes Generales».",
    mnemotecnia:
      "Tribunal de Cuentas: fiscaliza las cuentas y depende de las CORTES, no del Gobierno (art. 136).",
    dificultad: 1,
  },
];

export const TAI_TEMA9_PREGUNTAS = [
  {
    enunciado:
      "Según el artículo 137 de la Constitución, el Estado se organiza territorialmente en:",
    opciones: [
      "Municipios, provincias y las Comunidades Autónomas que se constituyan",
      "Municipios y Comunidades Autónomas exclusivamente",
      "Regiones históricas y provincias",
      "Provincias y Comunidades Autónomas exclusivamente",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 137 CE dispone que «el Estado se organiza territorialmente en municipios, en provincias y en las Comunidades Autónomas que se constituyan. Todas estas entidades gozan de autonomía para la gestión de sus respectivos intereses».",
    mnemotecnia:
      "Tres niveles territoriales: municipio, provincia y Comunidad Autónoma (art. 137).",
    dificultad: 1,
  },
  {
    enunciado:
      "De acuerdo con el artículo 138 de la Constitución, las diferencias entre los Estatutos de las distintas Comunidades Autónomas:",
    opciones: [
      "Pueden implicar privilegios económicos o sociales",
      "No pueden implicar en ningún caso privilegios económicos o sociales",
      "Solo pueden implicar privilegios en materia fiscal",
      "Están prohibidas por completo, todos los Estatutos deben ser idénticos",
    ],
    respuestaCorrecta: 1,
    justificacionIa:
      "El artículo 138.2 CE establece que «las diferencias entre los Estatutos de las distintas Comunidades Autónomas no podrán implicar, en ningún caso, privilegios económicos o sociales». El artículo 138.1 encomienda al Estado garantizar la solidaridad, atendiendo en particular a las circunstancias del hecho insular.",
    mnemotecnia:
      "Estatutos distintos, pero sin privilegios: la diferencia territorial no puede dar ventajas económicas (art. 138).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 140 de la Constitución, los Concejales son elegidos por los vecinos mediante sufragio:",
    opciones: [
      "Universal, igual, libre, directo y secreto",
      "Restringido a los propietarios de inmuebles",
      "Indirecto, a través de los Alcaldes",
      "Censitario, según el nivel de renta",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 140 CE garantiza la autonomía de los municipios y establece que «los Concejales serán elegidos por los vecinos del municipio mediante sufragio universal, igual, libre, directo y secreto», y los Alcaldes por los Concejales o por los propios vecinos.",
    mnemotecnia:
      "Concejales: mismo sufragio que en las elecciones generales, universal-igual-libre-directo-secreto (art. 140).",
    dificultad: 1,
  },
  {
    enunciado:
      "Conforme al artículo 141 de la Constitución, el gobierno y la administración autónoma de las provincias corresponden a:",
    opciones: [
      "Las Diputaciones u otras Corporaciones de carácter representativo",
      "Los Delegados del Gobierno",
      "Las Asambleas Legislativas autonómicas",
      "El Tribunal Superior de Justicia correspondiente",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 141 CE dispone que la provincia es una entidad local con personalidad jurídica propia, y que «el gobierno y la administración autónoma de las provincias estarán encomendados a Diputaciones u otras Corporaciones de carácter representativo». En los archipiélagos, las islas cuentan además con administración propia en forma de Cabildos o Consejos.",
    mnemotecnia:
      "Provincia = Diputación; archipiélago = además, Cabildos o Consejos insulares (art. 141).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 143 de la Constitución, pueden acceder a su autogobierno y constituirse en Comunidades Autónomas:",
    opciones: [
      "Las provincias limítrofes con características históricas, culturales y económicas comunes, los territorios insulares y las provincias con entidad regional histórica",
      "Únicamente los territorios insulares",
      "Solo las provincias con más de un millón de habitantes",
      "Cualquier municipio que lo solicite por mayoría de sus vecinos",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 143.1 CE dispone que «las provincias limítrofes con características históricas, culturales y económicas comunes, los territorios insulares y las provincias con entidad regional histórica podrán acceder a su autogobierno y constituirse en Comunidades Autónomas».",
    mnemotecnia:
      "Acceso a la autonomía: provincias limítrofes afines, territorios insulares o provincias con historia regional propia (art. 143).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 148 de la Constitución, transcurridos cinco años desde la aprobación de su Estatuto, las Comunidades Autónomas pueden ampliar sucesivamente sus competencias mediante:",
    opciones: [
      "La reforma de sus Estatutos",
      "Un decreto del Gobierno central",
      "Una sentencia del Tribunal Constitucional",
      "Un convenio con otra Comunidad Autónoma",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 148.2 CE dispone que «transcurridos cinco años, y mediante la reforma de sus Estatutos, las Comunidades Autónomas podrán ampliar sucesivamente sus competencias dentro del marco establecido en el artículo 149». Entre las competencias que pueden asumir desde el inicio figuran, por ejemplo, la ordenación del territorio, el urbanismo y la vivienda, o la sanidad e higiene.",
    mnemotecnia:
      "Cinco años y toca reformar el Estatuto para ampliar competencias (art. 148.2).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 149 de la Constitución, el derecho estatal es, en todo caso:",
    opciones: [
      "Supletorio del derecho de las Comunidades Autónomas",
      "Inaplicable en el territorio de las Comunidades Autónomas",
      "Superior jerárquicamente al derecho autonómico en cualquier materia",
      "Idéntico al derecho de las Comunidades Autónomas",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 149.3 CE cierra la regulación de competencias señalando que «las materias no atribuidas expresamente al Estado por esta Constitución podrán corresponder a las Comunidades Autónomas […] y, en todo caso, el derecho estatal será, en todo caso, supletorio del derecho de las Comunidades Autónomas». Entre las competencias exclusivas del Estado figuran, por ejemplo, la nacionalidad, la defensa y las Fuerzas Armadas o la Administración de Justicia.",
    mnemotecnia:
      "El derecho estatal siempre está de reserva: es SUPLETORIO del autonómico (art. 149.3).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 150 de la Constitución, las Cortes Generales pueden atribuir a las Comunidades Autónomas la facultad de dictar normas legislativas en materias de competencia estatal mediante:",
    opciones: [
      "Una ley marco, dentro de los principios, bases y directrices fijados por el Estado",
      "Un simple acuerdo verbal entre Gobierno y Comunidad Autónoma",
      "Una sentencia del Tribunal Constitucional",
      "Un convenio de colaboración entre Comunidades Autónomas",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 150.1 CE dispone que «las Cortes Generales, en materias de competencia estatal, podrán atribuir a todas o a alguna de las Comunidades Autónomas la facultad de dictar, para sí mismas, normas legislativas en el marco de los principios, bases y directrices fijados por una ley estatal». El propio bloque señala que también cabe transferir o delegar facultades mediante ley orgánica.",
    mnemotecnia:
      "Delegar legislar a las CCAA: se hace con una ley MARCO que fija los límites (art. 150).",
    dificultad: 3,
  },
  {
    enunciado:
      "Según el artículo 152 de la Constitución, la organización institucional autonómica se basa en una Asamblea Legislativa, un Consejo de Gobierno y un Presidente, y culmina con:",
    opciones: [
      "Un Tribunal Superior de Justicia, sin perjuicio de la jurisdicción del Tribunal Supremo",
      "Un Tribunal Constitucional autonómico propio",
      "Una Sala especial del Consejo de Estado",
      "Un Defensor del Pueblo autonómico obligatorio",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 152.1 CE dispone que «un Tribunal Superior de Justicia, sin perjuicio de la jurisdicción que corresponde al Tribunal Supremo, culminará la organización judicial en el ámbito territorial de la Comunidad Autónoma». La Asamblea se elige por sufragio universal con representación proporcional, y el Presidente es elegido por la Asamblea entre sus miembros y nombrado por el Rey.",
    mnemotecnia:
      "La organización autonómica remata siempre en un Tribunal Superior de Justicia (art. 152).",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el artículo 155 de la Constitución, si una Comunidad Autónoma no cumple las obligaciones que la Constitución u otras leyes le impongan, el Gobierno puede adoptar las medidas necesarias para obligar a su cumplimiento forzoso, previo requerimiento al Presidente de la Comunidad y con la aprobación de:",
    opciones: [
      "La mayoría absoluta del Senado",
      "La mayoría simple del Congreso",
      "El Tribunal Constitucional",
      "El Consejo de Estado exclusivamente",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El artículo 155.1 CE exige, para que el Gobierno pueda adoptar esas medidas, «previo requerimiento al Presidente de la Comunidad Autónoma y, en el caso de no ser atendido, con la aprobación por mayoría absoluta del Senado».",
    mnemotecnia:
      "Intervención estatal del art. 155: primero se avisa al Presidente autonómico, y luego decide el SENADO por mayoría absoluta.",
    dificultad: 2,
  },
];
