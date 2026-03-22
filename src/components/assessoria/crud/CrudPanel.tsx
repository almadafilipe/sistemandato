'use client';

import { useState } from 'react';
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
  data: any[];
  titleKey: string; // Qual campo usar como titulo na listagem
  subtitleKey?: string; // Qual campo usar como subtitulo
}

export default function CrudPanel({ tableName, municipioId, schema, data, titleKey, subtitleKey }: CrudPanelProps) {
  const [items, setItems] = useState<any[]>(data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenNew = () => {
    setEditingItem(null);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, itemTitle: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${itemTitle}"?`)) return;
    
    setLoading(true);
    const res = await deleteRecord(tableName, id, municipioId);
    setLoading(false);
    
    if (res.error) {
      alert(`Erro: ${res.error}`);
    } else {
      setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const payload: any = {};
    
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

    let res;
    if (editingItem) {
      res = await updateRecord(tableName, editingItem.id, municipioId, payload);
      if (!res.error) {
        setItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...payload } : i));
      }
    } else {
      res = await addRecord(tableName, municipioId, payload);
      if (!res.error) {
        // Como o server action revalida, a pagina recarregaria, mas localmente atualizamos
        // Ou recarregamos a page. Next.js fará o refresh do payload invisivelmente.
        window.location.reload(); 
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
    <div className="animate-fadeIn">
      {/* Header da Aba */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-display text-text capitalize">{tableName}</h2>
          <p className="text-sm text-muted">{items.length} registros encontrados.</p>
        </div>
        <button 
          onClick={handleOpenNew}
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Adicionar
        </button>
      </div>

      {/* Listagem Esteticamente Premium */}
      {items.length === 0 ? (
        <div className="bg-surface2 border border-dashed border-border rounded-xl p-8 text-center text-muted">
          Nenhum registro encontrado em {tableName}.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-surface2 border border-border rounded-xl p-4 flex justify-between items-start group hover:border-accent/50 transition-colors shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-accent/30 group-hover:bg-accent transition-colors" />
              <div className="pl-3">
                <p className="font-semibold text-text text-lg leading-tight break-words">{item[titleKey] || 'Sem Título'}</p>
                {subtitleKey && item[subtitleKey] && (
                  <p className="text-sm text-muted mt-1 leading-relaxed capitalize">{String(item[subtitleKey])}</p>
                )}
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 text-muted hover:text-blue hover:bg-blue/10 rounded-md transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(item.id, String(item[titleKey]))}
                  className="p-2 text-muted hover:text-red hover:bg-red/10 rounded-md transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Glassmorphism de Edição/Inclusão */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface w-full max-w-lg rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-4 border-b border-border flex justify-between items-center bg-surface2">
              <h3 className="text-lg font-display text-text">
                {editingItem ? 'Editar Registro' : 'Novo Registro'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-md text-muted hover:text-text hover:bg-surface transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-md bg-red/10 text-red text-sm border border-red/20">
                  {errorMsg}
                </div>
              )}

              {schema.map(field => (
                <div key={field.name} className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-muted tracking-wide uppercase">
                    {field.label} {field.required && <span className="text-red">*</span>}
                  </label>
                  
                  {field.type === 'textarea' ? (
                    <textarea 
                      name={field.name}
                      required={field.required}
                      defaultValue={editingItem ? editingItem[field.name] : ''}
                      className="w-full p-2.5 rounded-lg bg-bg border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all min-h-[100px] text-text"
                    />
                  ) : field.type === 'select' && field.options ? (
                    <select
                      name={field.name}
                      required={field.required}
                      defaultValue={editingItem ? editingItem[field.name] : ''}
                      className="w-full p-2.5 rounded-lg bg-bg border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-text"
                    >
                      <option value="">Selecione...</option>
                      {field.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : field.type === 'checkbox' ? (
                    <label className="flex items-center gap-2 cursor-pointer mt-1">
                      <input 
                        type="checkbox"
                        name={field.name}
                        defaultChecked={editingItem ? Boolean(editingItem[field.name]) : false}
                        className="w-4 h-4 rounded border-border text-accent focus:ring-accent accent-accent"
                      />
                      <span className="text-text">{field.label}</span>
                    </label>
                  ) : (
                    <input 
                      type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                      name={field.name}
                      required={field.required}
                      defaultValue={editingItem ? (field.type === 'date' && editingItem[field.name] ? editingItem[field.name].split('T')[0] : editingItem[field.name]) : ''}
                      step={field.type === 'number' ? '0.01' : undefined}
                      className="w-full p-2.5 rounded-lg bg-bg border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-text"
                    />
                  )}
                </div>
              ))}

              <div className="pt-6 border-t border-border mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-muted hover:text-text hover:bg-surface2 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-accent text-white hover:bg-opacity-90 transition-all font-medium disabled:opacity-70"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Salvar
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
