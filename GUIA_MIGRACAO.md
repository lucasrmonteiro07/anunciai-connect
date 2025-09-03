# 🗄️ Guia para Aplicar Migração do Campo Valor

## ⚠️ IMPORTANTE: Migração Necessária

O campo `valor` ainda não foi adicionado ao banco de dados. Para que a funcionalidade de valores nos anúncios funcione, você precisa aplicar a migração.

## 📋 Passo a Passo para Aplicar a Migração

### 1. Acessar o Supabase Dashboard
1. Vá para: https://supabase.com/dashboard
2. Faça login na sua conta
3. Selecione o projeto: **wkchztcfbwnbukpqejix**

### 2. Abrir o SQL Editor
1. No menu lateral, clique em **"SQL Editor"**
2. Clique em **"New query"**

### 3. Executar a Migração
1. Copie todo o conteúdo do arquivo `MIGRACAO_VALOR.sql`
2. Cole no editor SQL
3. Clique em **"Run"** para executar

### 4. Verificar se Funcionou
1. Execute a consulta de verificação no final do script
2. Você deve ver duas linhas retornando as colunas `valor`
3. Se aparecer erro, verifique se executou todo o script

## 🔍 Como Verificar se a Migração Foi Aplicada

### Opção 1: Usar o Script de Teste
```bash
node test-migration.js
```

### Opção 2: Verificar no Supabase
1. Vá para **"Table Editor"**
2. Selecione a tabela `services_public`
3. Verifique se existe a coluna `valor`

## 📊 Resultado Esperado

Após aplicar a migração:
- ✅ Campo `valor` adicionado à tabela `services`
- ✅ Campo `valor` adicionado à tabela `services_public`
- ✅ Função de sincronização atualizada
- ✅ Novos anúncios podem incluir valores
- ✅ Valores são exibidos nos cards e páginas de detalhes

## 🚨 Se Algo Der Errado

### Erro: "column already exists"
- **Solução**: Ignore o erro, significa que a coluna já existe

### Erro: "permission denied"
- **Solução**: Verifique se está logado como admin do projeto

### Erro: "function does not exist"
- **Solução**: Execute todo o script novamente

## 📞 Suporte

Se encontrar problemas:
1. Verifique se está no projeto correto
2. Execute o script completo
3. Verifique as permissões da conta

## ✅ Após a Migração

Quando a migração for aplicada com sucesso:
1. ✅ Execute `node test-migration.js` para confirmar
2. ✅ Teste criando um novo anúncio com valor
3. ✅ Verifique se o valor aparece nos cards
4. ✅ Projeto estará 100% funcional

---

**Status Atual**: ⚠️ **Migração Pendente**  
**Próximo Passo**: Aplicar migração no Supabase  
**Após Migração**: ✅ **Projeto 100% Funcional**
