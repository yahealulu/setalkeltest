'use client';

import Image from 'next/image';
import Link from 'next/link';
import { freshFruit, freshvegetables, meet, Snacks } from '../../public/images';

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: 'Fresh Vegetables',
      icon: freshvegetables,
      href: '/category/vegetables'
    },
    {
      id: 2,
      name: 'Fresh Fruits',
      icon: freshFruit,
      href: '/category/fruits'
    },
    {
      id: 3,
      name: 'Meat & Fish',
      icon: meet,
      href: '/category/meat-fish'
    },
    {
      id: 4,
      name: 'Snacks',
      icon: Snacks,
      href: '/category/snacks'
    }
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-7 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="flex flex-col items-center group"
            >
              <div className="w-24 h-24 rounded-[100%]  flex items-center justify-center mb-4">
                <div className="relative w-24 h-24 rounded-[100%] ">
                  <Image
                    src={category.icon}
                    alt={category.name}
                    fill
                    className=" relative w-24 h-24 rounded-[100%]  "
                  />
                </div>
              </div>
              <span className="text-gray-800 font-medium group-hover:text-[#00B207] transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories; 