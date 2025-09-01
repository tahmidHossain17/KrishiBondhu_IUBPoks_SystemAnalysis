// Environment configuration for KrishiBondhu
// This file provides type-safe access to environment variables

interface EnvironmentConfig {
  // Supabase Configuration
  supabaseUrl: string;
  supabaseAnonKey: string;
  
  // API Keys
  openWeatherApiKey: string;
  openRouterApiKey: string;
  mapTilerApiKey: string;
  
  // Payment Gateway Keys
  razorpayKey: string;
  stripeKey: string;
  
  // AI Configuration
  aiApiUrl: string;
  
  // Application Settings
  appName: string;
  appVersion: string;
  
  // Development Settings
  isDevelopment: boolean;
  
  // Feature Flags
  enablePayments: boolean;
  enableAI: boolean;
}

const getEnvVar = (name: string, fallback?: string): string => {
  const value = import.meta.env[name] || fallback;
  
  // Only warn for required variables (those without fallbacks that are truly needed)
  if (!value && !fallback && (name.includes('SUPABASE') || name === 'VITE_OPENWEATHER_API_KEY')) {
    console.warn(`Environment variable ${name} is not set`);
  }
  
  return value || '';
};

export const env: EnvironmentConfig = {
  // Supabase Configuration
  supabaseUrl: getEnvVar('VITE_SUPABASE_URL', 'https://xbwscvdrghtvsfwnaqoo.supabase.co'),
  supabaseAnonKey: getEnvVar('VITE_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhid3NjdmRyZ2h0dnNmd25hcW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NjE2MjIsImV4cCI6MjA3MTIzNzYyMn0.siZGWh4pWETz413rOhPEuA9EUXbYE2zeQnx8G_uo6tg'),
  
  // API Keys
  openWeatherApiKey: getEnvVar('VITE_OPENWEATHER_API_KEY', 'c2baa30284cc15344505b3b6814a519c'),
  openRouterApiKey: getEnvVar('VITE_OPENROUTER_API_KEY', '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'),
  mapTilerApiKey: getEnvVar('VITE_MAPTILER_API_KEY', 'EGKhKFjSRmmr2eGJgWeS'),
  
  // Payment Gateway Keys
  razorpayKey: getEnvVar('VITE_RAZORPAY_KEY', ''),
  stripeKey: getEnvVar('VITE_STRIPE_KEY', ''),
  
  // AI Configuration
  aiApiUrl: getEnvVar('VITE_AI_API_URL', 'http://localhost:3001/api/ai'),
  
  // Application Settings
  appName: getEnvVar('VITE_APP_NAME', 'KrishiBondhu'),
  appVersion: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  
  // Development Settings
  isDevelopment: getEnvVar('VITE_DEV_MODE', 'true') === 'true',
  
  // Feature Flags
  enablePayments: getEnvVar('VITE_ENABLE_PAYMENTS', 'true') === 'true',
  enableAI: getEnvVar('VITE_ENABLE_AI', 'true') === 'true',
};

// Validate required environment variables
export const validateEnvironment = (): void => {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];

  const optionalVars = [
    'VITE_OPENWEATHER_API_KEY',
    'VITE_OPENROUTER_API_KEY', 
    'VITE_MAPTILER_API_KEY',
    'VITE_RAZORPAY_KEY',
    'VITE_STRIPE_KEY',
    'VITE_AI_API_URL'
  ];

  const missingRequiredVars = requiredVars.filter(varName => !import.meta.env[varName]);
  const missingOptionalVars = optionalVars.filter(varName => !import.meta.env[varName]);

  if (missingRequiredVars.length > 0) {
    console.warn('Missing required environment variables:', missingRequiredVars);
    console.warn('Please check your .env file and ensure all required API keys are set');
  }

  if (missingOptionalVars.length > 0) {
    // Only show this in development mode, and only for actually important missing vars
    const criticalMissing = missingOptionalVars.filter(varName => 
      !varName.includes('RAZORPAY') && !varName.includes('STRIPE') && !varName.includes('AI_API')
    );
    
    if (criticalMissing.length > 0 && import.meta.env.DEV) {
      console.info('Missing optional environment variables:', criticalMissing);
      console.info('Some features may not be available without these keys');
    }
  }
};

// API Base URLs
export const API_ENDPOINTS = {
  weather: 'https://api.openweathermap.org/data/2.5',
  openRouter: 'https://openrouter.ai/api/v1/chat/completions',
  mapTiler: 'https://api.maptiler.com',
  delivery: getEnvVar('VITE_DELIVERY_API_URL', 'http://localhost:3001/api/delivery'),
  customer: getEnvVar('VITE_CUSTOMER_API_URL', 'http://localhost:3001/api/customer'),
  ai: getEnvVar('VITE_AI_API_URL', 'http://localhost:3001/api/ai')
} as const;

// Export default configuration
export default env;