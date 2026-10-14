// Motor de Silvia: decide qué se ha preguntado y compone la respuesta con las
// plantillas, usando solo (1) las fichas verificadas, (2) el catálogo de
// oposiciones y (3) el texto consolidado del BOE que lleva la propia web.
// No hace ninguna petición de red.
import { OPOSICIONES } from "@oponow/shared-types";
import type {
  Bloque,
  ContextoConversacion,
  Ficha,
  FuenteNorma,
  FuenteRespuesta,
  OposicionCatalogo,
  PreceptoCrudo,
  PreguntaGenerada,
  Respuesta,
  ResultadoBusqueda,
  TextoNorma,
} from "../tipos";
import { FICHAS } from "../conocimiento/fichas";
import { OPOSICIONES_CATALOGO } from "../conocimiento/oposiciones";
import {
  claveDeNombre,
  frases,
  mismaClave,
  nombreCorto,
  normalizar,
  corregirTecleo,
  distancia,
  raiz,
  terminos,
  tokenizar,
  urlBoe,
  type ClavePrecepto,
} from "../texto";
import { IndiceBM25 } from "./indice";
import { detectarIntencion, detectarNorma, type FiltrosOposicion, type Matiz } from "./intencion";
import { generarPreguntas } from "./generador-test";
import {
  AVISO_GENERAL,
  introBusqueda,
  plantillaAyuda,
  plantillaGracias,
  plantillaSaludo,
  plantillaSinResultados,
  respuesta,
} from "../plantillas";

interface NormaCargada {
  fuente: FuenteNorma;
  texto: TextoNorma;
  claves: ClavePrecepto[];
}

interface DocPrecepto {
  norma: string;
  i: number;
}

/** Palabras que aparecen en casi cualquier pregunta jurídica y no ayudan a buscar. */
const TERMINOS_VACIOS = new Set(
  ["ley", "articul", "segun", "norma", "normativ", "regul", "establec", "dispon", "deci", "dic", "pued", "deb", "diferencia", "entre", "compar", "distingu", "versus", "vs"].map(raiz),
);

/** Sinónimos frecuentes en las preguntas, por prefijo de la raíz. */
const SINONIMOS: [string, string][] = [
  ["compon", "composi"], ["composi", "composi"], ["compues", "composi"], ["integra", "composi"],
  ["nombr", "nombra"], ["design", "nombra"], ["eleg", "nombra"], ["elig", "nombra"], ["eleccion", "nombra"],
  ["recurri", "recurso"], ["impugn", "recurso"],
];

function terminosConSinonimos(texto: string): string[] {
  return terminos(texto).map((t) => SINONIMOS.find(([p]) => t.startsWith(p))?.[1] ?? t);
}

/** Palabras de las órdenes al asistente: nunca se «corrigen». */
const ORDENES = [
  "hazme", "ponme", "preguntame", "examiname", "practicar", "prueba", "test", "oposicion", "oposiciones", "opositar",
  "opositor", "temario", "requisitos", "siguiente", "anterior", "estructura", "explicame", "hablame", "gracias",
  "buenas", "diferencia", "diferencias", "comparar", "titulacion", "bachillerato", "convocatoria", "dashboard",
  "ayuda", "puedes", "funcionas", "silvia",
];

/** Palabras gramaticales largas que no merece la pena corregir. */
const STOPWORDS_CONSULTA = new Set(["cuales", "cuantos", "cuantas", "cuando", "donde", "porque", "quienes", "tambien", "entonces", "aunque", "sobre", "entre", "desde", "hasta", "segun", "puede", "pueden", "tiene", "tienen", "dice", "explica", "quiero", "saber"]);

/** Normas que sobre todo modifican otras: se rebajan en el ranking para que gane el texto consolidado. */
const PESO_NORMA: Record<string, number> = { loeficiencia: 0.55 };

const RE_PLAZO = /\b(plazo|días|meses|mes|años|año|horas|semanas|prescrib|caduc)/i;

export class Motor {
  private readonly normas = new Map<string, NormaCargada>();
  private readonly indice = new IndiceBM25<DocPrecepto>();
  private readonly indiceFichas = new IndiceBM25<Ficha>();
  private readonly terminosFicha = new Map<string, Set<string>>();

  constructor(
    readonly fuentes: FuenteNorma[],
    /** Garantiza que una norma está cargada (el worker la descarga del bundle si aún no lo está). */
    private readonly asegurarNorma: (clave: string) => Promise<void>,
    private readonly pendientes: () => string[],
  ) {
    for (const f of FICHAS) {
      const variantes = f.variantes.flatMap((v) => terminosConSinonimos(v));
      const t = [...terminosConSinonimos(f.pregunta), ...variantes, ...variantes];
      this.indiceFichas.agregar(f, t);
      this.terminosFicha.set(f.id, new Set(t));
      this.registrarPalabras([f.pregunta, ...f.variantes, f.respuesta].join(" "));
    }
    const propias = [
      ...fuentes.flatMap((f) => f.alias),
      ...OPOSICIONES_CATALOGO.flatMap((o) => [...o.alias, o.nombre]),
      ...ORDENES,
    ];
    for (const frase of propias) {
      for (const t of tokenizar(frase)) {
        if (t.length >= 4 && !/\d/.test(t)) {
          this.vocabularioPropio.add(raiz(t));
          this.anotarForma(raiz(t), t);
        }
      }
    }
  }

  get normasCargadas(): number {
    return this.normas.size;
  }

  get preceptosIndexados(): number {
    return this.indice.tamano;
  }

