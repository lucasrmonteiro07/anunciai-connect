# 🔍 DEBUG: Anúncios não aparecem na página inicial

## 📋 Problema Reportado
Os anúncios não estão aparecendo na página inicial do site Anunciai.

## 🛠️ Ferramentas de Debug Implementadas

### 1. **Arquivo de Teste HTML** (`test-supabase-connection.html`)
- Teste standalone da conexão Supabase
- Não depende do React ou build do projeto
- Testa diretamente a API do Supabase

**Como usar:**
1. Abra o arquivo `test-supabase-connection.html` diretamente no navegador
2. Clique em "🔌 Testar Conexão" - verifica se a API responde
3. Clique em "📋 Buscar Serviços" - busca todos os serviços da tabela
4. Clique em "🔎 Ver Detalhes da View" - verifica permissões
5. Observe o console do navegador (F12) para logs detalhados

### 2. **Debug Panel no React** (Componente `DebugPanel.tsx`)
- Botão flutuante com 🐛 no canto inferior direito
- Abre um painel com informações em tempo real
- Testa a conexão e mostra erros/sucessos

**Como usar:**
1. Execute o projeto: `npm run dev`
2. Abra a página inicial
3. Clique no botão 🐛 no canto inferior direito
4. O painel mostrará o status da conexão e dados

### 3. **Logs Melhorados no Hook** (`useServices.ts`)
- Logs detalhados em cada etapa:
  - 🔄 Início da busca
  - 📦 Resposta recebida (com contagem)
  - ❌ Erros detalhados (com código, mensagem, hint)
  - ⚠️ Warnings se tabela vazia
  - ✅ Sucesso com quantidade
  - 🎯 Dados processados e ordenados
  - 📊 Estado final do hook

**Como usar:**
1. Abra o Console do Navegador (F12 → Console)
2. Recarregue a página
3. Procure por logs começando com emojis (🔄, 📦, ❌, ⚠️, ✅, 🎯, 📊)

## 🔎 Possíveis Causas do Problema

### 1. **Tabela Vazia**
A view `services_public_safe` pode não ter dados ainda.

**Verificação:**
- O debug panel mostrará "Tabela vazia"
- O log mostrará: `⚠️ useServices: Nenhum serviço encontrado`

**Solução:**
- Cadastrar ao menos 1 anúncio via página `/anunciar`
- Verificar se há anúncios com `status = 'active'`

### 2. **Erro de Permissão (RLS)**
O Row Level Security pode estar bloqueando o acesso anônimo.

**Verificação:**
- O debug panel mostrará erro de permissão
- Console mostrará erro 401 ou 403

**Solução:**
```sql
-- Execute no Supabase SQL Editor
GRANT SELECT ON public.services_public_safe TO anon;
GRANT SELECT ON public.services_public_safe TO authenticated;
```

### 3. **View Não Existe ou Corrompida**
A view `services_public_safe` pode não existir.

**Verificação:**
- Erro: "relation does not exist"

**Solução:**
```sql
-- Recriar a view no Supabase SQL Editor
DROP VIEW IF EXISTS public.services_public_safe;

CREATE VIEW public.services_public_safe 
WITH (security_invoker = true)
AS
SELECT 
  id, title, description, category, type, city, uf,
  latitude, longitude, logo_url, images, denomination,
  created_at, updated_at, status, is_vip, user_id,
  instagram, facebook, website, valor, product_type,
  price, condition, brand, model, warranty_months,
  delivery_available, stock_quantity, neighborhood, cep
FROM public.services_public
WHERE status = 'active';

GRANT SELECT ON public.services_public_safe TO anon;
GRANT SELECT ON public.services_public_safe TO authenticated;
```

### 4. **Cache do React Query**
Cache pode estar servindo dados vazios.

**Verificação:**
- Logs mostram dados mas UI não atualiza

**Solução:**
- Limpar cache do navegador (Ctrl+Shift+R)
- Ou clicar no botão "Atualizar" na página

### 5. **Erro de Build/Bundle**
Código pode não estar compilando corretamente.

**Verificação:**
- Erros no terminal do Vite
- Console do navegador com erros 404

**Solução:**
```bash
# Limpar e rebuildar
rm -rf node_modules/.vite
npm run dev
```

## 📊 Passo a Passo para Diagnóstico

### Etapa 1: Teste Básico (sem React)
1. Abra `test-supabase-connection.html` no navegador
2. Execute os testes
3. **Se falhar aqui**: Problema é no Supabase (banco/view/permissões)
4. **Se passar**: Problema é no React/código

### Etapa 2: Verifique Console do Navegador
1. Abra o site normal (`npm run dev`)
2. Abra Console (F12)
3. Procure logs com emojis
4. Identifique onde está parando:
   - 🔄 Não aparece? Hook não está executando
   - 📦 Mostra erro? Problema na query
   - ⚠️ Tabela vazia? Cadastre anúncios
   - ✅ Sucesso mas não aparece? Problema no render

### Etapa 3: Use o Debug Panel
1. Clique no botão 🐛
2. Veja o status
3. Compare com os logs do console
4. Use "Testar Novamente" para forçar refresh

### Etapa 4: Verifique Dados Manualmente
1. Vá para [Supabase Dashboard](https://app.supabase.com)
2. Table Editor → `services_public`
3. Verifique se há registros com `status = 'active'`

## 🚀 Próximos Passos

Depois de identificar o problema:

1. **Se for tabela vazia**: Cadastre anúncios de teste
2. **Se for permissão**: Execute os GRANTs acima
3. **Se for view**: Recrie a view
4. **Se for cache**: Limpe o cache

## 🗑️ Remover Debug (Após Resolver)

Depois de resolver o problema, remova os arquivos de debug:

```bash
# Remover arquivo HTML de teste
rm test-supabase-connection.html

# Remover componente Debug
rm src/components/DebugPanel.tsx

# Remover import e uso no Index.tsx
# (editar manualmente src/pages/Index.tsx)
```

E reverta os logs extras em `src/hooks/useServices.ts` (opcional, mas recomendado para produção).

## 📝 Checklist de Verificação

- [ ] Teste HTML passa?
- [ ] Console mostra logs do useServices?
- [ ] Debug Panel mostra sucesso?
- [ ] Existem dados na tabela services_public?
- [ ] View services_public_safe existe?
- [ ] Permissões GRANT estão configuradas?
- [ ] Cache foi limpo?

---

**Desenvolvido em:** 03/10/2025  
**Status:** Ferramentas de debug implementadas, aguardando testes
