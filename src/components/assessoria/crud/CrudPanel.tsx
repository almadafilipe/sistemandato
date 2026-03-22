'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addRecord, updateRecord, deleteRecord } from '@/app/assessoria/municipio/[id]/actions';
import { Trash2, Edit2, Plus, X, Loader2 } from 'lucide-react';

export interface FieldSchema {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'date' | 'checkbox';
  required?: boolean;
  options?: { value: string; label: string }[];
}

interface CrudPanelProps {
  tableName: string;
  municipioId: string;
  schema: FieldSchema[];
  data: Record<string, unknown>[];
  titleKey: string; // Qual campo usar como titulo na listagem
  subtitleKey?: string; // Qual campo usar como subtitulo
}

export default function CrudPanel({ tableName, municipioId, schema, data, titleKey, subtitleKey }: CrudPanelProps) {
  const router = useRouter();
  const [items, setItems] = useState<Record<string, unknown>[]>(data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenNew = () => {
    setEditingItem(null);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Record<string, unknown>) => {
    setEditingItem(item);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, itemTitle: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${itemTitle}"?`)) return;
    
    setLoading(true);
    const res = await deleteRecord(tableName, id, municipioId);
    
    if (res.error) {
      alert(`Erro: ${res.error}`);
    } else {
      setItems(prev => prev.filter(i => String(i.id) !== id));
      router.refresh();
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = {};
    
    schema.forEach(field => {
      if (field.type === 'checkbox') {
        payload[field.name] = formData.get(field.name) === 'true' || formData.get(field.name) === 'on';
      } else if (field.type === 'number') {
        const val = formData.get(field.name);
        payload[field.name] = val ? Number(val) : null;
      } else {
        const val = formData.get(field.name);
        payload[field.name] = val ? String(val) : null;
      }
    });

    let res: { error?: string; data?: Record<string, unknown> };
    if (editingItem) {
      res = await updateRecord(tableName, String(editingItem.id), municipioId, payload);
      if (!res.error) {
        setItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...payload } : i));
        router.refresh();
      }
    } else {
      res = await addRecord(tableName, municipioId, payload);
      if (!res.error && res.data) {
        setItems(prev => [res.data as Record<string, unknown>, ...prev]);
        router.refresh();
      }
    }

    setLoading(false);
    
    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="animate-fadeIn space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-black/5">
        <div>
          <h2 className="text-4xl font-display text-accent capitalize italic tracking-tight">{tableName}</h2>
          <p className="text-base text-muted font-bold mt-1">Base estratégica com {items.length} registros ativos.</p>
        </div>
        <button 
          onClick={handleOpenNew}
          className="flex items-center gap-3 bg-accent hover:bg-accent-hover text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-[0_10px_30px_rgba(227,6,19,0.3)] active:scale-95 group"
          title="Adicionar novo registro"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> 
          Incluir Novo Registro
        </button>
      </div>

      {items.length === 0 ? (
        <div className="vibe-card border-dashed border-black/10 p-20 text-center">
          <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-muted opacity-20" />
          </div>
          <p className="text-xl text-muted font-black">Nenhum registro estratégico encontrado em <span className="text-accent">{tableName}</span>.</p>
          <p className="text-sm text-muted/40 mt-2 lowercase font-bold">Inicie o monitoramento adicionando o primeiro item.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map(item => (
            <div key={String(item.id)} className="vibe-card p-8 flex justify-between items-start group hover:border-accent/40 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-accent/20 group-hover:bg-accent transition-all duration-500" />
              <div className="flex-1 pr-4">
                <p className="font-black text-text text-xl leading-tight mb-2 group-hover:text-accent transition-colors">
                  {String(item[titleKey] || 'Sem Título')}
                </p>
                {Boolean(subtitleKey && item[subtitleKey]) && (
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/50 group-hover:bg-accent group-hover:animate-pulse transition-all"></span>
                    <p className="text-xs font-black uppercase tracking-widest text-muted group-hover:text-text transition-colors">
                      {String(item[subtitleKey as string])}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                <button 
                  onClick={() => handleOpenEdit(item)}
                  className="p-3 text-muted hover:text-accent hover:bg-black/5 rounded-xl transition-all"
                  title={`Editar ${String(item[titleKey]) || 'registro'}`}
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(String(item.id), String(item[titleKey]))}
                  className="p-3 text-muted hover:text-accent hover:bg-accent/10 rounded-xl transition-all"
                  title="Excluir Definitivamente"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="vibe-card w-full max-w-2xl border-black/10 overflow-hidden flex flex-col max-h-[90vh] shadow-[0_30px_100px_rgba(0,0,0,0.3)] bg-surface1">
            
            <div className="p-8 border-b border-black/5 flex justify-between items-center bg-black/2">
              <div>
                <h3 className="text-3xl font-display text-accent italic">
                  {editingItem ? 'Refinar Registro' : 'Estratégia: Novo Item'}
                </h3>
                <p className="text-xs text-muted font-black uppercase tracking-widest mt-1">Módulo de Gestão Territorial</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-3 rounded-2xl text-muted hover:text-accent hover:bg-black/5 transition-all"
                title="Fechar modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
              {errorMsg && (
                <div className="p-5 rounded-2xl bg-accent/10 text-accent text-sm font-bold border border-accent/20 animate-shake">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 gap-8">
                {schema.map(field => (
                  <div key={field.name} className="flex flex-col gap-3">
                    <label className="text-xs font-black text-accent uppercase tracking-[0.2em] ml-1">
                      {field.label} {field.required && <span className="opacity-50">•</span>}
                    </label>
                    
                    {field.type === 'textarea' ? (
                      <textarea 
                        name={field.name}
                        required={field.required}
                        defaultValue={editingItem ? String(editingItem[field.name]) : ''}
                        className="w-full p-5 bg-black/5 border border-black/10 rounded-2xl min-h-[160px] text-lg focus:ring-accent/40 text-text"
                        placeholder="..."
                      />
                    ) : field.type === 'select' && field.options ? (
                      <select
                        name={field.name}
                        required={field.required}
                        title={field.label}
                        defaultValue={editingItem ? String(editingItem[field.name]) : ''}
                        className="w-full p-5 bg-black/5 border border-black/10 rounded-2xl text-lg appearance-none cursor-pointer focus:ring-accent/40 text-text"
                      >
                        <option value="">Selecione uma opção...</option>
                        {field.options.map(opt => (
                          <option key={opt.value} value={opt.value} className="bg-bg text-text">{opt.label}</option>
                        ))}
                      </select>
                    ) : field.type === 'checkbox' ? (
                      <label className="flex items-center gap-4 cursor-pointer p-4 rounded-2xl hover:bg-black/5 transition-colors group">
                        <div className="relative flex items-center">
                            <input 
                                type="checkbox"
                                name={field.name}
                                defaultChecked={editingItem ? Boolean(editingItem[field.name]) : false}
                                className="w-6 h-6 rounded-lg border-black/20 text-accent focus:ring-accent bg-transparent transition-all"
                            />
                        </div>
                        <span className="text-lg font-black text-muted group-hover:text-text transition-colors">{field.label}</span>
                      </label>
                    ) : (
                      <input 
                        type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                        name={field.name}
                        required={field.required}
                        defaultValue={editingItem ? (field.type === 'date' && editingItem[field.name] ? String(editingItem[field.name]).split('T')[0] : String(editingItem[field.name])) : ''}
                        step={field.type === 'number' ? '0.01' : undefined}
                        className="w-full p-5 bg-black/5 border border-black/10 rounded-2xl text-lg focus:ring-accent/40 text-text"
                        placeholder="..."
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-10 border-t border-black/5 mt-10 flex flex-col sm:flex-row justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 rounded-2xl text-muted font-black hover:text-accent hover:bg-black/5 transition-all text-sm uppercase tracking-widest"
                >
                  Descartar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-accent text-white font-bold hover:bg-accent-hover transition-all shadow-[0_10px_30px_rgba(227,6,19,0.3)] disabled:opacity-50 active:scale-95"
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  Confirmar Ação
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
