import { useState, useEffect } from "react";
import FarmerDashboardLayout from "@/components/farmer/FarmerDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import WeatherWidget from "../../components/widgets/WeatherWidget";
import AIChatWidget from "../../components/widgets/AIChatWidget";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Cloud,
  Thermometer,
  Droplets,
  Wind,
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  Calendar,
  Activity,
  Plus,
  Eye,
  Leaf,
  Warehouse,
  ShoppingCart,
  Bug,
  Sun,
  CloudRain,
  ArrowRight,
  AlertCircle
} from "lucide-react";

const FarmerDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    farmerProfile: null,
    products: [],
    orders: [],
    crops: [],
    quickStats: {
      activeProducts: 0,
      warehouseStorage: 0,
      monthlyRevenue: 0,
      pendingOrders: 0
    },
    recentActivities: []
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // First get the user's profile, then get farmer profile via profile_id
      const { data: userProfile, error: userProfileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (userProfileError && userProfileError.code !== 'PGRST116') {
        console.error('User profile error:', userProfileError);
      }

      // Fetch farmer profile using profile_id relationship
      let farmerProfile = null;
      if (userProfile) {
        const { data: farmerData, error: profileError } = await supabase
          .from('farmer_profiles')
          .select('*')
          .eq('profile_id', userProfile.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Farmer profile error:', profileError);
        } else {
          farmerProfile = farmerData;
        }
      }

      let products = [];
      let orders = [];
      let crops = [];

      if (farmerProfile) {
        // Fetch farmer's products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('farmer_id', farmerProfile.id);

        if (productsError) {
          console.error('Products error:', productsError);
        } else {
          products = productsData || [];
        }

        // Fetch orders for farmer's products (if they exist)
        if (products.length > 0) {
          const { data: ordersData, error: ordersError } = await supabase
            .from('order_items')
            .select(`
              *,
              orders(*),
              products(*)
            `)
            .in('product_id', products.map(p => p.id))
            .limit(10);

          if (ordersError) {
            console.error('Orders error:', ordersError);
          } else {
            orders = ordersData || [];
          }
        }

        // Skip crops for now if table doesn't exist
        crops = [];
      }

      // Calculate quick stats
      const activeProducts = products.filter(p => p.is_active === true).length;
      const monthlyRevenue = orders.reduce((sum, order) => sum + (order.total_price || 0), 0);
      const pendingOrders = orders.filter(order => order.orders?.status === 'pending').length;

      // Generate recent activities
      const recentActivities = [
        ...products.slice(0, 3).map(product => ({
          type: "product",
          title: "Product listed",
          description: `${product.name} - ${product.available_quantity} ${product.unit}`,
          time: new Date(product.created_at).toLocaleTimeString(),
          icon: Package,
          color: "text-blue-600"
        }))
      ];

      setDashboardData({
        farmerProfile,
        products,
        orders,
        crops,
        quickStats: {
          activeProducts,
          warehouseStorage: 85, // This would come from warehouse API
          monthlyRevenue,
          pendingOrders
        },
        recentActivities
      });

    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      toast({
        title: "Error loading dashboard",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const quickStats = [
    {
      title: "Active Products",
      value: dashboardData.quickStats.activeProducts.toString(),
      change: "+2",
      changeType: "increase",
      icon: Package,
      color: "text-green-600"
    },
    {
      title: "Warehouse Storage",
      value: `${dashboardData.quickStats.warehouseStorage}%`,
      change: "+5%",
      changeType: "increase", 
      icon: Warehouse,
      color: "text-blue-600"
    },
    {
      title: "Monthly Revenue",
      value: `৳${dashboardData.quickStats.monthlyRevenue.toLocaleString()}`,
      change: "+12%",
      changeType: "increase",
      icon: DollarSign,
      color: "text-primary"
    },
    {
      title: "Pending Orders",
      value: dashboardData.quickStats.pendingOrders.toString(),
      change: "-3",
      changeType: "decrease",
      icon: ShoppingCart,
      color: "text-orange-600"
    }
  ];

  const quickActions = [
    {
      title: "Add New Product",
      description: "List your harvest for sale",
      icon: Plus,
      href: "/farmer/sell",
      color: "bg-primary hover:bg-primary-glow"
    },
    {
      title: "Check Warehouses",
      description: "Find nearby storage",
      icon: Warehouse,
      href: "/farmer/warehouses",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Crop Suggestions",
      description: "Get AI recommendations",
      icon: Leaf,
      href: "/farmer/crops",
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "View Analytics",
      description: "See your sales reports",
      icon: TrendingUp,
      href: "/farmer/analytics",
      color: "bg-purple-600 hover:bg-purple-700"
    }
  ];

  if (loading) {
    return (
      <FarmerDashboardLayout currentPage="dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </FarmerDashboardLayout>
    );
  }

  if (!dashboardData.farmerProfile) {
    return (
      <FarmerDashboardLayout currentPage="dashboard">
        <div className="flex items-center justify-center h-64">
          <Card className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Profile Setup Required</h3>
            <p className="text-muted-foreground mb-4">
              You need to complete your farmer profile to access the dashboard.
            </p>
            <Button onClick={() => window.location.href = '/farmer/profile'}>
              Complete Profile
            </Button>
          </Card>
        </div>
      </FarmerDashboardLayout>
    );
  }

  return (
    <FarmerDashboardLayout currentPage="dashboard">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Good Morning, {dashboardData.farmerProfile?.full_name || 'Farmer'}!
            </h1>
            <p className="text-muted-foreground mt-1">Here's what's happening with your farm today</p>
            <p className="text-sm text-primary font-bengali mt-1">আজ আপনার খামারের সাথে কী ঘটছে তা এখানে</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Badge variant="outline" className="text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date().toLocaleDateString('en-BD')}
            </Badge>
          </div>
        </div>

        {/* Weather Widget Removed as requested */}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <Card key={index} className="shadow-fresh hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-foreground mt-1">{stat.value}</h3>
                    <div className="flex items-center mt-2">
                      {stat.changeType === 'increase' ? (
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                      )}
                      <span className={`text-sm ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-accent ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <Card className="shadow-fresh">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-primary" />
                Recent Activities
              </CardTitle>
              <CardDescription>Your latest farm activities and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentActivities.slice(0, 3).map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent transition-colors">
                    <div className={`p-2 rounded-full bg-accent ${activity.color}`}>
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-foreground">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
                {dashboardData.recentActivities.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No recent activities</p>
                  </div>
                )}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Eye className="w-4 h-4 mr-2" />
                View All Activities
              </Button>
            </CardContent>
          </Card>

          {/* AI Assistant */}
          <AIChatWidget 
            context="farmer dashboard - farming advice and crop recommendations"
            placeholder="Ask about crops, weather, farming tips..."
            className="shadow-fresh"
          />

          {/* Quick Actions */}
          <Card className="shadow-fresh">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`h-20 flex-col space-y-2 hover-lift ${action.color} text-white border-none text-xs`}
                    asChild
                  >
                    <a href={action.href}>
                      <action.icon className="w-5 h-5" />
                      <div className="text-center">
                        <p className="text-xs font-medium">{action.title}</p>
                        <p className="text-xs opacity-80">{action.description}</p>
                      </div>
                    </a>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Farm Health Overview */}
        <Card className="shadow-fresh">
          <CardHeader>
            <CardTitle>Farm Health Overview</CardTitle>
            <CardDescription>Monitor your farm's key metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Crop Health</span>
                  <span className="text-sm text-muted-foreground">85%</span>
                </div>
                <Progress value={85} className="h-2" />
                <p className="text-xs text-muted-foreground">Good overall condition</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Soil Quality</span>
                  <span className="text-sm text-muted-foreground">92%</span>
                </div>
                <Progress value={92} className="h-2" />
                <p className="text-xs text-muted-foreground">Excellent fertility</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Irrigation Level</span>
                  <span className="text-sm text-muted-foreground">78%</span>
                </div>
                <Progress value={78} className="h-2" />
                <p className="text-xs text-muted-foreground">Adequate moisture</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FarmerDashboardLayout>
  );
};

export default FarmerDashboard;