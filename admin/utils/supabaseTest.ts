// Utility to test Supabase connection
import { supabase } from '@/integrations/supabase/client';
import { env } from '@/config/env';

export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Test basic connection by getting the session (doesn't require any tables)
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Supabase auth connection test failed:', authError.message);
      return false;
    }

    // Try to access the REST API with a simple introspection call
    const response = await fetch(`${env.supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': env.supabaseAnonKey,
        'Authorization': `Bearer ${env.supabaseAnonKey}`
      }
    });

    if (!response.ok) {
      console.error('Supabase REST API connection failed:', response.status);
      return false;
    }

    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection error:', error);
    return false;
  }
};

export const getSupabaseSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session error:', error.message);
      return null;
    }

    return session;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
};

export const checkSupabaseHealth = async () => {
  try {
    const connectionTest = await testSupabaseConnection();
    const session = await getSupabaseSession();
    
    return {
      isConnected: connectionTest,
      isAuthenticated: !!session,
      session
    };
  } catch (error) {
    console.error('Health check failed:', error);
    return {
      isConnected: false,
      isAuthenticated: false,
      session: null
    };
  }
};
