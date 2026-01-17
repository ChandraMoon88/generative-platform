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
    // Redirect to events page
    router.push('/events');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Generative Platform Admin
        </h1>
        <p className="text-slate-600">Redirecting to admin dashboard...</p>
      </div>
    </div>
  );
}
