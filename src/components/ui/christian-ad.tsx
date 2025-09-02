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
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div className={className}>
      <div className="text-xs text-muted-foreground mb-1 text-center">
        Produtos Cristãos
      </div>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7412845197984129"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default ChristianAd;