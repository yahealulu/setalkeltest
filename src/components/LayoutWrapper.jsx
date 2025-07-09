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
    if (!isAuthLoading && user && pathname === '/auth/login') {
      router.push('/');
    }
  }, [isAuthLoading, user, pathname]);

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
