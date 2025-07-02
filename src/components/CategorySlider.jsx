'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios'
// const categories = [
//     {
//         id: 1,
//         title: 'Vegetables & Fruits',
//         bgColor: 'bg-[#F2F7EA]',
//         image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
//         items: [
//             'Fresh Fruits',
//             'Fresh Vegetables',
//             'Frozen Veg',
//             'Leafies & Herbs',
//             'Mushrooms'
//         ]
//     },
//     {
//         id: 2,
//         title: 'Seafood',
//         bgColor: 'bg-[#EBF5FA]',
//         image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
//         items: [
//             'Fresh Fish',
//             'Fresh Shellfish',
//             'Frozen Fish'
//         ]
//     },
//     {
//         id: 3,
//         title: 'Vegan Meat',
//         bgColor: 'bg-[#FFF1F0]',
//         image: 'https://images.unsplash.com/photo-1565021015436-62c8490f221b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
//         items: [
//             'Bacon',
//             'Beef',
//             'Burgers',
//             'Chicken',
//             'Deli Meat'
//         ]
//     },
//     {
//         id: 4,
//         title: 'Dairy',
//         bgColor: 'bg-[#F0F7FF]',
//         image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
//         items: [
//             'Butter',
//             'Cheese',
//             'Eggs',
//             'Milk & Cream',
//             'Yogurt'
//         ]
//     },
//     // Adding more items to make the slider scrollable
//     {
//         id: 5,
//         title: 'Bakery',
//         bgColor: 'bg-[#FFF7E6]',
//         image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
//         items: [
//             'Bread',
//             'Pastries',
//             'Cakes',
//             'Cookies',
//             'Muffins'
//         ]
//     },
//     {
//         id: 6,
//         title: 'Beverages',
//         bgColor: 'bg-[#E6F9FF]',
//         image: 'https://images.unsplash.com/photo-1543253687-c931c8e01820?w=500',
//         items: [
//             'Coffee',
//             'Tea',
//             'Juices',
//             'Soft Drinks',
//             'Water'
//         ]
//     }
// ];

const CategorySlider = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef(null);
    const progressRef = useRef(null);
    const x = useMotionValue(0);
    const controls = useAnimation();
   
    const { data: categories, error , isLoading } = useQuery({
        queryKey: ['get-categories'],
        queryFn: async () => {
            const { data } = await axios.get(`https://setalkel.amjadshbib.com/api/categories`);
            return data?.data;
        },
    });
// console.log(categories)
    const updateProgressBar = (scrollLeft) => {
        if (!containerRef.current || !progressRef.current) return;
        const scrollWidth = containerRef.current.scrollWidth - containerRef.current.clientWidth;
        const progress = (scrollLeft / scrollWidth) * (progressRef.current.clientWidth - 100);
        x.set(-progress);
    };

    const handleScroll = (e) => {
        const scrollLeft = e.target.scrollLeft;
        updateProgressBar(scrollLeft);
        const cardWidth = containerRef.current.clientWidth / 4;
        const newIndex = Math.floor(scrollLeft / cardWidth);
        setActiveIndex(newIndex);
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    if (isLoading) {
        return (
            <div className="px-6 py-8">
                <h2 className="text-2xl font-semibold mb-6">Popular Categories</h2>
                <div className="flex gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse bg-gray-200 rounded-2xl p-6 w-[calc(25%-18px)] h-[200px]" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-6 py-8">
                <h2 className="text-2xl font-semibold mb-6">Popular Categories</h2>
                <div className="text-red-500">Error loading categories</div>
            </div>
        );
    }

    if (!categories || categories?.length === 0) {
        return (
            <div className="px-6 py-8">
                <h2 className="text-2xl font-semibold mb-6">Popular Categories</h2>
                <div className="text-gray-500">No categories found</div>
            </div>
        );
    }

    return (
        <div className="px-8 py-8">
            <h2 className="text-2xl font-semibold mb-6">Popular Categories</h2>

            <div
                ref={containerRef}
                className="flex overflow-x-auto hide-scrollbar gap-6 relative mb-4"
                style={{
                    scrollBehavior: 'smooth',
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                {categories.map((category) => (
                    <motion.div
                        key={category.id}
                        className="shadow bg-white rounded-2xl p-6 cursor-pointer overflow-hidden flex-shrink-0"
                        style={{ width: 'calc(25% - 18px)' }}
                        whileHover={{ y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="relative h-full flex flex-col">
                            <div className="relative w-full h-32 mb-4">
                                <motion.div
                                    className="absolute inset-0"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Image
                                        src={`https://setalkel.amjadshbib.com/public${category.image}`}
                                        alt={category.name_translations?.en || 'Category'}
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
                                    {category.name_translations?.en}
                                </motion.h3>
                                
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div
                ref={progressRef}
                className="relative h-1 bg-gray-200 rounded-full mt-6 w-full"
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

export default CategorySlider;