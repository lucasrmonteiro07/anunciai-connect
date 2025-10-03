import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface DebugInfo {
  status: 'loading' | 'success' | 'error' | 'empty';
  message: string;
  details?: any;
}

export const DebugPanel = () => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    status: 'loading',
    message: 'Carregando informações de debug...'
  });
  const [isOpen, setIsOpen] = useState(false);

  const testConnection = async () => {
    setDebugInfo({ status: 'loading', message: 'Testando conexão...' });

    try {
      console.log('🔍 Debug: Testando conexão com Supabase...');

      // Teste 1: Verificar conexão básica
      const { data: testData, error: testError, count } = await supabase
        .from('services_public_safe')
        .select('*', { count: 'exact' })
        .limit(5);

      if (testError) {
        console.error('❌ Debug: Erro na conexão:', testError);
        setDebugInfo({
          status: 'error',
          message: `Erro: ${testError.message}`,
          details: {
            code: testError.code,
            hint: testError.hint,
            details: testError.details
          }
        });
        return;
      }

      if (!testData || testData.length === 0) {
        console.warn('⚠️ Debug: Tabela vazia');
        setDebugInfo({
          status: 'empty',
          message: 'A tabela services_public_safe está vazia',
          details: {
            count: count || 0,
            message: 'Nenhum serviço cadastrado ainda'
          }
        });
        return;
      }

      console.log('✅ Debug: Conexão OK. Dados:', testData);
      setDebugInfo({
        status: 'success',
        message: `Conexão OK! ${testData.length} serviços encontrados`,
        details: {
          total: count,
          sample: testData.slice(0, 3),
          vipCount: testData.filter(s => s.is_vip).length
        }
      });

    } catch (err: any) {
      console.error('❌ Debug: Erro inesperado:', err);
      setDebugInfo({
        status: 'error',
        message: `Erro inesperado: ${err.message}`,
        details: err
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      testConnection();
    }
  }, [isOpen]);

  const getStatusIcon = () => {
    switch (debugInfo.status) {
      case 'loading':
        return <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'empty':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
        title="Debug Panel"
      >
        🐛
      </button>

      {/* Panel de debug */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-96 max-h-[600px] overflow-auto">
          <Card className="shadow-2xl border-2 border-orange-500">
            <CardHeader className="bg-orange-500/10">
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon()}
                Debug Panel - Supabase
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <span className="font-semibold">Status:</span>
                <span className={
                  debugInfo.status === 'success' ? 'text-green-500' :
                  debugInfo.status === 'error' ? 'text-red-500' :
                  debugInfo.status === 'empty' ? 'text-yellow-500' :
                  'text-blue-500'
                }>
                  {debugInfo.message}
                </span>
              </div>

              {debugInfo.details && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-semibold mb-2">Detalhes:</p>
                  <pre className="text-xs overflow-auto max-h-60 bg-background p-2 rounded">
                    {JSON.stringify(debugInfo.details, null, 2)}
                  </pre>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={testConnection}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Testar Novamente
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  size="sm"
                  variant="outline"
                >
                  Fechar
                </Button>
              </div>

              <div className="text-xs text-muted-foreground border-t pt-2">
                <p><strong>Supabase URL:</strong> wkchztcfbwnbukpqejix.supabase.co</p>
                <p><strong>Tabela:</strong> services_public_safe</p>
                <p><strong>Timestamp:</strong> {new Date().toLocaleString('pt-BR')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default DebugPanel;
