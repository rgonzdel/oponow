// Temas del programa oficial que aún no estaban sembrados y que el banco
// oficial ya puede cubrir con preguntas verificadas contra el BOE.
// import-banco-oficial los crea si faltan, con un bloque de contenido que
// recoge el epígrafe literal del programa y el texto literal (BOE) de los
// preceptos que preguntan. El orden es el número del tema en el programa de
// la convocatoria (BOE-A-2025-26262), con la misma numeración que los temas
// ya sembrados: Auxiliar anexo I (bloque II = 17…), Administrativo anexo III
// (bloque II = 12…, III = 16…, IV = 23…, V = 32…, VI = 38…).

import { normalizar, preceptosLegibles } from "../../verificar-flashcards";
import { bancoOficial, NORMAS_OFICIALES } from "./index";

export interface TemaOficial {
  titulo: string;
  /** Epígrafe literal del programa. */
  epigrafe: string;
}

const AUX = "convocatoria BOE-A-2025-26262, anexo I";
const ADM = "convocatoria BOE-A-2025-26262, anexo III";

export const FUENTE_PROGRAMA: Record<string, string> = {
  "auxiliar-administrativo": AUX,
  "administrativo-estado": ADM,
};

export const TEMAS_OFICIALES: Record<string, Record<number, TemaOficial>> = {
  "auxiliar-administrativo": {
    4: { titulo: "Tema 4 · El Poder Judicial", epigrafe: "El Poder Judicial. El Consejo General del Poder Judicial. El Tribunal Supremo. La organización judicial española." },
    5: { titulo: "Tema 5 · El Gobierno y la Administración", epigrafe: "El Gobierno y la Administración. El Presidente del Gobierno. El Consejo de Ministros. Designación, causas de cese y responsabilidad del Gobierno." },
    7: { titulo: "Tema 7 · La Ley 19/2013, de transparencia", epigrafe: "La Ley 19/2013, de 9 de diciembre, de transparencia, acceso a la información pública y buen gobierno." },
    9: { titulo: "Tema 9 · La Organización territorial del Estado", epigrafe: "La Organización territorial del Estado. Las Comunidades Autónomas: Constitución y distribución de competencias entre el Estado y las Comunidades Autónomas. La Administración local: entidades que la integran. La provincia, el municipio y la isla." },
    10: { titulo: "Tema 10 · La organización de la Unión Europea", epigrafe: "La organización de la Unión Europea. El Consejo Europeo, el Consejo, el Parlamento Europeo, la Comisión Europea y el Tribunal de Justicia de la Unión Europea." },
    12: { titulo: "Tema 12 · La protección de datos personales", epigrafe: "La protección de datos personales y su régimen jurídico: principios, derechos y obligaciones." },
    14: { titulo: "Tema 14 · Derechos y deberes de los funcionarios", epigrafe: "Derechos y deberes de los funcionarios. La carrera administrativa. Promoción interna. El sistema de retribuciones e indemnizaciones. Régimen disciplinario. El régimen de la Seguridad Social de los funcionarios." },
    18: { titulo: "Tema 18 · Los servicios de información administrativa", epigrafe: "Los servicios de información administrativa. Información general y particular al ciudadano. Iniciativas. Reclamaciones. Quejas. Peticiones." },
    19: { titulo: "Tema 19 · Documento, registro y archivo", epigrafe: "Concepto de documento, registro y archivo. Funciones del registro y del archivo. Clases de archivo y criterios de ordenación." },
    20: { titulo: "Tema 20 · Administración electrónica y servicios al ciudadano", epigrafe: "Administración electrónica y servicios al ciudadano. La información administrativa. Análisis de principales páginas web de carácter público. Servicios telemáticos. Oficinas integradas de atención al ciudadano. Ventanilla única empresarial. El Punto de Acceso General de la Administración General del Estado." },
    15: { titulo: "Tema 15 · El presupuesto del Estado en España", epigrafe: "El presupuesto del Estado en España. Contenido, elaboración y estructura. Fases del ciclo presupuestario." },
    16: { titulo: "Tema 16 · Políticas de igualdad", epigrafe: "Políticas de igualdad y contra la violencia de género. Políticas de igualdad de trato y no discriminación de las personas LGTBI. Discapacidad y dependencia: régimen jurídico." },
  },
  "administrativo-estado": {
    2: { titulo: "Tema 2 · La Jefatura del Estado. La Corona", epigrafe: "La Jefatura del Estado. La Corona: funciones constitucionales del Rey. Sucesión y regencia." },
    4: { titulo: "Tema 4 · El Poder Judicial", epigrafe: "El Poder Judicial. El Consejo General del Poder Judicial. El Tribunal Supremo. La organización judicial española." },
    5: { titulo: "Tema 5 · El Gobierno y la Administración", epigrafe: "El Gobierno y la Administración. El Presidente del Gobierno. El Consejo de Ministros. Designación, causas de cese y responsabilidad del Gobierno. Las funciones del Gobierno. Relaciones entre el Gobierno y las Cortes Generales." },
    7: { titulo: "Tema 7 · La Ley 19/2013, de transparencia", epigrafe: "La Ley 19/2013, de 9 de diciembre, de transparencia, acceso a la información pública y buen gobierno." },
    8: { titulo: "Tema 8 · La Administración General del Estado", epigrafe: "La Administración General del Estado. Órganos centrales. Órganos superiores y directivos. Órganos territoriales. La Administración del Estado en el Exterior." },
    9: { titulo: "Tema 9 · Las Comunidades Autónomas", epigrafe: "La Organización territorial del Estado: las Comunidades Autónomas. Constitución y distribución de competencias entre el Estado y las Comunidades Autónomas. Estatutos de Autonomía." },
    10: { titulo: "Tema 10 · La Administración local", epigrafe: "La Administración local: entidades que la integran. La provincia, el municipio y la isla." },
    11: { titulo: "Tema 11 · La organización de la Unión Europea", epigrafe: "La organización de la Unión Europea. El Consejo Europeo, el Consejo, el Parlamento Europeo, la Comisión Europea y el Tribunal de Justicia de la Unión Europea. Efectos de la integración europea sobre la organización del Estado español." },
    12: { titulo: "Tema 12 · Atención al público", epigrafe: "Atención al público. Atención de personas con discapacidad. Los servicios de información administrativa. Información general y particular al ciudadano. Iniciativas. Reclamaciones. Quejas. Peticiones." },
    17: { titulo: "Tema 17 · El acto administrativo", epigrafe: "El acto administrativo: concepto, clases y elementos. Eficacia y validez de los actos administrativos. Su motivación y notificación." },
    13: { titulo: "Tema 13 · Documento, registro y archivo", epigrafe: "Concepto de documento, registro y archivo. Funciones del registro y del archivo. Clases de archivo y criterios de ordenación." },
    14: { titulo: "Tema 14 · Administración electrónica y servicios al ciudadano", epigrafe: "Administración electrónica y servicios al ciudadano. Análisis de principales páginas web de carácter público. Servicios telemáticos. Oficinas integradas de atención al ciudadano. Ventanilla única empresarial. El Punto de Acceso General de la Administración General del Estado." },
    15: { titulo: "Tema 15 · La protección de datos personales", epigrafe: "La protección de datos personales y su régimen Jurídico: principios, derechos, responsable y encargado del tratamiento, delegado y autoridades de protección de datos. Derechos digitales." },
    20: { titulo: "Tema 20 · Procedimientos y formas de la actividad administrativa", epigrafe: "Procedimientos y formas de la actividad administrativa. La actividad de limitación, arbitral, de servicio público y de fomento. Formas de gestión de los servicios públicos." },
    21: { titulo: "Tema 21 · La responsabilidad patrimonial de las Administraciones públicas", epigrafe: "La responsabilidad patrimonial de las Administraciones públicas. Concepto y clases. Requisitos generales. Efectos." },
    22: { titulo: "Tema 22 · Políticas de igualdad", epigrafe: "Políticas de igualdad y contra la violencia de género. Políticas de igualdad de trato y no discriminación de las personas LGTBI. Discapacidad y dependencia: régimen jurídico." },
    24: { titulo: "Tema 24 · Selección de personal", epigrafe: "Selección de personal. Los procesos selectivos en la Administración pública y su conexión con la Oferta de Empleo Público. Principios constitucionales. Acceso al empleo público y provisión de puestos de trabajo de las personas con discapacidad." },
    25: { titulo: "Tema 25 · Funcionarios de carrera y funcionarios interinos", epigrafe: "El personal funcionario al servicio de las Administraciones públicas: funcionarios de carrera y funcionarios interinos. La selección de los funcionarios." },
    26: { titulo: "Tema 26 · Adquisición y pérdida de la condición de funcionario. Situaciones administrativas", epigrafe: "Adquisición y pérdida de la condición de funcionario. Situaciones administrativas de los funcionarios. Supuestos y efectos de cada una de ellas." },
    27: { titulo: "Tema 27 · Provisión de puestos. Deberes y derechos de los funcionarios", epigrafe: "Provisión de puestos de trabajo en la función pública. Los deberes y derechos de los funcionarios. La carrera administrativa. Promoción interna." },
    28: { titulo: "Tema 28 · Incompatibilidades y régimen disciplinario", epigrafe: "Las incompatibilidades. Régimen disciplinario: faltas, sanciones y procedimiento." },
    29: { titulo: "Tema 29 · La Seguridad Social de los funcionarios. MUFACE y clases pasivas", epigrafe: "El régimen de la Seguridad Social de los funcionarios. La MUFACE y las clases pasivas." },
    30: { titulo: "Tema 30 · El personal laboral al servicio de las Administraciones públicas", epigrafe: "El personal laboral al servicio de las Administraciones públicas. Selección. Derechos, deberes e incompatibilidades. El IV Convenio único para el personal laboral de la Administración General del Estado: ámbito de aplicación y sistema de clasificación." },
    31: { titulo: "Tema 31 · La Seguridad Social del personal laboral", epigrafe: "El régimen de la Seguridad Social del personal laboral. La acción protectora. Tipos y características de las prestaciones." },
    34: { titulo: "Tema 34 · Ejecución del presupuesto de gasto y control", epigrafe: "El procedimiento administrativo de ejecución del presupuesto de gasto. Órganos competentes. Fases del procedimiento y sus documentos contables. Compromisos de gasto para ejercicios posteriores. La ordenación del pago: concepto y competencia. Realización del pago: modos y perceptores. Control del gasto público. Clases. Especial referencia al control de legalidad. El Tribunal de Cuentas." },
    36: { titulo: "Tema 36 · Gastos y pagos. Anticipos de caja fija y pagos a justificar", epigrafe: "Gastos para la compra de bienes y servicios. Gastos de inversión. Gastos de transferencias: corrientes y de capital. Pagos: concepto y tipos. Pagos por obligaciones presupuestarias. Anticipos de caja fija. Pagos «a justificar». Justificación de libramientos." },
    37: { titulo: "Tema 37 · Gestión económica y financiera de contratos y subvenciones", epigrafe: "Gestión económica y financiera de los contratos del sector público. Gestión económica y financiera de subvenciones." },
    35: { titulo: "Tema 35 · Retribuciones e indemnizaciones", epigrafe: "Las retribuciones e indemnizaciones de los funcionarios públicos y del personal laboral al servicio de la Administración pública. Nóminas: estructura y normas de confección. Altas y bajas: su justificación. Retribuciones básicas: sueldos, trienios, pagas extraordinarias. Retribuciones complementarias y otras remuneraciones. Devengo y liquidación de derechos económicos. El pago de las retribuciones del personal en activo. Formas de pago." },
  },
};

