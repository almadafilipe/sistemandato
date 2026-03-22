'use client';

import { useState, useRef } from 'react';
import VCF from 'vcf';
import { saveImportedContacts } from '@/app/lideranca/actions';

// Apenas os dados que serão enviados para a action
interface ParsedContactData {
  nome: string;
  telefone?: string;
  email?: string;
}

// Estado da UI que inclui o campo 'selecionado'
interface ParsedContactUI extends ParsedContactData {
  selecionado: boolean;
}

interface ImportVcfProps {
  municipioId: string;
}

export default function ImportVcf({ municipioId }: ImportVcfProps) {
  const [step, setStep] = useState<'idle' | 'preview' | 'sending'>('idle');
  const [parsedContacts, setParsedContacts] = useState<ParsedContactUI[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const cards = VCF.parse(text);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contacts: ParsedContactUI[] = cards.map((card: any) => {
      const nome = card.get('fn')?.valueOf().toString() || 'Sem nome';
      const telefone = card.get('tel')?.valueOf().toString() || undefined;
      const email = card.get('email')?.valueOf().toString() || undefined;
      return { nome, telefone, email, selecionado: true };
    });
    
    setParsedContacts(contacts);
    setStep('preview');
  };

  const handleToggleSelect = (index: number) => {
    setParsedContacts(prev => 
      prev.map((c, i) => i === index ? { ...c, selecionado: !c.selecionado } : c)
    );
  };

  const handleConfirm = async () => {
    setStep('sending');
    const selectedContacts: ParsedContactData[] = parsedContacts
      .filter(c => c.selecionado)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ selecionado, ...rest }) => rest); // Remove o campo 'selecionado'
    
    try {
      await saveImportedContacts(selectedContacts, municipioId);
      // TODO: Adicionar um toast de sucesso
    } catch (error) {
      console.error(error);
      // TODO: Adicionar um toast de erro
    }

    // Reset state
    setStep('idle');
    setParsedContacts([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (step === 'preview' || step === 'sending') {
    const selectedCount = parsedContacts.filter(c => c.selecionado).length;
    return (
      <div className="p-4 bg-surface2 rounded-lg border border-green/30 animate-fadeIn">
        <h3 className="font-semibold text-green mb-2">{parsedContacts.length} contatos encontrados</h3>
        <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
          {parsedContacts.map((contact, index) => (
            <div key={index} className="flex items-center gap-3 p-2 rounded-md bg-bg">
              <input 
                type="checkbox"
                checked={contact.selecionado}
                onChange={() => handleToggleSelect(index)}
                className="h-5 w-5 rounded bg-surface border-border2 text-accent focus:ring-accent"
              />
              <div className="flex-grow">
                <p className="text-sm font-medium text-text">{contact.nome}</p>
                <p className="text-xs text-muted">{contact.telefone || contact.email}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={handleConfirm} disabled={selectedCount === 0 || step === 'sending'} className="w-full py-2 px-4 rounded-md text-sm font-semibold text-bg bg-accent hover:bg-accent2 disabled:bg-muted transition-colors">
            {step === 'sending' ? 'Enviando...' : `Confirmar e enviar ${selectedCount}`}
          </button>
          <button onClick={() => setStep('idle')} className="py-2 px-4 rounded-md text-sm font-medium text-muted hover:bg-surface transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".vcf"
        className="hidden"
      />
      <div onClick={() => fileInputRef.current?.click()} className="import-box text-center p-8 border-2 border-dashed border-border2 rounded-lg hover:border-accent transition-colors cursor-pointer">
        <div className="text-4xl">📱</div>
        <p className="font-semibold mt-2">Importar arquivo .vcf</p>
        <p className="text-sm text-muted mt-1">Exporte do celular e envie aqui.</p>
      </div>
    </div>
  );
}
