import { supabase } from '../integrations/supabase/client';
import type { Database } from '../integrations/supabase/types';

type FarmerProfile = Database['public']['Tables']['farmer_profiles']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export class FarmerAPI {
  // Get farmer profile with statistics
  static async getFarmerProfile(profileId: string) {
    try {
      const { data, error } = await supabase
        .from('farmer_profiles')
        .select(`
          *,
          profiles!inner(phone, verification_status)
        `)
        .eq('profile_id', profileId)
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
        error: null
      };
    } catch (error) {
      console.error('Error fetching farmer profile:', error);
      return {
        success: false,
        data: null,
        error: error as Error
      };
    }
  }

  // Get farmer dashboard statistics
  static async getFarmerDashboardStats(farmerId: string) {
    try {
      const [productsResult, ordersResult, inventoryResult, reviewsResult] = await Promise.all([
        // Total products
        supabase
          .from('products')
          .select('id, available_quantity, price')
          .eq('farmer_id', farmerId)
          .eq('is_active', true),

        // Recent orders
        supabase
          .from('orders')
          .select(`
            id, total_amount, status, created_at,
            order_items!inner(
              quantity,
              products!inner(farmer_id)
            )
          `)
          .eq('order_items.products.farmer_id', farmerId)
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()), // Last 30 days

        // Inventory stored in warehouses
        supabase
          .from('inventory')
          .select(`
            quantity_stored,
            products!inner(farmer_id, name),
            warehouse_profiles(business_name, location)
          `)
          .eq('products.farmer_id', farmerId),

        // Average rating
        supabase
          .rpc('calculate_farmer_rating', { farmer_profile_id: farmerId })
      ]);

      const totalProducts = productsResult.data?.length || 0;
      const totalRevenue = ordersResult.data?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const totalInventory = inventoryResult.data?.reduce((sum, inv) => sum + inv.quantity_stored, 0) || 0;
      const averageRating = reviewsResult.data || 0;

      return {
        success: true,
        data: {
          totalProducts,
          totalRevenue,
          totalInventory,
          averageRating,
          recentOrders: ordersResult.data?.slice(0, 5) || [],
          inventoryItems: inventoryResult.data || []
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching farmer dashboard stats:', error);
      return {
        success: false,
        data: null,
        error: error as Error
      };
    }
  }

  // Update farmer profile
  static async updateFarmerProfile(profileId: string, updates: Partial<FarmerProfile>) {
    try {
      const { data, error } = await supabase
        .from('farmer_profiles')
        .update(updates)
        .eq('profile_id', profileId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
        error: null
      };
    } catch (error) {
      console.error('Error updating farmer profile:', error);
      return {
        success: false,
        data: null,
        error: error as Error
      };
    }
  }

  // Get farmer's weather data
  static async getFarmerWeatherData(location: string) {
    try {
      const { data, error } = await supabase
        .from('weather_data')
        .select('*')
        .eq('location', location)
        .order('recorded_at', { ascending: false })
        .limit(7); // Last 7 days

      if (error) throw error;

      return {
        success: true,
        data,
        error: null
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return {
        success: false,
        data: [],
        error: error as Error
      };
    }
  }

  // Get market prices for farmer's crops
  static async getMarketPrices(location: string, crops?: string[]) {
    try {
      let query = supabase
        .from('market_prices')
        .select(`
          *,
          crops(name, category)
        `)
        .eq('location', location)
        .order('date_recorded', { ascending: false });

      if (crops && crops.length > 0) {
        query = query.in('crops.name', crops);
      }

      const { data, error } = await query.limit(20);

      if (error) throw error;

      return {
        success: true,
        data,
        error: null
      };
    } catch (error) {
      console.error('Error fetching market prices:', error);
      return {
        success: false,
        data: [],
        error: error as Error
      };
    }
  }

  // Get crop recommendations based on location and season
  static async getCropRecommendations(location: string, season?: string) {
    try {
      let query = supabase
        .from('crops')
        .select('*')
        .eq('is_active', true);

      if (season) {
        query = query.or(`planting_season.ilike.%${season}%,harvest_season.ilike.%${season}%`);
      }

      const { data, error } = await query.limit(12);

      if (error) throw error;

      return {
        success: true,
        data,
        error: null
      };
    } catch (error) {
      console.error('Error fetching crop recommendations:', error);
      return {
        success: false,
        data: [],
        error: error as Error
      };
    }
  }

  // Get nearby warehouses
  static async getNearbyWarehouses(farmerLocation: string) {
    try {
      const { data, error } = await supabase
        .from('warehouse_profiles')
        .select(`
          *,
          profiles!inner(verification_status)
        `)
        .eq('profiles.verification_status', 'verified')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // In a real app, you'd filter by distance using PostGIS
      // For now, we'll return all verified warehouses
      return {
        success: true,
        data,
        error: null
      };
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      return {
        success: false,
        data: [],
        error: error as Error
      };
    }
  }

  // Create farmer profile
  static async createFarmerProfile(profileData: Database['public']['Tables']['farmer_profiles']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('farmer_profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
        error: null
      };
    } catch (error) {
      console.error('Error creating farmer profile:', error);
      return {
        success: false,
        data: null,
        error: error as Error
      };
    }
  }
}
