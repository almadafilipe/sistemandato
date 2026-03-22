import { Politico } from "@/lib/types";

interface PoliticosTabProps {
  data: Politico[] | null;
}

export default function PoliticosTab({ data }: PoliticosTabProps) {
  if (!data || data.length === 0) {
    return <p className="text-muted text-center py-4">Nenhum político aliado encontrado.</p>;
  }

  return (
    <div className="px-4 space-y-3">
      {data.map(politico => (
        <div key={politico.id} className="bg-surface2 p-3 rounded-lg border border-border2">
          <p className="text-xs font-bold uppercase tracking-wider text-accent">
            {politico.cargo || 'Cargo não definido'}
          </p>
          <p className="font-semibold text-text mt-1">{politico.nome}</p>
          <div className="text-sm text-muted flex justify-between items-center mt-1">
            <span>{politico.partido || 'Sem partido'}</span>
            <span>{politico.telefone || ''}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
