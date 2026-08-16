import { Text, View } from "react-native";
import { Link } from "expo-router";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/Button";
import { useAuth } from "../../auth/AuthContext";
import { colors, radii, spacing } from "../../theme";

const PLAN_LABEL: Record<string, string> = {
  free: "Free",
  lite: "Lite",
  vip: "VIP",
};

export default function DashboardScreen() {
  const { user, logout } = useAuth();

  return (
    <Screen>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "600", color: colors.inkText }}>
          Oponow
        </Text>
        <Button title="Salir" variant="ghost" onPress={() => logout()} />
      </View>

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
        <Text style={{ color: colors.inkText }}>
          Sesión activa · plan{" "}
          <Text style={{ color: colors.accent100, fontWeight: "600" }}>
            {user ? (PLAN_LABEL[user.plan] ?? user.plan) : "…"}
          </Text>
        </Text>
        <Link href="/(app)/oposiciones" asChild>
          <Button title="Ver oposiciones" />
        </Link>
      </View>

      <Link href="/(app)/fallos" asChild>
        <Button variant="secondary" title="Seguimiento de fallos" />
      </Link>
    </Screen>
  );
}
