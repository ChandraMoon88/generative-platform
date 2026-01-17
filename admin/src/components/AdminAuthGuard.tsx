'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('admin_authenticated') === 'true';
    
    if (!isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
  }, [pathname, router]);

  return <>{children}</>;
}
