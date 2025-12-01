import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { getAllClients } from "../database/db";
import { formatCurrency } from "../utils/formatCurrency";

export default function ReportsScreen() {
  const [totalValue, setTotalValue] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalToReceive, setTotalToReceive] = useState(0);

  useEffect(() => {
    async function loadData() {
      const clients = await getAllClients();
      const totalValueCalc = clients.reduce(
        (acc: number, c) => acc + (c.value || 0),
        0
      );
      const totalPaidCalc = clients.reduce(
        (acc: number, c) => acc + (c.paid || 0),
        0
      );
      const totalToReceiveCalc = Math.max(0, totalValueCalc - totalPaidCalc);

      setTotalValue(totalValueCalc);
      setTotalPaid(totalPaidCalc);
      setTotalToReceive(totalToReceiveCalc);
    }

    loadData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* 🔹 O título foi removido — agora só aparece no cabeçalho */}
      <View style={styles.card}>
        <Text style={styles.label}>💰 Valor Total</Text>
        <Text style={styles.value}>{formatCurrency(totalValue)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>✅ Total Recebido</Text>
        <Text style={[styles.value, { color: "#34C759" }]}>
          {formatCurrency(totalPaid)}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>🕐 Total a Receber</Text>
        <Text style={[styles.value, { color: "#007AFF" }]}>
          {formatCurrency(totalToReceive)}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8FAFF",
  },
  card: {
    backgroundColor: "#FFF",
    padding: 18,
    marginBottom: 15,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
    color: "#111",
  },
});
