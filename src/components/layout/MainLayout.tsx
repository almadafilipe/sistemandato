import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  Calendar, 
  Hammer, 
  FileSignature, 
  CheckCircle,
  Bell,
  Search,
  Settings,
  HelpCircle
} from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';

interface MainLayoutProps {
  children: React.ReactNode;
  role?: string;
  userName?: string;
  activePath?: string;
}

export default function MainLayout({ children, role, userName, activePath }: MainLayoutProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { id: 'municipios', label: 'Municípios', icon: MapPin, href: '/assessoria' },
    { id: 'contatos', label: 'Contatos', icon: Users, href: '/assessoria/contatos' },
    { id: 'eventos', label: 'Eventos', icon: Calendar, href: '/assessoria/eventos' },
    { id: 'obras', label: 'Obras', icon: Hammer, href: '/assessoria/obras' },
    { id: 'emendas', label: 'Emendas', icon: FileSignature, href: '/assessoria/emendas' },
    { id: 'aprovacao', label: 'Aprovações', icon: CheckCircle, href: '/assessoria/aprovacao', badge: 0 },
  ];

  return (
    <div className="flex h-screen w-full bg-bg text-text overflow-hidden font-body gap-6 p-6">
      {/* Sidebar */}
      <aside className="w-[220px] vibe-sidebar flex flex-col h-full z-20 shadow-[20px_0_50px_rgba(100,80,0,0.05)]">
        <div className="p-6 pb-4 flex flex-col h-full">
          <div className="flex flex-col gap-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center text-white shadow-[0_0_30px_rgba(227,6,19,0.4)]">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-display leading-tight tracking-tight">SISTEMA</h1>
                <h1 className="text-2xl font-display leading-tight tracking-tight text-accent italic">MANDATO</h1>
              </div>
            </div>
            <div className="h-px w-full bg-black/5 mx-auto"></div>
          </div>

          <nav className="space-y-3 overflow-y-auto custom-scrollbar pr-2 flex-1">
            <p className="px-6 text-[10px] font-bold uppercase tracking-[0.3em] text-muted/40 mb-2">Menu Principal</p>
            {menuItems.map((item) => (
              <Link 
                key={item.id} 
                href={item.href}
                className={`vibe-nav-link ${activePath === item.href ? 'active' : ''}`}
              >
                <item.icon className={`w-6 h-6 ${activePath === item.href ? 'text-white' : 'text-muted'}`} />
                <span className="flex-1 font-bold">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-accent text-[10px] font-bold px-2 py-1 rounded-lg text-white shadow-[0_0_15px_rgba(227,6,19,0.3)]">
                    {item.badge}
                  </span>
                )}
                {activePath === item.href && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]"></div>}
              </Link>
            ))}
          </nav>

          <div className="mt-8 space-y-6">
            <div className="vibe-card p-6! bg-accent/5 border-accent/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2">Suporte Mandato</p>
              <p className="text-xs text-muted/80 leading-relaxed mb-4">Problemas técnicos ou dúvidas sobre os dados?</p>
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-white font-bold text-xs hover:bg-accent-hover transition-all shadow-lg active:scale-95">
                <HelpCircle className="w-4 h-4" />
                Abrir Chamado
              </button>
            </div>
            
            <div className="flex items-center gap-4 px-4 py-4 rounded-3xl bg-black/5 border border-black/5">
              <div className="w-12 h-12 rounded-2xl bg-surface2 border border-border2 flex items-center justify-center text-accent font-bold text-lg shadow-inner">
                {userName?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-black truncate text-text">{userName || 'Usuário'}</p>
                <p className="text-[10px] text-accent font-black truncate uppercase tracking-widest">{role || 'Estrategista'}</p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden glass rounded-[var(--radius)]">
        {/* Topbar */}
        <header className="h-16 flex items-center z-10 bg-bg/40 backdrop-blur-xl border-b border-white/5 px-8">
          <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
            <div className="relative w-[350px] group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-accent transition-colors" />
              <input 
                type="text" 
                placeholder="Pesquisar registros, emendas ou lideranças..." 
                className="w-full pl-12 pr-6 py-2.5 glass-input rounded-2xl text-sm focus:ring-2 focus:ring-accent/40 placeholder:text-muted/40 transition-all outline-none"
              />
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <button className="p-3 rounded-2xl hover:bg-white/5 text-muted relative transition-all" aria-label="Notificações">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-accent rounded-full border-2 border-bg shadow-[0_0_10px_rgba(227,6,19,0.5)]"></span>
                </button>
                <button className="p-3 rounded-2xl hover:bg-white/5 text-muted transition-all" aria-label="Configurações">
                  <Settings className="w-6 h-6" />
                </button>
              </div>
              <div className="h-10 w-px bg-black/5"></div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Localização</p>
                <p className="text-sm font-semibold text-text">Salinas da Margarida, BA</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <section className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto h-min">
            {children}
          </div>
        </section>
      </main>

      {/* Background Decorativo */}
      <div className="fixed top-[-20%] left-[20%] w-[60%] h-[60%] bg-accent/3 blur-[160px] rounded-full -z-10 pointer-events-none animate-float"></div>
      <div className="fixed bottom-[-10%] right-[10%] w-[40%] h-[40%] bg-black/3 blur-[140px] rounded-full -z-10 pointer-events-none animate-float delay-[4s]"></div>
    </div>
  );
}