  agregarNorma(texto: TextoNorma): void {
    const fuente = this.fuentes.find((f) => f.clave === texto.clave);
    if (!fuente || this.normas.has(texto.clave)) return;
    const claves = texto.preceptos.map((p) => claveDeNombre(p.n));
    this.normas.set(texto.clave, { fuente, texto, claves });
    texto.preceptos.forEach((p, i) => {
      const ruta = p.e.map((e) => texto.encabezados[e]).join(" ");
      const t = [
        ...terminos(p.r ?? ""),
        ...terminos(p.r ?? ""),
        ...terminos(p.r ?? ""),
        ...terminos(ruta),
        ...terminos(p.p.join(" ")),
      ];
      this.indice.agregar({ norma: texto.clave, i }, t);
      this.registrarPalabras(`${p.r ?? ""} ${p.p.join(" ")}`);
    });
  }

  // ===================================================================

  /**
   * Punto de entrada: corrige erratas, responde y, si ha tenido que
   * interpretar la pregunta, lo dice al principio de la respuesta para que el
   * opositor vea qué se ha entendido.
   */
  async responder(consulta: string, contexto: ContextoConversacion): Promise<Respuesta> {
    const { texto, cambios } = this.corregirConsulta(consulta);
    const r = await this.responderInterno(texto, contexto);
    const avisos: string[] = [];
    if (cambios.length) {
      avisos.push(`He interpretado ${cambios.map(([de, a]) => `«${de}» como «${a}»`).join(", ")}.`);
    }
    const original = normalizar(consulta);
    const q = corregirTecleo(original);
    const canonica = /\b(articulos?|art\.?|disposicion|da|dt|df|dd)\s*\d/.test(original);
    if (r.intencion === "precepto" && !canonica && !/^\s*(siguiente|anterior)/.test(q) && r.contexto.ultimaNorma && r.contexto.ultimoPrecepto !== undefined) {
      const n = this.normas.get(r.contexto.ultimaNorma)!;
      avisos.push(`Entiendo que preguntas por: ${n.texto.preceptos[r.contexto.ultimoPrecepto].n} — ${n.fuente.nombre}.`);
    } else if (q !== original && !cambios.length) {
      avisos.push(`He leído tu pregunta como «${q.trim()}».`);
    }
    if (avisos.length) r.bloques.unshift({ tipo: "aviso", texto: avisos.join(" ") });
    return r;
  }

  /** Vocabulario reconocido: raíz → palabra completa (para mostrar las correcciones). */
  private readonly formasDeRaiz = new Map<string, Set<string>>();

  private anotarForma(r: string, palabra: string) {
    let formas = this.formasDeRaiz.get(r);
    if (!formas) this.formasDeRaiz.set(r, (formas = new Set()));
    if (formas.size < 12) formas.add(palabra);
  }
  /** Palabras propias de las preguntas (órdenes, nombres de normas y oposiciones) que no hay que «corregir». */
  private readonly vocabularioPropio = new Set<string>();

  private registrarPalabras(texto: string) {
    for (const t of tokenizar(texto)) {
      if (t.length < 4 || /\d/.test(t)) continue;
      this.anotarForma(raiz(t), t);
    }
  }

  /**
   * Corrige palabras que no existen en ninguna norma ni ficha sustituyéndolas
   * por la más parecida del vocabulario (distancia de edición 1, o 2 si la
   * palabra es larga), prefiriendo la más frecuente en la normativa.
   */
  private corregirConsulta(consulta: string): { texto: string; cambios: [string, string][] } {
    const cambios: [string, string][] = [];
    const conocida = (r: string) => this.indice.df(r) > 0 || this.indiceFichas.df(r) > 0 || this.vocabularioPropio.has(r);
    const texto = corregirTecleo(normalizar(consulta)).replace(/[a-zñ]{5,}/g, (palabra) => {
      if (STOPWORDS_CONSULTA.has(palabra)) return palabra;
      const r = raiz(palabra);
      if (conocida(r)) return palabra;
      const max = palabra.length >= 9 ? 2 : 1;
      let mejor: { r: string; d: number; df: number } | null = null;
      const candidatos = [...this.indice.vocabulario(), ...this.indiceFichas.vocabulario(), ...this.vocabularioPropio];
      for (const c of candidatos) {
        if (/\d/.test(c) || Math.abs(c.length - r.length) > max) continue;
        const d = distancia(r, c, max);
        if (d > max) continue;
        const df = this.indice.df(c) + this.indiceFichas.df(c) * 50;
        if (!mejor || d < mejor.d || (d === mejor.d && df > mejor.df)) mejor = { r: c, d, df };
      }
      if (!mejor) return palabra;
      // De las palabras con esa raíz, la más parecida a lo que se escribió
      // («prosesal» → «procesal», no «procesales»).
      const formas = [...(this.formasDeRaiz.get(mejor.r) ?? [mejor.r])];
      const nueva = formas.sort((a, b) => distancia(palabra, a, 9) - distancia(palabra, b, 9) || a.length - b.length)[0];
      if (raiz(nueva) === r) return palabra;
      cambios.push([palabra, nueva]);
      return nueva;
    });
    return { texto, cambios };
  }

