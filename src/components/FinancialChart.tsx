import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";

type Props = {
  totalPaid: number;
  totalToReceive: number;
};

export default function FinancialChart({ totalPaid, totalToReceive }: Props) {
  const data = [
    { name: "Recebido", value: totalPaid },
    { name: "A Receber", value: totalToReceive },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>📊 Desempenho Financeiro</Text>

      <View style={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            {/* Eixo X */}
            <XAxis
              dataKey="name"
              tick={{ fontSize: 14, fill: "#555" }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            {/* Eixo Y */}
            <YAxis
              tickFormatter={(v) => `R$ ${v}`}
              tick={{ fontSize: 12, fill: "#666" }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            {/* Barras */}
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              <Cell fill="#34C759" /> {/* Verde - Recebido */}
              <Cell fill="#007AFF" /> {/* Azul - A Receber */}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </View>
    </View>
  );
}

/* ========================= Styles ========================= */
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  chartWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});
