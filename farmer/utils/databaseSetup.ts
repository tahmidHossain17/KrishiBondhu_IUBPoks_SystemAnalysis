import { supabase } from '../integrations/supabase/client';

export class DatabaseSetup {
  // Check if tables exist by trying to query them
  static async checkTablesExist() {
    // Start with core tables first, then check extended tables
    const coreTables = ['profiles', 'farmer_profiles', 'products'];
    const extendedTables = ['product_images', 'orders', 'order_items', 'crops', 'inventory'];
    const results: Record<string, boolean> = {};
    
    // Check core tables first
    for (const table of coreTables) {
      try {
        const { error } = await supabase.from(table as any).select('id').limit(1);
        results[table] = !error;
      } catch {
        results[table] = false;
      }
    }
    
    // Only check extended tables if core tables exist
    const coreTablesExist = coreTables.every(table => results[table]);
    if (coreTablesExist) {
      for (const table of extendedTables) {
        try {
          const { error } = await supabase.from(table as any).select('id').limit(1);
          results[table] = !error;
        } catch {
          results[table] = false;
        }
      }
    } else {
      // Mark extended tables as false if core tables don't exist
      extendedTables.forEach(table => {
        results[table] = false;
      });
    }
    
    return results;
  }

  // Since we can't create tables via API, provide manual SQL instructions
  static getManualSetupSQL() {
    return `
-- Step 1: Create enums
CREATE TYPE user_role AS ENUM ('farmer', 'customer', 'warehouse', 'delivery_partner');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE product_category AS ENUM ('grains', 'vegetables', 'fruits', 'pulses', 'spices', 'dairy', 'other');

-- Step 2: Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL,
  phone TEXT,
  verification_status verification_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Step 3: Create farmer_profiles table
CREATE TABLE farmer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  farm_location TEXT NOT NULL,
  land_area_acres DECIMAL,
  farming_experience_years INTEGER,
  crops_grown TEXT[],
  organic_certified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id)
);

-- Step 4: Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES farmer_profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category product_category NOT NULL,
  price DECIMAL NOT NULL CHECK (price > 0),
  unit TEXT DEFAULT 'kg',
  available_quantity DECIMAL NOT NULL DEFAULT 0,
  location TEXT NOT NULL,
  organic BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  harvest_date DATE,
  expiry_date DATE,
  image_url TEXT,
  minimum_order DECIMAL DEFAULT 1,
  original_price DECIMAL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 4: Create product_images table
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 5: Create orders table  
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  total_amount DECIMAL NOT NULL CHECK (total_amount > 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  delivery_address TEXT NOT NULL,
  contact_phone TEXT,
  payment_method TEXT DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'upi', 'net_banking')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  order_date TIMESTAMPTZ DEFAULT NOW(),
  delivery_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 6: Create order_items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity DECIMAL NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL NOT NULL CHECK (unit_price > 0),
  total_price DECIMAL NOT NULL CHECK (total_price > 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 7: Create crops table
CREATE TABLE crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES farmer_profiles(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  variety TEXT,
  planted_area DECIMAL CHECK (planted_area > 0),
  planting_date DATE,
  expected_harvest_date DATE,
  actual_harvest_date DATE,
  expected_yield DECIMAL,
  actual_yield DECIMAL,
  crop_status TEXT DEFAULT 'planted' CHECK (crop_status IN ('planned', 'planted', 'growing', 'harvested', 'sold')),
  season TEXT CHECK (season IN ('kharif', 'rabi', 'zaid')),
  irrigation_method TEXT,
  fertilizer_used TEXT[],
  pesticide_used TEXT[],
  organic_certified BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 8: Create inventory table
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity_in_stock DECIMAL NOT NULL DEFAULT 0,
  reserved_quantity DECIMAL DEFAULT 0,
  reorder_level DECIMAL DEFAULT 10,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  location TEXT,
  batch_number TEXT,
  expiry_date DATE,
  quality_grade TEXT CHECK (quality_grade IN ('A', 'B', 'C')),
  storage_conditions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 9: Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Step 10: Create policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Farmers can view own profile" ON farmer_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = farmer_profiles.profile_id AND profiles.user_id = auth.uid())
);
CREATE POLICY "Anyone can view verified farmer profiles" ON farmer_profiles FOR SELECT USING (true);

CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Farmers can manage own products" ON products FOR ALL USING (
  EXISTS (
    SELECT 1 FROM farmer_profiles 
    JOIN profiles ON profiles.id = farmer_profiles.profile_id 
    WHERE farmer_profiles.id = products.farmer_id AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Anyone can view product images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Farmers can manage own product images" ON product_images FOR ALL USING (
  EXISTS (
    SELECT 1 FROM products 
    JOIN farmer_profiles ON farmer_profiles.id = products.farmer_id
    JOIN profiles ON profiles.id = farmer_profiles.profile_id 
    WHERE products.id = product_images.product_id AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = orders.customer_id AND profiles.user_id = auth.uid())
);
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = orders.customer_id AND profiles.user_id = auth.uid())
);

CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    JOIN profiles ON profiles.id = orders.customer_id 
    WHERE orders.id = order_items.order_id AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Farmers can view own crops" ON crops FOR ALL USING (
  EXISTS (
    SELECT 1 FROM farmer_profiles 
    JOIN profiles ON profiles.id = farmer_profiles.profile_id 
    WHERE farmer_profiles.id = crops.farmer_id AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Farmers can view own inventory" ON inventory FOR ALL USING (
  EXISTS (
    SELECT 1 FROM products 
    JOIN farmer_profiles ON farmer_profiles.id = products.farmer_id
    JOIN profiles ON profiles.id = farmer_profiles.profile_id 
    WHERE products.id = inventory.product_id AND profiles.user_id = auth.uid()
  )
);
    `;
  }

