'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LanguageSwitch() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';
  
  const switchLanguage = (locale) => {
    // Navigate to the root path with the new locale
    router.push(`/${locale}/`);
  };

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
            {currentLocale === 'ar' ? 'اختر اللغة' : 'Select Language'}
          </h1>
        </div>
      </div>
      
      {/* Language Options */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <button 
            onClick={() => switchLanguage('en')} 
            className={`flex items-center justify-between w-full p-4 text-left border-b ${currentLocale === 'en' ? 'bg-green-50' : ''}`}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <span className="font-medium text-blue-800">EN</span>
              </div>
              <span className="font-medium">English</span>
            </div>
            {currentLocale === 'en' && (
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
          
          <button 
            onClick={() => switchLanguage('ar')} 
            className={`flex items-center justify-between w-full p-4 text-left ${currentLocale === 'ar' ? 'bg-green-50' : ''}`}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <span className="font-medium text-green-800">AR</span>
              </div>
              <span className="font-medium">العربية</span>
            </div>
            {currentLocale === 'ar' && (
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}