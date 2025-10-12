import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useProfileComplete = () => {
  const { user } = useAuth();
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) {
        setIsProfileComplete(null);
        setLoading(false);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, email, country')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error checking profile:', error);
          setIsProfileComplete(false);
          setLoading(false);
          return;
        }

        // Profile is complete if it has at least first name, email, and country
        const isComplete = !!(
          profile?.first_name?.trim() && 
          profile?.email?.trim() && 
          profile?.country?.trim()
        );

        setIsProfileComplete(isComplete);
      } catch (error) {
        console.error('Error in checkProfile:', error);
        setIsProfileComplete(false);
      } finally {
        setLoading(false);
      }
    };

    checkProfile();
  }, [user]);

  return { isProfileComplete, loading };
};
