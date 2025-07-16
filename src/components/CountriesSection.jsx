'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useMotionValue } from 'framer-motion';
import { Plane, Ship, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ReactFlagsSelect from 'react-flags-select';

const CountriesSection = () => {
    const { data: countries, isLoading, error } = useQuery({
        queryKey: ['get-countries'],
        queryFn: async () => {
            const { data } = await axios.get(`https://setalkel.amjadshbib.com/api/countries`);
            return data?.data;
        },
    });

    const containerRef = useRef(null);
    const progressRef = useRef(null);
    const x = useMotionValue(0);
    const [isHovered, setIsHovered] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateProgressBar = (scrollLeft) => {
        if (!containerRef.current || !progressRef.current) return;
        const scrollWidth = containerRef.current.scrollWidth - containerRef.current.clientWidth;
        const progress = (scrollLeft / scrollWidth) * (progressRef.current.clientWidth - 100);
        x.set(-progress);
    };

    const updateScrollButtons = () => {
        const el = containerRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    const handleScroll = (e) => {
        const scrollLeft = e.target.scrollLeft;
        updateProgressBar(scrollLeft);
        updateScrollButtons();
    };

    const scrollByAmount = (amount) => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        updateScrollButtons();
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let animationFrame;

        const autoScroll = () => {
            const speed = isHovered ? 0.15 : 0.75; // سرعة 150% أسرع
            container.scrollLeft += speed;

            if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 1) {
                container.scrollLeft = 0;
            }

            updateScrollButtons();
            animationFrame = requestAnimationFrame(autoScroll);
        };

        animationFrame = requestAnimationFrame(autoScroll);
        return () => cancelAnimationFrame(animationFrame);
    }, [isHovered]);

    if (isLoading) {
        return <div className="px-8 py-8">Loading...</div>;
    }

    if (error) {
        return <div className="px-8 py-8 text-red-600">Error loading countries.</div>;
    }

    return (
        <div className="relative px-8 py-8">
            <h2 className="text-2xl font-semibold mb-6">Our Shipping Countries</h2>

            {/* Arrows */}
            {canScrollLeft && (
                <button
                    onClick={() => scrollByAmount(-300)}
                    className="absolute left-4 top-[50%] -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hover:scale-110 transition-all border border-gray-200"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
            )}
            {canScrollRight && (
                <button
                    onClick={() => scrollByAmount(300)}
                    className="absolute right-4 top-[50%] -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hover:scale-110 transition-all border border-gray-200"
                >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
            )}

            {/* Scrollable Container */}
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
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Progress bar */}
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
