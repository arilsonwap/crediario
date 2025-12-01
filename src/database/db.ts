import * as SQLite from "expo-sqlite";

// ============================================================
// 🧩 Tipos
// ============================================================
export type Client = {
  id?: number;
  name: string;
  value: number;
  bairro?: string | null;
  numero?: string | null;
  referencia?: string | null;
  telefone?: string | null;
  next_charge?: string | null;
  paid?: number;
};

export type Payment = {
  id?: number;
  clientId?: number;
  client_id?: number;
  data: string;
  valor: number;
};

export type Log = {
  id?: number;
  clientId: number;
  data: string;
  descricao: string;
};

// ============================================================
// 🗄️ Conexão com o banco
// ============================================================
const db = SQLite.openDatabaseSync("crediario.db");

// ============================================================
// ⚙️ Utilidades
// ============================================================
const formatDate = (date = new Date()) =>
  `${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}/${date.getFullYear()}`;

function safeRun(action: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ ${action} concluído.`);
  } catch (e) {
    console.error(`❌ Erro ao ${action}:`, e);
  }
}

function ensureColumn(table: string, name: string, def: string) {
  const cols = db.getAllSync(`PRAGMA table_info(${table})`).map((c: any) => c.name);
  if (!cols.includes(name)) {
    db.runSync(`ALTER TABLE ${table} ADD COLUMN ${def};`);
    console.log(`🛠️ Coluna '${name}' adicionada em ${table}.`);
  }
}

// ============================================================
// 🧱 Estrutura das tabelas
// ============================================================
const TABLES = {
  clients: `
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      value REAL NOT NULL,
      bairro TEXT,
      numero TEXT,
      referencia TEXT,
      telefone TEXT,
      next_charge TEXT,
      paid REAL DEFAULT 0
    );
  `,
  payments: `
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      data TEXT NOT NULL,
      valor REAL NOT NULL,
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    );
  `,
  logs: `
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clientId INTEGER NOT NULL,
      data TEXT NOT NULL,
      descricao TEXT NOT NULL,
      FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE
    );
  `,
};

// ============================================================
// 🏗️ Inicialização e Correção
// ============================================================
export function initDB(): void {
  safeRun("inicializar banco de dados", () => {
    Object.values(TABLES).forEach(sql => db.execSync(sql));
  });
}

export function fixDatabaseStructure(): void {
  safeRun("corrigir estrutura do banco", () => {
    ensureColumn("clients", "paid", "REAL DEFAULT 0");
    ensureColumn("clients", "next_charge", "TEXT");

    const paymentsCols = db.getAllSync("PRAGMA table_info(payments)").map((c: any) => c.name);
    if (paymentsCols.includes("clientId") && !paymentsCols.includes("client_id")) {
      db.execSync(`
        CREATE TABLE payments_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          client_id INTEGER NOT NULL,
          data TEXT NOT NULL,
          valor REAL NOT NULL,
          FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
        );
      `);
      db.execSync(`
        INSERT INTO payments_new (id, client_id, data, valor)
        SELECT id, clientId, data, valor FROM payments;
      `);
      db.execSync("DROP TABLE payments;");
      db.execSync("ALTER TABLE payments_new RENAME TO payments;");
      console.log("🔄 Tabela payments migrada.");
    }
  });
}

// ============================================================
// 📜 LOGS
// ============================================================
export function addLog(clientId: number, descricao: string): void {
  if (!clientId) return;
  const data = `${formatDate()} ${new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
  db.runSync("INSERT INTO logs (clientId, data, descricao) VALUES (?, ?, ?);", [
    clientId,
    data,
    descricao,
  ]);
}

export function getLogsByClient(clientId: number): Log[] {
  if (!clientId) return [];
  return db.getAllSync("SELECT * FROM logs WHERE clientId = ? ORDER BY id DESC;", [clientId]) as Log[];
}

