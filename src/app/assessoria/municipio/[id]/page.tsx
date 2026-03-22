import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import GestaoMunicipioClient from '@/components/assessoria/crud/GestaoMunicipioClient'
import { 
  getMunicipioById, getEmendasByMunicipio, getObrasByMunicipio, 
  getEventosByMunicipio, getNotasByMunicipio, getPoliticosByMunicipio, 
  getPendenciasByMunicipio 
} from '@/lib/supabase/api'

export default async function MunicipioAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect('/login');

  const { data: perfil } = await supabase
    .from('perfis')
    .select('role')
    .eq('id', user.id)
    .single();
    
  if (perfil?.role !== 'assessoria') redirect('/');

  const [
    municipioRes,
    emendasRes,
    obrasRes,
    eventosRes,
    notasRes,
    politicosRes,
    pendenciasRes
  ] = await Promise.all([
    getMunicipioById(id),
    getEmendasByMunicipio(id),
    getObrasByMunicipio(id),
    getEventosByMunicipio(id),
    getNotasByMunicipio(id),
    getPoliticosByMunicipio(id),
    getPendenciasByMunicipio(id)
  ]);

  if (!municipioRes.data) {
    return <div className="p-8 text-center text-red">Município não encontrado.</div>;
  }

  const initialData = {
    emendas: emendasRes.data || [],
    obras: obrasRes.data || [],
    eventos: eventosRes.data || [],
    notas: notasRes.data || [],
    politicos: politicosRes.data || [],
    pendencias: pendenciasRes.data || [],
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 animate-fadeIn pb-20">
      <Link href="/" className="text-muted hover:text-accent mb-6 inline-flex items-center gap-2 transition-colors">
        <span>←</span> Voltar para o Painel
      </Link>
      
      <div className="bg-surface p-6 rounded-xl mb-6 shadow-sm border border-border">
        <p className="text-xs uppercase tracking-widest text-accent font-bold mb-1">Gestão de Dados do CRM</p>
        <h1 className="text-3xl font-display text-text">{municipioRes.data.nome}</h1>
      </div>

      <GestaoMunicipioClient municipioId={id} initialData={initialData} />
    </div>
  )
}
