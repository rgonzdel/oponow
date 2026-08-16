import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "../../components/Screen";
import { LoadingScreen } from "../../components/LoadingScreen";
import { Button } from "../../components/Button";
import { ApiError } from "../../lib/api-client";
import { getFallos, type FallosGroupBy } from "../../lib/quiz-client";
import { colors, radii, spacing } from "../../theme";

const GROUP_LABELS: Record<FallosGroupBy, string> = {
  day: "Día",
  month: "Mes",
  year: "Año",
};

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function FallosScreen() {
  const [groupBy, setGroupBy] = useState<FallosGroupBy>("day");

  const fallosQuery = useQuery({
    queryKey: ["quiz", "fallos", groupBy],
    queryFn: () => getFallos({ groupBy }),
    retry: false,
  });

  const gated = fallosQuery.error instanceof ApiError && fallosQuery.error.status === 403;

  if (fallosQuery.isLoading) return <LoadingScreen />;

  if (gated) {
    return (
      <Screen scroll={false}>
        <Text style={{ fontSize: 19, fontWeight: "600", color: colors.inkText, textAlign: "center" }}>
          Seguimiento de fallos
        </Text>
        <Text style={{ color: colors.neutral400, textAlign: "center" }}>
          Esta sección es solo para usuarios con una suscripción activa.
        </Text>
        <Link href="/(app)/oposiciones" asChild>
          <Button title="Ver oposiciones" />
        </Link>
      </Screen>
    );
  }

  const fallos = fallosQuery.data?.fallos ?? [];
  const porPeriodo = fallosQuery.data?.porPeriodo ?? [];
  const max = Math.max(1, ...porPeriodo.map((p) => p.total));

  return (
    <Screen>
      <Text style={{ fontSize: 22, fontWeight: "600", color: colors.inkText }}>
        Seguimiento de fallos
      </Text>

      <View style={{ flexDirection: "row", gap: 8 }}>
        {(Object.keys(GROUP_LABELS) as FallosGroupBy[]).map((g) => (
          <Pressable
            key={g}
            onPress={() => setGroupBy(g)}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 14,
              borderRadius: radii.md,
              backgroundColor: groupBy === g ? colors.accent : "transparent",
              borderWidth: groupBy === g ? 0 : 1,
              borderColor: colors.inkDivider,
            }}
          >
            <Text style={{ color: groupBy === g ? colors.ink : colors.neutral400, fontWeight: "600" }}>
              {GROUP_LABELS[g]}
            </Text>
          </Pressable>
        ))}
      </View>

      {porPeriodo.map((p) => (
        <View key={p.periodo} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={{ width: 80, fontSize: 11, color: colors.neutral500 }}>{p.periodo}</Text>
          <View style={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: colors.inkSurface }}>
            <View
              style={{
                height: "100%",
                borderRadius: 4,
                width: `${(p.total / max) * 100}%`,
                backgroundColor: colors.accent,
              }}
            />
          </View>
          <Text style={{ fontSize: 11, color: colors.neutral400 }}>{p.total}</Text>
        </View>
      ))}

      {fallos.map((f) => (
        <View
          key={f.id}
          style={{
            borderWidth: 1,
            borderColor: colors.inkDivider,
            borderRadius: radii.md,
            padding: spacing(4),
            backgroundColor: colors.inkSurface,
            gap: 6,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 11, color: colors.neutral500 }}>{f.temaTitulo}</Text>
            <Text style={{ fontSize: 11, color: colors.neutral500 }}>{formatFecha(f.fecha)}</Text>
          </View>
          <Text style={{ fontSize: 14, color: colors.inkText }}>{f.enunciado}</Text>
          <Text style={{ fontSize: 12, color: colors.red400 }}>
            Tu respuesta: {f.opciones[f.opcionElegida]}
          </Text>
          <Text style={{ fontSize: 12, color: colors.emerald400 }}>
            Correcta: {f.opciones[f.respuestaCorrecta]}
          </Text>
        </View>
      ))}

      {fallos.length === 0 && (
        <Text style={{ color: colors.neutral500, textAlign: "center" }}>
          No hay fallos registrados en este rango — ¡bien!
        </Text>
      )}
    </Screen>
  );
}
