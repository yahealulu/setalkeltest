'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Heart, User, Search, ShoppingCart, ChevronDown } from 'lucide-react';
import SubHeader from './SubHeader';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
const Header = () => {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      // Always redirect to home page after logout
      router.push('/');
      // Close the dropdown
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <header className="w-full">
        {/* Top Bar */}
        <div className="w-full bg-[#F9F9F9] border-b border-[#E8E8E8]">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-[40px] text-sm">
              {/* Left Links */}
              <div className="flex items-center gap-6">
                <Link href="/about-us" className="text-gray-600 hover:text-gray-900">About Us</Link>
                <Link href="/contact-us" className="text-gray-600 hover:text-gray-900">Contact Us</Link>
                <div className="h-4 w-[1px] bg-gray-300"></div>
                <Link href="/partners" className="text-gray-600 hover:text-gray-900">Partners</Link>
                <Link href="/agents" className="text-gray-600 hover:text-gray-900">Agents</Link>
              </div>

              {/* Right Links */}
              <div className="flex items-center gap-6 relative">
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

                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                      <div className="text-left">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-50">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => router.push('/auth/login')}
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                  >
                    <span>Login / Register</span>
                  </button>
                )}
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
