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
    <div className="w-full max-w-lg mx-auto animate-fadeIn">
      {/* Cabeçalho */}
      <div className="p-6 rounded-lg bg-surface mb-4">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors mb-4">
          <span>←</span>
          Voltar para todos os municípios
        </Link>
        <h1 className="text-3xl font-display text-text">
          {municipio.nome}
        </h1>
        <p className="text-sm text-muted">
          Dossiê atualizado em {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>

      {/* Componente de Abas */}
      <div className="rounded-lg bg-surface border border-border">
        <TabSwitcher data={allData} />
      </div>
    </div>
  );
}
