# controle-estoque

Aplicação simples e eficiente para controle de estoque de massas. Implantação com Docker Compose.

## 📋 Estrutura do Projeto

- **Backend**: API REST com Node.js + Express + PostgreSQL
- **Frontend**: Interface web com Vite + React
- **Database**: PostgreSQL 15

## 🗃️ Estrutura da Tabela

A tabela `produtos` possui os seguintes campos:
- `id`: Identificador único (gerado automaticamente)
- `nome_massa`: Nome do produto (texto)
- `tipo_massa`: Tipo da massa - "congelada" ou "fresca"
- `quantia`: Quantidade em estoque (número inteiro)
- `em_falta`: Indicador de falta no estoque (boolean)
- `created_at`: Data de criação (timestamp)
- `updated_at`: Data de atualização (timestamp)

## 🚀 Como Executar

### Com Docker Compose (Recomendado)

1. Clone o repositório:
```bash
git clone https://github.com/artcalciolari/controle-estoque.git
cd controle-estoque
```

2. Execute com Docker Compose:
```bash
docker-compose up -d
```

3. Acesse a aplicação:
- Frontend: http://localhost
- Backend API: http://localhost:3000/api

### Desenvolvimento Local

#### Backend

1. Entre no diretório do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Inicie o servidor:
```bash
npm start
```

#### Frontend

1. Entre no diretório do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 🔌 API Endpoints

- `GET /api/produtos` - Lista todos os produtos
- `GET /api/produtos/:id` - Busca um produto específico
- `POST /api/produtos` - Cria um novo produto
- `PUT /api/produtos/:id` - Atualiza um produto
- `DELETE /api/produtos/:id` - Remove um produto
- `GET /api/health` - Verifica o status da API

## 💻 Requisitos do Sistema

- Docker e Docker Compose (para execução em container)
- Node.js 18+ (para execução local)
- PostgreSQL 15+ (para execução local)

## ⚙️ Otimização para Hardware Limitado

A aplicação foi projetada para ser leve e eficiente:
- Imagens Docker Alpine (menores e mais rápidas)
- Frontend com Vite (build otimizado e rápido)
- Backend com Express (framework minimalista)
- Uso eficiente de recursos de memória e CPU

## 📝 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

