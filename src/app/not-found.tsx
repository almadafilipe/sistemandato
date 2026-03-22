'use client';

import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#ebe5b2] flex items-center justify-center p-6 font-sans text-[#1a1a1a]">
      <div className="max-w-xl w-full text-center space-y-8 animate-fadeIn">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full"></div>
          <ShieldAlert className="w-32 h-32 text-accent relative mx-auto drop-shadow-2xl" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-8xl font-display italic tracking-tighter leading-none">
            404
          </h1>
          <h2 className="text-3xl font-display italic text-accent underline decoration-black/10 underline-offset-8">
            Rota Extraviada
          </h2>
          <p className="text-lg text-muted/60 font-medium max-w-sm mx-auto">
            Este caminho não consta em nossos registros estratégicos. Por favor, retorne à base.
          </p>
        </div>

        <div className="pt-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-3 px-10 py-4 bg-accent text-white font-black uppercase tracking-widest rounded-2xl shadow-[0_10px_30px_rgba(227,6,19,0.3)] hover:bg-accent-hover transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao Dashboard
          </Link>
        </div>

        <div className="pt-12 border-t border-black/5 opacity-30">
          <p className="text-[10px] font-black uppercase tracking-[0.4em]">Mandato Digital • Vibe Tradicional</p>
        </div>
      </div>
    </div>
  );
}
