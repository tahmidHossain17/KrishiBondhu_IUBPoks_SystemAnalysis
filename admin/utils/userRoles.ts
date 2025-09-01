import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'farmer' | 'customer' | 'delivery_partner' | 'warehouse_manager' | 'admin';

interface UserRoleData {
  role: UserRole;
  profileData: any;
}

export const getUserRole = async (userId: string): Promise<UserRoleData | null> => {
  try {
    // Check farmer profile
    const { data: farmerProfile, error: farmerError } = await supabase
      .from('farmer_profiles')
      .select('id, farm_name, location')
      .eq('user_id', userId)
      .maybeSingle();

    if (farmerProfile && !farmerError) {
      return { role: 'farmer', profileData: farmerProfile };
    }

    // Check customer profile
    const { data: customerProfile, error: customerError } = await supabase
      .from('customer_profiles')
      .select('id, full_name, city')
      .eq('user_id', userId)
      .maybeSingle();

    if (customerProfile && !customerError) {
      return { role: 'customer', profileData: customerProfile };
    }

    // Check delivery partner profile
    const { data: deliveryProfile, error: deliveryError } = await supabase
      .from('delivery_partner_profiles')
      .select('id, full_name, vehicle_type')
      .eq('user_id', userId)
      .maybeSingle();

    if (deliveryProfile && !deliveryError) {
      return { role: 'delivery_partner', profileData: deliveryProfile };
    }

    // Check admin by email pattern
    const { data: { user } } = await supabase.auth.getUser();
    const adminEmails = ['admin@example.com', 'admin@krishibondhu.com'];
    
    if (user && adminEmails.includes(user.email || '')) {
      return { role: 'admin', profileData: { email: user.email } };
    }

    // Check warehouse manager by email pattern (since we don't have the table yet)
    const warehouseEmails = ['warehouse@example.com', 'warehouse@krishibondhu.com'];
    
    if (user && warehouseEmails.includes(user.email || '')) {
      return { role: 'warehouse_manager', profileData: { email: user.email } };
    }

    return null;
  } catch (error) {
    console.error('Error determining user role:', error);
    return null;
  }
};

export const getDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case 'farmer':
      return '/farmer/dashboard';
    case 'customer':
      return '/customer/dashboard';
    case 'delivery_partner':
      return '/delivery/dashboard';
    case 'warehouse_manager':
      return '/warehouse/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/dashboard';
  }
};

export const useUserRole = () => {
  const { user } = useAuth();
  
  const getUserRoleData = async (): Promise<UserRoleData | null> => {
    if (!user) return null;
    return await getUserRole(user.id);
  };
  
  return { getUserRoleData };
};