/**
 * Bloque de contenido de un tema del programa oficial creado por
 * import-banco-oficial: epígrafe literal del programa y, por norma y en el
 * orden del BOE, el texto vigente completo de cada precepto que preguntan sus
 * preguntas (descargado del BOE consolidado al importar).
 */
export async function bloqueOficial(slug: string, orden: number): Promise<string> {
  const tema = TEMAS_OFICIALES[slug][orden];
  const preguntas = bancoOficial().filter((p) => p.destinos.some(([s, t]) => s === slug && t === orden));
  const porNorma = new Map<string, Set<string>>();
  for (const p of preguntas) porNorma.set(p.norma, (porNorma.get(p.norma) ?? new Set()).add(normalizar(p.art)));
  const partes = [`## Programa oficial\n${tema.epigrafe}\n\n*Epígrafe literal del programa (${FUENTE_PROGRAMA[slug]}).*`];
  for (const [norma, arts] of porNorma) {
    const n = NORMAS_OFICIALES[norma as keyof typeof NORMAS_OFICIALES];
    const nombre = n.nombre.replace(/^(el|la) /, "");
    const textos = await textosDe(n.boeId);
    const preceptos = [...textos].filter(([titulo]) => arts.has(titulo)).map(([titulo, texto]) => `#### ${titulo}\n\n${texto}`);
    const fuente = n.boeId.startsWith("DOUE-")
      ? `Versión consolidada publicada en el DOUE (C 83, 30.3.2010), reproducida en boe.es (${n.boeId.split("#")[0]})`
      : `Texto vigente del BOE consolidado (${n.boeId})`;
    partes.push(`## ${nombre.charAt(0).toUpperCase() + nombre.slice(1)}\n*${fuente}.*\n\n${preceptos.join("\n\n")}`);
  }
  return partes.join("\n\n");
}

const cache = new Map<string, Promise<Map<string, string>>>();
function textosDe(boeId: string) {
  if (!cache.has(boeId)) cache.set(boeId, preceptosLegibles(boeId));
  return cache.get(boeId)!;
}
