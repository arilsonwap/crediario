import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/contexts/AuthContext";
import { ensureDatabaseDirectory, initDB, fixDatabaseStructure } from "./src/database/db";
import { theme } from "./src/theme/theme";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log("🟡 Preparando diretório SQLite...");
        await ensureDatabaseDirectory(); // ⚠️ Cria pasta SQLite (Android precisa)
        console.log("🟡 Inicializando banco de dados...");
        initDB(); // ⚡ Cria tabelas primeiro
        console.log("🟡 Verificando e corrigindo estrutura...");
        fixDatabaseStructure(); // 🔧 Corrige colunas depois que tabelas existem
        console.log("✅ Banco pronto e estrutura verificada!");
        setReady(true);
      } catch (error) {
        console.error("❌ Erro ao inicializar o banco:", error);
      }
    };

    initialize();
  }, []);

  if (!ready) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer
          theme={{
            dark: true,
            colors: {
              primary: theme.colors.primary,
              background: theme.colors.background,
              card: theme.colors.background,
              text: theme.colors.text,
              border: theme.colors.cardBorder,
              notification: theme.colors.danger,
            },
            fonts: {
              regular: {
                fontFamily: 'System',
                fontWeight: '400',
              },
              medium: {
                fontFamily: 'System',
                fontWeight: '500',
              },
              bold: {
                fontFamily: 'System',
                fontWeight: '700',
              },
              heavy: {
                fontFamily: 'System',
                fontWeight: '900',
              },
            },
          }}
        >
          <StatusBar style="light" />
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
});