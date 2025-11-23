# Confeitaria App

Sistema de gestão de confeitaria pronto para produção com controle de estoque, catálogo de produtos, rastreamento de vendas e painel de análises.

## Arquitetura

### Stack Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js 4.x
- **Banco de Dados**: MongoDB 6.x (Mongoose ODM)
- **Autenticação**: JWT (jsonwebtoken)
- **Padrão de Arquitetura**: MVCS (Model-View-Controller-Service)

### Stack Frontend
- **Framework**: Vue.js 3.3+ (Composition API)
- **Ferramenta de Build**: Vite 5.x
- **Estilização**: TailwindCSS 3.x + vue3-styled-components
- **Cliente HTTP**: Axios 1.6+
- **Roteamento**: Vue Router 4.x
- **Ícones**: Google Material Symbols

## Início Rápido

### Pré-requisitos
- Node.js >= 18.0.0
- npm >= 9.0.0
- Conta MongoDB Atlas

### Instalação

**Configuração do Backend**
```powershell
cd backend
npm install
```

**Configuração do Ambiente**

Crie o arquivo `.env` no diretório backend:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
JWT_SECRET=<gere-uma-string-aleatoria-segura>
```

**Configuração do Frontend**
```powershell
cd frontend
npm install
```

### Executando a Aplicação

**Modo de Desenvolvimento**

Terminal 1 - Backend:
```powershell
cd backend
npm run dev
```
Servidor inicia em `http://localhost:5000`

Terminal 2 - Frontend:
```powershell
cd frontend
npm run dev
```
Aplicação disponível em `http://localhost:3000`

**Build de Produção**

Backend:
```powershell
cd backend
npm start
```

Frontend:
```powershell
cd frontend
npm run build
npm run preview
```

## Referência da API

### Autenticação

**POST** `/api/auth/registrar`

Registra uma nova conta de usuário.

Corpo da requisição:
```json
{
  "nome": "string",
  "nomeEstabelecimento": "string",
  "username": "string",
  "senha": "string"
}
```

Resposta: `201 Created`
```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "nome": "string",
    "nomeEstabelecimento": "string",
    "username": "string"
  }
}
```

**POST** `/api/auth/login`

Autentica um usuário existente.

Corpo da requisição:
```json
{
  "username": "string",
  "senha": "string"
}
```

Resposta: `200 OK`
```json
{
  "token": "jwt_token",
  "user": { "id": "user_id", "nome": "string", "nomeEstabelecimento": "string", "username": "string" }
}
```

### Insumos (Ingredientes)

Todos os endpoints requerem o header `Authorization: Bearer <token>`.

**GET** `/api/insumos`

Lista todos os insumos do usuário autenticado.

Resposta: `200 OK`
```json
[
  {
    "_id": "string",
    "nome": "string",
    "unidadeMedida": "kg|g|L|ml|un",
    "quantidadeEstoque": "number",
    "custoUnitario": "number",
    "userId": "string",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
]
```

**GET** `/api/insumos/:id`

Recupera um único insumo por ID.

Resposta: `200 OK` | `404 Not Found`

**POST** `/api/insumos`

Cria um novo insumo.

Corpo da requisição:
```json
{
  "nome": "string",
  "unidadeMedida": "kg|g|L|ml|un",
  "quantidadeEstoque": "number",
  "custoUnitario": "number"
}
```

Resposta: `201 Created`

**PUT** `/api/insumos/:id`

Atualiza um insumo existente.

Corpo da requisição: Igual ao POST

Resposta: `200 OK` | `404 Not Found`

**DELETE** `/api/insumos/:id`

Deleta um insumo. Falha se o insumo estiver sendo usado em algum produto.

Resposta: `200 OK` | `400 Bad Request` | `404 Not Found`

Resposta de erro quando em uso:
```json
{
  "erro": "Insumo não pode ser deletado. Está sendo usado nos produtos: <product_names>"
}
```

### Produtos

Todos os endpoints requerem autenticação.

**GET** `/api/produtos`

Lista todos os produtos com ingredientes populados.

Resposta: `200 OK`
```json
[
  {
    "_id": "string",
    "nome": "string",
    "descricao": "string",
    "precoVenda": "number",
    "ingredientes": [
      {
        "insumo": { "_id": "string", "nome": "string", "custoUnitario": "number", "unidadeMedida": "string" },
        "quantidade": "number"
      }
    ],
    "userId": "string",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
]
```

**GET** `/api/produtos/:id`

Recupera um único produto por ID com ingredientes populados.

Resposta: `200 OK` | `404 Not Found`

**GET** `/api/produtos/:id/custo`

Calcula o custo do produto baseado nos preços atuais dos ingredientes.

