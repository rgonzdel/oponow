import { useState } from "react";
import { Text, View } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "../../../../../components/Screen";
import { LoadingScreen } from "../../../../../components/LoadingScreen";
import { Button } from "../../../../../components/Button";
import { listBloques, listTemas, getBloque } from "../../../../../lib/temario-client";
import { parseContentBlocks } from "../../../../../lib/html-blocks";
import { ApiError } from "../../../../../lib/api-client";
import { colors, radii, spacing } from "../../../../../theme";

export default function TemaReaderScreen() {
  const { slug, temaId } = useLocalSearchParams<{ slug: string; temaId: string }>();
  const [bloqueIndex, setBloqueIndex] = useState(0);

  const temasQuery = useQuery({
    queryKey: ["temario", "temas", slug],
    queryFn: () => listTemas(slug!),
    enabled: Boolean(slug),
  });
  const tema = temasQuery.data?.find((t) => t.id === temaId);

  const bloquesQuery = useQuery({
    queryKey: ["temario", "bloques", temaId],
    queryFn: () => listBloques(temaId!),
    enabled: Boolean(temaId),
  });

  const bloqueId = bloquesQuery.data?.[bloqueIndex]?.id;

  const contenidoQuery = useQuery({
    queryKey: ["temario", "bloque", bloqueId],
    queryFn: () => getBloque(bloqueId as string),
    enabled: Boolean(bloqueId),
  });

  if (bloquesQuery.isLoading) return <LoadingScreen />;

  const totalBloques = bloquesQuery.data?.length ?? 0;
  const bloques = contenidoQuery.data ? parseContentBlocks(contenidoQuery.data.contenidoHtml) : [];

  return (
    <Screen>
      {tema && (
        <Text style={{ fontSize: 19, fontWeight: "600", color: colors.inkText }}>
          {tema.titulo}
        </Text>
      )}

      {totalBloques > 1 && (
        <Text style={{ fontSize: 12, color: colors.neutral500 }}>
          Bloque {bloqueIndex + 1} de {totalBloques}
        </Text>
      )}

      {contenidoQuery.isError && (
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.inkDivider,
            borderRadius: radii.lg,
            padding: spacing(5),
            backgroundColor: colors.inkSurface,
          }}
        >
          {contenidoQuery.error instanceof ApiError && contenidoQuery.error.status === 404 ? (
            <Text style={{ color: colors.inkText }}>
              No tienes acceso a este contenido con tu plan actual.
            </Text>
          ) : (
            <Text style={{ color: colors.red400 }}>No se pudo cargar el contenido.</Text>
          )}
        </View>
      )}

      {bloques.length > 0 && (
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
          {bloques.map((block, i) =>
            block.type === "h3" ? (
              <Text
                key={i}
                style={{ fontSize: 16, fontWeight: "600", color: colors.inkText }}
              >
                {block.text}
              </Text>
            ) : (
              <Text key={i} style={{ fontSize: 14, lineHeight: 22, color: colors.neutral400 }}>
                {block.text}
              </Text>
            ),
          )}
        </View>
      )}

      {totalBloques > 1 && (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Button
            title="Anterior"
            variant="secondary"
            disabled={bloqueIndex === 0}
            onPress={() => setBloqueIndex((i) => Math.max(0, i - 1))}
          />
          <Button
            title="Siguiente"
            disabled={bloqueIndex === totalBloques - 1}
            onPress={() => setBloqueIndex((i) => Math.min(totalBloques - 1, i + 1))}
          />
        </View>
      )}

      {tema && (
        <Link href={`/(app)/oposiciones/${slug}/temario/${temaId}/test`} asChild>
          <Button title="Hacer test de este tema" />
        </Link>
      )}
    </Screen>
  );
}
