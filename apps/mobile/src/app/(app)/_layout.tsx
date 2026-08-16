import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../auth/AuthContext";
import { LoadingScreen } from "../../components/LoadingScreen";
import { colors } from "../../theme";

export default function AppLayout() {
  const { status } = useAuth();

  if (status === "loading") return <LoadingScreen />;
  if (status === "anonymous") return <Redirect href="/(auth)/login" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.ink },
      }}
    />
  );
}
