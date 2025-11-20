import React, { ReactNode } from "react";
import { StyleSheet, View, ViewStyle, StyleProp } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius } from "@/constants/theme";

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, style }: CardProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.sm,
  },
});
