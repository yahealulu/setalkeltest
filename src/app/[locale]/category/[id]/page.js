'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValue } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ProductCard from '../../../../components/ProductCard';
import { CategoryProductsSection } from '../../../../components/CategoryProducts';

const CategoryPage = ({ params }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(20);
    const containerRef = useRef(null);
    const progressRef = useRef(null);
    const x = useMotionValue(0);

    // Fetch category details
    const { data: category, isLoading: categoryLoading, error: categoryError } = useQuery({
        queryKey: ['category', params.id],
        queryFn: async () => {
            const { data } = await axios.get(`https://setalkel.amjadshbib.com/api/categories/${params.id}`);
            return data?.data;
        },
    });

    // Fetch category products
    const { data: categoryProducts, isLoading: productsLoading, error: productsError } = useQuery({
        queryKey: ['category-products', params.id],
        queryFn: async () => {
            const { data } = await axios.get(`https://setalkel.amjadshbib.com/api/categories-products/${params.id}`);
            return data?.data;
        },
    });

    // Calculate pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = categoryProducts ? categoryProducts.slice(indexOfFirstProduct, indexOfLastProduct) : [];
    const totalPages = categoryProducts ? Math.ceil(categoryProducts.length / productsPerPage) : 0;

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

    if (categoryLoading || productsLoading) {
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

    if (categoryError || productsError) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    Failed to load category details or products
                </div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-gray-500">Category not found</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Category Banner */}
            <div className="relative h-[300px] w-full rounded-2xl overflow-hidden mb-8">
                <Image
                    src={`https://setalkel.amjadshbib.com${category.image}`}
                    alt={category.name_translations?.en || 'Category'}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h1 className="text-4xl font-bold text-white">{category.name_translations?.en}</h1>
                </div>
            </div>

            {/* Products Section */}
            <div className="mt-8">
                {!categoryProducts || categoryProducts.length === 0 ? (
                    <div className="text-gray-500">No products found in this category</div>
                ) : (
                    <>
                        {/* Use the CategoryProductsSection component to display products */}
                        <CategoryProductsSection 
                            category={{
                                ...category,
                                products: currentProducts
                            }} 
                        />

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8">
                                <nav className="flex items-center">
                                    <button
                                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                        disabled={currentPage === 1}
                                        className={`px-4 py-2 mx-1 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                    >
                                        Previous
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                        <button
                                            key={number}
                                            onClick={() => paginate(number)}
                                            className={`px-4 py-2 mx-1 rounded-md ${currentPage === number ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                        >
                                            {number}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                        disabled={currentPage === totalPages}
                                        className={`px-4 py-2 mx-1 rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;