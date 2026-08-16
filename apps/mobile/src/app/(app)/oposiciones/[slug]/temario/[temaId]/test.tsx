import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { Screen } from "../../../../../../components/Screen";
import { LoadingScreen } from "../../../../../../components/LoadingScreen";
import { Button } from "../../../../../../components/Button";
import {
  finalizarIntento,
  iniciarIntento,
  responder,
  type PreguntaTest,
  type ResumenIntento,
} from "../../../../../../lib/quiz-client";
import { ApiError } from "../../../../../../lib/api-client";
import { colors, radii, spacing } from "../../../../../../theme";

interface RespuestaLocal {
  opcionElegida: number;
  esCorrecta: boolean;
  respuestaCorrecta: number;
}

export default function TestScreen() {
  const { slug, temaId } = useLocalSearchParams<{ slug: string; temaId: string }>();

  const [estado, setEstado] = useState<"cargando" | "en-curso" | "finalizado" | "error">("cargando");
  const [errorMsg, setErrorMsg] = useState("");
  const [intentoId, setIntentoId] = useState<string | null>(null);
  const [preguntas, setPreguntas] = useState<PreguntaTest[]>([]);
  const [index, setIndex] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, RespuestaLocal>>({});
  const [resumen, setResumen] = useState<ResumenIntento | null>(null);
  const [enviando, setEnviando] = useState(false);

  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current || !temaId) return;
    startedRef.current = true;
    iniciarIntento(temaId)
      .then((data) => {
        setIntentoId(data.intentoId);
        setPreguntas(data.preguntas);
        setEstado("en-curso");
      })
      .catch((err) => {
        setErrorMsg(err instanceof ApiError ? err.message : "No se pudo iniciar el test");
        setEstado("error");
      });
  }, [temaId]);

  if (estado === "cargando") return <LoadingScreen />;

  if (estado === "error") {
    return (
      <Screen scroll={false}>
        <Text style={{ color: colors.inkText, textAlign: "center" }}>{errorMsg}</Text>
        <Link href={`/(app)/oposiciones/${slug}/temario`} asChild>
          <Button title="Volver al temario" />
        </Link>
      </Screen>
    );
  }

  const current = preguntas[index];
  const respuestaActual = current ? respuestas[current.id] : undefined;

  async function elegirOpcion(i: number) {
    if (!intentoId || !current || respuestaActual || enviando) return;
    setEnviando(true);
    try {
      const { esCorrecta, respuestaCorrecta } = await responder(intentoId, current.id, i);
      setRespuestas((prev) => ({
        ...prev,
        [current.id]: { opcionElegida: i, esCorrecta, respuestaCorrecta },
      }));
    } catch {
      setErrorMsg("No se pudo guardar tu respuesta, inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  async function finalizar() {
    if (!intentoId) return;
    setEnviando(true);
    try {
      const data = await finalizarIntento(intentoId);
      setResumen(data);
      setEstado("finalizado");
    } catch {
      setErrorMsg("No se pudo finalizar el test, inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  if (estado === "finalizado" && resumen) {
    return (
      <Screen scroll={false}>
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.accent,
            borderRadius: radii.lg,
            padding: spacing(6),
            backgroundColor: colors.inkSurface,
            alignItems: "center",
            gap: spacing(2),
          }}
        >
          <Text style={{ fontSize: 12, color: colors.neutral500 }}>Puntuación</Text>
          <Text style={{ fontSize: 32, fontWeight: "700", color: colors.inkText }}>
            {resumen.puntuacion.toFixed(2)}/10
          </Text>
          <Text style={{ fontSize: 13, color: colors.neutral400 }}>
            {resumen.correctas} aciertos · {resumen.incorrectas} fallos · {resumen.enBlanco} en blanco
          </Text>
        </View>
        <Link href={`/(app)/oposiciones/${slug}/temario`} asChild>
          <Button variant="secondary" title="Volver al temario" />
        </Link>
        <Link href="/(app)/fallos" asChild>
          <Button title="Ver mis fallos" />
        </Link>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={{ fontSize: 12, color: colors.neutral500 }}>
        Pregunta {index + 1} de {preguntas.length}
      </Text>

      {current && (
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.inkDivider,
            borderRadius: radii.lg,
            padding: spacing(5),
            backgroundColor: colors.inkSurface,
            gap: spacing(3),
          }}
        >
          <Text style={{ fontSize: 15, lineHeight: 22, color: colors.inkText }}>
            {current.enunciado}
          </Text>

          {current.opciones.map((opcion, i) => {
            let borderColor: string = colors.inkDivider;
            if (respuestaActual) {
              if (i === respuestaActual.respuestaCorrecta) borderColor = colors.emerald400;
              else if (i === respuestaActual.opcionElegida) borderColor = colors.red400;
            }
            return (
              <Pressable
                key={opcion}
                disabled={Boolean(respuestaActual) || enviando}
                onPress={() => elegirOpcion(i)}
                style={{
                  borderWidth: 1,
                  borderColor,
                  borderRadius: radii.md,
                  padding: spacing(3),
                }}
              >
                <Text style={{ color: colors.inkText, fontSize: 14 }}>{opcion}</Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {errorMsg ? <Text style={{ color: colors.red400, fontSize: 13 }}>{errorMsg}</Text> : null}

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Button
          title="Anterior"
          variant="secondary"
          disabled={index === 0}
          onPress={() => setIndex((i) => Math.max(0, i - 1))}
        />
        {index < preguntas.length - 1 ? (
          <Button
            title="Siguiente"
            onPress={() => setIndex((i) => Math.min(preguntas.length - 1, i + 1))}
          />
        ) : (
          <Button title="Finalizar test" loading={enviando} onPress={finalizar} />
        )}
      </View>
    </Screen>
  );
}
