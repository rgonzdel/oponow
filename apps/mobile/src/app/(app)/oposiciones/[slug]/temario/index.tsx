import { Text, View } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { OPOSICIONES } from "@oponow/shared-types";
import { Screen } from "../../../../../components/Screen";
import { LoadingScreen } from "../../../../../components/LoadingScreen";
import { listTemas } from "../../../../../lib/temario-client";
import { colors, radii, spacing } from "../../../../../theme";

export default function TemarioScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const op = OPOSICIONES.find((o) => o.slug === slug);

  const temasQuery = useQuery({
    queryKey: ["temario", "temas", slug],
    queryFn: () => listTemas(slug!),
    enabled: Boolean(slug),
  });

  if (temasQuery.isLoading) return <LoadingScreen />;

  return (
    <Screen>
      <Text style={{ fontSize: 22, fontWeight: "600", color: colors.inkText }}>
        Temario{op ? ` · ${op.siglas}` : ""}
      </Text>
      <Text style={{ fontSize: 13, color: colors.neutral400 }}>
        Solo se muestran los temas a los que tienes acceso con tu plan actual.
      </Text>

      {temasQuery.data?.map((tema) => (
        <Link
          key={tema.id}
          href={`/(app)/oposiciones/${slug}/temario/${tema.id}`}
          asChild
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.inkDivider,
              borderRadius: radii.md,
              padding: spacing(4),
              backgroundColor: colors.inkSurface,
            }}
          >
            <Text style={{ color: colors.inkText, flex: 1, fontSize: 14 }}>
              {tema.titulo}
            </Text>
            {tema.esGratuito && (
              <View
                style={{
                  backgroundColor: colors.accent800,
                  borderRadius: radii.md,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                }}
              >
                <Text style={{ color: colors.accent100, fontSize: 11, fontWeight: "600" }}>
                  Gratis
                </Text>
              </View>
            )}
          </View>
        </Link>
      ))}

      {temasQuery.data?.length === 0 && (
        <Text style={{ color: colors.neutral500, textAlign: "center" }}>
          Todavía no hay temas publicados para esta oposición.
        </Text>
      )}
    </Screen>
  );
}
