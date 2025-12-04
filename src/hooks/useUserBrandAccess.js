import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUserBrandAccess = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-brand-access', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_demo_user')
        .eq('user_id', user.id)
        .single();
      if (profile?.is_demo_user) {
        const { data: allBrands, error: brandsError } = await supabase
          .from('brand_profiles')
          .select('id, brand_name, company, therapeutic_area, primary_color, secondary_color, accent_color, font_family')
          .order('brand_name');
        if (brandsError) throw brandsError;
        console.log('Demo user brand access:', allBrands?.length, 'brands');
        return allBrands || [];
      }
      const { data, error } = await supabase
        .from('user_brand_access')
        .select(`
          brand_id,
          brand_profiles (
            id,
            brand_name,
            company,
            therapeutic_area,
            primary_color,
            secondary_color,
            accent_color,
            font_family
          )
        `)
        .eq('user_id', user.id);
      if (error) throw error;
      const brands = data?.map(access => access.brand_profiles).filter(Boolean) || [];
      console.log('Regular user brand access:', brands.length, 'brands');
      return brands;
    },
    enabled: !!user?.id,
  });
};
