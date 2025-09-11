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
    console.log('🔍 Services para estados:', services.length);
    console.log('🔍 Services data:', services.map(s => ({ 
      title: s.title, 
      uf: s.location?.uf,
      location: s.location 
    })));
    
    const statesWithServices = Array.from(new Set(services.map(s => s.location?.uf).filter(Boolean)));
    console.log('🔍 Estados encontrados:', statesWithServices);
    
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
      console.log('⚠️ Nenhum estado encontrado, usando estados padrão');
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

    const result = statesWithServices.map(uf => ({
      value: uf?.toLowerCase() || '',
      label: stateNames[uf?.toLowerCase() || ''] || uf?.toUpperCase() || ''
    }));
    
    console.log('📍 Estados finais:', result);
    return result;
  };

  const filteredCategories = getFilteredCategories();
  const availableStates = getAvailableStates();
  
  // Resetar categoria quando o tipo mudar
  useEffect(() => {
    setSelectedCategory('all');
  }, [selectedType, selectedProductType, setSelectedCategory]);
  
  console.log('📋 Tipo selecionado:', selectedType);
  console.log('📋 Categorias filtradas:', filteredCategories);
  console.log('📍 Estados disponíveis:', availableStates);
  return (
    <div className="w-full max-w-6xl mx-auto bg-card rounded-xl p-6 shadow-lg border border-border">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Search Input */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por serviço ou empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 bg-input border-border focus:border-primary focus:ring-primary"
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          />
        </div>

        {/* Product Type Filter */}
        <Select value={selectedProductType} onValueChange={setSelectedProductType}>
          <SelectTrigger className="h-12 bg-input border-border">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="service">Serviços</SelectItem>
            <SelectItem value="product">Produtos</SelectItem>
          </SelectContent>
        </Select>

        {/* Type Filter (for services) */}
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="h-12 bg-input border-border">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="prestador">Prestadores</SelectItem>
            <SelectItem value="empreendimento">Estabelecimentos</SelectItem>
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="h-12 bg-input border-border">
            <SelectValue placeholder="Subcategoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {filteredCategories.sort().map(category => (
              <SelectItem key={category} value={category.toLowerCase()}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Location Filter */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="h-12 bg-input border-border pl-10">
              <SelectValue placeholder="Localização" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todo o Brasil</SelectItem>
              {availableStates.map(state => (
                <SelectItem key={state.value} value={state.value}>
                  {state.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-center mt-4">
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