'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const slides = [
    {
        id: 1,
        title: 'Get Discounts on Fresh\nVegetables & Fruits',
        subtitle: 'Up to - 10%',
        description: 'Discount will apply when you order ',
        description2: 'products with\nour delivery from 11 am - 4 pm',
        bgColor: 'bg-[#c9dbb3]',
        image: 'https://plus.unsplash.com/premium_photo-1675798983878-604c09f6d154?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dmVnZXRhYmxlc3xlbnwwfHwwfHx8MA%3D%3D'
    },
    {
        id: 2,
        title: 'Save up 30% on\nThe Original',
        subtitle: 'Oatly milk',
        tag: 'Weekly Discounts',
        bgColor: 'bg-[#F5E6D3]',
        image: 'https://images.unsplash.com/photo-1621470626377-dd2757ae6216?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG51dHN8ZW58MHx8MHx8fDA%3D'
    },

];

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="mx-10 px-2 py-1">
            <div className="flex gap-4">
                {/* Main Slider */}
                <div className="w-[60%] relative h-[400px] rounded-2xl overflow-hidden group">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-opacity duration-500 ${currentSlide === index ? 'opacity-100' : 'opacity-0'
                                }`}
                        >
                            <div className={`${slide.bgColor} h-full relative`}>
                                <div className="relative h-full z-[1000]">
                                    {/* Text Content */}
                                    <div className="absolute inset-0 p-8 z-20">
                                        <div className="flex flex-col max-w-[50%] py-9">
                                            {slide.tag && (
                                                <span className="inline-block bg-white px-4 py-1.5 rounded-full text-sm font-medium text-green-600 mb-4 w-fit">
                                                    {slide.tag}
                                                </span>
                                            )}
                                            <h1 className={`${index === 1 ? 'text-[#4AA3E5] font-bold text-5xl' : 'text-[#4c5a3c] text-3xl'} leading-tight font-medium mb-4`}>
                                                {slide.title}
                                            </h1>
                                            <h2 className={`${index === 1 ? 'text-[#4AA3E5] text-5xl' : 'text-[#4c5a3c] text-4xl'} font-bold mb-3`}>
                                                {slide.subtitle}
                                            </h2>

                                            {slide.description && (
                                                <div className="flex items-start gap-4">
                                                    <button className="bg-white mt-2 w-full text-nowrap text-gray-800 px-6 py-2 h-fit rounded-[10px] w-fit text-sm font-medium hover:bg-gray-50 transition-colors">
                                                        Shop Now
                                                    </button>
                                                    <div>
                                                        <p className="text-sm text-nowrap text-gray-700 ">
                                                            {slide.description}
                                                        </p>
                                                        <p className="text-sm text-nowrap text-gray-700 mb-6">
                                                            {slide.description2}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Product Image */}
                                    <div className={`absolute right-0 top-0 h-full w-[350px] z-[0]`}>
                                        <Image
                                            src={slide.image}
                                            alt={slide.title}
                                            fill
                                            className={` w-[350px]`}
                                            priority
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 z-[999999] top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Previous slide"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 z-[999999] top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Next slide"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 6L15 12L9 18" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    {/* Dots Navigation */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? 'w-8 bg-white' : 'bg-white/50'
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Promotional Cards */}
                <div className="w-[40%] flex gap-6">
                    {/* Energy Drinks Card */}
                    <div className="w-full bg-[#E3F0FF] rounded-2xl overflow-hidden group cursor-pointer">
                        <div className="p-6 h-[400px] relative text-center">
                            <div>
                                <p className="text-sm font-semibold text-[#1e5b87]">SAVE UP TO 35% ON</p>
                                <h3 className="text-xl font-bold text-[#1e5b87] mt-1">Energy Drinks</h3>
                                <Link
                                    href="/shop-now"
                                    className="text-sm font-medium text-gray-600 underline text-gray-700 hover:text-gray-900 mt-2 inline-block underline-offset-4 hover:underline"
                                >
                                    Shop Now
                                </Link>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-[60%] transition-transform duration-500 group-hover:scale-110">
                                <Image
                                    src="https://images.unsplash.com/photo-1642532560930-77d5018c68f7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fEVuZXJneSUyMERyaW5rc3xlbnwwfHwwfHx8MA%3D%3D"
                                    alt="Energy Drinks"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Plant Nuggets Card */}
                    <div className="w-full bg-[#FFF3E5] rounded-2xl overflow-hidden group cursor-pointer">
                        <div className="p-6 h-[400px] relative text-center">
                            <div>
                                <p className="text-sm font-semibold text-[#966919]">GET DISCOUNT -15% ON</p>
                                <h3 className="text-xl font-bold text-[#966919] mt-1">Plant Nuggets</h3>
                                <Link
                                    href="/buy-now"
                                    className="text-sm font-medium text-gray-600 underline text-gray-700 hover:text-gray-900 mt-2 inline-block underline-offset-4 hover:underline"
                                >
                                    Buy Now
                                </Link>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-[70%] transition-transform duration-500 group-hover:scale-110">
                                <Image
                                    src="https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=500&auto=format&fit=crop&q=60"
                                    alt="Plant Nuggets"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;