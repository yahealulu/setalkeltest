'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams, usePathname } from 'next/navigation';

const NewProducts = () => {
  const params = useParams();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';
  const [showAll, setShowAll] = useState(false);

  const { data: newProducts, error, isLoading } = useQuery({
    queryKey: ['get-new-products'],
    queryFn: async () => {
      const { data } = await axios.get(`https://setalkel.amjadshbib.com/api/getnewvariants`);
      return data?.data;
    },
  });

  if (isLoading) {
    return (
      <div className="px-6 py-8">
        <h2 className="text-2xl font-semibold mb-6">{currentLocale === 'ar' ? 'منتجات جديدة' : 'New Products'}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-2xl p-6 h-[300px]" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-8">
        <h2 className="text-2xl font-semibold mb-6">{currentLocale === 'ar' ? 'منتجات جديدة' : 'New Products'}</h2>
        <div className="text-red-500">{currentLocale === 'ar' ? 'خطأ في تحميل المنتجات الجديدة' : 'Error loading new products'}</div>
      </div>
    );
  }

  if (!newProducts || newProducts?.length === 0) {
    return (
      <div className="px-6 py-8">
        <h2 className="text-2xl font-semibold mb-6">{currentLocale === 'ar' ? 'منتجات جديدة' : 'New Products'}</h2>
        <div className="text-gray-500">{currentLocale === 'ar' ? 'لم يتم العثور على منتجات جديدة' : 'No new products found'}</div>
      </div>
    );
  }

  const displayProducts = showAll ? newProducts : newProducts.slice(0, 4);

  return (
    <div className="px-8 py-8">
      <h2 className="text-2xl font-semibold mb-6">{currentLocale === 'ar' ? 'منتجات جديدة' : 'New Products'}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayProducts.map((product) => (
          <Link
            key={product.id}
            href={`/${params?.locale || 'en'}/${product.product_id}/${product.id}`}
          >
            <motion.div
              className="shadow bg-white rounded-2xl p-6 cursor-pointer overflow-hidden h-full"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative h-full flex flex-col">
                {product.is_new && (
                  <div className="absolute top-0 left-0 z-20">
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-br-lg shadow-md">
                      {currentLocale === 'ar' ? 'جديد' : 'New'}
                    </div>
                  </div>
                )}

                {!product.in_stock && (
                  <div className="absolute top-0 right-0 z-20">
                    <div className="bg-red-500 text-white text-xs py-1 px-2 rounded-bl-lg shadow-md">
                      {currentLocale === 'ar' ? 'نفذ من المخزون' : 'Out of Stock'}
                    </div>
                  </div>
                )}

                <div className="relative w-full h-32 mb-4">
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={product.image && product.image !== 'null'
                        ? `https://setalkel.amjadshbib.com/public/${product.image}`
                        : product.product?.image && product.product.image !== 'null'
                          ? `https://setalkel.amjadshbib.com/public/${product.product.image}`
                          : '/placeholder-product.jpg'}
                      alt={product.product?.name_translations?.[currentLocale] || product.product?.name_translations?.en || 'Product'}
                      fill
                      className="object-cover rounded-xl"
                    />
                  </motion.div>
                </div>
                <div className="flex-1">
                  <motion.h3
                    className="text-lg font-semibold mb-2"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {product.product?.name_translations?.[currentLocale] || product.product?.name_translations?.en}
                  </motion.h3>

                  <div className="text-sm text-gray-600 mb-2">
                    {product.size && (
                      <span className="block">{currentLocale === 'ar' ? 'الحجم: ' : 'Size: '}{product.size}</span>
                    )}
                    {product.packaging && (
                      <span className="block">{currentLocale === 'ar' ? 'التعبئة: ' : 'Packaging: '}{product.packaging}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Show More / Show Less Button */}
      {newProducts.length > 4 && (
        <div className="flex justify-center mt-8">
          <motion.button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 bg-[#00B207] text-white rounded-full hover:bg-[#009706] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showAll ? (currentLocale === 'ar' ? 'عرض أقل' : 'Show Less') : (currentLocale === 'ar' ? 'عرض المزيد' : 'Show More')}
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default NewProducts;
