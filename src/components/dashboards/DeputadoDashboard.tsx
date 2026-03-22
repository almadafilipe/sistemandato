import { getMunicipios } from "@/lib/supabase/api";
import LogoutButton from "@/components/LogoutButton";
import CityGrid from "../deputado/CityGrid";
import CityDetailView from "../deputado/CityDetailView";
import PromoteToAdminButton from "../assessoria/PromoteToAdminButton";

interface DeputadoDashboardProps {
  searchParams: {
    ver_municipio?: string;
  };
}

export default async function DeputadoDashboard({ searchParams }: DeputadoDashboardProps) {
  const municipioId = searchParams.ver_municipio;

  if (municipioId) {
    return <CityDetailView municipioId={municipioId} />;
  }

  const { data: municipios, error } = await getMunicipios();

  if (error) {
    return (
      <div className="text-center text-red">
        <p>Ocorreu um erro ao carregar os dados dos municípios.</p>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!municipios || municipios.length === 0) {
    return (
      <div className="text-center text-muted">
        <p>Nenhum município encontrado.</p>
        <p>A assessoria precisa cadastrar os municípios na plataforma.</p>
        <PromoteToAdminButton />
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto animate-fadeIn">
      <div className="p-6 rounded-lg bg-surface mb-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted">Bom dia, Deputado</p>
            <h1 className="text-2xl font-display text-text">
              Sua agenda na <em className="text-accent not-italic">Bahia</em>
            </h1>
          </div>
          <LogoutButton />
        </div>
        <div className="relative mt-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">⌕</span>
          <input 
            type="text" 
            placeholder="Buscar município..." 
            className="w-full pl-10 pr-4 py-2 rounded-md bg-bg border border-border2 focus:border-accent focus:ring-accent"
          />
        </div>
      </div>
      <CityGrid municipios={municipios} />
    </div>
  );
}
