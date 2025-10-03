import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ServiceData } from '@/components/ui/service-card';
import { PERFORMANCE_CONFIG } from '@/config/performance';

// Query key for services
export const SERVICES_QUERY_KEY = ['services'];

// Hook para carregar serviços com cache otimizado
export const useServices = () => {
  const queryClient = useQueryClient();

  const { data: services = [], isLoading, error, refetch } = useQuery({
    queryKey: SERVICES_QUERY_KEY,
    queryFn: async (): Promise<ServiceData[]> => {
      console.log('🔄 useServices: Iniciando busca de serviços...');
      
      const { data: servicesData, error: servicesError, count } = await supabase
        .from('services_public_safe')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      console.log('📦 useServices: Resposta recebida:', {
        total: servicesData?.length || 0,
        count,
        hasError: !!servicesError,
        errorDetails: servicesError
      });

      if (servicesError) {
        console.error('❌ useServices: Erro ao buscar serviços:', servicesError);
        console.error('   - Mensagem:', servicesError.message);
        console.error('   - Código:', servicesError.code);
        console.error('   - Detalhes:', servicesError.details);
        console.error('   - Hint:', servicesError.hint);
        throw servicesError;
      }

      if (!servicesData || servicesData.length === 0) {
        console.warn('⚠️ useServices: Nenhum serviço encontrado na tabela services_public_safe');
        console.warn('   - Count da query:', count);
        console.warn('   - Dados retornados:', servicesData);
        return [];
      }

      console.log('✅ useServices: Serviços encontrados:', servicesData.length);

      // Transform data
      const transformedServices: ServiceData[] = servicesData.map(service => ({
        id: service.id || '',
        title: service.title || '',
        description: service.description || '',
        category: service.category || '',
        type: (service.type as 'prestador' | 'empreendimento') || 'prestador',
        location: { 
          city: service.city || '', 
          uf: service.uf || '',
          latitude: service.latitude ? Number(service.latitude) : undefined,
          longitude: service.longitude ? Number(service.longitude) : undefined,
          address: undefined
        },
        contact: { 
          phone: '', 
          email: '',
          whatsapp: undefined
        },
        logo: service.logo_url && service.logo_url.trim() !== '' 
          ? service.logo_url 
          : 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
        images: (service.images && Array.isArray(service.images)) 
          ? service.images.filter(img => img && typeof img === 'string' && img.trim() !== '')
          : [],
        isVip: service.is_vip || false,
        denomination: service.denomination || '',
        ownerName: '',
        valor: service.valor || undefined,
        product_type: (service.product_type as 'service' | 'product') || 'service',
        price: service.price || undefined,
        condition: service.condition || undefined,
        brand: service.brand || undefined,
        model: service.model || undefined,
        warranty_months: service.warranty_months || undefined,
        delivery_available: service.delivery_available || false,
        stock_quantity: service.stock_quantity || undefined,
        userId: service.user_id || undefined,
        socialMedia: {
          instagram: service.instagram || undefined,
          facebook: service.facebook || undefined,
          website: service.website || undefined
        }
      }));

      // Sort VIP first
      const sorted = transformedServices.sort((a, b) => {
        if (a.isVip && !b.isVip) return -1;
        if (!a.isVip && b.isVip) return 1;
        return 0;
      });

      console.log('🎯 useServices: Serviços processados e ordenados:', {
        total: sorted.length,
        vipCount: sorted.filter(s => s.isVip).length,
        firstThree: sorted.slice(0, 3).map(s => ({ id: s.id, title: s.title, isVip: s.isVip }))
      });

      return sorted;
    },
    staleTime: PERFORMANCE_CONFIG.STALE_TIME,
    gcTime: PERFORMANCE_CONFIG.CACHE_TIME,
    refetchOnWindowFocus: true,
    refetchInterval: PERFORMANCE_CONFIG.REFETCH_INTERVAL,
  });

  console.log('📊 useServices: Estado atual do hook:', {
    servicesCount: services.length,
    isLoading,
    hasError: !!error,
    errorMessage: error?.message
  });

  // Função para invalidar cache e recarregar
  const invalidateServices = () => {
    queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEY });
  };

  // Função para atualização manual
  const refreshServices = async () => {
    await refetch();
  };

  return {
    services,
    isLoading,
    error,
    invalidateServices,
    refreshServices
  };
};