  private async responderInterno(consulta: string, contexto: ContextoConversacion): Promise<Respuesta> {
    const intencion = detectarIntencion(consulta, this.fuentes, OPOSICIONES_CATALOGO, contexto);
    switch (intencion.tipo) {
      case "saludo":
        return plantillaSaludo(contexto);
      case "ayuda":
        return plantillaAyuda(contexto, this.normas.size);
      case "gracias":
        return plantillaGracias(contexto);
      case "precepto": {
        const norma = intencion.norma ?? "ce";
        await this.asegurarNorma(norma);
        const i = this.buscarPrecepto(norma, intencion.clave);
        if (i === null) return this.preceptoNoEncontrado(norma, intencion.clave, contexto);
        return this.plantillaPrecepto(norma, i, contexto, intencion.norma === null || intencion.normaSupuesta);
      }
      case "desplazar": {
        const norma = contexto.ultimaNorma!;
        await this.asegurarNorma(norma);
        const n = this.normas.get(norma)!;
        let i = (contexto.ultimoPrecepto ?? 0) + intencion.paso;
        // Salta encabezados sueltos («Sección primera») que el BOE da como precepto.
        while (i >= 0 && i < n.texto.preceptos.length && n.claves[i].tipo === "otro") i += intencion.paso;
        if (i < 0 || i >= n.texto.preceptos.length) {
          return respuesta("desplazar", {
            bloques: [{ tipo: "parrafo", texto: `No hay precepto ${intencion.paso > 0 ? "siguiente" : "anterior"} en ${n.fuente.abreviatura}.` }],
            contexto,
          });
        }
        return this.plantillaPrecepto(norma, i, contexto, false);
      }
      case "norma":
        await this.asegurarNorma(intencion.norma);
        return this.plantillaNorma(intencion.norma, contexto);
      case "oposicion":
        // «¿Quién nombra al Fiscal General?» menciona «fiscal» pero no pregunta
        // por la oposición: si hay una ficha que responde, gana la ficha.
        if (!intencion.explicita) {
          const f = this.mejorFicha(consulta);
          if (f) return this.plantillaFicha(f.ficha, contexto);
        }
        return await this.plantillaOposicion(intencion.id, intencion.aspecto, contexto);
      case "listaOposiciones":
        return this.plantillaLista(intencion.filtros, contexto);
      case "test":
        return this.plantillaTest(consulta, intencion.norma, intencion.clave, contexto);
      case "busqueda":
        if (intencion.norma) await this.asegurarNorma(intencion.norma);
        return this.plantillaBusqueda(consulta, intencion.norma, intencion.matiz, intencion.comparar, contexto);
    }
  }

  // ===================================================================
  // Preceptos

  private buscarPrecepto(norma: string, clave: ClavePrecepto): number | null {
    const n = this.normas.get(norma);
    if (!n) return null;
    const candidatos = n.claves.map((c, i) => (mismaClave(c, clave) ? i : -1)).filter((i) => i >= 0);
    if (!candidatos.length) return null;
    // Duplicados (p. ej. los artículos del Real Decreto que aprueba la
    // LECrim): gana el que está dentro del cuerpo de la norma.
    const enCuerpo = candidatos.filter((i) => n.texto.preceptos[i].e.length > 0);
    return (enCuerpo.length ? enCuerpo : candidatos).at(-1)!;
  }

  private etiqueta(norma: string, i: number): string {
    const n = this.normas.get(norma)!;
    return `${nombreCorto(n.claves[i], n.texto.preceptos[i].n)} ${n.fuente.abreviatura}`;
  }

  private consultaDe(norma: string, i: number): string {
    const n = this.normas.get(norma)!;
    const p = n.texto.preceptos[i];
    return `${p.n} ${n.fuente.abreviatura}`;
  }

  private fuenteDe(norma: string, i?: number): FuenteRespuesta {
    const n = this.normas.get(norma)!;
    if (i === undefined) return { etiqueta: `${n.fuente.nombre} (${n.fuente.id})`, url: urlBoe(n.fuente.id) };
    const p = n.texto.preceptos[i];
    return { etiqueta: `${this.etiqueta(norma, i)} — ${n.fuente.id}`, url: urlBoe(n.fuente.id, p.b) };
  }

  private bloqueCita(norma: string, i: number, parrafos?: string[], resaltar?: string[]): Bloque {
    const n = this.normas.get(norma)!;
    const p = n.texto.preceptos[i];
    return {
      tipo: "cita",
      norma: n.fuente.abreviatura,
      precepto: p.n,
      rubrica: p.r,
      ruta: p.e.map((e) => n.texto.encabezados[e]),
      parrafos: parrafos ?? p.p,
      url: urlBoe(n.fuente.id, p.b),
      resaltar,
    };
  }

  private fichasQueCitan(norma: string, bloque: string): Ficha[] {
    return FICHAS.filter((f) => f.citas.some((c) => c.norma === norma && c.precepto === bloque));
  }

