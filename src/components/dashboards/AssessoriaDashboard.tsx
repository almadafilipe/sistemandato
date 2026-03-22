import LogoutButton from "@/components/LogoutButton";
import { getAdminDashboardStats, getPerfis, getMunicipios } from "@/lib/supabase/api";
import AprovalQueue from "../assessoria/AprovalQueue";
import UserManagement from "../assessoria/UserManagement";

interface AssessoriaDashboardProps {
  user: any;
}

const StatCard = ({ label, value }: { label: string, value: number | null | undefined }) => (
  <div className="p-4 bg-surface2 rounded-lg text-center">
    <p className="text-3xl font-display text-accent">{value ?? '_'}</p>
    <p className="text-xs text-muted uppercase tracking-wider mt-1">{label}</p>
  </div>
);

export default async function AssessoriaDashboard({ user }: AssessoriaDashboardProps) {
  
  const [
    { data: stats, error },
    { data: perfis },
    { data: municipios }
  ] = await Promise.all([
    getAdminDashboardStats(),
    getPerfis(),
    getMunicipios()
  ]);
  
  return (
    <div className="w-full max-w-6xl mx-auto animate-fadeIn pb-10">
      <div className="p-6 rounded-lg bg-surface mb-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-purple">
              Assessoria · Admin
            </p>
            <h1 className="text-2xl font-display text-text mt-1">
              Painel de Gestão
            </h1>
          </div>
          <LogoutButton />
        </div>
      </div>
      
      <div className="p-4 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Municípios" value={stats?.municipios} />
          <StatCard label="Contatos Aprovados" value={stats?.contatos} />
          <StatCard label="Emendas" value={stats?.emendas} />
          <StatCard label="Pendências Abertas" value={stats?.pendencias} />
        </div>

        {error && <p className="text-red text-center">Erro ao carregar estatísticas: {error.message}</p>}

        {/* Gestão de Equipe */}
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-muted mb-2">Gestão de Equipe (Usuários)</p>
          <div className="p-4 bg-surface2 rounded-lg">
            <UserManagement 
              perfis={(perfis as any) || []} 
              municipios={municipios || []} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna da Esquerda: Cidades e Aprovações */}
          <div className="md:col-span-1 space-y-6">
            {/* Lista de Cidades */}
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-muted mb-2">Municípios Ativos</p>
              <div className="bg-surface2 rounded-lg border border-border overflow-hidden">
                {municipios && municipios.length > 0 ? (
                  <ul className="divide-y divide-border max-h-[400px] overflow-y-auto">
                    {municipios.map((mun: any) => (
                      <li key={mun.id}>
                        <a 
                          href={`/assessoria/municipio/${mun.id}`} 
                          className="flex items-center justify-between p-3 hover:bg-surface3 transition-colors group"
                        >
                          <span className="text-text font-medium">{mun.nome}</span>
                          <span className="text-accent text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            Gerenciar <span className="text-lg leading-none">→</span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-muted text-sm py-4">Nenhum município cadastrado.</p>
                )}
              </div>
            </div>
          </div>

          {/* Coluna Central/Direita: Fila de Aprovação */}
          <div className="md:col-span-2">
            <p className="text-sm font-bold uppercase tracking-wider text-muted mb-2">Contatos para Aprovação</p>
            <div className="p-4 bg-surface2 rounded-lg min-h-[400px]">
              <AprovalQueue />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
