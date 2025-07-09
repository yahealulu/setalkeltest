'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

const LoginRequiredPage = () => {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center"
      >
        <div className="mb-6">
          <svg 
            className="w-16 h-16 mx-auto text-yellow-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-3V9m0 0V7m0 2h2m-2 0H9" 
            />
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h1>
        
        <p className="text-gray-600 mb-6">
          You need to be logged in to access this page. Please log in to continue.
        </p>
        
        <Link 
          href={`/auth/login`}
          className="inline-block bg-[#00B207] hover:bg-[#009706] text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
        >
          Go to Login
        </Link>
      </motion.div>
    </div>
  );
};

export default LoginRequiredPage;