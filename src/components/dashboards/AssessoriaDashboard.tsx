import { getAdminDashboardStats, getPerfis, getMunicipios } from "@/lib/supabase/api";
import AprovalQueue from "../assessoria/AprovalQueue";
import UserManagement from "../assessoria/UserManagement";

interface AssessoriaDashboardProps {
  user: {
    id: string;
    email?: string;
  };
}

const StatCard = ({ label, value }: { label: string, value: number | null | undefined }) => (
  <div className="vibe-card flex flex-col items-center justify-center text-center group">
    <p className="vibe-stat-value group-hover:scale-110 transition-transform duration-300">{value ?? '_'}</p>
    <p className="vibe-stat-label">{label}</p>
  </div>
);

export default async function AssessoriaDashboard({ user }: AssessoriaDashboardProps) {
  // Opcional: usar 'user' para log ou saudação personalizada
  console.log("Acessando dashboard admin:", user.id);
  
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
    <div className="w-full space-y-10 animate-fadeIn pb-16">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-12 bg-accent rounded-full shadow-[0_0_20px_rgba(227,6,19,0.2)]"></div>
            <p className="vibe-stat-label mt-0! uppercase tracking-[0.4em]">Gestão Estratégica do Mandato</p>
          </div>
          <h1 className="text-5xl font-display text-text tracking-tight leading-none">
            Painel <span className="text-accent italic">Administrativo</span>
          </h1>
          <p className="text-xl text-muted/60 max-w-3xl font-medium">Controle total sobre municípios, lideranças e emendas. Inteligência política a serviço do povo.</p>
        </div>
      </div>
      
      {/* Stats - Grid Compacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Municípios Ativos" value={stats?.municipios} />
        <StatCard label="Contatos Aprovados" value={stats?.contatos} />
        <StatCard label="Emendas Alocadas" value={stats?.emendas} />
        <StatCard label="Demandas Pendentes" value={stats?.pendencias} />
      </div>

      {error && (
        <div className="vibe-card border-accent/20 text-center py-8">
           <p className="text-accent text-lg font-bold">Atenção: Erro na sincronização de dados</p>
           <p className="text-muted text-sm mt-2">{error.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Coluna Principal: Fila de Aprovação (Inbox Style) */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-2xl font-display text-text flex items-center gap-4">
               Central de Inteligência
               <span className="text-[11px] bg-accent/10 text-accent px-3 py-1 rounded-full font-black tracking-widest border border-accent/10">LIVE</span>
            </h2>
          </div>
          <div className="vibe-card p-10! min-h-[600px] border-black/5">
            <AprovalQueue />
          </div>
        </div>

        {/* Coluna Lateral: Equipe */}
        <div className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-display text-accent px-4">Equipe e Acessos</h2>
            <div className="vibe-card p-4!">
              <UserManagement 
                perfis={(perfis as any[]) || []} 
                municipios={municipios || []} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
