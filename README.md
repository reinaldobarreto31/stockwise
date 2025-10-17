# StockWise - Sistema de Controle de Estoque

Sistema completo de controle de estoque desenvolvido com Go (backend) e React TypeScript (frontend), utilizando PostgreSQL como banco de dados.

## 🚀 Funcionalidades

- **Autenticação JWT**: Sistema seguro de login e registro
- **Gestão de Produtos**: CRUD completo de produtos
- **Controle de Estoque**: Monitoramento de quantidades e estoque mínimo
- **Relatórios**: Geração de relatórios em PDF e CSV
- **Dashboard**: Visualização de estatísticas e gráficos
- **Alertas**: Notificações para produtos com estoque baixo

## 🛠️ Tecnologias

### Backend
- **Go 1.21+**
- **Gin** - Framework web
- **GORM** - ORM para Go
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **gofpdf** - Geração de PDFs

### Frontend
- **React 18**
- **TypeScript**
- **Axios** - Cliente HTTP
- **Recharts** - Gráficos e visualizações
- **CSS-in-JS** - Estilização

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **Nginx** - Servidor web para frontend

## 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Git (para clonar o repositório)

## 🚀 Como executar

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd stockwise
```

### 2. Configure as variáveis de ambiente (opcional)
```bash
cp .env.example .env
# Edite o arquivo .env conforme necessário
```

### 3. Execute com Docker Compose
```bash
docker-compose up --build
```

### 4. Acesse a aplicação
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **pgAdmin**: http://localhost:5050 (admin@stockwise.com / admin123)
- **Banco de dados**: localhost:5432

## 📁 Estrutura do Projeto

```
stockwise/
├── backend/                 # API Go
│   ├── cmd/                # Executáveis
│   ├── config/             # Configurações
│   ├── internal/           # Código interno
│   │   ├── handlers/       # Controladores HTTP
│   │   ├── middleware/     # Middlewares
│   │   └── models/         # Modelos de dados
│   ├── Dockerfile          # Container do backend
│   └── go.mod             # Dependências Go
├── frontend/               # App React
│   ├── public/            # Arquivos públicos
│   ├── src/               # Código fonte
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas
│   │   └── services/      # Serviços API
│   ├── Dockerfile         # Container do frontend
│   └── package.json       # Dependências Node
├── docker-compose.yml     # Orquestração
└── init.sql              # Script inicial do DB
```

## 🔧 Desenvolvimento

### Backend (Go)
```bash
cd backend
go mod tidy
go run cmd/main.go
```

### Frontend (React)
```bash
cd frontend
npm install
npm start
```

### Banco de dados
```bash
# PostgreSQL local
createdb stockwise
psql stockwise < init.sql
```

## 📊 API Endpoints

### Autenticação
- `POST /auth/register` - Registro de usuário
- `POST /auth/login` - Login

### Produtos (Protegidas)
- `GET /api/products` - Listar produtos
- `POST /api/products` - Criar produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Deletar produto

### Estatísticas (Protegidas)
- `GET /api/stats` - Estatísticas gerais
- `GET /api/reports/csv` - Relatório CSV
- `GET /api/reports/pdf` - Relatório PDF

### Saúde
- `GET /health` - Status da API

## 🔐 Segurança

- Senhas hasheadas com bcrypt
- Autenticação JWT
- CORS configurado
- Headers de segurança no Nginx
- Validação de dados de entrada

## 🐳 Docker

### Serviços
- **postgres**: Banco PostgreSQL
- **backend**: API Go
- **frontend**: App React com Nginx
- **pgadmin**: Interface gráfica para gerenciar PostgreSQL

### Volumes
- `postgres_data`: Dados persistentes do PostgreSQL
- `pgadmin_data`: Configurações e dados do pgAdmin

### Redes
- `stockwise-network`: Rede interna dos containers

## 📈 Monitoramento

### Health Checks
- PostgreSQL: `pg_isready`
- Backend: `GET /health`
- Frontend: Nginx status

### Logs
```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
```

## 🛠️ Troubleshooting

### Problemas comuns

1. **Erro de conexão com banco**
   - Verifique se o PostgreSQL está rodando
   - Confirme as credenciais no docker-compose.yml

2. **Frontend não carrega**
   - Verifique se o backend está respondendo
   - Confirme a configuração do proxy no package.json

3. **Erro de CORS**
   - Verifique a configuração CORS no backend
   - Confirme a URL do frontend nas configurações

### Reset completo
```bash
docker-compose down -v
docker-compose up --build
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👥 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para suporte, abra uma issue no repositório ou entre em contato através do email.