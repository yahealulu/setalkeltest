'use client'

import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { use, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Check, Plus, Minus } from 'lucide-react';
import { useOrder } from '@/context/OrderContext';
import toast, { Toaster } from 'react-hot-toast';

const calculateBoxVolume = (dimensions) => {
    try {
        // Handle case where dimensions might be undefined or null
        if (!dimensions) return 0;
        
        // Remove any quotes and split by 'x'
        const [length, width, height] = dimensions.replace(/"/g, '').split('x').map(num => {
            const parsed = parseFloat(num);
            return isNaN(parsed) ? 0 : parsed;
        });
        
        // Calculate volume in cubic meters (assuming dimensions are in cm)
        const volumeInCm = length * width * height;
        const volumeInM = volumeInCm / 1000000; // Convert to cubic meters
        return isNaN(volumeInM) ? 0 : volumeInM;
    } catch (error) {
        console.error('Error calculating box volume:', error);
        return 0;
    }
};

const calculateWeightInTons = (dimensions) => {
    try {
        // Get volume in cubic meters
        const volumeInM = calculateBoxVolume(dimensions);
        // Convert to tons (using average density factor)
        const weightInTons = volumeInM * 1; // 1 cubic meter = 1 ton (approximate)
        return isNaN(weightInTons) ? 0 : weightInTons;
    } catch (error) {
        console.error('Error calculating weight in tons:', error);
        return 0;
    }
};

