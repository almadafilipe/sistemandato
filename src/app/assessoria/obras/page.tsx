import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
export const runtime = 'edge'
import MainLayout from '@/components/layout/MainLayout'
import { getTodasObras } from '@/lib/supabase/api'
import { Hammer, MapPin, Activity } from 'lucide-react'

export default async function GlobalObrasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect('/login');

  const { data: perfil } = await supabase
    .from('perfis')
    .select('id, role, nome')
    .eq('id', user.id)
    .single();
    
  if (perfil?.role !== 'assessoria') redirect('/');

  const { data: obras, error } = await getTodasObras();

  return (
    <MainLayout 
      role={perfil.role} 
      userName={perfil.nome} 
      activePath="/assessoria/obras"
    >
      <div className="w-full space-y-12 animate-fadeIn pb-32">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-10 bg-accent rounded-full shadow-[0_0_15px_rgba(227,6,19,0.5)]"></div>
              <p className="vibe-stat-label mt-0! uppercase tracking-[0.4em]">Infraestrutura e Progresso</p>
            </div>
            <h1 className="text-7xl font-display text-accent tracking-tight leading-none italic">
              Obras do <span className="text-accent underline decoration-accent/10 underline-offset-8">Governo</span>
            </h1>
            <p className="text-xl text-muted/60 max-w-2xl font-medium">Acompanhamento em tempo real de todas as intervenções financiadas pelo mandato.</p>
          </div>
        </div>

        {error ? (
          <div className="vibe-card p-12 text-center text-accent font-bold border-accent/20">
            Erro ao carregar o portfólio de obras: {error.message}
          </div>
        ) : !obras || obras.length === 0 ? (
          <div className="vibe-card p-20 text-center border-dashed border-white/10">
            <Hammer className="w-16 h-16 text-muted/20 mx-auto mb-6" />
            <p className="text-xl text-muted font-medium">Nenhuma obra cadastrada.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {obras.map((obra: any) => (
              <div key={obra.id} className="vibe-card p-8 group hover:border-accent/40 transition-all duration-500 relative overflow-hidden">
                <div className="flex flex-col h-full gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-accent/10 border border-accent/20">
                        <MapPin className="w-4 h-4 text-accent" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-accent">
                        {obra.municipios?.nome || 'Território Geral'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                        <Activity className="w-3 h-3 text-accent animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-tighter text-accent">{obra.status}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-3xl font-display text-text mb-3 group-hover:text-accent transition-colors">
                      {obra.titulo}
                    </h3>
                    <p className="text-muted/60 text-base leading-relaxed line-clamp-3 font-medium">
                      {obra.descricao || 'Detalhes da obra em fase de atualização.'}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-muted/40 uppercase tracking-widest mb-1">Previsão Conclusão</p>
                        <p className="text-sm font-bold text-text">
                            {obra.previsao_conclusao ? new Date(obra.previsao_conclusao).toLocaleDateString('pt-BR') : 'A definir'}
                        </p>
                    </div>
                    <button className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest transition-all">
                        Ver Detalhes →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
