'use client';

import { useState } from 'react';
import CrudPanel, { FieldSchema } from './CrudPanel';
// Tipos removidos por não serem utilizados no componente
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
    <div className="flex flex-col xl:flex-row gap-12 items-start">
      {/* Sidebar Navigation - Pro Max */}
      <div className="w-full xl:w-80 flex-shrink-0 space-y-4">
        <p className="px-6 text-[10px] font-bold uppercase tracking-[0.3em] text-muted/40">Categorias de Dados</p>
        <div className="vibe-card p-3! border-white/5 bg-surface/10">
          <ul className="space-y-2">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl text-left transition-all duration-300 font-bold group ${
                      isActive 
                        ? 'bg-accent text-white shadow-[0_10px_20px_rgba(227,6,19,0.2)] scale-[1.02]' 
                        : 'text-muted hover:bg-white/5 hover:text-text'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted group-hover:text-accent transition-colors'}`} />
                      <span className="text-sm tracking-wide">{tab.label}</span>
                    </div>
                    <span className={`text-[10px] px-2.5 py-1 rounded-lg font-black ${isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-muted'} transition-colors`}>
                      {tab.data.length}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="vibe-card p-6! border-accent/10 bg-accent/5">
            <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2">Dica Operacional</p>
            <p className="text-xs text-muted/60 leading-relaxed font-medium">As alterações feitas aqui são sincronizadas instantaneamente com o portal do Deputado.</p>
        </div>
      </div>

      {/* Main Content Area - luxo e espaço */}
      <div className="flex-1 w-full min-h-[700px]">
        {currentConfig && (
          <div className="animate-fade-in-up">
            <CrudPanel 
              key={currentConfig.id}
              tableName={currentConfig.id}
              municipioId={municipioId}
              schema={currentConfig.schema}
              data={currentConfig.data}
              titleKey={currentConfig.titleKey}
              subtitleKey={currentConfig.subtitleKey}
            />
          </div>
        )}
      </div>
    </div>
  );
}
