import { Obra } from "@/lib/types";
import { Hammer, Ban, Clock, CheckCircle } from "lucide-react";

interface ObrasTabProps {
  data: Obra[] | null;
}

import { ElementType } from "react";

const statusConfig: { [key: string]: { text: string; color: string; bg: string; icon: ElementType } } = {
  concluida: { text: 'Concluída', color: 'text-green', bg: 'bg-green/10', icon: CheckCircle },
  em_andamento: { text: 'Em Andamento', color: 'text-blue', bg: 'bg-blue/10', icon: Hammer },
  planejada: { text: 'Planejada', color: 'text-accent', bg: 'bg-accent/10', icon: Clock },
  paralisada: { text: 'Paralisada', color: 'text-red', bg: 'bg-red/10', icon: Ban },
};

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'Sem previsão';
  const date = new Date(dateString);
  // Garante que não sofra com timezone offset
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeZone: 'UTC' }).format(date);
};

export default function ObrasTab({ data }: ObrasTabProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-muted py-8 text-center animate-fadeIn">
        <Hammer className="w-8 h-8 opacity-50 mb-2" />
        <p>Nenhuma obra registrada para este município.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-2 space-y-4 animate-fadeIn">
      {data.map(obra => {
        const config = statusConfig[obra.status] || { text: obra.status, color: 'text-muted', bg: 'bg-surface2', icon: Clock };
        const IconName = config.icon;

        return (
          <div key={obra.id} className="bg-surface2 p-4 rounded-xl border border-border hover:border-accent/50 transition-colors shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1.5 h-full ${config.bg.replace('/10', '')}`} />
            
            <div className="flex justify-between items-start pl-2">
              <div>
                <h3 className="font-semibold text-text text-lg leading-tight">{obra.titulo}</h3>
                {obra.descricao && (
                  <p className="text-sm text-muted mt-1 leading-relaxed">{obra.descricao}</p>
                )}
              </div>
              <span className={`flex items-center gap-1.5 text-xs font-bold py-1 px-2.5 rounded-full ${config.bg} ${config.color} uppercase tracking-wider whitespace-nowrap ml-2`}>
                <IconName className="w-3.5 h-3.5" />
                {config.text}
              </span>
            </div>

            <div className="mt-4 pl-2 grid grid-cols-2 gap-2 border-t border-border pt-3">
              <div>
                <p className="text-xs text-muted uppercase tracking-wider font-semibold">Previsão</p>
                <p className="text-sm font-medium text-text font-display mt-0.5">{formatDate(obra.previsao_conclusao)}</p>
              </div>
              {obra.emenda_id && (
                <div>
                   <p className="text-xs text-muted uppercase tracking-wider font-semibold">Vínculo</p>
                   <p className="text-sm font-medium text-purple font-display mt-0.5">Com Emenda</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
