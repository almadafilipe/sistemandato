import { Municipio } from "@/lib/types";
import CityCard from "./CityCard";

interface CityGridProps {
  municipios: Municipio[];
}

export default function CityGrid({ municipios }: CityGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {municipios.map((municipio, index) => (
        <CityCard 
          key={municipio.id}
          municipio={municipio}
          // Destaque o primeiro para variar o layout
          isFeatured={index === 0} 
        />
      ))}
    </div>
  );
}
