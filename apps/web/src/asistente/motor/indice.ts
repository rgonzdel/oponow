// Índice invertido con ranking BM25, incremental: las normas se van
// añadiendo a medida que se cargan sin reconstruir lo ya indexado.

const K1 = 1.2;
const B = 0.75;

export class IndiceBM25<T> {
  private readonly docs: T[] = [];
  private readonly longitudes: number[] = [];
  private longitudTotal = 0;
  /** término → [doc, tf, doc, tf, …] */
  private readonly postings = new Map<string, number[]>();

  get tamano(): number {
    return this.docs.length;
  }

  agregar(doc: T, terminos: string[]): void {
    const id = this.docs.length;
    this.docs.push(doc);
    this.longitudes.push(terminos.length);
    this.longitudTotal += terminos.length;
    const tf = new Map<string, number>();
    for (const t of terminos) tf.set(t, (tf.get(t) ?? 0) + 1);
    for (const [t, n] of tf) {
      let lista = this.postings.get(t);
      if (!lista) this.postings.set(t, (lista = []));
      lista.push(id, n);
    }
  }

  /** Nº de documentos que contienen el término (0 si es desconocido). */
  df(termino: string): number {
    return (this.postings.get(termino)?.length ?? 0) / 2;
  }

  vocabulario(): IterableIterator<string> {
    return this.postings.keys();
  }

  /** Frecuencia documental relativa (0-1) de un término: sirve para saber si es raro. */
  rareza(termino: string): number {
    const df = (this.postings.get(termino)?.length ?? 0) / 2;
    return this.docs.length ? 1 - df / this.docs.length : 0;
  }

  buscar(
    terminos: string[],
    opciones: { limite?: number; filtro?: (doc: T) => boolean; peso?: (doc: T) => number } = {},
  ): { doc: T; puntuacion: number; cubiertos: number }[] {
    const n = this.docs.length;
    if (!n || !terminos.length) return [];
    const media = this.longitudTotal / n;
    const unicos = [...new Set(terminos)];
    const puntuaciones = new Map<number, number>();
    const cubiertos = new Map<number, number>();

    for (const t of unicos) {
      const lista = this.postings.get(t);
      if (!lista) continue;
      const df = lista.length / 2;
      const idf = Math.log(1 + (n - df + 0.5) / (df + 0.5));
      for (let i = 0; i < lista.length; i += 2) {
        const doc = lista[i];
        const tf = lista[i + 1];
        const norm = tf + K1 * (1 - B + (B * this.longitudes[doc]) / media);
        puntuaciones.set(doc, (puntuaciones.get(doc) ?? 0) + (idf * (tf * (K1 + 1))) / norm);
        cubiertos.set(doc, (cubiertos.get(doc) ?? 0) + 1);
      }
    }

    const resultado: { doc: T; puntuacion: number; cubiertos: number }[] = [];
    for (const [id, p] of puntuaciones) {
      const doc = this.docs[id];
      if (opciones.filtro && !opciones.filtro(doc)) continue;
      // Premia cubrir más términos distintos de la consulta: «plazo recurso
      // alzada» debe preferir el artículo con los tres antes que uno que
      // repite «plazo» veinte veces.
      const cobertura = (cubiertos.get(id) ?? 0) / unicos.length;
      const puntuacion = p * (0.5 + cobertura) * (opciones.peso?.(doc) ?? 1);
      resultado.push({ doc, puntuacion, cubiertos: cubiertos.get(id) ?? 0 });
    }
    resultado.sort((a, b) => b.puntuacion - a.puntuacion);
    return resultado.slice(0, opciones.limite ?? 10);
  }
}
