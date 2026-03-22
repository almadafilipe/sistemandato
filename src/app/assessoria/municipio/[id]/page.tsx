import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
export const runtime = 'edge'
import Link from 'next/link'
import GestaoMunicipioClient from '@/components/assessoria/crud/GestaoMunicipioClient'
import MainLayout from '@/components/layout/MainLayout'
import { 
  getMunicipioById, getEmendasByMunicipio, getObrasByMunicipio, 
  getEventosByMunicipio, getNotasByMunicipio, getPoliticosByMunicipio, 
  getPendenciasByMunicipio 
} from '@/lib/supabase/api'
import { ChevronLeft } from 'lucide-react'

export default async function MunicipioAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect('/login');

  const { data: perfil } = await supabase
    .from('perfis')
    .select('id, role, nome')
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
    return <div className="p-12 text-center text-accent font-bold text-2xl">Município não encontrado na base estratégica.</div>;
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
    <MainLayout 
      role={perfil.role} 
      userName={perfil.nome} 
      activePath="/assessoria"
    >
      <div className="w-full space-y-12 animate-fadeIn pb-32">
        <Link href="/" className="group inline-flex items-center gap-3 text-muted hover:text-accent transition-all duration-300">
          <div className="p-2 rounded-xl bg-white/5 group-hover:bg-accent/10 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm uppercase tracking-widest">Voltar à Estratégia Geral</span>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-10 bg-accent rounded-full shadow-[0_0_15px_rgba(227,6,19,0.5)]"></div>
              <p className="vibe-stat-label mt-0! uppercase tracking-[0.4em]">Gestão de Território</p>
            </div>
            <h1 className="text-7xl font-display text-accent tracking-tight leading-none italic">
              {municipioRes.data.nome}
            </h1>
            <p className="text-xl text-muted/60 max-w-2xl font-medium">Painel de controle de investimentos e relações políticas locais.</p>
          </div>
        </div>

        <div className="vibe-card p-12! border-white/5 bg-surface/10">
          <GestaoMunicipioClient municipioId={id} initialData={initialData} />
        </div>
      </div>
    </MainLayout>
  )
}
