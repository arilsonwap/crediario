import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getAllClients, Client } from "../database/db";
import { formatCurrency } from "../utils/formatCurrency";

const ClientListScreen = ({ navigation }: any) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState<string>("");

  // 📦 Carregar clientes do banco
  const loadClients = useCallback(() => {
    try {
      const data = getAllClients();
      setClients(data);
    } catch (error) {
      console.error("❌ Erro ao carregar clientes:", error);
      Alert.alert("Erro", "Não foi possível carregar os clientes");
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  useFocusEffect(
    useCallback(() => {
      loadClients();
    }, [loadClients])
  );

  // 🔍 Filtro de pesquisa
  const filteredClients = clients.filter((c) => {
    const text = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(text) ||
      c.bairro?.toLowerCase().includes(text) ||
      c.numero?.toLowerCase().includes(text) ||
      c.referencia?.toLowerCase().includes(text) ||
      c.telefone?.toLowerCase().includes(text)
    );
  });

  // 🎯 Navegar para detalhes do cliente
  const handleClientPress = (client: Client) => {
    try {
      navigation.navigate("ClientDetail", { client });
    } catch (error) {
      console.error("❌ Erro na navegação:", error);
      Alert.alert("Erro", "Não foi possível abrir os detalhes do cliente");
    }
  };

  // 🧭 Atualiza o cabeçalho com contador
  const nav = useNavigation<any>();
  useEffect(() => {
    const total = clients.length;
    nav.setOptions({
      headerTitle: `Lista de clientes (${total})`,
      headerTitleAlign: "center",
      headerStyle: { backgroundColor: "#007AFF" },
      headerTintColor: "#fff",
      headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
      headerLeft: undefined,
    });
  }, [nav, clients]);

  return (
    <LinearGradient colors={["#E8F0FF", "#FFFFFF"]} style={styles.gradient}>
      <View style={styles.container}>
        {/* Campo de busca */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar cliente..."
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Lista de clientes */}
        <FlatList
          data={filteredClients}
          keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => handleClientPress(item)}
            >
              <Text style={styles.clientName}>{item.name}</Text>
              <Text style={styles.info}>💰 Valor: {formatCurrency(item.value)}</Text>
              <Text style={styles.info}>📞 {item.telefone || "Sem telefone"}</Text>
              <Text style={styles.info}>
                📅 Próx. Cobrança: {item.next_charge || "—"}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum cliente encontrado.</Text>
          }
        />
      </View>
    </LinearGradient>
  );
};

// 🎨 Estilos
const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, padding: 20 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
    elevation: 2,
  },
  searchInput: { flex: 1, marginLeft: 8, color: "#333", fontSize: 15 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  clientName: { fontSize: 18, fontWeight: "700", color: "#007AFF" },
  info: { fontSize: 15, color: "#444", marginTop: 4 },
  emptyText: { textAlign: "center", color: "#666", fontSize: 16, marginTop: 50 },
});

export default ClientListScreen;
