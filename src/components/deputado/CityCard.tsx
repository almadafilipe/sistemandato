import { Municipio } from "@/lib/types";
import Link from "next/link";
import { Users, FileSignature, MapPin } from "lucide-react";

interface CityCardProps {
  municipio: Municipio;
  isFeatured?: boolean;
}

export default function CityCard({ municipio, isFeatured = false }: CityCardProps) {
  return (
    <Link 
      href={`/?ver_municipio=${municipio.id}`} 
      className={`vibe-card group relative overflow-hidden flex flex-col justify-between min-h-[160px] ${isFeatured ? 'lg:col-span-2 border-accent/30 bg-accent/5' : ''}`}
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          <div className="p-2 rounded-lg bg-white/5 text-accent">
            <MapPin className="w-5 h-5" />
          </div>
          {isFeatured && (
            <span className="text-[10px] font-bold uppercase tracking-widest bg-accent text-bg px-2 py-0.5 rounded-md">
              Destaque
            </span>
          )}
        </div>

        <h3 className="font-display text-2xl text-text group-hover:text-accent transition-colors">
          {municipio.nome}
        </h3>
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5 relative z-10">
        <div className="flex items-center gap-1.5 text-muted group-hover:text-text transition-colors">
          <Users className="w-3.5 h-3.5" />
          <span className="text-xs font-black">{municipio.contatos?.[0]?.count || 0}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted group-hover:text-text transition-colors">
          <FileSignature className="w-3.5 h-3.5" />
          <span className="text-xs font-black">{municipio.emendas?.[0]?.count || 0} emendas</span>
        </div>
      </div>

      {/* Decorative Gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-accent/10 transition-all duration-500"></div>
    </Link>
  );
}
