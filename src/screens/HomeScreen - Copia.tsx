import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Text,
  Animated,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { getUpcomingCharges } from "../database/db";
import TodayAlert from "../components/TodayAlert";
import HomeContent from "../components/HomeContent";
import { theme } from "../theme/theme";

export default function HomeScreen() {
  const navigation: any = useNavigation();
  const [todayCount, setTodayCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Animação para o alerta
  const fadeAnim = useState(new Animated.Value(0))[0];

  // 🔹 Função de carregamento otimizada
  const loadData = useCallback(async () => {
    try {
      setError(null);
      const clients = await getUpcomingCharges();
      const today = new Date().toLocaleDateString("pt-BR");
      const todayClients = clients.filter((c) => c.next_charge === today);
      setTodayCount(todayClients.length);
      
      // Anima entrada do alerta
      if (todayClients.length > 0) {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setError("Erro ao carregar cobranças");
    } finally {
      setIsLoading(false);
    }
  }, [fadeAnim]);

  // 🔹 Pull to refresh
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  }, [loadData]);

  // 🔹 Usa useFocusEffect (melhor prática para React Navigation)
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // 🔹 Data de hoje formatada
  const todayDate = new Date().toLocaleDateString("pt-BR");

  // 🔹 Loading state
  if (isLoading) {
    return (
      <LinearGradient
        colors={[theme.colors.background, "#FFFFFF"]}
        style={styles.gradient}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary || "#007AFF"} />
          <Text style={styles.loadingText}>Carregando cobranças...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[theme.colors.background, "#FFFFFF"]}
      style={styles.gradient}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary || "#007AFF"]}
            tintColor={theme.colors.primary || "#007AFF"}
            title="Atualizando..."
            titleColor={theme.colors.text || "#000"}
          />
        }
      >
        {/* 🔹 Mensagem de erro (se houver) */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <TouchableOpacity onPress={loadData} style={styles.retryButton}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 🔹 Alerta do dia com animação */}
        {todayCount > 0 && (
          <Animated.View style={[styles.alertBox, { opacity: fadeAnim }]}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate("ClientsByDate", { date: todayDate })
              }
              accessibilityLabel={`${todayCount} cliente(s) com cobrança hoje`}
              accessibilityRole="button"
              accessibilityHint="Toque para ver a lista de clientes"
            >
              <TodayAlert
                title="📅 Clientes com cobrança hoje"
                subtitle={`${todayCount} cliente(s) vencendo hoje`}
              />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* 🔹 Conteúdo principal do app */}
        <View style={styles.contentWrapper}>
          <HomeContent navigation={navigation} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

/* ===========================================================
   🎨 Estilos com tema único aplicado
=========================================================== */
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    minHeight: screenHeight,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  errorBox: {
    width: "100%",
    backgroundColor: "#FEE",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#F00",
  },
  errorText: {
    color: "#C00",
    fontSize: 14,
    marginBottom: 8,
  },
  retryButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#FFF",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#F00",
  },
  retryText: {
    color: "#F00",
    fontSize: 12,
    fontWeight: "600",
  },
  alertBox: {
    width: "100%",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  contentWrapper: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});