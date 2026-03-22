'use client';

import { useState } from 'react';
import { updateUserProfile } from '@/app/assessoria/actions';

interface Perfil {
  id: string;
  nome: string;
  role: 'deputado' | 'lideranca' | 'assessoria';
  municipio_id: string | null;
  municipios?: { nome: string } | null;
}

interface Municipio {
  id: string;
  nome: string;
}

export default function UserManagement({
  perfis,
  municipios
}: {
  perfis: Perfil[];
  municipios: Municipio[];
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<'deputado' | 'lideranca' | 'assessoria'>('deputado');
  const [editMunicipio, setEditMunicipio] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [localPerfis, setLocalPerfis] = useState(perfis); // for optimistic updates

  const startEditing = (p: Perfil) => {
    setEditingId(p.id);
    setEditRole(p.role);
    setEditMunicipio(p.municipio_id || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleSave = async (userId: string) => {
    try {
      setIsSaving(true);
      const targetMunicipio = editRole === 'lideranca' ? (editMunicipio || null) : null;
      
      await updateUserProfile(userId, editRole, targetMunicipio);
      
      // Optimistic update
      setLocalPerfis(prev => prev.map(p => {
        if (p.id === userId) {
          const m = municipios.find(m => m.id === targetMunicipio);
          return {
            ...p,
            role: editRole,
            municipio_id: targetMunicipio,
            municipios: m ? { nome: m.nome } : null
          };
        }
        return p;
      }));
      setEditingId(null);
      } catch (err) {
        console.error(err);
        alert('Erro ao salvar o perfil.');
      } finally {
      setIsSaving(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'assessoria': return <span className="px-2 py-0.5 rounded text-xs bg-purple/20 text-purple border border-purple/30">Admin</span>;
      case 'lideranca': return <span className="px-2 py-0.5 rounded text-xs bg-blue/20 text-blue border border-blue/30">Líder</span>;
      default: return <span className="px-2 py-0.5 rounded text-xs bg-surface2 text-muted border border-border">Deputado</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-surface border-b border-border text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Cargo</th>
              <th className="px-4 py-3 font-medium">Município Vinculado</th>
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {localPerfis.map(p => {
              const isEditing = editingId === p.id;
              
              return (
                <tr key={p.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-text">{p.nome}</td>
                  
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <select 
                        title="Selecione o Cargo"
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value as Perfil['role'])}
                        className="bg-bg border border-border2 text-text text-sm rounded-md block w-full p-1.5 focus:border-accent focus:ring-accent outline-none"
                      >
                        <option value="deputado">Deputado (Leitura)</option>
                        <option value="lideranca">Líder Municipal</option>
                        <option value="assessoria">Assessoria (Admin)</option>
                      </select>
                    ) : getRoleBadge(p.role)}
                  </td>
                  
                  <td className="px-4 py-3 text-muted">
                    {isEditing ? (
                      <select 
                        title="Selecione o Município Vinculado"
                        value={editMunicipio}
                        onChange={(e) => setEditMunicipio(e.target.value)}
                        disabled={editRole !== 'lideranca'}
                        className={`bg-bg border border-border2 text-text text-sm rounded-md block w-full p-1.5 focus:border-accent focus:ring-accent outline-none ${editRole !== 'lideranca' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <option value="">Selecione...</option>
                        {municipios.map(m => (
                          <option key={m.id} value={m.id}>{m.nome}</option>
                        ))}
                      </select>
                    ) : (
                      p.role === 'lideranca' ? (p.municipios?.nome || <span className="text-red/80">Nenhum</span>) : '-'
                    )}
                  </td>
                  
                  <td className="px-4 py-3 text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={cancelEditing} disabled={isSaving} className="text-xs text-muted hover:text-text transition-colors">Cancelar</button>
                        <button onClick={() => handleSave(p.id)} disabled={isSaving} className="px-3 py-1 text-xs rounded bg-accent text-bg font-semibold hover:bg-accent2 transition-colors">
                          {isSaving ? 'Salvando...' : 'Salvar'}
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => startEditing(p)}
                        className="text-xs text-blue hover:text-blue/80 font-medium transition-colors"
                      >
                        Editar
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
            
            {localPerfis.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted">Nenhum usuário encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
