import { supabase } from '../integrations/supabase/client';
import type { Database } from '../integrations/supabase/types';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];
type OrderWithDetails = Order & {
  order_items: (OrderItem & {
    products: Database['public']['Tables']['products']['Row'];
  })[];
  customer_profiles: Database['public']['Tables']['customer_profiles']['Row'];
  delivery_tracking?: Database['public']['Tables']['delivery_tracking']['Row'];
};

export class OrdersAPI {
  // Get orders for a customer
  static async getCustomerOrders(customerId: string, options: { 
    limit?: number; 
    status?: Database['public']['Enums']['order_status'] 
  } = {}) {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            products(name, image_url, unit)
          ),
          delivery_tracking(current_status, estimated_delivery, location_address)
        `)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (options.status) {
        query = query.eq('status', options.status);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        success: true,
        data: data as any[],
        error: null
      };
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      return {
        success: false,
        data: [],
        error: error as Error
      };
    }
  }

  // Get order by ID with full details
  static async getOrderById(orderId: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            products(
              name,
              image_url,
              unit,
              farmer_profiles(full_name, farm_location)
            )
          ),
          customer_profiles(full_name, delivery_address, city, phone),
          delivery_tracking(
            current_status,
            estimated_delivery,
            location_address,
            location_lat,
            location_lng,
            delivery_partner_profiles(full_name, phone, vehicle_type)
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
        error: null
      };
    } catch (error) {
      console.error('Error fetching order:', error);
      return {
        success: false,
        data: null,
        error: error as Error
      };
    }
  }

  // Create new order
  static async createOrder(orderData: {
    customer_id: string;
    items: { product_id: string; quantity: number; unit_price: number }[];
    delivery_address: string;
    special_instructions?: string;
  }) {
    try {
      // Calculate totals
      const subtotal = orderData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
      const tax_amount = subtotal * 0.18; // 18% GST
      const delivery_fee = subtotal > 500 ? 0 : 50; // Free delivery above ৳500
      const total_amount = subtotal + tax_amount + delivery_fee;

      // Generate order number
      const { data: orderNumberData, error: orderNumberError } = await supabase
        .rpc('generate_order_number');

      if (orderNumberError) throw orderNumberError;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: orderData.customer_id,
          order_number: orderNumberData,
          delivery_address: orderData.delivery_address,
          special_instructions: orderData.special_instructions,
          subtotal,
          tax_amount,
          delivery_fee,
          total_amount,
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return {
        success: true,
        data: order,
        error: null
      };
    } catch (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        data: null,
        error: error as Error
      };
    }
  }

  // Update order status
  static async updateOrderStatus(orderId: string, status: Database['public']['Enums']['order_status']) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
        error: null
      };
    } catch (error) {
      console.error('Error updating order status:', error);
      return {
        success: false,
        data: null,
        error: error as Error
      };
    }
  }

  // Get orders for farmer's products
  static async getFarmerOrders(farmerId: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items!inner(
            *,
            products!inner(name, farmer_id)
          ),
          customer_profiles(full_name, city, phone)
        `)
        .eq('order_items.products.farmer_id', farmerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data,
        error: null
      };
    } catch (error) {
      console.error('Error fetching farmer orders:', error);
      return {
        success: false,
        data: [],
        error: error as Error
      };
    }
  }

  // Get delivery partner orders
  static async getDeliveryPartnerOrders(deliveryPartnerId: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            products(name, image_url)
          ),
          customer_profiles(full_name, delivery_address, phone),
          delivery_tracking(current_status, location_address)
        `)
        .eq('delivery_partner_id', deliveryPartnerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data,
        error: null
      };
    } catch (error) {
      console.error('Error fetching delivery partner orders:', error);
      return {
        success: false,
        data: [],
        error: error as Error
      };
    }
  }

  // Cancel order
  static async cancelOrder(orderId: string, reason?: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
        error: null
      };
    } catch (error) {
      console.error('Error cancelling order:', error);
      return {
        success: false,
        data: null,
        error: error as Error
      };
    }
  }
}
