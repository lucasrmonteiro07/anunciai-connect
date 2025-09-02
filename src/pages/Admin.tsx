import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/header';
import SEO from '@/components/SEO';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Users, FileText, Crown, Trash2, Eye, Edit, Flame, CreditCard } from 'lucide-react';
import type { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_vip: boolean;
  created_at: string;
}

interface Subscriber {
  id: string;
  email: string;
  user_id: string;
  subscribed: boolean;
  subscription_tier: string;
  subscription_end: string;
  stripe_customer_id: string;
}

interface Service {
  id: string;
  title: string;
  category: string;
  city: string;
  uf: string;
  owner_name: string;
  status: string;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [editForm, setEditForm] = useState({ first_name: '', last_name: '' });

  useEffect(() => {
    // Check authentication and admin role
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Check if user is admin
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin');

        if (roles && roles.length > 0) {
          setIsAdmin(true);
          loadData();
        } else {
          toast.error('Acesso negado: Apenas administradores podem acessar esta página');
          navigate('/');
        }
      } else {
        navigate('/login');
      }
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (!session) {
          navigate('/login');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadData = async () => {
    try {
      // Load profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;
      setProfiles(profilesData || []);

      // Load services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (servicesError) throw servicesError;
      setServices(servicesData || []);

      // Load subscribers
      const { data: subscribersData, error: subscribersError } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (subscribersError) throw subscribersError;
      setSubscribers(subscribersData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erro ao carregar dados');
    }
  };

  const toggleUserVip = async (userId: string, currentVip: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_vip: !currentVip })
        .eq('id', userId);

      if (error) throw error;

      setProfiles(profiles.map(p => 
        p.id === userId ? { ...p, is_vip: !currentVip } : p
      ));
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
    if (!confirm('Tem certeza que deseja excluir este anúncio?')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      setServices(services.filter(s => s.id !== serviceId));
      toast.success('Anúncio excluído com sucesso');
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Erro ao excluir anúncio');
    }
  };

  const openEditUser = (profile: Profile) => {
    setEditingUser(profile);
    setEditForm({
      first_name: profile.first_name || '',
      last_name: profile.last_name || ''
    });
  };

  const updateUserName = async () => {
    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: editForm.first_name.trim() || null,
          last_name: editForm.last_name.trim() || null
        })
        .eq('id', editingUser.id);

      if (error) throw error;

      setProfiles(profiles.map(p => 
        p.id === editingUser.id 
          ? { ...p, first_name: editForm.first_name.trim() || null, last_name: editForm.last_name.trim() || null }
          : p
      ));
      
      setEditingUser(null);
      toast.success('Nome do usuário atualizado com sucesso');
    } catch (error) {
      console.error('Error updating user name:', error);
      toast.error('Erro ao atualizar nome do usuário');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Administração - Anunciai"
        description="Painel administrativo do Anunciai"
        canonical="https://anunciai.app.br/admin"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
          <p className="text-muted-foreground">Gerencie usuários, anúncios e configurações do sistema</p>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Anúncios
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Assinaturas
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Fogaréu</TableHead>
                      <TableHead>Data de Cadastro</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {profile.first_name || profile.last_name ? 
                              `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 
                              'Nome não informado'
                            }
                            {profile.is_vip && (
                              <Flame className="h-4 w-4 text-orange-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{profile.email}</TableCell>
                        <TableCell>
                          <Switch
                            checked={profile.is_vip}
                            onCheckedChange={() => toggleUserVip(profile.id, profile.is_vip)}
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                              <Dialog
                                open={editingUser?.id === profile.id}
                                onOpenChange={(open) => {
                                  if (open) {
                                    openEditUser(profile)
                                  } else {
                                    setEditingUser(null)
                                  }
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => openEditUser(profile)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Editar Nome do Usuário</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="first_name">Primeiro Nome</Label>
                                      <Input
                                        id="first_name"
                                        value={editForm.first_name}
                                        onChange={(e) => setEditForm(prev => ({
                                          ...prev,
                                          first_name: e.target.value
                                        }))}
                                        placeholder="Digite o primeiro nome"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="last_name">Sobrenome</Label>
                                      <Input
                                        id="last_name"
                                        value={editForm.last_name}
                                        onChange={(e) => setEditForm(prev => ({
                                          ...prev,
                                          last_name: e.target.value
                                        }))}
                                        placeholder="Digite o sobrenome"
                                      />
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                      <Button 
                                        variant="outline" 
                                        onClick={() => setEditingUser(null)}
                                      >
                                        Cancelar
                                      </Button>
                                      <Button onClick={updateUserName}>
                                        Salvar
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Anúncios</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Proprietário</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>
                          {service.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{service.category}</Badge>
                        </TableCell>
                        <TableCell>{service.city}, {service.uf}</TableCell>
                        <TableCell>{service.owner_name}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={service.status === 'active' ? 'default' : 'secondary'}
                          >
                            {service.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/anuncio/${service.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/editar-anuncio/${service.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateServiceStatus(service.id, 
                                service.status === 'active' ? 'inactive' : 'active'
                              )}
                            >
                              {service.status === 'active' ? 'Desativar' : 'Ativar'}
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => deleteService(service.id)}
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

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Assinaturas Fogaréu</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Stripe ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribers.map((subscriber) => (
                      <TableRow key={subscriber.id}>
                        <TableCell className="flex items-center gap-2">
                          {subscriber.email}
                          {subscriber.subscribed && (
                            <Flame className="h-4 w-4 text-orange-500" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={subscriber.subscribed ? 'default' : 'secondary'}
                          >
                            {subscriber.subscribed ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-orange-500">
                            {subscriber.subscription_tier || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {subscriber.subscription_end ? 
                            new Date(subscriber.subscription_end).toLocaleDateString('pt-BR') : 
                            'N/A'
                          }
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {subscriber.stripe_customer_id || 'N/A'}
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
    </div>
  );
};

export default Admin;