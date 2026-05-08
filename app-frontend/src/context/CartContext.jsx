import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = ({phone, color}) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === phone.id && item.color === color);
      
      if (existingItem) {
        return prevItems.map(item => 
          item.id === phone.id && item.color === color ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...phone, color: color, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id, color) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== id || item.color !== color));
  };

  const decreaseQuantity = (id, color) => {
    setCartItems((prevItems) => {
      return prevItems.map(item => 
        item.id === id && item.color === color && item.quantity > 1 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, decreaseQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};

