import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DeputadoDashboard from "@/components/dashboards/DeputadoDashboard";
import LiderancaDashboard from '@/components/dashboards/LiderancaDashboard';
import AssessoriaDashboard from '@/components/dashboards/AssessoriaDashboard';

export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedSearchParams = await searchParams;
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch o perfil do usuário da nossa tabela `perfis`
  const { data: perfil, error: perfilError } = await supabase
    .from('perfis')
    .select('id, role, nome, municipio_id')
    .eq('id', user.id)
    .single()

  if (perfilError || !perfil) {
    // Se não encontrar o perfil, pode ser que o trigger ainda não rodou.
    // Damos logout para uma nova tentativa de login.
    console.error("Perfil não encontrado, fazendo logout.", perfilError);
    redirect('/logout')
  }

  const renderDashboard = () => {
    switch (perfil.role) {
      case 'deputado':
        return <DeputadoDashboard searchParams={resolvedSearchParams} />;
      case 'lideranca':
        return <LiderancaDashboard user={user} perfil={perfil} />;
      case 'assessoria':
        return <AssessoriaDashboard user={user} />;
      default:
        redirect('/login?message=Perfil de usuário desconhecido.');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg text-text p-4">
      {renderDashboard()}
    </div>
  )
}
