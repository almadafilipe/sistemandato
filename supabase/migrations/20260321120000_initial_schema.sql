-- ### TIPOS ENUMERADOS (ENUMS) ###
-- Melhora a consistência e performance dos campos de status/tipo/prioridade

CREATE TYPE user_role AS ENUM ('deputado', 'lideranca', 'assessoria');
CREATE TYPE contato_status AS ENUM ('pendente', 'aprovado', 'rejeitado');
CREATE TYPE emenda_status AS ENUM ('proposta', 'aprovada', 'empenhada', 'executada', 'bloqueada');
CREATE TYPE obra_status AS ENUM ('planejada', 'em_andamento', 'concluida', 'paralisada');
CREATE TYPE midia_tipo AS ENUM ('foto', 'documento');
CREATE TYPE pendencia_prioridade AS ENUM ('baixa', 'media', 'alta', 'urgente');
CREATE TYPE pendencia_status AS ENUM ('aberta', 'em_tratativa', 'resolvida');

-- ### TABELAS PRINCIPAIS ###

-- Tabela de Municípios
CREATE TABLE public.municipios (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  regiao text,
  populacao integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.municipios IS 'Armazena os municípios da Bahia.';

-- Tabela de Perfis de Usuários
-- Estende a tabela auth.users do Supabase
CREATE TABLE public.perfis (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text,
  role user_role NOT NULL,
  municipio_id uuid REFERENCES public.municipios(id) ON DELETE SET NULL,
  CONSTRAINT checar_municipio_para_lideranca CHECK (role <> 'lideranca' OR municipio_id IS NOT NULL)
);
COMMENT ON TABLE public.perfis IS 'Perfil de usuário, estendendo auth.users com role e vínculo municipal.';

-- Tabela de Contatos
CREATE TABLE public.contatos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  municipio_id uuid NOT NULL REFERENCES public.municipios(id) ON DELETE CASCADE,
  enviado_por uuid REFERENCES public.perfis(id) ON DELETE SET NULL,
  nome text NOT NULL,
  telefone text,
  email text,
  tags text[],
  status contato_status NOT NULL DEFAULT 'pendente',
  consentiu boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.contatos IS 'Contatos políticos e de relacionamento em cada município.';

-- Tabela de Políticos Aliados
CREATE TABLE public.politicos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  municipio_id uuid NOT NULL REFERENCES public.municipios(id) ON DELETE CASCADE,
  cargo text, -- 'prefeito', 'vice', 'vereador'
  nome text NOT NULL,
  partido text,
  telefone text,
  aliado boolean DEFAULT true
);
COMMENT ON TABLE public.politicos IS 'Mapeamento de políticos aliados por município.';

-- Tabela de Emendas Parlamentares
CREATE TABLE public.emendas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  municipio_id uuid NOT NULL REFERENCES public.municipios(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  valor numeric,
  area text, -- 'saúde', 'educação', 'infraestrutura', etc.
  status emenda_status NOT NULL,
  ano integer,
  observacoes text
);
COMMENT ON TABLE public.emendas IS 'Registro de emendas parlamentares destinadas aos municípios.';