  private plantillaPrecepto(norma: string, i: number, contexto: ContextoConversacion, normaSupuesta: boolean): Respuesta {
    const n = this.normas.get(norma)!;
    const p = n.texto.preceptos[i];
    const bloques: Bloque[] = [];

    if (normaSupuesta && !contexto.ultimaNorma) {
      bloques.push({
        tipo: "aviso",
        texto: `Como no indicas la norma, entiendo que preguntas por la ${n.fuente.nombre}. Si era otra, dímelo así: «${p.n.toLowerCase()} de la Ley 39/2015».`,
      });
    } else if (normaSupuesta) {
      bloques.push({ tipo: "aviso", texto: `Sigo con la norma de antes: ${n.fuente.nombre}.` });
    }

    const vacio = !p.p.length || /^\(?(derogad|suprimid|sin contenido|anulad)/i.test(p.p[0] ?? "");
    bloques.push(this.bloqueCita(norma, i));

    if (vacio) {
      bloques.push({ tipo: "aviso", texto: "Este precepto no tiene contenido vigente (está derogado, suprimido o sin contenido). Comprueba qué artículo regula ahora la materia." });
    } else {
      const datos = datosClave(p.p);
      const enumerados = p.p.filter((t) => /^[a-zñ]\)\s/.test(t));
      const claves: string[] = [];
      if (enumerados.length >= 3) {
        const ultima = enumerados[enumerados.length - 1].slice(0, 1);
        claves.push(`Enumera ${enumerados.length} supuestos en letras (de la a) a la ${ultima})): suelen preguntar cuál NO está en la lista.`);
      }
      claves.push(...datos);
      if (claves.length) bloques.push({ tipo: "claves", titulo: "Datos que suelen caer en el test", items: claves.slice(0, 6) });
    }

    const fichas = this.fichasQueCitan(norma, p.b);
    const trampas = fichas.flatMap((f) => f.trampas ?? []);
    if (trampas.length) bloques.push({ tipo: "claves", titulo: "Ojo con estas trampas", items: [...new Set(trampas)] });

    const sugerencias = [
      `Hazme un test del ${p.n.toLowerCase()} ${n.fuente.abreviatura}`,
      "Siguiente artículo",
      "Artículo anterior",
      ...fichas.map((f) => f.pregunta),
      `Estructura de la ${n.fuente.abreviatura}`,
    ];

    return respuesta("precepto", {
      titulo: `${this.etiqueta(norma, i)}${p.r ? ` · ${p.r.replace(/\.$/, "")}` : ""}`,
      bloques,
      fuentes: [this.fuenteDe(norma, i)],
      sugerencias,
      contexto: { ...contexto, ultimaNorma: norma, ultimoPrecepto: i },
    });
  }

  private preceptoNoEncontrado(norma: string, clave: ClavePrecepto, contexto: ContextoConversacion): Respuesta {
    const n = this.normas.get(norma);
    const nombre = n?.fuente.nombre ?? norma;
    const numeros = n ? n.claves.filter((c) => c.tipo === clave.tipo && c.numero !== null).map((c) => c.numero!) : [];
    const max = numeros.length ? Math.max(...numeros) : null;
    return respuesta("precepto-no-encontrado", {
      titulo: "No encuentro ese precepto",
      bloques: [
        {
          tipo: "parrafo",
          texto: `No hay ${clave.tipo === "art" ? "un artículo" : "una disposición"} ${clave.numero ?? ""}${clave.sufijo && clave.sufijo !== "unico" ? ` ${clave.sufijo}` : ""} en la ${nombre}${max ? ` (la numeración llega hasta el ${max})` : ""}.`,
        },
      ],
      sugerencias: n ? [`Estructura de la ${n.fuente.abreviatura}`, `Artículo 1 de la ${n.fuente.abreviatura}`] : [],
      contexto,
    });
  }

  // ===================================================================
  // Normas

  private plantillaNorma(norma: string, contexto: ContextoConversacion): Respuesta {
    const n = this.normas.get(norma)!;
    const t = n.texto;
    const fecha = t.actualizado ? `${t.actualizado.slice(6, 8)}/${t.actualizado.slice(4, 6)}/${t.actualizado.slice(0, 4)}` : "—";
    const articulos = n.claves.filter((c) => c.tipo === "art").length;
    const estructura = t.encabezados.filter((e) => /^(LIBRO|PARTE|T[IÍ]TULO)\b/i.test(e)).slice(0, 30);
    const primer = n.claves.findIndex((c) => c.tipo === "art");
    return respuesta("norma", {
      titulo: `${n.fuente.nombre} (${n.fuente.abreviatura})`,
      bloques: [
        { tipo: "parrafo", texto: `**${t.tituloOficial}**` },
        {
          tipo: "tabla",
          cabecera: ["Dato", "Valor"],
          filas: [
            ["Identificador BOE", n.fuente.id],
            ["Artículos", String(articulos)],
            ["Preceptos en total (con disposiciones)", String(t.preceptos.length)],
            ["Última actualización consolidada", fecha],
          ],
        },
        estructura.length
          ? { tipo: "lista", titulo: "Estructura", items: estructura }
          : { tipo: "parrafo", texto: "Esta norma no se divide en títulos o libros." },
      ],
      fuentes: [this.fuenteDe(norma)],
      sugerencias: [
        primer >= 0 ? this.consultaDe(norma, primer) : `Artículo 1 de la ${n.fuente.abreviatura}`,
        `Hazme un test de la ${n.fuente.abreviatura}`,
      ],
      contexto: { ...contexto, ultimaNorma: norma, ultimoPrecepto: primer >= 0 ? primer - 1 : undefined },
    });
  }

  // ===================================================================
  // Oposiciones

  private nombreNorma(clave: string): string {
    const f = this.fuentes.find((x) => x.clave === clave);
    return f ? `${f.nombre} (${f.abreviatura})` : clave;
  }

