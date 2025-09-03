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
    const maxAttempts = 5;
    
    const loadAd = () => {
      try {
        if (attempts >= maxAttempts) {
          console.log('AdSense: Máximo de tentativas atingido para slot:', slot);
          return;
        }
        
        attempts++;
        
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          console.log('AdSense carregado com sucesso para slot:', slot);
        } else {
          console.log(`AdSense não disponível ainda (tentativa ${attempts}/${maxAttempts}), tentando novamente em 2s...`);
          setTimeout(loadAd, 2000);
        }
      } catch (err) {
        console.error("AdSense error:", err);
      }
    };

    // Aguardar um pouco para garantir que o DOM está pronto
    const timer = setTimeout(loadAd, 1000);
    return () => clearTimeout(timer);
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
    </div>
  );
};

export default ChristianAd;