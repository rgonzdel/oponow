// Banco oficial común a todas las oposiciones: cada pregunta se redacta una
// vez a partir del texto consolidado vigente del BOE y se asigna a uno o
// varios temas (`destinos`), porque la misma ley entra en el temario de
// varias oposiciones (p. ej. la Ley 39/2015 en Auxiliar y Administrativo).
// Mismo formato y mismas comprobaciones que tai-banco-boe.ts.
import { NORMAS_BANCO, type PreguntaBoe } from "../tai-banco-boe";

export const NORMAS_OFICIALES = {
  ...NORMAS_BANCO,
  CC: { boeId: "BOE-A-1889-4763", nombre: "el Código Civil", corto: "Código Civil" },
  LODP: { boeId: "BOE-A-1981-10325", nombre: "la Ley Orgánica 3/1981, del Defensor del Pueblo", corto: "LO 3/1981" },
  LPRL: { boeId: "BOE-A-1995-24292", nombre: "la Ley 31/1995, de Prevención de Riesgos Laborales", corto: "Ley 31/1995" },
  RD208: { boeId: "BOE-A-1996-4997", nombre: "el Real Decreto 208/1996, de servicios de información administrativa y atención al ciudadano", corto: "RD 208/1996" },
  LPOSTAL: { boeId: "BOE-A-2010-20139", nombre: "la Ley 43/2010, del servicio postal universal", corto: "Ley 43/2010" },
  TREBEP: { boeId: "BOE-A-2015-11719", nombre: "el texto refundido de la Ley del Estatuto Básico del Empleado Público", corto: "TREBEP" },
  LCSP: { boeId: "BOE-A-2017-12902", nombre: "la Ley 9/2017, de Contratos del Sector Público", corto: "LCSP" },
  RDL12: { boeId: "BOE-A-2018-12257", nombre: "el Real Decreto-ley 12/2018, de seguridad de las redes y sistemas de información", corto: "RDL 12/2018" },
  LCONF: { boeId: "BOE-A-2020-14046", nombre: "la Ley 6/2020, de servicios electrónicos de confianza", corto: "Ley 6/2020" },
  RD203: { boeId: "BOE-A-2021-5032", nombre: "el Reglamento de actuación y funcionamiento del sector público por medios electrónicos (RD 203/2021)", corto: "RD 203/2021" },
  RPOSTAL: { boeId: "BOE-A-2024-10010", nombre: "el Reglamento de los servicios postales (RD 437/2024)", corto: "RD 437/2024" },
} as const;

export type NormaOficial = keyof typeof NORMAS_OFICIALES;

/** [slug de la oposición, orden del tema] */
export type Destino = readonly [string, number];

export interface PreguntaOficial extends Omit<PreguntaBoe, "tema" | "norma"> {
  norma: NormaOficial;
  destinos: Destino[];
}
