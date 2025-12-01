import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { backupLocal, backupFirebase } from "../utils/backup";

export default function BackupScreen() {
  const handleBackupLocal = async () => {
    try {
      await backupLocal();
      Alert.alert("✅ Sucesso", "Backup local criado com sucesso!");
    } catch {
      Alert.alert("❌ Erro", "Falha ao criar backup local.");
    }
  };

  const handleBackupNuvem = async () => {
    try {
      await backupFirebase("usuario_demo");
      Alert.alert("✅ Sucesso", "Backup enviado para a nuvem!");
    } catch {
      Alert.alert("❌ Erro", "Falha ao enviar backup para a nuvem.");
    }
  };

  const handleRestaurarLocal = () =>
    Alert.alert("🚧 Em breve", "Função de restauração local ainda não implementada.");

  const handleRestaurarNuvem = () =>
    Alert.alert("🚧 Em breve", "Função de restauração pela nuvem ainda não implementada.");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.subtitle}>Escolha uma das opções abaixo:</Text>

        <TouchableOpacity
          style={[styles.button, styles.localButton]}
          onPress={handleBackupLocal}
        >
          <Ionicons name="save-outline" size={22} color="#FFF" style={styles.icon} />
          <Text style={styles.buttonText}>Backup Local</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.restoreLocal]}
          onPress={handleRestaurarLocal}
        >
          <Ionicons name="refresh-outline" size={22} color="#FFF" style={styles.icon} />
          <Text style={styles.buttonText}>Restaurar Local</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cloudButton]}
          onPress={handleBackupNuvem}
        >
          <Ionicons name="cloud-upload-outline" size={22} color="#FFF" style={styles.icon} />
          <Text style={styles.buttonText}>Backup Nuvem</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.restoreCloud]}
          onPress={handleRestaurarNuvem}
        >
          <Ionicons name="cloud-download-outline" size={22} color="#FFF" style={styles.icon} />
          <Text style={styles.buttonText}>Restaurar Nuvem</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* 🎨 Estilos: layout limpo, mas mantendo cores originais */
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFF",
    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 25,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 14,
    marginBottom: 14,
  },
  localButton: {
    backgroundColor: "#007AFF", // azul vibrante
  },
  restoreLocal: {
    backgroundColor: "#FF9500", // laranja suave
  },
  cloudButton: {
    backgroundColor: "#5856D6", // roxo azulado
  },
  restoreCloud: {
    backgroundColor: "#34C759", // verde sucesso
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  icon: {
    marginRight: 8,
  },
});
