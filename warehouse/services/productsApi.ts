import { supabase } from '../integrations/supabase/client';
import type { Database } from '../integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];
type ProductWithRelations = Product & {
  farmer_profiles: Database['public']['Tables']['farmer_profiles']['Row'];
  product_images?: Database['public']['Tables']['product_images']['Row'][];
};

export class ProductsAPI {
  // Get all products with pagination
  static async getProducts(options: {
    limit?: number;
    offset?: number;
    category?: Database['public']['Enums']['product_category'];
    search?: string;
    featured?: boolean;
    organic?: boolean;
  } = {}) {
    try {
      // Start with a basic query first
      let query = supabase
        .from('products')
        .select(`
          *,
          farmer_profiles!inner(full_name, farm_location, organic_certified)
        `)
        .eq('is_active', true);

      // Apply filters
      if (options.category) {
        query = query.eq('category', options.category);
      }

      if (options.featured !== undefined) {
        query = query.eq('featured', options.featured);
      }

      if (options.organic !== undefined) {
        query = query.eq('organic', options.organic);
      }

      if (options.search) {
        query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
      }

      // Apply sorting and pagination
      query = query.order('created_at', { ascending: false });

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      // Execute the query
      const { data, error } = await query;

      if (error) throw error;

      // If successful and we have data, try to add product images separately
      let enhancedData = data as ProductWithRelations[];
      
      if (data && data.length > 0) {
        try {
          // Get product images separately to avoid join errors
          const productIds = data.map(p => p.id);
          const { data: images, error: imageError } = await supabase
            .from('product_images')
            .select('id, product_id, image_url, is_primary, created_at')
            .in('product_id', productIds);

          if (!imageError && images) {
            // Attach images to products
            enhancedData = data.map(product => ({
              ...product,
              product_images: images.filter(img => img.product_id === product.id)
            })) as ProductWithRelations[];
          }
        } catch (imageError) {
          console.warn('Product images not available, continuing without images');
          // Continue with data without images
        }
      }

      return {
        success: true,
        data: enhancedData,
        error: null
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      
      // Provide more specific error information
      let errorMessage = 'Failed to fetch products';
      if (error instanceof Error) {
        if (error.message.includes('relation') || error.message.includes('table')) {
          errorMessage = 'Database tables are not set up yet. Please run the database setup first.';
        } else if (error.message.includes('foreign key') || error.message.includes('relationship')) {
          errorMessage = 'Database relationships are missing. Please check your database setup.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        data: [],
        error: new Error(errorMessage)
      };
    }
  }

  // Get product by ID
  static async getProductById(id: string) {
    try {
      // Get basic product data first
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          farmer_profiles!inner(full_name, farm_location, organic_certified, farming_experience_years)
        `)
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      let enhancedData = data as ProductWithRelations;

      // Try to get product images separately
      try {
        const { data: images } = await supabase
          .from('product_images')
          .select('id, image_url, is_primary, product_id, created_at')
          .eq('product_id', id);

        if (images) {
          enhancedData.product_images = images;
        }
      } catch (imageError) {
        console.warn('Product images not available for product:', id);
      }

      return {
        success: true,
        data: enhancedData,
        error: null
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      return {
        success: false,
        data: null,
        error: error as Error
      };
    }
  }

  // Get featured products
  static async getFeaturedProducts(limit = 6) {
    return this.getProducts({ featured: true, limit });
  }

  // Get products by category
  static async getProductsByCategory(category: Database['public']['Enums']['product_category'], limit = 12) {
    return this.getProducts({ category, limit });
  }

  // Search products
  static async searchProducts(searchTerm: string, limit = 20) {
    return this.getProducts({ search: searchTerm, limit });
  }

  // Get farmer's products
  static async getFarmerProducts(farmerId: string) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images(image_url, is_primary),
          inventory(quantity_stored, warehouse_profiles(business_name, location))
        `)
        .eq('farmer_id', farmerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data,
        error: null
      };
    } catch (error) {
      console.error('Error fetching farmer products:', error);
      return {
        success: false,
        data: [],
        error: error as Error
      };
    }
  }

  // Create new product
  static async createProduct(productData: Database['public']['Tables']['products']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
        error: null
      };
    } catch (error) {
      console.error('Error creating product:', error);
      return {
        success: false,
        data: null,
        error: error as Error
      };
    }
  }

  // Update product
  static async updateProduct(id: string, updates: Database['public']['Tables']['products']['Update']) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
        error: null
      };
    } catch (error) {
      console.error('Error updating product:', error);
      return {
        success: false,
        data: null,
        error: error as Error
      };
    }
  }

  // Delete product (soft delete by setting is_active to false)
  static async deleteProduct(id: string) {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      return {
        success: true,
        error: null
      };
    } catch (error) {
      console.error('Error deleting product:', error);
      return {
        success: false,
        error: error as Error
      };
    }
  }
}
