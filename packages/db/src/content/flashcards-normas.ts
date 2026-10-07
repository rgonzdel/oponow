// Normas de las que salen las flashcards y temas a los que se asocian.
// Cada tarjeta guarda una cita LITERAL del texto consolidado del BOE; el
// script verificar-flashcards.ts comprueba, contra el BOE descargado, que
// cada cita aparece tal cual en el artículo indicado antes de importarlas.

export interface Norma {
  boeId: string;
  nombre: string;
  /** Forma corta para la referencia de la tarjeta ("CE, art. 1.1"). */
  corta: string;
}

export const NORMAS = {
  ce: { boeId: "BOE-A-1978-31229", nombre: "Constitución Española", corta: "CE" },
  lotc: { boeId: "BOE-A-1979-23709", nombre: "Ley Orgánica 2/1979, del Tribunal Constitucional", corta: "LOTC" },
  lodp: { boeId: "BOE-A-1981-10325", nombre: "Ley Orgánica 3/1981, del Defensor del Pueblo", corta: "LO 3/1981" },
  gobierno: { boeId: "BOE-A-1997-25336", nombre: "Ley 50/1997, del Gobierno", corta: "Ley 50/1997" },
  l39: { boeId: "BOE-A-2015-10565", nombre: "Ley 39/2015, del Procedimiento Administrativo Común", corta: "Ley 39/2015" },
  l40: { boeId: "BOE-A-2015-10566", nombre: "Ley 40/2015, de Régimen Jurídico del Sector Público", corta: "Ley 40/2015" },
  trebep: { boeId: "BOE-A-2015-11719", nombre: "Texto refundido del Estatuto Básico del Empleado Público (RDLeg. 5/2015)", corta: "TREBEP" },
  lcsp: { boeId: "BOE-A-2017-12902", nombre: "Ley 9/2017, de Contratos del Sector Público", corta: "LCSP" },
  lgp: { boeId: "BOE-A-2003-21614", nombre: "Ley 47/2003, General Presupuestaria", corta: "LGP" },
  postal: { boeId: "BOE-A-2010-20139", nombre: "Ley 43/2010, del servicio postal universal", corta: "Ley 43/2010" },
  lopdgdd: { boeId: "BOE-A-2018-16673", nombre: "Ley Orgánica 3/2018, de Protección de Datos Personales", corta: "LOPDGDD" },
  lprl: { boeId: "BOE-A-1995-24292", nombre: "Ley 31/1995, de Prevención de Riesgos Laborales", corta: "LPRL" },
  confianza: { boeId: "BOE-A-2020-14046", nombre: "Ley 6/2020, de servicios electrónicos de confianza", corta: "Ley 6/2020" },
  ens: { boeId: "BOE-A-2022-7191", nombre: "Real Decreto 311/2022, Esquema Nacional de Seguridad", corta: "ENS" },
} satisfies Record<string, Norma>;

export type ClaveNorma = keyof typeof NORMAS;

type Tema = readonly [slug: string, orden: number];

// Temas (por slug de oposición + número de tema) de cada bloque de materia.
// Una tarjeta puede pertenecer a varios: la misma pregunta sirve a todas las
// oposiciones que estudian ese contenido.
export const GRUPOS = {
  ce: [["tai", 1], ["auxiliar-administrativo", 1], ["administrativo-estado", 1]],
  principios: [["tai", 2]],
  corona: [["tai", 3]],
  cortes: [["tai", 4], ["auxiliar-administrativo", 3], ["administrativo-estado", 3]],
  gobierno: [["tai", 5]],
  relaciones: [["tai", 6]],
  judicial: [["tai", 7]],
  economia: [["tai", 8]],
  territorial: [["tai", 9]],
  tc: [["tai", 10], ["auxiliar-administrativo", 2]],
  reforma: [["tai", 11]],
  defensor: [["auxiliar-administrativo", 3]],
  age: [["auxiliar-administrativo", 8]],
  procedimiento: [["auxiliar-administrativo", 11], ["administrativo-estado", 18]],
  fuentes: [["administrativo-estado", 16]],
  contratos: [["administrativo-estado", 19], ["gestion-sistemas-informacion", 1]],
  personal: [["administrativo-estado", 23], ["auxiliar-administrativo", 13]],
  presupuesto: [["administrativo-estado", 33]],
  postal: [["correos", 10]],
  productosPostales: [["correos", 1]],
  datos: [["correos", 10]],
  prl: [["correos", 11]],
  firma: [["gestion-sistemas-informacion", 4]],
  ciberseguridad: [["gestion-sistemas-informacion", 5], ["tai", 16]],
} satisfies Record<string, readonly Tema[]>;

export type Grupo = keyof typeof GRUPOS;

export interface FlashcardSeed {
  /** Identificador estable: permite reimportar sin duplicar. */
  clave: string;
  norma: ClaveNorma;
  /** Título exacto del precepto en el BOE ("Artículo 1", "Artículo primero"). */
  articulo: string;
  /** Lo que se muestra en la referencia: "1.3", "99.3"… */
  apartado: string;
  anverso: string;
  reverso: string;
  /** Fragmento literal del artículo que respalda la respuesta. */
  cita: string;
  grupos: Grupo[];
}
