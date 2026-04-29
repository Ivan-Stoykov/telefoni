import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Създаваме самия контекст
const CartContext = createContext();

// 2. Създаваме Provider (доставчик на данни), който ще обвие приложението ни
export const CartProvider = ({ children }) => {
  
  // Първоначално опитваме да заредим количката от localStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Всеки път, когато cartItems се промени, автоматично запазваме новия масив в localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Функция за добавяне в количката
  const addToCart = (phone) => {
    setCartItems((prevItems) => {
      // Проверяваме дали този телефон (с това ID) вече е в количката
      const existingItem = prevItems.find(item => item.id === phone.id);
      
      if (existingItem) {
        // Ако го има, просто му увеличаваме бройката (quantity) с 1
        return prevItems.map(item => 
          item.id === phone.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Ако го няма, го добавяме като нов обект с бройка: 1
        return [...prevItems, { ...phone, quantity: 1 }];
      }
    });
  };

  // Функция за премахване на цял продукт от количката
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
  };

  const decreaseQuantity = (id) => {
    setCartItems((prevItems) => {
      return prevItems.map(item => 
        // Ако намерим телефона и бройката му е над 1, я намаляваме с 1
        item.id === id && item.quantity > 1 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      );
    });
  };

  // Функция за изчистване на цялата количка (ще ни трябва след плащане)
  const clearCart = () => {
    setCartItems([]);
  };

  // Предоставяме данните и функциите на всички компоненти
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, decreaseQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

// 3. Създаваме наш собствен custom hook за по-лесно ползване
export const useCart = () => {
  return useContext(CartContext);
};

