export const theme = {
  colors: {
    // Backgrounds - Gradiente azul escuro
    background: "#0F2027",
    backgroundSecondary: "#203A43",
    backgroundTertiary: "#2C5364",
    
    // Cards e containers
    card: "rgba(0, 212, 255, 0.12)",
    cardBorder: "rgba(0, 212, 255, 0.3)",
    cardSecondary: "rgba(255, 255, 255, 0.08)",
    
    // Cores principais
    primary: "#00D4FF", // Azul ciano vibrante
    primaryDark: "#0077B6",
    primaryLight: "#00E5FF",
    
    secondary: "#00A8E8", // Azul médio
    success: "#4ECDC4", // Verde água
    danger: "#FF416C", // Vermelho coral
    dangerDark: "#FF4B2B",
    warning: "#FFD60A", // Amarelo dourado
    warningDark: "#FFC300",
    info: "#764BA2", // Roxo
    
    // Textos
    text: "#FFFFFF",
    textSecondary: "rgba(255, 255, 255, 0.9)",
    textMuted: "rgba(255, 255, 255, 0.6)",
    textDark: "#1A1A1A",
    muted: "rgba(255, 255, 255, 0.5)",
  },
  
  gradients: {
    background: ["#0F2027", "#203A43", "#2C5364"],
    primary: ["#00D4FF", "#00A8E8", "#0077B6"],
    secondary: ["rgba(255, 255, 255, 0.2)", "rgba(255, 255, 255, 0.1)"],
    danger: ["#FF416C", "#FF4B2B"],
    warning: ["#FFD60A", "#FFC300"],
    success: ["#4ECDC4", "#44A08D"],
    card: ["rgba(0, 212, 255, 0.12)", "rgba(0, 168, 232, 0.08)"],
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    round: 999,
  },
  
  font: {
    family: {
      regular: "System",
      bold: "System",
    },
    size: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    weight: {
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      black: "900",
    },
  },
  
  shadow: {
    // Sombra padrão escura
    default: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    // Sombra com glow ciano
    glow: {
      shadowColor: "#00D4FF",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    // Sombra pronunciada
    large: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
    // Sombra com glow colorido
    glowDanger: {
      shadowColor: "#FF416C",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 8,
    },
    glowWarning: {
      shadowColor: "#FFD60A",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 6,
    },
  },
  
  // Opacidades padrão
  opacity: {
    light: 0.1,
    medium: 0.25,
    strong: 0.5,
  },
};