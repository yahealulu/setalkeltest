'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { motion, useMotionValue } from 'framer-motion';
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import CategorySection from '@/components/CategorySection'
import { useOrder } from '@/context/OrderContext'
import toast, { Toaster } from 'react-hot-toast'

// Step Components
const ContainerStep = ({ onChange, countries }) => {
    const { orderData } = useOrder();
    const selectedCountry = countries?.find(country => country.id === orderData.country_id);

    // Container specifications mapping
    const containerSpecs = {
        '20 cpm': {
            maxWeight: 28000,
            volume: 33,
            freezedMaxWeight: 25000,
            freezedVolume: 30
        },
        '40 cpm': {
            maxWeight: 26000,
            volume: 67,
            freezedMaxWeight: 24000,
            freezedVolume: 65
        },
        '40 hq': {
            maxWeight: 25000,
            volume: 76,
            freezedMaxWeight: 23000,
            freezedVolume: 75
        }
    };

    // Get available transportation types
    const availableTypes = selectedCountry ? 
        Object.entries({
            land: selectedCountry.land,
            sea: selectedCountry.sea,
            air: selectedCountry.air
        }).filter(([_, isAvailable]) => isAvailable).map(([type]) => type) 
        : [];

    // Get allowed sizes based on selected type
    const getAllowedSizes = () => {
        if (!selectedCountry || !orderData.container_standard?.type) return [];
        
        const sizeMap = {
            land: selectedCountry.land_allowed_sizes,
            sea: selectedCountry.sea_allowed_sizes,
            air: selectedCountry.air_allowed_sizes
        };
        
        return sizeMap[orderData.container_standard.type] || [];
    };

    const allowedSizes = getAllowedSizes();

    // Reset size and freezed when type changes
    const handleTypeChange = (type) => {
        onChange({
            container_standard: {
                ...orderData.container_standard,
                type,
                size: '',
                freezed: false
            },
            total_weight: 0,
            total_volume: 0
        });
    };

    // Update freezed status and container specs based on selected size
    const handleSizeChange = (size) => {
        const selectedSizeConfig = allowedSizes.find(s => s.size === size);
        const specs = containerSpecs[size.split(' (')[0]]; // Remove (freezed) from size if present
        
        if (specs) {
            const isFreezed = selectedSizeConfig?.freezed || false;
            onChange({
                container_standard: {
                    ...orderData.container_standard,
                    size,
                    freezed: isFreezed
                },
                total_weight: isFreezed ? specs.freezedMaxWeight : specs.maxWeight,
                total_volume: isFreezed ? specs.freezedVolume : specs.volume
            });
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Container Information</h2>

            {/* Country Selection - Always visible */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Destination Country</label>
                <select
                    value={orderData.country_id || ''}
                    onChange={(e) => onChange({ country_id: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                    <option value="">Select a country</option>
                    {countries?.map((country) => (
                        <option key={country.id} value={country.id}>
                            {country.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Show rest of the form only if country is selected */}
            {selectedCountry && (
                <>
                    {/* Container Details */}
                    {/* <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Box Count</label>
                            <input
                                type="number"
                                value={orderData.box_count}
                                onChange={(e) => onChange({ box_count: parseInt(e.target.value) })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Total Weight (kg)</label>
                            <input
                                type="number"
                                value={orderData.total_weight}
                                onChange={(e) => onChange({ total_weight: parseFloat(e.target.value) })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Total Volume (m³)</label>
                            <input
                                type="number"
                                value={orderData.total_volume}
                                onChange={(e) => onChange({ total_volume: parseFloat(e.target.value) })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Total Price</label>
                            <input
                                type="number"
                                value={orderData.total_price}
                                onChange={(e) => onChange({ total_price: parseFloat(e.target.value) })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            />
                        </div>
                    </div> */}

                    {/* Container Standard */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Container Specifications</h3>
                        <div className="space-y-4">
                            {/* Transportation Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                <div className="space-x-4">
                                    {availableTypes.map((type) => (
                                        <label key={type} className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="transportationType"
                                                value={type}
                                                checked={orderData.container_standard?.type === type}
                                                onChange={(e) => handleTypeChange(e.target.value)}
                                                className="rounded-full border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            />
                                            <span className="ml-2 capitalize">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Container Size */}
                            {orderData.container_standard?.type && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Size</label>
                                    <select
                                        value={orderData.container_standard?.size || ''}
                                        onChange={(e) => handleSizeChange(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    >
                                        <option value="">Select a size</option>
                                        {allowedSizes.map((sizeConfig) => (
                                            <option key={sizeConfig.size} value={sizeConfig.size}>
                                                {sizeConfig.size}{sizeConfig.freezed ? ' (Freezed)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

// OrderProductSelection Component
const OrderProductSelection = ({ onOrderComplete }) => {
    const router = useRouter();
    const { orderData } = useOrder();

    const { data: categories, isLoading, error } = useQuery({
        queryKey: ['get-categories'],
        queryFn: async () => {
            const { data } = await axios.get(`https://setalkel.amjadshbib.com/api/countries/${orderData.country_id}/categories`);
            return data?.data;
        },
    });

    // Function to check if product can be added to container
    const canAddToContainer = (product) => {
        if (!product) return false;
        
        const isProductFrozen = product.material_property === "frozen";
        const isContainerFrozen = orderData.container_standard?.freezed;

        return (isProductFrozen && isContainerFrozen) || (!isProductFrozen && !isContainerFrozen);
    };

    // Function to handle product click
    const handleProductClick = (e, product) => {
        e.preventDefault();
        
        if (!canAddToContainer(product)) {
            const isProductFrozen = product.material_property === "frozen";
            const message = isProductFrozen 
                ? "لا يمكن إضافة منتج مجمد إلى حاوية غير مجمدة. الرجاء اختيار منتج آخر."
                : "لا يمكن إضافة منتج غير مجمد إلى حاوية مجمدة. الرجاء اختيار منتج آخر.";
            
            toast.error(message, {
                duration: 4000,
                position: 'top-center',
            });
            return;
        }

        // If validation passes, navigate to product variants page
        router.push(`/orders/new/product/${product.id}`);
    };

    // Create order mutation
    const createOrderMutation = useMutation({
        mutationFn: async () => {
            const { data } = await axios.post(`https://setalkel.amjadshbib.com/api/orders`, {
                containers: [{
                    ...orderData
                }]
            })
    return data
},
    onSuccess: () => {
        alert('Order created successfully!')
            onOrderComplete?.()
        }
    })

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

return (
    <div className="relative min-h-screen pb-20">
        {/* Selected Variants Summary */}
        {orderData.product_ids.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="font-medium">Selected Variants: {orderData.product_ids.length}</span>
                        </div>
                        <button
                            onClick={() => createOrderMutation.mutate()}
                            disabled={createOrderMutation.isPending}
                            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                        >
                            {createOrderMutation.isPending ? 'Creating Order...' : 'Create Order'}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Categories and Products */}
        <div className="">
            {categories?.map((category) => (
                <div key={category.id} className="px-8 py-8">
                    <h2 className="text-2xl font-semibold mb-6">{category.name_translations?.en}</h2>
                    <div className="grid grid-cols-5 gap-6">
                        {category.products?.map((product) => {
                            const isProductFrozen = product.material_property === "frozen";
                            const isContainerFrozen = orderData.container_standard?.freezed;
                            const containerMismatch = (isProductFrozen && !isContainerFrozen) || (!isProductFrozen && isContainerFrozen);

                            return (
                                <div
                                    key={product.id}
                                    onClick={(e) => handleProductClick(e, product)}
                                    className={`cursor-pointer ${containerMismatch ? 'opacity-50' : ''}`}
                                >
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                                        <div className="relative h-48">
                                            <Image
                                                src={`https://setalkel.amjadshbib.com/public/${product.image}`}
                                                alt={product.name_translations?.en}
                                                fill
                                            />
                                            {product.is_new && (
                                                <div className="absolute top-0 left-0 bg-green-500 text-white px-2 py-1 text-xs rounded-br">
                                                    New
                                                </div>
                                            )}
                                            {isProductFrozen && (
                                                <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-xs rounded-bl">
                                                    Frozen
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold mb-2">
                                                {product.name_translations?.en}
                                            </h3>
                                            {containerMismatch && (
                                                <div className="mt-2 text-sm text-red-600">
                                                    {isProductFrozen 
                                                        ? "يتطلب حاوية مجمدة"
                                                        : "الحاوية مجمدة - اختر منتج مجمد"}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
        <Toaster />
    </div>
);
}

// Main Component
export default function NewOrder() {
    const [step, setStep] = useState(1);
    const { orderData, updateOrderData, resetOrder } = useOrder();

    const { data: countries } = useQuery({
        queryKey: ['countries'],
        queryFn: async () => {
            const { data } = await axios.get(`https://setalkel.amjadshbib.com/api/countries`);
            return data?.data;
        }
    });

    return (
        <div className="container mx-auto px-4 py-8">
            {step === 1 ? (
                <div className="max-w-3xl mx-auto">
                    <ContainerStep
                        onChange={updateOrderData}
                        countries={countries}
                    />
                    <div className="mt-8">
                        <button
                            onClick={() => setStep(2)}
                            disabled={!orderData.country_id}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            Continue to Product Selection
                        </button>
                    </div>
                </div>
            ) : (
                <OrderProductSelection
                    onOrderComplete={() => {
                        setStep(1);
                        resetOrder();
                    }}
                />
            )}
        </div>
    );
}