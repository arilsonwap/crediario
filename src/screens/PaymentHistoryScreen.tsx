import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  getPaymentsByClient,
  deletePayment,
  getClientById,
  updateClient,
  Client,
  Payment,
} from "../database/db";
import { formatCurrency } from "../utils/formatCurrency";

export default function PaymentHistoryScreen() {
  const { params }: any = useRoute();
  const navigation = useNavigation<any>();
  const { clientId } = params;

  const [client, setClient] = useState<Client | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);

  // 🔄 Carrega cliente e pagamentos
  useEffect(() => {
    const c = getClientById(clientId);
    setClient(c);
    setPayments(getPaymentsByClient(clientId));
  }, [clientId]);

  // 🗑️ Excluir pagamento
  const handleDelete = (payment: Payment) => {
    if (!client) return;

    Alert.alert(
      "Excluir pagamento",
      `Remover ${formatCurrency(payment.valor)} de ${payment.data}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            try {
              // Apaga do banco e reverte o valor
              deletePayment(payment.id!);

              const updated = { ...client, paid: (client.paid || 0) - payment.valor };
              updateClient(updated);
              setClient(updated);

              // Atualiza lista local
              setPayments((prev) => prev.filter((p) => p.id !== payment.id));

              // Mostra confirmação
              Alert.alert("✅ Sucesso", "Pagamento removido e saldo ajustado.", [
                {
                  text: "OK",
                  onPress: () => {
                    // Volta para tela de detalhes atualizada
                    navigation.navigate("ClientDetail", { client: updated });
                  },
                },
              ]);
            } catch (error) {
              console.error("Erro ao excluir pagamento:", error);
              Alert.alert("Erro", "Não foi possível excluir o pagamento.");
            }
          },
        },
      ]
    );
  };

  // 💳 Renderiza item da lista
  const renderItem = ({ item }: { item: Payment }) => (
    <View style={s.card}>
      <View>
        <Text style={s.value}>{formatCurrency(item.valor)}</Text>
        <Text style={s.date}>📅 {item.data}</Text>
      </View>
      <TouchableOpacity style={s.delBtn} onPress={() => handleDelete(item)}>
        <Text style={s.delText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={["#E8F0FF", "#FFFFFF"]} style={s.flex}>
      <View style={s.container}>
        <Text style={s.title}>💳 Histórico de Pagamentos</Text>
        <Text style={s.sub}>{client?.name}</Text>

        <FlatList
          data={payments}
          keyExtractor={(i) => i.id?.toString() ?? Math.random().toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={s.empty}>Nenhum pagamento registrado.</Text>}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity onPress={() => navigation.goBack()} style={s.btn}>
          <LinearGradient colors={["#007AFF", "#0A84FF"]} style={s.btnGrad}>
            <Text style={s.btnText}>⬅ Voltar</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

// 🎨 Estilos
const s = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "800", color: "#007AFF", textAlign: "center" },
  sub: { textAlign: "center", color: "#555", marginBottom: 20 },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
  },
  value: { fontSize: 18, fontWeight: "700", color: "#34C759" },
  date: { fontSize: 14, color: "#555", marginTop: 2 },
  delBtn: { backgroundColor: "#FF3B30", borderRadius: 8, padding: 8 },
  delText: { color: "#FFF", fontSize: 18 },
  empty: { textAlign: "center", marginTop: 50, color: "#666" },
  btn: { marginTop: 15, borderRadius: 16, overflow: "hidden" },
  btnGrad: { paddingVertical: 12, alignItems: "center" },
  btnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});
