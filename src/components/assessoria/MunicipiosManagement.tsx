'use client';

import { ChevronRight, Search, MapPin } from "lucide-react";
import AddMunicipioForm from "./AddMunicipioForm";
import { useState } from "react";

interface Municipio {
  id: string;
  nome: string;
}

interface MunicipiosManagementProps {
  municipios: Municipio[];
}

export default function MunicipiosManagement({ municipios }: MunicipiosManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMunicipios = municipios.filter(mun => 
    mun.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full space-y-10 animate-fadeIn pb-16">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-12 bg-accent rounded-full shadow-[0_0_20px_rgba(227,6,19,0.2)]"></div>
            <p className="vibe-stat-label mt-0! uppercase tracking-[0.4em]">Gestão Territorial</p>
          </div>
          <h1 className="text-5xl font-display text-text tracking-tight leading-none">
            Municípios <span className="text-accent italic">Estratégicos</span>
          </h1>
          <p className="text-xl text-muted/60 max-w-3xl font-medium">Controle e acompanhamento individualizado de cada base eleitoral e administrativa.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Adicionar Novo */}
        <div className="xl:col-span-1">
          <div className="vibe-card p-10! border-black/5 h-full bg-black/2">
            <h2 className="text-2xl font-display text-accent mb-8 italic">Novo Território</h2>
            <AddMunicipioForm />
          </div>
        </div>

        {/* Lista e Busca */}
        <div className="xl:col-span-2 space-y-6">
          <div className="vibe-card p-0! overflow-hidden border-black/5 flex flex-col h-full min-h-[600px]">
            <div className="p-8 border-b border-black/5 bg-black/2 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <h2 className="text-2xl font-display text-text uppercase tracking-tight">Base Instalada</h2>
              
              <div className="relative w-full md:w-[300px] group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-accent transition-colors" />
                <input 
                  type="text" 
                  placeholder="Buscar município..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 glass-input rounded-2xl text-sm focus:ring-2 focus:ring-accent/40 placeholder:text-muted/40 transition-all outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {filteredMunicipios.length === 0 ? (
                <div className="p-20 text-center">
                  <MapPin className="w-16 h-16 text-muted/20 mx-auto mb-4" />
                  <p className="text-lg text-muted font-bold">Nenhum município encontrado</p>
                  <p className="text-sm text-muted/40">Tente um termo diferente ou adicione um novo.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-y divide-black/5 border-b border-black/5">
                  {filteredMunicipios.map((mun) => (
                    <a 
                      key={mun.id}
                      href={`/assessoria/municipio/${mun.id}`} 
                      className="flex items-center justify-between p-8 hover:bg-black/5 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-accent/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all shadow-inner">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-black text-muted group-hover:text-text transition-colors">{mun.nome}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