// ============================================================
// 👥 CLIENTES
// ============================================================
export function addClient(client: Client): void {
  db.runSync(
    `INSERT INTO clients (name, value, bairro, numero, referencia, telefone, next_charge, paid)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      client.name,
      client.value ?? 0,
      client.bairro ?? null,
      client.numero ?? null,
      client.referencia ?? null,
      client.telefone ?? null,
      client.next_charge ?? null,
      client.paid ?? 0,
    ]
  );
}

export function updateClient(client: Client, newData?: Partial<Client>): void {
  if (!client.id) return;
  const dataToUse = newData ?? client;
  const fields = Object.entries(dataToUse)
    .filter(([_, v]) => v !== undefined)
    .map(([k, v]) => `${k} = ${typeof v === "string" ? `'${v}'` : v}`);
  if (fields.length === 0) return;
  db.runSync(`UPDATE clients SET ${fields.join(", ")} WHERE id = ?;`, [client.id!]);
  addLog(client.id!, "📝 Dados do cliente atualizados.");
}

export function deleteClient(id: number): void {
  if (!id) return;
  try {
    db.runSync("DELETE FROM clients WHERE id = ?;", [id]);
    db.runSync("DELETE FROM payments WHERE client_id = ?;", [id]);
    db.runSync("DELETE FROM logs WHERE clientId = ?;", [id]);
    console.log(`🗑️ Cliente #${id} removido com sucesso.`);
  } catch (error) {
    console.error("❌ Erro ao remover cliente:", error);
  }
}

// ============================================================
// 💰 PAGAMENTOS
// ============================================================
export function addPayment(clientId: number, valor: number): void {
  if (!clientId || valor <= 0) throw new Error("Cliente e valor são obrigatórios");

  const data = `${formatDate()} ${new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  db.runSync("INSERT INTO payments (client_id, data, valor) VALUES (?, ?, ?);", [
    clientId,
    data,
    valor,
  ]);
  db.runSync("UPDATE clients SET paid = paid + ? WHERE id = ?;", [valor, clientId]);
  addLog(clientId, `💰 Pagamento de R$ ${valor.toFixed(2)} registrado.`);
}

export function getPaymentsByClient(clientId: number): Payment[] {
  if (!clientId) return [];
  return db.getAllSync(
    "SELECT * FROM payments WHERE client_id = ? ORDER BY id DESC;",
    [clientId]
  ) as Payment[];
}

export function deletePayment(id: number): void {
  if (!id) return;

  try {
    const payment = db.getFirstSync(
      "SELECT * FROM payments WHERE id = ?;",
      [id]
    ) as Payment | undefined;

    if (!payment) return;

    const clientId = payment.client_id ?? payment.clientId;
    if (!clientId) return;

    db.runSync("DELETE FROM payments WHERE id = ?;", [id]);
    db.runSync("UPDATE clients SET paid = paid - ? WHERE id = ?;", [
      payment.valor,
      clientId,
    ]);

    addLog(
      clientId,
      `❌ Pagamento de R$ ${payment.valor.toFixed(2)} removido.`
    );

    console.log(`🗑️ Pagamento #${id} removido e valor revertido.`);
  } catch (error) {
    console.error("Erro ao excluir pagamento:", error);
  }
}

// ============================================================
// 📅 CLIENTES COM COBRANÇAS PRÓXIMAS
// ============================================================
export function getUpcomingCharges(): Client[] {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  const startDate = formatDate(today);
  const endDate = formatDate(nextWeek);

  return db.getAllSync(
    `SELECT * FROM clients
     WHERE next_charge IS NOT NULL
     AND next_charge BETWEEN ? AND ?
     ORDER BY next_charge ASC;`,
    [startDate, endDate]
  ) as Client[];
}

// ============================================================
// 🔍 BUSCAS
// ============================================================
export function getAllClients(): Client[] {
  return db.getAllSync("SELECT * FROM clients ORDER BY name ASC;") as Client[];
}

export function getClientById(id: number): Client | null {
  if (!id) return null;
  const result = db.getFirstSync("SELECT * FROM clients WHERE id = ?;", [id]) as Client | undefined;
  return result ?? null;
}

// ============================================================
// 📊 TOTAIS
// ============================================================
export function getTotals(): { totalPaid: number; totalToReceive: number } {
  const result = db.getFirstSync(`
    SELECT 
      COALESCE(SUM(paid), 0) AS totalPaid,
      COALESCE(SUM(value - paid), 0) AS totalToReceive
    FROM clients;
  `) as { totalPaid: number; totalToReceive: number } | undefined;

  return {
    totalPaid: result?.totalPaid ?? 0,
    totalToReceive: result?.totalToReceive ?? 0,
  };
}
