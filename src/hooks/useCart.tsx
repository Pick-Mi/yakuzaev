import { useState, useContext, createContext, ReactNode } from 'react';

interface CartItem {
  id: number | string;
  name: string;
  price: string | number;
  image: string;
  quantity: number;
  selectedVariant?: any;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: number | string) => void;
  updateQuantity: (id: number | string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  total: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems(current => {
      const existingItem = current.find(i => i.id === item.id);
      if (existingItem) {
        return current.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        );
      }
      return [...current, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const removeFromCart = (id: number | string) => {
    setItems(current => current.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number | string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems(current => 
      current.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const total = items.reduce((sum, item) => {
    // Handle both string prices (like "$23") and number prices (like 23)
    let price: number;
    if (typeof item.price === 'string') {
      price = parseFloat(item.price.replace('$', '').replace(',', ''));
    } else {
      price = typeof item.price === 'number' ? item.price : 0;
    }
    return sum + (price * item.quantity);
  }, 0).toFixed(2);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      itemCount,
      total: `$${total}`
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};