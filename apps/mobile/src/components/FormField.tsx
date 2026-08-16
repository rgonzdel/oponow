import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import { colors, radii, spacing } from "../theme";

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export function FormField({ label, error, style, ...rest }: FormFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.neutral600}
        style={[styles.input, style]}
        {...rest}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing(1.5) },
  label: { fontSize: 13, color: colors.neutral400 },
  input: {
    borderWidth: 1,
    borderColor: colors.inkDivider,
    borderRadius: radii.md,
    paddingVertical: spacing(2.5),
    paddingHorizontal: spacing(3),
    color: colors.inkText,
    backgroundColor: colors.inkSurface,
    fontSize: 15,
  },
  error: { fontSize: 12, color: colors.red400 },
});
