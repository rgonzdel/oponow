// Segundo banco de preguntas de TAI (temas 1 a 11 y 16), redactado a partir
// del texto consolidado vigente del BOE. Cada pregunta guarda el artículo y la
// cita literal en la que se apoya, y `clave`: el fragmento de la cita que
// identifica la respuesta correcta. verificar-banco-tai-boe.ts comprueba,
// contra la API de datos abiertos del BOE, que la cita aparece literal en la
// última versión del artículo, que la clave está en la cita y en la opción
// correcta y en ningún distractor, y que no se repiten enunciados.
//
// La opción correcta se coloca rotando la posición (0, 1, 2, 3, 0…) para que
// quede equilibrada; la justificación termina siempre con la cita literal.
import type { PreguntaBancoTai } from "./tai-banco-preguntas";
import { BANCO_BOE_1 } from "./tai-banco-boe-1";
import { BANCO_BOE_2 } from "./tai-banco-boe-2";
import { BANCO_BOE_3 } from "./tai-banco-boe-3";

export const NORMAS_BANCO = {
  CE: { boeId: "BOE-A-1978-31229", nombre: "la Constitución Española", corto: "CE" },
  LOTC: { boeId: "BOE-A-1979-23709", nombre: "la Ley Orgánica 2/1979, del Tribunal Constitucional", corto: "LOTC" },
  LOEAES: { boeId: "BOE-A-1981-12774", nombre: "la Ley Orgánica 4/1981, de los estados de alarma, excepción y sitio", corto: "LO 4/1981" },
  LBRL: { boeId: "BOE-A-1985-5392", nombre: "la Ley 7/1985, reguladora de las Bases del Régimen Local", corto: "LBRL" },
  LOPJ: { boeId: "BOE-A-1985-12666", nombre: "la Ley Orgánica 6/1985, del Poder Judicial", corto: "LOPJ" },
  LG: { boeId: "BOE-A-1997-25336", nombre: "la Ley 50/1997, del Gobierno", corto: "Ley 50/1997" },
  LGP: { boeId: "BOE-A-2003-21614", nombre: "la Ley 47/2003, General Presupuestaria", corto: "LGP" },
  LPAC: { boeId: "BOE-A-2015-10565", nombre: "la Ley 39/2015, del Procedimiento Administrativo Común", corto: "Ley 39/2015" },
  LRJSP: { boeId: "BOE-A-2015-10566", nombre: "la Ley 40/2015, de Régimen Jurídico del Sector Público", corto: "Ley 40/2015" },
  LOPDGDD: { boeId: "BOE-A-2018-16673", nombre: "la Ley Orgánica 3/2018, de Protección de Datos Personales", corto: "LOPDGDD" },
  ENS: { boeId: "BOE-A-2022-7191", nombre: "el Real Decreto 311/2022, del Esquema Nacional de Seguridad", corto: "RD 311/2022" },
} as const;

export type NormaBanco = keyof typeof NORMAS_BANCO;

export interface PreguntaBoe {
  id: string;
  tema: number;
  norma: NormaBanco;
  /** Título exacto del precepto en el BOE ("Artículo 9", "Artículo cuarto"). */
  art: string;
  /** Fragmento literal del texto vigente del artículo. */
  cita: string;
  /** Parte de la cita que está en la opción correcta y en ningún distractor. */
  clave: string;
  e: string;
  ok: string;
  mal: [string, string, string];
  /** Explicación previa a la cita (opcional). */
  j?: string;
  m?: string;
  d: 1 | 2 | 3;
}

export const TAI_BANCO_BOE: PreguntaBoe[] = [...BANCO_BOE_1, ...BANCO_BOE_2, ...BANCO_BOE_3];

export function aPreguntaBancoTai(p: PreguntaBoe, indice: number): PreguntaBancoTai {
  const posicion = indice % 4;
  const opciones = [...p.mal];
  opciones.splice(posicion, 0, p.ok);
  const norma = NORMAS_BANCO[p.norma];
  const articulo = p.art.charAt(0).toLowerCase() + p.art.slice(1);
  return {
    id: p.id,
    temaOrden: p.tema,
    fuente: `${norma.corto} ${articulo} (${norma.boeId})`,
    enunciado: p.e,
    opciones,
    respuestaCorrecta: posicion,
    justificacionIa: `${p.j ? p.j + " " : ""}El ${articulo} de ${norma.nombre} dispone: «${p.cita.replace(/\.$/, "")}».`,
    mnemotecnia: p.m ?? "",
    dificultad: p.d,
  };
}

export const TAI_BANCO_BOE_PREGUNTAS: PreguntaBancoTai[] = TAI_BANCO_BOE.map(aPreguntaBancoTai);
