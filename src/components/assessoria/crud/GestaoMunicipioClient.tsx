'use client';

import { useState } from 'react';
import CrudPanel, { FieldSchema } from './CrudPanel';
import { ObraStatus, EmendaStatus, PendenciaPrioridade, PendenciaStatus } from '@/lib/types';
import { Calendar, FileText, Hammer, Users, AlertTriangle, FileSignature } from 'lucide-react';

interface GestaoMunicipioClientProps {
  municipioId: string;
  initialData: {
    emendas: any[];
    obras: any[];
    eventos: any[];
    notas: any[];
    politicos: any[];
    pendencias: any[];
  }
}

// ================= SCHEMAS =================
const emendasSchema: FieldSchema[] = [
  { name: 'titulo', label: 'Título da Emenda', type: 'text', required: true },
  { name: 'valor', label: 'Valor (R$)', type: 'number' },
  { name: 'area', label: 'Área (Saúde, Educação, etc)', type: 'text' },
  { 
    name: 'status', label: 'Status', type: 'select', required: true,
    options: [
      { value: 'proposta', label: 'Proposta' },
      { value: 'aprovada', label: 'Aprovada' },
      { value: 'empenhada', label: 'Empenhada' },
      { value: 'executada', label: 'Executada' },
      { value: 'bloqueada', label: 'Bloqueada' }
    ]
  },
  { name: 'ano', label: 'Ano', type: 'number' },
  { name: 'observacoes', label: 'Observações Finais', type: 'textarea' },
];

const obrasSchema: FieldSchema[] = [
  { name: 'titulo', label: 'Título da Obra', type: 'text', required: true },
  { name: 'descricao', label: 'Descrição Detalhada', type: 'textarea' },
  { 
    name: 'status', label: 'Status da Obra', type: 'select', required: true,
    options: [
      { value: 'planejada', label: 'Planejada' },
      { value: 'em_andamento', label: 'Em Andamento' },
      { value: 'concluida', label: 'Concluída' },
      { value: 'paralisada', label: 'Paralisada' },
    ]
  },
  { name: 'previsao_conclusao', label: 'Previsão de Conclusão', type: 'date' },
];

const eventosSchema: FieldSchema[] = [
  { name: 'titulo', label: 'Nome do Evento', type: 'text', required: true },
  { name: 'descricao', label: 'Descrição', type: 'textarea' },
  { name: 'data_hora', label: 'Data', type: 'date' },
  { name: 'local', label: 'Localização', type: 'text' },
  { name: 'tipo', label: 'Tipo (Comício, Reunião, Festa...)', type: 'text' },
];

const politicosSchema: FieldSchema[] = [
  { name: 'nome', label: 'Nome Completo', type: 'text', required: true },
  { name: 'cargo', label: 'Cargo (Prefeito, Vereador)', type: 'text' },
  { name: 'partido', label: 'Partido', type: 'text' },
  { name: 'telefone', label: 'Telefone', type: 'text' },
  { name: 'aliado', label: 'É Aliado?', type: 'checkbox' },
];

const pendenciasSchema: FieldSchema[] = [
  { name: 'titulo', label: 'Título da Pendência', type: 'text', required: true },
  { name: 'descricao', label: 'Descrição', type: 'textarea' },
  { 
    name: 'prioridade', label: 'Prioridade', type: 'select', required: true,
    options: [
      { value: 'baixa', label: 'Baixa' },
      { value: 'media', label: 'Média' },
      { value: 'alta', label: 'Alta' },
      { value: 'urgente', label: 'Urgente' },
    ]
  },
  { 
    name: 'status', label: 'Status', type: 'select', required: true,
    options: [
      { value: 'aberta', label: 'Aberta' },
      { value: 'em_tratativa', label: 'Em Tratativa' },
      { value: 'resolvida', label: 'Resolvida' },
    ]
  },
  { name: 'prazo', label: 'Prazo Limite', type: 'date' },
];

const notasSchema: FieldSchema[] = [
  { name: 'conteudo', label: 'Conteúdo da Nota', type: 'textarea', required: true },
];

// ================= END SCHEMAS =================

export default function GestaoMunicipioClient({ municipioId, initialData }: GestaoMunicipioClientProps) {
  const [activeTab, setActiveTab] = useState('obras');

  const tabs = [
    { id: 'obras', label: 'Obras', icon: Hammer, schema: obrasSchema, data: initialData.obras, titleKey: 'titulo', subtitleKey: 'status' },
    { id: 'eventos', label: 'Eventos', icon: Calendar, schema: eventosSchema, data: initialData.eventos, titleKey: 'titulo', subtitleKey: 'data_hora' },
    { id: 'politicos', label: 'Políticos', icon: Users, schema: politicosSchema, data: initialData.politicos, titleKey: 'nome', subtitleKey: 'cargo' },
    { id: 'emendas', label: 'Emendas', icon: FileSignature, schema: emendasSchema, data: initialData.emendas, titleKey: 'titulo', subtitleKey: 'status' },
    { id: 'pendencias', label: 'Pendências', icon: AlertTriangle, schema: pendenciasSchema, data: initialData.pendencias, titleKey: 'titulo', subtitleKey: 'prioridade' },
    { id: 'notas', label: 'Notas Livres', icon: FileText, schema: notasSchema, data: initialData.notas, titleKey: 'conteudo', subtitleKey: 'created_at' },
  ];

  const currentConfig = tabs.find(t => t.id === activeTab);

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex-shrink-0 bg-surface rounded-xl p-3 shadow-sm border border-border">
        <ul className="space-y-1">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all font-medium ${
                    isActive 
                      ? 'bg-accent/10 border-l-4 border-accent text-accent' 
                      : 'text-muted hover:bg-surface2 hover:text-text border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-accent' : 'opacity-60'}`} />
                    {tab.label}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-accent text-white' : 'bg-border text-muted'} opacity-80`}>
                    {tab.data.length}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-surface rounded-xl p-6 shadow-sm border border-border min-h-[500px]">
        {currentConfig && (
          <CrudPanel 
            key={currentConfig.id} // Forza reset do componente se a tab mudar
            tableName={currentConfig.id}
            municipioId={municipioId}
            schema={currentConfig.schema}
            data={currentConfig.data}
            titleKey={currentConfig.titleKey}
            subtitleKey={currentConfig.subtitleKey}
          />
        )}
      </div>
    </div>
  );
}