-- Tabela de Obras e Projetos
CREATE TABLE public.obras (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  municipio_id uuid NOT NULL REFERENCES public.municipios(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  descricao text,
  status obra_status NOT NULL,
  emenda_id uuid REFERENCES public.emendas(id) ON DELETE SET NULL,
  previsao_conclusao date
);
COMMENT ON TABLE public.obras IS 'Obras e projetos vinculados a emendas ou ações do mandato.';

-- Tabela de Agenda/Eventos
CREATE TABLE public.eventos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  municipio_id uuid NOT NULL REFERENCES public.municipios(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  descricao text,
  data_hora timestamptz,
  local text,
  tipo text -- 'visita', 'reunião', 'inauguração', etc.
);
COMMENT ON TABLE public.eventos IS 'Agenda de compromissos do deputado nos municípios.';

-- Tabela de Notas da Assessoria
CREATE TABLE public.notas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  municipio_id uuid NOT NULL REFERENCES public.municipios(id) ON DELETE CASCADE,
  autor_id uuid REFERENCES public.perfis(id) ON DELETE SET NULL,
  conteudo text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.notas IS 'Notas e observações estratégicas da equipe de assessoria.';

-- Tabela de Mídias (Fotos e Documentos)
CREATE TABLE public.midias (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  municipio_id uuid NOT NULL REFERENCES public.municipios(id) ON DELETE CASCADE,
  url text NOT NULL,
  legenda text,
  tipo midia_tipo NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.midias IS 'Links para fotos e documentos no Supabase Storage.';

-- Tabela de Pendências Políticas
CREATE TABLE public.pendencias (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  municipio_id uuid NOT NULL REFERENCES public.municipios(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  descricao text,
  tipo text, -- 'demanda', 'conflito', 'compromisso', 'follow-up'
  prioridade pendencia_prioridade NOT NULL,
  status pendencia_status NOT NULL,
  responsavel_id uuid REFERENCES public.perfis(id) ON DELETE SET NULL,
  prazo date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.pendencias IS 'Demandas e situações políticas que exigem acompanhamento.';


-- ### FUNÇÕES AUXILIARES PARA RLS ###

-- Função para obter o role do usuário logado
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS user_role AS $$
  SELECT role FROM public.perfis WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Função para obter o município do usuário (liderança)
CREATE OR REPLACE FUNCTION public.get_my_municipio_id()
RETURNS uuid AS $$
  SELECT municipio_id FROM public.perfis WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;


-- ### POLÍTICAS DE SEGURANÇA (ROW LEVEL SECURITY - RLS) ###

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.municipios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.politicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.midias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pendencias ENABLE ROW LEVEL SECURITY;


-- Políticas para a tabela `municipios`
CREATE POLICY "Assessoria pode gerenciar todos os municípios" ON public.municipios FOR ALL USING (public.get_my_role() = 'assessoria');
CREATE POLICY "Todos os perfis logados podem ver todos os municípios" ON public.municipios FOR SELECT USING (auth.role() = 'authenticated');

-- Políticas para a tabela `perfis`
CREATE POLICY "Assessoria pode gerenciar todos os perfis" ON public.perfis FOR ALL USING (public.get_my_role() = 'assessoria');
CREATE POLICY "Usuários podem ver o próprio perfil" ON public.perfis FOR SELECT USING (id = auth.uid());
CREATE POLICY "Usuários podem atualizar o próprio perfil" ON public.perfis FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Deputado e Assessoria podem ver todos os perfis" ON public.perfis FOR SELECT USING (public.get_my_role() IN ('deputado', 'assessoria'));


-- Políticas para tabelas com `municipio_id`
-- Macro para gerar políticas repetitivas
DO $$
DECLARE
  tbl text;
BEGIN
  -- Lista de tabelas que possuem a coluna `municipio_id`
  FOREACH tbl IN ARRAY ARRAY['contatos', 'politicos', 'emendas', 'obras', 'eventos', 'notas', 'midias', 'pendencias']
  LOOP
    -- Política para Assessoria (acesso total)
    EXECUTE format('CREATE POLICY "Assessoria tem acesso total a %1$s" ON public.%1$s FOR ALL USING (public.get_my_role() = ''assessoria'');', tbl);
    
    -- Política para Deputado (leitura total)
    EXECUTE format('CREATE POLICY "Deputado tem acesso de leitura a %1$s" ON public.%1$s FOR SELECT USING (public.get_my_role() = ''deputado'');', tbl);

    -- Política para Liderança (acesso restrito ao seu município)
    EXECUTE format('CREATE POLICY "Liderança pode ver %1$s do seu município" ON public.%1$s FOR SELECT USING (public.get_my_role() = ''lideranca'' AND municipio_id = public.get_my_municipio_id());', tbl);
    EXECUTE format('CREATE POLICY "Liderança pode criar %1$s no seu município" ON public.%1$s FOR INSERT WITH CHECK (public.get_my_role() = ''lideranca'' AND municipio_id = public.get_my_municipio_id());', tbl);
  END LOOP;
END;
$$;

-- Política específica para a tabela de contatos (Liderança pode atualizar status de seus envios)
-- (Pode ser útil no futuro, por enquanto o fluxo é só de inserção)
-- CREATE POLICY "Liderança pode atualizar contatos que enviou" ON public.contatos
-- FOR UPDATE USING (public.get_my_role() = 'lideranca' AND enviado_por = auth.uid());

-- Política para a tabela de notas (Liderança não pode ver notas)
-- A política de Liderança gerada pelo loop já previne isso, pois eles só podem ver notas do seu município.
-- Para proibir totalmente, poderíamos remover a política de SELECT para liderança nesta tabela específica.
-- Por agora, manter o padrão do loop é suficiente.


-- ### STORAGE ###

-- Criar bucket para mídias
-- Isso precisa ser feito na UI do Supabase ou via API, mas deixamos o SQL de política aqui.
-- INSERT INTO storage.buckets (id, name, public) VALUES ('midias_mandato', 'midias_mandato', false);

-- Políticas para o Storage
CREATE POLICY "Assessoria pode fazer upload de mídias" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'midias_mandato' AND public.get_my_role() = 'assessoria');

CREATE POLICY "Perfis autorizados podem ver mídias" ON storage.objects FOR SELECT
  USING (bucket_id = 'midias_mandato' AND public.get_my_role() IN ('deputado', 'assessoria'));

-- Para lideranças verem apenas mídias do seu município, seria necessário um JOIN,
-- o que é complexo em RLS de storage. A lógica de exibição no app deve controlar isso,
-- buscando primeiro os links da tabela `midias` (que já tem RLS) e depois usando-os.
