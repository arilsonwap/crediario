import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getUpcomingCharges, Client } from "../database/db";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../theme/theme";

export default function UpcomingChargesScreen() {
  const [chargesByDay, setChargesByDay] = useState<
    { date: string; count: number; dayOfWeek: string; isToday: boolean; isTomorrow: boolean }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const navigation: any = useNavigation();

  // 📅 Formata data dd/mm/yyyy
  const formatDate = (date: Date) =>
    `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;

  // 📆 Retorna dia da semana
  const getDayOfWeek = (date: Date) => {
    const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
    return days[date.getDay()];
  };

  // 🔍 Busca e agrupa clientes
  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(() => {
    try {
      const result = getUpcomingCharges();
      const grouped: { [key: string]: Client[] } = {};

      result.forEach((client) => {
        if (client.next_charge) {
          if (!grouped[client.next_charge]) grouped[client.next_charge] = [];
          grouped[client.next_charge].push(client);
        }
      });

      // Gera os próximos 7 dias
      const today = new Date();
      const next7days = [];
      
      for (let i = 0; i < 7; i++) {
        const day = new Date();
        day.setDate(today.getDate() + i);
        const formatted = formatDate(day);
        const count = grouped[formatted]?.length || 0;
        const dayOfWeek = getDayOfWeek(day);
        
        next7days.push({ 
          date: formatted, 
          count,
          dayOfWeek,
          isToday: i === 0,
          isTomorrow: i === 1
        });
      }

      setChargesByDay(next7days);
    } catch (err) {
      console.error("Erro ao carregar próximas cobranças:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <LinearGradient
        colors={['#0d1b2a', '#1b263b'] as [string, string, ...string[]]}
        style={styles.gradient}
      >
        <StatusBar barStyle="light-content" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#06ffa5" />
          <Text style={styles.loadingText}>Carregando timeline...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0d1b2a" />
      <LinearGradient
        colors={['#0d1b2a', '#1b263b'] as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.container}>
          {/* Header com resumo */}
          <View style={styles.headerWrapper}>
            <View style={styles.headerCard}>
              <View style={styles.headerIcon}>
                <Text style={styles.icon}>📅</Text>
              </View>
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>Próximas Cobranças</Text>
                <Text style={styles.headerSubtitle}>Próximos 7 dias</Text>
              </View>
              <View style={styles.totalBadge}>
                <LinearGradient
                  colors={['#06ffa5', '#00d9ff'] as [string, string, ...string[]]}
                  style={styles.totalGradient}
                >
                  <Text style={styles.totalNumber}>
                    {chargesByDay.reduce((sum, day) => sum + day.count, 0)}
                  </Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Timeline */}
          <FlatList
            data={chargesByDay}
            keyExtractor={(item) => item.date}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.timeline}
            renderItem={({ item, index }) => {
              const hasCharges = item.count > 0;
              const isLast = index === chargesByDay.length - 1;

              return (
                <View style={styles.timelineItem}>
                  {/* Linha vertical */}
                  <View style={styles.timelineTrack}>
                    <View style={styles.timelineDot}>
                      <LinearGradient
                        colors={
                          (hasCharges 
                            ? (item.isToday 
                                ? ['#FFD60A', '#FFC300']
                                : ['#06ffa5', '#00d9ff'])
                            : ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']
                          ) as [string, string, ...string[]]
                        }
                        style={[
                          styles.dot,
                          hasCharges && styles.dotActive
                        ]}
                      >
                        {hasCharges && (
                          <Text style={styles.dotText}>{item.count}</Text>
                        )}
                      </LinearGradient>
                    </View>
                    {!isLast && (
                      <View style={[
                        styles.timelineLine,
                        hasCharges && styles.timelineLineActive
                      ]} />
                    )}
                  </View>

                  {/* Card do dia */}
                  <TouchableOpacity
                    style={styles.dayCardWrapper}
                    onPress={() => navigation.navigate("ClientsByDate", { date: item.date })}
                    activeOpacity={0.8}
                    disabled={!hasCharges}
                  >
                    <LinearGradient
                      colors={
                        (hasCharges
                          ? (item.isToday 
                              ? ['#FFD60A', '#FFC300']
                              : ['transparent', 'transparent'])
                          : ['transparent', 'transparent']
                        ) as [string, string, ...string[]]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[
                        styles.dayCard,
                        hasCharges && styles.dayCardActive
                      ]}
                    >
                      {/* Badge de status */}
                      {item.isToday && (
                        <View style={styles.todayBadge}>
                          <Text style={styles.todayText}>HOJE</Text>
                        </View>
                      )}
                      {item.isTomorrow && hasCharges && (
                        <View style={[styles.todayBadge, styles.tomorrowBadge]}>
                          <Text style={styles.todayText}>AMANHÃ</Text>
                        </View>
                      )}

                      <View style={styles.dayCardContent}>
                        <View style={styles.dateInfo}>
                          <Text style={[
                            styles.dayOfWeek,
                            !hasCharges && styles.dayOfWeekInactive
                          ]}>
                            {item.dayOfWeek}
                          </Text>
                          <Text style={[
                            styles.dateText,
                            !hasCharges && styles.dateTextInactive
                          ]}>
                            {item.date}
                          </Text>
                        </View>

                        <View style={styles.chargeInfo}>
                          {hasCharges ? (
                            <>
                              <View style={styles.chargeIconCircle}>
                                <Text style={styles.chargeIcon}>💰</Text>
                              </View>
                              <View>
                                <Text style={styles.chargeCount}>
                                  {item.count} {item.count === 1 ? 'cobrança' : 'cobranças'}
                                </Text>
                                <Text style={styles.chargeAction}>
                                  Toque para ver →
                                </Text>
                              </View>
                            </>
                          ) : (
                            <>
                              <View style={styles.emptyIconCircle}>
                                <Text style={styles.emptyIcon}>✓</Text>
                              </View>
                              <Text style={styles.emptyText}>
                                Sem cobranças
                              </Text>
                            </>
                          )}
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
      </LinearGradient>
    </>
  );
}

// 🎨 Estilos da Timeline
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
  },

  // Header
  headerWrapper: {
    marginBottom: 32,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#06ffa5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    gap: 16,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(6, 255, 165, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 28,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "600",
    marginTop: 2,
  },
  totalBadge: {
    borderRadius: 999,
    overflow: "hidden",
    shadowColor: "#06ffa5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  totalGradient: {
    width: 48,
    height: 48,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  totalNumber: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  // Timeline
  timeline: {
    paddingBottom: 32,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  
  // Track vertical
  timelineTrack: {
    width: 60,
    alignItems: "center",
  },
  timelineDot: {
    zIndex: 10,
  },
  dot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#0d1b2a",
  },
  dotActive: {
    borderColor: "#FFFFFF",
  },
  dotText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  timelineLine: {
    width: 3,
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginTop: 4,
  },
  timelineLineActive: {
    backgroundColor: "#06ffa5",
  },

  // Card do dia
  dayCardWrapper: {
    flex: 1,
    marginLeft: 8,
  },
  dayCard: {
    borderRadius: 20,
    padding: 24,
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  dayCardActive: {
    borderColor: "rgba(6, 255, 165, 0.3)",
    shadowColor: "#06ffa5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  todayBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FFD60A",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#1A1A1A",
  },
  tomorrowBadge: {
    backgroundColor: "#06ffa5",
    borderColor: "#FFFFFF",
  },
  todayText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#1A1A1A",
    letterSpacing: 0.5,
  },
  dayCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  
  // Date info
  dateInfo: {
    gap: 4,
  },
  dayOfWeek: {
    fontSize: 12,
    fontWeight: "700",
    color: "#06ffa5",
    letterSpacing: 1,
  },
  dayOfWeekInactive: {
    color: "rgba(255, 255, 255, 0.6)",
  },
  dateText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  dateTextInactive: {
    color: "rgba(255, 255, 255, 0.6)",
  },

  // Charge info
  chargeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chargeIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  chargeIcon: {
    fontSize: 20,
  },
  chargeCount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  chargeAction: {
    fontSize: 12,
    fontWeight: "600",
    color: "#00d9ff",
  },
  emptyIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIcon: {
    fontSize: 16,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.6)",
  },

  // Loading
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});