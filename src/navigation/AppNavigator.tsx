import React, { useMemo } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { theme } from "../theme/theme";

// 🧩 Importação das telas
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ClientListScreen from "../screens/ClientListScreen";
import ClientDetailScreen from "../screens/ClientDetailScreen";
import EditClientScreen from "../screens/EditClientScreen";
import AddClientScreen from "../screens/AddClientScreen";
import BackupScreen from "../screens/BackupScreen";
import UpcomingChargesScreen from "../screens/UpcomingChargesScreen";
import ClientsByDateScreen from "../screens/ClientsByDateScreen";
import ClientLogScreen from "../screens/ClientLogScreen";
import PaymentHistoryScreen from "../screens/PaymentHistoryScreen";
import ReportsScreen from "../screens/ReportsScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  const screens = useMemo(
    () => ({
      LoginScreen,
      HomeScreen,
      ClientListScreen,
      ClientDetailScreen,
      EditClientScreen,
      AddClientScreen,
      BackupScreen,
      UpcomingChargesScreen,
      ClientsByDateScreen,
      ClientLogScreen,
      PaymentHistoryScreen,
      ReportsScreen,
    }),
    []
  );

  Object.entries(screens).forEach(([name, component]) => {
    if (!component) {
      throw new Error(
        `A tela "${name}" está indefinida. Verifique o export default do arquivo em src/screens/${name}.tsx`
      );
    }
  });

  // Exibe um loader enquanto verifica o estado de autenticação
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={user ? "Home" : "Login"}
      screenOptions={{
        headerStyle: { backgroundColor: "#007AFF" },
        headerTintColor: "#FFF",
        headerTitleStyle: { fontWeight: "bold" },
        headerTitleAlign: "center",
      }}
    >
      {!user ? (
        // 🔐 Tela de Login (não autenticado)
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        // 🏠 Telas do App (autenticado)
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
          />

          <Stack.Screen
            name="ClientList"
            component={ClientListScreen}
            options={{ title: "Clientes" }}
          />

          <Stack.Screen
            name="ClientDetail"
            component={ClientDetailScreen}
            options={{ title: "Detalhes do Cliente" }}
          />

          <Stack.Screen
            name="EditClient"
            component={EditClientScreen}
            options={{ title: "Editar Cliente" }}
          />

          <Stack.Screen
            name="AddClient"
            component={AddClientScreen}
            options={{ title: "Adicionar Cliente" }}
          />

          <Stack.Screen
            name="Backup"
            component={BackupScreen}
            options={{ title: "Gerenciar Backups" }}
          />

          <Stack.Screen
            name="UpcomingCharges"
            component={UpcomingChargesScreen}
            options={{ title: "Próximas Cobranças" }}
          />

          <Stack.Screen
            name="ClientsByDate"
            component={ClientsByDateScreen}
            options={{ title: "Clientes por Data" }}
          />

          <Stack.Screen
            name="PaymentHistory"
            component={PaymentHistoryScreen}
            options={{ title: "Histórico de Pagamentos" }}
          />

          <Stack.Screen
            name="ClientLog"
            component={ClientLogScreen}
            options={{
              title: "Histórico do Cliente",
            }}
          />

          <Stack.Screen
            name="Reports"
            component={ReportsScreen}
            options={{
              title: "Relatórios Financeiros",
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
