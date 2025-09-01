export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      crops: {
        Row: {
          category: string
          climate_requirements: string | null
          common_diseases: string[] | null
          common_pests: string[] | null
          created_at: string
          growing_tips: string | null
          harvest_season: string | null
          id: string
          is_active: boolean | null
          market_price_range: Json | null
          name: string
          nutritional_info: Json | null
          planting_season: string | null
          season: string | null
          soil_type: string[] | null
          water_requirement: string | null
        }
        Insert: {
          category: string
          climate_requirements?: string | null
          common_diseases?: string[] | null
          common_pests?: string[] | null
          created_at?: string
          growing_tips?: string | null
          harvest_season?: string | null
          id?: string
          is_active?: boolean | null
          market_price_range?: Json | null
          name: string
          nutritional_info?: Json | null
          planting_season?: string | null
          season?: string | null
          soil_type?: string[] | null
          water_requirement?: string | null
        }
        Update: {
          category?: string
          climate_requirements?: string | null
          common_diseases?: string[] | null
          common_pests?: string[] | null
          created_at?: string
          growing_tips?: string | null
          harvest_season?: string | null
          id?: string
          is_active?: boolean | null
          market_price_range?: Json | null
          name?: string
          nutritional_info?: Json | null
          planting_season?: string | null
          season?: string | null
          soil_type?: string[] | null
          water_requirement?: string | null
        }
        Relationships: []
      }
      customer_profiles: {
        Row: {
          city: string
          created_at: string
          delivery_address: string
          dietary_restrictions: string[] | null
          food_preferences: string[] | null
          full_name: string
          id: string
          postal_code: string | null
          profile_id: string
        }
        Insert: {
          city: string
          created_at?: string
          delivery_address: string
          dietary_restrictions?: string[] | null
          food_preferences?: string[] | null
          full_name: string
          id?: string
          postal_code?: string | null
          profile_id: string
        }
        Update: {
          city?: string
          created_at?: string
          delivery_address?: string
          dietary_restrictions?: string[] | null
          food_preferences?: string[] | null
          full_name?: string
          id?: string
          postal_code?: string | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_partner_profiles: {
        Row: {
          availability_hours: string | null
          coverage_areas: string[] | null
          created_at: string
          full_name: string
          id: string
          license_number: string
          profile_id: string
          vehicle_registration: string
          vehicle_type: string
        }
        Insert: {
          availability_hours?: string | null
          coverage_areas?: string[] | null
          created_at?: string
          full_name: string
          id?: string
          license_number: string
          profile_id: string
          vehicle_registration: string
          vehicle_type: string
        }
        Update: {
          availability_hours?: string | null
          coverage_areas?: string[] | null
          created_at?: string
          full_name?: string
          id?: string
          license_number?: string
          profile_id?: string
          vehicle_registration?: string
          vehicle_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_partner_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_routes: {
        Row: {
          created_at: string
          delivery_partner_id: string
          end_location: string
          estimated_distance: number | null
          estimated_duration: number | null
          id: string
          is_active: boolean | null
          route_name: string
          start_location: string
        }
        Insert: {
          created_at?: string
          delivery_partner_id: string
          end_location: string
          estimated_distance?: number | null
          estimated_duration?: number | null
          id?: string
          is_active?: boolean | null
          route_name: string
          start_location: string
        }
        Update: {
          created_at?: string
          delivery_partner_id?: string
          end_location?: string
          estimated_distance?: number | null
          estimated_duration?: number | null
          id?: string
          is_active?: boolean | null
          route_name?: string
          start_location?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_routes_delivery_partner_id_fkey"
            columns: ["delivery_partner_id"]
            isOneToOne: false
            referencedRelation: "delivery_partner_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_tracking: {
        Row: {
          created_at: string
          current_status: Database["public"]["Enums"]["delivery_status"]
          delivery_partner_id: string | null
          estimated_delivery: string | null
          id: string
          location_address: string | null
          location_lat: number | null
          location_lng: number | null
          notes: string | null
          order_id: string
        }
        Insert: {
          created_at?: string
          current_status: Database["public"]["Enums"]["delivery_status"]
          delivery_partner_id?: string | null
          estimated_delivery?: string | null
          id?: string
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
          notes?: string | null
          order_id: string
        }
        Update: {
          created_at?: string
          current_status?: Database["public"]["Enums"]["delivery_status"]
          delivery_partner_id?: string | null
          estimated_delivery?: string | null
          id?: string
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
          notes?: string | null
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_tracking_delivery_partner_id_fkey"
            columns: ["delivery_partner_id"]
            isOneToOne: false
            referencedRelation: "delivery_partner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_tracking_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      farmer_profiles: {
        Row: {
          created_at: string
          crops_grown: string[] | null
          farm_location: string
          farming_experience_years: number | null
          full_name: string
          id: string
          land_area_acres: number | null
          organic_certified: boolean | null
          profile_id: string
        }
        Insert: {
          created_at?: string
          crops_grown?: string[] | null
          farm_location: string
          farming_experience_years?: number | null
          full_name: string
          id?: string
          land_area_acres?: number | null
          organic_certified?: boolean | null
          profile_id: string
        }
        Update: {
          created_at?: string
          crops_grown?: string[] | null
          farm_location?: string
          farming_experience_years?: number | null
          full_name?: string
          id?: string
          land_area_acres?: number | null
          organic_certified?: boolean | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "farmer_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          arrival_date: string | null
          created_at: string
          expiry_date: string | null
          id: string
          notes: string | null
          product_id: string
          quality_grade: string | null
          quantity_stored: number
          reserved_quantity: number
          storage_fee_per_kg: number | null
          updated_at: string
          warehouse_id: string
        }
        Insert: {
          arrival_date?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          notes?: string | null
          product_id: string
          quality_grade?: string | null
          quantity_stored?: number
          reserved_quantity?: number
          storage_fee_per_kg?: number | null
          updated_at?: string
          warehouse_id: string
        }
        Update: {
          arrival_date?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          notes?: string | null
          product_id?: string
          quality_grade?: string | null
          quantity_stored?: number
          reserved_quantity?: number
          storage_fee_per_kg?: number | null
          updated_at?: string
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouse_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      market_prices: {
        Row: {
          created_at: string
          crop_id: string | null
          date_recorded: string
          id: string
          location: string
          market_name: string
          price_per_unit: number
          quality_grade: string | null
          source: string | null
          unit: string
        }
        Insert: {
          created_at?: string
          crop_id?: string | null
          date_recorded?: string
          id?: string
          location: string
          market_name: string
          price_per_unit: number
          quality_grade?: string | null
          source?: string | null
          unit?: string
        }
        Update: {
          created_at?: string
          crop_id?: string | null
          date_recorded?: string
          id?: string
          location?: string
          market_name?: string
          price_per_unit?: number
          quality_grade?: string | null
          source?: string | null
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "market_prices_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          created_at: string
          id: string
          message: string
          order_id: string | null
          read_at: string | null
          receiver_id: string
          sender_id: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          order_id?: string | null
          read_at?: string | null
          receiver_id: string
          sender_id: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          order_id?: string | null
          read_at?: string | null
          receiver_id?: string
          sender_id?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_id: string
          delivery_address: string
          delivery_date: string | null
          delivery_fee: number | null
          delivery_partner_id: string | null
          delivery_status: Database["public"]["Enums"]["delivery_status"] | null
          id: string
          order_number: string
          payment_id: string | null
          payment_method: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          special_instructions: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          subtotal: number
          tax_amount: number | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          delivery_address: string
          delivery_date?: string | null
          delivery_fee?: number | null
          delivery_partner_id?: string | null
          delivery_status?: Database["public"]["Enums"]["delivery_status"] | null
          id?: string
          order_number: string
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal: number
          tax_amount?: number | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          delivery_address?: string
          delivery_date?: string | null
          delivery_fee?: number | null
          delivery_partner_id?: string | null
          delivery_status?: Database["public"]["Enums"]["delivery_status"] | null
          id?: string
          order_number?: string
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_delivery_partner_id_fkey"
            columns: ["delivery_partner_id"]
            isOneToOne: false
            referencedRelation: "delivery_partner_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          is_primary: boolean | null
          product_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          is_primary?: boolean | null
          product_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          is_primary?: boolean | null
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          available_quantity: number
          category: Database["public"]["Enums"]["product_category"]
          created_at: string
          description: string | null
          expiry_date: string | null
          farmer_id: string
          featured: boolean | null
          harvest_date: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          location: string
          minimum_order: number | null
          name: string
          organic: boolean | null
          original_price: number | null
          price: number
          unit: string
          updated_at: string
        }
        Insert: {
          available_quantity: number
          category: Database["public"]["Enums"]["product_category"]
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          farmer_id: string
          featured?: boolean | null
          harvest_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location: string
          minimum_order?: number | null
          name: string
          organic?: boolean | null
          original_price?: number | null
          price: number
          unit?: string
          updated_at?: string
        }
        Update: {
          available_quantity?: number
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          farmer_id?: string
          featured?: boolean | null
          harvest_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string
          minimum_order?: number | null
          name?: string
          organic?: boolean | null
          original_price?: number | null
          price?: number
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Insert: {
          created_at?: string
          id?: string
          phone?: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Update: {
          created_at?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string
          customer_id: string
          farmer_id: string | null
          id: string
          images: string[] | null
          is_verified: boolean | null
          order_id: string | null
          product_id: string | null
          rating: number
          review_text: string | null
        }
        Insert: {
          created_at?: string
          customer_id: string
          farmer_id?: string | null
          id?: string
          images?: string[] | null
          is_verified?: boolean | null
          order_id?: string | null
          product_id?: string | null
          rating: number
          review_text?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string
          farmer_id?: string | null
          id?: string
          images?: string[] | null
          is_verified?: boolean | null
          order_id?: string | null
          product_id?: string | null
          rating?: number
          review_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      storage_transactions: {
        Row: {
          created_at: string
          created_by: string
          id: string
          inventory_id: string
          notes: string | null
          quantity: number
          reference_order_id: string | null
          transaction_type: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          inventory_id: string
          notes?: string | null
          quantity: number
          reference_order_id?: string | null
          transaction_type: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          inventory_id?: string
          notes?: string | null
          quantity?: number
          reference_order_id?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "storage_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storage_transactions_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storage_transactions_reference_order_id_fkey"
            columns: ["reference_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_documents: {
        Row: {
          document_type: string
          document_url: string
          id: string
          profile_id: string
          uploaded_at: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          document_type: string
          document_url: string
          id?: string
          profile_id: string
          uploaded_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          document_type?: string
          document_url?: string
          id?: string
          profile_id?: string
          uploaded_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_documents_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouse_profiles: {
        Row: {
          business_name: string
          capacity_tons: number
          certifications: string[] | null
          contact_person: string | null
          created_at: string
          facilities: string[] | null
          id: string
          location: string
          operating_hours: string | null
          profile_id: string
        }
        Insert: {
          business_name: string
          capacity_tons: number
          certifications?: string[] | null
          contact_person?: string | null
          created_at?: string
          facilities?: string[] | null
          id?: string
          location: string
          operating_hours?: string | null
          profile_id: string
        }
        Update: {
          business_name?: string
          capacity_tons?: number
          certifications?: string[] | null
          contact_person?: string | null
          created_at?: string
          facilities?: string[] | null
          id?: string
          location?: string
          operating_hours?: string | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "warehouse_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weather_data: {
        Row: {
          condition: string | null
          created_at: string
          forecast_data: Json | null
          humidity: number | null
          id: string
          latitude: number | null
          location: string
          longitude: number | null
          precipitation: number | null
          recorded_at: string
          temperature: number | null
          wind_speed: number | null
        }
        Insert: {
          condition?: string | null
          created_at?: string
          forecast_data?: Json | null
          humidity?: number | null
          id?: string
          latitude?: number | null
          location: string
          longitude?: number | null
          precipitation?: number | null
          recorded_at?: string
          temperature?: number | null
          wind_speed?: number | null
        }
        Update: {
          condition?: string | null
          created_at?: string
          forecast_data?: Json | null
          humidity?: number | null
          id?: string
          latitude?: number | null
          location?: string
          longitude?: number | null
          precipitation?: number | null
          recorded_at?: string
          temperature?: number | null
          wind_speed?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_farmer_rating: {
        Args: {
          farmer_profile_id: string
        }
        Returns: number
      }
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      delivery_status: "pending" | "assigned" | "picked_up" | "in_transit" | "delivered" | "failed"
      order_status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
      payment_status: "pending" | "paid" | "failed" | "refunded"
      product_category: "grains" | "vegetables" | "fruits" | "pulses" | "spices" | "dairy" | "other"
      user_role: "farmer" | "customer" | "warehouse" | "delivery_partner"
      verification_status: "pending" | "verified" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
