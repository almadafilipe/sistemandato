import { Nota } from "@/lib/types";

interface NotasTabProps {
  data: Nota[] | null;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function NotasTab({ data }: NotasTabProps) {
  if (!data || data.length === 0) {
    return <p className="text-muted text-center py-4">Nenhuma nota da assessoria encontrada.</p>;
  }

  return (
    <div className="px-4 space-y-3">
      {data.map(nota => (
        <div key={nota.id} className="bg-surface2 p-3 rounded-lg border border-border2">
          <p className="text-xs text-muted mb-1">{formatDate(nota.created_at)}</p>
          <p className="text-text text-sm leading-relaxed">{nota.conteudo}</p>
          {/* TODO: Buscar nome do autor a partir do autor_id */}
          {nota.autor_id && <p className="text-xs text-accent mt-2 font-semibold">Assessoria</p>}
        </div>
      ))}
    </div>
  );
}
