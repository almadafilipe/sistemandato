'use client';

import { useState } from 'react';
import { createMunicipio } from '@/app/assessoria/actions';

export default function AddMunicipioForm() {
  const [nome, setNome] = useState('');
  const [regiao, setRegiao] = useState('');
  const [populacao, setPopulacao] = useState<number | ''>('');
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome) return;

    try {
      setIsPending(true);
      setMessage(null);
      await createMunicipio(nome, regiao || undefined, populacao === '' ? undefined : Number(populacao));
      
      setMessage({ type: 'success', text: `Município "${nome}" cadastrado!` });
      setNome('');
      setRegiao('');
      setPopulacao('');
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Erro ao cadastrar. Tente outro nome.' });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-surface3 rounded-lg border border-border space-y-3">
      <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-3">Novo Município</h3>
      
      <div>
        <label className="block text-xs text-muted mb-1">Nome do Município *</label>
        <input 
          type="text" 
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          placeholder="Ex: Salinas da Margarida"
          className="w-full bg-bg border border-border2 p-2 rounded text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-muted mb-1">Região</label>
          <input 
            type="text" 
            value={regiao}
            onChange={(e) => setRegiao(e.target.value)}
            placeholder="Ex: Recôncavo"
            className="w-full bg-bg border border-border2 p-2 rounded text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">População</label>
          <input 
            type="number" 
            value={populacao}
            onChange={(e) => setPopulacao(e.target.value ? Number(e.target.value) : '')}
            placeholder="Estimativa"
            className="w-full bg-bg border border-border2 p-2 rounded text-sm outline-none focus:border-accent"
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full py-2 bg-accent text-bg font-bold rounded hover:bg-accent2 transition-colors disabled:opacity-50"
      >
        {isPending ? 'Cadastrando...' : 'ADICIONAR MUNICÍPIO'}
      </button>

      {message && (
        <p className={`text-xs text-center ${message.type === 'success' ? 'text-green' : 'text-red'}`}>
          {message.text}
        </p>
      )}
    </form>
  );
}