  private async plantillaOposicion(id: string, aspecto: string, contexto: ContextoConversacion): Promise<Respuesta> {
    const o = OPOSICIONES_CATALOGO.find((x) => x.id === id)!;
    for (const c of o.citas) await this.asegurarNorma(c.norma);
    const op = o.slugOponow ? OPOSICIONES.find((x) => x.slug === o.slugOponow) : undefined;
    const marca = (v: boolean) => (v ? "verificado en el BOE" : "orientativo: compruébalo en la convocatoria");
    const bloques: Bloque[] = [
      { tipo: "parrafo", texto: o.descripcion },
      {
        tipo: "tabla",
        cabecera: ["", ""],
        filas: [
          ["Administración", o.administracion],
          ["Grupo", `${o.grupo} (${marca(o.grupoVerificado)})`],
          ["Titulación", `${o.titulacion} (${marca(o.titulacionVerificada)})`],
          ["Ámbito", o.ambito],
        ],
      },
    ];

    const citasPorPrecepto = new Map<string, string[]>();
    for (const c of o.citas) {
      const k = `${c.norma}|${c.precepto}`;
      citasPorPrecepto.set(k, [...(citasPorPrecepto.get(k) ?? []), c.fragmento]);
    }
    for (const [k, fragmentos] of citasPorPrecepto) {
      const [norma, bloque] = k.split("|");
      const n = this.normas.get(norma);
      const i = n?.texto.preceptos.findIndex((p) => p.b === bloque) ?? -1;
      if (n && i >= 0) bloques.push(this.bloqueCita(norma, i, fragmentos.map((f) => `«${f}»`)));
    }

    if (aspecto === "requisitos" || aspecto === "general") {
      bloques.push({
        tipo: "lista",
        titulo: "Requisitos generales de acceso (art. 56 TREBEP)",
        items: [
          "Nacionalidad española (con las excepciones del art. 57 para nacionales de la UE y otros).",
          "Capacidad funcional para el desempeño de las tareas.",
          "Tener cumplidos dieciséis años y no superar la edad de jubilación forzosa (salvo otra edad fijada por ley).",
          "No haber sido separado del servicio ni estar inhabilitado.",
          "La titulación exigida.",
        ],
      });
    }

    if (op && (aspecto === "examen" || aspecto === "general")) {
      bloques.push({ tipo: "lista", titulo: "Estructura del examen (última convocatoria en Oponow)", items: op.estructuraExamen });
    }
    if (aspecto === "temario" || aspecto === "general") {
      bloques.push({ tipo: "lista", titulo: "Bloques habituales del temario (orientativo)", items: o.bloquesTemario });
      bloques.push({ tipo: "lista", titulo: "Normas clave que conozco", items: o.normasClave.map((c) => this.nombreNorma(c)) });
    }
    if (op) bloques.push({ tipo: "enlace", texto: `Ver ${op.siglas} en Oponow: temario y tests`, to: `/oposiciones/${op.slug}` });
    bloques.push({
      tipo: "aviso",
      texto: "Plazas, fechas, temario exacto y estructura cambian con cada convocatoria: consulta siempre las bases publicadas en el BOE o en el boletín autonómico.",
    });

    const otraNorma = o.normasClave.find((c) => c !== "ce" && c !== "trebep") ?? o.normasClave[0];
    return respuesta("oposicion", {
      titulo: o.nombre,
      bloques,
      fuentes: o.citas
        .filter((c) => this.normas.has(c.norma))
        .map((c) => {
          const n = this.normas.get(c.norma)!;
          const i = n.texto.preceptos.findIndex((p) => p.b === c.precepto);
          return this.fuenteDe(c.norma, i);
        }),
      sugerencias: [
        `Temario de ${o.nombre}`,
        `Estructura de la ${this.fuentes.find((f) => f.clave === otraNorma)?.abreviatura ?? ""}`,
        `Hazme un test de la ${this.fuentes.find((f) => f.clave === otraNorma)?.abreviatura ?? ""}`,
        "¿Qué titulación se exige para cada grupo A1, A2, B, C1 y C2?",
      ],
      contexto: { ...contexto, ultimaOposicion: o.id },
    });
  }

  private plantillaLista(filtros: FiltrosOposicion, contexto: ContextoConversacion): Respuesta {
    let lista: OposicionCatalogo[] = OPOSICIONES_CATALOGO;
    // Las autonómicas son 38 entradas casi iguales: solo se listan si se piden.
    if (!filtros.ambitos.includes("Comunidades autónomas")) lista = lista.filter((o) => o.ambito !== "Comunidades autónomas");
    if (filtros.ambitos.length) lista = lista.filter((o) => filtros.ambitos.includes(o.ambito));
    if (filtros.grupos.length) lista = lista.filter((o) => filtros.grupos.some((g) => o.grupo.includes(g)));
    const titulo = [
      "Oposiciones",
      filtros.ambitos.length ? `de ${filtros.ambitos.join(", ")}` : "",
      filtros.grupos.length ? `para el grupo ${filtros.grupos.join(" / ")}` : "",
    ].filter(Boolean).join(" ");

    if (!lista.length) {
      return respuesta("lista-oposiciones", {
        titulo,
        bloques: [{ tipo: "parrafo", texto: "No tengo ninguna oposición en el catálogo que cumpla esos filtros." }],
        sugerencias: ["¿Qué oposiciones hay con bachillerato?", "Oposiciones de justicia"],
        contexto,
      });
    }
    return respuesta("lista-oposiciones", {
      titulo,
      bloques: [
        {
          tipo: "parrafo",
          texto: filtros.grupos.length
            ? "El grupo depende de la titulación exigida (art. 76 TREBEP): A1/A2 piden Grado; B, Técnico Superior; C1, Bachiller o Técnico; C2, Graduado en ESO. Con un título superior también puedes presentarte a grupos inferiores."
            : "Estas son las oposiciones que conozco. Pregúntame por cualquiera para ver requisitos, temario y normas clave.",
        },
        {
          tipo: "tabla",
          cabecera: ["Oposición", "Grupo", "Ámbito"],
          filas: lista.map((o) => [o.nombre, `${o.grupo}${o.grupoVerificado ? "" : " *"}`, o.ambito]),
        },
        { tipo: "aviso", texto: "* Grupo orientativo: compruébalo en la convocatoria. Sin asterisco: grupo respaldado por el texto del BOE." },
      ],
      sugerencias: lista.slice(0, 4).map((o) => `Requisitos de ${o.nombre}`),
      contexto,
    });
  }

