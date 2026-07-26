# 🐾 PetFlow — Sistema de Gestão e Agendamento para Petshops

O **PetFlow** é uma solução Full Stack moderna desenvolvida para simplificar e automatizar o fluxo de agendamentos e a gestão de clientes/pets em estabelecimentos de petshop. O sistema oferece uma interface intuitiva para os tutores agendarem serviços rapidamente, integrada a um banco de dados relacional em tempo real na nuvem.

---

## 🔗 Links de Acesso (Live Demo)

- 🌐 **Frontend (Aplicação Web):** [https://samirsousa.github.io/petflow/](https://samirsousa.github.io/petflow/)
- ⚡ **Backend (API REST):** `https://petflow-backend.onrender.com`

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **React.js / Vite:** UI rápida, reativa e componente modular.
- **CSS3 / Tailwind / Styled Components:** Layout moderno e responsivo (*Mobile-First*).
- **GitHub Pages:** Hospedagem estática contínua do frontend.

### **Backend**
- **Node.js & Express:** API RESTful robusta para manipulação de rotas e regras de negócio.
- **PostgreSQL:** Banco de dados relacional modelado para integridade dos dados.
- **pg (node-postgres):** Driver de conexão assíncrona entre o Node.js e o PostgreSQL.
- **Render:** Hospedagem em nuvem do servidor com tratamento de fuso horário (`America/Sao_Paulo`).

---

## 📊 Arquitetura do Banco de Dados

O banco de dados relacional foi construído priorizando a integridade referencial por meio de *Foreign Keys* para garantir a consistência das relações entre clientes, pets, serviços e agendamentos.

```sql
  +------------------+         +------------------+
  |     clients      |         |       pets       |
  +------------------+         +------------------+
  | id (PK)          |<-------+| id (PK)          |
  | nome             |         | nome             |
  | email            |         | especie / raca   |
  | telefone         |         | client_id (FK)   |
  +------------------+         +------------------+
           ^                            ^
           |                            |
  +-----------------------------------------------+
  |                 appointments                  |
  +-----------------------------------------------+
  | id (PK)                                       |
  | pet_id (FK)                                   |
  | client_id (FK)                                |
  | service_id (FK)                               |
  | data (TIMESTAMP)                              |
  | status                                        |
  +-----------------------------------------------+

```

🎯 Principais Funcionalidades:

📋 Gestão Comercial via Funil Kanban Interativo: Interface estilo drag-and-drop para mover clientes entre etapas (ex: Novo Lead, Proposta Enviada, Aguardando Assinatura, Fechado), com atualização de status em tempo real.

📄 Gerador Automático de Propostas & Contratos: Preenchimento rápido de formulário dinâmico com geração instantânea de propostas personalizadas e contratos em PDF padronizados.

✍️ Link Único de Aceite Digital: Envio de link exclusivo para o cliente visualizar a proposta e realizar o aceite digital com um clique, registrando IP, data e hora para segurança jurídica.

📊 Dashboard Financeiro & Métricas de Conversão: Painel com indicadores visuais sobre taxa de fechamento, valor total em negociação e tempo médio de conversão de propostas.

👥 Cadastro & Histórico Centralizado de Clientes: Armazenamento organizado dos dados de contato, historico de reuniões, escopos aprovados e arquivos anexados por cliente.

🔔 Notificações Automáticas de Follow-up: Alertas visuais e lembretes para cobrar propostas enviadas que estão sem resposta há determinado período.

🔒 Controle de Acesso Multi-tenant: Isolamento total dos dados de cada empresa assinante no banco PostgreSQL, garantindo privacidade e segurança da informação.

## 🚀 Como Rodar o Projeto Localmente

### **Pré-requisitos**
- Node.js instalado (v18+)
- PostgreSQL rodando localmente (ou instância na nuvem)
- Git instalado

### **1. Clonar o Repositório**
```bash
git clone [https://github.com/seu-usuario/clientflow-ai.git](https://github.com/seu-usuario/clientflow-ai.git)
cd clientflow-ai
```

### **2. Configurar o Banco de Dados (PostgreSQL)**
```bash
CREATE DATABASE clientflow_db;
```

### **3. Configurar e Rodar o Backend**
```bash
cd backend
npm install
```

Crie um arquivo .env na pasta backend com as variáveis:
```bash
PORT=3000
DATABASE_URL=postgresql://seu_usuario:sua_senha@localhost:5432/clientflow_db
JWT_SECRET=sua_chave_secreta_aqui
TZ=America/Sao_Paulo
```

Inicie o servidor:
```bash
npm run dev
```

### **4. Configurar e Rodar o Frontend**
```bash
cd ../frontend
npm install
```

Crie um arquivo .env na pasta frontend com a variável:
```bash
VITE_API_URL=http://localhost:3000
```

Inicie o aplicativo:
```bash
npm run dev
```
---

👨‍💻 Desenvolvedor

Desenvolvido por Samir Firmino 

Estudante de Sistemas de Informação na Unilasalle - RJ e focado em Análise de Dados e Desenvolvimento Web Full Stack.
