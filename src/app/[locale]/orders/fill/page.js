'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Thermometer, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  X,
  Eye
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// Container capacity data
const CONTAINER_CAPACITIES = {
  '20 cpm': { volume: 33, weight: 18000, freezed: { volume: 28, weight: 15000 } },
  '40 cpm': { volume: 67, weight: 26000, freezed: { volume: 58, weight: 22000 } },
  '40 hq': { volume: 76, weight: 26000, freezed: { volume: 75, weight: 23000 } }
};

const FillOrderPage = () => {
  const router = useRouter();
  const [containers, setContainers] = useState([]);
  const [activeContainerIndex, setActiveContainerIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showVariants, setShowVariants] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Get order data from localStorage or URL params
  useEffect(() => {
    const savedOrderData = localStorage.getItem('orderData');
    if (savedOrderData) {
      const data = JSON.parse(savedOrderData);
      setOrderData(data);
      
      // Initialize with the first container from previous step
      const initialContainer = {
        id: Date.now(),
        size: data.containerSize,
        type: data.containerType,
        transportType: data.transportType,
        products: [],
        totalVolume: 0,
        totalWeight: 0,
        totalPrice: 0,
        boxCount: 0
      };
      setContainers([initialContainer]);
    } else {
      // Redirect back if no order data
      router.push('/orders/new');
    }
  }, [router]);

  // Fetch products based on country
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['country-products', orderData?.countryName, activeContainerIndex],
    queryFn: async () => {
      if (!orderData?.countryName) return null;
      const token = localStorage.getItem('token');
      const { data } = await axios.get(
        `https://setalkel.amjadshbib.com/api/countries-categories?name=${orderData.countryName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log('the token is '+token);
      
      return data?.data?.[0] || null;
    },
    enabled: !!orderData?.countryName,
    // Force refetch when active container changes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false
  });

  // Fetch product variants
  const { data: variantsData, isLoading: variantsLoading } = useQuery({
    queryKey: ['product-variants', selectedProduct?.id],
    queryFn: async () => {
      if (!selectedProduct?.id) return null;
      const token = localStorage.getItem('token');
      const { data } = await axios.get(
        `https://setalkel.amjadshbib.com/api/product-with-variants/${selectedProduct.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log('the token is '+token);
      return data?.data || [];
    },
    enabled: !!selectedProduct?.id
  });

  // Submit order mutation
  const submitOrderMutation = useMutation({
    mutationFn: async (orderPayload) => {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        'https://setalkel.amjadshbib.com/api/container',
        orderPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return data;
    },
    onSuccess: (data) => {
      if (data.status) {
        toast.success('Order has been completed successfully!');
        localStorage.removeItem('orderData');
        router.push('/');
      } else {
        toast.error('Failed to submit order');
      }
    },
    onError: (error) => {
      toast.error('Failed to submit order');
      console.error('Order submission error:', error);
    }
  });

  const activeContainer = containers[activeContainerIndex];
  const containerCapacity = activeContainer ? CONTAINER_CAPACITIES[activeContainer.size] : null;
  const maxVolume = containerCapacity && activeContainer.type === 'freezed' && containerCapacity.freezed 
    ? containerCapacity.freezed.volume 
    : containerCapacity?.volume || 0;
  const maxWeight = containerCapacity && activeContainer.type === 'freezed' && containerCapacity.freezed 
    ? containerCapacity.freezed.weight 
    : containerCapacity?.weight || 0;

  const volumePercentage = maxVolume > 0 ? (activeContainer?.totalVolume / maxVolume) * 100 : 0;
  const weightPercentage = maxWeight > 0 ? (activeContainer?.totalWeight / maxWeight) * 100 : 0;
  const fillPercentage = Math.max(volumePercentage, weightPercentage);
  
  // Calculate fill percentage for each container individually
  const getContainerFillPercentage = (container) => {
    if (!container) return 0;
    
    const capacity = CONTAINER_CAPACITIES[container.size];
    if (!capacity) return 0;
    
    const maxVol = container.type === 'freezed' && capacity.freezed 
      ? capacity.freezed.volume 
      : capacity.volume || 0;
    const maxWt = container.type === 'freezed' && capacity.freezed 
      ? capacity.freezed.weight 
      : capacity.weight || 0;
    
    const volPercent = maxVol > 0 ? (container.totalVolume / maxVol) * 100 : 0;
    const wtPercent = maxWt > 0 ? (container.totalWeight / maxWt) * 100 : 0;
    
    return Math.max(volPercent, wtPercent);
  };

  // Filter products based on container type
  const filteredProducts = productsData?.categories?.flatMap(category => 
    category.products.filter(product => 
      activeContainer?.type === 'freezed' 
        ? product.material_property === 'frozen'
        : product.material_property === 'dried'
    )
  ) || [];

  const categoriesWithFilteredProducts = productsData?.categories?.map(category => ({
    ...category,
    products: category.products.filter(product => 
      activeContainer?.type === 'freezed' 
        ? product.material_property === 'frozen'
        : product.material_property === 'dried'
    )
  })).filter(category => category.products.length > 0) || [];
  
  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const results = filteredProducts.filter(product => 
      product.name_translations?.en?.toLowerCase().includes(query) ||
      product.description_translations?.en?.toLowerCase().includes(query) ||
      product.product_code?.toLowerCase().includes(query)
    );
    
    setSearchResults(results);
  }, [searchQuery, filteredProducts]);
  
  // Reset category and product selection when switching containers
  useEffect(() => {
    setSelectedCategory(null);
    setSelectedProduct(null);
    setSearchQuery('');
    setSearchResults([]);
  }, [activeContainerIndex]);

  // State for container selection modal
  const [showContainerModal, setShowContainerModal] = useState(false);
  const [containerOptions, setContainerOptions] = useState([]);
  const [selectedContainerSize, setSelectedContainerSize] = useState('');
  const [selectedContainerType, setSelectedContainerType] = useState('');
  
  // This will be used to track available container options based on transport type

  // Fetch available container options from API
  useEffect(() => {
    if (orderData?.countryCode && orderData?.transportType) {
      // Fetch the country data to get available container options
      const fetchCountryData = async () => {
        try {
          const token = localStorage.getItem('token');
          const { data } = await axios.get('https://setalkel.amjadshbib.com/api/countries?type=export', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          // Find the selected country
          const selectedCountryData = data?.data?.find(country => country.code === orderData.countryCode);
          
          if (selectedCountryData) {
            // Get container options for the selected transport type
            const availableSizes = selectedCountryData[`${orderData.transportType}_allowed_sizes`] || [];
            
            // Group containers by size and track which types are available
            const options = availableSizes.reduce((acc, current) => {
              const existingSize = acc.find(item => item.size === current.size);
              if (!existingSize) {
                acc.push({
                  size: current.size,
                  regular: !current.freezed,
                  freezed: current.freezed
                });
              } else {
                if (current.freezed) {
                  existingSize.freezed = true;
                } else {
                  existingSize.regular = true;
                }
              }
              return acc;
            }, []);
            
            setContainerOptions(options);
          }
        } catch (error) {
          console.error('Error fetching country data:', error);
          toast.error('Failed to load container options');
        }
      };
      
      fetchCountryData();
    }
  }, [orderData]);

  // Handle container selection
  const handleContainerSelection = (size, type) => {
    setSelectedContainerSize(size);
    setSelectedContainerType(type);
  };

  // Add container with selected type
  const addContainer = () => {
    if (!orderData) return;
    
    // If we're showing the modal and have a selection, add that container
    if (showContainerModal && selectedContainerSize && selectedContainerType) {
      const newContainer = {
        id: Date.now(),
        size: selectedContainerSize,
        type: selectedContainerType,
        transportType: orderData.transportType,
        products: [],
        totalVolume: 0,
        totalWeight: 0,
        totalPrice: 0,
        boxCount: 0
      };
      
      setContainers([...containers, newContainer]);
      setActiveContainerIndex(containers.length);
      setShowContainerModal(false);
      setSelectedContainerSize('');
      setSelectedContainerType('');
    } else {
      // Show the container selection modal
      setShowContainerModal(true);
    }
  };

  const addProductToContainer = (variant, quantity) => {
    if (!activeContainer || quantity <= 0) return;

    // Parse box dimensions to get volume in cubic meters
    const boxVolume = parseFloat(variant.box_dimensions.replace(' m³', ''));
    
    // Calculate total volume with packing efficiency factor (90%)
    // This accounts for space between boxes and packing materials
    const totalVolume = boxVolume * quantity * 0.9;
    
    // Calculate total weight in kg
    // Use gross_weight (includes packaging) multiplied by number of pieces per box and quantity of boxes
    // Convert from grams to kilograms by dividing by 1000
    const boxPacking = parseInt(variant.box_packing.split(' ')[0], 10) || 1; // Extract number from "6 pcs/box"
    const totalWeight = (parseFloat(variant.gross_weight) * boxPacking * quantity) / 1000; // Convert from grams to kg
    
    // Calculate total price
    const totalPrice = variant.user_price.box_price * quantity;

    // Check if adding this would exceed container capacity
    const newTotalVolume = activeContainer.totalVolume + totalVolume;
    const newTotalWeight = activeContainer.totalWeight + totalWeight;
    
    // Get container capacity limits
    const containerCapacity = CONTAINER_CAPACITIES[activeContainer.size];
    const maxVol = activeContainer.type === 'freezed' && containerCapacity.freezed 
      ? containerCapacity.freezed.volume 
      : containerCapacity.volume;
    const maxWt = activeContainer.type === 'freezed' && containerCapacity.freezed 
      ? containerCapacity.freezed.weight 
      : containerCapacity.weight;

    if (newTotalVolume > maxVol || newTotalWeight > maxWt) {
      toast.error('Adding this quantity would exceed container capacity!');
      return;
    }

    const productToAdd = {
      id: selectedProduct.id,
      variantId: variant.id,
      name: selectedProduct.name_translations.en,
      variant: variant,
      quantity: quantity,
      totalVolume: totalVolume,
      totalWeight: totalWeight,
      totalPrice: totalPrice,
      note: ''
    };

    const updatedContainers = [...containers];
    const existingProductIndex = updatedContainers[activeContainerIndex].products.findIndex(
      p => p.id === selectedProduct.id && p.variantId === variant.id
    );

    if (existingProductIndex >= 0) {
      // Update existing product
      const existingProduct = updatedContainers[activeContainerIndex].products[existingProductIndex];
      existingProduct.quantity += quantity;
      existingProduct.totalVolume += totalVolume;
      existingProduct.totalWeight += totalWeight;
      existingProduct.totalPrice += totalPrice;
    } else {
      // Add new product
      updatedContainers[activeContainerIndex].products.push(productToAdd);
    }

    // Update container totals
    updatedContainers[activeContainerIndex].totalVolume += totalVolume;
    updatedContainers[activeContainerIndex].totalWeight += totalWeight;
    updatedContainers[activeContainerIndex].totalPrice += totalPrice;
    updatedContainers[activeContainerIndex].boxCount += quantity;

    setContainers(updatedContainers);
    setShowVariants(false);
    setSelectedProduct(null);
    toast.success('Product added to container!');
  };

  const removeProductFromContainer = (productIndex) => {
    const updatedContainers = [...containers];
    const product = updatedContainers[activeContainerIndex].products[productIndex];
    
    // Update container totals
    updatedContainers[activeContainerIndex].totalVolume -= product.totalVolume;
    updatedContainers[activeContainerIndex].totalWeight -= product.totalWeight;
    updatedContainers[activeContainerIndex].totalPrice -= product.totalPrice;
    updatedContainers[activeContainerIndex].boxCount -= product.quantity;
    
    // Remove product
    updatedContainers[activeContainerIndex].products.splice(productIndex, 1);
    
    setContainers(updatedContainers);
    toast.success('Product removed from container!');
  };
  
  // Delete container function
  const deleteContainer = (containerIndex) => {
    // Don't allow deleting if it's the only container
    if (containers.length <= 1) {
      toast.error('You must have at least one container');
      return;
    }
    
    const updatedContainers = [...containers];
    updatedContainers.splice(containerIndex, 1);
    
    // Update active container index if needed
    if (containerIndex <= activeContainerIndex) {
      setActiveContainerIndex(Math.max(0, activeContainerIndex - 1));
    }
    
    setContainers(updatedContainers);
    toast.success('Container deleted!');
  };

  const submitOrder = () => {
    if (containers.length === 0 || containers.every(c => c.products.length === 0)) {
      toast.error('Please add at least one product to a container');
      return;
    }

    const orderPayload = {
      containers: containers.map(container => ({
        box_count: container.boxCount,
        total_weight: container.totalWeight,
        total_volume: container.totalVolume,
        total_price: container.totalPrice,
        country_id: orderData.countryId,
        container_standard: {
          size: container.size,
          freezed: container.type === 'freezed',
          type: container.transportType
        },
        product_ids: container.products.map(product => ({
          id: product.id,
          note: product.note || ''
        }))
      }))
    };

    submitOrderMutation.mutate(orderPayload);
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Container Selection Modal */}
      <AnimatePresence>
        {showContainerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Select Container Type & Size</h2>
                <button
                  onClick={() => setShowContainerModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {containerOptions.map((sizeOption) => {
                  const capacity = CONTAINER_CAPACITIES[sizeOption.size];
                  
                  return (
                    <div key={sizeOption.size} className="space-y-3">
                      {/* Regular Container - Only show if available */}
                      {sizeOption.regular && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleContainerSelection(sizeOption.size, 'regular')}
                          className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                            selectedContainerSize === sizeOption.size && selectedContainerType === 'regular'
                              ? 'border-green-500 bg-green-50 shadow-lg'
                              : 'border-gray-200 hover:border-green-300 hover:bg-green-25'
                          }`}
                        >
                          <div className="flex items-center mb-2">
                            <Package className={`w-5 h-5 mr-2 ${
                              selectedContainerSize === sizeOption.size && selectedContainerType === 'regular' ? 'text-green-600' : 'text-gray-600'
                            }`} />
                            <span className={`font-bold text-sm ${
                              selectedContainerSize === sizeOption.size && selectedContainerType === 'regular' ? 'text-green-700' : 'text-gray-700'
                            }`}>
                              {sizeOption.size.toUpperCase()} - Regular
                            </span>
                          </div>
                          
                          {capacity && (
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Volume:</span>
                                <span className="font-semibold">{capacity.volume}m³</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Weight:</span>
                                <span className="font-semibold">{capacity.weight.toLocaleString()}kg</span>
                              </div>
                            </div>
                          )}
                        </motion.button>
                      )}

                      {/* Freezed Container - Only show if available */}
                      {sizeOption.freezed && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleContainerSelection(sizeOption.size, 'freezed')}
                          className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                            selectedContainerSize === sizeOption.size && selectedContainerType === 'freezed'
                              ? 'border-blue-500 bg-blue-50 shadow-lg'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                          }`}
                        >
                          <div className="flex items-center mb-2">
                            <Thermometer className={`w-5 h-5 mr-2 ${
                              selectedContainerSize === sizeOption.size && selectedContainerType === 'freezed'
                                ? 'text-blue-600' 
                                : 'text-gray-600'
                            }`} />
                            <span className={`font-bold text-sm ${
                              selectedContainerSize === sizeOption.size && selectedContainerType === 'freezed'
                                ? 'text-blue-700' 
                                : 'text-gray-700'
                            }`}>
                              {sizeOption.size.toUpperCase()} - Freezed
                            </span>
                          </div>
                          
                          {capacity && capacity.freezed ? (
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Volume:</span>
                                <span className="font-semibold">{capacity.freezed.volume}m³</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Weight:</span>
                                <span className="font-semibold">{capacity.freezed.weight.toLocaleString()}kg</span>
                              </div>
                            </div>
                          ) : capacity ? (
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Volume:</span>
                                <span className="font-semibold">{capacity.volume}m³</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Weight:</span>
                                <span className="font-semibold">{capacity.weight.toLocaleString()}kg</span>
                              </div>
                            </div>
                          ) : null}
                        </motion.button>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowContainerModal(false)}
                  className="px-6 py-2 mr-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (selectedContainerSize && selectedContainerType) {
                      addContainer();
                    } else {
                      toast.error('Please select a container type and size');
                    }
                  }}
                  disabled={!selectedContainerSize || !selectedContainerType}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Container
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Fill Your Containers</h1>
              <p className="text-gray-600">Add products to your {orderData.countryName} containers</p>
            </div>
          </div>
          
          <button
            onClick={submitOrder}
            disabled={submitOrderMutation.isLoading || containers.every(c => c.products.length === 0)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitOrderMutation.isLoading ? 'Submitting...' : 'Submit Order'}
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Container Management */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Your Containers</h2>
                <button
                  onClick={addContainer}
                  className="bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600 transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {containers.map((container, index) => (
                  <motion.div
                    key={container.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      activeContainerIndex === index
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div 
                        className="flex items-center flex-1 cursor-pointer" 
                        onClick={() => setActiveContainerIndex(index)}
                      >
                        {container.type === 'freezed' ? (
                          <Thermometer className="w-5 h-5 mr-2 text-blue-600" />
                        ) : (
                          <Package className="w-5 h-5 mr-2 text-green-600" />
                        )}
                        <span className="font-semibold">
                          {container.size.toUpperCase()} - {container.type === 'freezed' ? 'Freezed' : 'Regular'}
                        </span>
                      </div>
                      
                      {/* Delete container button */}
                      {containers.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteContainer(index);
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete container"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    {/* Capacity Bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Capacity</span>
                        <span>{Math.round(getContainerFillPercentage(container))}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            getContainerFillPercentage(container) > 90 ? 'bg-red-500' : 
                            getContainerFillPercentage(container) > 70 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(getContainerFillPercentage(container), 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600">
                      <div>Products: {container.products.length}</div>
                      <div>Total: ${container.totalPrice.toFixed(2)}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Product Selection */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-xl p-6"
            >
              {!selectedCategory ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Select Category</h2>
                    <div className="relative w-64">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {searchQuery ? (
                    <div>
                      <h3 className="text-lg font-medium text-gray-700 mb-4">Search Results</h3>
                      {searchResults.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {searchResults.map((product) => (
                            <motion.div
                              key={product.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedProduct(product)}
                              className="p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                            >
                              <img
                                src={`https://setalkel.amjadshbib.com/public/${product.image}`}
                                alt={product.name_translations.en}
                                className="w-full h-32 object-cover rounded-lg mb-3"
                              />
                              <h3 className="font-semibold text-gray-800">{product.name_translations.en}</h3>
                              <p className="text-sm text-gray-600">{product.description_translations.en}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className={`px-2 py-1 rounded text-xs ${product.material_property === 'frozen' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                  {product.material_property}
                                </span>
                                <Eye className="w-4 h-4 text-gray-400" />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No products found matching your search</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categoriesWithFilteredProducts.map((category) => (
                        <motion.div
                          key={category.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedCategory(category)}
                          className="p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                        >
                          <img
                            src={`https://setalkel.amjadshbib.com/public${category.image}`}
                            alt={category.name_translations.en}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <h3 className="font-semibold text-gray-800">{category.name_translations.en}</h3>
                          <p className="text-sm text-gray-600">{category.products.length} products</p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              ) : !selectedProduct ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">{selectedCategory.name_translations.en}</h2>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search in category..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchQuery ? (
                      // Filter products within the selected category
                      selectedCategory.products
                        .filter(product => 
                          product.name_translations?.en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description_translations?.en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.product_code?.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((product) => (
                          <motion.div
                            key={product.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedProduct(product)}
                            className="p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                          >
                            <img
                              src={`https://setalkel.amjadshbib.com/public/${product.image}`}
                              alt={product.name_translations.en}
                              className="w-full h-32 object-cover rounded-lg mb-3"
                            />
                            <h3 className="font-semibold text-gray-800">{product.name_translations.en}</h3>
                            <p className="text-sm text-gray-600">{product.description_translations.en}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className={`px-2 py-1 rounded text-xs ${product.material_property === 'frozen' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                {product.material_property}
                              </span>
                              <Eye className="w-4 h-4 text-gray-400" />
                            </div>
                          </motion.div>
                        ))
                    ) : (
                      // Show all products in the category
                      selectedCategory.products.map((product) => (
                        <motion.div
                          key={product.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedProduct(product)}
                          className="p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                        >
                          <img
                            src={`https://setalkel.amjadshbib.com/public/${product.image}`}
                            alt={product.name_translations.en}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <h3 className="font-semibold text-gray-800">{product.name_translations.en}</h3>
                          <p className="text-sm text-gray-600">{product.description_translations.en}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`px-2 py-1 rounded text-xs ${product.material_property === 'frozen' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                              {product.material_property}
                            </span>
                            <Eye className="w-4 h-4 text-gray-400" />
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">{selectedProduct.name_translations.en}</h2>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {variantsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {variantsData?.map((variant) => (
                        <VariantCard
                          key={variant.id}
                          variant={variant}
                          onAdd={(quantity) => addProductToContainer(variant, quantity)}
                          maxVolume={maxVolume}
                          currentVolume={activeContainer?.totalVolume || 0}
                          maxWeight={maxWeight}
                          currentWeight={activeContainer?.totalWeight || 0}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Container Contents */}
        {activeContainer && activeContainer.products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-3xl shadow-xl p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6">Container Contents</h2>
            <div className="space-y-4">
              {activeContainer.products.map((product, index) => (
                <div key={`${product.id}-${product.variantId}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-600">
                      {product.variant.size} - {product.quantity} boxes
                    </p>
                    <p className="text-sm text-gray-600">
                      Volume: {product.totalVolume.toFixed(2)}m³ | Weight: {product.totalWeight.toFixed(2)}kg
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold text-green-600">
                      ${product.totalPrice.toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeProductFromContainer(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Variant Card Component
const VariantCard = ({ variant, onAdd, maxVolume, currentVolume, maxWeight, currentWeight }) => {
  const [quantity, setQuantity] = useState(1);
  
  // Parse box dimensions to get volume in cubic meters
  const boxVolume = parseFloat(variant.box_dimensions.replace(' m³', ''));
  
  // Get box packing information (number of pieces per box)
  const boxPacking = parseInt(variant.box_packing.split(' ')[0], 10) || 1;
  
  // Calculate weight per box (in kg)
  // Convert from grams to kilograms by dividing by 1000
  const weightPerBox = (parseFloat(variant.gross_weight) * boxPacking) / 1000;
  
  // Calculate remaining capacity
  const remainingVolume = maxVolume - currentVolume;
  const remainingWeight = maxWeight - currentWeight;
  
  // Calculate max possible boxes based on both volume and weight constraints
  const maxBoxesByVolume = Math.floor(remainingVolume / (boxVolume * 0.9));
  const maxBoxesByWeight = Math.floor(remainingWeight / weightPerBox);
  const maxPossibleBoxes = Math.min(maxBoxesByVolume, maxBoxesByWeight);
  
  // Calculate total price
  const totalPrice = variant.user_price.box_price * quantity;
  
  return (
    <div className="p-4 border-2 border-gray-200 rounded-xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-800">{variant.size}</h3>
          <p className="text-sm text-gray-600">{variant.packaging} - {variant.box_packing}</p>
          <p className="text-sm text-gray-600">Box Volume: {variant.box_dimensions}</p>
          <p className="text-sm text-gray-600">Weight: {variant.gross_weight}g/piece × {boxPacking} pieces = {weightPerBox.toFixed(2)}kg/box</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-green-600">${variant.user_price.box_price}/box</p>
          <p className="text-sm text-gray-600">Max: {maxPossibleBoxes} boxes</p>
          <p className="text-xs text-gray-500">
            {maxBoxesByVolume < maxBoxesByWeight ? 'Limited by volume' : 'Limited by weight'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            <Minus className="w-4 h-4" />
          </button>
          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value)) {
                setQuantity(Math.min(Math.max(1, value), maxPossibleBoxes));
              }
            }}
            min="1"
            max={maxPossibleBoxes}
            className="font-semibold w-16 text-center border border-gray-300 rounded py-1 px-2"
          />
          <button
            onClick={() => setQuantity(Math.min(maxPossibleBoxes, quantity + 1))}
            disabled={quantity >= maxPossibleBoxes}
            className="p-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-gray-800">
            Total: ${totalPrice.toFixed(2)}
          </span>
          <button
            onClick={() => onAdd(quantity)}
            disabled={quantity > maxPossibleBoxes || quantity <= 0}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Container
          </button>
        </div>
      </div>
    </div>
  );
};

export default FillOrderPage;