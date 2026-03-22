import { Emenda } from "@/lib/types";

interface EmendasTabProps {
  data: Emenda[] | null;
}

const statusConfig: { [key: string]: { text: string; color: string; bg: string } } = {
  executada: { text: '✓ Executada', color: 'text-green', bg: 'bg-green/10' },
  empenhada: { text: '✓ Empenhada', color: 'text-green', bg: 'bg-green/10' },
  aprovada: { text: '✓ Aprovada', color: 'text-blue', bg: 'bg-blue/10' },
  proposta: { text: '⏳ Proposta', color: 'text-accent', bg: 'bg-accent/10' },
  bloqueada: { text: '⚠ Bloqueada', color: 'text-red', bg: 'bg-red/10' },
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
    return (
      <div className="flex flex-col items-center justify-center text-muted py-10 text-center animate-fadeIn">
        <p className="font-bold opacity-40">Nenhuma emenda parlamentar registrada.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-2 space-y-4 animate-fadeIn">
      {data.map(emenda => {
        const config = statusConfig[emenda.status] || { text: emenda.status, color: 'text-muted', bg: 'bg-black/5' };
        return (
          <div key={emenda.id} className="bg-surface p-4 rounded-2xl border border-border hover:border-accent/40 transition-all duration-300 shadow-sm group relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${config.bg.replace('/10', '')}`} />
            
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-black text-text text-lg leading-tight group-hover:text-accent transition-colors">
                {emenda.titulo}
              </h3>
              <span className={`text-[10px] font-black py-1 px-3 rounded-full ${config.bg} ${config.color} uppercase tracking-widest whitespace-nowrap ml-4`}>
                {config.text}
              </span>
            </div>

            <div className="flex justify-between items-end border-t border-black/5 pt-2 mt-2.5">
              <div>
                <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1">Valor Destinado</p>
                <p className="font-display text-2xl text-accent leading-none">
                  {formatValue(emenda.valor)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-opacity">Detalhes técnicos</p>
                <p className="text-xs font-bold text-muted transition-colors group-hover:text-text italic">Ref: {emenda.id.slice(0, 8)}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
