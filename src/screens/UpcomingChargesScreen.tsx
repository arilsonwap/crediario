// src/screens/UpcomingChargesScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Animated,
} from "react-native";
import { getUpcomingCharges, type Client } from "../database/db"; // ✅ usa o tipo Client do banco
import { CalendarIcon } from "../components/CalendarIcon";

type ChargesByDate = Record<string, Client[]>;

// 🔹 Funções auxiliares
const pad = (n: number) => n.toString().padStart(2, "0");
const formatDateBR = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
const weekAbbrev = (d: Date) =>
  d.toLocaleDateString("pt-BR", { weekday: "short" }).toUpperCase().replace(".", "");
const isToday = (d: Date) => {
  const t = new Date();
  return (
    d.getDate() === t.getDate() &&
    d.getMonth() === t.getMonth() &&
    d.getFullYear() === t.getFullYear()
  );
};

export default function UpcomingChargesScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [chargesByDate, setChargesByDate] = useState<ChargesByDate>({});
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // ============================================================
  // 🔄 Carrega próximas cobranças e agrupa por data
  // ============================================================
  useEffect(() => {
    (async () => {
      try {
        const clients = await getUpcomingCharges();
        const grouped: ChargesByDate = {};

        clients.forEach((c) => {
          if (!c.next_charge) return;
          if (!grouped[c.next_charge]) grouped[c.next_charge] = [];
          grouped[c.next_charge].push(c);
        });

        setChargesByDate(grouped);
      } catch (e) {
        console.error("Erro ao carregar próximas cobranças:", e);
      } finally {
        setLoading(false);
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
          Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }),
        ]).start();
      }
    })();
  }, [fadeAnim, slideAnim]);

  // ============================================================
  // 🔁 Animação de pulsar no contador total
  // ============================================================
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  // ============================================================
  // 📅 Calcula os próximos 7 dias com seus totais
  // ============================================================
  const next7 = useMemo(() => {
    const arr: { dateStr: string; weekday: string; count: number; isToday: boolean }[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      const ds = formatDateBR(d);
      arr.push({
        dateStr: ds,
        weekday: weekAbbrev(d),
        count: (chargesByDate[ds] || []).length,
        isToday: isToday(d),
      });
    }
    return arr;
  }, [chargesByDate]);

  const totalCount = useMemo(
    () => Object.values(chargesByDate).reduce((a, b) => a + b.length, 0),
    [chargesByDate]
  );

  const handleDayPress = (date: string) => {
    navigation.navigate("ClientsByDate", { date });
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        <ActivityIndicator size="large" color="#777" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  const todayBR = formatDateBR(new Date());

  // ============================================================
  // 🧾 Render principal
  // ============================================================
  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Card superior */}
        <Animated.View
          style={[styles.topCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate("ClientsByDate", { date: todayBR })}
          >
            <View style={styles.topCardInner}>
              <View style={styles.iconCircle}>
                <CalendarIcon size={58} showMonth />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.topTitle}>Próximas Cobranças</Text>
                <Text style={styles.topSubtitle}>Próximos 7 dias</Text>
              </View>

              <Animated.View style={[styles.totalBadge, { transform: [{ scale: pulseAnim }] }]}>
                <Text style={styles.totalBadgeText}>{totalCount}</Text>
              </Animated.View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Timeline */}
        <View style={styles.timeline}>
          <View style={styles.timelineLine} />
          {next7.map((d) => (
            <View key={d.dateStr} style={styles.timelineItem}>
              <View style={styles.pinWrapper}>
                <View
                  style={[
                    styles.pin,
                    d.isToday
                      ? styles.pinToday
                      : d.count > 0
                      ? styles.pinActive
                      : styles.pinEmpty,
                  ]}
                >
                  <Text style={styles.pinText}>{d.count}</Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleDayPress(d.dateStr)}
                style={[
                  styles.dayCard,
                  d.isToday
                    ? styles.dayCardToday
                    : d.count > 0
                    ? styles.dayCardActive
                    : styles.dayCardEmpty,
                ]}
              >
                <View style={styles.dayRow}>
                  <Text
                    style={[
                      styles.weekAbbrev,
                      d.isToday
                        ? styles.weekAbbrevToday
                        : d.count > 0
                        ? styles.weekAbbrevActive
                        : styles.weekAbbrevEmpty,
                    ]}
                  >
                    {d.weekday}
                  </Text>

                  {d.isToday && <Text style={styles.todayTag}>HOJE</Text>}
                </View>

                <Text style={styles.dayDate}>{d.dateStr}</Text>

                <Text style={styles.dayInfo}>
                  {d.count === 0
                    ? "Sem cobranças"
                    : d.count === 1
                    ? "1 cobrança"
                    : `${d.count} cobranças`}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

/* 🎨 Estilo ajustado com espaçamento e alinhamento corretos */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  loading: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: { color: "#555", marginTop: 10 },
  container: { padding: 16, paddingBottom: 28 },

  topCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  topCardInner: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  topTitle: { color: "#111", fontSize: 20, fontWeight: "800" },
  topSubtitle: { color: "#777", marginTop: 2, fontSize: 13, fontWeight: "600" },
  totalBadge: {
    backgroundColor: "#EEE",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  totalBadgeText: { color: "#222", fontWeight: "800", fontSize: 14 },

  timeline: { marginTop: 12, paddingLeft: 36 },
  timelineLine: {
    position: "absolute",
    left: 20,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "#E0E0E0",
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 26,
  },
  pinWrapper: { position: "absolute", left: 0, top: 4, width: 44, alignItems: "center" },
  pin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  pinToday: { backgroundColor: "#DDD", borderColor: "#CCC" },
  pinActive: { backgroundColor: "#CCC", borderColor: "#BBB" },
  pinEmpty: { backgroundColor: "#EEE", borderColor: "#DDD" },
  pinText: { color: "#333", fontWeight: "700" },

  dayCard: {
    flex: 1,
    marginLeft: 48,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: "#FFF",
  },
  dayCardToday: { borderColor: "#CCC" },
  dayCardActive: { borderColor: "#CCC" },
  dayCardEmpty: { borderColor: "#E5E5E5" },
  dayRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  weekAbbrev: { fontSize: 13, fontWeight: "700" },
  weekAbbrevToday: { color: "#111" },
  weekAbbrevActive: { color: "#222" },
  weekAbbrevEmpty: { color: "#AAA" },
  todayTag: {
    borderWidth: 1,
    borderColor: "#AAA",
    color: "#333",
    fontWeight: "700",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  dayDate: { marginTop: 6, fontSize: 18, fontWeight: "800", color: "#111" },
  dayInfo: { marginTop: 4, fontSize: 14, color: "#555", fontWeight: "500" },
});
