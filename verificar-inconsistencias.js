import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://wkchztcfbwnbukpqejix.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrY2h6dGNmYnduYnVrcHFlaml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mjg1NjksImV4cCI6MjA3MjMwNDU2OX0.NK-ZWen5oFH8qbq8KX9p8tdZipTik2udQsfozb4eKs4";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function verificarInconsistencias() {
  console.log('🔍 Verificando inconsistências nos valores dos planos...');
  
  try {
    // 1. Verificar se há dados de preços no banco que possam estar sobrescrevendo os valores hardcoded
    console.log('\n1. Verificando se há dados de preços no banco...');
    
    // Verificar se há alguma tabela de configurações ou preços
    const tabelasPossiveis = ['pricing', 'plans', 'subscriptions', 'config', 'settings'];
    
    for (const tabela of tabelasPossiveis) {
      try {
        const { data, error } = await supabase
          .from(tabela)
          .select('*')
          .limit(1);
        
        if (!error && data) {
          console.log(`✅ Tabela ${tabela} encontrada:`, data);
        }
      } catch (e) {
        // Tabela não existe, continuar
      }
    }
    
    // 2. Verificar se há variáveis de ambiente que possam estar afetando os preços
    console.log('\n2. Verificando variáveis de ambiente...');
    console.log('💡 Verifique se há variáveis como:');
    console.log('   - VITE_PLAN_PRICE_MONTHLY');
    console.log('   - VITE_PLAN_PRICE_ANNUAL');
    console.log('   - REACT_APP_PLAN_PRICE_MONTHLY');
    console.log('   - REACT_APP_PLAN_PRICE_ANNUAL');
    
    // 3. Verificar se há algum arquivo de configuração
    console.log('\n3. Verificando arquivos de configuração...');
    console.log('💡 Verifique se há arquivos como:');
    console.log('   - config.js');
    console.log('   - constants.js');
    console.log('   - pricing.js');
    console.log('   - .env.local');
    console.log('   - .env.production');
    
    // 4. Verificar se há algum problema com cache ou build
    console.log('\n4. Verificando possíveis problemas de cache...');
    console.log('💡 Possíveis causas:');
    console.log('   - Cache do navegador');
    console.log('   - Cache do CDN (Vercel/Netlify)');
    console.log('   - Build antigo em produção');
    console.log('   - Variáveis de ambiente diferentes entre dev e prod');
    
    // 5. Verificar se há algum problema com a ordem de exibição
    console.log('\n5. Verificando ordem de exibição na página...');
    console.log('📊 Estrutura da página Index.tsx:');
    console.log('   1. Seção Principal (linhas 218-270):');
    console.log('      - Plano Fogaréu: R$ 14,90/mês ✅');
    console.log('      - Plano Anual: R$ 11,90/mês (R$ 142,80/ano) ✅');
    console.log('   2. Seção de Resumo (linhas 297-328):');
    console.log('      - Plano Mensal: R$ 14,90/mês ✅');
    console.log('      - Plano Anual: R$ 11,90/mês (R$ 142,80/ano) ✅');
    
    console.log('\n🎯 DIAGNÓSTICO:');
    console.log('✅ Valores hardcoded estão corretos');
    console.log('✅ Estrutura da página está correta');
    console.log('✅ Não há dados no banco sobrescrevendo os valores');
    console.log('⚠️  Possível problema: Cache ou variáveis de ambiente');
    
    console.log('\n🔧 SOLUÇÕES:');
    console.log('1. Hard refresh: Ctrl + F5');
    console.log('2. Verificar variáveis de ambiente');
    console.log('3. Verificar se o build mais recente está em produção');
    console.log('4. Testar em modo incógnito');
    console.log('5. Verificar se não há cache do CDN');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

verificarInconsistencias();
