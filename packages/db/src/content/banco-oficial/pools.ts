// Bloques normativos del banco oficial. Ver index.ts.
import type { PreguntaOficial } from "./tipos";
import { LPAC } from "./lpac";
import { AGE, DEFENSOR } from "./aae";
import { ATENCION_CIUDADANO, TREBEP } from "./personal";
import { FUENTES, PRESUPUESTO } from "./c1";
import { LCSP } from "./lcsp";
import { FIRMA } from "./firma";
import { CIBER } from "./ciber";
import { DATOS } from "./datos";
import { POSTAL } from "./postal";
import { PRL } from "./prl";
import { POSTAL2 } from "./postal2";

export const POOLS: PreguntaOficial[] = [...LPAC, ...DEFENSOR, ...AGE, ...TREBEP, ...ATENCION_CIUDADANO, ...FUENTES, ...PRESUPUESTO, ...LCSP, ...FIRMA, ...CIBER, ...DATOS, ...POSTAL, ...PRL, ...POSTAL2];
