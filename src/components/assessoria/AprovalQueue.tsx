import { getContatosPendentes } from "@/lib/supabase/api";
import { approveContact, rejectContact } from "@/app/assessoria/actions";

export default async function AprovalQueue() {
  const { data: contatos, error } = await getContatosPendentes();

  if (error) {
    return <p className="text-sm text-red">Erro ao carregar a fila de aprovação.</p>;
  }

  if (!contatos || contatos.length === 0) {
    return <p className="text-sm text-center text-muted py-4">Nenhum contato para aprovar.</p>;
  }

  return (
    <div className="space-y-2">
      {contatos.map((contato: any) => (
        <div key={contato.id} className="bg-surface p-2 rounded-md flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-text">{contato.nome}</p>
            <p className="text-xs text-muted">
              Enviado por {contato.perfis?.nome || '...'} de {contato.municipios?.nome || '...'}
            </p>
          </div>
          <div className="flex gap-2">
            <form action={approveContact.bind(null, contato.id)}>
              <button type="submit" className="text-xs font-bold py-1 px-2 rounded-full bg-green/10 text-green hover:bg-green/20 transition-colors">
                Aprovar
              </button>
            </form>
            <form action={rejectContact.bind(null, contato.id)}>
              <button type="submit" className="text-xs font-bold py-1 px-2 rounded-full bg-red/10 text-red hover:bg-red/20 transition-colors">
                Rejeitar
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