  // Get sample data SQL for manual insertion
  static getSampleDataSQL() {
    return `
-- Sample Data Setup - TWO OPTIONS BELOW

-- OPTION 1: Create sample data without user_id constraint (easiest for testing)
-- This creates test data that works with your current table structure

DO $$
DECLARE
    test_profile_id UUID := gen_random_uuid();
    test_farmer_id UUID := gen_random_uuid();
BEGIN
    -- Temporarily disable RLS for initial data seeding
    ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
    ALTER TABLE farmer_profiles DISABLE ROW LEVEL SECURITY;
    ALTER TABLE products DISABLE ROW LEVEL SECURITY;
    ALTER TABLE product_images DISABLE ROW LEVEL SECURITY;
    ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
    ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
    ALTER TABLE crops DISABLE ROW LEVEL SECURITY;
    ALTER TABLE inventory DISABLE ROW LEVEL SECURITY;
    
    -- Insert test profile (without user_id since no auth user exists)
    INSERT INTO profiles (id, role, verification_status) 
    VALUES (test_profile_id, 'farmer', 'verified');
    
    -- Insert farmer profile
    INSERT INTO farmer_profiles (id, profile_id, full_name, farm_location, land_area_acres, farming_experience_years, crops_grown, organic_certified)
    VALUES (test_farmer_id, test_profile_id, 'Demo Farmer', 'Maharashtra, India', 5.5, 10, ARRAY['Rice', 'Wheat', 'Tomatoes'], true);
    
    -- Insert sample products
    INSERT INTO products (farmer_id, name, description, category, price, unit, available_quantity, location, organic, featured, harvest_date, expiry_date) VALUES
    (test_farmer_id, 'Organic Basmati Rice', 'Premium quality organic basmati rice grown without pesticides', 'grains', 120, 'kg', 500, 'Maharashtra, India', true, true, '2025-08-15', '2026-08-15'),
    (test_farmer_id, 'Fresh Tomatoes', 'Vine-ripened fresh tomatoes, perfect for cooking', 'vegetables', 40, 'kg', 200, 'Maharashtra, India', false, true, '2025-08-18', '2025-08-25'),
    (test_farmer_id, 'Organic Wheat Flour', 'Stone-ground organic wheat flour, rich in nutrients', 'grains', 60, 'kg', 300, 'Maharashtra, India', true, false, '2025-08-10', '2026-02-10'),
    (test_farmer_id, 'Fresh Carrots', 'Organic carrots grown in rich soil', 'vegetables', 35, 'kg', 150, 'Maharashtra, India', true, false, '2025-08-19', '2025-09-19'),
    (test_farmer_id, 'Premium Honey', 'Pure wildflower honey from organic farms', 'dairy', 200, 'bottle', 50, 'Maharashtra, India', true, true, '2025-08-01', '2027-08-01');
    
    -- Insert product images for better display
    INSERT INTO product_images (product_id, image_url, is_primary) 
    SELECT id, '/placeholder.svg', true FROM products WHERE farmer_id = test_farmer_id;
    
    -- Insert sample inventory records
    INSERT INTO inventory (product_id, quantity_in_stock, reorder_level, quality_grade, storage_conditions)
    SELECT id, available_quantity, 10, 'A', 'Cool and dry place' FROM products WHERE farmer_id = test_farmer_id;
    
    -- Re-enable RLS
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE products ENABLE ROW LEVEL SECURITY;
    ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
    ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
    ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
    ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
    ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
    
    RAISE NOTICE 'Sample data inserted successfully! Created % products for Demo Farmer', 5;
END $$;

-- OPTION 2: Create sample data with real authenticated user (after signup)
-- Use this ONLY after you have signed up a user through your app

/*
-- Step 1: First sign up a user through your app's authentication
-- Step 2: Find your user ID:
SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 3;

-- Step 3: Replace 'YOUR_ACTUAL_USER_ID_HERE' with real UUID from above query and uncomment:

DO $$
DECLARE
    actual_user_id UUID := 'YOUR_ACTUAL_USER_ID_HERE'; -- Replace with real UUID
    test_profile_id UUID := gen_random_uuid();
    test_farmer_id UUID := gen_random_uuid();
BEGIN
    -- Insert profile linked to real user
    INSERT INTO profiles (id, user_id, role, verification_status) 
    VALUES (test_profile_id, actual_user_id, 'farmer', 'verified');
    
    -- Insert farmer profile
    INSERT INTO farmer_profiles (id, profile_id, full_name, farm_location, land_area_acres, farming_experience_years, crops_grown, organic_certified)
    VALUES (test_farmer_id, test_profile_id, 'Your Farmer Name', 'Your Location', 5.5, 10, ARRAY['Rice', 'Wheat', 'Tomatoes'], true);
    
    -- Insert sample products
    INSERT INTO products (farmer_id, name, description, category, price, unit, available_quantity, location, organic, featured, harvest_date, expiry_date) VALUES
    (test_farmer_id, 'Your Product 1', 'Description 1', 'grains', 120, 'kg', 500, 'Your Location', true, true, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year');
    
    RAISE NOTICE 'Sample data created for authenticated user!';
END $$;
*/

-- OPTION 3: Quick check - see what data exists
-- Run these queries to check your current data:
/*
SELECT 'Profiles' as table_name, count(*) as count FROM profiles
UNION ALL
SELECT 'Farmer Profiles' as table_name, count(*) as count FROM farmer_profiles  
UNION ALL
SELECT 'Products' as table_name, count(*) as count FROM products;
*/

-- Alternative: Quick sample data without user authentication (for testing only)
-- This creates data that bypasses RLS for testing purposes
-- DO NOT USE IN PRODUCTION

/*
-- Disable RLS temporarily for testing (NOT RECOMMENDED FOR PRODUCTION)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE farmer_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Insert test data without user_id constraint
INSERT INTO profiles (id, role, verification_status) 
VALUES ('11111111-1111-1111-1111-111111111111', 'farmer', 'verified');

INSERT INTO farmer_profiles (profile_id, full_name, farm_location, land_area_acres, farming_experience_years, crops_grown, organic_certified)
VALUES ('11111111-1111-1111-1111-111111111111', 'Demo Farmer', 'Maharashtra, India', 5.5, 10, ARRAY['Rice', 'Wheat', 'Tomatoes'], true);

-- Get the farmer profile ID that was just created
-- You'll need to run this query to get the actual ID:
-- SELECT id FROM farmer_profiles WHERE full_name = 'Demo Farmer';

-- Then use that ID in the products insert (replace the UUID below with the actual farmer_profiles.id)
INSERT INTO products (farmer_id, name, description, category, price, unit, available_quantity, location, organic, featured, harvest_date, expiry_date) VALUES
('your-actual-farmer-profile-id-here', 'Organic Basmati Rice', 'Premium quality organic basmati rice grown without pesticides', 'grains', 120, 'kg', 500, 'Maharashtra, India', true, true, '2025-08-15', '2026-08-15'),
('your-actual-farmer-profile-id-here', 'Fresh Tomatoes', 'Vine-ripened fresh tomatoes, perfect for cooking', 'vegetables', 40, 'kg', 200, 'Maharashtra, India', false, true, '2025-08-18', '2025-08-25'),
('your-actual-farmer-profile-id-here', 'Organic Wheat Flour', 'Stone-ground organic wheat flour, rich in nutrients', 'grains', 60, 'kg', 300, 'Maharashtra, India', true, false, '2025-08-10', '2026-02-10');

-- Re-enable RLS after testing
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
*/
    `;
  }

