'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function logIn(formData: FormData) {
  const supabase = await createClient()
  
  // type-casting here for convenience
  // in a real app you should validate values
  const data = Object.fromEntries(formData.entries()) as { email: string, password: string };

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return redirect('/login?message=Could not authenticate user')
  }

  return redirect('/')
}

export async function signUp(formData: FormData) {
  const origin = (await headers()).get('origin')
  const supabase = await createClient()
  
  const data = Object.fromEntries(formData.entries()) as { email: string, password: string };

  const { error } = await supabase.auth.signUp({
    ...data,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error('Sign up error:', error);
    return redirect('/login?message=Could not authenticate user')
  }

  return redirect('/login?message=Check email to continue sign in process')
}
