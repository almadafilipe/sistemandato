import { Emenda } from "@/lib/types";

interface EmendasTabProps {
  data: Emenda[] | null;
}

const statusStyles: { [key: string]: { text: string; color: string; } } = {
  executada: { text: '✓ Executada', color: 'green' },
  empenhada: { text: '✓ Empenhada', color: 'green' },
  aprovada: { text: '✓ Aprovada', color: 'blue' },
  proposta: { text: '⏳ Proposta', color: 'accent' },
  bloqueada: { text: '⚠ Bloqueada', color: 'red' },
};

const formatValue = (value: number | null | undefined) => {
  if (value === null || value === undefined) return 'Valor não definido';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export default function EmendasTab({ data }: EmendasTabProps) {
  if (!data || data.length === 0) {
    return <p className="text-muted text-center py-4">Nenhuma emenda parlamentar encontrada.</p>;
  }

  return (
    <div className="px-4 space-y-3">
      {data.map(emenda => {
        const style = statusStyles[emenda.status] || { text: emenda.status, color: 'muted' };
        return (
          <div key={emenda.id} className={`bg-surface2 p-3 rounded-md border-l-4 border-${style.color}`}>
            <p className="font-semibold text-text">{emenda.titulo}</p>
            <div className="flex justify-between items-end mt-2">
              <span className="font-display text-lg text-accent">{formatValue(emenda.valor)}</span>
              <span className={`text-xs font-bold py-1 px-2 rounded-full bg-${style.color}/10 text-${style.color}`}>
                {style.text}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
