import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../auth/AuthContext";
import { LoadingScreen } from "../../components/LoadingScreen";
import { colors } from "../../theme";

export default function AuthLayout() {
  const { status } = useAuth();

  if (status === "loading") return <LoadingScreen />;
  if (status === "authenticated") return <Redirect href="/(app)" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.ink },
      }}
    />
  );
}
