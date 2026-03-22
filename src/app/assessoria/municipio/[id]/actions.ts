'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

async function getSupabaseAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Não autorizado. Faça login.");
  
  const { data: perfil } = await supabase
    .from('perfis')
    .select('role')
    .eq('id', user.id)
    .single();
    
  if (perfil?.role !== 'assessoria') {
    throw new Error("Acesso negado. Apenas Assessoria pode gerenciar dados.");
  }
  
  return supabase;
}

export async function addRecord(table: string, municipioId: string, data: Record<string, unknown>) {
  try {
    const supabase = await getSupabaseAuth();
    
    // Filtro de segurança (nunca injetar algo malicioso ou alterar a chave de outro município)
    const payload = { ...data, municipio_id: municipioId };
    
    const { data: newData, error } = await supabase.from(table).insert(payload).select().single();
    
    if (error) {
      console.error(`Erro inserindo em ${table}:`, error);
      throw new Error(error.message);
    }
    
    revalidatePath(`/assessoria/municipio/${municipioId}`);
    revalidatePath(`/`); // Revalida o dashboard principal tbm
    return { success: true, data: newData };
  } catch (error: unknown) {
    return { error: (error as Error).message };
  }
}

export async function updateRecord(table: string, id: string, municipioId: string, data: Record<string, unknown>) {
  try {
    const supabase = await getSupabaseAuth();
    
    // Segurança extra para evitar update do municipioId ou do proprio id malicioso
    const cleanData = { ...data };
    delete (cleanData as any).id;
    delete (cleanData as any).municipio_id;
    
    const { error } = await supabase
      .from(table)
      .update(cleanData)
      .eq('id', id)
      .eq('municipio_id', municipioId); // Garante que pertence a esse municipio
      
    if (error) {
      console.error(`Erro atualizando em ${table}:`, error);
      throw new Error(error.message);
    }
    
    revalidatePath(`/assessoria/municipio/${municipioId}`);
    revalidatePath(`/`);
    return { success: true };
  } catch (error: unknown) {
    return { error: (error as Error).message };
  }
}

export async function deleteRecord(table: string, id: string, municipioId: string) {
  try {
    const supabase = await getSupabaseAuth();
    
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
      .eq('municipio_id', municipioId);
      
    if (error) {
      console.error(`Erro excluindo em ${table}:`, error);
      throw new Error(error.message);
    }
    
    revalidatePath(`/assessoria/municipio/${municipioId}`);
    revalidatePath(`/`);
    return { success: true };
  } catch (error: unknown) {
    return { error: (error as Error).message };
  }
}
