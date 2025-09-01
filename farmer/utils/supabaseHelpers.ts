import { PostgrestError, AuthError } from '@supabase/supabase-js';

export type SupabaseError = PostgrestError | AuthError | Error | null;

export const handleSupabaseError = (error: SupabaseError): string => {
  if (!error) return '';

  // Handle authentication errors
  if ('message' in error && error.message) {
    if (error.message.includes('Invalid login credentials')) {
      return 'Invalid email or password. Please try again.';
    }
    if (error.message.includes('Email not confirmed')) {
      return 'Please verify your email address before signing in.';
    }
    if (error.message.includes('User already registered')) {
      return 'An account with this email already exists.';
    }
    if (error.message.includes('Password should be at least')) {
      return 'Password must be at least 6 characters long.';
    }
    return error.message;
  }

  // Handle PostgreSQL errors
  if ('code' in error && error.code) {
    switch (error.code) {
      case '23505': // Unique violation
        return 'This record already exists.';
      case '23503': // Foreign key violation
        return 'Related record not found.';
      case '42501': // Insufficient privilege
        return 'You do not have permission to perform this action.';
      case 'PGRST301': // Row Level Security
        return 'Access denied. Please check your permissions.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }

  return 'An unexpected error occurred. Please try again.';
};

export const isSupabaseConfigured = (): boolean => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  return !!(supabaseUrl && supabaseKey);
};

export const getSupabaseConfig = () => {
  return {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    isConfigured: isSupabaseConfigured()
  };
};
