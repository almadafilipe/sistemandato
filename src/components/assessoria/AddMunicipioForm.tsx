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
    <form onSubmit={handleSubmit} className="vibe-card space-y-4 border-accent/20">
      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-4">Novo Município</h3>
      
      <div className="space-y-3">
        <div>
          <label htmlFor="nome" className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5 ml-1">Nome do Município *</label>
          <input 
            id="nome"
            type="text" 
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            placeholder="Ex: Salinas da Margarida"
            className="glass-input"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="regiao" className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5 ml-1">Região</label>
            <input 
              id="regiao"
              type="text" 
              value={regiao}
              onChange={(e) => setRegiao(e.target.value)}
              placeholder="Ex: Recôncavo"
              className="glass-input"
            />
          </div>
          <div>
            <label htmlFor="populacao" className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5 ml-1">População</label>
            <input 
              id="populacao"
              type="number" 
              value={populacao}
              onChange={(e) => setPopulacao(e.target.value ? Number(e.target.value) : '')}
              placeholder="Estimativa"
              className="glass-input"
            />
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full py-3 bg-accent text-bg font-bold rounded-xl hover:bg-accent2 transition-all disabled:opacity-50 uppercase tracking-widest text-xs mt-4"
      >
        {isPending ? 'Cadastrando...' : 'ADICIONAR MUNICÍPIO'}
      </button>

      {message && (
        <p className={`text-[10px] font-bold text-center uppercase tracking-wider ${message.type === 'success' ? 'text-green' : 'text-red'} mt-2`}>
          {message.text}
        </p>
      )}
    </form>
  );
}
