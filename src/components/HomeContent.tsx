import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  navigation: any;
  todayCount: number;
  onPressHoje: () => void;
};

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48 - 15) / 2; // Largura da tela - padding horizontal - gap / 2

export default function HomeContent({ navigation, todayCount, onPressHoje }: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // 🔹 Animação do contador (só pulsa se tiver cobrança)
  useEffect(() => {
    if (todayCount > 0) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      pulseAnim.setValue(1); // Reseta se for 0
    }
  }, [todayCount, pulseAnim]);

  return (
    <View style={styles.container}>
      
      {/* 🚨 HERO CARD: Cobranças Hoje */}
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={onPressHoje}
        style={styles.heroWrapper}
      >
        <LinearGradient
          colors={todayCount > 0 ? ["#FFF7ED", "#FFEDD5"] : ["#F0FDF4", "#DCFCE7"]}
          style={[styles.heroCard, styles.shadow]}
        >
          <View style={styles.heroContent}>
            <View style={[
              styles.iconCircle, 
              { backgroundColor: todayCount > 0 ? "#FDBA74" : "#86EFAC" }
            ]}>
              <Ionicons 
                name={todayCount > 0 ? "alert-outline" : "checkmark-circle-outline"} 
                size={32} 
                color={todayCount > 0 ? "#C2410C" : "#15803D"} 
              />
            </View>
            
            <View style={styles.heroTextContainer}>
              <Text style={[
                styles.heroTitle, 
                { color: todayCount > 0 ? "#9A3412" : "#166534" }
              ]}>
                Cobranças de Hoje
              </Text>
              <Text style={styles.heroSubtitle}>
                {todayCount === 0
                  ? "Tudo em dia! Nenhuma cobrança."
                  : `${todayCount} cliente(s) para cobrar.`}
              </Text>
            </View>

            {/* Badge Animado */}
            {todayCount > 0 && (
              <Animated.View style={[styles.badge, { transform: [{ scale: pulseAnim }] }]}>
                <Text style={styles.badgeText}>{todayCount}</Text>
              </Animated.View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* 📌 Título da Seção */}
      <Text style={styles.sectionTitle}>ACESSO RÁPIDO</Text>

      {/* 🔲 GRID DE AÇÕES */}
      <View style={styles.gridContainer}>
        
        <MenuCard 
          title="Novo Cliente" 
          icon="person-add" 
          color="#2563EB" // Azul
          bgColor="#EFF6FF"
          onPress={() => navigation.navigate("AddClient")} 
        />

        <MenuCard 
          title="Ver Clientes" 
          icon="people" 
          color="#059669" // Verde Esmeralda
          bgColor="#ECFDF5"
          onPress={() => navigation.navigate("ClientList")} 
        />

        <MenuCard 
          title="Próx. Cobranças" 
          icon="calendar" 
          color="#EA580C" // Laranja
          bgColor="#FFF7ED"
          onPress={() => navigation.navigate("UpcomingCharges")} 
        />

        <MenuCard 
          title="Relatórios" 
          icon="bar-chart" 
          color="#7C3AED" // Roxo
          bgColor="#F5F3FF"
          onPress={() => navigation.navigate("Reports")} 
        />
        
        {/* Card Largo para Backup (Opcional) */}
        <TouchableOpacity 
          style={[styles.fullWidthCard, styles.shadow]} 
          onPress={() => navigation.navigate("Backup")}
        >
           <View style={[styles.miniIcon, { backgroundColor: "#F1F5F9" }]}>
             <Ionicons name="cloud-upload-outline" size={20} color="#475569" />
           </View>
           <Text style={styles.fullWidthText}>Fazer Backup dos Dados</Text>
           <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
        </TouchableOpacity>

      </View>
    </View>
  );
}

// 🧱 Componente de Card do Menu
const MenuCard = ({ title, icon, color, bgColor, onPress }: any) => (
  <TouchableOpacity 
    style={[styles.menuCard, styles.shadow, { backgroundColor: "#FFF" }]} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.menuIconContainer, { backgroundColor: bgColor }]}>
      <Ionicons name={icon} size={28} color={color} />
    </View>
    <Text style={styles.menuTitle}>{title}</Text>
  </TouchableOpacity>
);

/* 🎨 Estilos Modernos */
const styles = StyleSheet.create({
  container: { 
    width: "100%",
    paddingBottom: 20
  },

  shadow: {
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  // Hero Card
  heroWrapper: { marginBottom: 25 },
  heroCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)"
  },
  heroContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    opacity: 0.9
  },
  heroTextContainer: { flex: 1 },
  heroTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
  },
  badge: {
    backgroundColor: "#EF4444",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF",
    shadowColor: "#EF4444",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4
  },
  badgeText: { color: "#FFF", fontWeight: "bold", fontSize: 14 },

  // Grid
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#94A3B8",
    marginBottom: 15,
    marginLeft: 4,
    letterSpacing: 0.5
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15, // Gap vertical (se suportado) ou margin
  },
  menuCard: {
    width: CARD_WIDTH,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15, // Fallback para gap
  },
  menuIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
    textAlign: "center",
  },

  // Full Width Card (Backup)
  fullWidthCard: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginTop: 5,
  },
  miniIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  fullWidthText: {
    flex: 1,
    fontSize: 15,
    color: "#475569",
    fontWeight: "600"
  }
});