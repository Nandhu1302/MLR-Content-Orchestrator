import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session FIRST before setting up listener
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Auth session error:', error);
        } else {
          console.log('Auth session restored:', session ? 'Logged in' : 'Not logged in', session?.user?.email);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    // Set up auth state listener AFTER initial session is loaded
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        console.log('Auth state changed:', event, session ? 'Logged in' : 'Logged out');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email, password, displayName) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: displayName ? { display_name: displayName } : undefined
      }
    });
    return { error };
  };

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const demoSignIn = async () => {
    // First, try to sign in with existing demo credentials
    const result = await signIn('demo@example.com', 'demo123');
    
    // If sign-in fails with invalid credentials, create the demo user
    if (result.error && (result.error.message?.includes('Invalid login credentials') || result.error.message?.includes('invalid'))) {
      try {
        // Step 1: Create the demo user account
        const { error: signUpError } = await signUp('demo@example.com', 'demo123', 'Demo User');
        
        if (signUpError) {
          return { error: signUpError };
        }

        // Step 2: Get all brand IDs for access granting
        const { data: brands, error: brandsError } = await supabase
          .from('brand_profiles')
          .select('id');

        if (brandsError) {
          console.error('Failed to fetch brands for demo user:', brandsError);
          return { error: brandsError };
        }

        // Step 3: Sign in to get the user ID
        const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'demo@example.com',
          password: 'demo123',
        });

        if (signInError || !authData.user) {
          return { error: signInError };
        }

        // Step 4: Mark user as demo user and grant brand access
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ is_demo_user: true })
          .eq('user_id', authData.user.id);

        if (profileError) {
          console.error('Failed to mark user as demo user:', profileError);
        }

        // Step 5: Grant access to all brands
        if (brands && brands.length > 0) {
          const brandAccess = brands.map(brand => ({
            user_id: authData.user.id,
            brand_id: brand.id
          }));

          const { error: accessError } = await supabase
            .from('user_brand_access')
            .insert(brandAccess);

          if (accessError) {
            console.error('Failed to grant brand access to demo user:', accessError);
          }
        }

        return { error: null };
      } catch (creationError) {
        console.error('Failed to create demo user:', creationError);
        return { error: creationError };
      }
    }
    
    // For successful sign-in or other types of errors, return the original result
    return result;
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    demoSignIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};