  // ===================================================================
  // Test

  private async plantillaTest(
    consulta: string,
    norma: string | null,
    clave: ClavePrecepto | null,
    contexto: ContextoConversacion,
  ): Promise<Respuesta> {
    let objetivos: { norma: string; i: number }[] = [];
    let tema = "";

    if (norma && clave) {
      await this.asegurarNorma(norma);
      const i = this.buscarPrecepto(norma, clave);
      if (i !== null) {
        objetivos = [{ norma, i }];
        tema = this.etiqueta(norma, i);
      }
    } else if (norma) {
      await this.asegurarNorma(norma);
      const n = this.normas.get(norma)!;
      const indices = n.claves.map((c, i) => (c.tipo === "art" ? i : -1)).filter((i) => i >= 0);
      objetivos = barajar(indices).slice(0, 40).map((i) => ({ norma, i }));
      tema = n.fuente.nombre;
    } else {
      const ficha = this.mejorFicha(consulta.replace(/\b(ponme a prueba|hazme|un|test|preguntas?|examen|sobre|de)\b/gi, " "));
      if (ficha) {
        for (const c of ficha.ficha.citas) await this.asegurarNorma(c.norma);
        objetivos = [...new Set(ficha.ficha.citas.map((c) => `${c.norma}|${c.precepto}`))].map((k) => {
          const [nm, b] = k.split("|");
          return { norma: nm, i: this.normas.get(nm)!.texto.preceptos.findIndex((p) => p.b === b) };
        });
        tema = ficha.ficha.pregunta;
      } else if (contexto.ultimaNorma && contexto.ultimoPrecepto !== undefined) {
        objetivos = [{ norma: contexto.ultimaNorma, i: contexto.ultimoPrecepto }];
        tema = this.etiqueta(contexto.ultimaNorma, contexto.ultimoPrecepto);
      } else {
        await this.asegurarNorma("ce");
        const n = this.normas.get("ce")!;
        const indices = n.claves.map((c, i) => (c.tipo === "art" ? i : -1)).filter((i) => i >= 0);
        objetivos = barajar(indices).slice(0, 40).map((i) => ({ norma: "ce", i }));
        tema = "la Constitución Española";
      }
    }

    const preguntas: PreguntaGenerada[] = [];
    const fuentes: FuenteRespuesta[] = [];
    for (const o of objetivos) {
      if (preguntas.length >= 5 || o.i < 0) continue;
      const n = this.normas.get(o.norma)!;
      const p = n.texto.preceptos[o.i];
      const otrasRubricas = n.texto.preceptos.map((x) => x.r).filter((r): r is string => !!r);
      const nuevas = generarPreguntas(
        {
          nombre: p.n,
          etiquetaNorma: n.fuente.abreviatura,
          rubrica: p.r,
          parrafos: p.p,
          fuente: this.fuenteDe(o.norma, o.i),
          otrasRubricas,
        },
        objetivos.length === 1 ? 5 : 2,
      );
      if (nuevas.length) fuentes.push(this.fuenteDe(o.norma, o.i));
      preguntas.push(...nuevas);
    }

    if (!preguntas.length) {
      return respuesta("test", {
        titulo: "No puedo generar preguntas fiables aquí",
        bloques: [
          {
            tipo: "parrafo",
            texto: `${tema ? `En ${tema} no` : "No"} encuentro datos concretos (plazos, cifras o mayorías) que pueda convertir en preguntas sin riesgo de que haya dos respuestas correctas, así que prefiero no inventarlas.`,
          },
        ],
        sugerencias: ["Hazme un test del artículo 116 de la Constitución", "Hazme un test de la Ley 39/2015"],
        contexto,
      });
    }

    return respuesta("test", {
      titulo: `Test: ${tema}`,
      bloques: [
        { tipo: "test", preguntas: preguntas.slice(0, 5) },
        { tipo: "aviso", texto: "Preguntas generadas automáticamente a partir del texto literal del BOE: el hueco es el dato original y las demás opciones son cifras que no aparecen en ese precepto." },
      ],
      fuentes,
      sugerencias: ["Ponme a prueba otra vez", ...(norma ? [`Estructura de la ${this.normas.get(norma)?.fuente.abreviatura ?? ""}`] : [])],
      contexto,
    });
  }

  // ===================================================================
  // Fichas y búsqueda libre

  private mejorFichas(consulta: string): { ficha: Ficha; puntuacion: number; cobertura: number; frase: boolean }[] {
    const q = normalizar(consulta).replace(/[¿?¡!.,;:]/g, " ").replace(/\s+/g, " ");
    const t = [...new Set(terminosConSinonimos(consulta).filter((x) => !TERMINOS_VACIOS.has(x)))];
    if (!t.length) return [];
    return this.indiceFichas
      .buscar(t, { limite: 6 })
      .map(({ doc, puntuacion }) => {
        const conjunto = this.terminosFicha.get(doc.id)!;
        const fuera = t.filter((x) => !conjunto.has(x));
        const cobertura = (t.length - fuera.length) / t.length;
        // Una palabra rara de la pregunta que la ficha no trata («casación»,
        // «penal») indica que la ficha responde a OTRA cosa: se descarta.
        const textoFicha = this.textoFicha(doc);
        const vetada = fuera.some(
          (x) => x.length >= 4 && this.indice.rareza(x) > 0.97 && this.indice.rareza(x) < 1 && !textoFicha.includes(` ${x.slice(0, 5)}`),
        );
        const frase = doc.variantes.some((v) => {
          const vn = normalizar(v);
          if (vn.includes(" ")) return contieneFrase(q, vn);
          // Siglas o términos muy específicos de una sola palabra («cgpj»).
          const especifica = FICHAS.filter((f) => f.variantes.some((w) => normalizar(w).split(" ").includes(vn))).length <= 2;
          return vn.length >= 4 && especifica && contieneFrase(q, vn);
        });
        return { ficha: doc, puntuacion, cobertura: vetada ? Math.min(cobertura, 0.3) : cobertura, frase: frase && !vetada };
      })
      .sort((a, b) => Number(b.frase) - Number(a.frase) || b.puntuacion - a.puntuacion);
  }

