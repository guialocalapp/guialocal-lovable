import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Map, List } from 'lucide-react';

const ListingsHeader = ({ pageTitle, pageDescription, searchByMap, displayedAds, toggleSearchMode, viewMode, setViewMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row justify-between sm:items-center mb-4"
    >
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">{pageTitle}</h1>
        <p className="text-muted-foreground mb-4 sm:mb-0">
          {searchByMap && displayedAds ? `${displayedAds.length} anúncios encontrados no mapa` : pageDescription}
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={toggleSearchMode} className="bg-secondary hover:bg-accent">
          {searchByMap ? <List className="mr-2 h-4 w-4" /> : <Map className="mr-2 h-4 w-4" />}
          {searchByMap ? 'Limpar Busca no Mapa' : 'Buscar no Mapa'}
        </Button>
        <div className="md:hidden">
          <Button variant="outline" onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')} className="bg-secondary hover:bg-accent">
            {viewMode === 'list' ? <Map className="mr-2 h-4 w-4" /> : <List className="mr-2 h-4 w-4" />}
            {viewMode === 'list' ? 'Ver Mapa' : 'Ver Lista'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ListingsHeader;