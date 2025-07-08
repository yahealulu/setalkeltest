'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const Categories = () => {
  const params = useParams();
  const { data: categoriesData, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await axios.get('https://setalkel.amjadshbib.com/api/categories');
      return data?.data;
    },
  });
  
  // Show loading state
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
  
  // Show error state
  if (error) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-red-500">Error loading categories</div>
        </div>
      </section>
    );
  }
  
  // Filter out hidden categories but show all of them
  const categories = categoriesData
    ? categoriesData.filter(category => !category.is_hidden)
    : [];

  // If no categories found
  if (!categories || categories.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-gray-500">No categories available</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
                key={category.id}
                href={`/${params?.locale || 'en'}/category/${category.id}`}
                className="flex flex-col items-center group"
              >
              <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4 overflow-hidden bg-gray-50">
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
      </div>
    </section>
  );
};

export default Categories;