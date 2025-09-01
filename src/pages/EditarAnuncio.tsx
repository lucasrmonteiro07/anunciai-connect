import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/ui/header";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

const EditarAnuncio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [denomination, setDenomination] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [website, setWebsite] = useState("");

  const estabelecimentos = [
    "Restaurante", "Lanchonete", "Padaria", "Confeitaria", "Sorveteria", "Pizzaria", "Hamburgueria",
    "Igreja", "Templo", "Capela", "Ministério", "Casa de Oração", "Centro de Culto",
    "Escola", "Faculdade", "Curso Técnico", "Curso de Idiomas", "Reforço Escolar",
    "Hospital", "Clínica", "Consultório", "Laboratório", "Farmácia", "Ótica",
    "Loja de Roupas", "Calçados", "Acessórios", "Perfumaria", "Livraria", "Papelaria",
    "Supermercado", "Mercado", "Açougue", "Hortifruti", "Casa de Carnes",
    "Oficina Mecânica", "Lava Jato", "Auto Peças", "Borracharia", "Funilaria",
    "Salão de Beleza", "Barbearia", "Estética", "Manicure", "Depilação",
    "Academia", "Studio de Dança", "Artes Marciais", "Pilates", "Yoga"
  ];

  const prestadorServicos = [
    "Pedreiro", "Pintor", "Eletricista", "Encanador", "Marceneiro", "Serralheiro",
    "Jardineiro", "Faxineira", "Diarista", "Cuidador de Idosos", "Babá",
    "Professor Particular", "Instrutor", "Tutor", "Coach", "Consultor",
    "Advogado", "Contador", "Arquiteto", "Engenheiro", "Designer",
    "Fotógrafo", "Videomaker", "DJ", "Músico", "Cantor", "Organizador de Eventos",
    "Cabeleireiro", "Manicure", "Esteticista", "Massoterapeuta", "Personal Trainer",
    "Mecânico", "Borracheiro", "Funileiro", "Soldador", "Técnico em Eletrônicos",
    "Confeiteiro", "Cozinheiro", "Garçom", "Bartender", "Salgadeiro",
    "Costureira", "Sapateiro", "Relojoeiro", "Técnico em Informática", "Web Designer",
    "Motorista", "Entregador", "Carregador", "Mudanças", "Frete"
  ];

  const denominacoes = [
    "Assembleia de Deus",
    "Igreja Batista", 
    "Igreja Universal do Reino de Deus",
    "Igreja do Evangelho Quadrangular",
    "Congregação Cristã no Brasil",
    "Igreja Pentecostal Deus é Amor",
    "Igreja Mundial do Poder de Deus",
    "Igreja Adventista do Sétimo Dia",
    "Igreja Presbiteriana",
    "Igreja Metodista",
    "Igreja Luterana",
    "Igreja Católica Apostólica Romana",
    "Igreja Evangélica",
    "Igreja Pentecostal",
    "Igreja Neopentecostal",
    "Igreja Protestante",
    "Igreja Carismática",
    "Igreja Renovada",
    "Igreja Internacional da Graça de Deus",
    "Igreja Cristã Maranata",
    "Sem Denominação"
  ];

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (!session) {
          navigate('/login');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        navigate('/login');
      } else {
        loadService();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, id]);

  const loadService = async () => {
    if (!id) {
      toast.error('ID do anúncio não encontrado');
      navigate('/meus-anuncios');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching service:', error);
        toast.error('Anúncio não encontrado');
        navigate('/meus-anuncios');
        return;
      }

      if (!data) {
        toast.error('Anúncio não encontrado');
        navigate('/meus-anuncios');
        return;
      }

      // Verificar se o usuário é o dono do anúncio
      if (user && data.user_id !== user.id) {
        toast.error('Você não tem permissão para editar este anúncio');
        navigate('/meus-anuncios');
        return;
      }

      // Carregar dados do anúncio
      setTitle(data.title || '');
      setDescription(data.description || '');
      setCategory(data.category || '');
      setType(data.type || '');
      setDenomination(data.denomination || '');
      setAddress(data.address || '');
      setCity(data.city || '');
      setUf(data.uf || '');
      setPhone(data.phone || '');
      setEmail(data.email || '');
      setWhatsapp(data.whatsapp || '');
      setInstagram(data.instagram || '');
      setFacebook(data.facebook || '');
      setWebsite(data.website || '');

    } catch (error) {
      console.error('Error loading service:', error);
      toast.error('Erro ao carregar anúncio');
      navigate('/meus-anuncios');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    if (!type) {
      toast.error('Tipo de anúncio é obrigatório');
      return;
    }

    if (!category) {
      toast.error('Categoria é obrigatória');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('services')
        .update({
          title,
          description,
          category,
          type,
          denomination,
          address,
          city,
          uf,
          phone,
          email,
          whatsapp,
          instagram,
          facebook,
          website,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user?.id); // Garantir que só o dono pode editar

      if (error) throw error;

      toast.success('Anúncio atualizado com sucesso!');
      navigate('/meus-anuncios');
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Erro ao atualizar anúncio');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-8 bg-muted rounded w-1/2"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Editar Anúncio - Anunciai"
        description="Edite as informações do seu anúncio na plataforma cristã Anunciai."
        canonical={`https://anunciai.app.br/editar-anuncio/${id}`}
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/meus-anuncios')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Meus Anúncios
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Editar Anúncio</h1>
          
          <div className="bg-card rounded-lg p-8 border shadow-sm space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium mb-2">Título *</label>
              <Input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nome do seu negócio ou serviço"
              />
            </div>

            {/* Tipo de Anúncio */}
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Anúncio *</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              >
                <option value="">Selecione o tipo</option>
                <option value="prestador">Prestador de Serviços</option>
                <option value="empreendimento">Empreendimento</option>
              </select>
            </div>

            {/* Categoria */}
            {type && (
              <div>
                <label className="block text-sm font-medium mb-2">Categoria *</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                >
                  <option value="">Selecione a categoria</option>
                  {(type === "prestador" ? prestadorServicos : estabelecimentos).map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva seu negócio ou serviço..."
                rows={4}
              />
            </div>

            {/* Denominação */}
            <div>
              <label className="block text-sm font-medium mb-2">Denominação (Opcional)</label>
              <select 
                value={denomination}
                onChange={(e) => setDenomination(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              >
                <option value="">Selecione sua denominação</option>
                {denominacoes.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            {/* Localização */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Endereço</label>
                <Input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua, número, bairro"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cidade</label>
                <Input 
                  type="text" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Cidade"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">UF</label>
                <Input 
                  type="text" 
                  value={uf}
                  onChange={(e) => setUf(e.target.value)}
                  placeholder="UF"
                  maxLength={2}
                />
              </div>
            </div>

            {/* Contato */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Telefone</label>
                <Input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">WhatsApp</label>
                <Input 
                  type="tel" 
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Redes Sociais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Instagram</label>
                <Input 
                  type="text" 
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@seuinstagram"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Facebook</label>
                <Input 
                  type="text" 
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="facebook.com/seuperfil"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Website</label>
                <Input 
                  type="url" 
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="www.seusite.com"
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-6 border-t">
              <Button 
                variant="outline" 
                onClick={() => navigate('/meus-anuncios')}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSave}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditarAnuncio;