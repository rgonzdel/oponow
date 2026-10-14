// Fichas de Temis: respuestas preparadas a las preguntas más frecuentes de
// los opositores. Regla de oro (ver memoria del proyecto): cada dato
// normativo sale de una cita literal del texto consolidado del BOE, y
// `pnpm --filter @oponow/web verificar-asistente` comprueba que cada
// `fragmento` existe tal cual en el precepto citado. La `respuesta` y las
// `claves` solo reformulan lo que dicen esas citas.
//
// Este fichero no importa nada en tiempo de ejecución (solo tipos) para que
// el verificador pueda cargarlo con Node directamente.
import type { Ficha } from "../tipos";

export const FICHAS: Ficha[] = [
  // ===================== Constitución =====================
  {
    id: "valores-superiores",
    pregunta: "¿Cuáles son los valores superiores del ordenamiento jurídico?",
    variantes: ["valores superiores", "estado social y democratico de derecho", "articulo 1 constitucion", "soberania nacional", "monarquia parlamentaria"],
    materia: "constitucional",
    respuesta:
      "La Constitución proclama **cuatro valores superiores**: la libertad, la justicia, la igualdad y el pluralismo político. El mismo artículo 1 define a España como Estado social y democrático de Derecho, sitúa la soberanía nacional en el pueblo español y fija como forma política la Monarquía parlamentaria.",
    citas: [
      { norma: "ce", precepto: "a1", fragmento: "propugna como valores superiores de su ordenamiento jurídico la libertad, la justicia, la igualdad y el pluralismo político" },
      { norma: "ce", precepto: "a1", fragmento: "La soberanía nacional reside en el pueblo español, del que emanan los poderes del Estado." },
      { norma: "ce", precepto: "a1", fragmento: "La forma política del Estado español es la Monarquía parlamentaria." },
    ],
    claves: ["Son 4 valores superiores (art. 1.1): libertad, justicia, igualdad y pluralismo político.", "No confundir con los principios del art. 9.3 (legalidad, jerarquía normativa, publicidad…)."],
    trampas: ["«La dignidad de la persona» no es un valor superior del art. 1.1: aparece en el art. 10.1 como fundamento del orden político."],
    relacionadas: ["principios-9-3"],
  },
  {
    id: "principios-9-3",
    pregunta: "¿Qué principios garantiza el artículo 9.3 de la Constitución?",
    variantes: ["principios del articulo 9.3", "principio de legalidad", "jerarquia normativa", "irretroactividad", "seguridad juridica", "interdiccion de la arbitrariedad"],
    materia: "constitucional",
    respuesta:
      "El artículo 9.3 garantiza el principio de legalidad, la jerarquía normativa, la publicidad de las normas, la irretroactividad de las disposiciones sancionadoras no favorables o restrictivas de derechos individuales, la seguridad jurídica, la responsabilidad y la interdicción de la arbitrariedad de los poderes públicos.",
    citas: [
      { norma: "ce", precepto: "a9", fragmento: "La Constitución garantiza el principio de legalidad, la jerarquía normativa, la publicidad de las normas, la irretroactividad de las disposiciones sancionadoras no favorables o restrictivas de derechos individuales, la seguridad jurídica, la responsabilidad y la interdicción de la arbitrariedad de los poderes públicos." },
    ],
    claves: ["Lista de 7 principios: legalidad, jerarquía normativa, publicidad, irretroactividad (de lo sancionador desfavorable), seguridad jurídica, responsabilidad e interdicción de la arbitrariedad."],
    trampas: ["La irretroactividad que garantiza no es de todas las normas: solo de las sancionadoras no favorables o restrictivas de derechos individuales."],
    relacionadas: ["valores-superiores"],
  },
  {
    id: "mayoria-edad",
    pregunta: "¿A qué edad se alcanza la mayoría de edad según la Constitución?",
    variantes: ["mayoria de edad", "mayores de edad", "dieciocho anos", "18 anos"],
    materia: "constitucional",
    respuesta: "Los españoles son mayores de edad a los **dieciocho años** (artículo 12 CE).",
    citas: [{ norma: "ce", precepto: "a12", fragmento: "Los españoles son mayores de edad a los dieciocho años." }],
    claves: ["Art. 12 CE, dentro del Capítulo primero del Título I («De los españoles y los extranjeros»)."],
  },
  {
    id: "detencion-72-horas",
    pregunta: "¿Cuánto puede durar como máximo la detención preventiva?",
    variantes: ["detencion preventiva", "plazo maximo de detencion", "72 horas", "setenta y dos horas", "habeas corpus", "derechos del detenido", "puesto a disposicion judicial"],
    materia: "constitucional",
    respuesta:
      "La detención preventiva no puede durar más del tiempo estrictamente necesario para las averiguaciones y, **en todo caso, como máximo setenta y dos horas**: pasado ese plazo el detenido debe quedar en libertad o a disposición de la autoridad judicial. La Constitución también obliga a informar al detenido de sus derechos y de las razones de la detención, le garantiza abogado y prevé el «habeas corpus». La LECrim repite el mismo límite.",
    citas: [
      { norma: "ce", precepto: "a17", fragmento: "en todo caso, en el plazo máximo de setenta y dos horas, el detenido deberá ser puesto en libertad o a disposición de la autoridad judicial" },
      { norma: "ce", precepto: "a17", fragmento: "La ley regulará un procedimiento de «habeas corpus» para producir la inmediata puesta a disposición judicial de toda persona detenida ilegalmente." },
      { norma: "lecrim", precepto: "a520", fragmento: "en el plazo máximo de setenta y dos horas, el detenido deberá ser puesto en libertad o a disposición de la autoridad judicial" },
    ],
    claves: ["72 horas es un máximo absoluto, no el plazo normal: rige «el tiempo estrictamente necesario».", "Art. 17 CE está en la Sección 1.ª del Capítulo II del Título I: protegido por amparo."],
    relacionadas: ["garantias-derechos"],
  },
  {
    id: "garantias-derechos",
    pregunta: "¿Cómo se protegen los derechos fundamentales? ¿Qué es el recurso de amparo?",
    variantes: ["recurso de amparo", "garantias de los derechos fundamentales", "preferencia y sumariedad", "articulo 53", "tutela de los derechos", "objecion de conciencia amparo"],
    materia: "constitucional",
    respuesta:
      "El artículo 53 CE escalona la protección. Todos los derechos del Capítulo II vinculan a los poderes públicos y solo una ley que respete su contenido esencial puede regular su ejercicio. Los del **artículo 14 y la Sección 1.ª del Capítulo II** tienen además un procedimiento preferente y sumario ante los tribunales ordinarios y, en su caso, el **recurso de amparo** ante el Tribunal Constitucional, que alcanza también a la objeción de conciencia del artículo 30. Los principios rectores (Capítulo III) solo pueden alegarse ante la jurisdicción ordinaria según las leyes que los desarrollen.",
    citas: [
      { norma: "ce", precepto: "a53", fragmento: "Sólo por ley, que en todo caso deberá respetar su contenido esencial, podrá regularse el ejercicio de tales derechos y libertades" },
      { norma: "ce", precepto: "a53", fragmento: "Cualquier ciudadano podrá recabar la tutela de las libertades y derechos reconocidos en el artículo 14 y la Sección primera del Capítulo segundo ante los Tribunales ordinarios por un procedimiento basado en los principios de preferencia y sumariedad y, en su caso, a través del recurso de amparo ante el Tribunal Constitucional." },
      { norma: "ce", precepto: "a53", fragmento: "Este último recurso será aplicable a la objeción de conciencia reconocida en el artículo 30." },
      { norma: "ce", precepto: "a53", fragmento: "Sólo podrán ser alegados ante la Jurisdicción ordinaria de acuerdo con lo que dispongan las leyes que los desarrollen." },
    ],
    claves: ["Amparo: art. 14 + arts. 15 a 29 (Sección 1.ª) + objeción de conciencia del art. 30.", "Principios de preferencia y sumariedad ante los tribunales ordinarios."],
    trampas: ["El amparo no protege los derechos de la Sección 2.ª (arts. 30-38), salvo la objeción de conciencia."],
    relacionadas: ["defensor-pueblo", "tribunal-constitucional"],
  },
  {
    id: "defensor-pueblo",
    pregunta: "¿Cómo se elige al Defensor del Pueblo y cuánto dura su mandato?",
    variantes: ["defensor del pueblo", "alto comisionado de las cortes", "mandato del defensor", "eleccion defensor del pueblo"],
    materia: "constitucional",
    respuesta:
      "La Constitución lo define como **alto comisionado de las Cortes Generales** para defender los derechos del Título I, y le permite supervisar la actividad de la Administración. Su ley orgánica fija un mandato de **cinco años**. Lo elige el Congreso por tres quintos de sus miembros, con ratificación del Senado por la misma mayoría en un máximo de veinte días. Si no se alcanzan esas mayorías, basta con tres quintos en el Congreso y mayoría absoluta en el Senado.",
    citas: [
      { norma: "ce", precepto: "a54", fragmento: "como alto comisionado de las Cortes Generales, designado por éstas para la defensa de los derechos comprendidos en este Título" },
      { norma: "lodp", precepto: "asegundo", fragmento: "El Defensor del Pueblo será elegido por las Cortes Generales para un periodo de cinco años" },
      { norma: "lodp", precepto: "asegundo", fragmento: "Será designado quien obtuviese una votación favorable de las tres quintas partes de los miembros del Congreso y posteriormente, en un plazo máximo de veinte días, fuese ratificado por esta misma mayoría del Senado." },
      { norma: "lodp", precepto: "asegundo", fragmento: "una vez conseguida la mayoría de los tres quintos en el Congreso, la designación quedará realizada al alcanzarse la mayoría absoluta del Senado" },
    ],
    claves: ["Mandato de 5 años (LO 3/1981, art. 2).", "3/5 Congreso + ratificación 3/5 Senado (máx. 20 días); en segundas propuestas, 3/5 Congreso + mayoría absoluta Senado.", "Se relaciona con las Cortes a través de una Comisión Mixta Congreso-Senado."],
    relacionadas: ["garantias-derechos"],
  },
  {
    id: "sucesion-corona",
    pregunta: "¿Cómo es el orden de sucesión a la Corona?",
    variantes: ["sucesion en la corona", "orden de sucesion al trono", "principe de asturias", "primogenitura", "refrendo de los actos del rey"],
    materia: "constitucional",
    respuesta:
      "La sucesión sigue el orden regular de primogenitura y representación: la línea anterior prefiere a las posteriores; en la misma línea, el grado más próximo al más remoto; en el mismo grado, el varón a la mujer; y en el mismo sexo, la persona de más edad. El heredero tiene la dignidad de Príncipe de Asturias. Los actos del Rey los refrendan el Presidente del Gobierno y, en su caso, los Ministros competentes, y son estos quienes responden de ellos.",
    citas: [
      { norma: "ce", precepto: "a57", fragmento: "La sucesión en el trono seguirá el orden regular de primogenitura y representación, siendo preferida siempre la línea anterior a las posteriores; en la misma línea, el grado más próximo al más remoto; en el mismo grado, el varón a la mujer, y en el mismo sexo, la persona de más edad a la de menos." },
      { norma: "ce", precepto: "a57", fragmento: "tendrá la dignidad de Príncipe de Asturias" },
      { norma: "ce", precepto: "a64", fragmento: "Los actos del Rey serán refrendados por el Presidente del Gobierno y, en su caso, por los Ministros competentes." },
      { norma: "ce", precepto: "a64", fragmento: "De los actos del Rey serán responsables las personas que los refrenden." },
    ],
    claves: ["Abdicaciones, renuncias y dudas sobre la sucesión: por ley orgánica (art. 57.5).", "El Presidente del Congreso refrenda la propuesta y nombramiento del Presidente del Gobierno y la disolución del art. 99 (art. 64.1)."],
  },
  {
    id: "cortes-generales",
    pregunta: "¿Cómo están compuestos el Congreso y el Senado?",
    variantes: ["composicion del congreso", "numero de diputados", "composicion del senado", "senadores por provincia", "cortes generales", "300 y 400 diputados", "camara de representacion territorial"],
    materia: "constitucional",
    respuesta:
      "Las Cortes Generales las forman el Congreso de los Diputados y el Senado. El **Congreso** tiene entre **300 y 400 Diputados**, la circunscripción es la provincia y Ceuta y Melilla eligen un Diputado cada una. El **Senado** es la Cámara de representación territorial: **cuatro Senadores por provincia**, con reglas propias para las islas, dos por Ceuta y dos por Melilla, más los que designan las Comunidades Autónomas (uno y otro más por cada millón de habitantes). Ambas Cámaras se eligen por cuatro años.",
    citas: [
      { norma: "ce", precepto: "a66", fragmento: "Las Cortes Generales representan al pueblo español y están formadas por el Congreso de los Diputados y el Senado." },
      { norma: "ce", precepto: "a68", fragmento: "El Congreso se compone de un mínimo de 300 y un máximo de 400 Diputados" },
      { norma: "ce", precepto: "a68", fragmento: "La circunscripción electoral es la provincia. Las poblaciones de Ceuta y Melilla estarán representadas cada una de ellas por un Diputado." },
      { norma: "ce", precepto: "a69", fragmento: "El Senado es la Cámara de representación territorial." },
      { norma: "ce", precepto: "a69", fragmento: "En cada provincia se elegirán cuatro Senadores" },
      { norma: "ce", precepto: "a69", fragmento: "Las poblaciones de Ceuta y Melilla elegirán cada una de ellas dos Senadores." },
      { norma: "ce", precepto: "a69", fragmento: "Las Comunidades Autónomas designarán además un Senador y otro más por cada millón de habitantes de su respectivo territorio." },
      { norma: "ce", precepto: "a69", fragmento: "correspondiendo tres a cada una de las islas mayores −Gran Canaria, Mallorca y Tenerife− y uno a cada una de las siguientes islas: Ibiza, Formentera, Menorca, Fuerteventura, La Gomera, El Hierro, Lanzarote y La Palma." },
    ],
    claves: ["Congreso: 300-400 Diputados; representación proporcional en cada circunscripción.", "Senado: 4 por provincia; 3 por isla mayor (Gran Canaria, Mallorca, Tenerife); 1 por cada isla menor citada; 2 Ceuta y 2 Melilla; + designación autonómica.", "Elecciones entre 30 y 60 días desde el fin del mandato; el Congreso electo se convoca dentro de los 25 días siguientes."],
    trampas: ["Formentera aparece en la redacción vigente del art. 69.3 con un senador propio: no la agrupes con Ibiza."],
  },
  {
    id: "leyes-organicas",
    pregunta: "¿Qué son las leyes orgánicas y qué mayoría exigen?",
    variantes: ["ley organica", "leyes organicas", "mayoria absoluta del congreso", "votacion final sobre el conjunto", "articulo 81"],
    materia: "constitucional",
    respuesta:
      "Son leyes orgánicas las que desarrollan los derechos fundamentales y las libertades públicas, las que aprueban los Estatutos de Autonomía y el régimen electoral general, y las demás previstas en la Constitución. Para aprobarlas, modificarlas o derogarlas hace falta **mayoría absoluta del Congreso en una votación final sobre el conjunto del proyecto**.",
    citas: [
      { norma: "ce", precepto: "a81", fragmento: "Son leyes orgánicas las relativas al desarrollo de los derechos fundamentales y de las libertades públicas, las que aprueben los Estatutos de Autonomía y el régimen electoral general y las demás previstas en la Constitución." },
      { norma: "ce", precepto: "a81", fragmento: "La aprobación, modificación o derogación de las leyes orgánicas exigirá mayoría absoluta del Congreso, en una votación final sobre el conjunto del proyecto." },
    ],
    claves: ["La mayoría absoluta se exige solo en el Congreso y en la votación final sobre el conjunto.", "Las materias de ley orgánica no pueden delegarse en el Gobierno (art. 82.1) ni regularse por decreto-ley cuando afectan a los ámbitos excluidos del art. 86.1."],
    relacionadas: ["decreto-ley", "decreto-legislativo"],
  },
  {
    id: "decreto-ley",
    pregunta: "¿Qué es un decreto-ley y en qué plazo debe convalidarse?",
    variantes: ["decreto ley", "decretos-leyes", "convalidacion", "extraordinaria y urgente necesidad", "articulo 86"],
    materia: "constitucional",
    respuesta:
      "El Gobierno puede dictar decretos-leyes, que son disposiciones legislativas provisionales, **en caso de extraordinaria y urgente necesidad**. No pueden afectar a las instituciones básicas del Estado, a los derechos, deberes y libertades del Título I, al régimen de las Comunidades Autónomas ni al Derecho electoral general. El Congreso debe pronunciarse sobre su **convalidación o derogación en los treinta días siguientes a su promulgación**. En ese mismo plazo las Cortes pueden tramitarlos como proyectos de ley por urgencia.",
    citas: [
      { norma: "ce", precepto: "a86", fragmento: "En caso de extraordinaria y urgente necesidad, el Gobierno podrá dictar disposiciones legislativas provisionales que tomarán la forma de Decretos-leyes" },
      { norma: "ce", precepto: "a86", fragmento: "no podrán afectar al ordenamiento de las instituciones básicas del Estado, a los derechos, deberes y libertades de los ciudadanos regulados en el Título I, al régimen de las Comunidades Autónomas ni al Derecho electoral general" },
      { norma: "ce", precepto: "a86", fragmento: "en el plazo de los treinta días siguientes a su promulgación" },
      { norma: "ce", precepto: "a86", fragmento: "las Cortes podrán tramitarlos como proyectos de ley por el procedimiento de urgencia" },
    ],
    claves: ["Convalida solo el Congreso, no el Senado.", "30 días desde la promulgación."],
    trampas: ["No es delegación legislativa: eso es el decreto legislativo del art. 82."],
    relacionadas: ["decreto-legislativo", "leyes-organicas"],
  },
  {
    id: "decreto-legislativo",
    pregunta: "¿Qué es la delegación legislativa? ¿Textos articulados y refundidos?",
    variantes: ["decreto legislativo", "delegacion legislativa", "ley de bases", "texto articulado", "texto refundido", "articulo 82"],
    materia: "constitucional",
    respuesta:
      "Las Cortes pueden delegar en el Gobierno la potestad de dictar normas con rango de ley sobre materias que no sean de ley orgánica. Para formar **textos articulados**, la delegación se otorga mediante **ley de bases**; para **refundir** varios textos legales en uno, mediante **ley ordinaria**. Debe ser expresa, para materia concreta y con plazo. Se agota cuando el Gobierno la usa y no admite subdelegación en autoridades distintas del Gobierno.",
    citas: [
      { norma: "ce", precepto: "a82", fragmento: "La delegación legislativa deberá otorgarse mediante una ley de bases cuando su objeto sea la formación de textos articulados o por una ley ordinaria cuando se trate de refundir varios textos legales en uno solo." },
      { norma: "ce", precepto: "a82", fragmento: "La delegación legislativa habrá de otorgarse al Gobierno de forma expresa para materia concreta y con fijación del plazo para su ejercicio." },
      { norma: "ce", precepto: "a82", fragmento: "Tampoco podrá permitir la subdelegación a autoridades distintas del propio Gobierno." },
    ],
    claves: ["Ley de bases → texto articulado; ley ordinaria → texto refundido.", "Ejemplos de texto refundido: TREBEP (RDL 5/2015) o Estatuto de los Trabajadores (RDL 2/2015)."],
    relacionadas: ["decreto-ley", "leyes-organicas"],
  },
  {
    id: "mocion-censura-confianza",
    pregunta: "¿Qué diferencia hay entre la moción de censura y la cuestión de confianza?",
    variantes: ["mocion de censura", "cuestion de confianza", "responsabilidad politica del gobierno", "decima parte de los diputados", "mocion de censura constructiva"],
    materia: "constitucional",
    respuesta:
      "La **cuestión de confianza** la plantea el Presidente del Gobierno, previa deliberación del Consejo de Ministros, sobre su programa o una declaración de política general, y se entiende otorgada por **mayoría simple**. La **moción de censura** la presenta al menos **una décima parte de los Diputados**, debe incluir un **candidato a la Presidencia** y necesita **mayoría absoluta**. No puede votarse hasta pasados cinco días, y en los dos primeros caben mociones alternativas.",
    citas: [
      { norma: "ce", precepto: "a112", fragmento: "El Presidente del Gobierno, previa deliberación del Consejo de Ministros, puede plantear ante el Congreso de los Diputados la cuestión de confianza sobre su programa o sobre una declaración de política general." },
      { norma: "ce", precepto: "a112", fragmento: "La confianza se entenderá otorgada cuando vote a favor de la misma la mayoría simple de los Diputados." },
      { norma: "ce", precepto: "a113", fragmento: "El Congreso de los Diputados puede exigir la responsabilidad política del Gobierno mediante la adopción por mayoría absoluta de la moción de censura." },
      { norma: "ce", precepto: "a113", fragmento: "La moción de censura deberá ser propuesta al menos por la décima parte de los Diputados, y habrá de incluir un candidato a la Presidencia del Gobierno." },
      { norma: "ce", precepto: "a113", fragmento: "La moción de censura no podrá ser votada hasta que transcurran cinco días desde su presentación. En los dos primeros días de dicho plazo podrán presentarse mociones alternativas." },
    ],
    claves: ["Confianza: mayoría simple. Censura: mayoría absoluta.", "Censura: 1/10 de Diputados, candidato incluido (moción constructiva), 5 días de espera, alternativas en los 2 primeros.", "Si la censura fracasa, sus firmantes no pueden presentar otra en el mismo periodo de sesiones."],
    trampas: ["Ninguna de las dos se tramita en el Senado."],
  },
  {
    id: "estados-excepcionales",
    pregunta: "¿Cómo se declaran los estados de alarma, excepción y sitio?",
    variantes: ["estado de alarma", "estado de excepcion", "estado de sitio", "articulo 116", "quince dias alarma"],
    materia: "constitucional",
    respuesta:
      "**Alarma**: la declara el Gobierno por decreto en Consejo de Ministros, por un **máximo de quince días** y dando cuenta al Congreso, cuya autorización hace falta para prorrogarlo. **Excepción**: la declara el Gobierno con **autorización previa del Congreso**, por un **máximo de treinta días** prorrogables por otro plazo igual. **Sitio**: lo declara la **mayoría absoluta del Congreso**, a propuesta exclusiva del Gobierno. Mientras dure cualquiera de los tres no se puede disolver el Congreso.",
    citas: [
      { norma: "ce", precepto: "a116", fragmento: "El estado de alarma será declarado por el Gobierno mediante decreto acordado en Consejo de Ministros por un plazo máximo de quince días, dando cuenta al Congreso de los Diputados" },
      { norma: "ce", precepto: "a116", fragmento: "El estado de excepción será declarado por el Gobierno mediante decreto acordado en Consejo de Ministros, previa autorización del Congreso de los Diputados." },
      { norma: "ce", precepto: "a116", fragmento: "que no podrá exceder de treinta días, prorrogables por otro plazo igual, con los mismos requisitos" },
      { norma: "ce", precepto: "a116", fragmento: "El estado de sitio será declarado por la mayoría absoluta del Congreso de los Diputados, a propuesta exclusiva del Gobierno." },
      { norma: "ce", precepto: "a116", fragmento: "No podrá procederse a la disolución del Congreso mientras estén declarados algunos de los estados comprendidos en el presente artículo" },
    ],
    claves: ["Alarma: Gobierno, 15 días, prórroga con autorización del Congreso.", "Excepción: Gobierno con autorización previa del Congreso, 30 + 30 días.", "Sitio: mayoría absoluta del Congreso a propuesta exclusiva del Gobierno."],
  },
  {
    id: "poder-judicial-principios",
    pregunta: "¿Cuáles son los principios del Poder Judicial en la Constitución?",
    variantes: ["poder judicial", "unidad jurisdiccional", "jueces independientes inamovibles", "potestad jurisdiccional", "tribunales de excepcion", "juzgando y haciendo ejecutar lo juzgado", "articulo 117"],
    materia: "justicia",
    respuesta:
      "La justicia emana del pueblo y se administra en nombre del Rey por Jueces y Magistrados **independientes, inamovibles, responsables y sometidos únicamente al imperio de la ley**. La potestad jurisdiccional (juzgar y hacer ejecutar lo juzgado) corresponde **exclusivamente** a los Juzgados y Tribunales que determinen las leyes. El **principio de unidad jurisdiccional** es la base de la organización de los Tribunales y están **prohibidos los Tribunales de excepción**.",
    citas: [
      { norma: "ce", precepto: "a117", fragmento: "La justicia emana del pueblo y se administra en nombre del Rey por Jueces y Magistrados integrantes del poder judicial, independientes, inamovibles, responsables y sometidos únicamente al imperio de la ley." },
      { norma: "ce", precepto: "a117", fragmento: "juzgando y haciendo ejecutar lo juzgado, corresponde exclusivamente a los Juzgados y Tribunales determinados por las leyes" },
      { norma: "ce", precepto: "a117", fragmento: "El principio de unidad jurisdiccional es la base de la organización y funcionamiento de los Tribunales." },
      { norma: "ce", precepto: "a117", fragmento: "Se prohíben los Tribunales de excepción." },
    ],
    claves: ["Cuatro notas de los jueces: independientes, inamovibles, responsables y sometidos solo a la ley.", "La jurisdicción militar se limita al ámbito estrictamente castrense y al estado de sitio (art. 117.5)."],
    relacionadas: ["cgpj", "ministerio-fiscal", "organos-jurisdiccionales", "gratuidad-publicidad"],
  },
  {
    id: "gratuidad-publicidad",
    pregunta: "¿Es gratuita la justicia? ¿Las actuaciones judiciales son públicas?",
    variantes: ["justicia gratuita", "insuficiencia de recursos para litigar", "publicidad de las actuaciones judiciales", "sentencias motivadas", "procedimiento oral", "accion popular", "jurado"],
    materia: "justicia",
    respuesta:
      "La justicia es gratuita cuando lo disponga la ley y, **en todo caso**, para quien acredite **insuficiencia de recursos para litigar** (art. 119 CE). Las actuaciones judiciales son **públicas**, salvo las excepciones de las leyes procesales. El procedimiento es **predominantemente oral, sobre todo en materia criminal**, y las sentencias se motivan siempre y se pronuncian en audiencia pública (art. 120). Los ciudadanos pueden ejercer la **acción popular** y participar mediante el **Jurado** (art. 125).",
    citas: [
      { norma: "ce", precepto: "a119", fragmento: "La justicia será gratuita cuando así lo disponga la ley y, en todo caso, respecto de quienes acrediten insuficiencia de recursos para litigar." },
      { norma: "ce", precepto: "a120", fragmento: "Las actuaciones judiciales serán públicas, con las excepciones que prevean las leyes de procedimiento." },
      { norma: "ce", precepto: "a120", fragmento: "El procedimiento será predominantemente oral, sobre todo en materia criminal." },
      { norma: "ce", precepto: "a120", fragmento: "Las sentencias serán siempre motivadas y se pronunciarán en audiencia pública." },
      { norma: "ce", precepto: "a125", fragmento: "Los ciudadanos podrán ejercer la acción popular y participar en la Administración de Justicia mediante la institución del Jurado" },
    ],
    claves: ["Art. 119 gratuidad · art. 120 publicidad, oralidad y motivación · art. 125 acción popular y Jurado."],
    relacionadas: ["poder-judicial-principios"],
  },
  {
    id: "cgpj",
    pregunta: "¿Cómo está compuesto el Consejo General del Poder Judicial?",
    variantes: ["consejo general del poder judicial", "cgpj", "organo de gobierno del poder judicial", "veinte vocales", "vocales del cgpj"],
    materia: "justicia",
    respuesta:
      "El CGPJ es el **órgano de gobierno del Poder Judicial**. Lo preside el **Presidente del Tribunal Supremo** y tiene **veinte miembros** nombrados por el Rey **por cinco años**: doce entre Jueces y Magistrados de todas las categorías, cuatro a propuesta del Congreso y cuatro a propuesta del Senado. Estos ocho últimos se eligen por **tres quintos** entre abogados y otros juristas de reconocida competencia con **más de quince años** de ejercicio.",
    citas: [
      { norma: "ce", precepto: "a122", fragmento: "El Consejo General del Poder Judicial es el órgano de gobierno del mismo." },
      { norma: "ce", precepto: "a122", fragmento: "estará integrado por el Presidente del Tribunal Supremo, que lo presidirá, y por veinte miembros nombrados por el Rey por un período de cinco años" },
      { norma: "ce", precepto: "a122", fragmento: "doce entre Jueces y Magistrados de todas las categorías judiciales, en los términos que establezca la ley orgánica; cuatro a propuesta del Congreso de los Diputados, y cuatro a propuesta del Senado" },
      { norma: "ce", precepto: "a122", fragmento: "elegidos en ambos casos por mayoría de tres quintos de sus miembros, entre abogados y otros juristas, todos ellos de reconocida competencia y con más de quince años de ejercicio en su profesión" },
    ],
    claves: ["20 vocales + Presidente (el del TS) · 5 años · 12 judiciales + 4 Congreso + 4 Senado.", "El Presidente del TS lo nombra el Rey a propuesta del CGPJ (art. 123.2)."],
    trampas: ["No confundir con el Tribunal Constitucional: 12 miembros por 9 años."],
    relacionadas: ["tribunal-constitucional", "poder-judicial-principios"],
  },
  {
    id: "tribunal-supremo",
    pregunta: "¿Qué es el Tribunal Supremo y quién nombra a su Presidente?",
    variantes: ["tribunal supremo", "organo jurisdiccional superior", "presidente del tribunal supremo"],
    materia: "justicia",
    respuesta:
      "El Tribunal Supremo, con jurisdicción en toda España, es el **órgano jurisdiccional superior en todos los órdenes**, salvo en materia de garantías constitucionales, que corresponde al Tribunal Constitucional. A su Presidente lo nombra el Rey **a propuesta del Consejo General del Poder Judicial**.",
    citas: [
      { norma: "ce", precepto: "a123", fragmento: "El Tribunal Supremo, con jurisdicción en toda España, es el órgano jurisdiccional superior en todos los órdenes, salvo lo dispuesto en materia de garantías constitucionales." },
      { norma: "ce", precepto: "a123", fragmento: "El Presidente del Tribunal Supremo será nombrado por el Rey, a propuesta del Consejo General del Poder Judicial, en la forma que determine la ley." },
    ],
    relacionadas: ["cgpj", "organos-jurisdiccionales"],
  },
  {
    id: "ministerio-fiscal",
    pregunta: "¿Qué funciones y principios tiene el Ministerio Fiscal?",
    variantes: ["ministerio fiscal", "fiscal general del estado", "unidad de actuacion y dependencia jerarquica", "principios del ministerio fiscal", "fiscalia"],
    materia: "justicia",
    respuesta:
      "El Ministerio Fiscal promueve la acción de la justicia en defensa de la legalidad, de los derechos de los ciudadanos y del interés público tutelado por la ley. Actúa conforme a los principios de **unidad de actuación y dependencia jerárquica**, y siempre con sujeción a los de **legalidad e imparcialidad**. El **Fiscal General del Estado** lo nombra el Rey **a propuesta del Gobierno, oído el CGPJ**. Su Estatuto Orgánico lo define como órgano de relevancia constitucional con personalidad jurídica propia, integrado con autonomía funcional en el Poder Judicial.",
    citas: [
      { norma: "ce", precepto: "a124", fragmento: "tiene por misión promover la acción de la justicia en defensa de la legalidad, de los derechos de los ciudadanos y del interés público tutelado por la ley" },
      { norma: "ce", precepto: "a124", fragmento: "conforme a los principios de unidad de actuación y dependencia jerárquica y con sujeción, en todo caso, a los de legalidad e imparcialidad" },
      { norma: "ce", precepto: "a124", fragmento: "El Fiscal General del Estado será nombrado por el Rey, a propuesta del Gobierno, oído el Consejo General del Poder Judicial." },
      { norma: "eomf", precepto: "asegundo", fragmento: "El Ministerio Fiscal es un órgano de relevancia constitucional con personalidad jurídica propia, integrado con autonomía funcional en el Poder Judicial" },
    ],
    claves: ["2 principios orgánicos (unidad de actuación, dependencia jerárquica) + 2 funcionales (legalidad, imparcialidad).", "FGE: propone el Gobierno, se oye (no vincula) al CGPJ."],
    relacionadas: ["poder-judicial-principios"],
  },
  {
    id: "tribunal-constitucional",
    pregunta: "¿Cómo se compone el Tribunal Constitucional?",
    variantes: ["tribunal constitucional", "composicion del tribunal constitucional", "magistrados del constitucional", "doce miembros nueve anos", "renovacion por terceras partes"],
    materia: "constitucional",
    respuesta:
      "El Tribunal Constitucional tiene **12 miembros** nombrados por el Rey: **cuatro a propuesta del Congreso** y **cuatro del Senado**, en ambos casos por **tres quintos**, **dos del Gobierno** y **dos del CGPJ**. Se eligen entre juristas de reconocida competencia con **más de quince años** de ejercicio. El mandato es de **nueve años** y se renuevan **por terceras partes cada tres**.",
    citas: [
      { norma: "ce", precepto: "a159", fragmento: "El Tribunal Constitucional se compone de 12 miembros nombrados por el Rey; de ellos, cuatro a propuesta del Congreso por mayoría de tres quintos de sus miembros; cuatro a propuesta del Senado, con idéntica mayoría; dos a propuesta del Gobierno, y dos a propuesta del Consejo General del Poder Judicial." },
      { norma: "ce", precepto: "a159", fragmento: "todos ellos juristas de reconocida competencia con más de quince años de ejercicio profesional" },
      { norma: "ce", precepto: "a159", fragmento: "Los miembros del Tribunal Constitucional serán designados por un período de nueve años y se renovarán por terceras partes cada tres." },
    ],
    claves: ["Regla 4-4-2-2 (Congreso, Senado, Gobierno, CGPJ).", "9 años de mandato, renovación por tercios cada 3."],
    trampas: ["El CGPJ: 20 vocales por 5 años. El TC: 12 miembros por 9 años."],
    relacionadas: ["cgpj", "garantias-derechos"],
  },
  {
    id: "reforma-constitucional",
    pregunta: "¿Cómo se reforma la Constitución?",
    variantes: ["reforma constitucional", "reforma de la constitucion", "procedimiento agravado", "articulo 167", "articulo 168", "revision total de la constitucion"],
    materia: "constitucional",
    respuesta:
      "Hay dos procedimientos. **Ordinario (art. 167)**: tres quintos de cada Cámara; sin acuerdo, se crea una comisión paritaria, y si aun así no se aprueba, basta la mayoría absoluta del Senado más dos tercios del Congreso. Hay referéndum si lo pide una décima parte de los miembros de cualquier Cámara en quince días. **Agravado (art. 168)**: para la revisión total o la reforma del Título preliminar, la Sección 1.ª del Capítulo II del Título I o el Título II. Exige aprobar el principio por dos tercios de cada Cámara, disolver las Cortes, que las nuevas Cámaras lo ratifiquen y aprueben el texto por dos tercios, y **referéndum obligatorio**.",
    citas: [
      { norma: "ce", precepto: "a167", fragmento: "Los proyectos de reforma constitucional deberán ser aprobados por una mayoría de tres quintos de cada una de las Cámaras." },
      { norma: "ce", precepto: "a167", fragmento: "siempre que el texto hubiere obtenido el voto favorable de la mayoría absoluta del Senado, el Congreso, por mayoría de dos tercios, podrá aprobar la reforma" },
      { norma: "ce", precepto: "a167", fragmento: "será sometida a referéndum para su ratificación cuando así lo soliciten, dentro de los quince días siguientes a su aprobación, una décima parte de los miembros de cualquiera de las Cámaras" },
      { norma: "ce", precepto: "a168", fragmento: "Cuando se propusiere la revisión total de la Constitución o una parcial que afecte al Título preliminar, al Capítulo segundo, Sección primera del Título I, o al Título II" },
      { norma: "ce", precepto: "a168", fragmento: "se procederá a la aprobación del principio por mayoría de dos tercios de cada Cámara, y a la disolución inmediata de las Cortes" },
      { norma: "ce", precepto: "a168", fragmento: "Aprobada la reforma por las Cortes Generales, será sometida a referéndum para su ratificación." },
    ],
    claves: ["167: 3/5 ambas Cámaras (o abs. Senado + 2/3 Congreso); referéndum facultativo (1/10, 15 días).", "168: 2/3 + disolución + 2/3 de las nuevas Cámaras + referéndum obligatorio.", "Materias del 168: Título preliminar, Sección 1.ª Cap. II Tít. I (arts. 15-29) y Título II (Corona)."],
  },

  // ===================== Procedimiento administrativo (Ley 39/2015) =====================
  {
    id: "interesado",
    pregunta: "¿Quién tiene la condición de interesado en el procedimiento administrativo?",
    variantes: ["concepto de interesado", "interesados en el procedimiento", "articulo 4 ley 39/2015"],
    materia: "administrativo",
    respuesta:
      "Son interesados, según el artículo 4 de la Ley 39/2015: (a) quienes promueven el procedimiento como titulares de derechos o intereses legítimos, individuales o colectivos; (b) quienes, sin haberlo iniciado, tienen derechos que pueden resultar afectados por la decisión; y (c) quienes tienen intereses legítimos que pueden resultar afectados y **se personan** antes de que haya resolución definitiva.",
    citas: [
      { norma: "lpac", precepto: "a4", fragmento: "Quienes lo promuevan como titulares de derechos o intereses legítimos individuales o colectivos." },
      { norma: "lpac", precepto: "a4", fragmento: "Los que, sin haber iniciado el procedimiento, tengan derechos que puedan resultar afectados por la decisión que en el mismo se adopte." },
      { norma: "lpac", precepto: "a4", fragmento: "Aquellos cuyos intereses legítimos, individuales o colectivos, puedan resultar afectados por la resolución y se personen en el procedimiento en tanto no haya recaído resolución definitiva." },
    ],
    trampas: ["En el supuesto (b) basta con tener derechos afectados; en el (c), con intereses legítimos hay que personarse."],
  },
  {
    id: "obligados-electronicos",
    pregunta: "¿Quién está obligado a relacionarse electrónicamente con la Administración?",
    variantes: ["obligados a relacionarse electronicamente", "medios electronicos obligatorios", "personas juridicas electronicamente", "articulo 14 ley 39/2015"],
    materia: "administrativo",
    respuesta:
      "Las personas físicas **pueden elegir** el canal, salvo que estén obligadas. Están obligados, al menos: las **personas jurídicas**; las **entidades sin personalidad jurídica**; quienes ejerzan una **actividad profesional con colegiación obligatoria**, en los trámites de esa actividad (incluidos notarios y registradores); quienes **representen** a un obligado; y los **empleados públicos** en los trámites por razón de su condición. Por reglamento puede extenderse a otros colectivos que tengan acceso a medios electrónicos.",
    citas: [
      { norma: "lpac", precepto: "a14", fragmento: "Las personas físicas podrán elegir en todo momento si se comunican con las Administraciones Públicas" },
      { norma: "lpac", precepto: "a14", fragmento: "Las personas jurídicas." },
      { norma: "lpac", precepto: "a14", fragmento: "Las entidades sin personalidad jurídica." },
      { norma: "lpac", precepto: "a14", fragmento: "Quienes ejerzan una actividad profesional para la que se requiera colegiación obligatoria" },
      { norma: "lpac", precepto: "a14", fragmento: "Quienes representen a un interesado que esté obligado a relacionarse electrónicamente con la Administración." },
      { norma: "lpac", precepto: "a14", fragmento: "Los empleados de las Administraciones Públicas para los trámites y actuaciones que realicen con ellas por razón de su condición de empleado público" },
    ],
    claves: ["Cinco colectivos obligados en el art. 14.2 (letras a-e).", "Notarios y registradores se incluyen expresamente en la letra c)."],
  },
  {
    id: "plazo-resolver",
    pregunta: "¿Cuál es el plazo máximo para resolver un procedimiento administrativo?",
    variantes: ["plazo maximo para resolver", "obligacion de resolver", "tres meses", "seis meses", "articulo 21 ley 39/2015"],
    materia: "administrativo",
    respuesta:
      "La Administración está **obligada a dictar resolución expresa** y a notificarla en todos los procedimientos. El plazo máximo es el que fije la norma de cada procedimiento, y **no puede pasar de seis meses** salvo que lo amplíe una ley o el Derecho de la Unión Europea. **Si la norma no fija plazo, es de tres meses**. Se cuenta desde el acuerdo de iniciación (de oficio) o desde la entrada de la solicitud en el registro electrónico del órgano competente (a solicitud del interesado).",
    citas: [
      { norma: "lpac", precepto: "a21", fragmento: "La Administración está obligada a dictar resolución expresa y a notificarla en todos los procedimientos cualquiera que sea su forma de iniciación." },
      { norma: "lpac", precepto: "a21", fragmento: "Este plazo no podrá exceder de seis meses salvo que una norma con rango de Ley establezca uno mayor o así venga previsto en el Derecho de la Unión Europea." },
      { norma: "lpac", precepto: "a21", fragmento: "Cuando las normas reguladoras de los procedimientos no fijen el plazo máximo, éste será de tres meses." },
      { norma: "lpac", precepto: "a21", fragmento: "En los procedimientos iniciados de oficio, desde la fecha del acuerdo de iniciación." },
      { norma: "lpac", precepto: "a21", fragmento: "dentro de los diez días siguientes a la recepción de la solicitud iniciadora del procedimiento" },
    ],
    claves: ["Máximo general: 6 meses (salvo ley o Derecho UE).", "Supletorio: 3 meses.", "La Administración comunica estos datos al interesado en los 10 días siguientes a recibir la solicitud (art. 21.4)."],
    relacionadas: ["silencio-administrativo", "computo-plazos"],
  },
  {
    id: "silencio-administrativo",
    pregunta: "¿Cuándo el silencio administrativo es positivo y cuándo negativo?",
    variantes: ["silencio administrativo", "silencio positivo", "silencio negativo", "silencio estimatorio", "silencio desestimatorio", "caducidad de oficio", "articulo 24 ley 39/2015", "falta de resolucion expresa"],
    materia: "administrativo",
    respuesta:
      "**A solicitud del interesado** (art. 24), la regla general es el silencio **estimatorio**, salvo que una ley o el Derecho de la UE o internacional digan lo contrario. Es **desestimatorio** en el derecho de petición, en la transferencia de facultades sobre el dominio o servicio público, en actividades que puedan dañar el medio ambiente, en la responsabilidad patrimonial, y en la impugnación de actos y la revisión de oficio a instancia de parte. Excepción: el recurso de alzada contra una desestimación por silencio se entiende estimado si no se resuelve a tiempo. **De oficio** (art. 25): si el procedimiento podía reconocer derechos, el silencio es desestimatorio; si era sancionador o de gravamen, **caduca**.",
    citas: [
      { norma: "lpac", precepto: "a24", fragmento: "legitima al interesado o interesados para entenderla estimada por silencio administrativo, excepto en los supuestos en los que una norma con rango de ley o una norma de Derecho de la Unión Europea o de Derecho internacional aplicable en España establezcan lo contrario" },
      { norma: "lpac", precepto: "a24", fragmento: "El silencio tendrá efecto desestimatorio en los procedimientos relativos al ejercicio del derecho de petición" },
      { norma: "lpac", precepto: "a24", fragmento: "y en los procedimientos de responsabilidad patrimonial de las Administraciones Públicas" },
      { norma: "lpac", precepto: "a24", fragmento: "El sentido del silencio también será desestimatorio en los procedimientos de impugnación de actos y disposiciones y en los de revisión de oficio iniciados a solicitud de los interesados." },
      { norma: "lpac", precepto: "a24", fragmento: "La estimación por silencio administrativo tiene a todos los efectos la consideración de acto administrativo finalizador del procedimiento." },
      { norma: "lpac", precepto: "a24", fragmento: "Este certificado se expedirá de oficio por el órgano competente para resolver en el plazo de quince días desde que expire el plazo máximo para resolver el procedimiento." },
      { norma: "lpac", precepto: "a24", fragmento: "cuando el recurso de alzada se haya interpuesto contra la desestimación por silencio administrativo de una solicitud por el transcurso del plazo, se entenderá estimado el mismo" },
      { norma: "lpac", precepto: "a25", fragmento: "los interesados que hubieren comparecido podrán entender desestimadas sus pretensiones por silencio administrativo" },
      { norma: "lpac", precepto: "a25", fragmento: "En los procedimientos en que la Administración ejercite potestades sancionadoras o, en general, de intervención, susceptibles de producir efectos desfavorables o de gravamen, se producirá la caducidad." },
    ],
    claves: ["Regla general a instancia de parte: silencio positivo.", "Desestimación por silencio = solo abre la vía de recurso; estimación = acto finalizador.", "El certificado de silencio se expide de oficio en 15 días desde que vence el plazo para resolver (art. 24.4)."],
    trampas: ["Recurso de alzada contra una desestimación presunta: si tampoco se resuelve, el silencio es positivo (doble silencio), salvo en las materias del párrafo anterior."],
    relacionadas: ["plazo-resolver", "recurso-alzada"],
  },
  {
    id: "computo-plazos",
    pregunta: "¿Cómo se computan los plazos administrativos? ¿Son hábiles los sábados?",
    variantes: ["computo de plazos", "dias habiles", "sabados inhabiles", "plazos por meses", "ultimo dia inhabil", "articulo 30 ley 39/2015", "plazos por horas"],
    materia: "administrativo",
    respuesta:
      "Salvo que una ley o el Derecho de la UE digan otra cosa, los plazos **en días son hábiles**: se excluyen **sábados, domingos y festivos**. Se cuentan desde el día siguiente a la notificación o publicación, o al silencio. Los plazos **en meses o años** concluyen el mismo día del mes o año de vencimiento; si no existe ese día, el último del mes. Si el último día es inhábil, se prorroga al primer hábil siguiente. Las horas son hábiles, se cuentan de hora en hora y no pueden superar veinticuatro horas.",
    citas: [
      { norma: "lpac", precepto: "a30", fragmento: "cuando los plazos se señalen por días, se entiende que éstos son hábiles, excluyéndose del cómputo los sábados, los domingos y los declarados festivos" },
      { norma: "lpac", precepto: "a30", fragmento: "El plazo concluirá el mismo día en que se produjo la notificación, publicación o silencio administrativo en el mes o el año de vencimiento." },
      { norma: "lpac", precepto: "a30", fragmento: "Si en el mes de vencimiento no hubiera día equivalente a aquel en que comienza el cómputo, se entenderá que el plazo expira el último día del mes." },
      { norma: "lpac", precepto: "a30", fragmento: "Cuando el último día del plazo sea inhábil, se entenderá prorrogado al primer día hábil siguiente." },
      { norma: "lpac", precepto: "a30", fragmento: "no podrán tener una duración superior a veinticuatro horas, en cuyo caso se expresarán en días" },
      { norma: "lpac", precepto: "a30", fragmento: "Cuando un día fuese hábil en el municipio o Comunidad Autónoma en que residiese el interesado, e inhábil en la sede del órgano administrativo, o a la inversa, se considerará inhábil en todo caso." },
    ],
    claves: ["Sábado inhábil en vía administrativa (Ley 39/2015).", "Día hábil en el domicilio e inhábil en la sede del órgano (o al revés): inhábil en todo caso (art. 30.6)."],
    trampas: ["En vía judicial rigen otras reglas: agosto y del 24 de diciembre al 6 de enero son inhábiles (art. 183 LOPJ)."],
    relacionadas: ["dias-habiles-judiciales", "plazo-resolver"],
  },
  {
    id: "notificaciones",
    pregunta: "¿En qué plazo se notifica un acto? ¿Cuándo se entiende rechazada una notificación electrónica?",
    variantes: ["notificacion", "notificaciones electronicas", "diez dias naturales", "plazo para notificar", "rechazo de la notificacion", "articulo 40 ley 39/2015", "articulo 43 ley 39/2015"],
    materia: "administrativo",
    respuesta:
      "La notificación debe cursarse **dentro de los diez días** siguientes a dictarse el acto. Debe incluir el texto íntegro, si pone fin a la vía administrativa, los recursos procedentes, el órgano y el plazo. La notificación electrónica se entiende practicada **cuando se accede a su contenido**. Si es obligatoria o la eligió el interesado, se entiende **rechazada a los diez días naturales** de su puesta a disposición sin acceso.",
    citas: [
      { norma: "lpac", precepto: "a40", fragmento: "Toda notificación deberá ser cursada dentro del plazo de diez días a partir de la fecha en que el acto haya sido dictado" },
      { norma: "lpac", precepto: "a43", fragmento: "Las notificaciones por medios electrónicos se entenderán practicadas en el momento en que se produzca el acceso a su contenido." },
      { norma: "lpac", precepto: "a43", fragmento: "se entenderá rechazada cuando hayan transcurrido diez días naturales desde la puesta a disposición de la notificación sin que se acceda a su contenido" },
    ],
    claves: ["10 días (hábiles) para cursar la notificación · 10 días naturales para el rechazo electrónico."],
    trampas: ["El plazo de rechazo es en días naturales, una excepción al cómputo en hábiles."],
  },
  {
    id: "nulidad-anulabilidad",
    pregunta: "¿Qué diferencia hay entre nulidad de pleno derecho y anulabilidad?",
    variantes: ["nulidad de pleno derecho", "anulabilidad", "actos nulos", "actos anulables", "desviacion de poder", "articulo 47 ley 39/2015", "articulo 48 ley 39/2015"],
    materia: "administrativo",
    respuesta:
      "**Nulidad de pleno derecho (art. 47)**: lista cerrada de vicios graves. Entre ellos, lesionar derechos susceptibles de amparo, la incompetencia manifiesta por materia o territorio, el contenido imposible, constituir infracción penal y prescindir total y absolutamente del procedimiento. **Anulabilidad (art. 48)**: cualquier otra infracción del ordenamiento, **incluida la desviación de poder**. El defecto de forma solo anula si deja al acto sin requisitos formales indispensables o causa indefensión, y la actuación fuera de plazo solo si lo impone la naturaleza del plazo.",
    citas: [
      { norma: "lpac", precepto: "a47", fragmento: "Los que lesionen los derechos y libertades susceptibles de amparo constitucional." },
      { norma: "lpac", precepto: "a47", fragmento: "Los dictados por órgano manifiestamente incompetente por razón de la materia o del territorio." },
      { norma: "lpac", precepto: "a47", fragmento: "Los que tengan un contenido imposible." },
      { norma: "lpac", precepto: "a47", fragmento: "Los dictados prescindiendo total y absolutamente del procedimiento legalmente establecido" },
      { norma: "lpac", precepto: "a48", fragmento: "Son anulables los actos de la Administración que incurran en cualquier infracción del ordenamiento jurídico, incluso la desviación de poder." },
      { norma: "lpac", precepto: "a48", fragmento: "el defecto de forma sólo determinará la anulabilidad cuando el acto carezca de los requisitos formales indispensables para alcanzar su fin o dé lugar a la indefensión de los interesados" },
    ],
    claves: ["Nulos: revisión de oficio en cualquier momento (art. 106).", "Anulables favorables: declaración de lesividad en 4 años y recurso contencioso (art. 107)."],
    trampas: ["La incompetencia jerárquica no es causa de nulidad: el art. 47.1.b) solo cita materia y territorio.", "La desviación de poder es causa de anulabilidad, no de nulidad."],
    relacionadas: ["revision-oficio"],
  },
  {
    id: "revision-oficio",
    pregunta: "¿Qué es la revisión de oficio y la declaración de lesividad?",
    variantes: ["revision de oficio", "declaracion de lesividad", "lesividad cuatro anos", "dictamen del consejo de estado", "articulo 106", "articulo 107"],
    materia: "administrativo",
    respuesta:
      "**Revisión de oficio (art. 106)**: la Administración puede declarar en cualquier momento la nulidad de los actos nulos del art. 47.1 que hayan puesto fin a la vía administrativa o no se recurrieron en plazo, **previo dictamen favorable del Consejo de Estado** u órgano consultivo autonómico. Si se inició de oficio, caduca a los **seis meses** sin resolución. **Lesividad (art. 107)**: para los actos **favorables anulables**, la Administración los declara lesivos y luego los impugna ante el contencioso-administrativo. No puede hacerlo pasados **cuatro años** desde que se dictó el acto, y el procedimiento caduca a los seis meses.",
    citas: [
      { norma: "lpac", precepto: "a106", fragmento: "previo dictamen favorable del Consejo de Estado u órgano consultivo equivalente de la Comunidad Autónoma, si lo hubiere, declararán de oficio la nulidad de los actos administrativos que hayan puesto fin a la vía administrativa o que no hayan sido recurridos en plazo" },
      { norma: "lpac", precepto: "a106", fragmento: "el transcurso del plazo de seis meses desde su inicio sin dictarse resolución producirá la caducidad del mismo" },
      { norma: "lpac", precepto: "a107", fragmento: "los actos favorables para los interesados que sean anulables conforme a lo dispuesto en el artículo 48, previa su declaración de lesividad para el interés público" },
      { norma: "lpac", precepto: "a107", fragmento: "La declaración de lesividad no podrá adoptarse una vez transcurridos cuatro años desde que se dictó el acto administrativo" },
    ],
    claves: ["Nulos → revisión de oficio (sin plazo; dictamen favorable).", "Anulables favorables → lesividad (4 años) + recurso contencioso (2 meses, art. 46.5 LJCA)."],
    relacionadas: ["nulidad-anulabilidad"],
  },
  {
    id: "recurso-alzada",
    pregunta: "¿Cuál es el plazo del recurso de alzada?",
    variantes: ["recurso de alzada", "plazo recurso de alzada", "alzada un mes", "organo superior jerarquico", "articulo 121", "articulo 122"],
    materia: "administrativo",
    respuesta:
      "Procede contra resoluciones y actos de trámite cualificados **que no pongan fin a la vía administrativa**, ante el **superior jerárquico** del órgano que los dictó. Puede presentarse ante el órgano que dictó el acto o ante el competente para resolver. El plazo es de **un mes** si el acto es expreso; si no lo es, puede interponerse en cualquier momento desde que se producen los efectos del silencio. Hay que resolverlo en **tres meses**, y pasado ese plazo se entiende **desestimado**, salvo el caso de doble silencio del art. 24.1.",
    citas: [
      { norma: "lpac", precepto: "a121", fragmento: "cuando no pongan fin a la vía administrativa, podrán ser recurridos en alzada ante el órgano superior jerárquico del que los dictó" },
      { norma: "lpac", precepto: "a121", fragmento: "los Tribunales y órganos de selección del personal al servicio de las Administraciones Públicas y cualesquiera otros que, en el seno de éstas, actúen con autonomía funcional, se considerarán dependientes del órgano al que estén adscritos" },
      { norma: "lpac", precepto: "a122", fragmento: "El plazo para la interposición del recurso de alzada será de un mes, si el acto fuera expreso." },
      { norma: "lpac", precepto: "a122", fragmento: "El plazo máximo para dictar y notificar la resolución será de tres meses." },
      { norma: "lpac", precepto: "a122", fragmento: "Contra la resolución de un recurso de alzada no cabrá ningún otro recurso administrativo, salvo el recurso extraordinario de revisión" },
    ],
    claves: ["Alzada: 1 mes para recurrir / 3 meses para resolver.", "Los tribunales de oposiciones dependen del órgano al que estén adscritos (art. 121.1): sus actos se recurren en alzada."],
    trampas: ["La alzada es obligatoria para agotar la vía; la reposición es potestativa."],
    relacionadas: ["recurso-reposicion", "recurso-revision", "silencio-administrativo"],
  },
  {
    id: "recurso-reposicion",
    pregunta: "¿Cuál es el plazo del recurso potestativo de reposición?",
    variantes: ["recurso de reposicion", "recurso potestativo de reposicion", "reposicion un mes", "articulo 123", "articulo 124"],
    materia: "administrativo",
    respuesta:
      "Procede contra actos **que ponen fin a la vía administrativa**, ante el **mismo órgano** que los dictó, y es **potestativo**: también se puede ir directamente al contencioso-administrativo. El plazo es de **un mes** si el acto es expreso, y se resuelve en **un mes**. Si se interpone, no cabe recurso contencioso hasta que se resuelva o se entienda desestimado, y contra su resolución no cabe otra reposición.",
    citas: [
      { norma: "lpac", precepto: "a123", fragmento: "Los actos administrativos que pongan fin a la vía administrativa podrán ser recurridos potestativamente en reposición ante el mismo órgano que los hubiera dictado o ser impugnados directamente ante el orden jurisdiccional contencioso-administrativo." },
      { norma: "lpac", precepto: "a123", fragmento: "No se podrá interponer recurso contencioso-administrativo hasta que sea resuelto expresamente o se haya producido la desestimación presunta del recurso de reposición interpuesto." },
      { norma: "lpac", precepto: "a124", fragmento: "El plazo para la interposición del recurso de reposición será de un mes, si el acto fuera expreso." },
      { norma: "lpac", precepto: "a124", fragmento: "El plazo máximo para dictar y notificar la resolución del recurso será de un mes." },
    ],
    claves: ["Reposición: 1 mes / 1 mes. Alzada: 1 mes / 3 meses."],
    relacionadas: ["recurso-alzada", "recurso-contencioso"],
  },
  {
    id: "recurso-revision",
    pregunta: "¿Cuándo cabe el recurso extraordinario de revisión y en qué plazo?",
    variantes: ["recurso extraordinario de revision", "error de hecho", "actos firmes", "articulo 125"],
    materia: "administrativo",
    respuesta:
      "Cabe contra **actos firmes en vía administrativa**, ante el órgano que los dictó, por cuatro causas tasadas: error de hecho que resulte del expediente, aparición de documentos esenciales, documentos o testimonios declarados falsos por sentencia firme, o resolución dictada por prevaricación, cohecho u otra conducta punible declarada por sentencia firme. Para el **error de hecho** el plazo es de **cuatro años** desde la notificación; **en los demás casos, tres meses** desde que se conocen los documentos o desde que la sentencia es firme.",
    citas: [
      { norma: "lpac", precepto: "a125", fragmento: "Contra los actos firmes en vía administrativa podrá interponerse el recurso extraordinario de revisión ante el órgano administrativo que los dictó" },
      { norma: "lpac", precepto: "a125", fragmento: "Que al dictarlos se hubiera incurrido en error de hecho, que resulte de los propios documentos incorporados al expediente." },
      { norma: "lpac", precepto: "a125", fragmento: "dentro del plazo de cuatro años siguientes a la fecha de la notificación de la resolución impugnada. En los demás casos, el plazo será de tres meses" },
    ],
    claves: ["Causa a) error de hecho: 4 años. Causas b), c) y d): 3 meses."],
    relacionadas: ["recurso-alzada", "recurso-reposicion"],
  },
  {
    id: "responsabilidad-patrimonial",
    pregunta: "¿Cuándo responde la Administración por los daños que causa? ¿Plazo para reclamar?",
    variantes: ["responsabilidad patrimonial", "indemnizacion de la administracion", "funcionamiento normal o anormal", "plazo para reclamar responsabilidad", "articulo 32 ley 40/2015", "articulo 67 ley 39/2015"],
    materia: "administrativo",
    respuesta:
      "Los particulares tienen derecho a ser indemnizados por toda lesión en sus bienes y derechos consecuencia del **funcionamiento normal o anormal** de los servicios públicos, salvo **fuerza mayor** o daños que tengan el deber jurídico de soportar. El daño debe ser **efectivo, evaluable económicamente e individualizado**. El derecho a reclamar **prescribe al año** del hecho o de que se manifieste su efecto lesivo. En daños físicos o psíquicos, el año cuenta desde la curación o la determinación de las secuelas.",
    citas: [
      { norma: "lrjsp", precepto: "a32", fragmento: "siempre que la lesión sea consecuencia del funcionamiento normal o anormal de los servicios públicos salvo en los casos de fuerza mayor o de daños que el particular tenga el deber jurídico de soportar de acuerdo con la Ley" },
      { norma: "lrjsp", precepto: "a32", fragmento: "el daño alegado habrá de ser efectivo, evaluable económicamente e individualizado con relación a una persona o grupo de personas" },
      { norma: "lpac", precepto: "a67", fragmento: "El derecho a reclamar prescribirá al año de producido el hecho o el acto que motive la indemnización o se manifieste su efecto lesivo." },
      { norma: "lpac", precepto: "a67", fragmento: "En caso de daños de carácter físico o psíquico a las personas, el plazo empezará a computarse desde la curación o la determinación del alcance de las secuelas." },
    ],
    claves: ["Régimen sustantivo en Ley 40/2015 (arts. 32 y ss.); procedimiento en Ley 39/2015.", "Silencio en responsabilidad patrimonial: desestimatorio (art. 24.1 Ley 39/2015)."],
    trampas: ["Responde también por funcionamiento normal: no hace falta culpa."],
  },
  {
    id: "abstencion-recusacion",
    pregunta: "¿Cuáles son los motivos de abstención y cómo se plantea la recusación?",
    variantes: ["abstencion", "recusacion", "motivos de abstencion", "parentesco cuarto grado", "amistad intima enemistad manifiesta", "articulo 23 ley 40/2015"],
    materia: "administrativo",
    respuesta:
      "Deben **abstenerse** quienes tengan interés personal en el asunto; vínculo matrimonial o asimilable, o parentesco de consanguinidad hasta el **cuarto grado** o de afinidad hasta el **segundo** con interesados, administradores o asesores; **amistad íntima o enemistad manifiesta**; hayan intervenido como **perito o testigo**; o tengan relación de servicio con el interesado, o le hayan prestado servicios profesionales en los **dos últimos años**. Los interesados pueden **recusar** por escrito en cualquier momento. El recusado responde al día siguiente y, si niega la causa, el superior resuelve en **tres días**. Contra lo que se decida no cabe recurso independiente.",
    citas: [
      { norma: "lrjsp", precepto: "a23", fragmento: "el parentesco de consanguinidad dentro del cuarto grado o de afinidad dentro del segundo" },
      { norma: "lrjsp", precepto: "a23", fragmento: "Tener amistad íntima o enemistad manifiesta con alguna de las personas mencionadas en el apartado anterior." },
      { norma: "lrjsp", precepto: "a23", fragmento: "Haber intervenido como perito o como testigo en el procedimiento de que se trate." },
      { norma: "lrjsp", precepto: "a23", fragmento: "haberle prestado en los dos últimos años servicios profesionales de cualquier tipo" },
      { norma: "lrjsp", precepto: "a23", fragmento: "no implicará, necesariamente, y en todo caso, la invalidez de los actos en que hayan intervenido" },
      { norma: "lrjsp", precepto: "a24", fragmento: "podrá promoverse recusación por los interesados en cualquier momento de la tramitación del procedimiento" },
      { norma: "lrjsp", precepto: "a24", fragmento: "Si el recusado niega la causa de recusación, el superior resolverá en el plazo de tres días" },
    ],
    claves: ["Consanguinidad 4.º grado / afinidad 2.º grado.", "Servicios profesionales: últimos 2 años.", "Recusación: el superior resuelve en 3 días."],
    trampas: ["Intervenir con motivo de abstención no invalida necesariamente el acto, pero genera responsabilidad."],
  },
  {
    id: "organos-colegiados",
    pregunta: "¿Qué quórum necesita un órgano colegiado para constituirse?",
    variantes: ["organos colegiados", "quorum", "constitucion de organos colegiados", "orden del dia", "articulo 17 ley 40/2015", "voto en contra exime de responsabilidad"],
    materia: "administrativo",
    respuesta:
      "Para constituirse válidamente se requiere la asistencia, presencial o a distancia, del **Presidente y del Secretario** (o quienes les suplan) y de **la mitad, al menos, de sus miembros**. Los acuerdos se adoptan **por mayoría de votos**. No puede tratarse un asunto que no esté en el orden del día, salvo que asistan **todos** los miembros y se declare la urgencia por mayoría. Quienes votan en contra o se abstienen quedan exentos de la responsabilidad que pueda derivarse de los acuerdos.",
    citas: [
      { norma: "lrjsp", precepto: "a17", fragmento: "se requerirá la asistencia, presencial o a distancia, del Presidente y Secretario o en su caso, de quienes les suplan, y la de la mitad, al menos, de sus miembros" },
      { norma: "lrjsp", precepto: "a17", fragmento: "Los acuerdos serán adoptados por mayoría de votos." },
      { norma: "lrjsp", precepto: "a17", fragmento: "No podrá ser objeto de deliberación o acuerdo ningún asunto que no figure incluido en el orden del día, salvo que asistan todos los miembros del órgano colegiado y sea declarada la urgencia del asunto por el voto favorable de la mayoría." },
      { norma: "lrjsp", precepto: "a17", fragmento: "Cuando los miembros del órgano voten en contra o se abstengan, quedarán exentos de la responsabilidad que, en su caso, pueda derivarse de los acuerdos." },
    ],
  },
  {
    id: "acceso-informacion",
    pregunta: "¿En qué plazo se resuelve una solicitud de acceso a la información pública?",
    variantes: ["derecho de acceso a la informacion publica", "ley de transparencia plazo", "solicitud de acceso un mes", "articulo 20 ley 19/2013", "silencio transparencia"],
    materia: "administrativo",
    respuesta:
      "La resolución debe notificarse en **un mes** desde que el órgano competente recibe la solicitud, ampliable **otro mes** por volumen o complejidad, previa notificación al solicitante. Si no se resuelve a tiempo, la solicitud se entiende **desestimada**. Las resoluciones son recurribles directamente ante el contencioso-administrativo, sin perjuicio de la reclamación potestativa del artículo 24.",
    citas: [
      { norma: "ltransparencia", precepto: "a20", fragmento: "en el plazo máximo de un mes desde la recepción de la solicitud por el órgano competente para resolver" },
      { norma: "ltransparencia", precepto: "a20", fragmento: "Este plazo podrá ampliarse por otro mes en el caso de que el volumen o la complejidad de la información que se solicita así lo hagan necesario y previa notificación al solicitante." },
      { norma: "ltransparencia", precepto: "a20", fragmento: "Transcurrido el plazo máximo para resolver sin que se haya dictado y notificado resolución expresa se entenderá que la solicitud ha sido desestimada." },
    ],
    trampas: ["Aquí el silencio es negativo, al contrario que la regla general del art. 24 de la Ley 39/2015."],
  },
  {
    id: "datos-menores",
    pregunta: "¿Desde qué edad puede un menor consentir el tratamiento de sus datos?",
    variantes: ["consentimiento de los menores", "proteccion de datos menores", "catorce anos datos", "articulo 7 lopdgdd"],
    materia: "administrativo",
    respuesta:
      "El tratamiento de datos de un menor solo puede basarse en su propio consentimiento si es **mayor de catorce años**, salvo que la ley exija la asistencia de los titulares de la patria potestad o tutela para ese acto. Con **menores de catorce**, hace falta el consentimiento del titular de la patria potestad o tutela.",
    citas: [
      { norma: "lopdgdd", precepto: "a7", fragmento: "El tratamiento de los datos personales de un menor de edad únicamente podrá fundarse en su consentimiento cuando sea mayor de catorce años." },
      { norma: "lopdgdd", precepto: "a7", fragmento: "solo será lícito si consta el del titular de la patria potestad o tutela" },
    ],
  },

  // ===================== Empleo público (TREBEP) =====================
  {
    id: "clases-empleados",
    pregunta: "¿Qué clases de empleados públicos hay?",
    variantes: ["clases de empleados publicos", "tipos de personal", "funcionarios de carrera interinos laboral eventual", "articulo 8 trebep"],
    materia: "empleo publico",
    respuesta:
      "Son empleados públicos quienes desempeñan funciones retribuidas en las Administraciones Públicas al servicio de los intereses generales. Se clasifican en **funcionarios de carrera**, **funcionarios interinos**, **personal laboral** (fijo, por tiempo indefinido o temporal) y **personal eventual**.",
    citas: [
      { norma: "trebep", precepto: "a8", fragmento: "Son empleados públicos quienes desempeñan funciones retribuidas en las Administraciones Públicas al servicio de los intereses generales." },
      { norma: "trebep", precepto: "a8", fragmento: "Funcionarios de carrera." },
      { norma: "trebep", precepto: "a8", fragmento: "Funcionarios interinos." },
      { norma: "trebep", precepto: "a8", fragmento: "Personal laboral, ya sea fijo, por tiempo indefinido o temporal." },
      { norma: "trebep", precepto: "a8", fragmento: "Personal eventual." },
      { norma: "trebep", precepto: "a13", fragmento: "Cuando el personal directivo reúna la condición de personal laboral estará sometido a la relación laboral de carácter especial de alta dirección." },
    ],
    claves: ["Cuatro clases (art. 8.2 TREBEP)."],
    trampas: ["El personal directivo profesional (art. 13) no aparece entre las cuatro clases del art. 8.2; si es laboral, se rige por la relación especial de alta dirección."],
    relacionadas: ["grupos-clasificacion", "requisitos-acceso"],
  },
  {
    id: "grupos-clasificacion",
    pregunta: "¿Qué titulación se exige para cada grupo A1, A2, B, C1 y C2?",
    variantes: ["grupos de clasificacion", "subgrupo a1", "subgrupo a2", "grupo b", "subgrupo c1", "subgrupo c2", "titulacion exigida", "que titulacion necesito", "articulo 76 trebep", "con bachillerato", "con la eso"],
    materia: "empleo publico",
    respuesta:
      "Según el artículo 76 del TREBEP: **Grupo A (subgrupos A1 y A2)**, título universitario de **Grado** (A1 o A2 según el nivel de responsabilidad y las pruebas). **Grupo B**, título de **Técnico Superior**. **Subgrupo C1**, **Bachiller o Técnico**. **Subgrupo C2**, **Graduado en ESO**. Hay además agrupaciones profesionales sin requisito de titulación (DA 6.ª).",
    citas: [
      { norma: "trebep", precepto: "a76", fragmento: "Para el acceso a los cuerpos o escalas de este Grupo se exigirá estar en posesión del título universitario de Grado." },
      { norma: "trebep", precepto: "a76", fragmento: "La clasificación de los cuerpos y escalas en cada Subgrupo estará en función del nivel de responsabilidad de las funciones a desempeñar y de las características de las pruebas de acceso." },
      { norma: "trebep", precepto: "a76", fragmento: "Para el acceso a los cuerpos o escalas del Grupo B se exigirá estar en posesión del título de Técnico Superior." },
      { norma: "trebep", precepto: "a76", fragmento: "C1: Título de Bachiller o Técnico." },
      { norma: "trebep", precepto: "a76", fragmento: "C2: Título de Graduado en Educación Secundaria Obligatoria." },
    ],
    claves: ["A1/A2: Grado · B: Técnico Superior · C1: Bachiller o Técnico · C2: ESO."],
    trampas: ["La diferencia entre A1 y A2 no la marca el título (ambos piden Grado), sino la responsabilidad y las pruebas."],
    relacionadas: ["requisitos-acceso", "clases-empleados"],
  },
  {
    id: "requisitos-acceso",
    pregunta: "¿Qué requisitos generales hay para presentarse a una oposición?",
    variantes: ["requisitos generales", "requisitos para opositar", "edad minima oposiciones", "dieciseis anos", "nacionalidad oposiciones", "acceso empleo publico extranjeros", "articulo 56 trebep", "articulo 57 trebep"],
    materia: "empleo publico",
    respuesta:
      "Los requisitos generales del artículo 56 TREBEP son cinco. Tener la **nacionalidad española**, con las excepciones del artículo 57. Tener la **capacidad funcional** para las tareas. Tener **cumplidos dieciséis años** y no superar la edad máxima de jubilación forzosa, salvo otra edad fijada por ley. No haber sido **separado por expediente disciplinario** ni estar **inhabilitado**. Y tener la **titulación exigida**. Los nacionales de la UE pueden acceder como funcionarios en igualdad de condiciones, salvo en empleos con participación en el poder público. Los extranjeros con residencia legal pueden acceder como personal laboral.",
    citas: [
      { norma: "trebep", precepto: "a56", fragmento: "Tener la nacionalidad española, sin perjuicio de lo dispuesto en el artículo siguiente." },
      { norma: "trebep", precepto: "a56", fragmento: "Poseer la capacidad funcional para el desempeño de las tareas." },
      { norma: "trebep", precepto: "a56", fragmento: "Tener cumplidos dieciséis años y no exceder, en su caso, de la edad máxima de jubilación forzosa." },
      { norma: "trebep", precepto: "a56", fragmento: "Poseer la titulación exigida." },
      { norma: "trebep", precepto: "a57", fragmento: "Los nacionales de los Estados miembros de la Unión Europea podrán acceder, como personal funcionario, en igualdad de condiciones que los españoles a los empleos públicos, con excepción de aquellos que directa o indirectamente impliquen una participación en el ejercicio del poder público" },
      { norma: "trebep", precepto: "a57", fragmento: "los extranjeros con residencia legal en España podrán acceder a las Administraciones Públicas, como personal laboral, en igualdad de condiciones que los españoles" },
    ],
    claves: ["Edad mínima: 16 años.", "Principios del art. 55: igualdad, mérito y capacidad + publicidad, transparencia, imparcialidad, independencia, adecuación y agilidad."],
    relacionadas: ["grupos-clasificacion", "principios-acceso"],
  },
  {
    id: "principios-acceso",
    pregunta: "¿Qué principios rigen el acceso al empleo público?",
    variantes: ["principios rectores del acceso", "igualdad merito y capacidad", "articulo 55 trebep", "organos de seleccion"],
    materia: "empleo publico",
    respuesta:
      "El acceso se rige por los principios constitucionales de **igualdad, mérito y capacidad**. Además, los procesos selectivos deben garantizar: publicidad de las convocatorias y sus bases; transparencia; imparcialidad y profesionalidad de los órganos de selección; independencia y discrecionalidad técnica de esos órganos; adecuación de las pruebas a las funciones; y agilidad sin perjuicio de la objetividad.",
    citas: [
      { norma: "trebep", precepto: "a55", fragmento: "de acuerdo con los principios constitucionales de igualdad, mérito y capacidad" },
      { norma: "trebep", precepto: "a55", fragmento: "Publicidad de las convocatorias y de sus bases." },
      { norma: "trebep", precepto: "a55", fragmento: "Imparcialidad y profesionalidad de los miembros de los órganos de selección." },
      { norma: "trebep", precepto: "a55", fragmento: "Independencia y discrecionalidad técnica en la actuación de los órganos de selección." },
      { norma: "trebep", precepto: "a55", fragmento: "Agilidad, sin perjuicio de la objetividad, en los procesos de selección." },
    ],
    relacionadas: ["requisitos-acceso"],
  },
  {
    id: "situaciones-administrativas",
    pregunta: "¿Cuáles son las situaciones administrativas de los funcionarios?",
    variantes: ["situaciones administrativas", "servicio activo", "servicios especiales", "excedencia", "suspension de funciones", "articulo 85 trebep"],
    materia: "empleo publico",
    respuesta:
      "Según el artículo 85 TREBEP, los funcionarios de carrera pueden estar en **servicio activo**, **servicios especiales**, **servicio en otras Administraciones Públicas**, **excedencia** o **suspensión de funciones**. Las leyes de función pública que desarrollen el Estatuto pueden regular otras.",
    citas: [
      { norma: "trebep", precepto: "a85", fragmento: "Servicio activo." },
      { norma: "trebep", precepto: "a85", fragmento: "Servicios especiales." },
      { norma: "trebep", precepto: "a85", fragmento: "Servicio en otras Administraciones Públicas." },
      { norma: "trebep", precepto: "a85", fragmento: "Excedencia." },
      { norma: "trebep", precepto: "a85", fragmento: "Suspensión de funciones." },
      { norma: "trebep", precepto: "a85", fragmento: "Las leyes de Función Pública que se dicten en desarrollo de este Estatuto podrán regular otras situaciones administrativas" },
    ],
    claves: ["Cinco situaciones en el TREBEP; las leyes de desarrollo pueden añadir otras."],
  },
  {
    id: "faltas-prescripcion",
    pregunta: "¿Cuándo prescriben las faltas y sanciones disciplinarias de los funcionarios?",
    variantes: ["prescripcion de las faltas", "faltas muy graves", "faltas graves", "faltas leves", "regimen disciplinario", "articulo 95 trebep", "articulo 97 trebep"],
    materia: "empleo publico",
    respuesta:
      "Las faltas pueden ser muy graves, graves y leves. **Faltas**: las muy graves prescriben a los **tres años**, las graves a los **dos años** y las leves a los **seis meses**. **Sanciones**: las de faltas muy graves a los **tres años**, las de graves a los **dos años** y las de leves **al año**. El plazo de las faltas se cuenta desde su comisión, o desde el cese si son continuadas. El de las sanciones, desde la firmeza de la resolución sancionadora.",
    citas: [
      { norma: "trebep", precepto: "a95", fragmento: "Las faltas disciplinarias pueden ser muy graves, graves y leves." },
      { norma: "trebep", precepto: "a97", fragmento: "Las infracciones muy graves prescribirán a los tres años, las graves a los dos años y las leves a los seis meses; las sanciones impuestas por faltas muy graves prescribirán a los tres años, las impuestas por faltas graves a los dos años y las impuestas por faltas leves al año." },
      { norma: "trebep", precepto: "a97", fragmento: "El de las sanciones, desde la firmeza de la resolución sancionadora." },
    ],
    claves: ["Faltas 3a / 2a / 6m · Sanciones 3a / 2a / 1a."],
    trampas: ["Solo cambia lo leve: la falta leve prescribe a los 6 meses y su sanción al año."],
  },

  // ===================== Organización y procesos judiciales =====================
  {
    id: "organos-jurisdiccionales",
    pregunta: "¿Qué tribunales ejercen la potestad jurisdiccional tras la reforma de la LO 1/2025?",
    variantes: ["organos jurisdiccionales", "tribunales de instancia", "planta judicial", "juzgados y tribunales", "tribunal central de instancia", "articulo 26 lopj", "organizacion judicial"],
    materia: "justicia",
    respuesta:
      "Tras la reforma de la LO 1/2025, el artículo 26 de la LOPJ atribuye la potestad jurisdiccional a: los **jueces y juezas de paz**, los **Tribunales de Instancia**, las **Audiencias Provinciales**, los **Tribunales Superiores de Justicia**, el **Tribunal Central de Instancia**, la **Audiencia Nacional** y el **Tribunal Supremo**. Los Tribunales de Instancia se organizan en secciones, por ejemplo las «Secciones de lo Social de los Tribunales de Instancia» a las que se refiere el artículo 75.",
    citas: [
      { norma: "lopj", precepto: "aveintiseis", fragmento: "Jueces y juezas de paz." },
      { norma: "lopj", precepto: "aveintiseis", fragmento: "Tribunales de Instancia." },
      { norma: "lopj", precepto: "aveintiseis", fragmento: "Audiencias Provinciales." },
      { norma: "lopj", precepto: "aveintiseis", fragmento: "Tribunales Superiores de Justicia." },
      { norma: "lopj", precepto: "aveintiseis", fragmento: "Tribunal Central de Instancia." },
      { norma: "lopj", precepto: "aveintiseis", fragmento: "Audiencia Nacional." },
      { norma: "lopj", precepto: "aveintiseis", fragmento: "Tribunal Supremo." },
      { norma: "lopj", precepto: "asetentaycinco", fragmento: "Secciones de lo Social de los Tribunales de Instancia" },
    ],
    claves: ["Siete escalones en el art. 26 LOPJ vigente.", "Si tu temario es anterior a 2025, aún hablará de «Juzgados de Primera Instancia e Instrucción…»: compruébalo con la convocatoria."],
    relacionadas: ["poder-judicial-principios", "tribunal-supremo"],
  },
  {
    id: "dias-habiles-judiciales",
    pregunta: "¿Qué días y horas son hábiles para las actuaciones judiciales? ¿Es hábil agosto?",
    variantes: ["dias habiles judiciales", "agosto inhabil", "horas habiles", "24 de diciembre al 6 de enero", "articulo 182 lopj", "articulo 183 lopj", "inhabiles a efectos procesales"],
    materia: "justicia",
    respuesta:
      "Son **inhábiles** a efectos procesales los **sábados y domingos**, los días de **fiesta nacional** y los **festivos** laborales de la comunidad autónoma o localidad. También lo son **todos los días de agosto** y del **24 de diciembre al 6 de enero**, ambos incluidos, salvo para las actuaciones urgentes. Son **horas hábiles** de **ocho de la mañana a ocho de la tarde**, salvo que la ley diga otra cosa. El CGPJ puede habilitar días por reglamento.",
    citas: [
      { norma: "lopj", precepto: "acientoochentaydos", fragmento: "Son inhábiles a efectos procesales los sábados y domingos, los días de fiesta nacional y los festivos a efectos laborales en la respectiva Comunidad Autónoma o localidad." },
      { norma: "lopj", precepto: "acientoochentaydos", fragmento: "Son horas hábiles desde las ocho de la mañana a las ocho de la tarde, salvo que la ley disponga lo contrario." },
      { norma: "lopj", precepto: "acientoochentaydos", fragmento: "El Consejo General del Poder Judicial, mediante reglamento, podrá habilitar estos días" },
      { norma: "lopj", precepto: "acientoochentaytres", fragmento: "Serán inhábiles los días del mes de agosto, así como todos los días desde el 24 de diciembre hasta el 6 de enero del año siguiente, ambos inclusive, para todas las actuaciones judiciales, excepto las que se declaren urgentes por las leyes procesales." },
    ],
    claves: ["Agosto y 24 dic.–6 ene. inhábiles (art. 183 LOPJ).", "Horas hábiles 8:00-20:00 (art. 182.2)."],
    trampas: ["En vía administrativa agosto sí es hábil: solo excluye sábados, domingos y festivos (art. 30 Ley 39/2015)."],
    relacionadas: ["computo-plazos"],
  },
  {
    id: "resoluciones-judiciales",
    pregunta: "¿Qué diferencia hay entre providencia, auto y sentencia?",
    variantes: ["providencia", "auto", "sentencia", "resoluciones judiciales", "sentencia firme", "ejecutoria", "articulo 245 lopj"],
    materia: "justicia",
    respuesta:
      "Según el artículo 245 LOPJ: **providencias**, cuando tienen por objeto la **ordenación material del proceso**. **Autos**, cuando deciden recursos contra providencias, cuestiones incidentales, presupuestos procesales o nulidad del procedimiento, o cuando la ley exige esa forma. **Sentencias**, cuando **deciden definitivamente el pleito o causa** en cualquier instancia o recurso. Es **firme** la sentencia contra la que no cabe recurso, salvo el de revisión u otros extraordinarios. La **ejecutoria** es el documento público y solemne que recoge una sentencia firme.",
    citas: [
      { norma: "lopj", precepto: "adoscientoscuarentaycinco", fragmento: "Providencias, cuando tengan por objeto la ordenación material del proceso." },
      { norma: "lopj", precepto: "adoscientoscuarentaycinco", fragmento: "Autos, cuando decidan recursos contra providencias, cuestiones incidentales, presupuestos procesales, nulidad del procedimiento" },
      { norma: "lopj", precepto: "adoscientoscuarentaycinco", fragmento: "Sentencias, cuando decidan definitivamente el pleito o causa en cualquier instancia o recurso" },
      { norma: "lopj", precepto: "adoscientoscuarentaycinco", fragmento: "Son sentencias firmes aquellas contra las que no quepa recurso alguno, salvo el de revisión u otros extraordinarios que establezca la ley." },
      { norma: "lopj", precepto: "adoscientoscuarentaycinco", fragmento: "Llámase ejecutoria el documento público y solemne en que se consigna una sentencia firme." },
      { norma: "lopj", precepto: "acuatrocientoscincuentayseis", fragmento: "Estas resoluciones se denominarán diligencias, que podrán ser de ordenación, de constancia, de comunicación o de ejecución." },
      { norma: "lopj", precepto: "acuatrocientoscincuentayseis", fragmento: "Las diligencias de ordenación y los decretos serán recurribles" },
    ],
    claves: ["Las ejecutorias se encabezan en nombre del Rey.", "El Letrado de la Administración de Justicia dicta sus propias resoluciones: diligencias (de ordenación, constancia, comunicación o ejecución) y decretos (art. 456 LOPJ)."],
    relacionadas: ["letrados-fe-publica"],
  },
  {
    id: "letrados-fe-publica",
    pregunta: "¿Quién ejerce la fe pública judicial?",
    variantes: ["fe publica judicial", "letrado de la administracion de justicia", "laj", "secretario judicial", "articulo 453 lopj"],
    materia: "justicia",
    respuesta:
      "Corresponde a los **Letrados de la Administración de Justicia**, **con exclusividad y plenitud**, el ejercicio de la fe pública judicial. Dejan constancia fehaciente de los actos procesales mediante actas y diligencias. Si se graban las vistas, garantizan la autenticidad e integridad de la grabación. También expiden certificaciones y testimonios de actuaciones no secretas, autorizan los poderes para pleitos y no necesitan testigos para ejercer esta función.",
    citas: [
      { norma: "lopj", precepto: "acuatrocientoscincuentaytres", fragmento: "Corresponde a los Letrados de la Administración de Justicia, con exclusividad y plenitud, el ejercicio de la fe pública judicial." },
      { norma: "lopj", precepto: "acuatrocientoscincuentaytres", fragmento: "el Letrado de la Administración de Justicia garantizará la autenticidad e integridad de lo grabado o reproducido" },
      { norma: "lopj", precepto: "acuatrocientoscincuentaytres", fragmento: "En el ejercicio de esta función no precisarán de la intervención adicional de testigos." },
    ],
    trampas: ["«Secretario judicial» es la denominación anterior del Letrado de la Administración de Justicia."],
    relacionadas: ["cuerpos-justicia", "resoluciones-judiciales"],
  },
  {
    id: "cuerpos-justicia",
    pregunta: "¿Qué cuerpos de funcionarios hay en la Administración de Justicia y qué titulación piden?",
    variantes: ["cuerpos generales justicia", "gestion procesal", "tramitacion procesal", "auxilio judicial", "cuerpos especiales justicia", "medicos forenses", "titulacion justicia", "articulo 475 lopj", "funciones tramitacion procesal"],
    materia: "justicia",
    respuesta:
      "El artículo 475 LOPJ distingue **Cuerpos Generales** (tareas de contenido procesal) y **Cuerpos Especiales** (profesión o titulación específica). Generales: **Gestión Procesal y Administrativa** (Diplomado Universitario, Ingeniero o Arquitecto Técnico o equivalente), **Tramitación Procesal y Administrativa** (Bachiller o equivalente) y **Auxilio Judicial** (Graduado en ESO o equivalente). Especiales: Médicos Forenses, Facultativos, Técnicos Especialistas y Ayudantes de Laboratorio del Instituto Nacional de Toxicología y Ciencias Forenses. A Tramitación le corresponden las actividades de apoyo a la gestión procesal (art. 477).",
    citas: [
      { norma: "lopj", precepto: "acuatrocientossetentaycinco", fragmento: "El Cuerpo de Gestión Procesal y Administrativa. La titulación exigida para el acceso a este Cuerpo es la de Diplomado Universitario, Ingeniero Técnico, Arquitecto Técnico o equivalente." },
      { norma: "lopj", precepto: "acuatrocientossetentaycinco", fragmento: "El Cuerpo de Tramitación Procesal y Administrativa. Para el acceso a este Cuerpo se exigirá estar en posesión del título de Bachiller o equivalente." },
      { norma: "lopj", precepto: "acuatrocientossetentaycinco", fragmento: "El Cuerpo de Auxilio Judicial. Para cuyo ingreso se exigirá estar en posesión del título de graduado en E.S.O. o equivalente." },
      { norma: "lopj", precepto: "acuatrocientossetentaycinco", fragmento: "El Cuerpo de Médicos Forenses." },
      { norma: "lopj", precepto: "acuatrocientossetentaysiete", fragmento: "Corresponde con carácter general al Cuerpo de Tramitación Procesal y Administrativa la realización de cuantas actividades tengan carácter de apoyo a la gestión procesal" },
    ],
    claves: ["Gestión: diplomatura/grado · Tramitación: Bachiller · Auxilio: ESO.", "Tramitación (art. 477): tramitación general, registro y clasificación de correspondencia, formación de autos y expedientes, cédulas…"],
    relacionadas: ["letrados-fe-publica", "grupos-clasificacion"],
  },
  {
    id: "ordinario-verbal",
    pregunta: "¿Cuándo se sigue el juicio ordinario y cuándo el verbal?",
    variantes: ["juicio ordinario", "juicio verbal", "cuantia juicio ordinario", "15.000 euros", "quince mil euros", "articulo 249 lec", "articulo 250 lec"],
    materia: "justicia",
    respuesta:
      "Además de las materias que la LEC asigna sin importar la cuantía, el criterio cuantitativo vigente es este. Van al **juicio ordinario** las demandas cuya cuantía **exceda de quince mil euros** y aquellas cuyo interés económico sea imposible de calcular. Van al **verbal** las de cuantía **que no exceda de quince mil euros** y no sean de las materias reservadas al ordinario. Por materia, entre otras, van siempre al ordinario las demandas sobre derechos honoríficos, honor, intimidad y propia imagen o impugnación de acuerdos sociales.",
    citas: [
      { norma: "lec", precepto: "a249", fragmento: "Se decidirán también en el juicio ordinario las demandas cuya cuantía exceda de quince mil euros y aquéllas cuyo interés económico resulte imposible de calcular, ni siquiera de modo relativo." },
      { norma: "lec", precepto: "a250", fragmento: "Se decidirán también en el juicio verbal las demandas cuya cuantía no exceda de quince mil euros y no se refieran a ninguna de las materias previstas en el apartado 1 del artículo anterior." },
      { norma: "lec", precepto: "a249", fragmento: "Las demandas relativas a derechos honoríficos de la persona." },
      { norma: "lec", precepto: "a249", fragmento: "Las que pretendan la tutela del derecho al honor, a la intimidad y a la propia imagen" },
    ],
    claves: ["Umbral: 15.000 € (desde el RDL 6/2023; antes eran 6.000 €)."],
    trampas: ["Muchos temarios antiguos aún dicen 6.000 €: la cifra vigente es 15.000 €."],
    relacionadas: ["monitorio", "apelacion-civil"],
  },
  {
    id: "monitorio",
    pregunta: "¿Cuándo se puede acudir al proceso monitorio?",
    variantes: ["proceso monitorio", "juicio monitorio", "deuda dineraria", "articulo 812 lec"],
    materia: "justicia",
    respuesta:
      "Puede acudir al monitorio quien reclame el pago de una **deuda dineraria de cualquier importe, líquida, determinada, vencida y exigible**, acreditada documentalmente. Por ejemplo, con documentos firmados por el deudor, o con facturas, albaranes o certificaciones de los que habitualmente documentan créditos entre acreedor y deudor. También sirve para gastos comunes de comunidades de propietarios acreditados por certificación de impago.",
    citas: [
      { norma: "lec", precepto: "a812", fragmento: "quien pretenda de otro el pago de deuda dineraria de cualquier importe, líquida, determinada, vencida y exigible" },
      { norma: "lec", precepto: "a812", fragmento: "Cuando la deuda se acredite mediante certificaciones de impago de cantidades debidas en concepto de gastos comunes de Comunidades de propietarios de inmuebles urbanos." },
    ],
    claves: ["Cuatro notas de la deuda: líquida, determinada, vencida y exigible.", "Sin límite de cuantía («de cualquier importe»)."],
    relacionadas: ["ordinario-verbal"],
  },
  {
    id: "apelacion-civil",
    pregunta: "¿Cuál es el plazo para interponer el recurso de apelación en el proceso civil?",
    variantes: ["recurso de apelacion", "plazo apelacion civil", "veinte dias apelacion", "articulo 458 lec"],
    materia: "justicia",
    respuesta:
      "El recurso de apelación se interpone **ante el tribunal competente para conocer del mismo**, en el plazo de **veinte días** desde la notificación de la resolución impugnada. Debe acompañarse copia de la resolución y exponer las alegaciones, la resolución apelada y los pronunciamientos que se impugnan.",
    citas: [
      { norma: "lec", precepto: "a458", fragmento: "ante el tribunal que sea competente para conocer del mismo, en el plazo de veinte días desde la notificación de la resolución impugnada" },
    ],
    trampas: ["En la redacción vigente se interpone ante el tribunal competente para conocer del recurso, no ante el que dictó la resolución."],
    relacionadas: ["ordinario-verbal"],
  },
  {
    id: "procedimiento-abreviado",
    pregunta: "¿Para qué delitos se sigue el procedimiento abreviado?",
    variantes: ["procedimiento abreviado", "nueve anos de prision", "articulo 757 lecrim", "proceso penal abreviado"],
    materia: "justicia",
    respuesta:
      "Salvo los procesos especiales, el procedimiento abreviado se aplica a los delitos castigados con **pena privativa de libertad no superior a nueve años**, o con penas de otra naturaleza, únicas, conjuntas o alternativas, cualquiera que sea su cuantía o duración.",
    citas: [
      { norma: "lecrim", precepto: "a757", fragmento: "se aplicará al enjuiciamiento de los delitos castigados con pena privativa de libertad no superior a nueve años" },
    ],
    claves: ["Umbral: hasta 9 años de privación de libertad. Más de 9: sumario ordinario."],
    relacionadas: ["clases-delitos"],
  },
  {
    id: "clases-delitos",
    pregunta: "¿Cómo se clasifican los delitos en graves, menos graves y leves?",
    variantes: ["delitos graves", "delitos menos graves", "delitos leves", "clasificacion de los delitos", "articulo 13 codigo penal"],
    materia: "penal",
    respuesta:
      "El Código Penal clasifica los delitos por la pena: son **graves** los castigados con pena grave, **menos graves** los castigados con pena menos grave y **leves** los castigados con pena leve. Si la pena, por su extensión, encaja a la vez en grave y menos grave, el delito es **grave**. Si encaja en leve y menos grave, es **leve**.",
    citas: [
      { norma: "cp", precepto: "a13", fragmento: "Son delitos graves las infracciones que la Ley castiga con pena grave." },
      { norma: "cp", precepto: "a13", fragmento: "Son delitos leves las infracciones que la ley castiga con pena leve." },
      { norma: "cp", precepto: "a13", fragmento: "Cuando la pena, por su extensión, pueda incluirse a la vez entre las mencionadas en los dos primeros números de este artículo, el delito se considerará, en todo caso, como grave." },
      { norma: "cp", precepto: "a13", fragmento: "Cuando la pena, por su extensión, pueda considerarse como leve y como menos grave, el delito se considerará, en todo caso, como leve." },
    ],
    trampas: ["El art. 13 vigente solo distingue delitos graves, menos graves y leves: no hables de «faltas» penales."],
    relacionadas: ["prescripcion-delitos", "procedimiento-abreviado"],
  },
  {
    id: "prescripcion-delitos",
    pregunta: "¿Cuándo prescriben los delitos?",
    variantes: ["prescripcion de los delitos", "prescriben los delitos", "delitos imprescriptibles", "articulo 131 codigo penal"],
    materia: "penal",
    respuesta:
      "Según el artículo 131 CP: a los **veinte años** si la pena máxima es prisión de quince o más años. A los **quince** si es inhabilitación de más de diez años o prisión de más de diez y menos de quince. A los **diez** si es prisión o inhabilitación de más de cinco años sin exceder de diez. A los **cinco** los demás delitos, excepto los **leves** y los de **injurias y calumnias**, que prescriben **al año**. **No prescriben nunca** los delitos de lesa humanidad, genocidio y contra personas y bienes protegidos en conflicto armado (salvo los del art. 614), ni los de terrorismo que hayan causado la muerte de una persona.",
    citas: [
      { norma: "cp", precepto: "a131", fragmento: "A los veinte años, cuando la pena máxima señalada al delito sea prisión de quince o más años." },
      { norma: "cp", precepto: "a131", fragmento: "A los cinco, los demás delitos, excepto los delitos leves y los delitos de injurias y calumnias, que prescriben al año." },
      { norma: "cp", precepto: "a131", fragmento: "Tampoco prescribirán los delitos de terrorismo, si hubieren causado la muerte de una persona." },
    ],
    claves: ["20 / 15 / 10 / 5 años / 1 año (leves, injurias y calumnias)."],
    relacionadas: ["clases-delitos"],
  },
  {
    id: "recurso-contencioso",
    pregunta: "¿Cuál es el plazo para interponer el recurso contencioso-administrativo?",
    variantes: ["recurso contencioso-administrativo", "plazo contencioso", "dos meses contencioso", "seis meses silencio contencioso", "articulo 46 ljca"],
    materia: "justicia",
    respuesta:
      "El plazo es de **dos meses** desde el día siguiente a la publicación de la disposición o a la notificación o publicación del acto que pone fin a la vía administrativa, **si es expreso**. Si no lo es, el plazo es de **seis meses**. Contra una vía de hecho: diez días tras el requerimiento, o veinte si no lo hubo. Para el **recurso de lesividad**, dos meses desde la declaración de lesividad.",
    citas: [
      { norma: "ljca", precepto: "a46", fragmento: "El plazo para interponer el recurso contencioso-administrativo será de dos meses contados desde el día siguiente al de la publicación de la disposición impugnada o al de la notificación o publicación del acto que ponga fin a la vía administrativa, si fuera expreso. Si no lo fuera, el plazo será de seis meses" },
      { norma: "ljca", precepto: "a46", fragmento: "el plazo para interponer el recurso será de diez días a contar desde el día siguiente a la terminación del plazo establecido en el artículo 30. Si no hubiere requerimiento, el plazo será de veinte días" },
      { norma: "ljca", precepto: "a46", fragmento: "El plazo para interponer recurso de lesividad será de dos meses a contar desde el día siguiente a la fecha de la declaración de lesividad." },
    ],
    claves: ["Acto expreso: 2 meses. Presunto: 6 meses. Lesividad: 2 meses."],
    relacionadas: ["recurso-reposicion", "revision-oficio"],
  },

  // ===================== Igualdad y local =====================
  {
    id: "composicion-equilibrada",
    pregunta: "¿Qué es la composición equilibrada según la Ley de Igualdad?",
    variantes: ["composicion equilibrada", "presencia equilibrada", "60 40", "sesenta por ciento cuarenta por ciento", "ley de igualdad", "disposicion adicional primera lo 3/2007"],
    materia: "igualdad",
    respuesta:
      "Es la presencia de mujeres y hombres en la que las personas de **cada sexo no superan el sesenta por ciento ni son menos del cuarenta por ciento** del conjunto de que se trate (disposición adicional primera de la LO 3/2007).",
    citas: [
      { norma: "loigualdad", precepto: "daprimera", fragmento: "las personas de cada sexo no superen el sesenta por ciento ni sean menos del cuarenta por ciento" },
    ],
    claves: ["Regla 60/40 (DA 1.ª LO 3/2007)."],
  },
  {
    id: "municipio",
    pregunta: "¿Cuáles son los elementos del municipio y quién lo gobierna?",
    variantes: ["elementos del municipio", "municipio", "ayuntamiento", "alcalde y concejales", "concejo abierto", "articulo 11 lbrl", "articulo 19 lbrl"],
    materia: "local",
    respuesta:
      "El municipio es la **entidad local básica** de la organización territorial del Estado, con personalidad jurídica y plena capacidad. Sus elementos son el **territorio, la población y la organización**. Su gobierno y administración corresponden al **ayuntamiento, integrado por el Alcalde y los Concejales**, salvo los municipios en régimen de **Concejo Abierto**.",
    citas: [
      { norma: "lbrl", precepto: "a11", fragmento: "El Municipio es la entidad local básica de la organización territorial del Estado." },
      { norma: "lbrl", precepto: "a11", fragmento: "Son elementos del Municipio el territorio, la población y la organización." },
      { norma: "lbrl", precepto: "a19", fragmento: "corresponde al ayuntamiento, integrado por el Alcalde y los Concejales" },
    ],
    claves: ["Tres elementos: territorio, población y organización."],
  },
];
