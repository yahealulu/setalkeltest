'use client';

import { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import Header from './Header';
import Footer from './Footer';
import LoadingScreen from './LoadingScreen';
import { ToastContainer } from 'react-toastify';
import { usePathname, useRouter } from 'next/navigation';
import ProtectedRoute from './Auth/ProtectedRoute';

export default function LayoutWrapper({ children }) {
  const { isAuthLoading, user } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

 useEffect(() => {
    const currentLocale = pathname.split('/')[1] || 'en';
    
    if (!isAuthLoading && user && pathname.endsWith('/auth/login')) {
      router.push(`/${currentLocale}`);
    }
  }, [isAuthLoading, user, pathname, router]);

  if (isAuthLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Header />
      <ToastContainer />
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
      <Footer />
    </>
  );
}
