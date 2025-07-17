'use client';

import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

const Footer = () => {
    const pathname = usePathname();
    const currentLocale = pathname.split('/')[1] || 'en';
    const t = useTranslations('footer');
    return (
        <footer className="bg-gradient-to-b from-white to-gray-50 pt-16 pb-8">
            <div className="container mx-auto px-4">
                {/* Footer Top Section with Logo */}
                <div className="flex flex-col items-center mb-12">
                    <Link href={`/${currentLocale}`}>
                        <img src="/images/logo_black_and_gold.png" alt="Set Alkel" className="h-16 mb-6" />
                    </Link>
                    <p className="text-gray-600 max-w-2xl text-center mb-8">
                        {currentLocale === 'ar'
                            ? 'من المنتجات النباتية المجمدة إلى المفضلات المعلبة مثل الفاصوليا إلى البدائل النباتية، لدينا شيء للجميع.'
                            : 'From frozen veggie products to canned favorites such as beans to vegan alternatives, we have something for everyone.'}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="https://www.facebook.com/Setalkel.food/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#00B207] hover:bg-[#00B207] hover:text-white transition-all duration-300"
                            aria-label="Facebook"
                        >
                            <FaFacebookF size={18} />
                        </a>
                        <a
                            href="https://www.instagram.com/setalkel.co"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#00B207] hover:bg-[#00B207] hover:text-white transition-all duration-300"
                            aria-label="Instagram"
                        >
                            <FaInstagram size={18} />
                        </a>
                      
                    
                        <a
                            href="https://www.youtube.com/@setalkel7202"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#00B207] hover:bg-[#00B207] hover:text-white transition-all duration-300"
                            aria-label="YouTube"
                        >
                            <FaYoutube size={18} />
                        </a>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* About */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-gray-800 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-1 ">
                            {currentLocale === 'ar' ? '' : ''}
                        </h3>
                       
                    </div>

                    {/* Useful Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-gray-800 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-1 after:bg-[#00B207] after:rounded-full">
                            {currentLocale === 'ar' ? 'عن الشركة' : 'About'}
                        </h3>
                        <ul className="space-y-3">
                         <ul className="space-y-3">
                            <li>
                                <Link href={`/${currentLocale}/about-us`} className="text-gray-600 hover:text-[#00B207] transition-colors flex items-center">
                                    <span className="inline-block w-2 h-2 bg-[#00B207] rounded-full mr-2"></span>
                                    {currentLocale === 'ar' ? 'من نحن' : 'About Us'}
                                </Link>
                            </li>
                      <li>
                                <Link href={`/${currentLocale}/contact-us`} className="text-gray-600 hover:text-[#00B207] transition-colors flex items-center">
                                    <span className="inline-block w-2 h-2 bg-[#00B207] rounded-full mr-2"></span>
                                    {currentLocale === 'ar' ? 'اتصل بنا' : 'Contact Us'}
                                </Link>
                            </li>
                     
                        </ul>
                           
                        
                          
                        </ul>
                    </div>

                    {/* Available On */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-gray-800 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-1 after:bg-[#00B207] after:rounded-full">
                            {currentLocale === 'ar' ? 'متوفر على' : 'Available On'}
                        </h3>
                        <div className="space-y-4">
                            <a 
                                href="#" 
                                className="block transition-transform hover:scale-105"
                                aria-label="Download on App Store"
                            >
                                <img src="/images/apple-app-store-cta.webp" alt="App Store" className="h-12 rounded-lg shadow-sm" />
                            </a>
                            <a 
                                href="#" 
                                className="block transition-transform hover:scale-105"
                                aria-label="Get it on Google Play"
                            >
                                <img src="/images/Google_Play_Store.webp" alt="Google Play" className="h-12 rounded-lg shadow-sm" />
                            </a>
                        </div>
                    </div>

                    {/* Contact Us */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-gray-800 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-1 after:bg-[#00B207] after:rounded-full">
                            {currentLocale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="w-8 h-8 rounded-full bg-[#00B207]/10 flex items-center justify-center text-[#00B207] mr-3 mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-gray-800 font-medium">{currentLocale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</p>
                                    <a href="mailto:info@setalkel.com" className="text-gray-600 hover:text-[#00B207] transition-colors">info@setalkel.com</a>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="w-8 h-8 rounded-full bg-[#00B207]/10 flex items-center justify-center text-[#00B207] mr-3 mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-gray-800 font-medium">{currentLocale === 'ar' ? 'الهاتف' : 'Phone'}</p>
                                    <a href="tel:+966123456789" className="text-gray-600 hover:text-[#00B207] transition-colors">+966 12 345 6789</a>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="w-8 h-8 rounded-full bg-[#00B207]/10 flex items-center justify-center text-[#00B207] mr-3 mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-gray-800 font-medium">{currentLocale === 'ar' ? 'العنوان' : 'Address'}</p>
                                    <p className="text-gray-600">
                                        {currentLocale === 'ar' ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Footer Bottom */}
                <div className="border-t border-gray-200 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-600 text-sm">
                            © {new Date().getFullYear()} Set Alkel. {currentLocale === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}
                        </p>
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                          
                            <Link href={`/${currentLocale}/privacy`} className="text-gray-600 text-sm hover:text-[#00B207] transition-colors">
                                {currentLocale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
                            </Link>
                         
                           
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
