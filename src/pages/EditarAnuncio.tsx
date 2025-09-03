import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/ui/header";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Camera, Crown } from "lucide-react";
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
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [cep, setCep] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [website, setWebsite] = useState("");

  // Fotos e VIP
  const [isVip, setIsVip] = useState(false);
  const [fotos, setFotos] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  
  // Coordenadas
  const [latitude, setLatitude] = useState<number>(-23.5505);
  const [longitude, setLongitude] = useState<number>(-46.6333);

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

  const checkVipStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('is_vip')
          .eq('id', user.id)
          .single();
        setIsVip(data?.is_vip || false);
      }
    } catch (error) {
      console.error('Error checking VIP status:', error);
    }
  };

  useEffect(() => {
    checkVipStatus();
  }, []);

  const buscarCoordenadas = async (address: string) => {
    try {
      // Melhorar o formato do endereço para geocodificação mais precisa
      const formattedAddress = address
        .replace(/\s+/g, ' ') // Remove espaços extras
        .trim();
      
      console.log('Buscando coordenadas para:', formattedAddress);
      
      // Tentar diferentes formatos de endereço para melhor precisão
      const searchQueries = [
        formattedAddress,
        `${formattedAddress}, Brasil`,
        formattedAddress.replace(', Brasil', '') // Remover Brasil se já estiver
      ];
      
      for (const query of searchQueries) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=br&addressdetails=1`
          );
          
          if (!response.ok) {
            console.warn('Erro na resposta do Nominatim:', response.status);
            continue;
          }
          
          const data = await response.json();
          
          if (data && data.length > 0) {
            const result = data[0];
            console.log('Coordenadas encontradas:', {
              address: result.display_name,
              lat: result.lat,
              lon: result.lon,
              importance: result.importance
            });
            
            // Verificar se a importância é alta o suficiente (mais de 0.3)
            if (result.importance > 0.3) {
              return {
                lat: parseFloat(result.lat),
                lon: parseFloat(result.lon)
              };
            }
          }
        } catch (queryError) {
          console.warn('Erro na consulta:', query, queryError);
          continue;
        }
      }
      
      console.warn('Nenhuma coordenada precisa encontrada para:', formattedAddress);
    } catch (error) {
      console.error("Erro ao buscar coordenadas:", error);
    }
    
    // Coordenadas padrão (Brasil central) se não encontrar
    return { lat: -14.2350, lon: -51.9253 };
  };

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
      setNumber(data.number || '');
      setNeighborhood(data.neighborhood || '');
      setCep(data.cep || '');
      setCity(data.city || '');
      setUf(data.uf || '');
      setPhone(data.phone || '');
      setEmail(data.email || '');
      setWhatsapp(data.whatsapp || '');
      setInstagram(data.instagram || '');
      setFacebook(data.facebook || '');
      setWebsite(data.website || '');
      setExistingImages(data.images || []);
      setLatitude(data.latitude || -23.5505);
      setLongitude(data.longitude || -46.6333);

    } catch (error) {
      console.error('Error loading service:', error);
      toast.error('Erro ao carregar anúncio');
      navigate('/meus-anuncios');
    } finally {
      setLoading(false);
    }
  };

  const handleFotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const maxFotos = isVip ? 5 : 1;
      const currentCount = existingImages.length + fotos.length;
      const remainingSlots = maxFotos - currentCount;
      if (remainingSlots <= 0) return;
      const newFotos = Array.from(e.target.files).slice(0, remainingSlots);
      setFotos(prev => [...prev, ...newFotos]);
    }
  };

  const removeFoto = (index: number) => {
    setFotos(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingFoto = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
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
      let allImages = [...existingImages];

      // Upload das novas fotos se houver
      if (fotos.length > 0) {
        const uploadPromises = fotos.map(async (foto, index) => {
          const fileExt = foto.name.split('.').pop();
          const fileName = `${user?.id}/${id}/foto_${Date.now()}_${index}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('services')
            .upload(fileName, foto);

          if (uploadError) {
            console.error('Error uploading image:', uploadError);
            throw uploadError;
          }

          const { data } = supabase.storage
            .from('services')
            .getPublicUrl(fileName);

          return data.publicUrl;
        });

        const newImageUrls = await Promise.all(uploadPromises);
        allImages = [...allImages, ...newImageUrls];
      }

      const updateData = {
        title: title.trim(),
        description: description?.trim() || null,
        category,
        type,
        denomination: denomination || null,
        address: address?.trim() || null,
        number: number?.trim() || null,
        neighborhood: neighborhood?.trim() || null,
        cep: cep?.trim() || null,
        city: city?.trim() || null,
        uf: uf?.trim() || null,
        phone: phone?.trim() || null,
        email: email?.trim() || null,
        whatsapp: whatsapp?.trim() || null,
        instagram: instagram?.trim() || null,
        facebook: facebook?.trim() || null,
        website: website?.trim() || null,
        images: allImages,
        latitude,
        longitude,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('services')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user?.id);

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
                aria-label="Tipo de anúncio"
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
                  aria-label="Categoria do serviço"
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
                aria-label="Denominação religiosa"
              >
                <option value="">Selecione sua denominação</option>
                {denominacoes.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            {/* Localização */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Endereço</label>
                <Input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua ou Avenida"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Número</label>
                <Input 
                  type="text" 
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="Número"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Endereço Completo (para localização precisa)</label>
                <Input 
                  type="text" 
                  value={`${address}${number ? ', ' + number : ''}${neighborhood ? ', ' + neighborhood : ''}, ${city}, ${uf}`}
                  readOnly
                  className="bg-gray-50"
                  placeholder="Endereço será preenchido automaticamente"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Este endereço completo é usado para localização precisa no mapa. Atualize os campos acima para modificar.
                </p>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={async () => {
                    const fullAddress = `${address}${number ? ', ' + number : ''}${neighborhood ? ', ' + neighborhood : ''}, ${city}, ${uf}, Brasil`;
                    const coords = await buscarCoordenadas(fullAddress);
                    setLatitude(coords.lat);
                    setLongitude(coords.lon);
                    toast.success('Coordenadas atualizadas!');
                  }}
                >
                  🔄 Atualizar Localização no Mapa
                </Button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bairro</label>
                <Input 
                  type="text" 
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Bairro"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CEP</label>
                <Input 
                  type="text" 
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="00000-000"
                  maxLength={9}
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

            {/* Fotos */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Camera className="inline mr-1 h-4 w-4" />
                Fotos do Serviço/Estabelecimento
                <span className="text-muted-foreground">
                  {` (Opcional - até ${isVip ? 5 : 1} ${isVip ? 'fotos' : 'foto'})`}
                </span>
                {isVip && <Crown className="inline ml-1 h-4 w-4 text-primary" />}
              </label>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {existingImages.map((url, index) => (
                  <div key={`existing-${index}`} className="relative">
                    <img
                      src={url}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      onClick={() => removeExistingFoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {fotos.map((foto, index) => (
                  <div key={`new-${index}`} className="relative">
                    <img
                      src={URL.createObjectURL(foto)}
                      alt={`Nova foto ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      onClick={() => removeFoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {(existingImages.length + fotos.length) < (isVip ? 5 : 1) && (
                  <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary">
                    <div className="text-center">
                      <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Adicionar Foto</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
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