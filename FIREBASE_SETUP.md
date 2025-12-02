# 🔥 Firebase - Guia de Implementação

Este documento descreve a implementação completa do Firebase no projeto Crediário.

## 📋 Índice

1. [Funcionalidades Implementadas](#funcionalidades-implementadas)
2. [Estrutura de Arquivos](#estrutura-de-arquivos)
3. [Como Usar](#como-usar)
4. [Configuração do Firebase](#configuração-do-firebase)
5. [Segurança](#segurança)

---

## ✨ Funcionalidades Implementadas

### 🔐 Autenticação (Firebase Authentication)

- ✅ Login com email e senha
- ✅ Registro de novos usuários
- ✅ Logout
- ✅ Gerenciamento de estado de autenticação
- ✅ Proteção de rotas (usuários não autenticados não acessam o app)
- ✅ Tratamento de erros com mensagens em português

### 📊 Banco de Dados (Firestore)

- ✅ Sincronização de clientes com Firestore
- ✅ Sincronização de pagamentos
- ✅ Sincronização bidirecional (envio e recebimento de dados)
- ✅ Sincronização em tempo real (opcional)

### ☁️ Armazenamento (Firebase Storage)

- ✅ Backup do banco SQLite na nuvem
- ✅ Upload automático com retry em caso de falha
- ✅ Organização por usuário (cada usuário tem sua pasta)

---

## 📁 Estrutura de Arquivos

```
src/
├── firebaseConfig.ts              # Configuração principal do Firebase
├── contexts/
│   └── AuthContext.tsx            # Contexto de autenticação
├── services/
│   ├── authService.ts             # Serviço de autenticação
│   └── syncService.ts             # Serviço de sincronização de dados
├── screens/
│   ├── LoginScreen.tsx            # Tela de login/registro
│   ├── HomeScreen.tsx             # Tela inicial (com logout e sync)
│   └── BackupScreen.tsx           # Tela de backup (atualizada)
└── utils/
    └── backup.ts                  # Utilitários de backup
```

---

## 🚀 Como Usar

### 1. Login e Registro

Ao abrir o app pela primeira vez, você verá a tela de login:

- **Para registrar**: Clique em "Não tem uma conta? Criar"
- **Para fazer login**: Digite email e senha e clique em "Entrar"

### 2. Sincronização de Dados

Na **HomeScreen**, você encontrará dois botões no header:

- **Botão de nuvem (☁️)**: Sincroniza todos os seus dados com o Firestore
- **Botão de logout (🚪)**: Faz logout da conta

A sincronização:
- ✅ Envia todos os clientes locais para o Firestore
- ✅ Baixa clientes do Firestore e atualiza o banco local
- ✅ Mantém tudo sincronizado entre dispositivos

### 3. Backup na Nuvem

Na **BackupScreen**:

- **Backup Local**: Cria um arquivo `.db` no dispositivo
- **Backup Nuvem**: Envia o banco completo para o Firebase Storage

Cada backup na nuvem é armazenado em:
```
backups/{userId}/crediario_YYYY-MM-DDTHH-mm-ss.db
```

### 4. Logout

Para sair da conta:
1. Clique no botão de logout no header da HomeScreen
2. Confirme a ação
3. Você será redirecionado para a tela de login

---

## ⚙️ Configuração do Firebase

### Credenciais Atuais

As credenciais do Firebase já estão configuradas em `src/firebaseConfig.ts`:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyAKbV8995J49mnFPl9_3QuVkRFdtMOx86U",
  authDomain: "jogos2-d34ac.firebaseapp.com",
  projectId: "jogos2-d34ac",
  storageBucket: "jogos2-d34ac.appspot.com",
  messagingSenderId: "64016555551",
  appId: "1:64016555551:web:982a9e43417cd7f565bf2a",
  measurementId: "G-TN6SWJRV37",
};
```

### Configurando Seu Próprio Projeto Firebase

Se quiser usar seu próprio projeto Firebase:

1. **Acesse o [Firebase Console](https://console.firebase.google.com/)**

2. **Crie um novo projeto** ou selecione um existente

3. **Adicione um app Web**:
   - Clique em "Adicionar app" > Web
   - Registre o app
   - Copie as credenciais fornecidas

4. **Ative os serviços necessários**:

   **Authentication**:
   - Acesse "Authentication" > "Sign-in method"
   - Ative "E-mail/Senha"

   **Firestore Database**:
   - Acesse "Firestore Database"
   - Clique em "Criar banco de dados"
   - Escolha modo "Produção" ou "Teste"
   - Defina as regras de segurança (veja abaixo)

   **Storage**:
   - Acesse "Storage"
   - Clique em "Começar"
   - Defina as regras de segurança (veja abaixo)

5. **Substitua as credenciais** em `src/firebaseConfig.ts`

---

## 🔒 Segurança

### Regras do Firestore

Configure estas regras no Firebase Console > Firestore > Regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários só podem acessar seus próprios dados
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Regras do Storage

Configure estas regras no Firebase Console > Storage > Regras:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Usuários só podem fazer upload/download de seus próprios backups
    match /backups/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Boas Práticas

- ✅ **Nunca compartilhe sua API Key publicamente** (mas ela pode estar no código)
- ✅ **Use regras de segurança adequadas** no Firestore e Storage
- ✅ **Ative a autenticação de dois fatores** na sua conta Firebase
- ✅ **Monitore o uso** através do console para detectar atividades suspeitas

---

## 📚 Arquitetura

### Fluxo de Autenticação

```
App.tsx
  └─> AuthProvider (gerencia estado de autenticação)
       └─> NavigationContainer
            └─> AppNavigator
                 ├─> LoginScreen (se não autenticado)
                 └─> Telas do App (se autenticado)
```

### Fluxo de Sincronização

```
HomeScreen (botão de sync)
  └─> fullSync(userId)
       ├─> syncClientsToFirestore() → Envia para Firestore
       └─> syncClientsFromFirestore() → Baixa do Firestore
```

---

## 🎯 Próximos Passos

Melhorias futuras que podem ser implementadas:

1. **Sincronização Automática**
   - Sincronizar automaticamente quando o app abre
   - Sincronizar quando detectar mudanças

2. **Sincronização em Tempo Real**
   - Usar `startRealtimeSync()` para sincronizar em tempo real
   - Atualizar UI automaticamente quando dados mudam no Firestore

3. **Restauração de Backups**
   - Implementar download e restauração de backups do Storage
   - Permitir escolher qual backup restaurar

4. **Perfil de Usuário**
   - Adicionar tela de perfil com nome, foto, etc.
   - Permitir editar informações do usuário

5. **Compartilhamento de Dados**
   - Permitir compartilhar clientes com outros usuários
   - Implementar permissões de leitura/escrita

---

## 📞 Suporte

Se tiver dúvidas ou problemas:

1. Verifique os logs do console para erros
2. Confirme que as credenciais do Firebase estão corretas
3. Verifique se os serviços estão ativos no Firebase Console
4. Verifique se as regras de segurança estão configuradas

---

**Implementado em:** Dezembro de 2025
**Versão do Firebase:** 12.4.0
**React Native:** 0.81.4
**Expo SDK:** ~54.0.13
