import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Progress } from '../../components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import {
  ShoppingCart,
  Package,
  Truck,
  Star,
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
  Heart,
  Eye,
  ShoppingBag,
  User,
  Bell,
  Settings,
  LogOut,
  Plus,
  Minus,
  Calendar,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ProductsAPI } from '../../services/productsApi';

import { fadeInUp, staggerFadeIn, scrollTriggerAnimation } from '../../lib/animations';
import { useCardHover, useButtonHover } from '../../hooks/useGSAP';

const CustomerDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileComplete, setProfileComplete] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileSkipped, setProfileSkipped] = useState(false);

  // Animation refs
  const headerRef = useRef<HTMLDivElement>(null);
  const quickStatsRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const ordersRef = useRef<HTMLDivElement>(null);

  // Add hover effects to buttons
  const checkoutButtonRef = useRef<HTMLButtonElement>(null);
  useButtonHover(checkoutButtonRef);

  // Load real data from APIs
  const loadFeaturedProducts = async () => {
    try {
      const result = await ProductsAPI.getFeaturedProducts({ limit: 4 });
      if (result.success && result.data) {
        const transformedProducts = result.data.map(product => ({
          id: product.id,
          name: product.name,
          farmer: product.farmer_profiles?.full_name || 'Unknown Farmer',
          farmerRating: 4.5, // Default rating - would come from farmer profile
          price: product.price,
          originalPrice: product.original_price || product.price,
          quantity: `${product.available_quantity} ${product.unit}`,
          unit: product.unit,
          category: product.category,
          image: product.image_url || '/placeholder.svg',
          harvestDate: product.harvest_date,
          expiryDate: product.expiry_date,
          location: product.location,
          organic: product.organic,
          inStock: product.available_quantity > 0,
          discount: product.original_price ? 
            Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0
        }));
        setFeaturedProducts(transformedProducts);
      } else {
        setFeaturedProducts([]);
      }
    } catch (error) {
      console.error('Error loading featured products:', error);
      setFeaturedProducts([]);
    }
  };

  const loadRecentOrders = async () => {
    try {
      // Note: Would need to implement OrdersAPI.getUserOrders() 
      // For now, set empty array until orders API is implemented
      setRecentOrders([]);
    } catch (error) {
      console.error('Error loading recent orders:', error);
      setRecentOrders([]);
    }
  };

  const categories = [
    { id: 'all', name: 'All Products', icon: ShoppingBag },
    { id: 'grains', name: 'Grains', icon: Package },
    { id: 'vegetables', name: 'Vegetables', icon: ShoppingBag },
    { id: 'fruits', name: 'Fruits', icon: ShoppingBag },
    { id: 'dairy', name: 'Dairy', icon: ShoppingBag },
    { id: 'organic', name: 'Organic', icon: ShoppingBag }
  ];

  useEffect(() => {
    // Check profile completion status
    const checkProfileCompletion = () => {
      // Mock profile completion check - in real app, this would check user metadata
      const hasBasicInfo = user?.user_metadata?.full_name && user?.user_metadata?.phone;
      const hasAddress = user?.user_metadata?.delivery_address && user?.user_metadata?.city;
      const isComplete = hasBasicInfo && hasAddress;
      
      setProfileComplete(isComplete);
      
      // Show profile modal if profile is not complete and not skipped
      const skipStatus = localStorage.getItem(`profile_skipped_${user?.id}`);
      setProfileSkipped(!!skipStatus);
      
      if (!isComplete && !skipStatus) {
        setShowProfileModal(true);
      }
    };

    // Load real data
    loadFeaturedProducts();
    loadRecentOrders();
    setLoading(false);
    
    if (user) {
      checkProfileCompletion();
    }

    // Initialize animations
    if (headerRef.current) {
      fadeInUp(headerRef.current, { delay: 0.2 });
    }
    
    if (quickStatsRef.current) {
              staggerFadeIn(Array.from(quickStatsRef.current.children), { delay: 0.4 });
    }
    
    if (productsRef.current) {
      scrollTriggerAnimation(productsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      });
    }
    
    if (cartRef.current) {
      scrollTriggerAnimation(cartRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out"
      });
    }


  }, [user, toast]);

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
    toast({
      title: "Removed from Cart",
      description: "Item has been removed from your cart",
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity }
        : item
    ));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSkipProfile = () => {
    localStorage.setItem(`profile_skipped_${user?.id}`, 'true');
    setProfileSkipped(true);
    setShowProfileModal(false);
    
    toast({
      title: "Profile Setup Skipped",
      description: "You can complete your profile later from settings. Some features may be limited.",
      variant: "default"
    });
  };

  const handleCompleteProfile = () => {
    setShowProfileModal(false);
    // Navigate to profile completion page
    navigate('/customer/profile');
  };

  const isFeatureRestricted = () => {
    return !profileComplete && !profileSkipped;
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'in_transit': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredProducts = featuredProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.farmer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">KrishiBondhu</h1>
              <span className="text-sm text-gray-600">Fresh from Farm to Table</span>
              {!profileComplete && profileSkipped && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                  Profile Incomplete
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="relative"
                    onClick={() => {
                      setUnreadCount(0);
                      // Show notifications dropdown (implement as needed)
                    }}
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Button>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={async () => {
                    await signOut();
                    navigate('/auth/login');
                  }}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild>
                    <a href="/auth/login">
                      Login
                    </a>
                  </Button>
                  <Button variant="default" asChild>
                    <a href="/auth/register">
                      Sign Up
                    </a>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {user ? `Welcome back, ${user.email?.split('@')[0]}! 👋` : 'Welcome to KrishiBondhu! 🛒'}
          </h2>
          <p className="text-gray-600">
            {user 
              ? 'Discover fresh, quality produce directly from verified farmers'
              : 'Browse fresh produce from verified farmers. Login to purchase and track orders.'
            }
          </p>
          {!user && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Guest Mode:</strong> You can browse products without an account. 
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-blue-800 underline ml-1"
                  asChild
                >
                  <a href="/auth/login">Login</a>
                </Button> 
                to purchase and access full features.
              </p>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search for products, farmers, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  <category.icon className="h-4 w-4 mr-2" />
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Products */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="mr-2 h-5 w-5 text-yellow-500" />
                  Featured Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={product.image} />
                            <AvatarFallback>{product.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-sm">{product.name}</h3>
                            <p className="text-xs text-gray-600">by {product.farmer}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs">{product.farmerRating}</span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-lg font-bold">৳{product.price}</span>
                          {product.discount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {product.discount}% OFF
                            </Badge>
                          )}
                        </div>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">৳{product.originalPrice}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">{product.quantity} available</span>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600">{product.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {product.organic && (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                              Organic
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500">
                            Harvested: {new Date(product.harvestDate).toLocaleDateString()}
                          </span>
                        </div>
                                                <Button
                          size="sm"
                          onClick={() => {
                            if (!user) {
                              toast({
                                title: "Login Required",
                                description: "Please login to add items to cart and make purchases.",
                                variant: "destructive"
                              });
                              return;
                            }
                            if (isFeatureRestricted()) {
                              toast({
                                title: "Profile Required",
                                description: "Please complete your profile to add items to cart.",
                                variant: "destructive"
                              });
                              return;
                            }
                            addToCart(product);
                          }}
                          disabled={!product.inStock}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          {user ? 'Add to Cart' : 'Login to Buy'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">Order #{order.id}</h3>
                          <p className="text-sm text-gray-600">
                            {order.items.length} item{order.items.length > 1 ? 's' : ''} • ৳{order.totalAmount}
                          </p>
                        </div>
                        <Badge className={getOrderStatusColor(order.status)}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        {order.items.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.name} ({item.quantity})</span>
                            <span>৳{item.price}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <span>Ordered: {new Date(order.orderDate).toLocaleDateString()}</span>
                          {order.deliveryDate && (
                            <span>Delivered: {new Date(order.deliveryDate).toLocaleDateString()}</span>
                          )}
                          {order.estimatedDelivery && (
                            <span>ETA: {new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                          )}
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Track
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Cart */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Shopping Cart
                  {cart.length > 0 && (
                    <Badge className="ml-2">{cart.length}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Your cart is empty</p>
                    <p className="text-sm text-gray-500">Add some fresh products!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={item.image} />
                          <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.name}</h4>
                          <p className="text-sm text-gray-600">৳{item.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-4">
                        <span className="font-semibold">Total:</span>
                        <span className="font-bold">৳{getCartTotal()}</span>
                      </div>
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={() => {
                          if (!user) {
                            toast({
                              title: "Login Required",
                              description: "Please login to proceed with checkout.",
                              variant: "destructive"
                            });
                            return;
                          }
                          if (isFeatureRestricted()) {
                            toast({
                              title: "Profile Required",
                              description: "Please complete your profile to place orders.",
                              variant: "destructive"
                            });
                            return;
                          }
                          navigate('/customer/checkout');
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Profile Completion Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Complete Your Profile
            </DialogTitle>
            <DialogDescription>
              Complete your profile to unlock all features including placing orders, 
              tracking deliveries, and personalized recommendations.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Required Information:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Full name and contact details</li>
                <li>• Delivery address</li>
                <li>• Food preferences (optional)</li>
                <li>• Payment methods</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> You can skip this step and explore the platform, 
                but some features will be limited until you complete your profile.
              </p>
            </div>
          </div>

          <DialogFooter className="flex gap-3 sm:gap-3">
            <Button 
              variant="outline" 
              onClick={handleSkipProfile}
              className="flex-1"
            >
              Skip For Now
            </Button>
            <Button 
              onClick={handleCompleteProfile}
              className="flex-1"
            >
              Complete Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerDashboard; 