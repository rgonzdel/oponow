export interface BloqueTemario {
  numero: string;
  nombre: string;
  temas: number;
}

export interface Oposicion {
  slug: string;
  nombre: string;
  siglas: string;
  organismo: string;
  grupo: string;
  disponible: boolean;
  resumen: string;
  descripcion: string;
  requisitos: string;
  estructuraExamen: string[];
  bloques: BloqueTemario[];
  plazasInfo: string;
  sueldoInfo: string;
  /** Si hay dataset para /oposiciones/:slug/simulacro (ver SimulacroPage). */
  simulacroDisponible?: boolean;
  /** Convocatorias cuyos exámenes reales están en el banco de preguntas. */
  aniosExamenes: number[];
  totalPreguntas: number;
}

export const OPOSICIONES: Oposicion[] = [
  {
    slug: "tai",
    nombre: "Técnico Auxiliar de Informática",
    siglas: "TAI",
    organismo: "Administración General del Estado",
    grupo: "C1",
    disponible: true,
    resumen:
      "Soporte técnico y operación de sistemas dentro de la AGE: mantenimiento de hardware, apoyo a usuarios y administración de sistemas, bases de datos y redes.",
    descripcion:
      "Cuerpo general interministerial de la Administración General del Estado. Sus funciones cubren el análisis y programación de aplicaciones, el apoyo a personas usuarias, el mantenimiento de hardware, la instalación de equipos y sistemas, la operación en centros de datos y el apoyo auxiliar en la gestión de sistemas, redes y seguridad.",
    requisitos:
      "Bachillerato, Técnico (FP de Grado Medio) o equivalente. También válida la prueba de acceso a la universidad para mayores de 25 años.",
    estructuraExamen: [
      "Ejercicio único de 120 minutos, sin fase de concurso (oposición pura).",
      "Primera parte: cuestionario tipo test de 80 preguntas (+5 de reserva) sobre los 4 bloques del temario.",
      "Segunda parte: un supuesto práctico a elegir entre dos propuestos —uno del Bloque III y otro del Bloque IV—, con 20 preguntas (+5 de reserva).",
      "Cada error resta un tercio de un acierto; las preguntas en blanco no penalizan.",
      "Tras superar el ejercicio, curso selectivo organizado por el INAP antes del nombramiento como funcionario de carrera.",
    ],
    bloques: [
      { numero: "I", nombre: "Organización del Estado y Administración Electrónica", temas: 9 },
      { numero: "II", nombre: "Tecnología Básica", temas: 5 },
      { numero: "III", nombre: "Desarrollo de Sistemas", temas: 9 },
      { numero: "IV", nombre: "Sistemas y Comunicaciones", temas: 10 },
    ],
    plazasInfo:
      "Varía por convocatoria: habitualmente varios cientos de plazas al año, superando el millar en las últimas ofertas de empleo público. Cifra orientativa — consulta siempre el BOE de la convocatoria vigente.",
    sueldoInfo:
      "Sueldo base de Grupo C1 fijado cada año en la Ley de Presupuestos Generales del Estado, más complemento de destino y específico según el puesto. Orientativo: 20.000–27.000 € brutos/año al inicio.",
    simulacroDisponible: true,
    aniosExamenes: [2019, 2022, 2024],
    totalPreguntas: 405,
  },
  {
    slug: "auxiliar-administrativo",
    nombre: "Auxiliar Administrativo del Estado",
    siglas: "AAE",
    organismo: "Administración General del Estado",
    grupo: "C2",
    disponible: true,
    resumen:
      "Atención al público, registro y archivo, y ofimática básica en cualquier unidad de la Administración General del Estado.",
    descripcion:
      "Cuerpo general de la Administración General del Estado. Sus funciones cubren la atención al público y a personas usuarias, el registro y archivo de documentos, el apoyo administrativo a la tramitación de expedientes y el manejo de las herramientas ofimáticas habituales en cualquier oficina pública.",
    requisitos:
      "Título de Graduado en Educación Secundaria Obligatoria (ESO), Graduado Escolar, Técnico (FP de Grado Medio) o equivalente.",
    estructuraExamen: [
      "Temario en dos bloques: Organización Pública (16 temas) y Actividad Administrativa y Ofimática (12 temas).",
      "Programa fijado en el Anexo I de la convocatoria (BOE-A-2025-26262), de acceso libre al Cuerpo.",
      "Consulta siempre el BOE de la convocatoria vigente para la estructura exacta del ejercicio (número de preguntas, duración y criterios de corrección pueden variar entre convocatorias).",
    ],
    bloques: [
      { numero: "I", nombre: "Organización Pública", temas: 16 },
      { numero: "II", nombre: "Actividad Administrativa y Ofimática", temas: 12 },
    ],
    plazasInfo:
      "Una de las ofertas de empleo público con más plazas cada año dentro de la AGE. Cifra orientativa — consulta siempre el BOE de la convocatoria vigente.",
    sueldoInfo:
      "Sueldo base de Grupo C2 fijado cada año en la Ley de Presupuestos Generales del Estado, más complemento de destino y específico según el puesto. Orientativo: 16.000–20.000 € brutos/año al inicio.",
    aniosExamenes: [],
    totalPreguntas: 0,
  },
  {
    slug: "gestion-sistemas-informacion",
    nombre: "Gestión de Sistemas e Informática",
    siglas: "GSI",
    organismo: "Administración General del Estado",
    grupo: "B",
    disponible: true,
    resumen:
      "Administración de sistemas, ciberseguridad y gestión de proyectos TIC en la Administración General del Estado, un escalón por encima de TAI.",
    descripcion:
      "Cuerpo técnico de la Administración General del Estado especializado en tecnologías de la información. Sus funciones cubren la administración de sistemas y redes, la ciberseguridad, la contratación de servicios TIC, la gestión de proyectos y la aplicación de nuevas tecnologías (nube, inteligencia artificial) a los servicios públicos.",
    requisitos:
      "Título universitario de Grado, o Diplomado/Ingeniero Técnico, o equivalente.",
    estructuraExamen: [
      "Programa de 10 temas específicos fijado en el Anexo III de la convocatoria (BOE-A-2025-26906).",
      "Sistema de concurso-oposición: fase de oposición con ejercicio(s) sobre el programa, más valoración de méritos.",
      "Consulta siempre el BOE de la convocatoria vigente para la estructura exacta del ejercicio.",
    ],
    bloques: [{ numero: "único", nombre: "Materias específicas", temas: 10 }],
    plazasInfo:
      "Convocatorias más reducidas que TAI o Auxiliar Administrativo, dentro de la oferta anual de empleo TIC de la AGE. Cifra orientativa — consulta siempre el BOE de la convocatoria vigente.",
    sueldoInfo:
      "Sueldo base de Grupo B fijado cada año en la Ley de Presupuestos Generales del Estado, más complemento de destino y específico según el puesto. Orientativo: 24.000–32.000 € brutos/año al inicio.",
    aniosExamenes: [],
    totalPreguntas: 0,
  },
  {
    slug: "administrativo-estado",
    nombre: "Administrativo del Estado",
    siglas: "C1-ADM",
    organismo: "Administración General del Estado",
    grupo: "C1",
    disponible: true,
    resumen:
      "Gestión administrativa, de personal y financiera con más responsabilidad y autonomía que el Auxiliar Administrativo.",
    descripcion:
      "Cuerpo general de la Administración General del Estado, un escalón por encima del Auxiliar Administrativo. Sus funciones cubren la tramitación y resolución de expedientes con mayor autonomía, la gestión de personal, la gestión financiera y presupuestaria básica, y el uso avanzado de herramientas ofimáticas.",
    requisitos:
      "Título de Bachiller, Técnico (FP de Grado Medio) o equivalente.",
    estructuraExamen: [
      "Temario en seis bloques (45 temas): Organización del Estado y de la Administración pública, Organización de oficinas públicas, Derecho administrativo general, Gestión de personal, Gestión financiera, e Informática básica y ofimática.",
      "Programa fijado en el Anexo III de la convocatoria (BOE-A-2025-26262), de acceso libre al Cuerpo.",
      "Consulta siempre el BOE de la convocatoria vigente para la estructura exacta del ejercicio (número de preguntas, duración y criterios de corrección pueden variar entre convocatorias).",
    ],
    bloques: [
      { numero: "I", nombre: "Organización del Estado y de la Administración pública", temas: 11 },
      { numero: "II", nombre: "Organización de oficinas públicas", temas: 4 },
      { numero: "III", nombre: "Derecho administrativo general", temas: 7 },
      { numero: "IV", nombre: "Gestión de personal", temas: 9 },
      { numero: "V", nombre: "Gestión financiera", temas: 6 },
      { numero: "VI", nombre: "Informática básica y ofimática", temas: 8 },
    ],
    plazasInfo:
      "Miles de plazas en las últimas ofertas de empleo público de la AGE. Cifra orientativa — consulta siempre el BOE de la convocatoria vigente.",
    sueldoInfo:
      "Sueldo base de Grupo C1 fijado cada año en la Ley de Presupuestos Generales del Estado, más complemento de destino y específico según el puesto. Orientativo: 20.000–27.000 € brutos/año al inicio.",
    aniosExamenes: [],
    totalPreguntas: 0,
  },
  {
    slug: "correos",
    nombre: "Correos — Reparto y Atención al Cliente",
    siglas: "CORREOS",
    organismo: "Sociedad Estatal Correos y Telégrafos",
    grupo: "Personal laboral",
    disponible: true,
    resumen:
      "Reparto, clasificación y atención al cliente en la Sociedad Estatal Correos y Telégrafos, el operador del servicio postal universal en España.",
    descripcion:
      "Proceso selectivo de la Sociedad Estatal Correos y Telégrafos para personal de reparto, clasificación y atención al cliente. Sus funciones cubren la admisión, clasificación y entrega de correspondencia y paquetería, la atención al público en oficinas y puntos de conveniencia, y el cumplimiento de la normativa postal, de protección de datos y de prevención de riesgos laborales propia del puesto.",
    requisitos:
      "Graduado en Educación Secundaria Obligatoria (ESO), Graduado Escolar o equivalente. Para puestos de reparto motorizado, carné de conducir según convocatoria.",
    estructuraExamen: [
      "Temario en tres bloques (12 temas): Productos y Servicios Postales, Procesos Operativos y Atención al Cliente, y Normativa, Seguridad y PRL.",
      "Estructura no reconstruida de un anexo BOE único (Correos es una sociedad estatal, no un cuerpo de la AGE) sino de fuentes públicas consistentes sobre el proceso selectivo — consulta siempre las bases de la convocatoria vigente para la estructura exacta del ejercicio.",
    ],
    bloques: [
      { numero: "I", nombre: "Productos y Servicios Postales", temas: 4 },
      { numero: "II", nombre: "Procesos Operativos y Atención al Cliente", temas: 5 },
      { numero: "III", nombre: "Normativa, Seguridad y PRL", temas: 3 },
    ],
    plazasInfo:
      "Convocatorias periódicas a lo largo del año, con volumen variable según campaña (refuerzos de Navidad y Black Friday incluidos). Cifra orientativa — consulta siempre la convocatoria vigente.",
    sueldoInfo:
      "Retribución fijada por el convenio colectivo de Correos según el grupo profesional y el puesto. Orientativo: 15.000–19.000 € brutos/año al inicio.",
    aniosExamenes: [],
    totalPreguntas: 0,
  },
];
