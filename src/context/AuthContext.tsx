import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import {
  getSupabaseClient,
  isSupabaseConfigured,
} from '../services/supabaseClient';
import {
  syncAllUserData,
  subscribeSyncStatus,
  getSyncStatus,
  SyncStatus,
  SyncResult,
} from '../services/syncService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  syncStatus: SyncStatus;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null; user: User | null }>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<{ error: Error | null }>;
  resendConfirmationEmail: (email: string) => Promise<{ error: Error | null }>;
  triggerManualSync: () => Promise<SyncResult | null>;
  refreshConfiguration: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isConfigured, setIsConfigured] = useState<boolean>(isSupabaseConfigured());
  const [syncStatus, setSyncStatusState] = useState<SyncStatus>(getSyncStatus());

  // Listen to sync status changes
  useEffect(() => {
    return subscribeSyncStatus((status) => {
      setSyncStatusState(status);
    });
  }, []);

  const refreshConfiguration = useCallback(() => {
    setIsConfigured(isSupabaseConfigured());
  }, []);

  // Initialize Supabase Auth listener
  useEffect(() => {
    const configured = isSupabaseConfigured();
    setIsConfigured(configured);

    if (!configured) {
      setLoading(false);
      return;
    }

    const client = getSupabaseClient();
    if (!client) {
      setLoading(false);
      return;
    }

    // Get initial session
    client.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (error) {
        console.warn('Failed to retrieve initial auth session:', error);
      }
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);

      if (initialSession?.user) {
        // Run initial synchronization
        void syncAllUserData(initialSession.user.id);
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);

      if (event === 'SIGNED_IN' && currentSession?.user) {
        // Trigger sync immediately on successful sign-in
        await syncAllUserData(currentSession.user.id);
      } else if (event === 'SIGNED_OUT') {
        // Revert sync status to idle
        setSyncStatusState('idle');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const client = getSupabaseClient();
    if (!client) {
      return { error: new Error('Supabase is not configured yet. Please enter your project credentials.') };
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      setUser(data.user);
      setSession(data.session);

      if (data.user) {
        await syncAllUserData(data.user.id);
      }

      return { error: null };
    } catch (err: any) {
      return { error: err || new Error('Failed to sign in') };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const client = getSupabaseClient();
    if (!client) {
      return {
        error: new Error('Supabase is not configured yet. Please enter your project credentials.'),
        user: null,
      };
    }

    try {
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || email.split('@')[0],
          },
        },
      });

      if (error) {
        return { error, user: null };
      }

      setUser(data.user);
      setSession(data.session);

      if (data.user) {
        await syncAllUserData(data.user.id);
      }

      return { error: null, user: data.user };
    } catch (err: any) {
      return { error: err || new Error('Failed to sign up'), user: null };
    }
  };

  const signOut = async () => {
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch (err) {
        console.warn('Error signing out of Supabase:', err);
      }
    }
    setUser(null);
    setSession(null);
  };

  const resetPasswordForEmail = async (email: string) => {
    const client = getSupabaseClient();
    if (!client) {
      return { error: new Error('Supabase is not configured yet.') };
    }

    try {
      const { error } = await client.auth.resetPasswordForEmail(email);
      return { error };
    } catch (err: any) {
      return { error: err || new Error('Failed to send password reset email') };
    }
  };

  const resendConfirmationEmail = async (email: string) => {
    const client = getSupabaseClient();
    if (!client) {
      return { error: new Error('Supabase is not configured yet.') };
    }

    try {
      const { error } = await client.auth.resend({
        type: 'signup',
        email,
      });
      return { error };
    } catch (err: any) {
      return { error: err || new Error('Failed to resend confirmation email') };
    }
  };

  const triggerManualSync = async (): Promise<SyncResult | null> => {
    if (!user) return null;
    return await syncAllUserData(user.id);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured,
        syncStatus,
        signIn,
        signUp,
        signOut,
        resetPasswordForEmail,
        resendConfirmationEmail,
        triggerManualSync,
        refreshConfiguration,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
