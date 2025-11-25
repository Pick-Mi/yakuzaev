import { useState, useContext, createContext, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

// Generate session ID for guest users
const getSessionId = () => {
  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
};

// Log cart activity to database
const logCartActivity = async (
  actionType: 'add' | 'remove' | 'update_quantity' | 'clear',
  item: Partial<CartItem>,
  allItems: CartItem[]
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const sessionId = getSessionId();

    // Calculate total cart value
    const totalCartValue = allItems.reduce((sum, cartItem) => {
      const price = typeof cartItem.price === 'string' 
        ? parseFloat(cartItem.price.replace('$', '').replace(',', ''))
        : cartItem.price;
      return sum + (price * cartItem.quantity);
    }, 0);

    const totalCartItems = allItems.reduce((total, cartItem) => total + cartItem.quantity, 0);

    // Get price as number
    let productPrice = 0;
    if (item.price) {
      productPrice = typeof item.price === 'string'
        ? parseFloat(item.price.replace('$', '').replace(',', ''))
        : item.price;
    }

    await supabase.from('cart_activity_logs').insert({
      user_id: user?.id || null,
      session_id: sessionId,
      action_type: actionType,
      product_id: String(item.id || ''),
      product_name: item.name || '',
      product_price: productPrice,
      quantity: item.quantity || 0,
      variant_details: item.selectedVariant || null,
      total_cart_value: totalCartValue,
      total_cart_items: totalCartItems,
    });

    console.log('✅ Cart activity logged for user:', user?.id || 'guest', actionType, item.name);
  } catch (error) {
    console.error('Failed to log cart activity:', error);
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage on initial mount
    const savedCart = localStorage.getItem('cart_items');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems(current => {
      const existingItem = current.find(i => i.id === item.id);
      let updatedItems: CartItem[];
      
      if (existingItem) {
        updatedItems = current.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        );
      } else {
        updatedItems = [...current, { ...item, quantity: item.quantity || 1 }];
      }

      // Log the activity
      logCartActivity('add', item, updatedItems);
      
      return updatedItems;
    });
  };

  const removeFromCart = (id: number | string) => {
    setItems(current => {
      const itemToRemove = current.find(item => item.id === id);
      const updatedItems = current.filter(item => item.id !== id);
      
      if (itemToRemove) {
        logCartActivity('remove', itemToRemove, updatedItems);
      }
      
      return updatedItems;
    });
  };

  const updateQuantity = (id: number | string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setItems(current => {
      const itemToUpdate = current.find(item => item.id === id);
      const updatedItems = current.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      
      if (itemToUpdate) {
        logCartActivity('update_quantity', { ...itemToUpdate, quantity }, updatedItems);
      }
      
      return updatedItems;
    });
  };

  const clearCart = () => {
    // Log clear action before clearing
    logCartActivity('clear', {}, []);
    setItems([]);
    localStorage.removeItem('cart_items');
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
