-- Phase 1: Fix Critical Security Issues

-- 1. Create security definer function for safe role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 2. Create function to check if user can view a profile (for agent contact info on properties)
CREATE OR REPLACE FUNCTION public.can_view_profile(_profile_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    -- Users can view their own profile
    auth.uid() = _profile_user_id
    OR
    -- Users can view agent profiles for properties they're viewing
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE agent_id = _profile_user_id
    )
$$;

-- 3. Drop and recreate profiles RLS policies with proper restrictions
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view agent profiles"
ON public.profiles
FOR SELECT
USING (
  public.has_role(user_id, 'agent')
  AND EXISTS (
    SELECT 1 FROM public.properties 
    WHERE agent_id = user_id
  )
);

-- 4. Drop dangerous UPDATE policy on user_roles (prevents privilege escalation)
DROP POLICY IF EXISTS "Users can update their own role" ON public.user_roles;

-- 5. Restrict user_roles visibility
DROP POLICY IF EXISTS "Users can view all roles" ON public.user_roles;

CREATE POLICY "Users can view their own role"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Note: user_roles INSERT policy remains for signup flow