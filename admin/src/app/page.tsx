'use client';

/**
 * Admin Server Home Page
 * Entry point to the admin dashboard
 */

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminHome() {
  const router = useRouter();
  
  useEffect(() => {
    // Check if authenticated
    const isAuthenticated = sessionStorage.getItem('admin_authenticated') === 'true';
    
    if (isAuthenticated) {
      router.push('/events');
    } else {
      router.push('/login');
    }
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Generative Platform Admin
        </h1>
        <p className="text-slate-600">Loading...</p>
      </div>
    </div>
  );
}
