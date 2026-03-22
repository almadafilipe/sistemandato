'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface ParsedContact {
  nome: string;
  telefone?: string;
  email?: string;
}

export async function saveImportedContacts(contacts: ParsedContact[], municipioId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuário não autenticado.');
  }

  if (!municipioId) {
    throw new Error('Município não especificado.');
  }

  const contactsToInsert = contacts.map(contact => ({
    nome: contact.nome,
    telefone: contact.telefone,
    email: contact.email,
    municipio_id: municipioId,
    enviado_por: user.id,
    status: 'pendente',
    consentiu: true, // As per the prompt, consent is implied on manual selection
  }));

  const { error } = await supabase.from('contatos').insert(contactsToInsert);

  if (error) {
    console.error("Erro ao salvar contatos importados:", error);
    throw new Error('Falha ao salvar contatos no banco de dados.');
  }

  // Invalidate the cache for the home page to reflect the new counts
  revalidatePath('/');

  return { success: true };
}
