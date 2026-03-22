'use client';

import { useState } from 'react';
import { Municipio } from '@/lib/types';
import CityGrid from './CityGrid';
import { Search } from 'lucide-react';

interface CitySectionProps {
  initialMunicipios: Municipio[];
}

export default function CitySection({ initialMunicipios }: CitySectionProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMunicipios = initialMunicipios.filter(m => 
    m.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-10 bg-accent rounded-full shadow-[0_0_15px_rgba(227,6,19,0.2)]"></div>
            <p className="vibe-stat-label mt-0! uppercase tracking-[0.4em]">Estratégia Regional</p>
          </div>
          <h1 className="text-4xl font-display text-text tracking-tight leading-none">
            Bahia: <span className="text-accent italic">Seu Mandato</span>
          </h1>
          <p className="text-base text-muted/60 max-w-2xl font-medium">Acompanhe o impacto das suas ações em cada município. Gestão inteligente, focada no povo.</p>
        </div>
        
        <div className="relative w-full xl:w-[400px]">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted/40 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Localizar município..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full glass-input pl-14 pr-6 py-3 rounded-2xl text-base focus:ring-accent/30"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {filteredMunicipios.length > 0 ? (
          <CityGrid municipios={filteredMunicipios} />
        ) : (
          <div className="vibe-card text-center py-20 border-dashed border-black/10">
            <p className="text-xl text-muted font-black italic">Nenhum município corresponde à sua busca.</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 text-accent font-bold hover:underline"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
