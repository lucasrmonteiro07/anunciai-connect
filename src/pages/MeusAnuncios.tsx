import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/header';
import ServiceCard, { ServiceData } from '@/components/ui/service-card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import SEO from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const MeusAnuncios = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth and redirect if not logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login');
        return;
      }
      setUser(session.user);
      loadUserServices(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          navigate('/login');
          return;
        }
        setUser(session.user);
        loadUserServices(session.user.id);
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadUserServices = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user services:', error);
        toast.error('Erro ao carregar seus anúncios');
        return;
      }

      // Transform to ServiceData format
      const transformedServices: ServiceData[] = (data || []).map(service => ({
        id: service.id,
        title: service.title,
        description: service.description || '',
        category: service.category,
        type: service.type as 'prestador' | 'empreendimento',
        location: { 
          city: service.city, 
          uf: service.uf,
          latitude: service.latitude ? Number(service.latitude) : undefined,
          longitude: service.longitude ? Number(service.longitude) : undefined,
          address: service.address
        },
        contact: { 
          phone: service.phone || '', 
          email: service.email || '',
          whatsapp: service.whatsapp || undefined
        },
        logo: service.logo_url || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
        images: service.images || [],
        isVip: false, // VIP is now from user profile, not service
        denomination: service.denomination || '',
        ownerName: '',
        socialMedia: {
          instagram: service.instagram || undefined,
          facebook: service.facebook || undefined,
          website: service.website || undefined
        }
      }));

      setServices(transformedServices);
    } catch (error) {
      console.error('Error loading user services:', error);
      toast.error('Erro ao carregar seus anúncios');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Tem certeza que deseja excluir este anúncio?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) {
        toast.error('Erro ao excluir anúncio');
        return;
      }

      toast.success('Anúncio excluído com sucesso');
      // Reload services
      if (user) {
        loadUserServices(user.id);
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Erro ao excluir anúncio');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Meus Anúncios - Anunciai"
        description="Gerencie seus anúncios de serviços e empreendimentos cristãos."
        canonical="https://anunciai.app.br/meus-anuncios"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Meus Anúncios</h1>
            <p className="text-muted-foreground">
              Gerencie todos os seus anúncios em um só lugar
            </p>
          </div>
          <Button asChild>
            <a href="/anunciar">
              <Plus className="h-4 w-4 mr-2" />
              Novo Anúncio
            </a>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-muted h-48 rounded-t-lg"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4">Nenhum anúncio encontrado</h3>
              <p className="text-muted-foreground mb-6">
                Você ainda não criou nenhum anúncio. Comece agora mesmo e divulgue seus serviços para a comunidade cristã.
              </p>
              <Button asChild size="lg">
                <a href="/anunciar">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Anúncio
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="relative group">
                <ServiceCard 
                  service={service}
                  onClick={() => navigate(`/anuncio/${service.id}`)}
                />
                
                {/* Action buttons overlay */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/anuncio/${service.id}`);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/editar-anuncio/${service.id}`);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteService(service.id);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MeusAnuncios;