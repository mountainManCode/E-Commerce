import { createContext, useContext, useState } from 'react';

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

// Custom Provider. Store data (state) and functionality (updates) in here, and anyone can access it via the consumer.
function CartStateProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);

  function toggleCart() {
    setCartOpen(!cartOpen);
  }

  function closeCart() {
    setCartOpen(false);
  }

  function openCart() {
    setCartOpen(true);
  }

  return (
    <LocalStateProvider
      value={{ cartOpen, setCartOpen, toggleCart, closeCart, openCart }}
    >
      {children}
    </LocalStateProvider>
  );
}

// Custom hook for accessing the cart local state
function useCart() {
  // Use a consumer to access local state.
  const all = useContext(LocalStateContext);
  return all;
}

export { CartStateProvider, useCart };
