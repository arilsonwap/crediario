import React, { useState, useCallback, useLayoutEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  Text,
  Platform,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getUpcomingCharges } from "../database/db";
import HomeContent from "../components/HomeContent";

export default function HomeScreen() {
  const navigation: any = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [todayCount, setTodayCount] = useState(0);

  // 🔹 Formata a data para exibição (Ex: "Segunda, 12 de Outubro")
  const todayDate = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  // Capitaliza a primeira letra
  const formattedDate = todayDate.charAt(0).toUpperCase() + todayDate.slice(1);

  // 🎨 Configuração do Header (Dashboard)
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Painel de Controle",
      headerStyle: { 
        backgroundColor: "#0056b3", 
        elevation: 0, 
        shadowOpacity: 0 
      },
      headerTintColor: "#fff",
      headerTitleStyle: { fontWeight: "700" },
      headerLeft: () => (
        <Ionicons 
          name="grid-outline" 
          size={22} 
          color="#FFF" 
          style={{ marginLeft: 15 }} 
        />
      ),
    });
  }, [navigation]);

  // 🔹 Carrega quantidade de cobranças de hoje
  const loadData = useCallback(async () => {
    try {
      const clients = await getUpcomingCharges();
      // Ajuste para garantir formato DD/MM/AAAA
      const today = new Date();
      const todayStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
      
      setTodayCount(clients.filter((c) => c.next_charge === todayStr).length);
    } catch (error) {
      console.error("Erro ao carregar home:", error);
    }
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
    const today = new Date();
    const todayStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    navigation.navigate("ClientsByDate", { date: todayStr });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0056b3" />
      
      {/* Fundo Decorativo Superior (Continuação do Header) */}
      <View style={styles.headerExtension} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#0056b3"]} // Azul da marca
            tintColor="#0056b3"
          />
        }
      >
        {/* Seção de Boas Vindas */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Olá, Usuário 👋</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>

        {/* Container Principal do Conteúdo */}
        <View style={styles.mainCard}>
          <HomeContent
            navigation={navigation}
            todayCount={todayCount}
            onPressHoje={handleOpenTodayCharges}
          />
        </View>
        
        {/* Espaço extra no final */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor: "#F1F5F9" // Fundo cinza padrão
  },
  headerExtension: {
    height: 100,
    backgroundColor: "#0056b3",
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  welcomeContainer: {
    marginBottom: 20,
      marginTop: 25,   // ⬅️ Aumente para 30, 40, 50...
    zIndex: 1,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
  },
  dateText: {
    fontSize: 14,
    color: "#BFDBFE", // Azul bem claro
    marginTop: 4,
  },
  mainCard: {
    // Isso garante que o HomeContent tenha um lugar bonito para ficar
    // Se o HomeContent já tiver cards, isso serve como container transparente
    flex: 1,
  }
});