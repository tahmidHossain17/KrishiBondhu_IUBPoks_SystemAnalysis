import React, { Suspense, lazy } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Error boundary for lazy-loaded components
class LazyErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-destructive mb-2">
              Something went wrong
            </h2>
            <p className="text-muted-foreground mb-4">
              Please refresh the page to try again.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for lazy loading
export const withLazyLoading = (
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  fallback?: React.ComponentType
) => {
  const LazyComponent = lazy(importFn);
  const FallbackComponent = fallback || LoadingFallback;

  return (props: any) => (
    <LazyErrorBoundary>
      <Suspense fallback={<FallbackComponent />}>
        <LazyComponent {...props} />
      </Suspense>
    </LazyErrorBoundary>
  );
};

// Preload function for critical routes
export const preloadComponent = (
  importFn: () => Promise<{ default: React.ComponentType<any> }>
) => {
  const componentImport = importFn();
  return componentImport;
};

// Lazy-loaded route components
export const LazyCustomerDashboard = withLazyLoading(
  () => import('@/pages/customer/CustomerDashboard')
);

export const LazyCheckout = withLazyLoading(
  () => import('@/pages/customer/Checkout')
);

export const LazyCustomerOrders = withLazyLoading(
  () => import('@/pages/customer/CustomerOrders')
);

export const LazyCustomerOrderTracking = withLazyLoading(
  () => import('@/pages/customer/CustomerOrderTracking')
);

export const LazyOrderConfirmation = withLazyLoading(
  () => import('@/pages/customer/OrderConfirmation')
);

export const LazyFarmerDashboard = withLazyLoading(
  () => import('@/pages/farmer/FarmerDashboard')
);

export const LazyCropRecommendations = withLazyLoading(
  () => import('@/pages/farmer/CropRecommendations')
);

export const LazyWarehouseFinder = withLazyLoading(
  () => import('@/pages/farmer/WarehouseFinder')
);

export const LazySellProducts = withLazyLoading(
  () => import('@/pages/farmer/SellProducts')
);

export const LazyPesticidesGuide = withLazyLoading(
  () => import('@/pages/farmer/PesticidesGuide')
);

export const LazyFarmerProfile = withLazyLoading(
  () => import('@/pages/farmer/FarmerProfile')
);

export const LazyAdminDashboard = withLazyLoading(
  () => import('@/pages/admin/AdminDashboard')
);

export const LazyUserManagement = withLazyLoading(
  () => import('@/pages/admin/UserManagement')
);

export const LazyWarehouseManagement = withLazyLoading(
  () => import('@/pages/admin/WarehouseManagement')
);

export const LazyAdminOrderManagement = withLazyLoading(
  () => import('@/pages/admin/OrderManagement')
);

export const LazyAdminAnalytics = withLazyLoading(
  () => import('@/pages/admin/AdminAnalytics')
);

export const LazyMarketingTools = withLazyLoading(
  () => import('@/pages/admin/MarketingTools')
);

export const LazySystemSettings = withLazyLoading(
  () => import('@/pages/admin/SystemSettings')
);

// Warehouse components
export const LazyWarehouseDashboard = withLazyLoading(
  () => import('@/pages/warehouse/WarehouseDashboard')
);

export const LazyConfirmArrivals = withLazyLoading(
  () => import('@/pages/warehouse/ConfirmArrivals')
);

export const LazyInventoryManagement = withLazyLoading(
  () => import('@/pages/warehouse/InventoryManagement')
);

export const LazyMonthlyReport = withLazyLoading(
  () => import('@/pages/warehouse/MonthlyReport')
);

export const LazyConfirmPickup = withLazyLoading(
  () => import('@/pages/warehouse/ConfirmPickup')
);

export const LazyWarehouseProfile = withLazyLoading(
  () => import('@/pages/warehouse/WarehouseProfile')
);

// Delivery components
export const LazyDeliveryPartnerDashboard = withLazyLoading(
  () => import('@/pages/delivery/DeliveryPartnerDashboard')
);

export const LazyDeliveryOrderManagement = withLazyLoading(
  () => import('@/pages/delivery/OrderManagement')
);

export const LazyPickupConfirmation = withLazyLoading(
  () => import('@/pages/delivery/PickupConfirmation')
);

export const LazyDeliveryTracking = withLazyLoading(
  () => import('@/pages/delivery/DeliveryTracking')
);

export const LazyDeliveryConfirmation = withLazyLoading(
  () => import('@/pages/delivery/DeliveryConfirmation')
);

export const LazyDeliveryPartnerProfile = withLazyLoading(
  () => import('@/pages/delivery/DeliveryPartnerProfile')
);

// Auth components (keep these non-lazy for critical path)
export const LazyRegistration = withLazyLoading(
  () => import('@/pages/auth/Registration')
);

export const LazyVerification = withLazyLoading(
  () => import('@/pages/auth/Verification')
);

// Intersection Observer for progressive loading
export const useIntersectionObserver = (
  callback: () => void,
  options: IntersectionObserverInit = {}
) => {
  const targetRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
        observer.disconnect();
      }
    }, options);

    observer.observe(target);

    return () => observer.disconnect();
  }, [callback, options]);

  return targetRef;
};

// Preload critical components on app initialization
export const preloadCriticalComponents = () => {
  // Preload dashboard components that are likely to be accessed
  setTimeout(() => {
    preloadComponent(() => import('@/pages/customer/CustomerDashboard'));
    preloadComponent(() => import('@/pages/farmer/FarmerDashboard'));
  }, 2000); // Delay to not interfere with initial load
};

export default {
  withLazyLoading,
  preloadComponent,
  preloadCriticalComponents,
  useIntersectionObserver
};