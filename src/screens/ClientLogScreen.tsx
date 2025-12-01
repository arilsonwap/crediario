import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getLogsByClient, getClientById, Log, Client } from "../database/db";

export default function ClientLogScreen() {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { clientId } = route.params as { clientId: number };

  const [logs, setLogs] = useState<Log[]>([]);
  const [client, setClient] = useState<Client | null>(null);

  // 🔄 Carrega cliente e logs
  useEffect(() => {
    const c = getClientById(clientId);
    setClient(c);
    setLogs(getLogsByClient(clientId));

    // 🧭 Define o título no topo com o nome do cliente
    if (c?.name) {
      navigation.setOptions({
        title: `📜 Histórico de ${c.name}`,
      });
    }
  }, [clientId]);

  // 📜 Renderiza cada item de log
  const renderItem = ({ item }: { item: Log }) => (
    <View style={s.card}>
      <Text style={s.desc}>{item.descricao}</Text>
      <Text style={s.date}>📅 {item.data}</Text>
    </View>
  );

  return (
    <LinearGradient colors={["#E8F0FF", "#FFFFFF"]} style={s.flex}>
      <View style={s.container}>
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={s.empty}>Nenhuma alteração registrada.</Text>}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </LinearGradient>
  );
}

// 🎨 Estilos
const s = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, padding: 20 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
  },
  desc: { fontSize: 16, color: "#333", fontWeight: "500", marginBottom: 4 },
  date: { fontSize: 13, color: "#666" },
  empty: { textAlign: "center", color: "#666", marginTop: 60 },
});
