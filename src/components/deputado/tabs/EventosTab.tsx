import { Evento } from "@/lib/types";
import { Calendar, MapPin, Tag } from "lucide-react";

interface EventosTabProps {
  data: Evento[] | null;
}

const formatDateTime = (dateString: string | null | undefined) => {
  if (!dateString) return 'Data não definida';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', { 
    dateStyle: 'short', 
    timeStyle: 'short'
  }).format(date);
};

export default function EventosTab({ data }: EventosTabProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-muted py-8 text-center animate-fadeIn">
        <Calendar className="w-8 h-8 opacity-50 mb-2" />
        <p>Nenhum evento registrado nesta região.</p>
      </div>
    );
  }

  // Ordena os eventos: os mais próximos / futuros primeiro, ou simplesmente deixa pela data
  const sortedData = [...data].sort((a, b) => {
    if (!a.data_hora) return 1;
    if (!b.data_hora) return -1;
    return new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime();
  });

  return (
    <div className="px-4 py-2 space-y-4 animate-fadeIn">
      {sortedData.map(evento => {
        const isPast = evento.data_hora ? new Date(evento.data_hora) < new Date() : false;
        
        return (
          <div key={evento.id} className={`bg-surface2 p-4 rounded-xl border border-border shadow-sm transition-all hover:bg-surface3 ${isPast ? 'opacity-70' : ''}`}>
            
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className={`font-semibold text-lg leading-tight ${isPast ? 'text-muted' : 'text-text'}`}>
                  {evento.titulo}
                </h3>
                {evento.descricao && (
                  <p className="text-sm text-muted mt-1.5 leading-relaxed line-clamp-2">
                    {evento.descricao}
                  </p>
                )}
              </div>
              <div className="shrink-0 text-right">
                 <p className={`text-xs font-bold uppercase tracking-wider ${isPast ? 'text-muted' : 'text-accent'}`}>
                   {isPast ? 'Realizado' : 'Previsto'}
                 </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap gap-y-2 gap-x-4">
              <div className="flex items-center text-sm text-text">
                <Calendar className="w-4 h-4 mr-1.5 text-accent" />
                <span className="font-medium">{formatDateTime(evento.data_hora)}</span>
              </div>
              
              {evento.local && (
                <div className="flex items-center text-sm text-text">
                  <MapPin className="w-4 h-4 mr-1.5 text-orange-500" />
                  <span className="truncate max-w-[150px]">{evento.local}</span>
                </div>
              )}
              
              {evento.tipo && (
                <div className="flex items-center text-xs text-muted font-semibold tracking-wide uppercase">
                  <Tag className="w-3.5 h-3.5 mr-1 text-purple" />
                  {evento.tipo}
                </div>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
}
