import { create } from 'zustand';
import api from '../api';
import toast from 'react-hot-toast';

export const useCartStore = create((set, get) => ({
  items: [],
  isOpen: false,
  
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  
  fetchCart: async () => {
    try {
      const { data } = await api.get('/cart');
      set({ items: data.data });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  },
  
  addItem: async (productId, quantity) => {
    try {
      const { data } = await api.post('/cart', { productId, quantity });
      set({ items: data.data });
      toast.success('Item added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not add item.');
    }
  },

  removeItem: async (productId) => {
    try {
      const { data } = await api.delete(`/cart/${productId}`);
      set({ items: data.data });
       toast.success('Item removed from cart.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not remove item.');
    }
  },

  clearCart: async () => {
    try {
      await api.delete('/cart');
      set({ items: [] });
      toast.success('Cart cleared.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not clear cart.');
    }
  },
  
  getCartTotal: () => {
    return get().items.reduce((total, item) => total + item.productId.price * item.quantity, 0);
  },
}));