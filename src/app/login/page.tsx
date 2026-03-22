import { headers } from "next/headers";
import { logIn, signUp } from "./actions";
export const runtime = 'edge'

export default async function LoginPage() {
  const searchParams = new URLSearchParams((await headers()).get("x-search-params") || "");
  const message = searchParams.get("message");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden p-4">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px] animate-float mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue/5 blur-[120px] animate-float mix-blend-screen pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] rounded-full bg-purple/5 blur-[100px] animate-float mix-blend-screen pointer-events-none" style={{ animationDelay: '4s' }} />

      <div className="w-full max-w-md p-10 space-y-8 glass rounded-[24px] relative z-10 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 mb-4 shadow-inner">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m22 4v-4m-9-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v8m18 8H3" />
            </svg>
          </div>
          <h1 className="text-4xl font-display text-transparent bg-clip-text bg-gradient-to-b from-text to-text/70">
            Dossiê Municipal
          </h1>
          <p className="text-sm text-muted">Inteligência Política e Gestão de Contatos</p>
        </div>
        
        <form className="space-y-5">
          <div className="space-y-1">
            <label htmlFor="email" className="text-[13px] font-semibold tracking-wide text-muted/80 uppercase ml-1">Email Cadastrado</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="block w-full px-4 py-3.5 glass-input rounded-xl text-text placeholder-muted focus:ring-accent transition-all duration-300"
              placeholder="seu@email.com"
            />
          </div>
          
          <div className="space-y-1">
            <label htmlFor="password" className="text-[13px] font-semibold tracking-wide text-muted/80 uppercase ml-1">Senha Estratégica</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="block w-full px-4 py-3.5 glass-input rounded-xl text-text placeholder-muted focus:ring-accent transition-all duration-300"
              placeholder="••••••••"
            />
          </div>
          
          <div className="pt-4 flex flex-col space-y-3">
            <button 
              formAction={logIn}
              className="relative overflow-hidden group w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-[#0a0c10] bg-gradient-to-r from-accent to-[#e0c266] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Acessar Plataforma
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </span>
            </button>
            <button 
              formAction={signUp}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-medium text-muted bg-transparent border border-border hover:border-border2 hover:bg-surface2/30 hover:text-text transition-all duration-300"
            >
              Solicitar Acesso (Dev)
            </button>
          </div>
        </form>

        {message && (
          <div className="p-3 mt-4 text-sm font-medium text-red text-center bg-red/10 border border-red/20 rounded-lg animate-fade-in">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
