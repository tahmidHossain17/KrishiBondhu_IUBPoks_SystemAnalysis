import axios from 'axios';
import { env, API_ENDPOINTS } from '../config/env';

export interface Product {
  id: string;
  name: string;
  farmer: string;
  farmerRating: number;
  price: number;
  originalPrice?: number;
  quantity: string;
  unit: string;
  category: string;
  image: string;
  harvestDate: string;
  expiryDate: string;
  location: string;
  organic: boolean;
  inStock: boolean;
  discount: number;
  description?: string;
  farmerPhone?: string;
  farmerEmail?: string;
}

export interface CartItem {
  id: string;
  name: string;
  farmer: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
  organic: boolean;
}

export interface Order {
  id: string;
  orderDate: string;
  status: 'processing' | 'in_transit' | 'delivered' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
  deliveryDate?: string;
  estimatedDelivery?: string;
  deliveryPartner: string;
  trackingNumber: string;
  deliveryAddress: string;
  paymentMethod: string;
  farmer: string;
  progress?: number;
  rating?: number;
  review?: string;
  cancellationReason?: string;
}

export interface OrderItem {
  name: string;
  quantity: string;
  price: number;
}

export interface DeliveryDetails {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  deliveryInstructions?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface DeliveryOption {
  id: string;
  name: string;
  time: string;
  price: number;
  description: string;
}

export interface OrderTracking {
  id: string;
  status: string;
  progress: number;
  orderDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryPartner: string;
  deliveryPartnerPhone: string;
  trackingNumber: string;
  deliveryAddress: string;
  paymentMethod: string;
  farmer: string;
  farmerPhone: string;
  currentLocation?: { lat: number; lng: number };
  pickupLocation: string;
  deliveryLocation: string;
  timeline: TrackingTimeline[];
  deliveryUpdates: DeliveryUpdate[];
  routeInfo: RouteInfo;
}

export interface TrackingTimeline {
  step: string;
  time: string;
  status: 'completed' | 'active' | 'pending';
  description: string;
}

export interface DeliveryUpdate {
  time: string;
  message: string;
  location: string;
}

export interface RouteInfo {
  totalDistance: string;
  remainingDistance: string;
  estimatedTime: string;
  currentSpeed: string;
  trafficCondition: string;
  weatherCondition: string;
}

class CustomerService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_ENDPOINTS.customer || 'http://localhost:3001/api/customer';
  }

  // Product Management using Supabase
  async getProducts(filters?: {
    category?: string;
    search?: string;
    organic?: boolean;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Product[]> {
    try {
      // Import Supabase products API
      const { ProductsAPI } = await import('./productsApi');
      const result = await ProductsAPI.getProducts({});
      return result.data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async getProductById(productId: string): Promise<Product | null> {
    try {
      // Import Supabase products API
      const { ProductsAPI } = await import('./productsApi');
      const result = await ProductsAPI.getProductById(productId);
      return result.data || null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      // Import Supabase products API
      const { ProductsAPI } = await import('./productsApi');
      const result = await ProductsAPI.getFeaturedProducts();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  }

  // Cart Management
  async getCart(customerId: string): Promise<CartItem[]> {
    try {
      const response = await axios.get(`${this.baseURL}/cart/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw new Error('Failed to fetch cart');
    }
  }

  async addToCart(customerId: string, productId: string, quantity: number): Promise<void> {
    try {
      await axios.post(`${this.baseURL}/cart/${customerId}/items`, {
        productId,
        quantity
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw new Error('Failed to add item to cart');
    }
  }

  async updateCartItem(customerId: string, productId: string, quantity: number): Promise<void> {
    try {
      await axios.put(`${this.baseURL}/cart/${customerId}/items/${productId}`, {
        quantity
      });
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw new Error('Failed to update cart item');
    }
  }

  async removeFromCart(customerId: string, productId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseURL}/cart/${customerId}/items/${productId}`);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw new Error('Failed to remove item from cart');
    }
  }

  async clearCart(customerId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseURL}/cart/${customerId}`);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw new Error('Failed to clear cart');
    }
  }

  // Order Management
  async getOrders(customerId: string): Promise<Order[]> {
    try {
      const response = await axios.get(`${this.baseURL}/orders/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error('Failed to fetch orders');
    }
  }

  async getOrderById(orderId: string): Promise<Order> {
    try {
      const response = await axios.get(`${this.baseURL}/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw new Error('Failed to fetch order details');
    }
  }

  async placeOrder(customerId: string, orderData: {
    items: CartItem[];
    deliveryDetails: DeliveryDetails;
    paymentMethod: string;
    deliveryOption: string;
  }): Promise<{ orderId: string; trackingNumber: string }> {
    try {
      const response = await axios.post(`${this.baseURL}/orders`, {
        customerId,
        ...orderData
      });
      return response.data;
    } catch (error) {
      console.error('Error placing order:', error);
      throw new Error('Failed to place order');
    }
  }

  async cancelOrder(orderId: string, reason: string): Promise<void> {
    try {
      await axios.post(`${this.baseURL}/orders/${orderId}/cancel`, { reason });
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw new Error('Failed to cancel order');
    }
  }

  // Order Tracking
  async trackOrder(orderId: string): Promise<OrderTracking> {
    try {
      const response = await axios.get(`${this.baseURL}/orders/${orderId}/tracking`);
      return response.data;
    } catch (error) {
      console.error('Error tracking order:', error);
      throw new Error('Failed to track order');
    }
  }

  // Payment Methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await axios.get(`${this.baseURL}/payment-methods`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw new Error('Failed to fetch payment methods');
    }
  }

  // Delivery Options
  async getDeliveryOptions(deliveryAddress: string): Promise<DeliveryOption[]> {
    try {
      const response = await axios.post(`${this.baseURL}/delivery-options`, {
        deliveryAddress
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching delivery options:', error);
      throw new Error('Failed to fetch delivery options');
    }
  }

  // Reviews and Ratings
  async submitReview(orderId: string, reviewData: {
    rating: number;
    review: string;
    productId: string;
  }): Promise<void> {
    try {
      await axios.post(`${this.baseURL}/orders/${orderId}/review`, reviewData);
    } catch (error) {
      console.error('Error submitting review:', error);
      throw new Error('Failed to submit review');
    }
  }

  async getProductReviews(productId: string): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseURL}/products/${productId}/reviews`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      throw new Error('Failed to fetch product reviews');
    }
  }

  // Notifications
  async getNotifications(customerId: string): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseURL}/notifications/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw new Error('Failed to fetch notifications');
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await axios.put(`${this.baseURL}/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  }

  // Wishlist
  async getWishlist(customerId: string): Promise<Product[]> {
    try {
      const response = await axios.get(`${this.baseURL}/wishlist/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw new Error('Failed to fetch wishlist');
    }
  }

  async addToWishlist(customerId: string, productId: string): Promise<void> {
    try {
      await axios.post(`${this.baseURL}/wishlist/${customerId}/items`, {
        productId
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw new Error('Failed to add item to wishlist');
    }
  }

  async removeFromWishlist(customerId: string, productId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseURL}/wishlist/${customerId}/items/${productId}`);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw new Error('Failed to remove item from wishlist');
    }
  }

  // Utility Methods
  formatPrice(price: number): string {
    return `৳${price.toFixed(2)}`;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  formatDateTime(date: string): string {
    return new Date(date).toLocaleString();
  }

  calculateDiscount(originalPrice: number, currentPrice: number): number {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  calculateCartTotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

}

export const customerService = new CustomerService(); 