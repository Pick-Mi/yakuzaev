import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AuthForm from './auth-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - Neu',
  description: 'Sign in to your Neu account',
};

export default async function AuthPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <AuthForm />
    </div>
  );
}
