'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';

const Categories = () => {
  const params = useParams();
  const [showAll, setShowAll] = useState(false);

  const { data: categoriesData, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await axios.get('https://setalkel.amjadshbib.com/api/categories');
      return data?.data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {[1, 2, 3, 4, 5, 6, 7].map((index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse mb-4"></div>
                <div className="h-4 w-20 bg-gray-200 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-red-500">Error loading categories</div>
        </div>
      </section>
    );
  }

  const categories = categoriesData
    ? categoriesData.filter(category => !category.is_hidden && category.products_count > 0)
    : [];

  if (!categories || categories.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-gray-500">No categories available</div>
        </div>
      </section>
    );
  }

  const displayCategories = showAll ? categories : categories.slice(0, 6);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
          {displayCategories.map((category) => (
            <Link
              key={category.id}
              href={`/${params?.locale || 'en'}/category/${category.id}`}
              className="flex flex-col items-center group relative"
            >
              <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4 overflow-hidden bg-gray-50 relative">
                {/* Red badge for product count */}
                {category.products_count > 0 && (
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full z-10">
                    {category.products_count} 
                  </span>
                )}
                <div className="relative w-24 h-24 rounded-full">
                  <Image
                    src={`https://setalkel.amjadshbib.com/public/${category.image}`}
                    alt={category.name_translations?.en || 'Category'}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <span className="text-gray-800 font-medium group-hover:text-[#00B207] transition-colors text-center">
                {category.name_translations?.en}
              </span>
            </Link>
          ))}
        </div>

        {/* Show More / Show Less Button */}
        {categories.length > 6 && (
          <div className="flex justify-center mt-8">
            <motion.button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2 bg-[#00B207] text-white rounded-full hover:bg-[#009706] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showAll ? 'Show Less' : 'Show More'}
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
