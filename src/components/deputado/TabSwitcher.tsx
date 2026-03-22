'use client';

import { useState } from "react";
import ContatosTab from './tabs/ContatosTab';
import PoliticosTab from './tabs/PoliticosTab';
import EmendasTab from './tabs/EmendasTab';
import NotasTab from './tabs/NotasTab';
import PendenciasTab from "./tabs/PendenciasTab";
import ObrasTab from './tabs/ObrasTab';
import EventosTab from './tabs/EventosTab';
import { Contato, Emenda, Nota, Pendencia, Politico, Obra, Evento } from "@/lib/types";

// Placeholder para abas não implementadas
const PlaceholderTab = ({ title }: { title: string }) => (
  <div className="py-4"><p className="text-muted text-center">Conteúdo para a aba &quot;{title}&quot;</p></div>
);

interface TabSwitcherProps {
  data: {
    contatos: Contato[] | null;
    politicos: Politico[] | null;
    emendas: Emenda[] | null;
    obras: Obra[] | null;
    eventos: Evento[] | null;
    notas: Nota[] | null;
    pendencias: Pendencia[] | null;
  };
}

export default function TabSwitcher({ data }: TabSwitcherProps) {
  const [activeTab, setActiveTab] = useState('contatos');

  const tabs = [
    { id: 'contatos', label: 'Contatos', count: data.contatos?.length || 0 },
    { id: 'politicos', label: 'Políticos', count: data.politicos?.length || 0 },
    { id: 'emendas', label: 'Emendas', count: data.emendas?.length || 0 },
    { id: 'obras', label: 'Obras', count: data.obras?.length || 0 },
    { id: 'eventos', label: 'Eventos', count: data.eventos?.length || 0 },
    { id: 'notas', label: 'Notas', count: data.notas?.length || 0 },
    { id: 'pendencias', label: 'Pendências', count: data.pendencias?.length || 0, isAlert: (data.pendencias?.filter(p => p.prioridade === 'urgente' || p.prioridade === 'alta').length || 0) > 0 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'contatos':
        return <ContatosTab data={data.contatos} />;
      case 'politicos':
        return <PoliticosTab data={data.politicos} />;
      case 'emendas':
        return <EmendasTab data={data.emendas} />;
      case 'obras':
        return <ObrasTab data={data.obras} />;
      case 'eventos':
        return <EventosTab data={data.eventos} />;
      case 'notas':
        return <NotasTab data={data.notas} />;
      case 'pendencias':
        return <PendenciasTab data={data.pendencias} />;
      default:
        return <PlaceholderTab title={activeTab} />;
    }
  };

  return (
    <div>
      <div className="border-b border-border overflow-x-auto whitespace-nowrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-3 py-2 text-sm font-medium transition-colors border-b-2
              ${activeTab === tab.id
                ? 'text-accent border-accent'
                : 'text-muted border-transparent hover:text-text'
              }`}
          >
            {tab.label} <span className="text-xs opacity-60 ml-1">{tab.count}</span>
            {tab.isAlert && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>}
          </button>
        ))}
      </div>
      <div className="mt-1">
        {renderContent()}
      </div>
    </div>
  );
}
