import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Progress } from '../../components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Checkbox
} from '../../components/ui/checkbox';
import {
  ShoppingCart,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  ArrowLeft,
  Shield,
  Clock,
  Star,
  Phone,
  Mail,
  User,
  Package,
  DollarSign,
  AlertCircle,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';
import { paymentService, PaymentDetails, PaymentResult } from '../../services/paymentService';

import { useAuth } from '../../contexts/AuthContext';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  
  // Mock cart data - in real app, this would come from context/state management
  const [cart] = useState([
    {
      id: 'P001',
      name: 'Premium Basmati Rice',
      farmer: 'Ram Kumar Sharma',
      price: 75,
      quantity: 2,
      unit: 'kg',
      image: '/placeholder.svg',
      organic: true
    },
    {
      id: 'P002',
      name: 'Fresh Organic Tomatoes',
      farmer: 'Sita Devi',
      price: 25,
      quantity: 1,
      unit: 'kg',
      image: '/placeholder.svg',
      organic: true
    }
  ]);

  const [deliveryDetails, setDeliveryDetails] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    deliveryInstructions: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [deliveryOption, setDeliveryOption] = useState('standard');

  const deliveryOptions = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      time: '2-3 business days',
      price: 50,
      description: 'Regular delivery service'
    },
    {
      id: 'express',
      name: 'Express Delivery',
      time: 'Same day',
      price: 150,
      description: 'Fast delivery for urgent orders'
    },
    {
      id: 'scheduled',
      name: 'Scheduled Delivery',
      time: 'Choose your time',
      price: 75,
      description: 'Deliver at your preferred time'
    }
  ];

  const paymentMethods = [
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: DollarSign
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Secure online payment',
      icon: CreditCard
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      description: 'Pay using UPI apps',
      icon: CreditCard
    }
  ];

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const selectedDelivery = deliveryOptions.find(option => option.id === deliveryOption);
  const deliveryFee = selectedDelivery?.price || 0;
  const total = subtotal + deliveryFee;

  const handleInputChange = (field: string, value: string) => {
    setDeliveryDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate delivery details
      if (!deliveryDetails.fullName || !deliveryDetails.phone || !deliveryDetails.address) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required delivery details",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setPaymentProcessing(true);

    try {
      const orderId = `ORD-${Date.now()}`;
      
      // Prepare payment details
      const paymentDetails: PaymentDetails = {
        amount: total + (paymentMethod === 'cod' ? 20 : 0),
        currency: 'BDT',
        orderId: orderId,
        customerName: deliveryDetails.fullName,
        customerEmail: deliveryDetails.email || user?.email || '',
        customerPhone: deliveryDetails.phone,
        description: `KrishiBondhu Order - ${cart.length} items`,
      };

      let paymentResult: PaymentResult;

      // Process payment based on selected method
      switch (paymentMethod) {
        case 'cod':
          paymentResult = await paymentService.processCODPayment(paymentDetails);
          break;
          
        case 'card':
          // Initialize Stripe payment
          const stripeData = await paymentService.initializeStripe(paymentDetails);
          paymentResult = await paymentService.confirmStripePayment(
            stripeData.stripe,
            stripeData.clientSecret,
            stripeData.cardElement,
            paymentDetails
          );
          break;
          
        case 'upi':
          // Generate UPI payment URL and open
          const upiUrl = await paymentService.initializeUPIPayment(paymentDetails);
          window.open(upiUrl, '_blank');
          
          // For demo, simulate successful payment after 3 seconds
          await new Promise(resolve => setTimeout(resolve, 3000));
          paymentResult = {
            success: true,
            paymentId: `UPI_${orderId}`,
            transactionId: orderId,
            gateway: 'cod' as const
          };
          break;
          
        default:
          // Razorpay as default
          const razorpay = await paymentService.initializeRazorpay(paymentDetails);
          razorpay.open();
          
          // For demo, simulate successful payment
          paymentResult = {
            success: true,
            paymentId: `RZP_${orderId}`,
            transactionId: orderId,
            gateway: 'razorpay' as const
          };
          break;
      }

      if (paymentResult.success) {

        toast({
          title: "Order Placed Successfully!",
          description: `Payment processed via ${paymentResult.gateway}. Order ID: ${orderId}`,
        });

        // Navigate to order confirmation with payment details
        navigate('/customer/order-confirmation', {
          state: {
            orderId,
            paymentId: paymentResult.paymentId,
            transactionId: paymentResult.transactionId,
            amount: paymentDetails.amount
          }
        });
      } else {
        throw new Error(paymentResult.error || 'Payment failed');
      }

    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Order Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setPaymentProcessing(false);
    }
  };

  const steps = [
    { id: 1, name: 'Delivery Details', icon: MapPin },
    { id: 2, name: 'Payment Method', icon: CreditCard },
    { id: 3, name: 'Review & Confirm', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/customer/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shopping
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600">Complete your purchase securely</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-green-600 border-green-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Delivery Details */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Delivery Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={deliveryDetails.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={deliveryDetails.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={deliveryDetails.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email address"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Textarea
                      id="address"
                      value={deliveryDetails.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter your complete delivery address"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={deliveryDetails.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={deliveryDetails.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="Enter state"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        value={deliveryDetails.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        placeholder="Enter postal code"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="instructions">Delivery Instructions</Label>
                    <Textarea
                      id="instructions"
                      value={deliveryDetails.deliveryInstructions}
                      onChange={(e) => handleInputChange('deliveryInstructions', e.target.value)}
                      placeholder="Any special instructions for delivery (optional)"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          paymentMethod === method.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            paymentMethod === method.id
                              ? 'border-green-500 bg-green-500'
                              : 'border-gray-300'
                          }`}>
                            {paymentMethod === method.id && (
                              <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                            )}
                          </div>
                          <method.icon className="h-5 w-5 text-gray-600" />
                          <div className="flex-1">
                            <h3 className="font-medium">{method.name}</h3>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Review & Confirm */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Review & Confirm Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Summary */}
                  <div>
                    <h3 className="font-semibold mb-3">Order Summary</h3>
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={item.image} />
                            <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-600">by {item.farmer}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              {item.organic && (
                                <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                                  Organic
                                </Badge>
                              )}
                              <span className="text-xs text-gray-500">
                                {item.quantity} {item.unit}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                                              <p className="font-medium">৳{item.price * item.quantity}</p>
                  <p className="text-sm text-gray-600">৳{item.price} per {item.unit}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Details */}
                  <div>
                    <h3 className="font-semibold mb-3">Delivery Details</h3>
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                        <div>
                          <p className="font-medium">{deliveryDetails.fullName}</p>
                          <p className="text-sm text-gray-600">{deliveryDetails.address}</p>
                          <p className="text-sm text-gray-600">
                            {deliveryDetails.city}, {deliveryDetails.state} {deliveryDetails.postalCode}
                          </p>
                          <p className="text-sm text-gray-600">Phone: {deliveryDetails.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="font-semibold mb-3">Payment Method</h3>
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium">
                            {paymentMethods.find(m => m.id === paymentMethod)?.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {paymentMethods.find(m => m.id === paymentMethod)?.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < 3 ? (
                <Button onClick={handleNextStep}>
                  Continue
                </Button>
              ) : (
                <Button 
                  onClick={handlePlaceOrder}
                  disabled={loading || paymentProcessing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {paymentProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processing Payment...
                    </>
                  ) : loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Place Order
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Delivery Option */}
                <div>
                  <h4 className="font-medium mb-2">Delivery Option</h4>
                  <div className="space-y-2">
                    {deliveryOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-all ${
                          deliveryOption === option.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200'
                        }`}
                        onClick={() => setDeliveryOption(option.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{option.name}</p>
                            <p className="text-xs text-gray-600">{option.time}</p>
                          </div>
                          <p className="font-medium">৳{option.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal ({cart.length} items)</span>
                      <span>৳{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>৳{deliveryFee}</span>
                    </div>
                    {paymentMethod === 'cod' && (
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>COD Fee</span>
                        <span>৳20</span>
                      </div>
                    )}
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>৳{total + (paymentMethod === 'cod' ? 20 : 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>Secure checkout with SSL encryption</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 