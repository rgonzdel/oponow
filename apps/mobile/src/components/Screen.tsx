import { ScrollView, StyleSheet, View, type ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "../theme";

interface ScreenProps extends ViewProps {
  scroll?: boolean;
}

export function Screen({ children, style, scroll = true, ...rest }: ScreenProps) {
  const Container = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={styles.safeArea}>
      <Container
        style={scroll ? styles.scroll : [styles.content, style]}
        contentContainerStyle={scroll ? [styles.content, style] : undefined}
        {...rest}
      >
        {children}
      </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.ink },
  scroll: { flex: 1 },
  content: { padding: spacing(5), gap: spacing(4) },
});
