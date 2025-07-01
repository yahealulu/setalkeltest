'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Heart, User, Search, ShoppingCart } from 'lucide-react';
import SubHeader from './SubHeader';
import { useRouter } from 'next/navigation'

const Header = () => {
  const router = useRouter();
  
  return (
    <>
      <header className="w-full">
        {/* Top Bar */}
        <div className="w-full bg-[#F9F9F9] border-b border-[#E8E8E8]">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-[40px] text-sm">
              {/* Left Links */}
              <div className="flex items-center gap-6">
                <Link href="/about-us" className="text-gray-600 hover:text-gray-900">
                  About Us
                </Link>
                <Link href="/contact-us" className="text-gray-600 hover:text-gray-900">
                  Contact Us
                </Link>
                <div className="h-4 w-[1px] bg-gray-300"></div>
                <Link href="/delivery" className="text-gray-600 hover:text-gray-900">
                  Delivery
                </Link>
              </div>

              {/* Right Links */}
              <div className="flex items-center gap-6">
                <Link href="/store-locations" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                  <MapPin className="w-4 h-4" />
                  <span>Store Locations</span>
                </Link>
                <Link href="tel:(956) 229-7908" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                  <Phone className="w-4 h-4" />
                  <span>(956) 229-7908</span>
                </Link>
                <Link href="/wishlist" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                  <Heart className="w-4 h-4" />
                  <span>Wishlist</span>
                </Link>
                <div className="h-4 w-[1px] bg-gray-300"></div>
                <button
                  onClick={() => router.push('/auth/login')}
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                  >
                  <span>Login / Register</span>
                </button>
              </div>
            </div>
          </div>
        </div>    
      </header>
      
      <SubHeader />
    </>
  );
};

export default Header; 