  private readonly cacheTextoFicha = new Map<string, string>();

  /** Todo lo que dice una ficha (respuesta, claves, citas), normalizado. */
  private textoFicha(f: Ficha): string {
    let t = this.cacheTextoFicha.get(f.id);
    if (!t) {
      const partes = [f.pregunta, ...f.variantes, f.respuesta, ...(f.claves ?? []), ...(f.trampas ?? []), ...f.citas.map((c) => c.fragmento)];
      t = ` ${normalizar(partes.join(" ")).replace(/[^a-z0-9ñ]+/g, " ")} `;
      this.cacheTextoFicha.set(f.id, t);
    }
    return t;
  }

  private mejorFicha(consulta: string) {
    const [mejor] = this.mejorFichas(consulta);
    if (!mejor) return null;
    return mejor.frase || mejor.cobertura >= 0.6 ? mejor : null;
  }

  private async plantillaFicha(f: Ficha, contexto: ContextoConversacion, intro?: string): Promise<Respuesta> {
    for (const c of f.citas) await this.asegurarNorma(c.norma);
    const bloques: Bloque[] = [];
    if (intro) bloques.push({ tipo: "parrafo", texto: intro });
    bloques.push({ tipo: "parrafo", texto: f.respuesta });

    // Fundamento: cada precepto citado, solo con los párrafos que contienen las citas.
    const porPrecepto = new Map<string, string[]>();
    for (const c of f.citas) {
      const k = `${c.norma}|${c.precepto}`;
      porPrecepto.set(k, [...(porPrecepto.get(k) ?? []), c.fragmento]);
    }
    const fuentes: FuenteRespuesta[] = [];
    let ultimo: { norma: string; i: number } | null = null;
    for (const [k, fragmentos] of porPrecepto) {
      const [norma, bloque] = k.split("|");
      const n = this.normas.get(norma)!;
      const i = n.texto.preceptos.findIndex((p) => p.b === bloque);
      const parrafos = n.texto.preceptos[i].p.filter((par) => fragmentos.some((fr) => par.replace(/\s+/g, " ").includes(fr.replace(/\s+/g, " ").slice(0, 60))));
      bloques.push(this.bloqueCita(norma, i, parrafos.length ? parrafos : undefined, fragmentos));
      fuentes.push(this.fuenteDe(norma, i));
      ultimo ??= { norma, i };
    }
    if (f.claves?.length) bloques.push({ tipo: "claves", titulo: "Para el examen", items: f.claves });
    if (f.trampas?.length) bloques.push({ tipo: "claves", titulo: "Ojo con estas trampas", items: f.trampas });

    const relacionadas = (f.relacionadas ?? []).map((id) => FICHAS.find((x) => x.id === id)!.pregunta);
    return respuesta("ficha", {
      titulo: f.pregunta,
      bloques,
      fuentes,
      sugerencias: [`Ponme a prueba sobre ${f.pregunta.replace(/^¿|\?$/g, "").toLowerCase()}`, ...relacionadas],
      contexto: ultimo ? { ...contexto, ultimaNorma: ultimo.norma, ultimoPrecepto: ultimo.i } : contexto,
    });
  }

