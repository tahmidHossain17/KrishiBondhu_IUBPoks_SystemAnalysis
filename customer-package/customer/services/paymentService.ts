import { env } from '../config/env';

export interface PaymentDetails {
  amount: number;
  currency: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  description: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  transactionId?: string;
  error?: string;
  gateway: 'razorpay' | 'stripe' | 'cod';
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

class PaymentService {
  private razorpayKey: string;
  private stripeKey: string;

  constructor() {
    this.razorpayKey = env.VITE_RAZORPAY_KEY || '';
    this.stripeKey = env.VITE_STRIPE_KEY || '';
  }

  // Razorpay Integration
  async initializeRazorpay(paymentDetails: PaymentDetails): Promise<any> {
    try {
      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        await this.loadRazorpayScript();
      }

      // Create order on backend
      const orderResponse = await fetch('/api/payment/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentDetails.amount * 100, // Convert to paise
          currency: paymentDetails.currency,
          receipt: paymentDetails.orderId,
        }),
      });

      const orderData = await orderResponse.json();

      const options = {
        key: this.razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'KrishiBondhu',
        description: paymentDetails.description,
        order_id: orderData.id,
        handler: (response: RazorpayResponse) => {
          return this.verifyRazorpayPayment(response);
        },
        prefill: {
          name: paymentDetails.customerName,
          email: paymentDetails.customerEmail,
          contact: paymentDetails.customerPhone,
        },
        theme: {
          color: '#16a34a', // Green theme for KrishiBondhu
        },
        modal: {
          ondismiss: () => {
            console.log('Payment cancelled by user');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      return razorpay;

    } catch (error) {
      console.error('Error initializing Razorpay:', error);
      throw new Error('Failed to initialize payment');
    }
  }

  private async loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay script'));
      document.head.appendChild(script);
    });
  }

  private async verifyRazorpayPayment(response: RazorpayResponse): Promise<PaymentResult> {
    try {
      const verificationResponse = await fetch('/api/payment/razorpay/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        }),
      });

      const verificationData = await verificationResponse.json();

      if (verificationData.success) {
        return {
          success: true,
          paymentId: response.razorpay_payment_id,
          transactionId: response.razorpay_order_id,
          gateway: 'razorpay',
        };
      } else {
        return {
          success: false,
          error: 'Payment verification failed',
          gateway: 'razorpay',
        };
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      return {
        success: false,
        error: 'Payment verification failed',
        gateway: 'razorpay',
      };
    }
  }

  // Stripe Integration
  async initializeStripe(paymentDetails: PaymentDetails): Promise<any> {
    try {
      // Load Stripe script if not already loaded
      if (!window.Stripe) {
        await this.loadStripeScript();
      }

      const stripe = window.Stripe(this.stripeKey);

      // Create payment intent on backend
      const paymentIntentResponse = await fetch('/api/payment/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentDetails.amount * 100, // Convert to cents
          currency: paymentDetails.currency.toLowerCase(),
          metadata: {
            orderId: paymentDetails.orderId,
            customerName: paymentDetails.customerName,
          },
        }),
      });

      const { client_secret } = await paymentIntentResponse.json();

      const elements = stripe.elements();
      const cardElement = elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
        },
      });

      return { stripe, cardElement, clientSecret: client_secret };

    } catch (error) {
      console.error('Error initializing Stripe:', error);
      throw new Error('Failed to initialize payment');
    }
  }

  private async loadStripeScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Stripe script'));
      document.head.appendChild(script);
    });
  }

  async confirmStripePayment(
    stripe: any,
    clientSecret: string,
    cardElement: any,
    paymentDetails: PaymentDetails
  ): Promise<PaymentResult> {
    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: paymentDetails.customerName,
            email: paymentDetails.customerEmail,
            phone: paymentDetails.customerPhone,
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message,
          gateway: 'stripe',
        };
      }

      if (paymentIntent.status === 'succeeded') {
        return {
          success: true,
          paymentId: paymentIntent.id,
          transactionId: paymentIntent.id,
          gateway: 'stripe',
        };
      }

      return {
        success: false,
        error: 'Payment not completed',
        gateway: 'stripe',
      };

    } catch (error) {
      console.error('Error confirming Stripe payment:', error);
      return {
        success: false,
        error: 'Payment processing failed',
        gateway: 'stripe',
      };
    }
  }

  // UPI Payment Integration
  async initializeUPIPayment(paymentDetails: PaymentDetails): Promise<string> {
    try {
      // Generate UPI payment URL
      const upiId = 'krishibondhu@paytm'; // Your UPI ID
      const amount = paymentDetails.amount;
      const note = encodeURIComponent(paymentDetails.description);
      const transactionId = `KB${Date.now()}`;

      const upiUrl = `upi://pay?pa=${upiId}&pn=KrishiBondhu&am=${amount}&cu=${paymentDetails.currency}&tn=${note}&tr=${transactionId}`;

      return upiUrl;
    } catch (error) {
      console.error('Error generating UPI payment URL:', error);
      throw new Error('Failed to generate UPI payment URL');
    }
  }

  // Cash on Delivery
  async processCODPayment(paymentDetails: PaymentDetails): Promise<PaymentResult> {
    try {
      // Record COD order in backend
      const codResponse = await fetch('/api/payment/cod/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: paymentDetails.orderId,
          amount: paymentDetails.amount,
          customerName: paymentDetails.customerName,
          customerPhone: paymentDetails.customerPhone,
        }),
      });

      const codData = await codResponse.json();

      if (codData.success) {
        return {
          success: true,
          paymentId: `COD_${paymentDetails.orderId}`,
          transactionId: codData.transactionId,
          gateway: 'cod',
        };
      }

      return {
        success: false,
        error: 'Failed to process COD order',
        gateway: 'cod',
      };

    } catch (error) {
      console.error('Error processing COD payment:', error);
      return {
        success: false,
        error: 'COD order processing failed',
        gateway: 'cod',
      };
    }
  }

  // Payment Status Verification
  async verifyPaymentStatus(paymentId: string, gateway: string): Promise<any> {
    try {
      const response = await fetch(`/api/payment/${gateway}/status/${paymentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await response.json();
    } catch (error) {
      console.error('Error verifying payment status:', error);
      throw new Error('Payment status verification failed');
    }
  }

  // Refund Processing
  async processRefund(paymentId: string, amount: number, gateway: string): Promise<any> {
    try {
      const response = await fetch(`/api/payment/${gateway}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          amount: amount * 100, // Convert to smallest currency unit
        }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error processing refund:', error);
      throw new Error('Refund processing failed');
    }
  }

  // Utility Methods
  formatAmount(amount: number, currency: string = 'BDT'): string {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  validatePaymentAmount(amount: number): boolean {
    return amount > 0 && amount <= 500000; // Max ৳5,00,000
  }

  generateTransactionId(): string {
    return `KB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Extend Window interface for payment gateways
declare global {
  interface Window {
    Razorpay: any;
    Stripe: any;
  }
}

export const paymentService = new PaymentService();