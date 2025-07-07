'use client';

import Image from "next/image";
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
    return (
        <motion.div
            className="shadow-lg w-full relative bg-white mb-2 rounded-2xl overflow-hidden group h-[380px]"
            style={{ width: 'calc(100% - 18px)' }}
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ duration: 0.3 }}
        >
            {/* Status Ribbon */}
            {!product.in_stock && (
                <div className="absolute top-5 right-0 z-20">
                    <div className="bg-red-500 text-white text-xs py-1 px-4 rounded-l-full shadow-md">
                        Out of Stock
                    </div>
                </div>
            )}

            {/* New Badge */}
            {product.is_new && (
                <div className="absolute top-0 left-0 z-20">
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-te-full shadow-md">
                        New
                    </div>
                </div>
            )}

            {/* Image Section */}
            <div className="relative w-full h-48 bg-gray-50">
                <motion.div
                    className="absolute inset-0"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    <Image
                        src={`https://setalkel.amjadshbib.com/public/${product.image}`}
                        alt={product.name_translations?.en || 'Product'}
                        fill
                        className="object-cover"
                    />
                </motion.div>
            </div>

            {/* Content Section */}
            <div className="px-4 py-3 pt-0 flex flex-col gap-2">
                {/* Title */}
                <motion.h3
                    className="text-lg font-semibold text-gray-800 line-clamp-1"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                >
                    {product.name_translations?.en}
                </motion.h3>

                {/* Description */}
                {product.description_translations?.en && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                        {product.description_translations.en}
                    </p>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-sm mt-1">
                    {product.weight_unit && (
                        <div className="flex flex-col">
                            <span className="text-gray-500">Unit</span>
                            <span className="font-medium text-gray-700 uppercase">
                                {product.weight_unit}
                            </span>
                        </div>
                    )}
                </div>

                {/* Tags */}
                {product.material_property && (
                    <div className="flex gap-2 mt-1">
                        <span className="text-xs px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full font-medium">
                            {product.material_property}
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ProductCard;
