'use client';

import { use, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Box, Globe, Tag, Barcode, Package, Scale } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { motion, useMotionValue } from 'framer-motion';
import axios from 'axios';

const ProductPage = ({ params }) => {
    const resolvedParams = use(params);
    const containerRef = useRef(null);
    const progressRef = useRef(null);
    const x = useMotionValue(0);

    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', resolvedParams.product],
        queryFn: async () => {
            const { data } = await axios.get(`https://setalkel.amjadshbib.com/api/products/${resolvedParams.product}`);
            return data?.data;
        }
    });

    const { data: variants } = useQuery({
        queryKey: ['variants', resolvedParams.product],
        queryFn: async () => {
            const { data } = await axios.get(`https://setalkel.amjadshbib.com/api/products/${resolvedParams.product}/variants`);
            console.log(data);
            return data?.data;
        },
    });

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

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-64 bg-gray-200 rounded-lg mb-4" />
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
            </div>
        );
    }

    if (error) {
        console.log(error);
        
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    Failed to load product details
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-gray-500">Product not found</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-8">
                {/* Left Column - Image and Basic Info */}
                <div className="space-y-6">
                    <div className="relative h-[500px] bg-gray-50 rounded-2xl overflow-hidden">
                        <Image
                            src={`https://setalkel.amjadshbib.com/${product.image}`}
                            alt={product.name_translations?.en || 'Product'}
                            fill
                            className="object-contain"
                        />
                        {product.is_new && (
                            <span className="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 rounded-tl-2xl text-sm">
                                New
                            </span>
                        )}
                        {product.is_hidden && (
                            <span className="absolute top-0 right-0 bg-yellow-500 text-white px-3 py-1 rounded-tr-2xl text-sm">
                                Hidden
                            </span>
                        )}
                    </div>
                </div>

                {/* Right Column - Details */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {product.name_translations?.en}
                        </h1>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Tag className="w-4 h-4" />
                            <span>Product Code: {product.product_code}</span>
                        </div>
                        {product.description_translations?.en && (
                            <p className="text-gray-600 text-lg">
                                {product.description_translations.en}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {product.in_stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        {product.is_new && (
                            <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium">New Product</span>
                        )}
                        {product.is_hidden && (
                            <span className="bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full text-sm font-medium">Hidden Product</span>
                        )}
                    </div>
                    
                    {/* Timestamps */}
                    <div className="space-y-4">
                        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Dates
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-gray-500">Created:</span>
                                <p className="font-medium">{new Date(product.created_at).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Last Updated:</span>
                                <p className="font-medium">{new Date(product.updated_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Variants Section */}
            {variants?.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-semibold mb-6">Available Variants</h2>
                    <div className="relative">
                        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 overflow-x-auto hide-scrollbar" style={{ scrollBehavior: 'smooth', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
                            {variants.map((variant) => (
                                <Link 
                                    href={`/${resolvedParams.locale}/${resolvedParams.product}/${variant.id}`} 
                                    key={variant.id}
                                    className="block"
                                >
                                    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                                        <div className="relative h-48 ">
                                            <Image
                                                src={`https://setalkel.amjadshbib.com/${variant.image}`}
                                                alt={`${product.name_translations?.en} - ${variant.size}`}
                                                fill
                                                className="object-contain"
                                            />
                                            {variant.is_new && (
                                                <span className="absolute top-0 left-0 bg-green-500 text-white px-2 py-1 rounded-tl-2xl text-xs">New</span>
                                            )}
                                        </div>
                                        <div className="p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-medium text-gray-900">{variant.size}</span>
                                                <span className="text-sm text-gray-500">{variant.packaging}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <span className="text-gray-500">Box:</span>
                                                    <p className="font-medium">{variant.box_dimensions}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Stock:</span>
                                                    <p className="font-medium">{variant.free_quantity} units</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Net Weight:</span>
                                                    <p className="font-medium">{variant.net_weight} kg</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Gross:</span>
                                                    <p className="font-medium">{variant.gross_weight} kg</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200">
                                                View Details
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div ref={progressRef} className="relative h-1 bg-gray-200 rounded-full mt-6 w-full overflow-hidden">
                            <motion.div
                                className="absolute left-0 h-full w-[100px] bg-green-500 rounded-full"
                                style={{ x }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        </div>
                    </div>
                </div>
            )}

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

export default ProductPage;