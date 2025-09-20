import React from 'react';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { X, ChevronDown } from 'lucide-react';

const CategoryOptions = ({ categories, level = 0 }) => {
  return categories.map(cat => (
    <React.Fragment key={cat.id}>
      <SelectItem value={cat.slug} style={{ paddingLeft: `${level * 1.5 + 1}rem` }}>
        {cat.name}
      </SelectItem>
      {cat.children && cat.children.length > 0 && (
        <CategoryOptions categories={cat.children} level={level + 1} />
      )}
    </React.Fragment>
  ));
};

const ListingsFilters = ({
  searchTerm,
  setSearchTerm,
  queryTerm,
  clearSearch,
  handleSearch,
  selectedCategorySlug,
  handleCategoryChange,
  structuredCategories,
  selectedCitySlug,
  handleCityChange,
  cities,
  selectedFacilities,
  handleFacilityChange,
  facilities,
  searchByMap
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card p-4 rounded-lg mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <form onSubmit={handleSearch} className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex-1">
            <Label htmlFor="search-input" className="text-sm font-medium text-muted-foreground mb-1 block">Busca</Label>
            <div className="relative">
              <Input
                id="search-input"
                placeholder="Busque por nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={searchByMap}
              />
              {queryTerm && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <div className="flex-1">
            <Label htmlFor="category-filter" className="text-sm font-medium text-muted-foreground mb-1 block">Categoria</Label>
            <Select value={selectedCategorySlug} onValueChange={handleCategoryChange} disabled={searchByMap || !!queryTerm}>
              <SelectTrigger id="category-filter">
                <SelectValue placeholder="Filtrar por categoria..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                <CategoryOptions categories={structuredCategories} />
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label htmlFor="city-filter" className="text-sm font-medium text-muted-foreground mb-1 block">Cidade</Label>
            <Select value={selectedCitySlug} onValueChange={handleCityChange} disabled={searchByMap}>
              <SelectTrigger id="city-filter">
                <SelectValue placeholder="Filtrar por cidade..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as Cidades</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city.slug} value={city.slug}>{city.name}/{city.state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>
        <div className="flex-1">
          <Label htmlFor="facility-filter" className="text-sm font-medium text-muted-foreground mb-1 block">Facilidades</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button id="facility-filter" variant="outline" className="w-full justify-start text-left font-normal" disabled={searchByMap}>
                <span className="truncate flex-1">
                  {selectedFacilities.length > 0
                    ? `${selectedFacilities.length} selecionada(s)`
                    : "Selecione facilidades..."
                  }
                </span>
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-4 grid gap-4 max-h-60 overflow-y-auto">
                {facilities.map(facility => (
                  <Label key={facility.id} className="flex items-center space-x-2 font-normal">
                    <Checkbox
                      checked={selectedFacilities.includes(facility.id)}
                      onCheckedChange={() => handleFacilityChange(facility.id)}
                    />
                    <span>{facility.name}</span>
                  </Label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </motion.div>
  );
};

export default ListingsFilters;