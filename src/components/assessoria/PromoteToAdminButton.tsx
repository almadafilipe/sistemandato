'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { promoteToAssessoria } from '@/app/assessoria/actions';

export default function PromoteToAdminButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handlePromote = async () => {
    if (!confirm('Deseja promover sua conta para Assessoria (Admin)?')) return;
    
    try {
      setIsPending(true);
      await promoteToAssessoria();
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Erro ao promover conta.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button 
      onClick={handlePromote}
      disabled={isPending}
      className="mt-6 px-10 py-5 bg-accent text-white font-black rounded-2xl border border-accent/20 hover:bg-accent-hover transition-all text-xs tracking-[0.2em] uppercase shadow-[0_15px_35px_rgba(227,6,19,0.25)] active:scale-95 disabled:opacity-50"
    >
      {isPending ? 'PROCESSANDO ACESSO...' : 'REQUERER ACESSO ADMIN'}
    </button>
  );
}
