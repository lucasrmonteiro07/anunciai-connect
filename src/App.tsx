import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { preloadCriticalResources, PERFORMANCE_CONFIG } from "@/config/performance";
import { useCacheBuster } from "@/hooks/use-cache-buster";

// Lazy load das páginas para melhor performance
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Anunciar = lazy(() => import("./pages/Anunciar"));
const Profile = lazy(() => import("./pages/Profile"));

const EditarAnuncio = lazy(() => import("./pages/EditarAnuncio"));
const MeusAnuncios = lazy(() => import("./pages/MeusAnuncios"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const GerenciarPagamento = lazy(() => import("./pages/GerenciarPagamento"));
const Admin = lazy(() => import("./pages/Admin"));

// Componente de loading
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: PERFORMANCE_CONFIG.STALE_TIME,
      gcTime: PERFORMANCE_CONFIG.CACHE_TIME,
      refetchOnWindowFocus: true,
      refetchOnMount: 'always',
      refetchOnReconnect: true,
      retry: PERFORMANCE_CONFIG.MAX_RETRIES,
      retryDelay: PERFORMANCE_CONFIG.RETRY_DELAY,
    },
  },
});

// Preload critical resources
preloadCriticalResources();

const App = () => {
  // Initialize cache buster hook
  const { refreshKey } = useCacheBuster();

  return (
    <QueryClientProvider client={queryClient} key={refreshKey}>
      <BrowserRouter>
        <Toaster />
        <Sonner />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/anunciar" element={<Anunciar />} />

            <Route path="/perfil" element={<Profile />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/editar-anuncio/:id" element={<EditarAnuncio />} />
            <Route path="/meus-anuncios" element={<MeusAnuncios />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/gerenciar-pagamento" element={<GerenciarPagamento />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/anuncio/:id" element={<ServiceDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
