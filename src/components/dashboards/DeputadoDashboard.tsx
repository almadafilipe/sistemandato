import { getMunicipios } from "@/lib/supabase/api";
import CityDetailView from "../deputado/CityDetailView";
import PromoteToAdminButton from "../assessoria/PromoteToAdminButton";
import CitySection from "../deputado/CitySection";
import { Municipio } from "@/lib/types";

interface DeputadoDashboardProps {
  searchParams: Promise<{
    ver_municipio?: string;
  }>;
}

export default async function DeputadoDashboard({ searchParams }: DeputadoDashboardProps) {
  const resolvedSearchParams = await searchParams;
  const municipioId = resolvedSearchParams.ver_municipio;

  if (municipioId) {
    return <CityDetailView municipioId={municipioId} />;
  }

  const { data: municipios, error } = await getMunicipios();

  if (error) {
    return (
      <div className="vibe-card border-accent/20 text-center py-12">
        <p className="text-accent font-black text-xl mb-2 italic">Atenção Estratégica</p>
        <p className="text-muted font-medium">Ocorreu um erro ao carregar os dados dos municípios.</p>
        <p className="text-sm text-muted/40 mt-1">{error.message}</p>
      </div>
    );
  }

  if (!municipios || (municipios as Municipio[]).length === 0) {
    return (
      <div className="vibe-card text-center py-20 border-dashed border-black/10">
        <p className="text-2xl text-muted font-black mb-4 italic">Nenhum município monitorado.</p>
        <p className="text-sm text-muted/60 mb-8 max-w-sm mx-auto">A assessoria precisa cadastrar os municípios estratégicos para o mandato.</p>
        <div className="max-w-xs mx-auto">
          <PromoteToAdminButton />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-20 animate-fadeIn">
      <CitySection initialMunicipios={municipios as Municipio[]} />
    </div>
  );
}
