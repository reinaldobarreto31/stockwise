# Configuração do pgAdmin - StockWise

## 🗃️ Acessando o pgAdmin

Após executar `docker compose up --build`, o pgAdmin estará disponível em:
- **URL**: http://localhost:5050
- **Email**: admin@stockwise.com
- **Senha**: admin123

## 🔧 Configurando Conexão com PostgreSQL

### 1. Fazer Login no pgAdmin
1. Acesse http://localhost:5050
2. Digite o email: `admin@stockwise.com`
3. Digite a senha: `admin123`

### 2. Adicionar Servidor PostgreSQL
1. Clique com botão direito em "Servers" no painel esquerdo
2. Selecione "Create" → "Server..."

### 3. Configurar Conexão
**Aba General:**
- **Name**: StockWise Database

**Aba Connection:**
- **Host name/address**: `postgres` (nome do container)
- **Port**: `5432`
- **Maintenance database**: `stockwise`
- **Username**: `stockwise_user`
- **Password**: `stockwise_password`

### 4. Salvar Configuração
1. Marque "Save password?" se desejar
2. Clique em "Save"

## 📊 Explorando o Banco de Dados

### Visualizar Tabelas
1. Expanda "StockWise Database" → "Databases" → "stockwise"
2. Expanda "Schemas" → "public" → "Tables"
3. Você verá as tabelas:
   - `users` - Usuários do sistema
   - `products` - Produtos cadastrados
   - `stock_movements` - Movimentações de estoque

### Executar Consultas SQL
1. Clique com botão direito na database "stockwise"
2. Selecione "Query Tool"
3. Digite suas consultas SQL

#### Exemplos de Consultas Úteis:

```sql
-- Ver todos os usuários
SELECT id, name, email, created_at FROM users;

-- Ver todos os produtos
SELECT id, name, category, quantity, min_stock, price FROM products;

-- Ver produtos com estoque baixo
SELECT name, quantity, min_stock 
FROM products 
WHERE quantity <= min_stock;

-- Ver movimentações de estoque
SELECT p.name, sm.movement_type, sm.quantity, sm.created_at
FROM stock_movements sm
JOIN products p ON sm.product_id = p.id
ORDER BY sm.created_at DESC;

-- Estatísticas gerais
SELECT 
    COUNT(*) as total_produtos,
    SUM(quantity) as estoque_total,
    AVG(price) as preco_medio
FROM products;
```

## 🔍 Funcionalidades Úteis do pgAdmin

### 1. Backup do Banco
1. Clique com botão direito na database "stockwise"
2. Selecione "Backup..."
3. Configure as opções e clique "Backup"

### 2. Restaurar Backup
1. Clique com botão direito na database "stockwise"
2. Selecione "Restore..."
3. Selecione o arquivo de backup

### 3. Visualizar Dados
1. Clique com botão direito em uma tabela
2. Selecione "View/Edit Data" → "All Rows"

### 4. Editar Dados
1. Na visualização de dados, clique duas vezes em uma célula
2. Edite o valor
3. Pressione Enter para salvar

### 5. Criar Índices
1. Clique com botão direito em uma tabela
2. Selecione "Create" → "Index..."
3. Configure o índice conforme necessário

## 🛠️ Troubleshooting

### Erro: "Could not connect to server"
**Causa**: Container PostgreSQL não está rodando ou não está acessível

**Solução**:
1. Verifique se todos os containers estão rodando:
   ```bash
   docker compose ps
   ```
2. Se o PostgreSQL não estiver rodando:
   ```bash
   docker compose up postgres -d
   ```

### Erro: "FATAL: password authentication failed"
**Causa**: Credenciais incorretas

**Solução**:
1. Verifique as credenciais no docker-compose.yml
2. Use exatamente:
   - Host: `postgres`
   - Username: `stockwise_user`
   - Password: `stockwise_password`
   - Database: `stockwise`

### pgAdmin não carrega
**Causa**: Container pgAdmin não está rodando

**Solução**:
```bash
# Verificar logs do pgAdmin
docker compose logs pgadmin

# Reiniciar apenas o pgAdmin
docker compose restart pgadmin
```

### Dados não aparecem nas tabelas
**Causa**: Backend ainda não criou as tabelas ou não há dados

**Solução**:
1. Verifique se o backend está rodando
2. Faça login no frontend e cadastre alguns produtos
3. As tabelas são criadas automaticamente pelo GORM

## 📝 Dicas Avançadas

### 1. Monitorar Performance
- Use a aba "Dashboard" para ver estatísticas do servidor
- Monitore consultas lentas na aba "Statistics"

### 2. Configurar Alertas
- Configure alertas para monitorar uso de espaço
- Monitore conexões ativas

### 3. Gerenciar Usuários
- Crie usuários específicos para diferentes ambientes
- Configure permissões granulares

### 4. Automatizar Backups
- Configure backups automáticos via cron
- Use scripts para backup regular

## 🔐 Segurança

### Produção
Para ambiente de produção, altere:
1. Email e senha padrão do pgAdmin
2. Configure HTTPS
3. Restrinja acesso por IP
4. Use autenticação externa (LDAP/OAuth)

### Exemplo de configuração segura:
```yaml
pgadmin:
  image: dpage/pgadmin4:latest
  environment:
    PGADMIN_DEFAULT_EMAIL: seu-email@empresa.com
    PGADMIN_DEFAULT_PASSWORD: senha-super-segura
    PGADMIN_CONFIG_SERVER_MODE: 'True'
    PGADMIN_CONFIG_ENHANCED_COOKIE_PROTECTION: 'True'
```