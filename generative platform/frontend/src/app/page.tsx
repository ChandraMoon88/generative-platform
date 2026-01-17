'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initSession } from '../services/instrumentation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Initialize instrumentation session
    initSession();
    
    // Redirect to dashboard
    router.push('/dashboard');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Loading Restaurant Manager...</p>
      </div>
    </div>
  );
}
