import { useState } from "react";
import { Text, View } from "react-native";
import { Link } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { Screen } from "../../components/Screen";
import { FormField } from "../../components/FormField";
import { Button } from "../../components/Button";
import { useAuth } from "../../auth/AuthContext";
import { ApiError } from "../../lib/api-client";
import { colors } from "../../theme";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: () => register(email, password),
  });

  return (
    <Screen>
      <Text style={{ fontSize: 24, fontWeight: "600", color: colors.inkText }}>
        Crea tu cuenta
      </Text>

      <View style={{ gap: 16 }}>
        <FormField
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <FormField
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="newPassword"
        />
        <Text style={{ color: colors.neutral500, fontSize: 12 }}>
          Mínimo 8 caracteres.
        </Text>

        {mutation.isError && (
          <Text style={{ color: colors.red400, fontSize: 13 }}>
            {mutation.error instanceof ApiError
              ? mutation.error.message
              : "No se pudo crear la cuenta"}
          </Text>
        )}

        <Button
          title="Crear cuenta"
          loading={mutation.isPending}
          onPress={() => mutation.mutate()}
        />
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center", gap: 4 }}>
        <Text style={{ color: colors.neutral400 }}>¿Ya tienes cuenta?</Text>
        <Link href="/(auth)/login">
          <Text style={{ color: colors.accent }}>Entra</Text>
        </Link>
      </View>
    </Screen>
  );
}
