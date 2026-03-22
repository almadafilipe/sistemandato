import { Contato } from "@/lib/types";

interface ContatosTabProps {
  data: Contato[] | null;
}

// Função para pegar as iniciais do nome
const getInitials = (name: string) => {
  if (!name) return '?';
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const avatarColors = ['green', 'blue', 'purple', 'amber'];
const colorMap = new Map<string, string>();

const getAvatarColor = (id: string) => {
  if (!colorMap.has(id)) {
    const color = avatarColors[Math.floor(Math.random() * avatarColors.length)];
    colorMap.set(id, color);
  }
  return colorMap.get(id);
}

export default function ContatosTab({ data }: ContatosTabProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-muted py-10 text-center animate-fadeIn">
        <p className="font-bold opacity-40">Nenhum contato estratégico registrado.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-2 space-y-4 animate-fadeIn">
      {data.map(contato => {
        const avatarColor = getAvatarColor(contato.id);
        const colorClass = `text-${avatarColor}`;
        const bgClass = `bg-${avatarColor}/10`;

        return (
          <div key={contato.id} className="flex items-center gap-4 p-3.5 bg-surface rounded-2xl border border-border hover:border-accent/30 transition-all duration-300 group">
            <div className={`flex-shrink-0 w-12 h-12 rounded-2xl ${bgClass} ${colorClass} flex items-center justify-center font-black text-lg shadow-inner group-hover:scale-110 transition-transform`}>
              {getInitials(contato.nome)}
            </div>
            <div className="flex-grow">
              <p className="font-black text-text text-lg group-hover:text-accent transition-colors">
                {contato.nome}
              </p>
              <p className="text-sm font-bold text-muted/60 tracking-tight">
                {contato.telefone || 'Sem canal de contato'}
              </p>
            </div>
            {contato.tags && contato.tags[0] && (
              <span className="flex-shrink-0 text-[10px] font-black py-1.5 px-4 rounded-full bg-accent/10 text-accent uppercase tracking-widest">
                {contato.tags[0]}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
