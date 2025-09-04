import React, { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface ChristianAdProps {
  slot: string;
  style?: string;
  format?: string;
  className?: string;
}

const ChristianAd: React.FC<ChristianAdProps> = ({ 
  slot, 
  style = "display:block", 
  format = "auto",
  className = "my-4 rounded-lg overflow-hidden"
}) => {
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 3;
    let timeoutId: NodeJS.Timeout;
    
    const loadAd = () => {
      try {
        if (attempts >= maxAttempts) {
          // Silenciosamente falha após 3 tentativas
          return;
        }
        
        attempts++;
        
        // Verificar se o script do AdSense foi carregado
        if (window.adsbygoogle && typeof window.adsbygoogle.push === 'function') {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            // Sucesso - não logar para evitar spam
          } catch (pushError) {
            // Se falhar no push, tentar novamente
            if (attempts < maxAttempts) {
              timeoutId = setTimeout(loadAd, 3000);
            }
          }
        } else {
          // Script ainda não carregou, tentar novamente
          if (attempts < maxAttempts) {
            timeoutId = setTimeout(loadAd, 3000);
          }
        }
      } catch (err) {
        // Erro silencioso - não logar para evitar spam no console
        if (attempts < maxAttempts) {
          timeoutId = setTimeout(loadAd, 3000);
        }
      }
    };

    // Aguardar mais tempo para o script carregar
    timeoutId = setTimeout(loadAd, 2000);
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [slot]);

  return (
    <div className={className}>
      <div className="text-xs text-muted-foreground mb-1 text-center">
        Produtos Cristãos
      </div>
      <ins
        className="adsbygoogle block min-h-[90px]"
        data-ad-client="ca-pub-7412845197984129"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      {/* Fallback para quando AdSense não carrega */}
      <div className="adsense-fallback hidden bg-muted/20 rounded-lg p-4 text-center text-sm text-muted-foreground">
        <p>Espaço para anúncios</p>
        <p className="text-xs mt-1">Produtos e serviços cristãos</p>
      </div>
    </div>
  );
};

export default ChristianAd;