-- This script creates a trigger that automatically adds a new user to the
-- `public.perfis` table when they sign up via Supabase Auth.

-- 1. Create a function to be called by the trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserts a new row into public.perfis
  -- ID comes from the new auth.users record
  -- Role defaults to 'deputado' as a safe, read-only default.
  -- An admin (Assessoria) will need to update the role and municipio_id later.
  INSERT INTO public.perfis (id, nome, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'deputado');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger to call the function after a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user IS 'Cria um perfil de usuário padrão ao se registrar.';
