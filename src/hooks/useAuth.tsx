import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithPhone: (phone: string) => Promise<{ error: any }>;
  verifyOTP: (phone: string, token: string) => Promise<{ error: any }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithPhone = async (phone: string) => {
    try {
      // Call our custom send-otp edge function instead of Supabase's phone auth
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { phoneNumber: phone }
      });

      if (error) throw error;
      
      console.log('OTP sent successfully:', data);
      return { error: null };
    } catch (error: any) {
      console.error('Send OTP error:', error);
      return { error };
    }
  };

  const verifyOTP = async (phone: string, token: string) => {
    try {
      // Call our custom verify-otp edge function
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { phoneNumber: phone, otp: token }
      });

      if (error) throw error;
      
      if (!data?.success) {
        throw new Error(data?.error || 'Invalid OTP');
      }

      console.log('✅ OTP verified, session data:', data);
      
      // Set the session using the returned session data
      if (data.session) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        });

        if (sessionError) {
          console.error('❌ Session error:', sessionError);
          throw sessionError;
        }

        // Update local state
        const { data: { session: newSession } } = await supabase.auth.getSession();
        if (newSession) {
          setSession(newSession);
          setUser(newSession.user);
          console.log('✅ User authenticated successfully:', newSession.user.id);
        }
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('❌ Verify OTP error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // Clear all auth-related storage first
      localStorage.removeItem('sb-tqhwoizjlvjdiuemirsy-auth-token');
      sessionStorage.clear();
      
      const { error } = await supabase.auth.signOut();
      
      // Clear local state regardless of API response
      setSession(null);
      setUser(null);
      
      console.log('Logout successful');
      return { error };
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even on error
      setSession(null);
      setUser(null);
      return { error };
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signInWithPhone,
    verifyOTP,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};