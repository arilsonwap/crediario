import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Animated,
  Modal,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import {
  deleteClient,
  updateClient,
  addPayment,
  Client,
  getClientById,
} from "../database/db";
import { formatCurrency } from "../utils/formatCurrency";

export default function ClientDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [showBaixaModal, setShowBaixaModal] = useState(false);
  const [valorBaixa, setValorBaixa] = useState("");
  const [successMsg] = useState(new Animated.Value(0));
  const [msgText, setMsgText] = useState("");

  // ============================================================
  // 🔄 Carrega cliente (inicial e atualizado via navegação)
  // ============================================================
  useEffect(() => {
    const params = route.params as { client?: Client; clientId?: number } | undefined;

    if (params?.client) {
      setClient(params.client);
      setLoading(false);
      return;
    }

    if (params?.clientId) {
      const c = getClientById(params.clientId);
      if (c) setClient(c);
      setLoading(false);
    }
  }, [route.params]);

  // ============================================================
  // 🧭 Atualização automática ao retornar de outras telas
  // ============================================================
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (client?.id) {
        const updated = getClientById(client.id);
        if (updated) setClient(updated);
      }
    });
    return unsubscribe;
  }, [navigation, client?.id]);

  // ============================================================
  // ⚙️ Utilidades
  // ============================================================
  const formatDate = (date: Date) =>
    `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;

  const showSuccess = (text: string) => {
    setMsgText(text);
    Animated.sequence([
      Animated.timing(successMsg, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(successMsg, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  // ============================================================
  // 📅 Definir próxima cobrança
  // ============================================================
  const handleChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowPicker(false);
    if (event.type === "dismissed") return;

    if (event.type === "set" && selectedDate && client) {
      const formatted = formatDate(selectedDate);
      Alert.alert("Confirmar data", `Definir próxima cobrança para ${formatted}?`, [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () => {
            const updated = { ...client, next_charge: formatted };
            setClient(updated);
            updateClient(updated);
            showSuccess(`✅ Próxima cobrança: ${formatted}`);
          },
        },
      ]);
    }
  };

  // ============================================================
  // 🗑️ Excluir cliente
  // ============================================================
  const handleDelete = () => {
    if (!client) return;
    Alert.alert(
      "Excluir cliente",
      `Tem certeza que deseja excluir "${client.name}"?\n\n⚠️ Todos os pagamentos serão apagados.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            deleteClient(client.id!);
            Alert.alert("✅ Sucesso", "Cliente excluído!");
            navigation.goBack();
          },
        },
      ]
    );
  };

  // ============================================================
  // 💰 Registrar baixa (pagamento) — AGORA COM VALIDAÇÃO
  // ============================================================
  const confirmarBaixa = () => {
    if (!client) return;

    const valor = parseFloat(valorBaixa.replace(",", "."));
    if (isNaN(valor) || valor <= 0) {
      Alert.alert("Erro", "Informe um valor válido.");
      return;
    }

    const restante = (client.value || 0) - (client.paid || 0);

    // ⚠️ nova verificação
    if (valor > restante) {
      Alert.alert(
        "Valor maior que o devido",
        `O valor informado (R$ ${valor.toFixed(2)}) é maior do que o valor restante (R$ ${restante.toFixed(
          2
        )}).\n\nCorrija antes de prosseguir.`
      );
      return; // 🚫 impede a baixa
    }

    try {
      addPayment(client.id!, valor);
      const updated = { ...client, paid: (client.paid || 0) + valor };
      setClient(updated);
      setShowBaixaModal(false);
      showSuccess(`💰 Pagamento de R$ ${valor.toFixed(2)} registrado!`);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível registrar o pagamento.");
    }
  };

  // ============================================================
  // ⏳ Loading / Cliente inexistente
  // ============================================================
  if (loading)
    return (
      <View style={s.center}>
        <Text>Carregando...</Text>
      </View>
    );

  if (!client)
    return (
      <View style={s.center}>
        <Text style={s.error}>Cliente não encontrado.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.btnBack}>
          <Text style={s.btnText}>⬅ Voltar</Text>
        </TouchableOpacity>
      </View>
    );

  // ============================================================
  // 🧾 Render principal
  // ============================================================
  const restante = (client.value || 0) - (client.paid || 0);

  return (
    <LinearGradient colors={["#E8F0FF", "#FFF"]} style={s.flex}>
      <ScrollView contentContainerStyle={s.container}>
        <Animated.View style={[s.successBox, { opacity: successMsg }]}>
          <Text style={s.successText}>{msgText}</Text>
        </Animated.View>

        <Text style={s.title}>👤 {client.name}</Text>

        <View style={s.card}>
          <Text style={s.label}>💰 Valor Total</Text>
          <Text style={s.value}>{formatCurrency(client.value || 0)}</Text>
        </View>

        <View style={s.card}>
          <Text style={s.label}>✅ Pago</Text>
          <Text style={[s.value, { color: "#34C759" }]}>{formatCurrency(client.paid || 0)}</Text>
        </View>

        <View style={s.card}>
          <Text style={s.label}>💸 Restante</Text>
          <Text
            style={[
              s.value,
              { color: restante > 0 ? "#FF9500" : "#007AFF" },
            ]}
          >
            {formatCurrency(restante >= 0 ? restante : 0)}
          </Text>
        </View>

        <View style={s.card}>
          <Text style={s.label}>📅 Próxima Cobrança</Text>
          <Text style={s.value}>{client.next_charge || "Não definida"}</Text>
        </View>

        {/* 📅 Botões de ação */}
        <TouchableOpacity onPress={() => setShowPicker(true)} style={s.btn}>
          <LinearGradient colors={["#34C759", "#30D158"]} style={s.btnGrad}>
            <Text style={s.btnText}>📅 Definir Próxima Cobrança</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowBaixaModal(true)} style={s.btn}>
          <LinearGradient colors={["#FF9500", "#FFB340"]} style={s.btnGrad}>
            <Text style={s.btnText}>💰 Dar Baixa no Valor</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("PaymentHistory", { clientId: client.id })}
          style={s.btn}
        >
          <LinearGradient colors={["#0A84FF", "#5AC8FA"]} style={s.btnGrad}>
            <Text style={s.btnText}>💳 Histórico de Pagamentos</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("ClientLog", { clientId: client.id })}
          style={s.btn}
        >
          <LinearGradient colors={["#5856D6", "#7D7AFF"]} style={s.btnGrad}>
            <Text style={s.btnText}>📜 Ver Log de Alterações</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("EditClient", { client })} style={s.btn}>
          <LinearGradient colors={["#007AFF", "#0A84FF"]} style={s.btnGrad}>
            <Text style={s.btnText}>✏️ Editar</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDelete} style={s.btn}>
          <LinearGradient colors={["#FF3B30", "#FF453A"]} style={s.btnGrad}>
            <Text style={s.btnText}>🗑️ Excluir</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Modal de baixa */}
        <Modal visible={showBaixaModal} transparent animationType="fade">
          <View style={s.modalBg}>
            <View style={s.modal}>
              <Text style={s.modalTitle}>💰 Dar Baixa</Text>
              <TextInput
                style={s.input}
                placeholder="Ex: 100.00"
                keyboardType="decimal-pad"
                value={valorBaixa}
                onChangeText={setValorBaixa}
              />
              <View style={s.modalBtns}>
                <TouchableOpacity style={s.cancelBtn} onPress={() => setShowBaixaModal(false)}>
                  <Text style={s.cancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.okBtn} onPress={confirmarBaixa}>
                  <LinearGradient colors={["#FF9500", "#FFB340"]} style={s.btnGrad}>
                    <Text style={s.btnText}>Confirmar</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {showPicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={handleChangeDate}
          />
        )}
      </ScrollView>
    </LinearGradient>
  );
}