Resposta: `200 OK`
```json
{
  "custoTotal": "number",
  "precoVenda": "number",
  "lucro": "number"
}
```

**POST** `/api/produtos`

Cria um novo produto com ingredientes.

Corpo da requisição:
```json
{
  "nome": "string",
  "descricao": "string",
  "precoVenda": "number",
  "ingredientes": [
    { "insumo": "insumo_id", "quantidade": "number" }
  ]
}
```

Resposta: `201 Created` | `400 Bad Request`

**PUT** `/api/produtos/:id`

Atualiza um produto existente.

Corpo da requisição: Igual ao POST

Resposta: `200 OK` | `400 Bad Request` | `404 Not Found`

**DELETE** `/api/produtos/:id`

Deleta um produto. Seguro para deletar mesmo se o produto existir no histórico de vendas (padrão snapshot).

Resposta: `200 OK` | `404 Not Found`

### Vendas

Todos os endpoints requerem autenticação.

**POST** `/api/vendas`

Registra uma nova venda com dedução automática de estoque.

Corpo da requisição:
```json
{
  "produtoId": "string",
  "quantidade": "number"
}
```

Resposta: `201 Created` | `400 Bad Request`

Resposta de sucesso:
```json
{
  "_id": "string",
  "produtoSnapshot": {
    "nome": "string",
    "custoTotal": "number",
    "precoVenda": "number",
    "ingredientes": [
      { "nomeInsumo": "string", "quantidade": "number", "custoUnitario": "number" }
    ]
  },
  "quantidade": "number",
  "valorTotal": "number",
  "lucro": "number",
  "userId": "string",
  "createdAt": "datetime"
}
```

Resposta de erro para estoque insuficiente:
```json
{
  "erro": "Estoque insuficiente: <insumo>: necessário <qty>, disponível <qty>"
}
```

**GET** `/api/vendas`

Lista todas as vendas. Suporta filtragem por data via parâmetros de query.

Parâmetros de query:
- `dataInicio`: String de data ISO (opcional)
- `dataFim`: String de data ISO (opcional)

Resposta: `200 OK`

**GET** `/api/vendas/:id`

Recupera uma única venda por ID.

Resposta: `200 OK` | `404 Not Found`

### Dashboard

**GET** `/api/dashboard/estatisticas`

Requer autenticação.

Recupera estatísticas abrangentes do negócio.

Resposta: `200 OK`
```json
{
  "resumo": {
    "totalVendas": "number",
    "receitaTotal": "number",
    "custoTotal": "number",
    "lucroTotal": "number",
    "totalProdutos": "number",
    "totalInsumos": "number"
  },
  "mesAtual": {
    "vendas": "number",
    "receita": "number",
    "lucro": "number"
  },
  "produtosMaisVendidos": [
    {
      "nome": "string",
      "quantidadeVendida": "number",
      "receita": "number",
      "lucro": "number"
    }
  ],
  "insumosComEstoqueBaixo": [
    {
      "_id": "string",
      "nome": "string",
      "quantidadeEstoque": "number",
      "unidadeMedida": "string"
    }
  ]
}
```

## Estrutura do Projeto

```
confeitaria-app/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Insumo.js
│   │   │   ├── Produto.js
│   │   │   └── Venda.js
│   │   ├── services/
│   │   │   ├── AuthService.js
│   │   │   ├── InsumoService.js
│   │   │   ├── ProdutoService.js
│   │   │   ├── VendaService.js
│   │   │   └── DashboardService.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── insumoController.js
│   │   │   ├── produtoController.js
│   │   │   ├── vendaController.js
│   │   │   └── dashboardController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── insumoRoutes.js
│   │   │   ├── produtoRoutes.js
│   │   │   ├── vendaRoutes.js
│   │   │   └── dashboardRoutes.js
│   │   └── middleware/
│   │       └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── StyledComponents.js
    │   ├── views/
    │   │   ├── Login.vue
    │   │   ├── Dashboard.vue
    │   │   ├── Insumos.vue
    │   │   ├── Produtos.vue
    │   │   └── Vendas.vue
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   ├── insumoService.js
    │   │   ├── produtoService.js
    │   │   ├── vendaService.js
    │   │   └── dashboardService.js
    │   ├── router/
    │   │   └── index.js
    │   ├── App.vue
    │   ├── main.js
    │   └── style.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

### Padrões de Arquitetura
- **Separação MVCS**: Models definem schema, Services contêm lógica de negócio, Controllers lidam com HTTP, Routes definem endpoints
- **Camada de Serviço**: Toda lógica de negócio, validação e operações de banco de dados nos serviços
- **Controllers Enxutos**: Controllers apenas lidam com requisição/resposta, delegam para serviços
- **Vendas Imutáveis**: Padrão snapshot garante que dados de vendas nunca mudam

