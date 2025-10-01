import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import App from './App.tsx'
import './index.css'
import { PERFORMANCE_CONFIG } from "./config/performance"

// Configuração otimizada do React Query para cache inteligente
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: PERFORMANCE_CONFIG.STALE_TIME,
      gcTime: PERFORMANCE_CONFIG.CACHE_TIME,
      refetchOnWindowFocus: PERFORMANCE_CONFIG.REFETCH_ON_WINDOW_FOCUS,
      refetchInterval: PERFORMANCE_CONFIG.REFETCH_INTERVAL,
      retry: PERFORMANCE_CONFIG.MAX_RETRIES,
      retryDelay: PERFORMANCE_CONFIG.RETRY_DELAY,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
