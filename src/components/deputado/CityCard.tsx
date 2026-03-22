import { Municipio } from "@/lib/types";
import Link from "next/link";

// Props podem ser expandidas no futuro para incluir contagens
interface CityCardProps {
  municipio: Municipio;
  isFeatured?: boolean;
}

export default function CityCard({ municipio, isFeatured = false }: CityCardProps) {
  const cardClasses = [
    "city-card group block bg-surface border border-border rounded-lg p-4 transition-all duration-200 relative overflow-hidden",
    "hover:border-border2 hover:-translate-y-px",
    isFeatured ? "col-span-2 bg-surface2 border-accent/30" : "col-span-1"
  ].join(' ');

  return (
    <Link href={`/?ver_municipio=${municipio.id}`} className={cardClasses}>
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-accent ${isFeatured ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
      
      {isFeatured && (
        <div className="city-badge text-xs font-bold uppercase tracking-wider text-accent mb-1.5">
          📍 Próxima visita · 24 mar
        </div>
      )}

      <h3 className={`city-name font-display text-text ${isFeatured ? 'text-2xl' : 'text-xl'}`}>
        {municipio.nome}
      </h3>

      <div className="city-meta flex flex-wrap gap-2 mt-2">
        {/* Pills de contagem serão adicionadas aqui */}
        <span className="city-pill text-xs text-muted bg-white/5 py-0.5 px-2 rounded-full">
          {Math.floor(Math.random() * 50) + 1} contatos
        </span>
        <span className="city-pill text-xs text-muted bg-white/5 py-0.5 px-2 rounded-full">
          {Math.floor(Math.random() * 5)} emendas
        </span>
      </div>
    </Link>
  );
}
