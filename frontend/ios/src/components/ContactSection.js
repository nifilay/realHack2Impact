import React from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';          // ← import our theme

export default function ContactSection() {
  const { width } = useWindowDimensions();
  const isSmall = width < 600;

  return (
    <LinearGradient
      colors={[theme.colors.pink, theme.colors.lavender, theme.colors.babyblue]}
      start={[0, 0]} end={[1, 1]}
      style={[styles.container, isSmall && styles.containerSmall]}
    >
      <View style={[styles.row, isSmall && styles.column]}>
        {/* Left */}
        <View style={styles.left}>
          <Text style={styles.emoji}>👀</Text>
          <Text style={styles.lookout}>
            I’m always on the lookout for{"\n"}
            <Text style={styles.lookoutBold}>cool, exciting new projects…</Text>
          </Text>
          <View style={styles.divider} />
          <Text style={styles.examples}>
            e.g. Startup design, merch, covers, commissions … ⚡️
          </Text>
        </View>

        {/* Right */}
        <View style={styles.right}>
          <Text style={styles.ctaTitle}>Let’s talk! 💬</Text>
          <Text style={styles.ctaSubtitle}>
            Best way to reach me is by email:
          </Text>
          <Pressable onPress={() => {/* mailto:… */}}>
            <Text style={styles.email}>michelle@example.com ✨</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.md,
  },
  containerSmall: {
    padding: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
  },
  left: {
    flex: 1,
    paddingRight: theme.spacing.sm,
  },
  right: {
    flex: 1,
    paddingLeft: theme.spacing.sm,
    justifyContent: 'center',
  },
  emoji: {
    fontSize: theme.fontSizes.xl,
    marginBottom: theme.spacing.sm,
  },
  lookout: {
    fontSize: theme.fontSizes.lg,
    fontStyle: 'italic',
    marginBottom: theme.spacing.sm,
  },
  lookoutBold: {
    fontWeight: '700',
    color: theme.colors.slate,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.midgray,
    marginVertical: theme.spacing.sm,
  },
  examples: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.midgray,
    lineHeight: theme.fontSizes.md * 1.5,
  },
  ctaTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: '700',
    color: theme.colors.slate,
    marginBottom: theme.spacing.xs,
  },
  ctaSubtitle: {
    fontSize: theme.fontSizes.md,
    fontStyle: 'italic',
    color: theme.colors.midgray,
    marginBottom: theme.spacing.sm,
  },
  email: {
    fontSize: theme.fontSizes.lg,
    textDecorationLine: 'underline',
    color: theme.colors.babyblue,
  },
});
