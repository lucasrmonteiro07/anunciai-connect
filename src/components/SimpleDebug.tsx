import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const SimpleDebug = () => {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const testResults: any = {};

    try {
      // Teste 1: Count total na tabela services
      const { count: servicesCount, error: servicesError } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true });
      
      testResults.services_total = {
        count: servicesCount,
        error: servicesError?.message
      };

      // Teste 2: Count active na tabela services  
      const { count: activeCount, error: activeError } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      
      testResults.services_active = {
        count: activeCount,
        error: activeError?.message
      };

      // Teste 3: Count na tabela services_public
      const { count: publicCount, error: publicError } = await supabase
        .from('services_public')
        .select('*', { count: 'exact', head: true });
      
      testResults.services_public = {
        count: publicCount,
        error: publicError?.message
      };

      // Teste 4: Dados sample da tabela services_public
      const { data: sampleData, error: sampleError } = await supabase
        .from('services_public')
        .select('id, title, category, city, status')
        .limit(3);
      
      testResults.sample_data = {
        data: sampleData,
        error: sampleError?.message
      };

      // Teste 5: Verificar se a view services_public_safe funciona
      const { count: safeCount, error: safeError } = await supabase
        .from('services_public_safe')
        .select('*', { count: 'exact', head: true });
      
      testResults.services_public_safe = {
        count: safeCount,
        error: safeError?.message
      };

    } catch (error: any) {
      testResults.global_error = error.message;
    }

    setResults(testResults);
    setLoading(false);
  };

  return (
    <div className="fixed top-4 left-4 z-50 bg-black/90 text-white p-4 rounded-lg max-w-md">
      <h3 className="font-bold mb-2">🔧 Debug Simples</h3>
      
      <button 
        onClick={runTests}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded mb-3"
      >
        {loading ? 'Testando...' : 'Executar Testes'}
      </button>

      {Object.keys(results).length > 0 && (
        <div className="space-y-2 text-xs">
          {Object.entries(results).map(([key, value]: [string, any]) => (
            <div key={key} className="border-l-2 border-blue-500 pl-2">
              <div className="font-semibold">{key}:</div>
              <pre className="text-gray-300">{JSON.stringify(value, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleDebug;