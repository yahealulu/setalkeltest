'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useMotionValue } from 'framer-motion';
import { Plane, Ship, Truck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ReactFlagsSelect from 'react-flags-select';

const CountriesSection = () => {
    const { data: countries, isLoading, error } = useQuery({
        queryKey: ['get-countries'],
        queryFn: async () => {
            const { data } = await axios.get(`https://setalkel.amjadshbib.com/api/countries`);
            console.log(data);
            return data?.data;
        },
    });

    const containerRef = useRef(null);
    const progressRef = useRef(null);
    const x = useMotionValue(0);

    const [isHovered, setIsHovered] = useState(false);

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

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let animationFrame;

        const autoScroll = () => {
            const speed = isHovered ? 0.15 : 0.99; // ✅ سرعة 150% أعلى من الأصل
            container.scrollLeft += speed;

            if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 1) {
                container.scrollLeft = 0;
            }

            animationFrame = requestAnimationFrame(autoScroll);
        };

        animationFrame = requestAnimationFrame(autoScroll);

        return () => cancelAnimationFrame(animationFrame);
    }, [isHovered]);

    if (isLoading) {
        return (
            <div className="px-8 py-8">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
                <div className="flex gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse bg-gray-200 rounded-2xl p-6 w-[calc(25%-18px)] h-[280px]" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-8 py-8">
                <h2 className="text-2xl font-semibold mb-6">Our Shipping Countries</h2>
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    Error loading shipping countries. Please try again later.
                </div>
            </div>
        );
    }

    if (!countries || countries.length === 0) {
        return (
            <div className="px-8 py-8">
                <h2 className="text-2xl font-semibold mb-6">Our Shipping Countries</h2>
                <div className="text-gray-500">No countries found</div>
            </div>
        );
    }

    return (
        <div className="px-8 py-8">
            <h2 className="text-2xl font-semibold mb-6">Our Shipping Countries</h2>

            <div
                ref={containerRef}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="flex overflow-x-auto hide-scrollbar gap-6 relative mb-4"
                style={{
                    scrollBehavior: 'smooth',
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch',
                }}
            >
                {countries.map((country) => (
                    <motion.div
                        key={country.id}
                        className="shadow bg-white rounded-2xl p-6 cursor-pointer overflow-hidden flex-shrink-0"
                        style={{ width: 'calc(25% - 18px)' }}
                        whileHover={{ y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-2">
                                <ReactFlagsSelect
                                    selected={country.code.toUpperCase()}
                                    showSelectedLabel={false}
                                    showOptionLabel={false}
                                    showSecondarySelectedLabel={false}
                                    showSecondaryOptionLabel={false}
                                    selectedSize={25}
                                    disabled
                                    className="!p-0 !w-auto !border-none menu-flags"
                                />
                                <h3 className="text-xl font-semibold capitalize">{country.name}</h3>
                            </div>

                            <div className="flex gap-4 mb-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <span className="font-medium">{country.categories_count}</span>
                                    <span>Categories</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-medium">{country.products_count}</span>
                                    <span>Products</span>
                                </div>
                            </div>

                            <div className="flex gap-3 mb-6">
                                {country.air && (
                                    <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg">
                                        <Plane className="w-4 h-4" />
                                        <span className="text-sm">Air</span>
                                    </div>
                                )}
                                {country.sea && (
                                    <div className="flex items-center gap-2 bg-green-50 text-green-600 px-3 py-2 rounded-lg">
                                        <Ship className="w-4 h-4" />
                                        <span className="text-sm">Sea</span>
                                    </div>
                                )}
                                {country.land && (
                                    <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-2 rounded-lg">
                                        <Truck className="w-4 h-4" />
                                        <span className="text-sm">Land</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                {country.air && country?.air_allowed_sizes?.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-600 mb-2">Air Shipping Sizes:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {country?.air_allowed_sizes?.map((size, index) => (
                                                <span
                                                    key={index}
                                                    className={`text-xs px-2 py-1 rounded ${
                                                        size.freezed
                                                            ? 'bg-red-50 text-red-600'
                                                            : 'bg-blue-50 text-blue-600'
                                                    }`}
                                                >
                                                    {size.size}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {country.sea && country.sea_allowed_sizes?.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-600 mb-2">Sea Shipping Sizes:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {country.sea_allowed_sizes?.map((size, index) => (
                                                <span
                                                    key={index}
                                                    className={`text-xs px-2 py-1 rounded ${
                                                        size.freezed
                                                            ? 'bg-red-50 text-red-600'
                                                            : 'bg-green-50 text-green-600'
                                                    }`}
                                                >
                                                    {size.size}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {country.land && country.land_allowed_sizes?.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-600 mb-2">Land Shipping Sizes:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {country.land_allowed_sizes?.map((size, index) => (
                                                <span
                                                    key={index}
                                                    className={`text-xs px-2 py-1 rounded ${
                                                        size.freezed
                                                            ? 'bg-red-50 text-red-600'
                                                            : 'bg-orange-50 text-orange-600'
                                                    }`}
                                                >
                                                    {size.size}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
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
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
                .menu-flags {
                    pointer-events: none;
                }
                .menu-flags button {
                    border: none !important;
                    padding: 0 !important;
                    background: transparent !important;
                }
                .menu-flags .ReactFlagsSelect-module_selectBtn__19wW7 {
                    padding: 0 !important;
                    background: transparent !important;
                }
                .menu-flags .ReactFlagsSelect-module_selectValue__152eS {
                    padding: 0 !important;
                }
                .menu-flags .ReactFlagsSelect-module_selectBtn__19wW7:after {
                    display: none !important;
                }
                .menu-flags .ReactFlagsSelect-module_flagsSelect__2pfa2 {
                    padding: 0 !important;
                }
            `}</style>
        </div>
    );
};

export default CountriesSection;
