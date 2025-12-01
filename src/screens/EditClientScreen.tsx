import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { updateClient } from "../database/db";
import { formatCurrency, parseBRL } from "../utils/formatCurrency";

export default function EditClientScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { client } = route.params as any;

  const [name, setName] = useState(client.name);
  const [value, setValue] = useState(formatCurrency(client.value));
  const [bairro, setBairro] = useState(client.bairro || "");
  const [numero, setNumero] = useState(client.numero || "");
  const [referencia, setReferencia] = useState(client.referencia || "");
  const [telefone, setTelefone] = useState(client.telefone || "");
  const [alterado, setAlterado] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !value.trim()) {
      Alert.alert("Campos obrigatórios", "Nome e valor são obrigatórios.");
      return;
    }

    try {
      const numericValue = parseBRL(value);

      await updateClient({
        id: client.id,
        name: name.trim(),
        value: numericValue,
        bairro: bairro.trim(),
        numero: numero.trim(),
        referencia: referencia.trim(),
        telefone: telefone.trim(),
        next_charge: client.next_charge,
        paid: client.paid,
      });

      Alert.alert("✅ Sucesso", "Cliente atualizado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      Alert.alert("❌ Erro", "Não foi possível atualizar o cliente.");
    }
  };

  const handleGoBack = () => {
    if (alterado) {
      Alert.alert(
        "Descartar alterações?",
        "Você fez mudanças que ainda não foram salvas.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Descartar", style: "destructive", onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>✏️ Editar Cliente</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={(text) => {
          setName(text);
          setAlterado(true);
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Valor (R$)"
        keyboardType="numeric"
        value={value}
        onChangeText={(text) => {
          setValue(text);
          setAlterado(true);
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Bairro"
        value={bairro}
        onChangeText={(text) => {
          setBairro(text);
          setAlterado(true);
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Número"
        keyboardType="numeric"
        value={numero}
        onChangeText={(text) => {
          setNumero(text);
          setAlterado(true);
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Referência"
        value={referencia}
        onChangeText={(text) => {
          setReferencia(text);
          setAlterado(true);
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Telefone"
        keyboardType="phone-pad"
        value={telefone}
        onChangeText={(text) => {
          setTelefone(text);
          setAlterado(true);
        }}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>💾 Salvar Alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={handleGoBack}>
        <Text style={styles.cancelText}>❌ Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ===========================================================
   🎨 Estilos modernos e compatíveis com Expo Go
=========================================================== */
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F8FAFF",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#007AFF",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E3E8F1",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
  },
  cancelButton: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    marginTop: 10,
  },
  cancelText: {
    color: "#333",
    fontSize: 17,
    fontWeight: "600",
  },
});
