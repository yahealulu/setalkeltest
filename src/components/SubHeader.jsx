'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, ShoppingCart, Globe, Menu, X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

const SubHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';
  const t = useTranslations('subheader');
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close language dropdown if clicking outside
      if (isLangOpen && !event.target.closest('.lang-dropdown')) {
        setIsLangOpen(false);
      }
      
      // Close category dropdown if clicking outside
      if (isCategoryOpen && !event.target.closest('.category-dropdown')) {
        setIsCategoryOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLangOpen, isCategoryOpen]);
  
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
  
  const switchLanguage = (locale) => {
    // Get the current path segments
    const segments = pathname.split('/');
    
    // Replace the locale segment (index 1)
    segments[1] = locale;
    
    // Join the segments back together and navigate
    const newPath = segments.join('/');
    router.push(newPath);
    
    // Close the language dropdown
    setIsLangOpen(false);
  };

  return (
    <div className="bg-white shadow-sm sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between py-4 md:py-0 md:h-[80px] gap-3 md:gap-6">
          {/* Logo - Visible on all screens */}
          <div className="p-2 md:p-4">
            <Link href={`/${currentLocale}`}>
              <img 
                src="/images/logo_black_and_gold.png" 
                alt="Set Alkel logo" 
                className="w-16 md:w-20 transition-transform hover:scale-105" 
              />
            </Link>
          </div>
          
        
          
          {/* Language Selector - Visible on all screens */}
          <div className="relative order-last md:order-none lang-dropdown">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="h-[40px] rounded-lg px-4 bg-gradient-to-r from-[#a4cf6e] to-[#00B207] text-white font-medium flex items-center gap-2 hover:shadow-md transition-all"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden md:inline">{t('language')}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>
            {isLangOpen && (
              <div className="absolute top-full right-0 md:left-0 w-[150px] bg-white shadow-lg rounded-lg mt-1 z-50 overflow-hidden">
                <button 
                  onClick={() => switchLanguage('en')} 
                  className={`block w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${currentLocale === 'en' ? 'bg-gray-50 font-medium text-[#00B207]' : 'text-gray-700'}`}
                >
                  English
                </button>
                <button 
                  onClick={() => switchLanguage('ar')} 
                  className={`block w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors ${currentLocale === 'ar' ? 'bg-gray-50 font-medium text-[#00B207]' : 'text-gray-700'}`}
                >
                  العربية
                </button>
              </div>
            )}
          </div>
          
          {/* Search Bar - Full width on mobile, flex-grow on desktop */}
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

          {/* Navigation Links - Hidden on mobile, shown on desktop */}
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
          </div>

          {/* Cart Icon - Visible on all screens */}
          <Link
            href={`/${currentLocale}/orders/new`}
            className="w-12 h-12 rounded-full bg-[#E6F5E7] flex items-center justify-center hover:shadow-md transition-all"
          >
            <div className="relative cursor-pointer">
              <ShoppingCart size={20} className="text-[#00B207]" />
           
            </div>
          </Link>
        </div>
        
        {/* Mobile Navigation Links - Only visible on mobile */}
        <div className="md:hidden flex items-center justify-between overflow-x-auto py-3 gap-4 text-sm whitespace-nowrap">
          <Link
            href={`/${currentLocale}/category/all`}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#00B207]/10 text-[#00B207] font-medium"
          >
            <span>{t('allCategories')}</span>
            <ChevronDown className="w-3 h-3" />
          </Link>
          <Link
            href={`/${currentLocale}/offers`}
            className="px-3 py-1.5 text-gray-700"
          >
            <span>{t('offers')}</span>
          </Link>
          <Link
            href={`/${currentLocale}/activites`}
            className="px-3 py-1.5 text-gray-700"
          >
            <span>{t('activities')}</span>
          </Link>
          <Link
            href={`/${currentLocale}/bites`}
            className="px-3 py-1.5 text-gray-700"
          >
            <span>{t('bites')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubHeader;