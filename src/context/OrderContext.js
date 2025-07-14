'use client'

import { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

const initialContainerState = {
    box_count: 0,
    total_weight: 0,
    total_volume: 0,
    total_price: 0,
    country_id: '',
    container_standard: {
        size: '40 hq',
        freezed: false,
        type: 'sea'
    },
    product_ids: []
};

export function OrderProvider({ children }) {
    const [containers, setContainers] = useState([initialContainerState]);
    const [currentContainerIndex, setCurrentContainerIndex] = useState(0);

    const getCurrentContainer = () => containers[currentContainerIndex];

    const updateCurrentContainer = (newData) => {
        setContainers(prev => {
            const newContainers = [...prev];
            const currentContainer = newContainers[currentContainerIndex];
            
            // Merge the new data with current container
            const updatedContainer = {
                ...currentContainer,
                ...newData
            };
            
            // Calculate box count based on number of unique products
            if (newData.product_ids) {
                updatedContainer.box_count = newData.product_ids.length;
                
                // Calculate total price by summing up prices of unique products
                updatedContainer.total_price = newData.product_ids.reduce((sum, item) => {
                    return sum + (item.price || 0);
                }, 0);
            }
            
            newContainers[currentContainerIndex] = updatedContainer;
            return newContainers;
        });
    };

    const addNewContainer = () => {
        // Copy all settings from current container
        const currentContainer = getCurrentContainer();
        const newContainer = {
            ...currentContainer,
            // Only reset the products array and keep all other settings
            product_ids: []
        };
        
        setContainers(prev => [...prev, newContainer]);
        setCurrentContainerIndex(prev => prev + 1);
    };

    // Add function to update specific container
    const updateContainerSettings = (index, newSettings) => {
        setContainers(prev => {
            const newContainers = [...prev];
            newContainers[index] = {
                ...newContainers[index],
                ...newSettings,
                // Preserve product_ids
                product_ids: newContainers[index].product_ids
            };
            return newContainers;
        });
    };

    const addVariant = (variantId, note = '', quantity = 1, price = 0) => {
        updateCurrentContainer({
            product_ids: [...getCurrentContainer().product_ids, { id: variantId, note, quantity, price }]
        });
    };

    const removeVariant = (variantId) => {
        updateCurrentContainer({
            product_ids: getCurrentContainer().product_ids.filter(item => item.id !== variantId)
        });
    };

    const updateVariantNote = (variantId, note) => {
        updateCurrentContainer({
            product_ids: getCurrentContainer().product_ids.map(item => 
                item.id === variantId ? { ...item, note } : item
            )
        });
    };

    const updateVariantQuantity = (variantId, quantity) => {
        const currentContainer = getCurrentContainer();
        updateCurrentContainer({
            product_ids: currentContainer.product_ids.map(item => 
                item.id === variantId ? { ...item, quantity } : item
            )
        });
    };

    const resetOrder = () => {
        setContainers([initialContainerState]);
        setCurrentContainerIndex(0);
    };

    return (
        <OrderContext.Provider value={{
            containers,
            currentContainerIndex,
            orderData: getCurrentContainer(),
            updateOrderData: updateCurrentContainer,
            addVariant,
            removeVariant,
            updateVariantNote,
            updateVariantQuantity,
            resetOrder,
            addNewContainer,
            updateContainerSettings
        }}>
            {children}
        </OrderContext.Provider>
    );
}

export function useOrder() {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
} 