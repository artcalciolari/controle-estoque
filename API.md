# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### Health Check
```
GET /api/health
```
Verifica se a API está funcionando.

**Response:**
```json
{
  "status": "ok"
}
```

---

### Listar Produtos
```
GET /api/produtos
```
Retorna todos os produtos cadastrados.

**Response:**
```json
[
  {
    "id": 1,
    "nome_massa": "Massa Fresca de Espinafre",
    "tipo_massa": "fresca",
    "quantia": 50,
    "em_falta": false,
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  }
]
```

---

### Buscar Produto por ID
```
GET /api/produtos/:id
```
Retorna um produto específico.

**Response:**
```json
{
  "id": 1,
  "nome_massa": "Massa Fresca de Espinafre",
  "tipo_massa": "fresca",
  "quantia": 50,
  "em_falta": false,
  "created_at": "2025-01-01T10:00:00.000Z",
  "updated_at": "2025-01-01T10:00:00.000Z"
}
```

**Error (404):**
```json
{
  "error": "Product not found"
}
```

---

### Criar Produto
```
POST /api/produtos
```
Cria um novo produto.

**Request Body:**
```json
{
  "nome_massa": "Massa Congelada de Espinafre",
  "tipo_massa": "congelada",
  "quantia": 100,
  "em_falta": false
}
```

**Required Fields:**
- `nome_massa` (string): Nome do produto
- `tipo_massa` (string): "fresca" ou "congelada"

**Optional Fields:**
- `quantia` (number): Quantidade em estoque (default: 0)
- `em_falta` (boolean): Se está em falta (default: false)

**Response (201):**
```json
{
  "id": 2,
  "nome_massa": "Massa Congelada de Espinafre",
  "tipo_massa": "congelada",
  "quantia": 100,
  "em_falta": false,
  "created_at": "2025-01-01T10:30:00.000Z",
  "updated_at": "2025-01-01T10:30:00.000Z"
}
```

**Error (400):**
```json
{
  "error": "nome_massa and tipo_massa are required"
}
```
ou
```json
{
  "error": "tipo_massa must be either \"congelada\" or \"fresca\""
}
```

---

### Atualizar Produto
```
PUT /api/produtos/:id
```
Atualiza um produto existente.

**Request Body:**
Todos os campos são opcionais. Apenas os campos enviados serão atualizados.
```json
{
  "nome_massa": "Massa Fresca de Espinafre Premium",
  "tipo_massa": "fresca",
  "quantia": 75,
  "em_falta": true
}
```

**Response:**
```json
{
  "id": 1,
  "nome_massa": "Massa Fresca de Espinafre Premium",
  "tipo_massa": "fresca",
  "quantia": 75,
  "em_falta": true,
  "created_at": "2025-01-01T10:00:00.000Z",
  "updated_at": "2025-01-01T11:00:00.000Z"
}
```

**Error (404):**
```json
{
  "error": "Product not found"
}
```

**Error (400):**
```json
{
  "error": "tipo_massa must be either \"congelada\" or \"fresca\""
}
```

---

### Deletar Produto
```
DELETE /api/produtos/:id
```
Remove um produto do banco de dados.

**Response:**
```json
{
  "message": "Product deleted successfully",
  "product": {
    "id": 1,
    "nome_massa": "Massa Fresca de Espinafre Premium",
    "tipo_massa": "fresca",
    "quantia": 75,
    "em_falta": true,
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T11:00:00.000Z"
  }
}
```

**Error (404):**
```json
{
  "error": "Product not found"
}
```

---

## Estrutura da Tabela

```sql
CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  nome_massa VARCHAR(255) NOT NULL,
  tipo_massa VARCHAR(50) NOT NULL CHECK (tipo_massa IN ('congelada', 'fresca')),
  quantia INTEGER NOT NULL DEFAULT 0,
  em_falta BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Exemplos de Uso

### Com cURL

**Criar um produto:**
```bash
curl -X POST http://localhost:3000/api/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "nome_massa": "Massa Caseira",
    "tipo_massa": "fresca",
    "quantia": 30,
    "em_falta": false
  }'
```

**Listar todos os produtos:**
```bash
curl http://localhost:3000/api/produtos
```

**Atualizar um produto:**
```bash
curl -X PUT http://localhost:3000/api/produtos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "quantia": 50
  }'
```

**Deletar um produto:**
```bash
curl -X DELETE http://localhost:3000/api/produtos/1
```

### Com JavaScript (Fetch API)

```javascript
// Criar produto
const createProduct = async () => {
  const response = await fetch('http://localhost:3000/api/produtos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nome_massa: 'Massa Artesanal',
      tipo_massa: 'fresca',
      quantia: 25,
      em_falta: false
    })
  });
  const data = await response.json();
  console.log(data);
};

// Listar produtos
const listProducts = async () => {
  const response = await fetch('http://localhost:3000/api/produtos');
  const data = await response.json();
  console.log(data);
};

// Atualizar produto
const updateProduct = async (id) => {
  const response = await fetch(`http://localhost:3000/api/produtos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quantia: 100
    })
  });
  const data = await response.json();
  console.log(data);
};

// Deletar produto
const deleteProduct = async (id) => {
  const response = await fetch(`http://localhost:3000/api/produtos/${id}`, {
    method: 'DELETE'
  });
  const data = await response.json();
  console.log(data);
};
```
