import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { Screen } from "../../components/Screen";
import { FormField } from "../../components/FormField";
import { Button } from "../../components/Button";
import { useAuth, type DesafioMfa } from "../../auth/AuthContext";
import { ApiError, apiFetch } from "../../lib/api-client";
import { colors } from "../../theme";

const REENVIO_S = 30;

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // En un dispositivo nuevo, tras la contraseña llega el paso del código.
  const [desafio, setDesafio] = useState<DesafioMfa | null>(null);

  const mutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (pendiente) => setDesafio(pendiente),
  });

  if (desafio) {
    return <CodigoMfa desafio={desafio} onVolver={() => setDesafio(null)} />;
  }

  return (
    <Screen>
      <Text style={{ fontSize: 24, fontWeight: "600", color: colors.inkText }}>
        Inicia sesión
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
          textContentType="password"
        />

        {mutation.isError && (
          <Text style={{ color: colors.red400, fontSize: 13 }}>
            {mutation.error instanceof ApiError
              ? mutation.error.message
              : "No se pudo iniciar sesión"}
          </Text>
        )}

        <Button
          title="Entrar"
          loading={mutation.isPending}
          onPress={() => mutation.mutate()}
        />
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center", gap: 4 }}>
        <Text style={{ color: colors.neutral400 }}>¿No tienes cuenta?</Text>
        <Link href="/(auth)/register">
          <Text style={{ color: colors.accent }}>Regístrate</Text>
        </Link>
      </View>
    </Screen>
  );
}

function CodigoMfa({ desafio, onVolver }: { desafio: DesafioMfa; onVolver: () => void }) {
  const { verificarMfa } = useAuth();
  const [codigo, setCodigo] = useState("");
  const [espera, setEspera] = useState(REENVIO_S);

  useEffect(() => {
    if (espera <= 0) return;
    const t = setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [espera]);

  const verificar = useMutation({
    mutationFn: (valor: string) => verificarMfa(desafio.desafioId, valor),
    onError: () => setCodigo(""),
  });

  const reenviar = useMutation({
    mutationFn: () =>
      apiFetch<void>("/auth/mfa/reenviar", {
        method: "POST",
        skipAuth: true,
        body: JSON.stringify({ desafioId: desafio.desafioId }),
      }),
    onSuccess: () => {
      setEspera(REENVIO_S);
      setCodigo("");
      verificar.reset();
    },
  });

  const error = verificar.error ?? reenviar.error;

  return (
    <Screen>
      <Text style={{ fontSize: 24, fontWeight: "600", color: colors.inkText }}>
        Revisa tu correo
      </Text>
      <Text style={{ color: colors.neutral400 }}>
        Te hemos enviado un código de 6 dígitos a {desafio.email}. Mira también en spam.
      </Text>

      <View style={{ gap: 16 }}>
        <FormField
          label="Código"
          value={codigo}
          onChangeText={(v) => {
            const limpio = v.replace(/\D/g, "").slice(0, 6);
            setCodigo(limpio);
            if (limpio.length === 6 && !verificar.isPending) verificar.mutate(limpio);
          }}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
          maxLength={6}
          autoFocus
          style={{ fontSize: 22, letterSpacing: 8, textAlign: "center" }}
        />

        {error && (
          <Text style={{ color: colors.red400, fontSize: 13 }}>
            {error instanceof ApiError ? error.message : "No se ha podido comprobar el código"}
          </Text>
        )}

        <Button
          title="Verificar y entrar"
          loading={verificar.isPending}
          disabled={codigo.length < 6}
          onPress={() => verificar.mutate(codigo)}
        />
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Pressable onPress={onVolver}>
          <Text style={{ color: colors.neutral400 }}>← Volver</Text>
        </Pressable>
        <Pressable disabled={espera > 0 || reenviar.isPending} onPress={() => reenviar.mutate()}>
          <Text style={{ color: espera > 0 ? colors.neutral600 : colors.accent }}>
            {espera > 0 ? `Reenviar en ${espera} s` : "Reenviar código"}
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}
