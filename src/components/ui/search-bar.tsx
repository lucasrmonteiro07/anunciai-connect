import React from 'react';
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
  onSearch: () => void;
}

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  onSearch
}: SearchBarProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto bg-card rounded-xl p-6 shadow-lg border border-border">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="h-12 bg-input border-border">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Categorias</SelectItem>
            <SelectItem value="construcao">Construção</SelectItem>
            <SelectItem value="musica">Música</SelectItem>
            <SelectItem value="eventos">Eventos</SelectItem>
            <SelectItem value="alimentacao">Alimentação</SelectItem>
            <SelectItem value="moda">Moda</SelectItem>
            <SelectItem value="tecnologia">Tecnologia</SelectItem>
            <SelectItem value="saude">Saúde</SelectItem>
            <SelectItem value="educacao">Educação</SelectItem>
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