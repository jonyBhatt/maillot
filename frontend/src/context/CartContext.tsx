import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'react-hot-toast';

// Define the structure of a cart item
// We extend the basic product info with size, color, and quantity
export interface CartItem {
    id: string; // Product ID (MongoDB _id)
    name: string;
    price: number;
    image: string;
    size: string;
    color: string;
    quantity: number;
}

// Define the Context Props
interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string, size: string, color: string) => void;
    updateQuantity: (id: string, size: string, color: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Load cart from local storage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
            try {
                setCartItems(JSON.parse(storedCart));
            } catch (error) {
                console.error("Failed to parse cart items from local storage", error);
                localStorage.removeItem('cartItems');
            }
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (newItem: CartItem) => {
        setCartItems(currentItems => {
            // Check if item with same ID, size, and color already exists
            const existingItemIndex = currentItems.findIndex(
                item => item.id === newItem.id && item.size === newItem.size && item.color === newItem.color
            );

            if (existingItemIndex > -1) {
                // Return new array with updated quantity
                const updatedItems = [...currentItems];
                updatedItems[existingItemIndex].quantity += newItem.quantity;
                toast.success(`Updated quantity for ${newItem.name}`);
                return updatedItems;
            } else {
                // Add new item
                toast.success(`Added ${newItem.name} to cart`);
                return [...currentItems, newItem];
            }
        });
    };

    const removeFromCart = (id: string, size: string, color: string) => {
        setCartItems(currentItems =>
            currentItems.filter(item => !(item.id === id && item.size === size && item.color === color))
        );
        toast.success("Item removed from cart");
    };

    const updateQuantity = (id: string, size: string, color: string, quantity: number) => {
        if (quantity < 1) return;
        setCartItems(currentItems =>
            currentItems.map(item =>
                (item.id === id && item.size === size && item.color === color) ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    // Derived state
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use the cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
