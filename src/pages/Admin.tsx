import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Edit, Trash2, UserPlus, Crown, Flame, Database } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  is_vip: boolean | null;
  created_at: string | null;
}

interface Service {
  id: string;
  title: string;
  description: string | null;
  category: string;
  type: string;
  city: string;
  uf: string;
  status: string | null;
  created_at: string | null;
  user_id: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cleanupLoading, setCleanupLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }

      setUser(session.user);

      // Check if user is admin
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id);

      const adminRole = roles?.find(r => r.role === 'admin');
      
      if (!adminRole) {
        navigate('/');
        toast.error('Acesso negado. Apenas administradores podem acessar esta página.');
        return;
      }

      setIsAdmin(true);
      loadData(true, session.user.id);
    } catch (error) {
      console.error('Error checking auth:', error);
      navigate('/login');
    }
  };

  const loadData = async (isAdminUser: boolean, userId?: string) => {
    if (!isAdminUser) return;

    try {
      setLoading(true);

      // Load profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;
      setProfiles(profilesData as Profile[] || []);

      // Load services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (servicesError) throw servicesError;
      setServices(servicesData as Service[] || []);

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const updateVipStatus = async (userId: string, currentVip: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_vip: !currentVip })
        .eq('id', userId);

      if (error) throw error;

      // Log admin action
      await supabase.rpc('log_admin_action', {
        action_type: `vip_status_${!currentVip ? 'enabled' : 'disabled'}`,
        target_type: 'user',
        target_id: userId,
        details: { previous_status: currentVip, new_status: !currentVip }
      });

      setProfiles(profiles.map(p => 
        p.id === userId ? { ...p, is_vip: !currentVip } : p
      ) as Profile[]);
      toast.success(`Status Fogaréu ${!currentVip ? 'ativado' : 'desativado'} com sucesso`);
    } catch (error) {
      console.error('Error updating VIP status:', error);
      toast.error('Erro ao atualizar status VIP');
    }
  };

  const updateServiceStatus = async (serviceId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ status: newStatus })
        .eq('id', serviceId);

      if (error) throw error;

      // Log admin action
      await supabase.rpc('log_admin_action', {
        action_type: 'service_status_updated',
        target_type: 'service',
        target_id: serviceId,
        details: { new_status: newStatus }
      });

      setServices(services.map(s => 
        s.id === serviceId ? { ...s, status: newStatus } : s
      ));
      toast.success(`Status do anúncio atualizado para ${newStatus}`);
    } catch (error) {
      console.error('Error updating service status:', error);
      toast.error('Erro ao atualizar status do anúncio');
    }
  };

  const deleteService = async (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;
    
    if (!confirm(`Tem certeza que deseja excluir o anúncio "${service.title}"?`)) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      // Log admin action
      await supabase.rpc('log_admin_action', {
        action_type: 'service_deleted',
        target_type: 'service',
        target_id: serviceId,
        details: { service_title: service.title, service_category: service.category }
      });

      setServices(services.filter(s => s.id !== serviceId));
      toast.success('Anúncio excluído com sucesso');
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Erro ao excluir anúncio');
    }
  };

  const makeUserAdmin = async (userId: string) => {
    const profile = profiles.find(p => p.id === userId);
    if (!profile) return;
    
    if (!confirm(`Tem certeza que deseja promover "${profile.first_name || profile.email}" a administrador?`)) return;
    
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: 'admin'
        });

      if (error) throw error;

      // Log admin action
      await supabase.rpc('log_admin_action', {
        action_type: 'user_promoted_to_admin',
        target_type: 'user',
        target_id: userId,
        details: { user_name: profile.first_name || profile.email }
      });

      toast.success('Usuário promovido a admin com sucesso');
      loadData(isAdmin, user?.id);
    } catch (error) {
      console.error('Error making user admin:', error);
      toast.error('Erro ao promover usuário a admin');
    }
  };

  const deleteUser = async (userId: string) => {
    const profile = profiles.find(p => p.id === userId);
    if (!profile) return;

    // Prevent self-deletion
    if (userId === user?.id) {
      toast.error('Você não pode excluir sua própria conta');
      return;
    }
    
    const userName = profile.first_name && profile.last_name 
      ? `${profile.first_name} ${profile.last_name}`
      : profile.first_name || profile.last_name || profile.email;

    if (!confirm(`⚠️ ATENÇÃO: Tem certeza que deseja EXCLUIR permanentemente o usuário "${userName}"?\n\nEsta ação irá:\n- Remover o usuário do sistema\n- Excluir todos os anúncios deste usuário\n- Remover todas as avaliações\n- Esta ação NÃO pode ser desfeita!`)) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { userId }
      });

      if (error) throw error;

      if (!data?.success) {
        throw new Error(data?.error || 'Erro ao excluir usuário');
      }

      setProfiles(profiles.filter(p => p.id !== userId));
      toast.success('Usuário excluído com sucesso');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error('Erro ao excluir usuário: ' + (error?.message || 'Erro desconhecido'));
    }
  };

  const cleanupDuplicates = async () => {
    setCleanupLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('cleanup-duplicates');
      
      if (error) throw error;
      
      if (data.success) {
        toast.success(`Limpeza concluída: ${data.details.total_removed} duplicados removidos`);
        loadData(isAdmin, user?.id);
      } else {
        throw new Error(data.error || 'Erro na limpeza');
      }
    } catch (error: any) {
      console.error('Error cleaning duplicates:', error);
      toast.error('Erro ao limpar duplicados: ' + (error?.message || 'Erro desconhecido'));
    } finally {
      setCleanupLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Carregando...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
            <p>Apenas administradores podem acessar esta página.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
            <p className="text-muted-foreground">Gerencie usuários e anúncios da plataforma</p>
          </div>
          <Button
            onClick={cleanupDuplicates}
            disabled={cleanupLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            {cleanupLoading ? 'Limpando...' : 'Limpar Duplicados'}
          </Button>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="services">Anúncios</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Gerenciar Usuários ({profiles.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Data de Cadastro</TableHead>
                      <TableHead>Status Fogaréu</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {profile.first_name && profile.last_name 
                                ? `${profile.first_name} ${profile.last_name}`
                                : profile.first_name || profile.last_name || 'Nome não informado'
                              }
                            </span>
                            {profile.is_vip && (
                              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                                <Flame className="h-3 w-3 mr-1" />
                                VIP
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {profile.email || 'Email não informado'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {profile.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={!!profile.is_vip}
                              onCheckedChange={() => updateVipStatus(profile.id, !!profile.is_vip)}
                            />
                            <span className="text-sm text-muted-foreground">
                              {profile.is_vip ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/profile?user=${profile.id}`)}
                              title="Ver perfil do usuário"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/profile?user=${profile.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                              Editar Perfil
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => makeUserAdmin(profile.id)}
                              title="Promover a administrador"
                            >
                              <Crown className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => deleteUser(profile.id)}
                              title="Excluir usuário permanentemente"
                              disabled={profile.id === user?.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Gerenciar Anúncios ({services.length})</span>
                  <Badge variant="outline" className="ml-2">
                    {services.filter(s => s.status === 'active').length} ativos
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell 
                          className="font-medium cursor-pointer hover:text-primary"
                          onClick={() => navigate(`/servico/${service.id}`)}
                        >
                          {service.title.toUpperCase()}
                        </TableCell>
                        <TableCell>{service.category}</TableCell>
                        <TableCell>
                          <Badge variant={service.type === 'prestador' ? 'default' : 'secondary'}>
                            {service.type === 'prestador' ? 'Serviço' : 'Estabelecimento'}
                          </Badge>
                        </TableCell>
                        <TableCell>{service.city}, {service.uf}</TableCell>
                        <TableCell>
                          <Badge variant={service.status === 'active' ? 'default' : 'destructive'}>
                            {service.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {service.created_at ? new Date(service.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/servico/${service.id}`)}
                              title="Ver anúncio"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/editar-anuncio/${service.id}`)}
                              title="Editar anúncio"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateServiceStatus(service.id, service.status === 'active' ? 'inactive' : 'active')}
                              title={service.status === 'active' ? 'Desativar' : 'Ativar'}
                            >
                              {service.status === 'active' ? '❌' : '✅'}
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => deleteService(service.id)}
                              title="Excluir anúncio"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;