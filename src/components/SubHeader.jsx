'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

const SubHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';
  const t = useTranslations('subheader');
  
  const handleSearch = (e) => {
    // Prevent default form submission behavior
    e.preventDefault();
    
    // Only search if query is not empty
    if (searchQuery.trim()) {
      router.push(`/${currentLocale}/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  }

  return (
    <div className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between py-2 md:py-0 md:h-[80px] gap-3 md:gap-6">
          {/* Logo - Hidden on mobile, visible on desktop */}
          <div className="hidden md:block p-2 md:p-4">
            <Link href={`/${currentLocale}`}>
              <img 
                src="/images/logo_black_and_gold.png" 
                alt="Set Alkel logo" 
                className="w-16 md:w-20 transition-transform hover:scale-105" 
              />
            </Link>
          </div>
          
          {/* Search Bar - Only visible component on mobile */}
          <div className="w-full md:flex-1 order-last md:order-none">
            <form onSubmit={handleSearch} className="relative flex" style={{ direction: 'ltr' }}>
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('searchPlaceholder')}
                  className="w-full bg-white h-[45px] pl-12 pr-4 rounded-l-lg border border-gray-200 focus:outline-none focus:border-[#00B207] focus:ring-2 focus:ring-[#00B207]/20 transition-all"
                  dir="ltr"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <button 
                type="submit" 
                className="h-[45px] bg-gradient-to-r from-[#00B207] to-[#009706] text-white px-6 rounded-r-lg hover:shadow-md transition-all font-medium"
              >
                {t('searchButton')}
              </button>
            </form>
          </div>

          {/* Navigation Links - Only visible on desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href={`/${currentLocale}/offers`}
              className="flex items-center gap-2 text-gray-700 hover:text-[#00B207] transition-colors font-medium"
            >
              <span>{t('offers')}</span>
            </Link>
            <Link
              href={`/${currentLocale}/activites`}
              className="flex items-center gap-2 text-gray-700 hover:text-[#00B207] transition-colors font-medium"
            >
              <span>{t('activities')}</span>
            </Link>
            <Link
              href={`/${currentLocale}/bites`}
              className="flex items-center gap-2 text-gray-700 hover:text-[#00B207] transition-colors font-medium"
            >
              <span>{t('bites')}</span>
            </Link>
            <Link
              href={`/${currentLocale}/orders/new`}
              className="flex items-center gap-2 text-gray-700 hover:text-[#00B207] transition-colors font-medium"
            >
              <span>{currentLocale === 'ar' ? 'صفحة الطلب' : 'Order Page'}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubHeader;