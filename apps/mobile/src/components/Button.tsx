import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors, radii, spacing } from "../theme";

export type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  title: string;
  // Opcional: cuando el botón va envuelto en <Link asChild>, expo-router
  // inyecta su propio onPress de navegación en el clonado del hijo.
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled,
  loading,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? colors.accent : colors.inkText} />
      ) : (
        <Text style={[styles.text, textVariantStyles[variant]]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    paddingVertical: spacing(3),
    paddingHorizontal: spacing(4),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.8 },
  text: { fontSize: 15, fontWeight: "600" },
});

const variantStyles = StyleSheet.create({
  primary: { borderColor: colors.accent, backgroundColor: "transparent" },
  secondary: { borderColor: colors.inkDivider, backgroundColor: "transparent" },
  ghost: { borderColor: "transparent", backgroundColor: "transparent" },
});

const textVariantStyles = StyleSheet.create({
  primary: { color: colors.accent },
  secondary: { color: colors.inkText },
  ghost: { color: colors.accent },
});
