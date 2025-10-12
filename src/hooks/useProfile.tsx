import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      console.log('useProfile: No user found, skipping profile fetch');
      setProfile(null);
      setLoading(false);
      return;
    }

    console.log('useProfile: Fetching profile for user:', user.id);

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email')
          .eq('user_id', user.id)
          .maybeSingle(); // Use maybeSingle to handle case where profile doesn't exist

        if (error) {
          console.error('Error fetching profile:', error);
          setProfile(null);
        } else if (data) {
          console.log('Profile data fetched successfully:', data);
          setProfile(data);
        } else {
          console.log('No profile found for user, creating default profile');
          // Create a default profile if none exists
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              email: user.email,
              first_name: user.email?.split('@')[0] || 'User'
            })
            .select('id, first_name, last_name, email')
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            setProfile(null);
          } else {
            console.log('Profile created successfully:', newProfile);
            setProfile(newProfile);
          }
        }
      } catch (error) {
        console.error('Error in fetchProfile:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const getDisplayName = () => {
    if (!profile) return user?.email || 'User';
    
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile.first_name) return profile.first_name;
    if (profile.last_name) return profile.last_name;
    
    return profile.email || user?.email || 'User';
  };

  const refreshProfile = async () => {
    if (user) {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setProfile(null);
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    profile,
    loading,
    displayName: getDisplayName(),
    refreshProfile,
  };
};