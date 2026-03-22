import LogoutButton from "@/components/LogoutButton";
import { getLiderancaDashboardData } from "@/lib/supabase/api";
import { Perfil } from "@/lib/types";
import ImportVcf from "../lideranca/ImportVcf";

interface LiderancaDashboardProps {
  user: any; // Supabase user object
  perfil: Perfil;
}

export default async function LiderancaDashboard({ user, perfil }: LiderancaDashboardProps) {
  
  if (!perfil.municipio_id) {
    return <p className="text-center text-red">Erro: Perfil de liderança não está vinculado a um município.</p>;
  }

  const { data } = await getLiderancaDashboardData(user.id, perfil.municipio_id);

  return (
    <div className="w-full max-w-lg mx-auto animate-fadeIn">
      <div className="p-6 rounded-lg bg-surface mb-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-green">
              Liderança · {data?.municipioNome || '...'}
            </p>
            <h1 className="text-2xl font-display text-text mt-1">
              Seus Contatos
            </h1>
            <p className="text-sm text-muted">Olá, {perfil.nome || user.email}</p>
          </div>
          <LogoutButton />
        </div>
      </div>
      
      <div className="p-4 space-y-6">
        {/* Resumo */}
        <div className="flex gap-4">
          <div className="flex-1 p-4 bg-surface2 rounded-lg text-center">
            <p className="text-3xl font-display text-accent">{data?.aprovadosCount ?? '_'}</p>
            <p className="text-xs text-muted uppercase tracking-wider mt-1">Contatos Aprovados</p>
          </div>
          <div className="flex-1 p-4 bg-surface2 rounded-lg text-center">
            <p className="text-3xl font-display text-accent">{data?.pendentesCount ?? '_'}</p>
            <p className="text-xs text-muted uppercase tracking-wider mt-1">Contatos Pendentes</p>
          </div>
        </div>

        {/* Upload Box */}
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-muted mb-2">Adicionar novos contatos</p>
          <ImportVcf municipioId={perfil.municipio_id} />
        </div>

        {/* Histórico */}
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-muted mb-2">Histórico de envios</p>
          <div className="p-4 bg-surface2 rounded-lg space-y-2">
            {data?.recentes && data.recentes.length > 0 ? (
              data.recentes.map(contato => (
                <div key={contato.id} className="flex justify-between items-center text-sm">
                  <span className="text-text">{contato.nome}</span>
                  <span className={`font-semibold text-xs py-0.5 px-2 rounded-full bg-${contato.status === 'aprovado' ? 'green' : 'accent'}/10 text-${contato.status === 'aprovado' ? 'green' : 'accent'}`}>
                    {contato.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-muted">Seu histórico de contatos enviados aparecerá aqui.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
