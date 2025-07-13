'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from '@/i18n/routing';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrder } from '@/context/OrderContext';
import { toast } from 'react-hot-toast';
import { Package, Plus, Minus, ShoppingBag, X, ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react';

const ProductsPage = () => {
  const router = useRouter();
  const {
    containers,
    currentContainerIndex,
    setCurrentContainerIndex,
    orderData,
    addVariant,
    removeVariant,
    updateVariantQuantity,
    updateVariantNote,
    addNewContainer,
    updateContainerSettings,
    resetOrder
  } = useOrder();

  // Local state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variantQuantity, setVariantQuantity] = useState(1);
  const [variantNote, setVariantNote] = useState('');
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [containerFillPercentage, setContainerFillPercentage] = useState(0);
  const [isContainerFull, setIsContainerFull] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const containerRef = useRef(null);
  const productListRef = useRef(null);

  // Get current container data
  const currentContainer = containers[currentContainerIndex];
  const containerType = currentContainer.container_standard.freezed ? 'freezed' : 'regular';
  const containerSize = currentContainer.container_standard.size;
  const containerTransportType = currentContainer.container_standard.type;
  const countryId = currentContainer.country_id;

  // Container capacity constants based on size
  const CONTAINER_CAPACITIES = {
    '20 ft': { volume: 33.2, weight: 28200, type: 'regular' },
    '40 ft': { volume: 67.7, weight: 28800, type: 'regular' },
    '40 hq': { volume: 76.4, weight: 29000, type: 'regular' },
    '20 ft freezed': { volume: 25.2, weight: 21200, type: 'freezed' },
    '40 ft freezed': { volume: 55.7, weight: 25800, type: 'freezed' },
    '40 hq freezed': { volume: 67.4, weight: 26000, type: 'freezed' },
  };

  // Get container capacity
  const getContainerCapacity = () => {
    const key = containerType === 'freezed' ? `${containerSize} freezed` : containerSize;
    return CONTAINER_CAPACITIES[key] || { volume: 0, weight: 0 };
  };

  const containerCapacity = getContainerCapacity();

  // Fetch products by country
  const { data: countryData, isLoading: isLoadingCountry } = useQuery({
    queryKey: ['country-products', countryId],
    queryFn: async () => {
      const { data } = await axios.get(`https://setalkel.amjadshbib.com/api/countries/${countryId}/products`);
      return data?.data || [];
    },
    enabled: !!countryId,
  });

  // Fetch product variants when a product is selected
  const { data: variantsData, isLoading: isLoadingVariants } = useQuery({
    queryKey: ['product-variants', selectedProduct?.id],
    queryFn: async () => {
      const { data } = await axios.get(`https://setalkel.amjadshbib.com/api/products/${selectedProduct.id}/variants`);
      return data?.data || [];
    },
    enabled: !!selectedProduct,
  });

  // Filter products by material property (dried/freezed)
  const filteredCategories = countryData?.length > 0 
    ? countryData[0]?.categories.map(category => ({
        ...category,
        products: category.products.filter(product => 
          containerType === 'freezed' 
            ? product.material_property === 'freezed' 
            : product.material_property === 'dried'
        )
      })).filter(category => category.products.length > 0)
    : [];

  // Calculate container fill percentage
  useEffect(() => {
    if (!currentContainer || !containerCapacity.volume) return;
    
    const totalVolume = currentContainer.total_volume;
    const maxVolume = containerCapacity.volume;
    const fillPercentage = Math.min((totalVolume / maxVolume) * 100, 100);
    
    setContainerFillPercentage(fillPercentage);
    setIsContainerFull(fillPercentage >= 90); // Consider container full at 90%
  }, [currentContainer, containerCapacity]);

  // Handle adding a variant to the container
  const handleAddVariant = () => {
    if (!selectedVariant) return;
    
    setIsAddingVariant(true);
    
    try {
      // Extract volume from box_dimensions (format: "0.01365 m³")
      const boxDimensions = selectedVariant.box_dimensions;
      const volumeMatch = boxDimensions.match(/([\d.]+)\s*m³/);
      const boxVolume = volumeMatch ? parseFloat(volumeMatch[1]) : 0;
      
      // Calculate total volume to be added
      const addedVolume = boxVolume * variantQuantity;
      
      // Check if adding this variant would exceed container capacity
      const newTotalVolume = currentContainer.total_volume + addedVolume;
      if (newTotalVolume > containerCapacity.volume * 0.9) {
        toast.error('Adding this quantity would exceed container capacity');
        setIsAddingVariant(false);
        return;
      }
      
      // Calculate weight and price
      const boxWeight = parseFloat(selectedVariant.gross_weight) * variantQuantity;
      const boxPrice = selectedVariant.user_price?.box_price * variantQuantity || 0;
      
      // Add variant to container
      addVariant(selectedVariant.id, variantNote, variantQuantity, boxPrice);
      
      // Update container totals
      updateContainerSettings(currentContainerIndex, {
        total_volume: newTotalVolume,
        total_weight: currentContainer.total_weight + boxWeight,
        total_price: currentContainer.total_price + boxPrice,
        box_count: currentContainer.box_count + variantQuantity
      });
      
      toast.success('Product added to container');
      
      // Reset selection
      setSelectedVariant(null);
      setVariantQuantity(1);
      setVariantNote('');
    } catch (error) {
      console.error('Error adding variant:', error);
      toast.error('Failed to add product');
    } finally {
      setIsAddingVariant(false);
    }
  };

  // Handle removing a variant from the container
  const handleRemoveVariant = (variantId) => {
    // Find the variant in the container
    const variantToRemove = currentContainer.product_ids.find(item => item.id === variantId);
    if (!variantToRemove) return;
    
    // Get variant details to calculate volume and weight reduction
    const variantDetails = variantsData?.find(v => v.id === variantId);
    if (!variantDetails) return;
    
    // Extract volume from box_dimensions
    const boxDimensions = variantDetails.box_dimensions;
    const volumeMatch = boxDimensions.match(/([\d.]+)\s*m³/);
    const boxVolume = volumeMatch ? parseFloat(volumeMatch[1]) : 0;
    
    // Calculate reductions
    const volumeReduction = boxVolume * variantToRemove.quantity;
    const weightReduction = parseFloat(variantDetails.gross_weight) * variantToRemove.quantity;
    const priceReduction = variantDetails.user_price?.box_price * variantToRemove.quantity || 0;
    
    // Update container totals
    updateContainerSettings(currentContainerIndex, {
      total_volume: Math.max(0, currentContainer.total_volume - volumeReduction),
      total_weight: Math.max(0, currentContainer.total_weight - weightReduction),
      total_price: Math.max(0, currentContainer.total_price - priceReduction),
      box_count: Math.max(0, currentContainer.box_count - variantToRemove.quantity)
    });
    
    // Remove variant
    removeVariant(variantId);
    toast.success('Product removed from container');
  };

  // Handle adding a new container
  const handleAddContainer = () => {
    addNewContainer();
    toast.success('New container added');
  };

  // Handle switching between containers
  const handleSwitchContainer = (index) => {
    if (index >= 0 && index < containers.length) {
      setCurrentContainerIndex(index);
    }
  };

  // Handle order submission
  const handleSubmitOrder = async () => {
    if (containers.length === 0 || containers.every(c => c.product_ids.length === 0)) {
      toast.error('Please add products to at least one container');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format containers data for API
      const containersData = containers.map(container => ({
        box_count: container.box_count,
        total_weight: container.total_weight,
        total_volume: container.total_volume,
        total_price: container.total_price,
        country_id: container.country_id,
        container_standard: container.container_standard,
        product_ids: container.product_ids.map(item => ({
          id: item.id,
          note: item.note || ''
        }))
      }));
      
      // Submit order
      const response = await axios.post('https://setalkel.amjadshbib.com/api/orders', {
        containers: containersData
      });
      
      if (response.data.status) {
        toast.success('Order has been completed successfully');
        resetOrder();
        router.push('/');
      } else {
        toast.error(response.data.message || 'Failed to submit order');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to submit order');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const slideVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { x: '-100%', transition: { duration: 0.2 } }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Fill Your Container</h1>
      
      {/* Container Selection Tabs */}
      <div className="flex overflow-x-auto mb-6 pb-2 hide-scrollbar">
        {containers.map((container, index) => (
          <button
            key={index}
            onClick={() => handleSwitchContainer(index)}
            className={`flex items-center px-4 py-2 mr-2 rounded-lg whitespace-nowrap ${index === currentContainerIndex ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <Package className="w-4 h-4 mr-2" />
            <span>
              {container.container_standard.size} 
              {container.container_standard.freezed ? ' (Freezed)' : ''}
              {container.product_ids.length > 0 ? ` - ${container.product_ids.length} products` : ''}
            </span>
          </button>
        ))}
        
        <button 
          onClick={handleAddContainer}
          className="flex items-center px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 whitespace-nowrap"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Container
        </button>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Container Visualization */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Container Details</h2>
            
            <div className="space-y-4">
              <div>
                <span className="text-gray-500">Size:</span>
                <p className="font-medium">{containerSize}</p>
              </div>
              
              <div>
                <span className="text-gray-500">Type:</span>
                <p className="font-medium">{containerType === 'freezed' ? 'Freezed' : 'Regular'}</p>
              </div>
              
              <div>
                <span className="text-gray-500">Transport:</span>
                <p className="font-medium capitalize">{containerTransportType}</p>
              </div>
              
              <div>
                <span className="text-gray-500">Maximum Volume:</span>
                <p className="font-medium">{containerCapacity.volume} m³</p>
              </div>
              
              <div>
                <span className="text-gray-500">Maximum Weight:</span>
                <p className="font-medium">{containerCapacity.weight} kg</p>
              </div>
              
              <div>
                <span className="text-gray-500">Current Fill:</span>
                <div className="w-full h-6 bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${containerFillPercentage > 80 ? 'bg-red-500' : containerFillPercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${containerFillPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-right mt-1">{containerFillPercentage.toFixed(1)}%</p>
              </div>
              
              <div>
                <span className="text-gray-500">Total Products:</span>
                <p className="font-medium">{currentContainer.box_count} boxes</p>
              </div>
              
              <div>
                <span className="text-gray-500">Total Price:</span>
                <p className="font-medium">${currentContainer.total_price.toFixed(2)}</p>
              </div>
            </div>
            
            {isContainerFull && (
              <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm">This container is nearly full. Consider adding a new container if you need to add more products.</p>
              </div>
            )}
          </div>
          
          {/* Added Products List */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Added Products</h2>
            
            {currentContainer.product_ids.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No products added yet</p>
                <p className="text-sm mt-2">Select products from the right panel to add them to this container</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {currentContainer.product_ids.map((item) => {
                  const variant = variantsData?.find(v => v.id === item.id);
                  if (!variant) return null;
                  
                  return (
                    <div key={item.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                      <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-white">
                        {variant.image ? (
                          <Image
                            src={`https://setalkel.amjadshbib.com/public/${variant.image}`}
                            alt={variant.size}
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <Package className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-3 flex-grow">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{variant.product?.name_translations?.en}</h3>
                          <button 
                            onClick={() => handleRemoveVariant(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <p className="text-sm text-gray-500">{variant.size} - {variant.packaging}</p>
                        
                        <div className="flex justify-between mt-2 text-sm">
                          <span>{item.quantity} boxes</span>
                          <span className="font-medium">${(variant.user_price?.box_price * item.quantity).toFixed(2)}</span>
                        </div>
                        
                        {item.note && (
                          <p className="text-xs italic mt-1 text-gray-500">Note: {item.note}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting || currentContainer.product_ids.length === 0}
                className={`w-full py-3 rounded-lg font-medium ${isSubmitting || currentContainer.product_ids.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Order'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Column - Product Selection */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {!selectedProduct ? (
              <motion.div 
                key="categories"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-2xl shadow-md p-6"
              >
                <h2 className="text-xl font-semibold mb-6">Select a Category</h2>
                
                {isLoadingCountry ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="animate-pulse bg-gray-100 h-32 rounded-lg"></div>
                    ))}
                  </div>
                ) : filteredCategories.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No categories available for this container type</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCategories.map((category) => (
                      <motion.div
                        key={category.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedCategory(category)}
                        className="cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition-colors duration-200"
                      >
                        <div className="flex items-center">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white">
                            <Image
                              src={`https://setalkel.amjadshbib.com/public/${category.image}`}
                              alt={category.name_translations?.en}
                              fill
                              className="object-contain"
                            />
                          </div>
                          
                          <div className="ml-4">
                            <h3 className="font-medium">{category.name_translations?.en}</h3>
                            <p className="text-sm text-gray-500">{category.products.length} products</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : !selectedVariant ? (
              <motion.div 
                key="products"
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-2xl shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <button 
                    onClick={() => {
                      setSelectedProduct(null);
                      setSelectedCategory(null);
                    }}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Back to Categories
                  </button>
                  
                  <h2 className="text-xl font-semibold">{selectedCategory?.name_translations?.en}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" ref={productListRef}>
                  {selectedCategory?.products.map((product) => (
                    <motion.div
                      key={product.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedProduct(product)}
                      className="cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white">
                          <Image
                            src={product.image ? `https://setalkel.amjadshbib.com/public/${product.image}` : '/placeholder-product.jpg'}
                            alt={product.name_translations?.en}
                            fill
                            className="object-contain"
                          />
                        </div>
                        
                        <div className="ml-4 flex-grow">
                          <h3 className="font-medium">{product.name_translations?.en}</h3>
                          <p className="text-sm text-gray-500 line-clamp-1">{product.description_translations?.en}</p>
                          
                          <div className="flex items-center mt-1">
                            <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full">
                              {product.material_property}
                            </span>
                            
                            {!product.in_stock && (
                              <span className="ml-2 text-xs px-2 py-0.5 bg-red-50 text-red-700 rounded-full">
                                Out of Stock
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="variants"
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-2xl shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <button 
                    onClick={() => setSelectedVariant(null)}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Back to Products
                  </button>
                  
                  <h2 className="text-xl font-semibold">{selectedProduct?.name_translations?.en}</h2>
                </div>
                
                {isLoadingVariants ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse bg-gray-100 h-24 rounded-lg"></div>
                    ))}
                  </div>
                ) : variantsData?.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No variants available for this product</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      {variantsData?.map((variant) => (
                        <motion.div
                          key={variant.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setSelectedVariant(variant)}
                          className={`cursor-pointer rounded-xl p-4 transition-colors duration-200 border-2 ${selectedVariant?.id === variant.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-gray-50 hover:bg-gray-100'}`}
                        >
                          <div className="flex items-start">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
                              {variant.image ? (
                                <Image
                                  src={`https://setalkel.amjadshbib.com/public/${variant.image}`}
                                  alt={variant.size}
                                  fill
                                  className="object-contain"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                  <Package className="w-8 h-8 text-gray-300" />
                                </div>
                              )}
                            </div>
                            
                            <div className="ml-4 flex-grow">
                              <div className="flex justify-between">
                                <h3 className="font-medium">{variant.size}</h3>
                                {selectedVariant?.id === variant.id && (
                                  <Check className="w-5 h-5 text-blue-500" />
                                )}
                              </div>
                              
                              <p className="text-sm text-gray-500">{variant.packaging}</p>
                              
                              <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                                <div>
                                  <span className="text-gray-500">Box:</span>
                                  <p className="font-medium">{variant.box_dimensions}</p>
                                </div>
                                
                                <div>
                                  <span className="text-gray-500">Packing:</span>
                                  <p className="font-medium">{variant.box_packing}</p>
                                </div>
                                
                                <div>
                                  <span className="text-gray-500">Weight:</span>
                                  <p className="font-medium">{variant.gross_weight} kg</p>
                                </div>
                                
                                <div>
                                  <span className="text-gray-500">Price:</span>
                                  <p className="font-medium">${variant.user_price?.box_price || 0}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {selectedVariant && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                        <h3 className="font-medium mb-3">Add to Container</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Boxes)</label>
                            <div className="flex items-center">
                              <button 
                                onClick={() => setVariantQuantity(prev => Math.max(1, prev - 1))}
                                className="p-2 bg-gray-200 rounded-l-lg hover:bg-gray-300"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              
                              <input
                                type="number"
                                min="1"
                                value={variantQuantity}
                                onChange={(e) => setVariantQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="p-2 w-16 text-center border-y border-gray-200 focus:outline-none"
                              />
                              
                              <button 
                                onClick={() => setVariantQuantity(prev => prev + 1)}
                                className="p-2 bg-gray-200 rounded-r-lg hover:bg-gray-300"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
                            <textarea
                              value={variantNote}
                              onChange={(e) => setVariantNote(e.target.value)}
                              placeholder="Add special instructions..."
                              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                              rows="2"
                            />
                          </div>
                          
                          <button
                            onClick={handleAddVariant}
                            disabled={isAddingVariant || isContainerFull}
                            className={`w-full py-2 rounded-lg font-medium ${isAddingVariant || isContainerFull ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                          >
                            {isAddingVariant ? 'Adding...' : isContainerFull ? 'Container Full' : 'Add to Container'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
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

export default ProductsPage;