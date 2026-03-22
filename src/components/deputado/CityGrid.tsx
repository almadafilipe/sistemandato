import { Municipio } from "@/lib/types";
import CityCard from "./CityCard";

interface CityGridProps {
  municipios: Municipio[];
}

export default function CityGrid({ municipios }: CityGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {municipios.map((municipio, index) => (
        <CityCard 
          key={municipio.id}
          municipio={municipio}
          // Lógica de destaque provisória: destaca o primeiro item
          isFeatured={index === 0} 
        />
      ))}
    </div>
  );
}