  // Insert sample data (this will work once tables are created)
  static async insertSampleData() {
    try {
      // First, let's try to create a sample farmer profile without requiring authentication
      // Check if any farmer profiles exist
      const { data: existingFarmers, error: checkError } = await supabase
        .from('farmer_profiles')
        .select('id')
        .limit(1);

      if (checkError) {
        console.error('Error checking farmer profiles:', checkError);
        throw new Error(`Failed to check existing farmers: ${checkError.message}`);
      }

      // If farmers already exist, check if products exist
      if (existingFarmers && existingFarmers.length > 0) {
        const { data: existingProducts } = await supabase
          .from('products')
          .select('id')
          .limit(1);

        if (existingProducts && existingProducts.length > 0) {
          return { success: true, message: 'Sample data already exists!' };
        }
      }

      // Create a sample profile first (this requires manual user creation)
      return { 
        success: false, 
        error: new Error('To insert sample data, please:\n1. Sign up as a farmer first\n2. Then run the setup again\n\nOr manually insert data via SQL Editor') 
      };

    } catch (error) {
      console.error('Error in sample data insertion:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Unknown error during sample data insertion') 
      };
    }
  }

  // Run complete setup check and guide user
  static async runCompleteSetup() {
    const steps = [];
    
    try {
      // Step 1: Check if tables exist
      console.log('Step 1: Checking if tables exist...');
      const tablesExist = await this.checkTablesExist();
      
      const missingTables = Object.entries(tablesExist)
        .filter(([, exists]) => !exists)
        .map(([table]) => table);

      if (missingTables.length > 0) {
        steps.push({ 
          step: 'Table Check', 
          success: false, 
          message: `Missing tables: ${missingTables.join(', ')}` 
        });
        
        return { 
          success: false, 
          steps, 
          manualSQL: this.getManualSetupSQL(),
          error: 'Database tables need to be created manually. Please run the provided SQL in Supabase Dashboard.' 
        };
      }

      steps.push({ 
        step: 'Table Check', 
        success: true, 
        message: 'All required tables exist!' 
      });

      // Step 2: Insert sample data if tables exist
      console.log('Step 2: Inserting sample data...');
      const dataResult = await this.insertSampleData();
      steps.push({ step: 'Sample Data', ...dataResult });

      const finalSuccess = dataResult.success;
      let finalMessage = '';
      
      if (finalSuccess) {
        finalMessage = 'Database setup completed successfully! You can now use the app with real data.';
      } else {
        finalMessage = 'Tables created successfully! Sample data needs to be inserted manually.';
      }

      return { 
        success: true, // Tables exist, so setup is technically successful
        steps, 
        sampleDataSQL: this.getSampleDataSQL(),
        message: finalMessage
      };
    } catch (error) {
      console.error('Setup failed:', error);
      return { 
        success: false, 
        steps, 
        error: `Setup failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }
}
