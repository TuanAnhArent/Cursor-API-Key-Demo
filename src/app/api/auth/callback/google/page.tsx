'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        router.push('/?error=auth');
        return;
      }

      if (session) {
        router.push('/dashboards');
      } else {
        router.push('/?error=no_session');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1f2e]">
      <div className="text-white">Completing login...</div>
    </div>
  );
} 