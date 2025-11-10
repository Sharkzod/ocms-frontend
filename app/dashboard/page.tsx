'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardRedirect() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'student':
          router.push('/dashboard/student');
          break;
        case 'instructor':
          router.push('/dashboard/instructor');
          break;
        case 'admin':
          router.push('/dashboard/admin');
          break;
        default:
          router.push('/dashboard/student');
      }
    }
  }, [user, router]);

  return (
    <div className="flex justify-center items-center min-h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}