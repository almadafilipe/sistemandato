import { Pendencia } from "@/lib/types";

interface PendenciasTabProps {
  data: Pendencia[] | null;
}

const priorityStyles: { [key: string]: { text: string; color: string; } } = {
  urgente: { text: 'Urgente', color: 'red' },
  alta: { text: 'Alta', color: 'accent' },
  media: { text: 'Média', color: 'blue' },
  baixa: { text: 'Baixa', color: 'muted' },
};

export default function PendenciasTab({ data }: PendenciasTabProps) {
  if (!data || data.length === 0) {
    return <p className="text-muted text-center py-4">Nenhuma pendência encontrada.</p>;
  }

  return (
    <div className="px-4 space-y-3">
      {data.map(pendencia => {
        const style = priorityStyles[pendencia.prioridade] || { text: pendencia.prioridade, color: 'muted' };
        return (
          <div key={pendencia.id} className={`bg-surface2 p-3 rounded-md border-l-4 border-${style.color}`}>
            <div className="flex justify-between items-start">
              <p className="font-semibold text-text">{pendencia.titulo}</p>
              <span className={`text-xs font-bold py-1 px-2 rounded-full bg-${style.color}/10 text-${style.color}`}>
                {style.text}
              </span>
            </div>
            <p className="text-sm text-muted mt-1">{pendencia.descricao}</p>
            <div className="text-xs text-blue mt-2">
              Status: <span className="font-semibold">{pendencia.status}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
