'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initSession } from '../services/instrumentation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('user_token');
    
    if (token) {
      // Initialize instrumentation session
      initSession();
      // Redirect to projects (user's workspace)
      router.push('/projects');
    } else {
      // Redirect to login
      router.push('/login');
    }
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-pink-500">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white font-medium">Loading...</p>
      </div>
    </div>
  );
}
