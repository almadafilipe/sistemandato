'use client';

import { useState } from 'react';
import { promoteToAssessoria } from '@/app/assessoria/actions';

export default function PromoteToAdminButton() {
  const [isPending, setIsPending] = useState(false);

  const handlePromote = async () => {
    if (!confirm('Deseja promover sua conta para Assessoria (Admin)?')) return;
    
    try {
      setIsPending(true);
      await promoteToAssessoria();
      // A página deve revalidar sozinha pelo revalidatePath
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
      className="mt-6 px-6 py-2 bg-purple text-text font-bold rounded-full border border-purple/50 hover:bg-purple/80 transition-all text-xs tracking-widest uppercase shadow-lg shadow-purple/20"
    >
      {isPending ? 'PROMOVENDO...' : 'VIRAR ADMIN (ASSESSORIA)'}
    </button>
  );
}
