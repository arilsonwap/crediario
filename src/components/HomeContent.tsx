import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import GradientButton from "./GradientButton";
import { CalendarIcon } from "./CalendarIcon";

type Props = {
  navigation: any;
  todayCount: number;
  onPressHoje: () => void; // ✅ nova prop
};

export default function HomeContent({ navigation, todayCount, onPressHoje }: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // 🔹 Animação suave do contador
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      {/* 💳 Crediário */}
      <View style={[styles.headerBox, styles.shadow]}>
        <Text style={styles.header}>💳 CREDIÁRIO</Text>
        <Text style={styles.subtitle}>
          Gerencie seus clientes e cobranças com praticidade
        </Text>
      </View>

      {/* 🟡 Cobranças Hoje */}
      <TouchableOpacity activeOpacity={0.9} onPress={onPressHoje}>
        <View style={[styles.chargeCard, styles.shadow]}>
          <View style={styles.row}>
            <View style={styles.iconCircle}>
              <CalendarIcon size={52} showMonth />
            </View>

            <View style={styles.textCenter}>
              <View style={styles.row}>
                <Text style={styles.chargeTitle}>Cobranças Hoje</Text>
                <Animated.View
                  style={[styles.countBadge, { transform: [{ scale: pulseAnim }] }]}
                >
                  <Text style={styles.countText}>{todayCount}</Text>
                </Animated.View>
              </View>

              <Text style={styles.chargeSubtitle}>
                {todayCount === 0
                  ? "Nenhum cliente com cobrança hoje"
                  : todayCount === 1
                  ? "1 cliente vencendo hoje"
                  : `${todayCount} clientes vencendo hoje`}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* 🔘 Botões principais */}
      <View style={[styles.card, styles.shadow]}>
        <GradientButton
          title="➕ Novo Cliente"
          colors={["#007AFF", "#5856D6"]}
          onPress={() => navigation.navigate("AddClient")}
        />
        <GradientButton
          title="📋 Ver Clientes"
          colors={["#34C759", "#30D158"]}
          onPress={() => navigation.navigate("ClientList")}
        />
        <GradientButton
          title="📅 Próximas Cobranças"
          colors={["#FF9500", "#FFB84D"]}
          onPress={() => navigation.navigate("UpcomingCharges")}
        />
        <GradientButton
          title="📊 Relatórios Financeiros"
          colors={["#5856D6", "#AF52DE"]}
          onPress={() => navigation.navigate("Reports")}
        />
        <GradientButton
          title="💾 Fazer Backup"
          colors={["#FF3B30", "#FF453A"]}
          onPress={() => navigation.navigate("Backup")}
        />
      </View>
    </View>
  );
}

/* 🎨 Estilos harmonizados */
const styles = StyleSheet.create({
  container: { alignItems: "center", width: "100%" },
  shadow: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  headerBox: {
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 25,
    paddingHorizontal: 15,
    borderRadius: 20,
    width: "100%",
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "800",
    color: "#007AFF",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },

  // 🟡 Cobranças Hoje
  chargeCard: {
    backgroundColor: "#F5F9FF",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 25,
    width: "100%",
    alignItems: "center",
  },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E5E5EA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  textCenter: { alignItems: "center" },
  chargeTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#007AFF",
    marginRight: 6,
  },
  countBadge: {
    backgroundColor: "#FFD60A",
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "#FFF",
  },
  countText: { fontSize: 14, fontWeight: "900", color: "#000" },
  chargeSubtitle: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
    textAlign: "center",
  },

  // 🔘 Card de Botões
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 25,
    marginBottom: 20,
    gap: 12,
  },
});