// ============================================================
// 🎨 Estilos
// ============================================================
const s = StyleSheet.create({
  flex: { flex: 1 },
  container: { flexGrow: 1, alignItems: "center", padding: 25 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "800", color: "#007AFF", marginBottom: 20 },
  card: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  label: { fontSize: 15, color: "#555", marginBottom: 4, fontWeight: "600" },
  value: { fontSize: 17, fontWeight: "700", color: "#111" },
  btn: { width: "100%", marginVertical: 6, borderRadius: 16, overflow: "hidden" },
  btnGrad: { paddingVertical: 14, alignItems: "center" },
  btnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  successBox: { backgroundColor: "#34C759", padding: 10, borderRadius: 10, marginBottom: 15 },
  successText: { color: "#FFF", fontWeight: "700" },
  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modal: { backgroundColor: "#FFF", borderRadius: 20, padding: 24, width: "90%", maxWidth: 400 },
  modalTitle: { fontSize: 22, fontWeight: "800", color: "#007AFF", textAlign: "center", marginBottom: 12 },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  modalBtns: { flexDirection: "row", gap: 10 },
  cancelBtn: { flex: 1, backgroundColor: "#E0E0E0", alignItems: "center", paddingVertical: 12, borderRadius: 12 },
  cancelText: { color: "#333", fontWeight: "700" },
  okBtn: { flex: 1, borderRadius: 12, overflow: "hidden" },
  btnBack: { backgroundColor: "#007AFF", padding: 12, borderRadius: 10 },
  error: { fontSize: 18, color: "#FF3B30", marginBottom: 10 },
});
