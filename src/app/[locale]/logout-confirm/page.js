'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import { AuthContext } from '../../../context/AuthContext';

export default function LogoutConfirm() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';
  const { logout, user } = useContext(AuthContext);
  
  // Redirect to login if no user is logged in
  useEffect(() => {
    if (!user) {
      router.push(`/${currentLocale}/auth/login`);
    }
  }, [user, router, currentLocale]);
  
  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to home page after logout
      router.push(`/${currentLocale}`);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCancel = () => {
    router.back();
  };
  
  // Show loading state while checking user
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00B207]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm py-4 px-4">
        <div className="flex items-center">
          <Link 
            href={`/${currentLocale}`}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="text-xl font-bold text-center flex-1 pr-8">
            {currentLocale === 'ar' ? 'تسجيل الخروج' : 'Logout'}
          </h1>
        </div>
      </div>
      
      {/* User Details and Confirmation Content */}
      <div className="flex-1 p-4 flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-6 w-full max-w-md">
          {/* User Profile Section */}
          <div className="text-center mb-8 pb-6 border-b border-gray-200">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-600 mt-1">{user.email}</p>
            {user.phone && <p className="text-gray-500 mt-1">{user.phone}</p>}
          </div>
          
          {/* Logout Confirmation */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {currentLocale === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?'}
            </h2>
            <p className="text-gray-600 mt-2">
              {currentLocale === 'ar' 
                ? 'هل تريد حقًا تسجيل الخروج من حسابك؟' 
                : 'Do you really want to logout from your account?'}
            </p>
          </div>
          
          <div className="flex flex-col space-y-3">
            <button 
              onClick={handleLogout}
              className="w-full py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              {currentLocale === 'ar' ? 'نعم، تسجيل الخروج' : 'Yes, Logout'}
            </button>
            <button 
              onClick={handleCancel}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              {currentLocale === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}