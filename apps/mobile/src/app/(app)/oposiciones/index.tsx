import { Text, View } from "react-native";
import { Link } from "expo-router";
import { OPOSICIONES } from "@oponow/shared-types";
import { Screen } from "../../../components/Screen";
import { colors, radii, spacing } from "../../../theme";

export default function OposicionesScreen() {
  const disponibles = OPOSICIONES.filter((o) => o.disponible);
  const proximamente = OPOSICIONES.filter((o) => !o.disponible);

  return (
    <Screen>
      <Text style={{ fontSize: 22, fontWeight: "600", color: colors.inkText }}>
        Oposiciones
      </Text>

      {disponibles.map((op) => (
        <Link key={op.slug} href={`/(app)/oposiciones/${op.slug}/temario`} asChild>
          <View
            style={{
              borderWidth: 1,
              borderColor: colors.inkDivider,
              borderRadius: radii.lg,
              padding: spacing(5),
              backgroundColor: colors.inkSurface,
              gap: spacing(2),
            }}
          >
            <Text style={{ fontSize: 11, color: colors.neutral500 }}>
              Grupo {op.grupo} · {op.organismo}
            </Text>
            <Text style={{ fontSize: 17, fontWeight: "600", color: colors.inkText }}>
              {op.nombre} ({op.siglas})
            </Text>
            <Text style={{ fontSize: 13, color: colors.neutral400 }}>{op.resumen}</Text>
            <Text style={{ fontSize: 13, color: colors.accent, fontWeight: "600" }}>
              Ver temario →
            </Text>
          </View>
        </Link>
      ))}

      {proximamente.map((op) => (
        <View
          key={op.slug}
          style={{
            borderWidth: 1,
            borderStyle: "dashed",
            borderColor: colors.inkDivider,
            borderRadius: radii.lg,
            padding: spacing(5),
            opacity: 0.6,
          }}
        >
          <Text style={{ fontSize: 11, color: colors.neutral500 }}>
            Grupo {op.grupo} · Próximamente
          </Text>
          <Text style={{ fontSize: 15, color: colors.neutral400, marginTop: 4 }}>
            {op.nombre} ({op.siglas})
          </Text>
        </View>
      ))}
    </Screen>
  );
}
