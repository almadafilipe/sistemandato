import { headers } from "next/headers";
import { logIn, signUp } from "./actions";
export const runtime = 'edge'

export default async function LoginPage() {
  const searchParams = new URLSearchParams((await headers()).get("x-search-params") || "");
  const message = searchParams.get("message");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-bg p-6">
      {/* Background Decorativo Partidário */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-accent/5 blur-[150px] animate-float pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-black/3 blur-[120px] animate-float pointer-events-none delay-[3s]" />
      
      {/* Estrela Sutil no Fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none select-none">
        <svg width="600" height="600" viewBox="0 0 24 24" fill="var(--color-accent)">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>

      <div className="w-full max-w-[500px] relative z-10 animate-fade-in">
        {/* Logo/Header Espaçoso */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-accent shadow-[0_0_50px_rgba(227,6,19,0.3)] mb-8 transition-transform hover:scale-105 duration-500">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h1 className="text-5xl font-display text-text mb-3 tracking-tight">
            Plataforma <span className="text-accent italic">Mandato</span>
          </h1>
        </div>

        {/* Card de Login Moderno */}
        <div className="vibe-card p-12! border-black/5">
          <form method="POST" className="space-y-8">
            <div className="space-y-3">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-[0.2em] text-accent ml-1">Credencial de Acesso</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full px-6 py-5 glass-input rounded-2xl text-text placeholder-muted/50 focus:ring-accent transition-all duration-300 text-lg"
                placeholder="seu@email.com"
              />
            </div>
            
            <div className="space-y-3">
              <label htmlFor="password" className="text-xs font-bold uppercase tracking-[0.2em] text-accent ml-1">Senha Estratégica</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full px-6 py-5 glass-input rounded-2xl text-text placeholder-muted/50 focus:ring-accent transition-all duration-300 text-lg"
                placeholder="••••••••"
              />
            </div>
            
            <div className="pt-6 flex flex-col space-y-4">
              <button 
                formAction={logIn}
                className="relative overflow-hidden group w-full py-5 px-6 rounded-2xl text-lg font-bold text-white bg-accent hover:bg-accent-hover transition-all duration-500 shadow-[0_10px_30px_rgba(227,6,19,0.3)] active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Entrar no Sistema
                  <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
              
              <button 
                formAction={signUp}
                className="w-full py-5 px-6 rounded-2xl text-sm font-black uppercase tracking-widest text-muted border border-black/5 hover:border-accent/40 hover:text-accent hover:bg-black/5 transition-all duration-300"
              >
                Solicitar Novo Credenciamento
              </button>
            </div>
          </form>

          {message && (
            <div className="p-4 mt-8 text-sm font-bold text-accent text-center bg-accent/10 border border-accent/20 rounded-2xl animate-fade-in">
              {message}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
