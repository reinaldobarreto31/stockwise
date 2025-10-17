-- Inicialização do banco de dados StockWise
-- Este arquivo é executado automaticamente quando o container PostgreSQL é criado

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Configurações de timezone
SET timezone = 'America/Sao_Paulo';

-- Criar índices para melhor performance (serão criados após as tabelas serem criadas pelo GORM)
-- Os índices serão criados automaticamente pelo GORM, mas podemos adicionar alguns específicos aqui se necessário

-- Inserir dados de exemplo (opcional)
-- Estes dados serão inseridos após as tabelas serem criadas pelo backend

-- Configurações de performance
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_duration = on;

-- Recarregar configurações
SELECT pg_reload_conf();