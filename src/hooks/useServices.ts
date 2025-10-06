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
      console.log('🔄 Buscando serviços da tabela services_public...');
      
      const { data: servicesData, error: servicesError } = await supabase
        .from('services_public')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (servicesError) {
        console.error('❌ Erro ao buscar serviços:', servicesError);
        throw servicesError;
      }

      if (!servicesData || servicesData.length === 0) {
        console.warn('⚠️ Nenhum serviço encontrado!');
        return [];
      }

      console.log(`✅ ${servicesData.length} serviços encontrados e sendo processados...`);

      // Transform data - com validação melhorada
      const transformedServices: ServiceData[] = servicesData
        .filter(service => service && service.id) // Filtrar dados inválidos
        .map(service => ({
          id: service.id,
          title: service.title || 'Título não informado',
          description: service.description || '',
          category: service.category || 'Categoria não informada',
          type: (service.type as 'prestador' | 'empreendimento') || 'prestador',
          location: { 
            city: service.city || '', 
            uf: service.uf || '',
            latitude: service.latitude ? Number(service.latitude) : undefined,
            longitude: service.longitude ? Number(service.longitude) : undefined,
            address: service.address || undefined
          },
          contact: { 
            phone: service.phone || '', 
            email: service.email || '',
            whatsapp: service.whatsapp || undefined
          },
          logo: service.logo_url && service.logo_url.trim() !== '' 
            ? service.logo_url 
            : 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
          images: (service.images && Array.isArray(service.images)) 
            ? service.images.filter(img => img && typeof img === 'string' && img.trim() !== '')
            : [],
          isVip: Boolean(service.is_vip),
          denomination: service.denomination || '',
          ownerName: '',
          valor: service.valor || undefined,
          product_type: (service.product_type as 'service' | 'product') || 'service',
          price: service.price || undefined,
          condition: service.condition || undefined,
          brand: service.brand || undefined,
          model: service.model || undefined,
          warranty_months: service.warranty_months || undefined,
          delivery_available: Boolean(service.delivery_available),
          stock_quantity: service.stock_quantity || undefined,
          userId: service.user_id || undefined,
          socialMedia: {
            instagram: service.instagram || undefined,
            facebook: service.facebook || undefined,
            website: service.website || undefined
          }
        }));

      // Sort VIP first
      const sortedServices = transformedServices.sort((a, b) => {
        if (a.isVip && !b.isVip) return -1;
        if (!a.isVip && b.isVip) return 1;
        return 0;
      });

      console.log(`🎯 Retornando ${sortedServices.length} serviços processados (${sortedServices.filter(s => s.isVip).length} VIP)`);
      return sortedServices;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: 2,
    retryDelay: 1000,
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
