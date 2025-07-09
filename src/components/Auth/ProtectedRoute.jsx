'use client';

import { useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';
import Link from 'next/link';

const ProtectedRoute = ({ children }) => {
  const { user, isAuthLoading } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only check after auth loading is complete
    if (!isAuthLoading && !user && pathname.includes('/orders/new')) {
      router.push(`/login-required?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [user, isAuthLoading, router, pathname]);

  // If still loading or user is authenticated, render children
  if (isAuthLoading || user || !pathname.includes('/order/new')) {
    return children;
  }

  // This return is just a fallback, the redirect should happen in the useEffect
  return null;
};

export default ProtectedRoute;