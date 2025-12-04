-- Phase 1: Create trigger for automatic profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, is_demo_user)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'is_demo_user')::boolean, false)
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Phase 2: Fix existing demo user profile
-- Insert or update profile for demo@example.com user
INSERT INTO public.profiles (user_id, display_name, is_demo_user)
SELECT id, 'Demo User', true
FROM auth.users
WHERE email = 'demo@example.com'
ON CONFLICT (user_id) 
DO UPDATE SET 
  is_demo_user = true,
  display_name = 'Demo User',
  updated_at = now();

-- Phase 3: Ensure demo user has brand access (backup method)
-- Grant access to all brands for demo user
INSERT INTO public.user_brand_access (user_id, brand_id)
SELECT 
  u.id as user_id,
  bp.id as brand_id
FROM auth.users u
CROSS JOIN brand_profiles bp
WHERE u.email = 'demo@example.com'
ON CONFLICT (user_id, brand_id) DO NOTHING;