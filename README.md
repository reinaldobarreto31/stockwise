# 📦 StockWise - Sistema de Controle de Estoque

<div align="center">

![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

Sistema completo de controle de estoque desenvolvido com **Go (Golang)** no backend e **React TypeScript** no frontend, utilizando **PostgreSQL** como banco de dados.

## 🚀 Funcionalidades

- **Autenticação JWT**: Sistema seguro de login e registro
- **Gestão de Produtos**: CRUD completo de produtos
- **Controle de Estoque**: Monitoramento de quantidades e estoque mínimo
- **Relatórios**: Geração de relatórios em PDF e CSV
- **Dashboard**: Visualização de estatísticas e gráficos
- **Alertas**: Notificações para produtos com estoque baixo

## 🛠️ Stack Tecnológica

### 🔧 Backend (Go/Golang)
<div align="left">

![Go](https://img.shields.io/badge/Go-00ADD8?style=flat-square&logo=go&logoColor=white) **Go 1.21+** - Linguagem principal do backend  
![Gin](https://img.shields.io/badge/Gin-00ADD8?style=flat-square&logo=go&logoColor=white) **Gin** - Framework web rápido e minimalista  
![GORM](https://img.shields.io/badge/GORM-00ADD8?style=flat-square&logo=go&logoColor=white) **GORM** - ORM elegante para Go  
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white) **PostgreSQL** - Banco de dados relacional  
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) **JWT** - Autenticação stateless  
![bcrypt](https://img.shields.io/badge/bcrypt-00ADD8?style=flat-square&logo=go&logoColor=white) **bcrypt** - Hash seguro de senhas  
![PDF](https://img.shields.io/badge/gofpdf-00ADD8?style=flat-square&logo=go&logoColor=white) **gofpdf** - Geração de relatórios PDF  

</div>

### 🎨 Frontend
<div align="left">

![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) **React 18** - Biblioteca para interfaces  
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white) **TypeScript** - JavaScript tipado  
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white) **Axios** - Cliente HTTP  
![Recharts](https://img.shields.io/badge/Recharts-FF6384?style=flat-square&logo=chart.js&logoColor=white) **Recharts** - Gráficos e visualizações  
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) **CSS-in-JS** - Estilização moderna  

</div>

### 🚀 DevOps & Infraestrutura
<div align="left">

![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) **Docker** - Containerização de aplicações  
![Docker Compose](https://img.shields.io/badge/Docker_Compose-2496ED?style=flat-square&logo=docker&logoColor=white) **Docker Compose** - Orquestração de containers  
![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat-square&logo=nginx&logoColor=white) **Nginx** - Servidor web para frontend  
![pgAdmin](https://img.shields.io/badge/pgAdmin-336791?style=flat-square&logo=postgresql&logoColor=white) **pgAdmin** - Interface de administração PostgreSQL  

</div>

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