'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ShoppingCart } from 'lucide-react';
import Barcode from 'react-barcode';
import ProductCard from './ProductCard';

const CategoryProducts = () => {
    const { data: categories, isLoading, error } = useQuery({
        queryKey: ['get-categories'],
        queryFn: async () => {
            const { data } = await axios.get(`https://setalkel.amjadshbib.com/api/categories`);
            return data?.data;
        },
    });

    if (isLoading) {
        return (
            <div className="space-y-8">
                {[1, 2].map((categoryIndex) => (
                    <div key={categoryIndex} className="px-8 py-8">
                        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
                        <div className="flex gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="animate-pulse bg-gray-200 rounded-2xl p-6 w-[calc(25%-18px)] h-[200px]" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-8 py-8">
                <div className="text-red-500">Error loading categories and products</div>
            </div>
        );
    }

    if (!categories || categories.length === 0) {
        return (
            <div className="px-8 py-8">
                <div className="text-gray-500">No categories found</div>
            </div>
        );
    }

    return (
        <div className="">
            {categories.map((category) => (
                <CategorySection key={category.id} category={category} />
            ))}
        </div>
    );
};

const CategorySection = ({ category }) => {
    const [hoveredId, setHoveredId] = useState(null);
    const containerRef = useRef(null);
    const progressRef = useRef(null);
    const x = useMotionValue(0);

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
                className="grid grid-cols-5  w-full overflow-x-auto hide-scrollbar gap-6 relative mb-4"
                style={{
                    scrollBehavior: 'smooth',
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                {category.products.map((product) => (
                    <Link
                        href={`/${product.id}`}
                        key={product.id}
                        className="block"
                    >
                        <ProductCard product={product} setHoveredId={setHoveredId} hoveredId={hoveredId} />

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