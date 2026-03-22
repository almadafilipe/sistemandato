import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
export const runtime = 'edge'
import MainLayout from '@/components/layout/MainLayout'
import AprovalQueue from '@/components/assessoria/AprovalQueue'
import { ShieldAlert } from 'lucide-react'

export default async function GlobalAprovacaoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect('/login');

  const { data: perfil } = await supabase
    .from('perfis')
    .select('id, role, nome')
    .eq('id', user.id)
    .single();
    
  if (perfil?.role !== 'assessoria') redirect('/');

  return (
    <MainLayout 
      role={perfil.role} 
      userName={perfil.nome} 
      activePath="/assessoria/aprovacao"
    >
      <div className="w-full space-y-12 animate-fadeIn pb-32">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-10 bg-accent rounded-full shadow-[0_0_15px_rgba(227,6,19,0.2)]"></div>
              <p className="vibe-stat-label mt-0! uppercase tracking-[0.4em]">Filtro de Inteligência</p>
            </div>
            <h1 className="text-7xl font-display text-text tracking-tight leading-none italic">
              Central de <span className="text-accent underline decoration-black/10 underline-offset-8">Aprovações</span>
            </h1>
            <p className="text-xl text-muted/60 max-w-2xl font-medium">Valide as informações e lideranças vindas do campo antes da integração oficial.</p>
          </div>
          
          <div className="vibe-card p-6! bg-accent/5 border-accent/20 flex items-center gap-6">
             <ShieldAlert className="w-10 h-10 text-accent" />
             <div>
                <p className="text-lg font-black text-text leading-none mb-1">Nível de Segurança</p>
                <p className="text-xs text-muted/60 font-medium font-mono">ENCRYPTED_AUTH_ACTIVE</p>
             </div>
          </div>
        </div>

        <div className="vibe-card p-12! border-black/5 bg-black/2 min-h-[700px]">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-10 px-4">
               <div className="w-3 h-3 rounded-full bg-accent animate-ping shadow-[0_0_10px_rgba(227,6,19,0.3)]"></div>
               <h2 className="text-2xl font-display text-text italic">Fila de Processamento em Tempo Real</h2>
            </div>
            <AprovalQueue />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
