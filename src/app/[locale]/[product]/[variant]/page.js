"use client"
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { use } from 'react';
import Image from 'next/image';
import { ShoppingCart, Box, Scale, Package, Calendar, Clock, Tag } from 'lucide-react';

const VariantPage = ({ params }) => {
    const resolvedParams = use(params);
    const { data: variant, isLoading, error } = useQuery({
        queryKey: ['variant', resolvedParams.product, resolvedParams.variant],
        queryFn: async () => {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}products/${resolvedParams.product}/variants/${resolvedParams.variant}`);
            return data?.data;
        }
    });

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
            <div className="grid grid-cols-2 gap-8">
                {/* Left Column - Image */}
                <div className="space-y-6">
                    <div className="relative h-[500px] w-[400px] mx-auto rounded-2xl overflow-hidden">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_Img}/${variant.image}`}
                            alt={variant.size}
                            fill
                            className="object-contain"
                        />
                        {variant.is_new && (
                            <span className="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 rounded-t--full text-sm">
                                New
                            </span>
                        )}
                        {variant.is_hidden && (
                            <span className="absolute top-0 right-0 bg-yellow-500 text-white px-3 py-1 rounded-te-full text-sm">
                                Hidden
                            </span>
                        )}
                    </div>
                </div>

                {/* Right Column - Details */}
                <div className="space-y-8">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold text-gray-900 capitalize">{variant.size}</h1>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Tag className="w-4 h-4" />
                            <span>Product Code: {variant.product.product_code}</span>
                        </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${variant.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {variant.in_stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        {variant.is_new && (
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                New Product
                            </span>
                        )}
                        {variant.is_hidden && (
                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                                Hidden
                            </span>
                        )}
                    </div>

                    {/* Detailed Information */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Packaging Information */}
                        <div className="space-y-4">
                            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Packaging Details
                            </h2>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-gray-500">Type:</span>
                                    <p className="font-medium capitalize">{variant.packaging}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Box Packing:</span>
                                    <p className="font-medium">{variant.box_packing}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Box Dimensions:</span>
                                    <p className="font-medium">{variant.box_dimensions}</p>
                                </div>
                            </div>
                        </div>

                        {/* Weight Information */}
                        <div className="space-y-4">
                            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Scale className="w-5 h-5" />
                                Weight Information
                            </h2>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-gray-500">Net Weight:</span>
                                    <p className="font-medium">{variant.net_weight} kg</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Gross Weight:</span>
                                    <p className="font-medium">{variant.gross_weight} kg</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Tare Weight:</span>
                                    <p className="font-medium">{variant.tare_weight} kg</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Standard Weight:</span>
                                    <p className="font-medium">{variant.standard_weight} kg</p>
                                </div>
                            </div>
                        </div>

                        {/* Stock Information */}
                        <div className="space-y-4">
                            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Box className="w-5 h-5" />
                                Stock Information
                            </h2>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-gray-500">Available Quantity:</span>
                                    <p className="font-medium">{variant.free_quantity} units</p>
                                </div>
                            </div>
                        </div>

                        {/* Timestamps */}
                        <div className="space-y-4">
                            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Dates
                            </h2>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-gray-500">Created:</span>
                                    <p className="font-medium">{new Date(variant.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Last Updated:</span>
                                    <p className="font-medium">{new Date(variant.updated_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        className={`w-full py-3 px-6 rounded-lg flex items-center justify-center gap-2 text-base font-medium transition-colors duration-200 ${variant.in_stock
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                        disabled={!variant.in_stock}
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {variant.in_stock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VariantPage;