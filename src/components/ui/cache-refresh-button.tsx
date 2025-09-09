import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useCacheBuster } from "@/hooks/use-cache-buster";
import { toast } from "sonner";

interface CacheRefreshButtonProps {
  variant?: "ghost" | "outline" | "default";
  size?: "sm" | "default" | "lg";
  className?: string;
}

export const CacheRefreshButton = ({ 
  variant = "ghost", 
  size = "sm",
  className = ""
}: CacheRefreshButtonProps) => {
  const { forceRefresh } = useCacheBuster();

  const handleRefresh = () => {
    toast.info("Atualizando dados...");
    setTimeout(() => {
      forceRefresh();
    }, 500);
  };

  return (
    <Button 
      variant={variant} 
      size={size}
      onClick={handleRefresh}
      className={className}
      title="Atualizar dados do site"
    >
      <RefreshCw className="h-4 w-4" />
    </Button>
  );
};