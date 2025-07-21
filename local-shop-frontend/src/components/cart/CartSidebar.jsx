import { FiX, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../../hooks/useCart';
import { Link } from 'react-router-dom';
import CartItem from './CartItem';

const CartSidebar = () => {
  const { isOpen, toggleCart, items, clearCart, getCartTotal } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleCart}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FiShoppingCart className="mr-3 text-primary" /> Your Cart
            </h2>
            <button onClick={toggleCart} className="text-slate-400 hover:text-white transition-colors">
              <FiX size={24} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-grow p-6 overflow-y-auto">
            {items.length > 0 ? (
              <div className="space-y-4">
                {items.map(item => <CartItem key={item.productId._id} item={item} />)}
              </div>
            ) : (
              <div className="text-center text-slate-400 mt-10">
                <p>Your cart is empty.</p>
                <Link to="/products" onClick={toggleCart} className="text-primary hover:underline mt-2 inline-block">Start shopping</Link>
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-800">
              <div className="flex justify-between items-center mb-4 text-lg">
                <span className="font-semibold text-white">Subtotal</span>
                <span className="font-bold text-primary">${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <button onClick={clearCart} className="flex items-center text-sm text-red-400 hover:text-red-300 transition">
                  <FiTrash2 className="mr-1" /> Clear Cart
                </button>
              </div>
              <Link to="/cart" onClick={toggleCart} className="w-full text-center glow-button block">
                View Cart & Checkout
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default CartSidebar;