import { useCartStore } from '../store/cartStore';

export const useCart = () => {
  const { items, isOpen, toggleCart, fetchCart, addItem, removeItem, clearCart, getCartTotal } = useCartStore();
  return { items, isOpen, toggleCart, fetchCart, addItem, removeItem, clearCart, getCartTotal };
};