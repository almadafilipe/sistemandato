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
    return <p className="text-muted text-center py-4">Nenhum contato encontrado.</p>;
  }

  return (
    <div className="px-4">
      {data.map(contato => (
        <div key={contato.id} className="flex items-center gap-3 py-3 border-b border-border last:border-b-0">
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-${getAvatarColor(contato.id)}/10 text-${getAvatarColor(contato.id)}`}>
            {getInitials(contato.nome)}
          </div>
          <div className="flex-grow">
            <p className="font-medium text-text">{contato.nome}</p>
            <p className="text-sm text-muted">{contato.telefone || 'Sem telefone'}</p>
          </div>
          {contato.tags && contato.tags[0] && (
            <span className="flex-shrink-0 text-xs font-semibold py-1 px-3 rounded-full bg-accent/10 text-accent">
              {contato.tags[0]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
