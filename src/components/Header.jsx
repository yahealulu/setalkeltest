'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Heart, User, ChevronDown, Menu, X, Mail, LogOut } from 'lucide-react';
import SubHeader from './SubHeader';
import { useRouter, usePathname } from 'next/navigation';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTranslations } from 'next-intl';
const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';
  const { user, logout } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations('header');
  const isLoggedIn = !!user;
  
  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      // Always redirect to home page after logout
      router.push(`/${currentLocale}`);
      // Close the dropdown
      setIsDropdownOpen(false);
      // Close mobile menu if open
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <header className={`w-full transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
        {/* Top Bar - Hidden on mobile */}
        <div className="w-full bg-gradient-to-r from-[#a4cf6e]/90 to-[#00B207]/90 text-white backdrop-blur-sm hidden md:block">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-[40px] text-sm">
              {/* Left Links */}
              <div className="flex items-center gap-6">
                <Link href={`/${currentLocale}/about-us`} className="text-white/90 hover:text-white transition-colors">
                  {currentLocale === 'ar' ? 'من نحن' : 'About Us'}
                </Link>
                <Link href={`/${currentLocale}/contact-us`} className="text-white/90 hover:text-white transition-colors">
                  {currentLocale === 'ar' ? 'اتصل بنا' : 'Contact Us'}
                </Link>
                <div className="h-4 w-[1px] bg-white/30"></div>
                <Link href={`/${currentLocale}/partners`} className="text-white/90 hover:text-white transition-colors">
                  {currentLocale === 'ar' ? 'الشركاء' : 'Partners'}
                </Link>
                <Link href={`/${currentLocale}/agents`} className="text-white/90 hover:text-white transition-colors">
                  {currentLocale === 'ar' ? 'الوكلاء' : 'Agents'}
                </Link>
              </div>

              {/* Right Links */}
              <div className="flex items-center gap-6 relative">
                <Link href={`/${currentLocale}/store-locations`} className="flex items-center gap-1 text-white/90 hover:text-white transition-colors">
                  <MapPin className="w-4 h-4" />
                  <span>{currentLocale === 'ar' ? 'مواقع المتاجر' : 'Store Locations'}</span>
                </Link>
                <Link href="tel:(956) 229-7908" className="flex items-center gap-1 text-white/90 hover:text-white transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>(956) 229-7908</span>
                </Link>
   
                <div className="h-4 w-[1px] bg-white/30"></div>

                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 text-white hover:text-white/90 transition-colors"
                    >
                      <div className="text-left">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-white/80">{user.email}</div>
                      </div>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          {currentLocale === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => router.push(`/${currentLocale}/auth/login`)}
                    className="flex items-center gap-1 text-white/90 hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>{currentLocale === 'ar' ? 'تسجيل الدخول / التسجيل' : 'Login / Register'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu Button - Only visible on mobile */}
        <div className="md:hidden fixed top-4 right-4 z-50">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-full bg-[#00B207] text-white shadow-lg"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Menu - Slide in from right */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden">
            <div className="absolute right-0 top-0 h-full w-3/4 max-w-xs bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
              <div className="p-5 overflow-y-auto h-full">
                <div className="mb-8">
                  <Link href={`/${currentLocale}`} onClick={() => setIsMobileMenuOpen(false)}>
                    <img src="/images/logo_black_and_gold.png" alt="Set Alkel logo" className="w-24 mx-auto" />
                  </Link>
                </div>
                
                <div className="space-y-4">
                  <Link 
                    href={`/${currentLocale}/about-us`} 
                    className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {currentLocale === 'ar' ? 'من نحن' : 'About Us'}
                  </Link>
                  <Link 
                    href={`/${currentLocale}/contact-us`} 
                    className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {currentLocale === 'ar' ? 'اتصل بنا' : 'Contact Us'}
                  </Link>
                  <Link 
                    href={`/${currentLocale}/partners`} 
                    className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {currentLocale === 'ar' ? 'الشركاء' : 'Partners'}
                  </Link>
                  <Link 
                    href={`/${currentLocale}/agents`} 
                    className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {currentLocale === 'ar' ? 'الوكلاء' : 'Agents'}
                  </Link>
                  <Link 
                    href={`/${currentLocale}/store-locations`} 
                    className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{currentLocale === 'ar' ? 'مواقع المتاجر' : 'Store Locations'}</span>
                    </div>
                  </Link>
                  <Link 
                    href={`/${currentLocale}/wishlist`} 
                    className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      <span>{currentLocale === 'ar' ? 'المفضلة' : 'Wishlist'}</span>
                    </div>
                  </Link>
                  
                  <div className="border-t border-gray-200 my-4"></div>
                  
                  {user ? (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500 mb-2">{user.email}</div>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full mt-2 py-2 px-4 bg-[#00B207] text-white rounded-lg hover:bg-[#009706] transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        {currentLocale === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        router.push(`/${currentLocale}/auth/login`);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-2 px-4 bg-[#00B207] text-white rounded-lg hover:bg-[#009706] transition-colors flex items-center justify-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      <span>{currentLocale === 'ar' ? 'تسجيل الدخول / التسجيل' : 'Login / Register'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <SubHeader />
    </>
  );
};

export default Header;
