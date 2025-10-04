import React, { useEffect } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedProductType: string;
  setSelectedProductType: (productType: string) => void;
  onSearch: () => void;
  services: Array<{ 
    category: string; 
    type: string; 
    product_type?: string;
    title: string;
    location?: {
      uf: string;
      city: string;
    };
  }>;
}

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  selectedType,
  setSelectedType,
  selectedProductType,
  setSelectedProductType,
  onSearch,
  services
}: SearchBarProps) => {
  // Categorias específicas por tipo - ordem alfabética
  const serviceCategories = [
    'Adestrador', 'Advogado', 'Ar Condicionado', 'Arquiteto', 'Aulas Particulares',
    'Babá', 'Bartender', 'Borracheiro', 'Buffet', 'Cabeleireiro', 'Cantor',
    'Carregador', 'Chaveiro', 'Coach', 'Confeiteiro', 'Construção', 'Consultoria',
    'Consultor', 'Contador', 'Costureira', 'Cozinheiro', 'Cuidador de Idosos',
    'Cuidador de Pets', 'Cursos', 'Dentista', 'Design Gráfico', 'Designer',
    'Desenvolvimento Web', 'Diarista', 'DJ', 'Doceira', 'Dog Walker',
    'Educação', 'Elétrica', 'Eletricista', 'Encanador', 'Enfermeiro',
    'Engenheiro', 'Entregas', 'Entregador', 'Estética', 'Esteticista',
    'Eventos', 'Faxineira', 'Fisioterapia', 'Fisioterapeuta', 'Fotografia',
    'Fotógrafo', 'Frete', 'Funileiro', 'Garçom', 'Hidráulica', 'Instrutor',
    'Intérprete', 'Jardinagem', 'Jardineiro', 'Jornalista', 'Limpeza',
    'Manutenção', 'Manicure', 'Maquiador', 'Marceneiro', 'Marketing Digital',
    'Massoterapeuta', 'Mecânico', 'Motoboy', 'Motorista', 'Mudanças',
    'Música', 'Músico', 'Nutrição', 'Nutricionista', 'Organizador de Eventos',
    'Palestrante', 'Passadeira', 'Pedreiro', 'Personal Trainer', 'Pintura',
    'Pintor', 'Programador', 'Professor Particular', 'Psicologia', 'Psicólogo',
    'Publicitário', 'Redator', 'Reformas', 'Relojoeiro', 'Revisor',
    'Salgadeiro', 'Sapateiro', 'Saúde', 'Segurança', 'Serralheiro',
    'Soldador', 'Som e Iluminação', 'Tecnologia', 'Técnico em Eletrônicos',
    'Técnico em Informática', 'Tosador', 'Tradutor', 'Transporte', 'Turismo',
    'Tutor', 'Veterinário', 'Vídeo', 'Videomaker', 'Vidraceiro', 'Web Designer'
  ].sort();

  const establishmentCategories = [
    'Academia', 'Açaiteria', 'Açougue', 'Acessórios', 'Auto Center', 'Auto Peças',
    'Banco', 'Bar', 'Barbearia', 'Borracharia', 'Boutique', 'Buffet',
    'Cafeteria', 'Calçados', 'Capela', 'Casa de Carnes', 'Casa de Câmbio', 'Casa de Oração',
    'Casa de Presentes', 'Centro de Culto', 'Centro de Impressão', 'Churrascaria',
    'Clínica', 'Comunidade', 'Confeitaria', 'Consultório', 'Contabilidade',
    'Copiadora', 'Corretora', 'Creche', 'Crossfit', 'Curso de Idiomas',
    'Curso Técnico', 'Depilação', 'Editora', 'Escola', 'Estética',
    'Faculdade', 'Farmácia', 'Financeira', 'Fisioterapia', 'Funilaria',
    'Gráfica', 'Hamburgueria', 'Hortifruti', 'Hospital', 'Hostel', 'Hotel',
    'Hotel para Pets', 'Igreja', 'Imobiliária', 'Joalheria', 'Laboratório',
    'Lanchonete', 'Lava Jato', 'Lavagem de Carros', 'Livraria', 'Loja',
    'Loja de Conveniência', 'Loja de Roupas', 'Loja Virtual', 'Lotérica',
    'Manicure', 'Massoterapia', 'Mercado', 'Ministério', 'Oficina',
    'Oficina Mecânica', 'Ótica', 'Padaria', 'Papelaria', 'Pastelaria',
    'Perfumaria', 'Pet Shop', 'Pilates', 'Pizzaria', 'Posto de Gasolina',
    'Pousada', 'Pub', 'Reforço Escolar', 'Relojoaria', 'Resort', 'Restaurante',
    'Salão de Beleza', 'Seguros', 'Serigrafia', 'Sorveteria', 'Spa',
    'Studio', 'Studio de Dança', 'Supermercado', 'Templo', 'Universidade',
    'Veterinária', 'Yoga'
  ].sort();

  const productCategories = [
    'Acessórios', 'Artigos Religiosos', 'Artigos para Casa', 'Artigos para Festa',
    'Artigos para Pets', 'Automotivo', 'Bíblias e Livros', 'Brinquedos',
    'Calçados', 'Casa e Decoração', 'Celulares e Tablets', 'Computadores',
    'Cosméticos', 'Eletrônicos', 'Eletrodomésticos', 'Esporte e Lazer',
    'Ferramentas', 'Flores e Plantas', 'Instrumentos Musicais', 'Jóias e Relógios',
    'Livros', 'Moda Feminina', 'Moda Infantil', 'Moda Masculina', 'Móveis',
    'Produtos de Limpeza', 'Produtos Naturais', 'Roupas', 'Saúde e Beleza',
    'Tecnologia', 'Utensílios Domésticos', 'Veículos'
  ].sort();

  // Filtrar categorias baseado no tipo selecionado
  const getFilteredCategories = () => {
    if (selectedProductType === 'product') {
      return productCategories;
    } else if (selectedType === 'prestador') {
      return serviceCategories;
    } else if (selectedType === 'empreendimento') {
      return establishmentCategories;
    } else {
      // Se "Todos os Tipos", mostrar categorias dos serviços reais
      return Array.from(new Set(services.map(s => s.category).filter(Boolean)));
    }
  };

  // Filtrar estados que têm anúncios
  const getAvailableStates = () => {
    const statesWithServices = Array.from(new Set(services.map(s => s.location?.uf).filter(Boolean)));
    
    const stateNames: { [key: string]: string } = {
      'sp': 'São Paulo',
      'rj': 'Rio de Janeiro', 
      'mg': 'Minas Gerais',
      'pr': 'Paraná',
      'rs': 'Rio Grande do Sul',
      'ba': 'Bahia',
      'go': 'Goiás',
      'pe': 'Pernambuco',
      'sc': 'Santa Catarina',
      'ce': 'Ceará',
      'pa': 'Pará',
      'ma': 'Maranhão',
      'to': 'Tocantins',
      'mt': 'Mato Grosso',
      'ms': 'Mato Grosso do Sul',
      'al': 'Alagoas',
      'se': 'Sergipe',
      'pb': 'Paraíba',
      'rn': 'Rio Grande do Norte',
      'pi': 'Piauí',
      'ac': 'Acre',
      'am': 'Amazonas',
      'ro': 'Rondônia',
      'rr': 'Roraima',
      'ap': 'Amapá',
      'df': 'Distrito Federal'
    };

    // Se não há estados com serviços, mostrar estados padrão
    if (statesWithServices.length === 0) {
      return [
        { value: 'sp', label: 'São Paulo' },
        { value: 'rj', label: 'Rio de Janeiro' },
        { value: 'mg', label: 'Minas Gerais' },
        { value: 'pr', label: 'Paraná' },
        { value: 'rs', label: 'Rio Grande do Sul' },
        { value: 'ba', label: 'Bahia' },
        { value: 'go', label: 'Goiás' },
        { value: 'pe', label: 'Pernambuco' }
      ];
    }

    return statesWithServices.map(uf => ({
      value: uf?.toLowerCase() || '',
      label: stateNames[uf?.toLowerCase() || ''] || uf?.toUpperCase() || ''
    }));
  };

  const filteredCategories = getFilteredCategories();
  const availableStates = getAvailableStates();
  
  // Resetar categoria quando o tipo mudar
  useEffect(() => {
    setSelectedCategory('all');
  }, [selectedType, selectedProductType, setSelectedCategory]);

  return (
    <div className="w-full max-w-6xl mx-auto bg-card rounded-xl p-6 shadow-lg border border-border">
      {/* Header com explicação */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold text-foreground mb-1">Encontre o que você precisa</h2>
        <p className="text-sm text-muted-foreground">
          Busque por <span className="font-medium text-primary">serviços profissionais</span>, 
          <span className="font-medium text-primary"> estabelecimentos</span> ou 
          <span className="font-medium text-primary"> produtos</span>
        </p>
      </div>

      <div className="space-y-4">
        {/* Primeira linha: Busca + Tipo Principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Digite o que você está procurando..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-input border-border focus:border-primary focus:ring-primary"
              onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            />
          </div>

          {/* Tipo Principal */}
          <Select value={selectedProductType} onValueChange={setSelectedProductType}>
            <SelectTrigger className="h-12 bg-input border-border">
              <SelectValue placeholder="O que você procura?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">🔍 Tudo</SelectItem>
              <SelectItem value="service">💼 Serviços</SelectItem>
              <SelectItem value="product">📦 Produtos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Segunda linha: Filtros específicos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Subtipo (apenas para serviços) */}
          {selectedProductType === 'service' && (
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="h-12 bg-input border-border">
                <SelectValue placeholder="Tipo de serviço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="prestador">👤 Profissional Autônomo</SelectItem>
                <SelectItem value="empreendimento">🏢 Estabelecimento</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Categoria específica */}
          {filteredCategories.length > 0 && (
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-12 bg-input border-border">
                <SelectValue placeholder={
                  selectedProductType === 'product' ? 'Categoria do produto' :
                  selectedProductType === 'service' ? 'Área de atuação' :
                  'Categoria'
                } />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {filteredCategories.sort().map(category => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Localização */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="h-12 bg-input border-border pl-10">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">🇧🇷 Todo o Brasil</SelectItem>
                {availableStates.map(state => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Button 
          onClick={onSearch}
          className="px-8 py-3 bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300"
        >
          <Search className="mr-2 h-4 w-4" />
          Buscar
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;