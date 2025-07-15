'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ArrowLeft, Package, Scale, Barcode, Box, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import JsBarcode from 'jsbarcode';

const VariantPage = () => {
    const router = useRouter();
    const params = useParams();
    const [barcodeUrl, setBarcodeUrl] = useState('');

    // Fetch variant data
    const { data: variant, isLoading, error } = useQuery({
        queryKey: ['variant', params.product, params.variant],
        queryFn: async () => {
            const { data } = await axios.get(
                `https://setalkel.amjadshbib.com/api/products/${params.product}/variants/${params.variant}`
            );
            return data?.data;
        },
        enabled: !!params.product && !!params.variant
    });

    // Generate barcode image
    useEffect(() => {
        if (variant?.barcode) {
            const canvas = document.createElement('canvas');
            try {
                JsBarcode(canvas, variant.barcode, {
                    format: 'CODE128',
                    displayValue: true,
                    fontSize: 16,
                    margin: 10,
                    background: '#ffffff',
                    lineColor: '#000000',
                    width: 2,
                    height: 100,
                });
                setBarcodeUrl(canvas.toDataURL('image/png'));
            } catch (e) {
                console.error('Error generating barcode:', e);
                // Fallback to text display if barcode generation fails
            }
        }
    }, [variant]);

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
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    Failed to load variant details
                </div>
            </div>
        );
    }

    if (!variant) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-gray-500">Variant not found</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back button and title */}
            <div className="flex items-center mb-8">
                <button
                    onClick={() => router.back()}
                    className="mr-4 p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-3xl font-bold text-gray-800">Variant Details</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Image and Basic Info */}
                <div className="space-y-6">
                    <div className="relative h-[400px] bg-gray-50 rounded-2xl overflow-hidden shadow-md">
                        <Image
                            src={variant.image ? `https://setalkel.amjadshbib.com/public/${variant.image}` : '/placeholder-product.jpg'}
                            alt={variant.size || 'Variant'}
                            fill
                            className="object-contain"
                        />
                    </div>

                    {/* Barcode Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-md p-6 space-y-4"
                    >
                        <h2 className="text-xl font-semibold flex items-center">
                            <Barcode className="w-5 h-5 mr-2 text-indigo-600" />
                            Barcode
                        </h2>
                        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
                            {barcodeUrl ? (
                                <img src={barcodeUrl} alt="Product Barcode" className="max-w-full" />
                            ) : (
                                <div className="text-gray-600 text-center">
                                    <p className="font-mono text-lg">{variant.barcode}</p>
                                    <p className="text-sm mt-2">Barcode display unavailable</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Right Column - Details */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-md p-6 space-y-6"
                    >
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-800">{variant.size}</h2>
                            
                            <div className="flex flex-wrap gap-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${variant.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {variant.in_stock ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>
                        </div>

                        {/* Packaging Information */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold flex items-center">
                                <Package className="w-5 h-5 mr-2 text-indigo-600" />
                                Packaging Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Packaging Type</p>
                                    <p className="font-medium">{variant.packaging}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Box Packing</p>
                                    <p className="font-medium">{variant.box_packing}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Box Dimensions</p>
                                    <p className="font-medium">{variant.box_dimensions}</p>
                                </div>
                            </div>
                        </div>

                        {/* Weight Information */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold flex items-center">
                                <Scale className="w-5 h-5 mr-2 text-indigo-600" />
                                Weight Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Net Weight</p>
                                    <p className="font-medium">{variant.net_weight} g</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Gross Weight</p>
                                    <p className="font-medium">{variant.gross_weight} g</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Tare Weight</p>
                                    <p className="font-medium">{variant.tare_weight} g</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Standard Weight</p>
                                    <p className="font-medium">{variant.standard_weight} g</p>
                                </div>
                            </div>
                        </div>

                        {/* User Rating & Price (if available) */}
                        {(variant.user_rating || variant.user_price) && (
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold">User Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                                    {variant.user_rating && (
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">User Rating</p>
                                            <p className="font-medium">{variant.user_rating}</p>
                                        </div>
                                    )}
                                    {variant.user_price && (
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">User Price</p>
                                            <p className="font-medium">${JSON.stringify(variant.user_price)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                        <Link 
                            href={`/${params.locale}/${params.product}`}
                            className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-indigo-700 transition-colors text-center"
                        >
                            Back to Product
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VariantPage;