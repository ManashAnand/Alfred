'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'


export async function signup(formData: FormData) {
  const supabase = createClient()
  // type-casting here for convenience
  // in practice, you should validate your inputs
  console.log("Signup started")
  
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data:authData, error } = await supabase.auth.signUp(data)

  if (error) {
    console.log(error)
    redirect('/error')
  }
  console.log("Signup completed")
  if (authData.session) {
    // Set the access token in an HTTP-only cookie
    cookies().set('Bearer', authData.session.access_token, {
      // httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      // sameSite: 'lax',
      // maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })
  }
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function login(formData: FormData) {
  const supabase = createClient() 
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data:authData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }
  console.log("Login is working")
  if (authData.session) {
    // Set the access token in an HTTP-only cookie
    cookies().set('Bearer', authData.session.access_token, {
      // httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      // sameSite: 'lax',
      // maxAge: 60 * 60 * 24 * 7, 
      path: '/',
    })
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  cookies().delete('Bearer')
} 