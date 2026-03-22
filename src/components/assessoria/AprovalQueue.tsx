import { getContatosPendentes } from "@/lib/supabase/api";
import { approveContact, rejectContact } from "@/app/assessoria/actions";
import { Check, X, User, MapPin, CheckCircle } from "lucide-react";

export default async function AprovalQueue() {
  const { data, error } = await getContatosPendentes();
  
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-sm text-red font-medium">Erro ao carregar a fila de aprovação.</p>
      </div>
    );
  }

  const contatos = (data || []) as any[];

  if (contatos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted/40 text-center">
        <CheckCircle className="w-12 h-12 mb-4 opacity-10" />
        <p className="text-sm font-medium">Tudo em ordem por aqui!</p>
        <p className="text-[10px] uppercase tracking-widest mt-1">Nenhum contato pendente</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {contatos.map((contato) => {
        const perfilNome = Array.isArray(contato.perfis) ? contato.perfis[0]?.nome : contato.perfis?.nome;
        const municipioNome = Array.isArray(contato.municipios) ? contato.municipios[0]?.nome : contato.municipios?.nome;

        return (
          <div key={contato.id} className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/8 transition-all group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-text group-hover:text-accent transition-colors">{contato.nome}</p>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-muted font-medium uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" /> {perfilNome || '...'}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {municipioNome || '...'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <form action={approveContact.bind(null, contato.id)} className="flex-1 md:flex-none">
                <button 
                  type="submit" 
                  title="Aprovar Contato"
                  className="w-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest py-2 px-4 rounded-lg bg-green/10 text-green hover:bg-green hover:text-bg transition-all"
                >
                  <Check className="w-3 h-3" />
                  Aprovar
                </button>
              </form>
              <form action={rejectContact.bind(null, contato.id)} className="flex-1 md:flex-none">
                <button 
                  type="submit" 
                  title="Rejeitar Contato"
                  className="w-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest py-2 px-4 rounded-lg bg-red/10 text-red hover:bg-red hover:text-bg transition-all"
                >
                  <X className="w-3 h-3" />
                  Rejeitar
                </button>
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
}
