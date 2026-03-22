import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
export const runtime = 'edge'
import MainLayout from '@/components/layout/MainLayout'
import { getTodosEventos } from '@/lib/supabase/api'
import { Calendar, MapPin, Clock } from 'lucide-react'

export default async function GlobalEventosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect('/login');

  const { data: perfil } = await supabase
    .from('perfis')
    .select('id, role, nome')
    .eq('id', user.id)
    .single();
    
  if (perfil?.role !== 'assessoria') redirect('/');

  const { data: eventos, error } = await getTodosEventos();

  return (
    <MainLayout 
      role={perfil.role} 
      userName={perfil.nome} 
      activePath="/assessoria/eventos"
    >
      <div className="w-full space-y-12 animate-fadeIn pb-32">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-10 bg-accent rounded-full shadow-[0_0_15px_rgba(227,6,19,0.5)]"></div>
              <p className="vibe-stat-label mt-0! uppercase tracking-[0.4em]">Agenda de Mobilização</p>
            </div>
            <h1 className="text-7xl font-display text-accent tracking-tight leading-none italic">
              Eventos & <span className="text-accent underline decoration-accent/10 underline-offset-8">Atos</span>
            </h1>
            <p className="text-xl text-muted/60 max-w-2xl font-medium">Cronograma de eventos políticos, reuniões e festividades populares.</p>
          </div>
        </div>

        {error ? (
          <div className="vibe-card p-12 text-center text-accent font-bold border-accent/20">
            Erro ao carregar a agenda de eventos: {error.message}
          </div>
        ) : !eventos || eventos.length === 0 ? (
          <div className="vibe-card p-20 text-center border-dashed border-white/10">
            <Calendar className="w-16 h-16 text-muted/20 mx-auto mb-6" />
            <p className="text-xl text-muted font-medium">Nenhum evento agendado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventos.map((evento: any) => (
              <div key={evento.id} className="vibe-card p-8 group hover:border-accent/40 transition-all duration-500 flex flex-col justify-between gap-8">
                <div>
                   <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-accent" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-accent">
                          {evento.data_hora ? new Date(evento.data_hora).toLocaleDateString('pt-BR') : 'Data Indefinida'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted" />
                        <span className="text-[10px] font-bold text-muted uppercase">
                          {evento.data_hora ? new Date(evento.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'H/R'}
                        </span>
                      </div>
                   </div>

                   <h3 className="text-2xl font-bold text-text mb-4 leading-tight group-hover:text-accent transition-colors">
                     {evento.titulo}
                   </h3>
                   
                   <div className="p-4 rounded-2xl bg-white/5 border border-white/5 mb-4 group-hover:border-accent/20 transition-all">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-accent" />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-accent leading-none mb-1">Local</p>
                          <p className="text-sm font-bold text-text leading-tight">
                            {evento.local || 'Local não definido'}
                            <span className="block text-[10px] text-muted font-medium mt-1 uppercase italic">
                              {evento.municipios?.nome || 'Município Geral'}
                            </span>
                          </p>
                        </div>
                      </div>
                   </div>

                   <p className="text-muted/60 text-sm leading-relaxed line-clamp-3">
                     {evento.descricao || 'O ato político está sendo organizado com a militância local.'}
                   </p>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <span className="inline-flex px-3 py-1 rounded-lg bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest border border-accent/20">
                    {evento.tipo || 'Evento Geral'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
