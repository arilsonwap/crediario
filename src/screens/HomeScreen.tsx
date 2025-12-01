import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  Platform,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getUpcomingCharges } from "../database/db";
import HomeContent from "../components/HomeContent";

export default function HomeScreen() {
  const navigation: any = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [todayCount, setTodayCount] = useState(0);

  // 🔹 Carrega quantidade de cobranças de hoje
  const loadData = useCallback(async () => {
    const clients = await getUpcomingCharges();
    const today = new Date().toLocaleDateString("pt-BR");
    setTodayCount(clients.filter((c) => c.next_charge === today).length);
  }, []);

  // 🔄 Recarrega sempre que voltar pra tela
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // 🔁 Puxa pra atualizar
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  // ✅ Abre lista de clientes com cobrança de hoje
  const handleOpenTodayCharges = () => {
    const today = new Date().toLocaleDateString("pt-BR");
    navigation.navigate("ClientsByDate", { date: today });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#007AFF"]}
            tintColor="#007AFF"
          />
        }
      >
        {/* Espaço invisível pra não colar no topo */}
        <View style={styles.invisibleHeaderSpace} />

        {/* 🧩 Passa props para o conteúdo */}
        <HomeContent
          navigation={navigation}
          todayCount={todayCount}
          onPressHoje={handleOpenTodayCharges}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  invisibleHeaderSpace: {
    height: Platform.OS === "ios" ? 100 : 80,
    width: "100%",
  },
});