const ProductVariantsPage = ({ params }) => {
    const router = useRouter();
    const resolvedParams = use(params);
    const { 
        orderData, 
        containers,
        currentContainerIndex,
        addVariant, 
        removeVariant, 
        updateVariantNote, 
        updateVariantQuantity,
        addNewContainer,
        resetOrder
    } = useOrder();

    // Check if product can be added to container based on frozen status
    const canAddToContainer = () => {
        if (!product) return false;
        
        const isProductFrozen = product.material_property === "frozen";
        const isContainerFrozen = orderData.container_standard?.freezed;

        if (isProductFrozen && !isContainerFrozen) {
            toast.error("لا يمكن إضافة منتج مجمد إلى حاوية غير مجمدة");
            return false;
        }

        if (!isProductFrozen && isContainerFrozen) {
            toast.error("لا يمكن إضافة منتج غير مجمد إلى حاوية مجمدة");
            return false;
        }

        return true;
    };

    // Calculate total weight and check if it exceeds limit
    const calculateTotalWeight = () => {
        try {
            if (!variants || !orderData.product_ids.length) return 0;
            
            const totalWeight = orderData.product_ids.reduce((total, item) => {
                const variant = variants.find(v => v.id === item.id);
                if (variant && variant.box_dimensions) {
                    const variantWeight = calculateWeightInTons(variant.box_dimensions);
                    const quantity = parseInt(item.quantity) || 1;
                    return total + (variantWeight * quantity);
                }
                return total;
            }, 0);

            return isNaN(totalWeight) ? 0 : totalWeight;
        } catch (error) {
            console.error('Error calculating total weight:', error);
            return 0;
        }
    };

    const isWeightExceeded = () => {
        const totalWeightInTons = calculateTotalWeight();
        const maxWeightInTons = orderData.total_weight / 1000; // Convert kg to tons
        return totalWeightInTons > maxWeightInTons;
    };

    // Check weight limit and show toast
    useEffect(() => {
        // Remove the automatic container creation
    }, [orderData.product_ids]);

    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', resolvedParams.id],
        queryFn: async () => {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}products/${resolvedParams.id}`);
            return data?.data;
        }
    });

    const { data: variants } = useQuery({
        queryKey: ['variants', resolvedParams.id],
        queryFn: async () => {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}products/${resolvedParams.id}/variants`);
            return data?.data;
        },
        enabled: !!product
    });

    const handleVariantSelect = (variant) => {
        if (!canAddToContainer()) {
            return;
        }

        const isSelected = orderData.product_ids.some(v => v.id === variant.id);
        if (isSelected) {
            removeVariant(variant.id);
        } else {
            addVariant(variant.id, '', 1, variant.price || 0);
        }
    };

    const handleNoteChange = (variantId, note) => {
        updateVariantNote(variantId, note);
    };

    const handleQuantityChange = (variantId, newQuantity) => {
        if (newQuantity >= 1) {
            const updatedQuantity = parseInt(newQuantity);
            const previousQuantity = orderData.product_ids.find(item => item.id === variantId)?.quantity || 1;
            
            // First update the quantity
            updateVariantQuantity(variantId, updatedQuantity);
            
            // Check weight limit after quantity change
            const totalWeight = calculateTotalWeight();
            const maxWeightInTons = orderData.total_weight / 1000;
            
            if (totalWeight > maxWeightInTons) {
                // Revert the quantity change temporarily
                updateVariantQuantity(variantId, previousQuantity);
                
                // Show confirmation dialog
                if (window.confirm(`تجاوزت الحد الأقصى للوزن (${maxWeightInTons} طن). هل تريد فتح حاوية جديدة؟`)) {
                    // If user confirms, create new container and apply the quantity change
                    addNewContainer();
                    updateVariantQuantity(variantId, updatedQuantity);
                    toast.success(
                        `تم إنشاء حاوية جديدة تلقائياً بنفس المواصفات. يمكنك تعديل المواصفات من خلال زر "تعديل معلومات الحاوية"`,
                        {
                            duration: 4000,
                            position: 'top-center',
                        }
                    );
                } else {
                    // If user cancels, just show a warning
                    toast.warning(
                        `تم تجاوز الحد الأقصى للوزن. لن يتم إنشاء حاوية جديدة.`,
                        {
                            duration: 4000,
                            position: 'top-center',
                        }
                    );
                }
            }
        }
    };

    const createOrderMutation = useMutation({
        mutationFn: async () => {
            // Convert all containers to the right format
            const containersData = containers.map(container => ({
                ...container,
                product_ids: container.product_ids.map(item => ({
                    ...item,
                    quantity: String(item.quantity)
                }))
            }));

            const { data } = await axios.post(
                `https://setalkel.amjadshbib.com/api/container`,
                {
                    containers: containersData
                },
                {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                }
            );
            return data;
        },
        onSuccess: () => {
            toast.success('تم إنشاء الطلبية بنجاح');
            router.push('/orders/new');
            resetOrder()
        }
    });

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-64 bg-gray-200 rounded-lg mb-4" />
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    Failed to load product details
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Toaster />
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => router.back()}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Products
                    </button>
                    <div className="flex gap-3">
                        <div className="flex flex-col items-end">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => router.back()}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                >
                                    Selection ({orderData.product_ids.length})
                                </button>
                                <button
                                    onClick={() => router.push('/orders/new')}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    تعديل معلومات الحاوية {currentContainerIndex + 1}
                                </button>
                            </div>
                            {orderData.product_ids.length > 0 && (
                                <div className="text-sm text-gray-600 mt-1 text-left">
                                    <div>Total Weight: {calculateTotalWeight().toFixed(3)} tons</div>
                                    <div>Max Weight: {(orderData.total_weight / 1000).toFixed(3)} tons</div>
                                    <div>Container: {currentContainerIndex + 1} of {containers.length}</div>
                                </div>
                            )}
                        </div>
                        {orderData.product_ids.length > 0 && (
                            <button
                                onClick={() => createOrderMutation.mutate()}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                            >
                                Confirm Order
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="relative h-32 w-32">
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_Img}/${product.image}`}
                                    alt={product.name_translations?.en}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold mb-2">{product.name_translations?.en}</h1>
                                <p className="text-gray-600">{product.description_translations?.en}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Available Variants</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {variants?.map((variant) => {
                                    const isSelected = orderData.product_ids.some(v => v.id === variant.id);
                                    const selectedVariant = orderData.product_ids.find(v => v.id === variant.id);

                                    return (
                                        <div
                                            key={variant.id}
                                            className={`border rounded-lg p-4 transition-colors ${isSelected ? 'border-green-500' : 'hover:border-green-500'}`}
                                        >
                                            <div className="flex gap-4">
                                                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-50">
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_Img}/${variant.image}`}
                                                        alt={variant.size}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <span className="font-medium">{variant.size}</span>
                                                            <span className="text-sm text-gray-500 ml-2">({variant.packaging})</span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleVariantSelect(variant)}
                                                            className={`p-2 rounded-full transition-colors ${isSelected
                                                                ? 'bg-green-500 text-white hover:bg-green-600'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                                        >
                                                            <ShoppingCart className="w-5 h-5" />
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                                                        <div>
                                                            <span className="block text-gray-500">Box:</span>
                                                            {variant.box_dimensions}
                                                            <span className="block text-gray-500 mt-1">Volume:</span>
                                                            {calculateBoxVolume(variant.box_dimensions).toFixed(3)} m³
                                                            <span className="block text-gray-500 mt-1">Est. Weight:</span>
                                                            {calculateWeightInTons(variant.box_dimensions).toFixed(3)} tons
                                                        </div>
                                                        <div>
                                                            <span className="block text-gray-500">Weight:</span>
                                                            {variant.net_weight} kg
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {isSelected && (
                                                <div className="mt-4 space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-gray-600">Quantity:</span>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    const currentQuantity = orderData.product_ids.find(v => v.id === variant.id)?.quantity || 1;
                                                                    handleQuantityChange(variant.id, currentQuantity - 1);
                                                                }}
                                                                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                                                            >
                                                                <Minus className="w-4 h-4" />
                                                            </button>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={orderData.product_ids.find(v => v.id === variant.id)?.quantity || 1}
                                                                onChange={(e) => handleQuantityChange(variant.id, e.target.value)}
                                                                className="w-16 px-2 py-1 border rounded-lg text-center"
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    const currentQuantity = orderData.product_ids.find(v => v.id === variant.id)?.quantity || 1;
                                                                    handleQuantityChange(variant.id, currentQuantity + 1);
                                                                }}
                                                                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <textarea
                                                        placeholder="Add note for this variant..."
                                                        value={orderData.product_ids.find(v => v.id === variant.id)?.note || ''}
                                                        onChange={(e) => handleNoteChange(variant.id, e.target.value)}
                                                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500"
                                                        rows="2"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductVariantsPage; 