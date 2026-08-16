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
    disponible: false,
    resumen: "",
    descripcion: "",
    requisitos: "",
    estructuraExamen: [],
    bloques: [],
    plazasInfo: "",
    sueldoInfo: "",
    aniosExamenes: [],
    totalPreguntas: 0,
  },
  {
    slug: "gestion-sistemas-informacion",
    nombre: "Gestión de Sistemas e Informática",
    siglas: "GSI",
    organismo: "Administración General del Estado",
    grupo: "B",
    disponible: false,
    resumen: "",
    descripcion: "",
    requisitos: "",
    estructuraExamen: [],
    bloques: [],
    plazasInfo: "",
    sueldoInfo: "",
    aniosExamenes: [],
    totalPreguntas: 0,
  },
  {
    slug: "administrativo-estado",
    nombre: "Administrativo del Estado",
    siglas: "C1-ADM",
    organismo: "Administración General del Estado",
    grupo: "C1",
    disponible: false,
    resumen: "",
    descripcion: "",
    requisitos: "",
    estructuraExamen: [],
    bloques: [],
    plazasInfo: "",
    sueldoInfo: "",
    aniosExamenes: [],
    totalPreguntas: 0,
  },
];
