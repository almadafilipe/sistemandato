import Link from "next/link";
import {
  getMunicipioById,
  getContatosByMunicipio,
  getPoliticosByMunicipio,
  getEmendasByMunicipio,
  getObrasByMunicipio,
  getEventosByMunicipio,
  getNotasByMunicipio,
  getPendenciasByMunicipio,
} from "@/lib/supabase/api";
import TabSwitcher from "./TabSwitcher";

interface CityDetailViewProps {
  municipioId: string;
}

export default async function CityDetailView({ municipioId }: CityDetailViewProps) {
  
  // Busca todos os dados em paralelo para melhor performance
  const [
    municipioRes,
    contatosRes,
    politicosRes,
    emendasRes,
    obrasRes,
    eventosRes,
    notasRes,
    pendenciasRes,
  ] = await Promise.all([
    getMunicipioById(municipioId),
    getContatosByMunicipio(municipioId),
    getPoliticosByMunicipio(municipioId),
    getEmendasByMunicipio(municipioId),
    getObrasByMunicipio(municipioId),
    getEventosByMunicipio(municipioId),
    getNotasByMunicipio(municipioId),
    getPendenciasByMunicipio(municipioId),
  ]);

  const { data: municipio, error: municipioError } = municipioRes;

  if (municipioError || !municipio) {
    return (
      <div className="text-center text-red p-4">
        <p>Não foi possível carregar os dados do município.</p>
        <Link href="/" className="text-accent hover:underline mt-2 inline-block">Voltar</Link>
      </div>
    );
  }

  const allData = {
    contatos: contatosRes.data,
    politicos: politicosRes.data,
    emendas: emendasRes.data,
    obras: obrasRes.data,
    eventos: eventosRes.data,
    notas: notasRes.data,
    pendencias: pendenciasRes.data,
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Cabeçalho */}
      <div className="vibe-card">
        <Link href="/" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-accent hover:text-accent2 transition-colors mb-4">
          <span className="text-lg leading-none">←</span>
          Voltar para municípios
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display text-text">
              {municipio.nome}
            </h1>
            <p className="text-sm text-muted mt-2 max-w-xl">
              Visão geral estratégica e gestão de demandas para o município de {municipio.nome}. 
              Última atualização em {new Date().toLocaleDateString('pt-BR')}.
            </p>
          </div>
          <div className="flex gap-3">
             <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-center">
                <p className="text-xl font-display text-accent leading-none">{allData.contatos?.length || 0}</p>
                <p className="text-[8px] font-bold uppercase tracking-widest text-muted mt-1">Contatos</p>
             </div>
             <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-center">
                <p className="text-xl font-display text-accent leading-none">{allData.emendas?.length || 0}</p>
                <p className="text-[8px] font-bold uppercase tracking-widest text-muted mt-1">Emendas</p>
             </div>
          </div>
        </div>
      </div>

      {/* Componente de Abas */}
      <div className="vibe-card p-2! overflow-hidden border-border/40 min-h-[600px]">
        <TabSwitcher data={allData} />
      </div>
    </div>
  );
}
