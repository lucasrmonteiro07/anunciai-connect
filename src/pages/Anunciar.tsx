import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/header";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MiniMap from "@/components/ui/mini-map";
import { Camera, Facebook, Instagram, Globe, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Anunciar = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nomeNegocio: "",
    tipoAnuncio: "",
    categoria: "",
    descricao: "",
    telefone: "",
    email: "",
    valor: "",
    facebook: "",
    instagram: "",
    website: ""
  });
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState({
    logradouro: "",
    bairro: "",
    cidade: "",
    uf: "",
    latitude: -23.5505,
    longitude: -46.6333
  });
  const [fotos, setFotos] = useState<File[]>([]);

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

  const buscarCep = async (cepValue: string) => {
    if (cepValue.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setEndereco({
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            uf: data.uf,
            latitude: -23.5505, // Coordenadas padrão, idealmente buscar via geocoding
            longitude: -46.6333
          });
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCep(value);
    if (value.length === 8) {
      buscarCep(value);
    }
  };

  const handleFotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFotos = Array.from(e.target.files).slice(0, 3 - fotos.length);
      setFotos(prev => [...prev, ...newFotos]);
    }
  };

  const removeFoto = (index: number) => {
    setFotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Validação dos campos obrigatórios
    if (!formData.nomeNegocio.trim()) {
      toast.error("Nome do negócio é obrigatório");
      return;
    }
    if (!formData.tipoAnuncio) {
      toast.error("Tipo de anúncio é obrigatório");
      return;
    }
    if (!formData.categoria) {
      toast.error("Categoria é obrigatória");
      return;
    }
    if (!formData.descricao.trim()) {
      toast.error("Descrição é obrigatória");
      return;
    }
    if (!endereco.cidade || !endereco.uf) {
      toast.error("Endereço completo é obrigatório");
      return;
    }
    if (!formData.telefone.trim()) {
      toast.error("Telefone/WhatsApp é obrigatório");
      return;
    }

    setLoading(true);

    try {
      // Verificar se o usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Você precisa estar logado para cadastrar um anúncio");
        navigate('/login');
        return;
      }

      // Inserir o anúncio
      const { error } = await supabase
        .from('services')
        .insert({
          title: formData.nomeNegocio,
          type: formData.tipoAnuncio,
          category: formData.categoria,
          description: formData.descricao,
          address: `${endereco.logradouro}, ${endereco.bairro}`,
          city: endereco.cidade,
          uf: endereco.uf,
          latitude: endereco.latitude,
          longitude: endereco.longitude,
          phone: formData.telefone,
          email: formData.email || null,
          whatsapp: formData.telefone,
          facebook: formData.facebook || null,
          instagram: formData.instagram || null,
          website: formData.website || null,
          user_id: user.id,
          status: 'active'
        });

      if (error) throw error;

      toast.success("Anúncio cadastrado com sucesso!");
      
      // Redirecionar para a página inicial
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (error) {
      console.error('Erro ao cadastrar anúncio:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint
      });
      toast.error(`Erro ao cadastrar anúncio: ${error?.message || 'Tente novamente.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Anunciar - Anunciai"
        description="Cadastre seu anúncio e alcance a comunidade cristã."
        canonical="https://anunciai.app.br/anunciar"
      />
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">Anunciar</h1>
        <div className="bg-card rounded-lg p-8 border shadow-sm max-w-4xl">
          <h2 className="text-xl font-semibold mb-4">Cadastre seu Anúncio</h2>
          <p className="text-muted-foreground mb-6">
            Preencha as informações abaixo para cadastrar seu prestador de serviço ou empreendimento na plataforma cristã Anunciai.
          </p>
          
          <div className="space-y-6">
            {/* Nome do Negócio ou Estabelecimento */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Nome do Negócio ou Estabelecimento <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                Informe o nome do seu negócio, estabelecimento ou como você quer ser conhecido.
              </p>
              <Input 
                type="text" 
                value={formData.nomeNegocio}
                onChange={(e) => handleInputChange("nomeNegocio", e.target.value)}
                placeholder="Digite o nome do seu negócio ou estabelecimento"
                required
              />
            </div>

            {/* Tipo de Anúncio */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Tipo de Anúncio <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                Escolha se você tem um estabelecimento físico ou oferece serviços.
              </p>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="tipo" 
                    value="estabelecimento"
                    checked={formData.tipoAnuncio === "estabelecimento"}
                    onChange={(e) => handleInputChange("tipoAnuncio", e.target.value)}
                    className="mr-2"
                    required
                  />
                  Estabelecimento
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="tipo" 
                    value="prestador"
                    checked={formData.tipoAnuncio === "prestador"}
                    onChange={(e) => handleInputChange("tipoAnuncio", e.target.value)}
                    className="mr-2"
                    required
                  />
                  Prestador de Serviço
                </label>
              </div>
            </div>

            {/* Categoria Dinâmica */}
            {formData.tipoAnuncio && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Categoria <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  Selecione a categoria que melhor define seu negócio ou serviço.
                </p>
                <select 
                  value={formData.categoria}
                  onChange={(e) => handleInputChange("categoria", e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-black text-white"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {(formData.tipoAnuncio === "estabelecimento" ? estabelecimentos : prestadorServicos).map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Descrição <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                Descreva detalhadamente seus serviços, produtos ou o que oferece. Esta informação ajuda os clientes a entender seu negócio.
              </p>
              <Textarea 
                value={formData.descricao}
                onChange={(e) => handleInputChange("descricao", e.target.value)}
                placeholder="Descreva seu negócio e serviços oferecidos"
                className="h-24"
                required
              />
            </div>

            {/* Endereço Completo */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Endereço <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                Informe o endereço onde os clientes podem encontrar você. Comece pelo CEP para preenchimento automático.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">CEP</label>
                  <Input 
                    type="text" 
                    value={cep}
                    onChange={handleCepChange}
                    placeholder="00000-000"
                    maxLength={8}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Logradouro</label>
                  <Input 
                    type="text" 
                    value={endereco.logradouro}
                    onChange={(e) => setEndereco(prev => ({...prev, logradouro: e.target.value}))}
                    placeholder="Rua, Avenida, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bairro</label>
                  <Input 
                    type="text" 
                    value={endereco.bairro}
                    onChange={(e) => setEndereco(prev => ({...prev, bairro: e.target.value}))}
                    placeholder="Bairro"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cidade <span className="text-red-500">*</span></label>
                  <Input 
                    type="text" 
                    value={endereco.cidade}
                    onChange={(e) => setEndereco(prev => ({...prev, cidade: e.target.value}))}
                    placeholder="Cidade"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">UF <span className="text-red-500">*</span></label>
                  <Input 
                    type="text" 
                    value={endereco.uf}
                    onChange={(e) => setEndereco(prev => ({...prev, uf: e.target.value}))}
                    placeholder="UF"
                    maxLength={2}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Mapa */}
            {endereco.cidade && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  <MapPin className="inline mr-1 h-4 w-4" />
                  Localização
                </label>
                <MiniMap 
                  latitude={endereco.latitude}
                  longitude={endereco.longitude}
                  title={endereco.logradouro}
                  address={`${endereco.bairro}, ${endereco.cidade} - ${endereco.uf}`}
                />
              </div>
            )}

            {/* Contato */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Informações de Contato
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                Forneça pelo menos uma forma de contato para que os clientes possam entrar em contato com você.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Telefone/WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    type="tel" 
                    value={formData.telefone}
                    onChange={(e) => handleInputChange("telefone", e.target.value)}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email <span className="text-muted-foreground">(Opcional)</span>
                  </label>
                  <Input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Valor do Serviço */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Valor do Serviço <span className="text-muted-foreground">(Opcional)</span>
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                Informe o valor do seu serviço se desejar. Você pode colocar "A combinar" ou deixar em branco.
              </p>
              <Input 
                type="text" 
                value={formData.valor}
                onChange={(e) => handleInputChange("valor", e.target.value)}
                placeholder="R$ 100,00 ou A combinar"
              />
            </div>

            {/* Fotos */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Camera className="inline mr-1 h-4 w-4" />
                Fotos do Serviço/Estabelecimento <span className="text-muted-foreground">(Opcional - até 3)</span>
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                Adicione fotos que mostrem seu trabalho, estabelecimento ou serviços. Imagens atraem mais clientes!
              </p>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {fotos.map((foto, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={URL.createObjectURL(foto)} 
                      alt={`Foto ${index + 1}`}
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
                {fotos.length < 3 && (
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

            {/* Redes Sociais */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Redes Sociais <span className="text-muted-foreground">(Opcional)</span>
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                Adicione suas redes sociais para que os clientes possam conhecer melhor seu trabalho.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Facebook className="h-5 w-5 text-blue-600" />
                  <Input 
                    type="url" 
                    value={formData.facebook}
                    onChange={(e) => handleInputChange("facebook", e.target.value)}
                    placeholder="https://facebook.com/seuPerfil"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Instagram className="h-5 w-5 text-pink-600" />
                  <Input 
                    type="url" 
                    value={formData.instagram}
                    onChange={(e) => handleInputChange("instagram", e.target.value)}
                    placeholder="https://instagram.com/seuPerfil"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-600" />
                  <Input 
                    type="url" 
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="https://seusite.com.br"
                  />
                </div>
              </div>
            </div>

            {/* Destaque para Membro CRIE (baseado no perfil do usuário) */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                💡 <strong>Dica:</strong> Se você é membro CRIE, configure o desconto no seu perfil. 
                Seus anúncios aparecerão automaticamente com a tarja de desconto CRIE.
              </p>
            </div>

            <Button 
              className="w-full" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar Anúncio"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Anunciar;
