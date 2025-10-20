import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<'agent' | 'buyer_seller' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          // If no role exists, create default buyer_seller role
          if (error.code === 'PGRST116') {
            const { data: newRole, error: insertError } = await supabase
              .from('user_roles')
              .insert({ user_id: user.id, role: 'buyer_seller' })
              .select('role')
              .single();

            if (!insertError && newRole) {
              setRole(newRole.role);
            }
          }
        } else {
          setRole(data.role);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  return { role, loading };
};