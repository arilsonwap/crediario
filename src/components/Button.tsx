import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../theme/theme";

type ButtonType = "primary" | "secondary" | "danger" | "warning" | "success" | "outline";

type ButtonProps = {
  label: string;
  type?: ButtonType;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  icon?: string; // Emoji icon
  fullWidth?: boolean;
};

export const Button = ({
  label,
  type = "primary",
  onPress,
  style,
  disabled = false,
  icon,
  fullWidth = false,
}: ButtonProps) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  // Animação de press
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // Configurações por tipo
  const buttonConfig = {
    primary: {
      colors: theme.gradients.primary as [string, string, ...string[]],
      shadow: theme.shadow.glow,
      textColor: theme.colors.text,
    },
    secondary: {
      colors: theme.gradients.secondary as [string, string, ...string[]],
      shadow: theme.shadow.default,
      textColor: theme.colors.text,
    },
    danger: {
      colors: theme.gradients.danger as [string, string, ...string[]],
      shadow: theme.shadow.glowDanger,
      textColor: theme.colors.text,
    },
    warning: {
      colors: theme.gradients.warning as [string, string, ...string[]],
      shadow: theme.shadow.glowWarning,
      textColor: theme.colors.textDark,
    },
    success: {
      colors: theme.gradients.success as [string, string, ...string[]],
      shadow: theme.shadow.glow,
      textColor: theme.colors.text,
    },
    outline: {
      colors: ["transparent", "transparent"] as [string, string],
      shadow: {},
      textColor: theme.colors.primary,
    },
  };

  const config = buttonConfig[type];

  return (
    <Animated.View
      style={[
        styles.container,
        fullWidth && styles.fullWidth,
        { transform: [{ scale: scaleAnim }] },
        style,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.button,
          disabled && styles.disabled,
          type === "outline" && styles.outlineButton,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        <LinearGradient
          colors={config.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradient,
            config.shadow,
          ]}
        >
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <Text style={[styles.label, { color: config.textColor }]}>
            {label}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.sm,
  },
  fullWidth: {
    width: "100%",
  },
  button: {
    borderRadius: theme.radius.lg,
    overflow: "hidden",
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  icon: {
    fontSize: 20,
  },
  label: {
    fontSize: theme.font.size.md,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  disabled: {
    opacity: 0.5,
  },
});