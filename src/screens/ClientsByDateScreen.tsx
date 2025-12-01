import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { getUpcomingCharges, type Client } from "../database/db";
import { formatCurrency } from "../utils/formatCurrency";

export default function ClientsByDateScreen({ route, navigation }: any) {
  const { date } = route.params;
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    // Define título do cabeçalho dinamicamente
    navigation.setOptions({ title: "Cobranças do Dia" });
    loadClients();
  }, []);

  async function loadClients() {
    try {
      const allClients = await getUpcomingCharges();
      const filtered = allClients.filter((c) => c.next_charge === date);
      setClients(filtered);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    }
  }

  const handleClientPress = (client: Client) => {
    navigation.navigate("ClientDetail", { client });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Apenas a data abaixo do cabeçalho */}
      <Text style={styles.date}>{date}</Text>

      {/* Contador */}
      <View style={styles.counter}>
        <Text style={styles.counterNumber}>{clients.length}</Text>
        <Text style={styles.counterLabel}>
          {clients.length === 1
            ? "cliente vencendo neste dia"
            : "clientes vencendo neste dia"}
        </Text>
      </View>

      {/* Lista */}
      {clients.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>Nenhum cliente com cobrança nesta data</Text>
        </View>
      ) : (
        <FlatList
          data={clients}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => handleClientPress(item)}
              activeOpacity={0.8}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>

              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>
                {item.next_charge && (
                  <Text style={styles.dateSmall}>{item.next_charge}</Text>
                )}
              </View>

              <Text style={styles.value}>
                {formatCurrency(item.value || 0)}
              </Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}
    </View>
  );
}

/* 🎨 Estilo minimalista */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  date: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 20,
  },
  counter: {
    alignItems: "center",
    marginBottom: 20,
  },
  counterNumber: {
    fontSize: 36,
    fontWeight: "900",
    color: "#007AFF",
  },
  counterLabel: {
    fontSize: 14,
    color: "#444",
    marginTop: 4,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8FA",
    borderRadius: 12,
    padding: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  info: { flex: 1 },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  dateSmall: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
  },
  value: {
    fontSize: 15,
    fontWeight: "700",
    color: "#007AFF",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 15,
    color: "#777",
    textAlign: "center",
  },
});
