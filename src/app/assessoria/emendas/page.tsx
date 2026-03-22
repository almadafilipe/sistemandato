import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
export const runtime = 'edge'
import MainLayout from '@/components/layout/MainLayout'
import { getTodasEmendas } from '@/lib/supabase/api'
import { FileSignature, MapPin } from 'lucide-react'

export default async function GlobalEmendasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect('/login');

  const { data: perfil } = await supabase
    .from('perfis')
    .select('id, role, nome')
    .eq('id', user.id)
    .single();
    
  if (perfil?.role !== 'assessoria') redirect('/');

  const { data: emendas, error } = await getTodasEmendas();

  return (
    <MainLayout 
      role={perfil.role} 
      userName={perfil.nome} 
      activePath="/assessoria/emendas"
    >
      <div className="w-full space-y-12 animate-fadeIn pb-32">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-10 bg-accent rounded-full shadow-[0_0_15px_rgba(227,6,19,0.5)]"></div>
              <p className="vibe-stat-label mt-0! uppercase tracking-[0.4em]">Visão Consolidada</p>
            </div>
            <h1 className="text-7xl font-display text-text tracking-tight leading-none italic">
              Emendas <span className="text-accent underline decoration-black/10 underline-offset-8">Parlamentares</span>
            </h1>
            <p className="text-xl text-muted/60 max-w-2xl font-medium">Relatório completo de recursos alocados em todos os municípios do estado.</p>
          </div>
        </div>

        {error ? (
          <div className="vibe-card p-12 text-center text-accent font-bold border-accent/20">
            Erro ao sincronizar dados das emendas: {error.message}
          </div>
        ) : !emendas || emendas.length === 0 ? (
          <div className="vibe-card p-20 text-center border-dashed border-black/10">
            <FileSignature className="w-16 h-16 text-muted/20 mx-auto mb-6" />
            <p className="text-xl text-muted font-black">Nenhuma emenda registrada no sistema.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {emendas.map((emenda: any) => (
              <div key={emenda.id} className="vibe-card p-8 group hover:border-accent/40 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                    <FileSignature className="w-24 h-24 text-accent" />
                </div>
                <div className="flex flex-col h-full justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1.5 rounded-lg bg-accent/10 border border-accent/20">
                        <MapPin className="w-4 h-4 text-accent" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-accent">
                        {emenda.municipios?.nome || 'Município Desconhecido'}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-text mb-2 leading-tight group-hover:text-accent transition-colors">
                      {emenda.titulo}
                    </h3>
                    <p className="text-muted/60 text-sm line-clamp-2 leading-relaxed">
                      {emenda.observacoes || 'Sem observações adicionais.'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-black/5">
                    <div>
                        <p className="text-[10px] font-bold text-muted/40 uppercase tracking-widest mb-1">Valor Alocado</p>
                        <p className="text-lg font-black text-text">
                            {emenda.valor ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(emenda.valor) : 'R$ 0,00'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-muted/40 uppercase tracking-widest mb-1">Status Atual</p>
                        <span className="inline-flex px-3 py-1 rounded-full bg-black/5 text-text text-[10px] font-black uppercase tracking-tighter border border-black/10">
                            {emenda.status}
                        </span>
                    </div>
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
