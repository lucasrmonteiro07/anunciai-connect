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
  onSearch: () => void;
  services?: Array<{ category: string; type: string }>;
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
  onSearch,
  services = []
}: SearchBarProps) => {
  // Categorias específicas por tipo
  const serviceCategories = [
    'Construção', 'Reformas', 'Pintura', 'Elétrica', 'Hidráulica', 'Ar Condicionado',
    'Música', 'DJ', 'Som e Iluminação', 'Eventos', 'Fotografia', 'Vídeo',
    'Tecnologia', 'Desenvolvimento Web', 'Design Gráfico', 'Marketing Digital',
    'Saúde', 'Fisioterapia', 'Psicologia', 'Nutrição', 'Estética',
    'Educação', 'Aulas Particulares', 'Cursos', 'Consultoria',
    'Transporte', 'Mudanças', 'Entregas', 'Turismo',
    'Limpeza', 'Manutenção', 'Segurança', 'Jardinagem'
  ];

  const establishmentCategories = [
    'Restaurante', 'Cafeteria', 'Açaiteria', 'Pastelaria', 'Padaria', 'Confeitaria',
    'Bar', 'Pub', 'Lanchonete', 'Pizzaria', 'Hamburgueria', 'Churrascaria',
    'Hotel', 'Pousada', 'Hostel', 'Resort',
    'Loja', 'Boutique', 'Farmácia', 'Supermercado', 'Mercado',
    'Academia', 'Studio', 'Spa', 'Salão de Beleza', 'Barbearia',
    'Escola', 'Creche', 'Universidade', 'Curso Técnico',
    'Clínica', 'Hospital', 'Laboratório', 'Consultório',
    'Oficina', 'Auto Peças', 'Posto de Gasolina', 'Lavagem de Carros',
    'Imobiliária', 'Corretora', 'Banco', 'Seguros'
  ];

  // Filtrar categorias baseado no tipo selecionado
  const getFilteredCategories = () => {
    if (selectedType === 'prestador') {
      return serviceCategories;
    } else if (selectedType === 'empreendimento') {
      return establishmentCategories;
    } else {
      // Se "Todos os Tipos", mostrar categorias dos serviços reais
      return Array.from(new Set(services.map(s => s.category).filter(Boolean)));
    }
  };

  const filteredCategories = getFilteredCategories();
  
  // Resetar categoria quando o tipo mudar
  useEffect(() => {
    setSelectedCategory('all');
  }, [selectedType, setSelectedCategory]);
  
  console.log('📋 Tipo selecionado:', selectedType);
  console.log('📋 Categorias filtradas:', filteredCategories);
  return (
    <div className="w-full max-w-6xl mx-auto bg-card rounded-xl p-6 shadow-lg border border-border">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

        {/* Type Filter */}
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="h-12 bg-input border-border">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="prestador">Serviços</SelectItem>
            <SelectItem value="empreendimento">Estabelecimentos</SelectItem>
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="h-12 bg-input border-border">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Categorias</SelectItem>
            {filteredCategories.map(category => (
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
              <SelectItem value="sp">São Paulo</SelectItem>
              <SelectItem value="rj">Rio de Janeiro</SelectItem>
              <SelectItem value="mg">Minas Gerais</SelectItem>
              <SelectItem value="pr">Paraná</SelectItem>
              <SelectItem value="rs">Rio Grande do Sul</SelectItem>
              <SelectItem value="ba">Bahia</SelectItem>
              <SelectItem value="go">Goiás</SelectItem>
              <SelectItem value="pe">Pernambuco</SelectItem>
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
          Buscar Serviços
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;