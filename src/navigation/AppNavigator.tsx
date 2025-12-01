import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// 🧩 Importação das telas
import HomeScreen from "../screens/HomeScreen";
import ClientListScreen from "../screens/ClientListScreen";
import ClientDetailScreen from "../screens/ClientDetailScreen";
import EditClientScreen from "../screens/EditClientScreen";
import AddClientScreen from "../screens/AddClientScreen";
import BackupScreen from "../screens/BackupScreen";
import UpcomingChargesScreen from "../screens/UpcomingChargesScreen";
import ClientsByDateScreen from "../screens/ClientsByDateScreen"; // ✅ adicionada
import ClientLogScreen from "../screens/ClientLogScreen";
import PaymentHistoryScreen from "../screens/PaymentHistoryScreen";
import ReportsScreen from "../screens/ReportsScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: "#007AFF" },
        headerTintColor: "#FFF",
        headerTitleStyle: { fontWeight: "bold" },
        headerTitleAlign: "center", // ✅ centraliza todos os títulos
      }}
    >
      {/* 🏠 Tela Inicial */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      {/* 📋 Lista de Clientes */}
      <Stack.Screen
        name="ClientList"
        component={ClientListScreen}
        options={{ title: "Clientes" }}
      />

      {/* 👤 Detalhes do Cliente */}
      <Stack.Screen
        name="ClientDetail"
        component={ClientDetailScreen}
        options={{ title: "Detalhes do Cliente" }}
      />

      {/* ✏️ Editar Cliente */}
      <Stack.Screen
        name="EditClient"
        component={EditClientScreen}
        options={{ title: "Editar Cliente" }}
      />

      {/* ➕ Adicionar Cliente */}
      <Stack.Screen
        name="AddClient"
        component={AddClientScreen}
        options={{ title: "Adicionar Cliente" }}
      />

      {/* 💾 Gerenciar Backups */}
      <Stack.Screen
        name="Backup"
        component={BackupScreen}
        options={{ title: "Gerenciar Backups" }}
      />

      {/* 📅 Próximas Cobranças */}
      <Stack.Screen
        name="UpcomingCharges"
        component={UpcomingChargesScreen}
        options={{ title: "Próximas Cobranças" }}
      />

      {/* 👥 Clientes por Data ✅ nova rota */}
      <Stack.Screen
        name="ClientsByDate"
        component={ClientsByDateScreen}
        options={{ title: "Clientes por Data" }}
      />

      {/* 💳 Histórico de Pagamentos */}
      <Stack.Screen
        name="PaymentHistory"
        component={PaymentHistoryScreen}
        options={{ title: "Histórico de Pagamentos" }}
      />

      {/* 🧾 Log de Alterações do Cliente */}
      <Stack.Screen
        name="ClientLog"
        component={ClientLogScreen}
        options={{
          title: "Histórico do Cliente",
        }}
      />

      {/* 📊 Relatórios Financeiros */}
      <Stack.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          title: "Relatórios Financeiros",
        }}
      />
    </Stack.Navigator>
  );
}
