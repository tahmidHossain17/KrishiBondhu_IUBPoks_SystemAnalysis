import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Leaf, 
  LogOut, 
  User, 
  Warehouse, 
  ShoppingCart, 
  Bug, 
  Home,
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
  Bell
} from "lucide-react";

interface FarmerDashboardLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

const FarmerDashboardLayout = ({ children, currentPage }: FarmerDashboardLayoutProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/farmer/dashboard', icon: Home, current: currentPage === 'dashboard' },
    { name: 'Crop Suggestions', href: '/farmer/crops', icon: Leaf, current: currentPage === 'crops' },
    { name: 'Smart Warehouse Finder', href: '/farmer/warehouses', icon: Warehouse, current: currentPage === 'warehouses' },
    { name: 'Sell Products', href: '/farmer/sell', icon: ShoppingCart, current: currentPage === 'sell' },
    { name: 'Pesticide Guide', href: '/farmer/pesticides', icon: Bug, current: currentPage === 'pesticides' },
    { name: 'Profile', href: '/farmer/profile', icon: User, current: currentPage === 'profile' },
  ];

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      const { error } = await signOut();
      
      if (error) {
        toast({
          title: "Sign out failed",
          description: error,
          variant: "destructive"
        });
      } else {
        // Clear any local storage or session data if needed
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.clear();
        
        toast({
          title: "Signed out successfully",
          description: "You have been logged out.",
        });
        
        // Small delay to ensure auth state is cleared before navigation
        setTimeout(() => {
          navigate('/auth/login', { replace: true });
          // Fallback: if navigation doesn't work, use window.location
          setTimeout(() => {
            if (window.location.pathname !== '/auth/login') {
              window.location.href = '/auth/login';
            }
          }, 500);
        }, 100);
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign out failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-border">
            <Leaf className="w-8 h-8 text-primary mr-3" />
            <div>
              <h1 className="text-lg font-bold text-foreground">KrishiBondhu</h1>
              <p className="text-xs text-muted-foreground font-bengali">কৃষিবন্ধু</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  item.current
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </a>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full justify-start text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              <LogOut className="w-4 h-4 mr-3" />
              {signingOut ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2"></div>
                  Signing Out...
                </div>
              ) : (
                'Sign Out'
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-card border-b border-border">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Badge variant="secondary">Farmer Dashboard</Badge>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default FarmerDashboardLayout;