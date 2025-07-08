'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ProductCard from './ProductCard';
import { useParams } from 'next/navigation';

const CategoryProducts = () => {
    const params = useParams();
    const { data: categoriesData, isLoading, error } = useQuery({
        queryKey: ['get-categories'],
        queryFn: async () => {
            const { data } = await axios.get(`https://setalkel.amjadshbib.com/api/categories`);
            return data?.data;
        },
    });

    if (isLoading) {
        return (
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-semibold mb-6">Categories</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="animate-pulse bg-gray-200 rounded-2xl p-6 h-[200px]" />
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

    // Filter out hidden categories
    const categories = categoriesData
        ? categoriesData.filter(category => !category.is_hidden)
        : [];

    if (categories.length === 0) {
        return (
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="text-gray-500">No categories found</div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-semibold mb-6">Featured Categories</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
                    {categories.map((category) => (
                        <Link
                            href={`/${params?.locale || 'en'}/category/${category.id}`}
                            key={category.id}
                            className="block"
                        >
                            <CategoryCard category={category} />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

// CategoryCard component to display category information
const CategoryCard = ({ category }) => {
    return (
        <motion.div
            className="shadow-lg w-full relative bg-white mb-2 rounded-2xl overflow-hidden group h-[200px]"
            style={{ width: 'calc(100% - 8px)' }}
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ duration: 0.3 }}
        >
            {/* Image Section */}
            <div className="relative w-full h-32 bg-gray-50">
                <motion.div
                    className="absolute inset-0"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    <Image
                        src={`https://setalkel.amjadshbib.com${category.image}`}
                        alt={category.name_translations?.en || 'Category'}
                        fill
                        className="object-cover"
                    />
                </motion.div>
            </div>

            {/* Content Section */}
            <div className="px-4 py-3 flex flex-col justify-center items-center">
                <motion.h3
                    className="text-lg font-semibold text-gray-800 text-center"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                >
                    {category.name_translations?.en}
                </motion.h3>
            </div>
        </motion.div>
    );
};

// This component is for displaying products in a category page
const CategoryProductsSection = ({ category }) => {
    const [hoveredId, setHoveredId] = useState(null);
    const containerRef = useRef(null);
    const progressRef = useRef(null);
    const x = useMotionValue(0);
    const params = useParams();

    const updateProgressBar = (scrollLeft) => {
        if (!containerRef.current || !progressRef.current) return;
        const scrollWidth = containerRef.current.scrollWidth - containerRef.current.clientWidth;
        const progress = (scrollLeft / scrollWidth) * (progressRef.current.clientWidth - 100);
        x.set(-progress);
    };

    const handleScroll = (e) => {
        const scrollLeft = e.target.scrollLeft;
        updateProgressBar(scrollLeft);
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    if (!category.products || category.products.length === 0) {
        return (
            <div className="px-8 py-8">
                <h2 className="text-2xl font-semibold mb-6">{category.name_translations?.en}</h2>
                <div className="text-gray-500">No products in this category</div>
            </div>
        );
    }

    return (
        <div className="px-8 py-8">
            <h2 className="text-2xl font-semibold mb-6">{category.name_translations?.en}</h2>

            <div
                ref={containerRef}
                className="grid grid-cols-5 w-full overflow-x-auto hide-scrollbar gap-6 relative mb-4"
                style={{
                    scrollBehavior: 'smooth',
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                {category.products.map((product) => (
                    <Link
                        href={`/${params?.locale || 'en'}/${product.product_code}`}
                        key={product.id}
                        className="block"
                    >
                        <ProductCard product={product} />
                    </Link>
                ))}
            </div>

            {/* Progress Bar */}
            <div
                ref={progressRef}
                className="relative h-1 bg-gray-200 rounded-full mt-6 w-full overflow-hidden"
            >
                <motion.div
                    className="absolute left-0 h-full w-[100px] bg-green-500 rounded-full"
                    style={{ x }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            </div>

            <style jsx global>{`
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default CategoryProducts;
export { CategoryProductsSection };