// Banco de preguntas para los Temas 4, 5, 8 y 9 de Gestión de Sistemas e
// Informática (GSI), elaborado únicamente a partir del contenido de bloque
// ya redactado para cada tema (ver content/gsi-temario.ts,
// content/gsi-temario-2.ts y content/gsi-temario-3.ts). No se introducen
// artículos, leyes, fechas ni cifras que no figuren ya en ese contenido.

export const GSI_TEMA4_PREGUNTAS = [
  {
    enunciado:
      "El Reglamento eIDAS (y su revisión eIDAS 2.0) constituye el marco europeo que armoniza la identificación y la firma electrónica entre los Estados miembros. ¿Qué distinción establece según el nivel de garantía jurídica?",
    opciones: [
      "Firma electrónica simple, avanzada y cualificada",
      "Firma electrónica pública, privada y concertada",
      "Firma electrónica nacional, europea e internacional",
      "Firma electrónica básica, media y biométrica",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El temario indica que eIDAS distingue «entre firma electrónica simple, avanzada y cualificada según su nivel de garantía jurídica». Las demás opciones confunden esa clasificación con la de las claves (privada/pública/concertada) o son categorías inventadas que no aparecen en el texto.",
    mnemotecnia:
      "SAC: Simple, Avanzada, Cualificada — de menos a más garantía jurídica.",
    dificultad: 1,
  },
  {
    enunciado:
      "Según el temario, un certificado digital vincula una clave pública con la identidad de su titular. ¿Quién emite y garantiza ese vínculo?",
    opciones: [
      "Una autoridad de certificación",
      "El propio titular del certificado",
      "El European Digital Identity Wallet",
      "El protocolo LDAP",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto señala que el certificado digital está «emitido y garantizado por una autoridad de certificación». El titular no se autogarantiza el certificado, el Digital Identity Wallet es una cartera de identidad europea y LDAP es un protocolo de directorio, no una entidad emisora.",
    mnemotecnia:
      "Certificado = clave pública + identidad, con el sello de una AUTORIDAD de certificación detrás.",
    dificultad: 1,
  },
  {
    enunciado:
      "La infraestructura de clave pública (PKI) se define en el temario como:",
    opciones: [
      "El conjunto de hardware, software, políticas y procedimientos para crear, gestionar, distribuir y revocar certificados",
      "El chip incorporado en el DNI electrónico para identificación y firma",
      "El estándar X.500 para consultar información de identidad",
      "El formato de firma electrónica aplicado sobre documentos PDF",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El temario define la PKI exactamente como «el conjunto de hardware, software, políticas y procedimientos necesarios para crear, gestionar, distribuir y revocar estos certificados». El chip del DNIe, el estándar X.500 y el formato PAdES son elementos distintos descritos aparte.",
    mnemotecnia:
      "PKI = las 4 acciones sobre el certificado: Crear, Gestionar, Distribuir, Revocar.",
    dificultad: 2,
  },
  {
    enunciado:
      "De acuerdo con el temario, las claves usadas en firma electrónica se clasifican en privadas, públicas y:",
    opciones: [
      "Concertadas, acordadas entre las partes para un intercambio puntual",
      "Cualificadas, emitidas solo por prestadores acreditados",
      "Biométricas, vinculadas a un rasgo físico del titular",
      "Simétricas, compartidas por ambas partes de la comunicación",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto añade a las claves privadas y públicas una tercera categoría: las «concertadas (acordadas entre las partes para un intercambio puntual)». Las demás opciones son conceptos que aparecen en el temario pero referidos a otras cuestiones (niveles de firma, mecanismos de identificación), no a esta clasificación de claves.",
    mnemotecnia:
      "Privada firma, pública verifica, concertada se pacta puntualmente entre las partes.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Sobre qué tipo de contenido se aplica el formato de firma electrónica PAdES, según el temario?",
    opciones: [
      "Documentos PDF",
      "Documentos XML",
      "Contenido en formato CMS o binario",
      "Directorios LDAP",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El temario asocia expresamente PAdES a PDF, XAdES a XML y CAdES a CMS/binario. LDAP no es un formato de firma sino un protocolo de directorio, mencionado aparte en el mismo bloque.",
    mnemotecnia:
      "XAdES-XML, CAdES-CMS/binario, PAdES-PDF: la letra final de cada sigla evoca su soporte.",
    dificultad: 1,
  },
  {
    enunciado:
      "El DNI electrónico, según el temario, incorpora un chip cuya función es:",
    opciones: [
      "Contener certificados digitales para identificación y firma",
      "Almacenar el historial biométrico completo del titular",
      "Conectarse directamente al European Digital Identity Wallet",
      "Sustituir a la infraestructura de clave pública (PKI)",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto dice que «el DNI electrónico incorpora un chip con certificados digitales para identificación y firma». No se describe que almacene un historial biométrico, que se conecte a la Wallet europea ni que sustituya a la PKI, que es la infraestructura que sustenta esos certificados.",
    mnemotecnia:
      "DNIe = chip con certificados, para identificarte y firmar, no una base de datos biométrica.",
    dificultad: 1,
  },
  {
    enunciado:
      "Conforme al temario, el sello electrónico se diferencia de la firma electrónica de una persona física en que:",
    opciones: [
      "Identifica a una persona jurídica y se usa para automatizar la firma de grandes volúmenes de documentos sin intervención humana directa",
      "Solo puede aplicarse a documentos en formato PDF",
      "Requiere siempre la intervención de un tercero de confianza distinto de la autoridad de certificación",
      "Sustituye a la infraestructura de clave pública en las Administraciones",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El temario explica que «el sello electrónico identifica a una persona jurídica... y se usa habitualmente para automatizar la firma de grandes volúmenes de documentos generados por un sistema de información sin intervención humana directa». Las demás opciones no se corresponden con esa descripción.",
    mnemotecnia:
      "Sello = persona JURÍDICA + firma en MASA y automática; firma personal = persona física, caso a caso.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué garantiza el sellado de tiempo (time-stamping) según el temario?",
    opciones: [
      "Que un documento electrónico existía en un momento concreto y no ha sido modificado desde entonces",
      "Que el firmante es titular de un certificado cualificado",
      "Que el documento ha sido validado por la plataforma @firma",
      "Que la clave privada utilizada no ha sido revocada",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto define el sellado de tiempo como el mecanismo que «certifica, mediante un tercero de confianza, que un documento electrónico existía en un momento concreto y no ha sido modificado desde entonces». Las otras opciones describen funciones distintas atribuidas en el temario a la firma cualificada o a la plataforma @firma.",
    mnemotecnia:
      "Time-stamping = fotografía con fecha: 'este documento ya existía así en este instante'.",
    dificultad: 2,
  },
  {
    enunciado:
      "La plataforma @firma, gestionada por la Administración General del Estado, permite, según el temario:",
    opciones: [
      "Validar certificados y firmas electrónicas de forma centralizada, comprobando su vigencia y que no han sido revocados",
      "Emitir certificados digitales cualificados a los ciudadanos",
      "Sustituir al DNI electrónico como mecanismo de identificación",
      "Almacenar de forma permanente los documentos firmados por cada organismo",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El temario indica que @firma «permite validar certificados y firmas electrónicas de forma centralizada, comprobando que un certificado es válido, no ha caducado y no ha sido revocado, sin que cada organismo tenga que implementar esa lógica por separado». No se le atribuye ni la emisión de certificados ni el archivo de documentos.",
    mnemotecnia:
      "@firma valida centralizadamente, no emite ni archiva: comprueba que el certificado esté vivo y sin revocar.",
    dificultad: 2,
  },
  {
    enunciado:
      "Respecto a la custodia y el archivo electrónico de documentos firmados a largo plazo, el temario señala como reto específico:",
    opciones: [
      "Que los algoritmos y certificados usados en la firma pueden quedar obsoletos con el paso de los años",
      "Que la plataforma @firma solo admite certificados emitidos en los últimos doce meses",
      "Que el sellado de tiempo pierde validez transcurrido un año desde su emisión",
      "Que el European Digital Identity Wallet no admite documentos anteriores a su implantación",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El temario plantea el reto de que «los algoritmos y certificados usados en la firma pueden quedar obsoletos con el paso de los años», lo que se afronta con técnicas de «resellado» o renovación periódica de las evidencias de firma. Las demás afirmaciones sobre plazos concretos no figuran en el texto.",
    mnemotecnia:
      "Con los años, los algoritmos envejecen: por eso hace falta RESELLAR la firma antigua para que siga siendo válida.",
    dificultad: 2,
  },
];

export const GSI_TEMA5_PREGUNTAS = [
  {
    enunciado:
      "Según el temario, la ciberseguridad busca proteger los sistemas de información frente a amenazas que comprometan tres propiedades clásicas conocidas como la tríada CID. ¿Cuáles son?",
    opciones: [
      "Confidencialidad, integridad y disponibilidad",
      "Confidencialidad, identificación y disponibilidad",
      "Control, integridad y detección",
      "Confidencialidad, integridad y detección",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El temario define la tríada CID como «confidencialidad, integridad o disponibilidad». Las demás combinaciones sustituyen alguno de esos tres términos por otro concepto (identificación, control, detección) que no forma parte de la tríada según el texto.",
    mnemotecnia:
      "CID: Confidencialidad, Integridad, Disponibilidad — las tres patas clásicas de la seguridad.",
    dificultad: 1,
  },
  {
    enunciado:
      "En el ámbito de la Administración Pública española, el temario indica que la ciberseguridad se rige por:",
    opciones: [
      "El Esquema Nacional de Seguridad (ENS)",
      "El Reglamento eIDAS",
      "La Estrategia Nacional de Ciberseguridad exclusivamente",
      "El CCN-CERT como norma jurídica",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto señala que la Administración Pública «se rige por el Esquema Nacional de Seguridad (ENS), que fija los principios básicos y requisitos mínimos». La Estrategia Nacional de Ciberseguridad es el marco de objetivos y líneas de acción, no la norma que fija esos requisitos, y el CCN-CERT es un organismo de coordinación, no una norma.",
    mnemotecnia:
      "ENS = las reglas del juego para los sistemas públicos; la Estrategia son los objetivos del país.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿En qué consiste la vulnerabilidad de inyección SQL, tal como la describe el temario?",
    opciones: [
      "Manipular una consulta a base de datos insertando código malicioso en un campo de entrada mal validado",
      "Forzar a un usuario autenticado a ejecutar acciones no deseadas",
      "Inyectar scripts que se ejecutan en el navegador de otro usuario",
      "Saturar un sistema desde múltiples orígenes para dejarlo inaccesible",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El temario define la SQL injection como «manipular una consulta a base de datos insertando código malicioso en un campo de entrada mal validado». Las otras opciones corresponden respectivamente al CSRF, al XSS y a un ataque DDoS, descritos en el mismo bloque como vulnerabilidades o ataques distintos.",
    mnemotecnia:
      "SQL injection ataca la BASE DE DATOS a través de un campo de entrada sin validar.",
    dificultad: 1,
  },
  {
    enunciado:
      "El Cross-Site Request Forgery (CSRF), según el temario, consiste en:",
    opciones: [
      "Forzar a un usuario autenticado a ejecutar acciones no deseadas",
      "Inyectar scripts que se ejecutan en el navegador de otro usuario",
      "Probar sistemáticamente combinaciones de credenciales hasta acertar",
      "Cifrar los datos de la víctima y exigir un rescate",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto define el CSRF como «forzar a un usuario autenticado a ejecutar acciones no deseadas». Inyectar scripts corresponde al XSS, probar credenciales sistemáticamente es fuerza bruta, y cifrar datos y exigir rescate describe al ransomware, todos ellos definidos aparte en el mismo bloque.",
    mnemotecnia:
      "CSRF = engañar a un usuario YA autenticado para que actúe sin querer.",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el temario, el ransomware es un tipo de:",
    opciones: [
      "Malware que cifra los datos y exige un rescate",
      "Ataque de denegación de servicio distribuido",
      "Vulnerabilidad de inyección de código en aplicaciones web",
      "Técnica de suplantación de identidad por correo electrónico",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto encuadra el ransomware dentro del malware, definiéndolo como el que «cifra los datos y exige un rescate». La denegación de servicio, la inyección de código y el phishing son categorías distintas descritas en el mismo bloque.",
    mnemotecnia:
      "Ransom = rescate: el ransomware secuestra tus datos cifrándolos hasta que pagas.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué diferencia, conforme al temario, un ataque DoS de uno DDoS?",
    opciones: [
      "El DDoS se distribuye desde múltiples orígenes, mientras que el DoS no se describe así",
      "El DoS solo afecta a aplicaciones web y el DDoS a redes",
      "El DDoS es una variante del phishing",
      "El DoS requiere fuerza bruta previa sobre las credenciales",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El temario describe los «ataques de denegación de servicio o DoS/DDoS (saturar un sistema para dejarlo inaccesible, distribuidos desde múltiples orígenes en el caso DDoS)», precisando la distribución desde múltiples orígenes como rasgo propio del DDoS. Las demás opciones no se corresponden con esa distinción.",
    mnemotecnia:
      "La primera 'D' de DDoS es de Distribuido: muchos orígenes atacando a la vez.",
    dificultad: 2,
  },
  {
    enunciado:
      "La Estrategia Nacional de Ciberseguridad se coordina, según el temario, con el CCN-CERT y con el INCIBE. ¿Cómo se reparten sus respectivos ámbitos?",
    opciones: [
      "El CCN-CERT para el ámbito público y el INCIBE para el privado y la ciudadanía",
      "El CCN-CERT para el ámbito privado y el INCIBE para el sector público",
      "Ambos organismos cubren exclusivamente las infraestructuras críticas",
      "El INCIBE sustituye al Esquema Nacional de Seguridad en la Administración",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto precisa que la coordinación se realiza «con el CCN-CERT (Centro Criptológico Nacional) para el ámbito público y el INCIBE para el privado y la ciudadanía». Las demás opciones invierten o distorsionan ese reparto de ámbitos.",
    mnemotecnia:
      "CCN-CERT cuida lo público, INCIBE cuida a empresas privadas y ciudadanos.",
    dificultad: 2,
  },
  {
    enunciado:
      "De acuerdo con el temario, la gestión de vulnerabilidades es un proceso continuo que incluye identificar los activos de la organización, analizarlos periódicamente y:",
    opciones: [
      "Priorizar su corrección según la gravedad y la exposición real del sistema afectado, y aplicar los parches correspondientes",
      "Sustituir de inmediato todos los sistemas afectados por otros nuevos",
      "Delegar la corrección exclusivamente en el fabricante del software",
      "Esperar a que se produzca un incidente antes de intervenir",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El temario describe ese proceso continuo como «identificar los activos... analizarlos periódicamente... priorizar su corrección según la gravedad y la exposición real... y aplicar los parches o actualizaciones». Las demás opciones no reflejan ese proceso ni el énfasis del texto en la ventana de exposición mientras un sistema no se actualiza.",
    mnemotecnia:
      "Cuatro pasos: identificar, analizar, priorizar y parchear — nunca esperar al incidente.",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el temario, ¿qué protege el protocolo TLS, el que da la 'S' a HTTPS?",
    opciones: [
      "Las comunicaciones entre un navegador y un servidor web frente a la escucha pasiva en redes intermedias",
      "El tráfico interno de una VPN frente a otros usuarios de la misma red privada",
      "Los certificados digitales frente a la revocación por parte de la autoridad emisora",
      "Los sistemas frente a los ataques de fuerza bruta sobre credenciales",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto explica que TLS «cifra las comunicaciones entre un navegador y un servidor web, protegiendo los datos frente a la escucha pasiva en redes intermedias». La protección de la VPN, la revocación de certificados y la fuerza bruta son cuestiones distintas tratadas en otros pasajes del temario.",
    mnemotecnia:
      "La 'S' de HTTPS es de Seguro gracias a TLS, cifrando lo que viaja entre navegador y servidor.",
    dificultad: 1,
  },
  {
    enunciado:
      "Un plan de respuesta a incidentes de seguridad, conforme al temario, define las fases de detección, contención, erradicación, recuperación y:",
    opciones: [
      "Lecciones aprendidas",
      "Sellado de tiempo",
      "Clasificación de activos",
      "Auditoría del Reglamento europeo de IA",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El temario enumera exactamente esas cinco fases, cerrando con «lecciones aprendidas (analizar lo ocurrido para reforzar las defensas)». Las demás opciones son conceptos de otros temas (firma electrónica, inteligencia artificial) que no forman parte de este plan de respuesta.",
    mnemotecnia:
      "DCERL: Detección, Contención, Erradicación, Recuperación, Lecciones aprendidas.",
    dificultad: 2,
  },
];

export const GSI_TEMA8_PREGUNTAS = [
  {
    enunciado:
      "Según el temario, dentro de la inteligencia artificial, el machine learning se caracteriza por:",
    opciones: [
      "Aprender patrones a partir de datos, en lugar de seguir reglas programadas explícitamente",
      "Codificar el conocimiento de una persona experta mediante reglas fijas",
      "Combinar IA con actuadores físicos para interactuar con el entorno",
      "Generar únicamente texto en lenguaje natural",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto define el machine learning como el conjunto de «algoritmos que aprenden patrones a partir de datos en lugar de seguir reglas programadas explícitamente». Codificar conocimiento experto mediante reglas corresponde a los sistemas expertos, combinar IA con actuadores es robótica, y la generación de texto es una aplicación del NLP, no la definición del machine learning.",
    mnemotecnia:
      "Machine learning aprende DE LOS DATOS, no de reglas escritas a mano.",
    dificultad: 1,
  },
  {
    enunciado:
      "El deep learning, tal como lo describe el temario, es un tipo de machine learning basado en:",
    opciones: [
      "Redes neuronales con múltiples capas",
      "Reglas expertas codificadas manualmente",
      "Agentes que perciben su entorno y actúan de forma autónoma",
      "Sistemas de visión artificial exclusivamente",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El temario define el deep learning como «un tipo de machine learning basado en redes neuronales con múltiples capas, especialmente eficaz en tareas como el reconocimiento de imágenes o el procesamiento de lenguaje». Las demás opciones describen otros conceptos —sistemas expertos, agentes inteligentes, visión artificial— tratados aparte.",
    mnemotecnia:
      "Deep = profundo = muchas CAPAS de red neuronal apiladas.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿Qué campo de aplicación de la IA permite a los sistemas entender y generar texto humano, según el temario?",
    opciones: [
      "El NLP o procesamiento de lenguaje natural",
      "La visión artificial",
      "Los sistemas expertos",
      "La robótica",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto atribuye esa capacidad al NLP: «permite a los sistemas entender y generar texto humano (traducción automática, asistentes conversacionales, resumen de documentos)». La visión artificial trabaja con imágenes y vídeo, los sistemas expertos codifican reglas de un dominio, y la robótica combina IA con actuadores físicos.",
    mnemotecnia:
      "NLP = Natural Language Processing = entender y generar TEXTO.",
    dificultad: 1,
  },
  {
    enunciado:
      "Según el temario, los sistemas expertos se definen como aquellos que:",
    opciones: [
      "Codifican el conocimiento de una persona experta en un dominio concreto mediante reglas, para apoyar la toma de decisiones",
      "Interpretan imágenes y vídeo para el reconocimiento facial",
      "Perciben su entorno y actúan sobre él de forma autónoma para lograr un objetivo",
      "Aprenden patrones a partir de datos sin reglas programadas",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto define los sistemas expertos como los que «codifican el conocimiento de una persona experta en un dominio concreto mediante reglas para apoyar la toma de decisiones». Las demás descripciones corresponden a la visión artificial, a los agentes inteligentes y al machine learning respectivamente.",
    mnemotecnia:
      "Sistema experto = reglas de un EXPERTO humano, puestas por escrito para decidir.",
    dificultad: 2,
  },
  {
    enunciado:
      "El Reglamento europeo de IA (Ley de IA), conforme al temario, clasifica los sistemas de IA por nivel de riesgo en las siguientes categorías:",
    opciones: [
      "Inaceptable, alto, limitado y mínimo",
      "Alto, medio y bajo",
      "Crítico, moderado y leve",
      "Prohibido, supervisado y libre",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El temario indica que la Ley de IA «clasifica los sistemas por nivel de riesgo —inaceptable, alto, limitado y mínimo— y establece obligaciones crecientes según ese nivel». Las demás combinaciones de categorías no son las que emplea el texto.",
    mnemotecnia:
      "IALM: Inaceptable, Alto, Limitado, Mínimo — de mayor a menor riesgo.",
    dificultad: 2,
  },
  {
    enunciado:
      "¿Qué uso de la IA pone el temario como ejemplo de riesgo inaceptable, directamente prohibido por el Reglamento europeo de IA?",
    opciones: [
      "La puntuación social generalizada",
      "Los asistentes conversacionales de atención ciudadana",
      "La detección de fraude en procedimientos administrativos",
      "El resumen automático de documentos",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto cita expresamente «la puntuación social generalizada» como ejemplo de uso de riesgo inaceptable, «prohibiendo directamente los usos de riesgo inaceptable». Los demás ejemplos aparecen en el temario como casos de uso ya aplicados en la AGE, no como usos prohibidos.",
    mnemotecnia:
      "Puntuar socialmente a las personas es el ejemplo estrella de riesgo INACEPTABLE, y por tanto prohibido.",
    dificultad: 2,
  },
  {
    enunciado:
      "Entre los riesgos que plantea el uso de IA, el temario menciona los sesgos en los datos de entrenamiento, la falta de transparencia en modelos complejos y:",
    opciones: [
      "El impacto sobre la privacidad y los derechos fundamentales",
      "El aumento del coste energético de los centros de datos",
      "La incompatibilidad con los formatos de firma electrónica",
      "La dependencia de la infraestructura de clave pública",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto enumera esos riesgos y cierra con «el impacto sobre la privacidad y los derechos fundamentales». Las demás opciones no figuran entre los riesgos descritos en este bloque del temario.",
    mnemotecnia:
      "Tres riesgos clave: sesgos, caja negra (falta de transparencia) y privacidad/derechos.",
    dificultad: 2,
  },
  {
    enunciado:
      "Según el temario, el aprendizaje supervisado se caracteriza porque:",
    opciones: [
      "Entrena un modelo con datos ya etiquetados para predecir la etiqueta correcta en datos nuevos",
      "Busca patrones o agrupaciones en datos sin etiquetar",
      "Entrena a un agente mediante prueba y error, recompensando o penalizando acciones",
      "Predice, dado un fragmento de texto, la palabra siguiente más probable",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto define el aprendizaje supervisado como el que «entrena un modelo con datos ya etiquetados... de modo que el sistema aprende a predecir la etiqueta correcta para datos nuevos». Las demás opciones describen, respectivamente, el aprendizaje no supervisado, el aprendizaje por refuerzo y el funcionamiento de los grandes modelos de lenguaje.",
    mnemotecnia:
      "Supervisado = datos con ETIQUETA ya puesta, como un profesor que corrige de antemano.",
    dificultad: 1,
  },
  {
    enunciado:
      "Las llamadas «alucinaciones» de los grandes modelos de lenguaje (LLM), conforme al temario, consisten en:",
    opciones: [
      "Generar información que suena plausible pero es incorrecta o inventada",
      "Perder acceso a los datos de entrenamiento originales",
      "Aplicar sesgos exclusivamente en tareas de visión artificial",
      "Rechazar sistemáticamente responder a preguntas complejas",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El temario describe las alucinaciones como «generar información que suena plausible pero es incorrecta o inventada», y señala que por ello su uso en la Administración exige supervisión y verificación humana del resultado. Las demás opciones no corresponden a esa definición.",
    mnemotecnia:
      "Alucinar = inventar con seguridad: sonar convincente sin ser cierto.",
    dificultad: 1,
  },
  {
    enunciado:
      "En materia de gobernanza y auditoría de sistemas de IA en la Administración Pública, el temario destaca como especialmente relevante:",
    opciones: [
      "Que muchas decisiones automatizadas o semiautomatizadas afectan directamente a derechos de la ciudadanía",
      "Que los sistemas de IA sustituyen por completo la revisión humana en cualquier procedimiento",
      "Que el Reglamento europeo de IA solo se aplica a empresas privadas",
      "Que los datos de entrenamiento nunca necesitan documentarse",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto concluye que estos principios de gobernanza «son especialmente relevantes porque muchas decisiones automatizadas o semiautomatizadas afectan directamente a derechos de la ciudadanía». Las demás opciones contradicen lo expuesto en el temario, que exige documentar los datos y permitir la revisión humana.",
    mnemotecnia:
      "Cuando la IA decide sobre personas, la gobernanza importa más, porque hay derechos en juego.",
    dificultad: 2,
  },
];

export const GSI_TEMA9_PREGUNTAS = [
  {
    enunciado:
      "Según el temario, el diseño de software moderno se apoya en la modularidad, el bajo acoplamiento y:",
    opciones: [
      "La alta cohesión",
      "La alta redundancia",
      "El acoplamiento fuerte",
      "La baja modularidad",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El temario enumera esos tres principios: modularidad, bajo acoplamiento y «alta cohesión (que cada módulo tenga una responsabilidad clara y bien delimitada)». Las demás opciones son opuestas o contradictorias a los principios descritos.",
    mnemotecnia:
      "Módulos independientes (modularidad), poco enredados entre sí (bajo acoplamiento) y con una única responsabilidad clara (alta cohesión).",
    dificultad: 1,
  },
  {
    enunciado:
      "DevOps se define en el temario como una cultura y conjunto de prácticas que integran:",
    opciones: [
      "El desarrollo de software (Dev) y las operaciones de sistemas (Ops)",
      "El diseño de software y las metodologías ágiles",
      "La infraestructura como código y la monitorización",
      "Los contenedores y los microservicios",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El temario define DevOps como la cultura que integra «el desarrollo de software (Dev) y las operaciones de sistemas (Ops), buscando ciclos de entrega más cortos, frecuentes y fiables». Las demás opciones combinan conceptos que el temario trata como piezas relacionadas pero distintas de la propia definición de DevOps.",
    mnemotecnia:
      "DevOps: Dev (desarrollo) + Ops (operaciones), unidos para entregar más rápido y mejor.",
    dificultad: 1,
  },
  {
    enunciado:
      "¿En qué se apoya DevOps para lograr ciclos de entrega más cortos, frecuentes y fiables, según el temario?",
    opciones: [
      "En la automatización de todo el ciclo de vida: integración, pruebas, despliegue y monitorización",
      "En la eliminación total de las pruebas antes de desplegar",
      "En el uso exclusivo de arquitecturas monolíticas",
      "En la sustitución de Git por sistemas de control de versiones centralizados",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto indica que DevOps «se apoya en la automatización de todo el ciclo de vida: integración, pruebas, despliegue y monitorización». Las demás opciones son contrarias a lo descrito en el temario, que precisamente destaca la automatización de las pruebas y favorece arquitecturas de microservicios sobre el monolito.",
    mnemotecnia:
      "DevOps automatiza las cuatro fases: Integrar, Probar, Desplegar, Monitorizar.",
    dificultad: 2,
  },
  {
    enunciado:
      "Git, según el temario, es un sistema de control de versiones distribuido en el que:",
    opciones: [
      "Cada copia local del repositorio contiene el historial completo de cambios",
      "Solo el servidor central conserva el historial completo",
      "No es posible trabajar sin conexión a internet",
      "Las ramas (branches) no pueden fusionarse entre sí",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El temario explica que en Git «cada copia local del repositorio contiene el historial completo de cambios, permitiendo trabajar sin conexión y fusionar el trabajo de varias personas mediante ramas (branches) que después se integran (merge)». Las demás opciones contradicen directamente esa descripción.",
    mnemotecnia:
      "Git es distribuido: cada copia local ya lleva TODO el historial, por eso funciona sin conexión.",
    dificultad: 1,
  },
  {
    enunciado:
      "Según el temario, ¿qué diferencia a la integración continua (CI) del despliegue continuo (CD)?",
    opciones: [
      "La CI automatiza la compilación y las pruebas al subir código nuevo, mientras que la CD automatiza además la publicación de esos cambios en producción",
      "La CD se limita a compilar el código sin ejecutar pruebas",
      "La CI solo se aplica en arquitecturas de microservicios",
      "La CD sustituye por completo a los contenedores",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El temario explica que «la integración continua (CI) automatiza la compilación y las pruebas cada vez que se sube código nuevo... El despliegue continuo (CD) automatiza además la publicación de esos cambios en producción». Las demás opciones no reflejan esa relación entre ambos conceptos.",
    mnemotecnia:
      "CI compila y prueba; CD, además, publica en producción — CD va un paso más allá que CI.",
    dificultad: 2,
  },
  {
    enunciado:
      "Los contenedores (Docker y similares), conforme al temario, se caracterizan por:",
    opciones: [
      "Empaquetar una aplicación con todas sus dependencias en una unidad ligera y portable entre entornos",
      "Sustituir por completo la necesidad de integración continua",
      "Requerir siempre una arquitectura monolítica para funcionar",
      "Almacenar el historial completo de cambios de un repositorio",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto define los contenedores como los que «empaquetan una aplicación con todas sus dependencias en una unidad ligera y portable entre entornos». Las demás opciones no corresponden a esa definición ni a lo que el temario atribuye a Git o a CI/CD.",
    mnemotecnia:
      "Contenedor = maleta ligera con la app y TODO lo que necesita, lista para viajar entre entornos.",
    dificultad: 1,
  },
  {
    enunciado:
      "Frente al enfoque monolítico tradicional, una arquitectura de microservicios, según el temario, facilita escalar y desplegar cada parte por separado, a cambio de:",
    opciones: [
      "Mayor complejidad operativa",
      "Menor portabilidad entre entornos",
      "La desaparición de la integración continua",
      "La eliminación de las dependencias entre módulos",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El temario señala que los microservicios «facilita escalar y desplegar cada parte por separado, a cambio de mayor complejidad operativa». Las demás opciones no son la contrapartida que menciona el texto.",
    mnemotecnia:
      "Microservicios: más fácil escalar por partes, pero más piezas que coordinar (mayor complejidad operativa).",
    dificultad: 2,
  },
  {
    enunciado:
      "La infraestructura como código (IaC), conforme al temario, consiste en:",
    opciones: [
      "Definir y gestionar servidores, redes y demás recursos mediante archivos de configuración versionables, en vez de configurarlos manualmente uno a uno",
      "Sustituir Git por herramientas como Terraform o Ansible",
      "Monitorizar métricas de CPU, memoria y tiempos de respuesta",
      "Organizar el trabajo en sprints de duración fija",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto define la IaC como «definir y gestionar servidores, redes y demás recursos de infraestructura mediante archivos de configuración versionables, en vez de configurarlos manualmente uno a uno», citando Terraform o Ansible como herramientas habituales, no como sustitutos de Git. Monitorizar métricas y organizar sprints son conceptos distintos tratados en otros apartados.",
    mnemotecnia:
      "IaC = la infraestructura se escribe en archivos versionables, como si fuera código.",
    dificultad: 2,
  },
  {
    enunciado:
      "En Scrum, según el temario, el trabajo se organiza en sprints —periodos fijos, habitualmente de dos a cuatro semanas— con:",
    opciones: [
      "Reuniones breves de seguimiento diario, una planificación al inicio de cada sprint y una revisión y retrospectiva al final",
      "Un tablero con columnas y un límite de tareas en curso",
      "Ciclos sin periodos cerrados, a diferencia de Kanban",
      "Una única reunión de planificación para todo el proyecto",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El temario describe Scrum con «reuniones breves de seguimiento diario, una planificación al inicio de cada sprint y una revisión y retrospectiva al final». El tablero con columnas y el límite de tareas en curso son rasgos propios de Kanban, que el propio texto contrasta con Scrum precisamente por no fijar periodos cerrados.",
    mnemotecnia:
      "Scrum: sprint con daily, planning al inicio y review+retro al final.",
    dificultad: 1,
  },
  {
    enunciado:
      "A diferencia de Scrum, Kanban, conforme al temario, se caracteriza por:",
    opciones: [
      "No fijar periodos cerrados y visualizar el flujo de trabajo en un tablero que limita cuántas tareas pueden estar en curso a la vez",
      "Organizar el trabajo en sprints de dos a cuatro semanas",
      "Exigir una reunión diaria de seguimiento obligatoria",
      "Prohibir la visualización del flujo de trabajo en un tablero",
    ],
    respuestaCorrecta: 0,
    justificacionIa:
      "El texto señala que Kanban «no fija periodos cerrados: visualiza el flujo de trabajo en un tablero con columnas... y limita cuántas tareas pueden estar en curso a la vez, para evitar la sobrecarga del equipo y detectar cuellos de botella». Las demás opciones describen rasgos de Scrum, no de Kanban.",
    mnemotecnia:
      "Kanban: tablero + límite de tareas en curso, sin sprints cerrados.",
    dificultad: 1,
  },
];
