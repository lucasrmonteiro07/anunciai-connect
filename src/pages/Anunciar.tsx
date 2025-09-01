import React, { useState } from "react";
import Header from "@/components/ui/header";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MiniMap from "@/components/ui/mini-map";
import { Camera, Facebook, Instagram, Globe, MapPin } from "lucide-react";

const Anunciar = () => {
  const [tipoAnuncio, setTipoAnuncio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState({
    logradouro: "",
    bairro: "",
    cidade: "",
    uf: "",
    latitude: -23.5505,
    longitude: -46.6333
  });
  const [membroCrie, setMembroCrie] = useState(false);
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
              <label className="block text-sm font-medium mb-2">Nome do Negócio ou Estabelecimento</label>
              <Input 
                type="text" 
                placeholder="Digite o nome do seu negócio ou estabelecimento"
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

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <Textarea 
                placeholder="Descreva seu negócio e serviços oferecidos"
                className="h-24"
              />
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
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input 
                  type="email" 
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Valor do Serviço */}
            <div>
              <label className="block text-sm font-medium mb-2">Valor do Serviço (Opcional)</label>
              <Input 
                type="text" 
                placeholder="R$ 100,00"
              />
            </div>

            {/* Fotos */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Camera className="inline mr-1 h-4 w-4" />
                Fotos do Serviço/Estabelecimento (até 3)
              </label>
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
              <label className="block text-sm font-medium mb-2">Redes Sociais</label>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Facebook className="h-5 w-5 text-blue-600" />
                  <Input 
                    type="url" 
                    placeholder="https://facebook.com/seuPerfil"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Instagram className="h-5 w-5 text-pink-600" />
                  <Input 
                    type="url" 
                    placeholder="https://instagram.com/seuPerfil"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-600" />
                  <Input 
                    type="url" 
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
                Sou membro CRIE - Quero oferecer desconto especial para cristãos
              </label>
            </div>

            {membroCrie && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  🏷️ Seu anúncio aparecerá com uma tarja especial indicando "DESCONTO CRIE". 
                  Os interessados poderão consultar diretamente com você sobre a promoção oferecida.
                </p>
              </div>
            )}

            <Button className="w-full">
              Cadastrar Anúncio
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Anunciar;