  private async plantillaBusqueda(
    consulta: string,
    norma: string | null,
    matiz: Matiz,
    comparar: boolean,
    contexto: ContextoConversacion,
  ): Promise<Respuesta> {
    const fichas = this.mejorFichas(consulta);
    const fuertes = fichas.filter((f) => f.frase || f.cobertura >= 0.6);

    // Comparación entre dos conceptos con ficha propia cada uno.
    if (comparar && fuertes.length >= 2 && !/diferencia/.test(normalizar(fuertes[0].ficha.pregunta))) {
      const [a, b] = fuertes;
      const ra = await this.plantillaFicha(a.ficha, contexto);
      const rb = await this.plantillaFicha(b.ficha, contexto);
      return respuesta("comparacion", {
        titulo: "Comparativa",
        bloques: [
          { tipo: "parrafo", texto: `**1. ${a.ficha.pregunta}**` },
          ...ra.bloques,
          { tipo: "parrafo", texto: `**2. ${b.ficha.pregunta}**` },
          ...rb.bloques,
        ],
        fuentes: [...ra.fuentes, ...rb.fuentes],
        sugerencias: [...ra.sugerencias.slice(1), ...rb.sugerencias.slice(1)],
        contexto: ra.contexto,
      });
    }
    if (fuertes.length) return this.plantillaFicha(fuertes[0].ficha, contexto);

    // Sin ficha: búsqueda en el texto de las normas.
    const aliasNorma = norma ? this.fuentes.find((f) => f.clave === norma)!.alias.flatMap((a) => terminos(a)) : [];
    const t = terminos(consulta).filter((x) => !TERMINOS_VACIOS.has(x) && !aliasNorma.includes(x));
    if (!t.length) return plantillaSinResultados(consulta, contexto);

    const resultados = this.indice.buscar(t, {
      limite: 7,
      filtro: norma ? (d) => d.norma === norma : undefined,
      peso: (d) => (PESO_NORMA[d.norma] ?? 1) * (this.normas.get(d.norma)!.claves[d.i].tipo === "otro" ? 0.3 : 1),
    });
    if (!resultados.length) return plantillaSinResultados(consulta, contexto);

    const [mejor, ...resto] = resultados;
    const cobertura = mejor.cubiertos / new Set(t).size;
    const preceptoMejor = this.normas.get(mejor.doc.norma)!.texto.preceptos[mejor.doc.i];
    const bloques: Bloque[] = [{ tipo: "parrafo", texto: introBusqueda(matiz, false) }];
    bloques.push(this.bloqueCita(mejor.doc.norma, mejor.doc.i, mejoresParrafos(preceptoMejor, t, 3), t));

    if (matiz === "plazo") {
      const plazos = resultados
        .slice(0, 3)
        .flatMap((r) => {
          const p = this.normas.get(r.doc.norma)!.texto.preceptos[r.doc.i];
          return p.p.flatMap(frases).filter((f) => RE_PLAZO.test(f) && /\b(\d+|un|una|dos|tres|cuatro|cinco|seis|diez|quince|veinte|treinta)\b/i.test(f) && cubre(f, t) > 0)
            .map((f) => `${recortarFrase(f)} (${this.etiqueta(r.doc.norma, r.doc.i)})`);
        })
        .slice(0, 5);
      if (plazos.length) bloques.push({ tipo: "claves", titulo: "Plazos que aparecen en esos preceptos", items: plazos });
    }

    if (resto.length) {
      bloques.push({
        tipo: "resultados",
        titulo: "También aparece en",
        items: resto.slice(0, 5).map((r) => this.resultado(r.doc, t)),
      });
    }
    if (cobertura < 0.5) {
      bloques.push({ tipo: "aviso", texto: "Coincidencia solo parcial con tu pregunta: puede que estos preceptos no respondan exactamente lo que buscas. Prueba a nombrar la ley o a usar el término técnico." });
    }
    const pendientes = this.pendientes();
    if (!norma && pendientes.length) {
      bloques.push({ tipo: "aviso", texto: `Aún estoy cargando ${pendientes.length} normas en segundo plano; si buscas algo de ellas, repite la pregunta en unos segundos.` });
    }
    bloques.push({ tipo: "aviso", texto: AVISO_GENERAL });

    return respuesta("busqueda", {
      titulo: preceptoMejor.r ? `${this.etiqueta(mejor.doc.norma, mejor.doc.i)} · ${preceptoMejor.r.replace(/\.$/, "")}` : this.etiqueta(mejor.doc.norma, mejor.doc.i),
      bloques,
      fuentes: [mejor, ...resto.slice(0, 5)].map((r) => this.fuenteDe(r.doc.norma, r.doc.i)),
      sugerencias: [
        this.consultaDe(mejor.doc.norma, mejor.doc.i),
        `Hazme un test del ${preceptoMejor.n.toLowerCase()} ${this.normas.get(mejor.doc.norma)!.fuente.abreviatura}`,
        ...fichas.slice(0, 3).map((f) => f.ficha.pregunta),
      ],
      contexto: { ...contexto, ultimaNorma: mejor.doc.norma, ultimoPrecepto: mejor.doc.i },
    });
  }

  private resultado(doc: DocPrecepto, t: string[]): ResultadoBusqueda {
    const n = this.normas.get(doc.norma)!;
    const p = n.texto.preceptos[doc.i];
    const mejorFrase = p.p.flatMap(frases).sort((a, b) => cubre(b, t) - cubre(a, t))[0] ?? "";
    return {
      norma: n.fuente.abreviatura,
      precepto: nombreCorto(n.claves[doc.i], p.n),
      rubrica: p.r,
      extracto: recortarFrase(mejorFrase),
      url: urlBoe(n.fuente.id, p.b),
      consulta: this.consultaDe(doc.norma, doc.i),
    };
  }
}

// ===================================================================

function contieneFrase(q: string, frase: string): boolean {
  const f = frase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${f}($|[^a-z0-9])`).test(q);
}

function cubre(texto: string, t: string[]): number {
  const propios = new Set(terminos(texto));
  return t.filter((x) => propios.has(x)).length;
}

function recortarFrase(f: string, max = 240): string {
  return f.length > max ? `${f.slice(0, max).replace(/\s+\S*$/, "")}…` : f;
}

/** Los `n` párrafos con más términos de la consulta, en su orden original. */
function mejoresParrafos(p: PreceptoCrudo, t: string[], n: number): string[] {
  if (p.p.length <= n) return p.p;
  const puntuados = p.p.map((texto, i) => ({ texto, i, s: cubre(texto, t) }));
  const elegidos = [...puntuados].sort((a, b) => b.s - a.s).slice(0, n).sort((a, b) => a.i - b.i);
  return elegidos.map((e) => e.texto);
}

/** Frases del precepto con plazos, cifras o mayorías: lo que más se pregunta. */
function datosClave(parrafos: string[]): string[] {
  const re = /\b(\d+|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|doce|quince|veinte|treinta|sesenta|setenta y dos)\s+(días|meses|mes|años|año|horas|semanas|miembros|Diputados|Senadores|vocales|por ciento)\b|\b(mayoría absoluta|mayoría simple|tres quintos|dos tercios)\b/i;
  return parrafos
    .flatMap(frases)
    .filter((f) => re.test(f))
    .map((f) => recortarFrase(f, 220))
    .slice(0, 5);
}

function barajar<T>(lista: T[]): T[] {
  const r = [...lista];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

export { detectarNorma };
