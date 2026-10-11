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

import { TAI3_CORTES } from "./tai3-cortes";
import { TAI3_GOBIERNO } from "./tai3-gobierno";
import { TAI3_JUSTICIA } from "./tai3-justicia";
import { TAI3_TERRITORIAL } from "./tai3-territorial";
import { TAI3_HACIENDA } from "./tai3-hacienda";
import { CORREOS3 } from "./correos3";
import { ACTOS } from "./actos";
import { RESPONSABILIDAD } from "./responsabilidad";
import { TREBEP2 } from "./trebep2";
import { OFICINAS } from "./oficinas";

export const POOLS: PreguntaOficial[] = [...LPAC, ...DEFENSOR, ...AGE, ...TREBEP, ...ATENCION_CIUDADANO, ...FUENTES, ...PRESUPUESTO, ...LCSP, ...FIRMA, ...CIBER, ...DATOS, ...POSTAL, ...PRL, ...POSTAL2, ...TAI3_CORTES, ...TAI3_GOBIERNO, ...TAI3_JUSTICIA, ...TAI3_TERRITORIAL, ...TAI3_HACIENDA, ...CORREOS3, ...ACTOS, ...RESPONSABILIDAD, ...TREBEP2, ...OFICINAS];
