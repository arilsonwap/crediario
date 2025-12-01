import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { addClient } from "../database/db";
import { parseBRL } from "../utils/formatCurrency";

function formatDateBR(date: Date | null) {
  if (!date) return "";
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export default function AddClientScreen() {
  const navigation = useNavigation<any>();

  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [bairro, setBairro] = useState("");
  const [numero, setNumero] = useState("");
  const [referencia, setReferencia] = useState("");
  const [telefone, setTelefone] = useState("");
  const [nextChargeDate, setNextChargeDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !value.trim()) {
      Alert.alert("Campos obrigatórios", "Nome e valor são obrigatórios.");
      return;
    }

    try {
      const numericValue = parseBRL(value);
      await addClient({
        name: name.trim(),
        value: numericValue,
        bairro: bairro.trim() || null,
        numero: numero.trim() || null,
        referencia: referencia.trim() || null,
        telefone: telefone.trim() || null,
        next_charge: nextChargeDate ? formatDateBR(nextChargeDate) : null,
      });
      Alert.alert("✅ Sucesso", "Cliente adicionado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("❌ Erro ao adicionar cliente:", error);
      Alert.alert("Erro", "Não foi possível adicionar o cliente.");
    }
  };

  const openDatePicker = () => setShowPicker(true);
  const onChangeDate = (_event: any, selected?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (selected) {
      const clean = new Date(
        selected.getFullYear(),
        selected.getMonth(),
        selected.getDate()
      );
      setNextChargeDate(clean);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Nome do cliente"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Valor total (R$)"
            keyboardType="numeric"
            value={value}
            onChangeText={setValue}
          />
          <TextInput
            style={styles.input}
            placeholder="Bairro"
            value={bairro}
            onChangeText={setBairro}
          />
          <TextInput
            style={styles.input}
            placeholder="Número"
            value={numero}
            onChangeText={setNumero}
          />
          <TextInput
            style={styles.input}
            placeholder="Referência"
            value={referencia}
            onChangeText={setReferencia}
          />
          <TextInput
            style={styles.input}
            placeholder="Telefone"
            keyboardType="phone-pad"
            value={telefone}
            onChangeText={setTelefone}
          />

          {/* 📅 Seletor de Data */}
          <TouchableOpacity
            style={styles.dateButton}
            onPress={openDatePicker}
            activeOpacity={0.8}
          >
            <Text style={styles.dateLabel}>Data da próxima cobrança</Text>
            <Text style={styles.dateValue}>
              {nextChargeDate
                ? formatDateBR(nextChargeDate)
                : "Selecionar no calendário"}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={nextChargeDate ?? new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "calendar"}
              onChange={onChangeDate}
              minimumDate={new Date(2000, 0, 1)}
              maximumDate={new Date(2100, 11, 31)}
            />
          )}

          {/* 🟦 Botão azul igual ao cabeçalho */}
          <TouchableOpacity
            style={styles.saveButton}
            activeOpacity={0.8}
            onPress={handleSave}
          >
            <Text style={styles.saveText}>Adicionar Cliente</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* 🎨 Estilos simplificados e alinhados ao layout principal */
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: "#FFF",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  input: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#000",
    marginBottom: 12,
  },
  dateButton: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  dateLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#007AFF", // 🔵 mesma cor do cabeçalho
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
