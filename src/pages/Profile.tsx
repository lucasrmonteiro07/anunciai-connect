import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/header";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MiniMap from "@/components/ui/mini-map";
import { Camera, Facebook, Instagram, Globe, MapPin, User, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [nomeNegocio, setNomeNegocio] = useState("");
  const [tipoAnuncio, setTipoAnuncio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [cpf, setCpf] = useState("");
  const [denominacao, setDenominacao] = useState("");
  const [membroCrie, setMembroCrie] = useState(false);
  const [descontoCrie, setDescontoCrie] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState({
    logradouro: "",
    bairro: "",
    cidade: "",
    uf: "",
    latitude: -23.5505,
    longitude: -46.6333
  });
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");
  const [aceitoTermos, setAceitoTermos] = useState(false);
  const [aceitoConteudo, setAceitoConteudo] = useState(false);

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
        setEmail(session.user.email || "");
        loadProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        // Load existing profile data
        setNomeNegocio(data.first_name || "");
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    }
  };

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
            latitude: -23.5505,
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

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const formattedCpf = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    setCpf(formattedCpf);
  };

  const handleSave = async () => {
    if (!aceitoTermos) {
      toast.error("Você deve aceitar os termos de uso");
      return;
    }

    try {
      // Save profile data
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          first_name: nomeNegocio,
          email: email
        });

      if (error) throw error;

      toast.success("Perfil salvo com sucesso!");
      navigate('/');
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      toast.error("Erro ao salvar perfil");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Perfil - Anunciai"
        description="Complete seu perfil na plataforma cristã Anunciai."
        canonical="https://anunciai.app.br/perfil"
      />
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <User className="h-8 w-8" />
          Meu Perfil
        </h1>
        <div className="bg-card rounded-lg p-8 border shadow-sm max-w-4xl">
          <h2 className="text-xl font-semibold mb-4">Complete suas Informações</h2>
          <p className="text-muted-foreground mb-6">
            Preencha suas informações para completar seu perfil na plataforma cristã Anunciai.
          </p>
          
          {/* Email confirmation banner */}
          {user && !user.email_confirmed_at && (
            <Alert className="mb-6 border-yellow-500 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Confirme seu email:</strong> Verifique sua caixa de entrada e clique no link de confirmação para ativar completamente sua conta.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-6">
            {/* Nome do Negócio ou Estabelecimento */}
            <div>
              <label className="block text-sm font-medium mb-2">Nome do Negócio ou Estabelecimento</label>
              <Input 
                type="text" 
                value={nomeNegocio}
                onChange={(e) => setNomeNegocio(e.target.value)}
                placeholder="Digite o nome do seu negócio ou estabelecimento"
              />
            </div>

            {/* CPF */}
            <div>
              <label className="block text-sm font-medium mb-2">CPF</label>
              <Input 
                type="text" 
                value={cpf}
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>

            {/* Tipo de Anúncio */}
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Anúncio</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="tipo" 
                    value="estabelecimento"
                    checked={tipoAnuncio === "estabelecimento"}
                    onChange={(e) => setTipoAnuncio(e.target.value)}
                    className="mr-2"
                  />
                  Estabelecimento
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="tipo" 
                    value="prestador"
                    checked={tipoAnuncio === "prestador"}
                    onChange={(e) => setTipoAnuncio(e.target.value)}
                    className="mr-2"
                  />
                  Prestador de Serviço
                </label>
              </div>
            </div>

            {/* Categoria Dinâmica */}
            {tipoAnuncio && (
              <div>
                <label className="block text-sm font-medium mb-2">Categoria</label>
                <select 
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-black text-white"
                >
                  <option value="">Selecione uma categoria</option>
                  {(tipoAnuncio === "estabelecimento" ? estabelecimentos : prestadorServicos).map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Denominação */}
            <div>
              <label className="block text-sm font-medium mb-2">Denominação (Opcional)</label>
              <select 
                value={denominacao}
                onChange={(e) => setDenominacao(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-black text-white"
              >
                <option value="">Selecione sua denominação</option>
                {denominacoes.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            {/* Endereço Completo */}
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
                <label className="block text-sm font-medium mb-2">Cidade</label>
                <Input 
                  type="text" 
                  value={endereco.cidade}
                  onChange={(e) => setEndereco(prev => ({...prev, cidade: e.target.value}))}
                  placeholder="Cidade"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">UF</label>
                <Input 
                  type="text" 
                  value={endereco.uf}
                  onChange={(e) => setEndereco(prev => ({...prev, uf: e.target.value}))}
                  placeholder="UF"
                  maxLength={2}
                />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Telefone/WhatsApp</label>
                <Input 
                  type="tel" 
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
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
            <div>
              <label className="block text-sm font-medium mb-2">Redes Sociais</label>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Facebook className="h-5 w-5 text-blue-600" />
                  <Input 
                    type="url" 
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="https://facebook.com/seuPerfil"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Instagram className="h-5 w-5 text-pink-600" />
                  <Input 
                    type="url" 
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="https://instagram.com/seuPerfil"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-600" />
                  <Input 
                    type="url" 
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://seusite.com.br"
                  />
                </div>
              </div>
            </div>

            {/* Checkbox CRIE */}
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="membroCrie"
                checked={membroCrie}
                onChange={(e) => setMembroCrie(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="membroCrie" className="text-sm font-medium">
                Membro CRIE - Ao marcar você condiciona seus anúncios às políticas de desconto do Ministério CRIE
              </label>
            </div>

            {membroCrie && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <label className="block text-sm font-medium mb-2">Selecione o desconto para seus anúncios:</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="desconto" 
                      value="7%"
                      checked={descontoCrie === "7%"}
                      onChange={(e) => setDescontoCrie(e.target.value)}
                      className="mr-2"
                    />
                    7%
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="desconto" 
                      value="10%"
                      checked={descontoCrie === "10%"}
                      onChange={(e) => setDescontoCrie(e.target.value)}
                      className="mr-2"
                    />
                    10%
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="desconto" 
                      value="20%"
                      checked={descontoCrie === "20%"}
                      onChange={(e) => setDescontoCrie(e.target.value)}
                      className="mr-2"
                    />
                    20%
                  </label>
                </div>
              </div>
            )}

            {/* Checkboxes finais */}
            <div className="space-y-3 border-t pt-6">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="aceitoTermos"
                  checked={aceitoTermos}
                  onChange={(e) => setAceitoTermos(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="aceitoTermos" className="text-sm font-medium">
                  Aceito os termos de uso do site
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="aceitoConteudo"
                  checked={aceitoConteudo}
                  onChange={(e) => setAceitoConteudo(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="aceitoConteudo" className="text-sm font-medium">
                  Aceito receber conteúdo direcionado ao empreendedor Cristão
                </label>
              </div>
            </div>

            <Button className="w-full" onClick={handleSave}>
              Salvar Perfil
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;