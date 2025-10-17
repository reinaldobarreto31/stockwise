# Guia de Instalação - StockWise

## 🐳 Opção 1: Com Docker (Recomendado)

### Instalar Docker Desktop
1. Baixe o Docker Desktop para Windows: https://www.docker.com/products/docker-desktop/
2. Execute o instalador e siga as instruções
3. Reinicie o computador se necessário
4. Abra o Docker Desktop e aguarde inicializar

### Executar com Docker
```bash
cd stockwise
docker compose up --build
```

### Acessar os serviços
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080
- **pgAdmin**: http://localhost:5050
  - Email: admin@stockwise.com
  - Senha: admin123

## 💻 Opção 2: Desenvolvimento Local (Sem Docker)

### Pré-requisitos
- Go 1.21+ (https://golang.org/dl/)
- Node.js 18+ (https://nodejs.org/)
- PostgreSQL 15+ (https://www.postgresql.org/download/)

### 1. Configurar PostgreSQL

#### Instalar PostgreSQL
1. Baixe e instale PostgreSQL
2. Durante a instalação, defina uma senha para o usuário `postgres`
3. Anote a porta (padrão: 5432)

#### Criar banco de dados
```sql
-- Conecte ao PostgreSQL como superusuário
CREATE DATABASE stockwise;
CREATE USER stockwise_user WITH PASSWORD 'stockwise_password';
GRANT ALL PRIVILEGES ON DATABASE stockwise TO stockwise_user;
```

### 2. Configurar Backend (Go)

#### Instalar dependências
```bash
cd backend
go mod tidy
```

#### Configurar variáveis de ambiente
Crie um arquivo `.env` na pasta `backend`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=stockwise_user
DB_PASSWORD=stockwise_password
DB_NAME=stockwise
JWT_SECRET=your-super-secret-jwt-key-change-in-production
GIN_MODE=debug
```

#### Executar backend
```bash
cd backend
go run cmd/main.go
```

O backend estará disponível em: http://localhost:8080

### 3. Configurar Frontend (React)

#### Instalar dependências
```bash
cd frontend
npm install
```

#### Configurar proxy (já configurado no package.json)
O frontend já está configurado para fazer proxy das requisições API para `http://localhost:8080`

#### Executar frontend
```bash
cd frontend
npm start
```

O frontend estará disponível em: http://localhost:3000

## 🔧 Scripts de Desenvolvimento

### Backend
```bash
# Executar
go run cmd/main.go

# Build
go build -o bin/stockwise cmd/main.go

# Testes
go test ./...

# Limpar módulos
go mod tidy
```

### Frontend
```bash
# Desenvolvimento
npm start

# Build para produção
npm run build

# Testes
npm test

# Análise de bundle
npm run build && npx serve -s build
```

## 🗃️ Configuração Manual do Banco

Se preferir configurar o banco manualmente:

```sql
-- Conectar ao PostgreSQL
psql -U postgres -d stockwise

-- Criar extensões (opcional)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- As tabelas serão criadas automaticamente pelo GORM quando o backend iniciar
```

## 🚀 Testando a Aplicação

### 1. Verificar Backend
```bash
curl http://localhost:8080/health
```

Deve retornar: `{"status":"ok"}`

### 2. Verificar Frontend
Acesse: http://localhost:3000

### 3. Testar Registro
1. Acesse o frontend
2. Clique em "Registrar"
3. Preencha os dados e registre um usuário
4. Faça login com as credenciais

### 4. Testar Funcionalidades
1. Adicione alguns produtos
2. Visualize o dashboard
3. Gere relatórios
4. Teste os filtros

## 🐛 Troubleshooting

### Erro de conexão com banco
```
Error: failed to connect to database
```
**Solução:**
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
- Teste a conexão: `psql -U stockwise_user -d stockwise`

### Erro de CORS no frontend
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solução:**
- Verifique se o backend está rodando na porta 8080
- Confirme a configuração de proxy no `package.json`

### Erro de dependências Go
```
go: module not found
```
**Solução:**
```bash
cd backend
go mod tidy
go mod download
```

### Erro de dependências Node
```
Module not found
```
**Solução:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📊 Monitoramento Local

### Logs do Backend
Os logs aparecerão no terminal onde o backend está rodando

### Logs do Frontend
Os logs aparecerão no terminal onde o frontend está rodando e no console do navegador

### Banco de Dados
```bash
# Conectar ao banco
psql -U stockwise_user -d stockwise

# Ver tabelas
\dt

# Ver dados de uma tabela
SELECT * FROM users;
SELECT * FROM products;
```

## 🔄 Reiniciar Serviços

### Backend
- Pare o processo (Ctrl+C)
- Execute novamente: `go run cmd/main.go`

### Frontend
- Pare o processo (Ctrl+C)
- Execute novamente: `npm start`

### Banco de Dados
```bash
# Windows (se instalado como serviço)
net stop postgresql-x64-15
net start postgresql-x64-15
```

## 📝 Próximos Passos

1. **Produção**: Configure variáveis de ambiente adequadas
2. **Segurança**: Altere o JWT_SECRET para um valor seguro
3. **Backup**: Configure backup automático do banco
4. **Monitoramento**: Implemente logs estruturados
5. **Testes**: Adicione testes automatizados