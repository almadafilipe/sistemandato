import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
export const runtime = 'edge'
import MainLayout from '@/components/layout/MainLayout'
import { getTodosContatos } from '@/lib/supabase/api'
import { Users, MapPin, Contact2, Phone } from 'lucide-react'

export default async function GlobalContatosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect('/login');

  const { data: perfil } = await supabase
    .from('perfis')
    .select('id, role, nome')
    .eq('id', user.id)
    .single();
    
  if (perfil?.role !== 'assessoria') redirect('/');

  const { data: contatos, error } = await getTodosContatos();

  return (
    <MainLayout 
      role={perfil.role} 
      userName={perfil.nome} 
      activePath="/assessoria/contatos"
    >
      <div className="w-full space-y-12 animate-fadeIn pb-32">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-10 bg-accent rounded-full shadow-[0_0_15px_rgba(227,6,19,0.2)]"></div>
              <p className="vibe-stat-label mt-0! uppercase tracking-[0.4em]">Relações e Lideranças</p>
            </div>
            <h1 className="text-7xl font-display text-text tracking-tight leading-none italic">
              Rede de <span className="text-accent underline decoration-black/10 underline-offset-8">Contatos</span>
            </h1>
            <p className="text-xl text-muted/60 max-w-2xl font-medium">Gestão consolidada de toda a militância e lideranças do estado.</p>
          </div>
        </div>

        {error ? (
          <div className="vibe-card p-12 text-center text-accent font-bold border-accent/20">
            Erro ao listar rede de contatos: {error.message}
          </div>
        ) : !contatos || contatos.length === 0 ? (
          <div className="vibe-card p-20 text-center border-dashed border-black/10">
            <Users className="w-16 h-16 text-muted/20 mx-auto mb-6" />
            <p className="text-xl text-muted font-black">Nenhum contato estratégico aprovado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contatos.map((contato: any) => (
              <div key={contato.id} className="vibe-card p-8 group hover:border-accent/40 transition-all duration-500 flex flex-col justify-between gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-all scale-150 rotate-12">
                   <Contact2 className="w-24 h-24 text-accent" />
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all shadow-inner border border-black/5">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent leading-none mb-1">Liderança</p>
                      <h3 className="text-xl font-black text-text transition-colors group-hover:text-accent truncate max-w-[180px]">
                        {contato.nome}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-black/5 border border-black/5 group-hover:border-accent/10 transition-all">
                       <MapPin className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
                       <div>
                          <p className="text-[10px] font-bold text-muted/40 uppercase tracking-widest leading-none mb-1">Município de Atuação</p>
                          <p className="text-sm font-black text-text">{contato.municipios?.nome || 'Base Geral'}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-black/5 border border-black/5 group-hover:border-accent/10 transition-all">
                       <Phone className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
                       <div>
                          <p className="text-[10px] font-bold text-muted/40 uppercase tracking-widest leading-none mb-1">Linha Direta</p>
                          <p className="text-sm font-black text-text">{contato.telefone || '(00) 00000-0000'}</p>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-black/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-muted/40 uppercase tracking-widest">Enviado por</span>
                    <span className="text-[10px] font-black text-muted uppercase">{contato.perfis?.nome || 'Sistema'}</span>
                  </div>
                  <button className="px-5 py-2 rounded-xl bg-accent text-white text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-accent-hover transition-all active:scale-95">
                    Perfil Completo
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
