import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GoogleMapsMiniMap from "@/components/ui/google-maps-mini-map";
import { Camera, Facebook, Instagram, Globe, MapPin, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Anunciar = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isVip, setIsVip] = useState(false);
  const [formData, setFormData] = useState({
    nomeNegocio: "",
    tipoAnuncio: "",
    categoria: "",
    descricao: "",
    telefone: "",
    email: "",
    valor: "",
    numero: "",
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

  // Brazilian states and their cities
  const estados = [
    { uf: "AC", nome: "Acre" },
    { uf: "AL", nome: "Alagoas" },
    { uf: "AP", nome: "Amapá" },
    { uf: "AM", nome: "Amazonas" },
    { uf: "BA", nome: "Bahia" },
    { uf: "CE", nome: "Ceará" },
    { uf: "DF", nome: "Distrito Federal" },
    { uf: "ES", nome: "Espírito Santo" },
    { uf: "GO", nome: "Goiás" },
    { uf: "MA", nome: "Maranhão" },
    { uf: "MT", nome: "Mato Grosso" },
    { uf: "MS", nome: "Mato Grosso do Sul" },
    { uf: "MG", nome: "Minas Gerais" },
    { uf: "PA", nome: "Pará" },
    { uf: "PB", nome: "Paraíba" },
    { uf: "PR", nome: "Paraná" },
    { uf: "PE", nome: "Pernambuco" },
    { uf: "PI", nome: "Piauí" },
    { uf: "RJ", nome: "Rio de Janeiro" },
    { uf: "RN", nome: "Rio Grande do Norte" },
    { uf: "RS", nome: "Rio Grande do Sul" },
    { uf: "RO", nome: "Rondônia" },
    { uf: "RR", nome: "Roraima" },
    { uf: "SC", nome: "Santa Catarina" },
    { uf: "SP", nome: "São Paulo" },
    { uf: "SE", nome: "Sergipe" },
    { uf: "TO", nome: "Tocantins" }
  ];

  useEffect(() => {
    checkVipStatus();
  }, []);

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

  const estabelecimentos = [
    "Academia", "Açaiteria", "Açougue", "Acessórios", "Auto Center", "Auto Peças", 
    "Banco", "Bar", "Barbearia", "Borracharia", "Boutique", "Buffet",
    "Cafeteria", "Calçados", "Capela", "Casa de Carnes", "Casa de Câmbio", "Casa de Oração", 
    "Casa de Presentes", "Centro de Culto", "Centro de Impressão", "Churrascaria", 
    "Clínica", "Comunidade", "Confeitaria", "Consultório", "Contabilidade", 
    "Copiadora", "Corretora", "Creche", "Crossfit", "Curso de Idiomas", 
    "Curso Técnico", "Depilação", "Editora", "Escola", "Estética", 
    "Faculdade", "Farmácia", "Financeira", "Fisioterapia", "Funilaria",
    "Gráfica", "Hamburgueria", "Hortifruti", "Hospital", "Hostel", "Hotel", 
    "Hotel para Pets", "Igreja", "Imobiliária", "Joalheria", "Laboratório", 
    "Lanchonete", "Lava Jato", "Lavagem de Carros", "Livraria", "Loja", 
    "Loja de Conveniência", "Loja de Roupas", "Loja Virtual", "Lotérica", 
    "Manicure", "Massoterapia", "Mercado", "Ministério", "Oficina", 
    "Oficina Mecânica", "Ótica", "Padaria", "Papelaria", "Pastelaria", 
    "Perfumaria", "Pet Shop", "Pilates", "Pizzaria", "Posto de Gasolina", 
    "Pousada", "Pub", "Reforço Escolar", "Relojoaria", "Resort", "Restaurante", 
    "Salão de Beleza", "Seguros", "Serigrafia", "Sorveteria", "Spa", 
    "Studio", "Studio de Dança", "Supermercado", "Templo", "Universidade", 
    "Veterinária", "Yoga"
  ].sort();

  const prestadorServicos = [
    "Adestrador", "Advogado", "Ar Condicionado", "Arquiteto", "Aulas Particulares", 
    "Babá", "Bartender", "Borracheiro", "Buffet", "Cabeleireiro", "Cantor", 
    "Carregador", "Chaveiro", "Coach", "Confeiteiro", "Construção", "Consultoria", 
    "Consultor", "Contador", "Costureira", "Cozinheiro", "Cuidador de Idosos", 
    "Cuidador de Pets", "Cursos", "Dentista", "Design Gráfico", "Designer", 
    "Desenvolvimento Web", "Diarista", "DJ", "Doceira", "Dog Walker", 
    "Educação", "Elétrica", "Eletricista", "Encanador", "Enfermeiro", 
    "Engenheiro", "Entregas", "Entregador", "Estética", "Esteticista", 
    "Eventos", "Faxineira", "Fisioterapia", "Fisioterapeuta", "Fotografia", 
    "Fotógrafo", "Frete", "Funileiro", "Garçom", "Hidráulica", "Instrutor", 
    "Intérprete", "Jardinagem", "Jardineiro", "Jornalista", "Limpeza", 
    "Manutenção", "Manicure", "Maquiador", "Marceneiro", "Marketing Digital", 
    "Massoterapeuta", "Mecânico", "Motoboy", "Motorista", "Mudanças", 
    "Música", "Músico", "Nutrição", "Nutricionista", "Organizador de Eventos", 
    "Palestrante", "Passadeira", "Pedreiro", "Personal Trainer", "Pintura", 
    "Pintor", "Programador", "Professor Particular", "Psicologia", "Psicólogo", 
    "Publicitário", "Redator", "Reformas", "Relojoeiro", "Revisor", 
    "Salgadeiro", "Sapateiro", "Saúde", "Segurança", "Serralheiro", 
    "Soldador", "Som e Iluminação", "Tecnologia", "Técnico em Eletrônicos", 
    "Técnico em Informática", "Tosador", "Tradutor", "Transporte", "Turismo", 
    "Tutor", "Veterinário", "Vídeo", "Videomaker", "Vidraceiro", "Web Designer"
  ].sort();

  const buscarCep = async (cepValue: string) => {
    if (cepValue.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
        const data = await response.json();
        if (!data.erro) {
          // Buscar coordenadas via Nominatim (OpenStreetMap)
          // Construir endereço mais completo e preciso
          const addressParts: string[] = [];
          if (data.logradouro) addressParts.push(data.logradouro);
          if (data.bairro) addressParts.push(data.bairro);
          if (data.localidade) addressParts.push(data.localidade);
          if (data.uf) addressParts.push(data.uf);
          addressParts.push('Brasil');
          
          const fullAddress = addressParts.join(', ');
          const coords = await buscarCoordenadas(fullAddress);
          
          setEndereco({
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            uf: data.uf,
            latitude: coords.lat,
            longitude: coords.lon
          });
          
          toast.success(`Endereço encontrado: ${data.localidade}, ${data.uf}`);
        } else {
          toast.error("CEP não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        toast.error("Erro ao buscar CEP");
      }
    }
  };

  const buscarCoordenadas = async (address: string) => {
    try {
      // Melhorar o formato do endereço para geocodificação mais precisa
      const formattedAddress = address
        .replace(/\s+/g, ' ') // Remove espaços extras
        .replace(/, Rondônia,/, ',') // Remove "Rondônia" se estiver incorretamente no endereço
        .replace(/, Mato Grosso,/, ',') // Remove "Mato Grosso" se estiver incorretamente no endereço
        .replace(/, Amazonas,/, ',') // Remove outros estados incorretos
        .trim();
      
      console.log('Buscando coordenadas para:', formattedAddress);
      
      // Tentar diferentes formatos de endereço para melhor precisão
      const searchQueries = [
        formattedAddress,
        `${formattedAddress}, Brasil`,
        formattedAddress.replace(', Brasil', ''), // Remover Brasil se já estiver
        // Adicionar formato específico para cidades do RS
        formattedAddress.includes('RS') ? formattedAddress.replace(', RS', ', Rio Grande do Sul, Brasil') : null,
        formattedAddress.includes('Rio Grande do Sul') ? formattedAddress : null,
        // Formato específico para Novo Hamburgo
        formattedAddress.includes('Novo Hamburgo') ? formattedAddress.replace(/.*Novo Hamburgo.*/, 'Novo Hamburgo, Rio Grande do Sul, Brasil') : null,
        // Formato simplificado para Novo Hamburgo
        formattedAddress.includes('Novo Hamburgo') ? 'Novo Hamburgo, RS, Brasil' : null
      ].filter(Boolean);
      
      for (const query of searchQueries) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query || '')}&limit=1&countrycodes=br&addressdetails=1&email=contato@anunciai.com.br&accept-language=pt-BR`
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
    
    // Coordenadas padrão (São Paulo) se não encontrar
    return { lat: -23.5505, lon: -46.6333 };
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
      const maxFotos = isVip ? 5 : 1;
      const remainingSlots = maxFotos - fotos.length;
      const newFotos = Array.from(e.target.files).slice(0, remainingSlots);
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

      // Verificar se usuário é VIP
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_vip')
        .eq('id', user.id)
        .single();

      const userIsVip = profile?.is_vip || false;

      // Se não for VIP, verificar limite de anúncios
      if (!userIsVip) {
        const { data: existingServices, error: countError } = await supabase
          .from('services')
          .select('id')
          .eq('user_id', user.id);

        if (countError) {
          console.error('Erro ao verificar anúncios existentes:', countError);
          toast.error('Erro ao verificar limite de anúncios');
          return;
        }

        if (existingServices && existingServices.length >= 1) {
          toast.error('Usuários gratuitos podem ter apenas 1 anúncio. Torne-se VIP para criar anúncios ilimitados!');
          return;
        }
      }

      // Upload das fotos se houver
      const imageUrls: string[] = [];
      if (fotos.length > 0) {
        for (const foto of fotos) {
          const fileExt = foto.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;

          const { error: uploadError, data } = await supabase.storage
            .from('services')
            .upload(filePath, foto);

          if (uploadError) {
            console.error('Erro ao fazer upload da foto:', uploadError);
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from('services')
              .getPublicUrl(filePath);
            imageUrls.push(publicUrl);
          }
        }
      }

      // Inserir o anúncio
      const { error } = await supabase
        .from('services')
        .insert({
          title: formData.nomeNegocio,
          type: formData.tipoAnuncio,
          category: formData.categoria,
          description: formData.descricao,
          address: `${endereco.logradouro}${formData.numero ? ', ' + formData.numero : ''}, ${endereco.bairro}`,
          number: formData.numero || null,
          neighborhood: endereco.bairro,
          city: endereco.cidade,
          uf: endereco.uf,
          cep: cep,
          latitude: endereco.latitude,
          longitude: endereco.longitude,
          phone: formData.telefone,
          email: formData.email || null,
          whatsapp: formData.telefone,
          facebook: formData.facebook || null,
          instagram: formData.instagram || null,
          website: formData.website || null,
          logo_url: imageUrls.length > 0 ? imageUrls[0] : null,
          images: imageUrls,
          user_id: user.id,
          status: 'active',
          valor: formData.valor || null
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
        message: (error as any)?.message,
        code: (error as any)?.code,
        details: (error as any)?.details,
        hint: (error as any)?.hint
      });
      toast.error(`Erro ao cadastrar anúncio: ${(error as any)?.message || 'Tente novamente.'}`);
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
                    value="empreendimento"
                    checked={formData.tipoAnuncio === "empreendimento"}
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
                  aria-label="Selecione uma categoria"
                >
                  <option value="">Selecione uma categoria</option>
                  {(formData.tipoAnuncio === "empreendimento" ? estabelecimentos : prestadorServicos).map((item) => (
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
                   <label className="block text-sm font-medium mb-2">Número</label>
                   <Input 
                     type="text" 
                     value={formData.numero}
                     onChange={(e) => handleInputChange("numero", e.target.value)}
                     placeholder="123"
                   />
                 </div>
                 <div className="md:col-span-2">
                   <label className="block text-sm font-medium mb-2">Endereço Completo (para localização precisa)</label>
                   <Input 
                     type="text" 
                     value={`${endereco.logradouro}${formData.numero ? ', ' + formData.numero : ''}${endereco.bairro ? ', ' + endereco.bairro : ''}, ${endereco.cidade}, ${endereco.uf}`}
                     readOnly
                     className="bg-black text-white border-gray-600"
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
                       const fullAddress = `${endereco.logradouro}${formData.numero ? ', ' + formData.numero : ''}${endereco.bairro ? ', ' + endereco.bairro : ''}, ${endereco.cidade}, ${endereco.uf}, Brasil`;
                       const coords = await buscarCoordenadas(fullAddress);
                       setEndereco(prev => ({
                         ...prev,
                         latitude: coords.lat,
                         longitude: coords.lon
                       }));
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
                     value={endereco.bairro}
                     onChange={(e) => setEndereco(prev => ({...prev, bairro: e.target.value}))}
                     placeholder="Bairro"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium mb-2">Estado <span className="text-red-500">*</span></label>
                   <Select value={endereco.uf} onValueChange={(value) => setEndereco(prev => ({...prev, uf: value}))}>
                     <SelectTrigger>
                       <SelectValue placeholder="Selecione o estado" />
                     </SelectTrigger>
                     <SelectContent>
                       {estados.map((estado) => (
                         <SelectItem key={estado.uf} value={estado.uf}>
                           {estado.nome} ({estado.uf})
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium mb-2">Cidade <span className="text-red-500">*</span></label>
                   <Input 
                     type="text" 
                     value={endereco.cidade}
                     onChange={(e) => setEndereco(prev => ({...prev, cidade: e.target.value}))}
                     placeholder="Digite o nome da cidade"
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
                <GoogleMapsMiniMap 
                  latitude={endereco.latitude}
                  longitude={endereco.longitude}
                  title={endereco.logradouro}
                  address={`${endereco.bairro}, ${endereco.cidade} - ${endereco.uf}`}
                  height="300px"
                  mapType={google.maps.MapTypeId.ROADMAP}
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
                Fotos do Serviço/Estabelecimento 
                <span className="text-muted-foreground">
                  (Opcional - até {isVip ? 5 : 1} {isVip ? 'fotos' : 'foto'})
                </span>
                {isVip && <Crown className="inline ml-1 h-4 w-4 text-primary" />}
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                Adicione fotos que mostrem seu trabalho, estabelecimento ou serviços. Imagens atraem mais clientes!
                {!isVip && (
                  <span className="block text-primary mt-1">
                    💎 Upgrade para Destaque e adicione até 5 fotos!
                  </span>
                )}
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
                {fotos.length < (isVip ? 5 : 1) && (
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
      <Footer />
    </div>
  );
};

export default Anunciar;
