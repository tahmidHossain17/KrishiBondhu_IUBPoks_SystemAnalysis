import { supabase } from '../integrations/supabase/client';

export async function runMigrations() {
  try {
    console.log('Starting database migrations...');
    
    // First, let's check if we can connect
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('Connection test failed:', testError);
      throw testError;
    }
    
    console.log('Connection successful, profiles table exists');
    
    // Check if extended tables exist by trying to query products table
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('id')
      .limit(1);
    
    if (productsError) {
      console.log('Products table does not exist, migrations needed');
      console.log('Please apply the SQL migrations manually via Supabase Dashboard SQL Editor');
      console.log('Files to execute:');
      console.log('1. supabase/migrations/20250820101501_extended_schema.sql');
      console.log('2. supabase/migrations/20250820101502_seed_data.sql');
      return { success: false, message: 'Migrations need to be applied manually via Supabase Dashboard SQL Editor' };
    }
    
    console.log('Database schema appears to be up to date');
    return { success: true, message: 'Database is ready' };
    
  } catch (error) {
    console.error('Migration check failed:', error);
    return { success: false, error };
  }
}

// Function to check if a specific table exists
export async function checkTableExists(tableName: 'products' | 'orders' | 'crops' | 'inventory') {
  try {
    const { error } = await supabase
      .from(tableName)
      .select('id')
      .limit(1);
    
    return !error;
  } catch (error) {
    return false;
  }
}

// Function to get all products (for testing)
export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        farmer_profiles!inner(full_name, farm_location),
        product_images(image_url, is_primary)
      `)
      .eq('is_active', true)
      .limit(10);
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Function to get farmer dashboard data
export async function getFarmerDashboardData(farmerId: string) {
  try {
    const [productsResult, ordersResult] = await Promise.all([
      supabase
        .from('products')
        .select('*')
        .eq('farmer_id', farmerId)
        .eq('is_active', true),
      
      supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            products!inner(name, farmer_id)
          )
        `)
        .eq('order_items.products.farmer_id', farmerId)
        .limit(10)
    ]);

    return {
      products: productsResult.data || [],
      orders: ordersResult.data || [],
      error: productsResult.error || ordersResult.error
    };
  } catch (error) {
    return { products: [], orders: [], error };
  }
}
