'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function RouteGuard({ children, requiredRole }: RouteGuardProps) {
  const { user, loading, checkAccess } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (requiredRole && !checkAccess(requiredRole)) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, requiredRole, checkAccess, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || (requiredRole && !checkAccess(requiredRole))) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Checking permissions...</div>
      </div>
    );
  }

  return <>{children}</>;
}