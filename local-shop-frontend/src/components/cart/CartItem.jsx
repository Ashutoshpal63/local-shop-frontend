import { FiTrash2 } from 'react-icons/fi';
import { useCart } from '../../hooks/useCart';
import { Link } from 'react-router-dom';

const CartItem = ({ item }) => {
  const { removeItem } = useCart();
  
  if (!item.productId) {
    return null; // Don't render if product details are missing
  }

  return (
    <div className="flex items-center space-x-4 glass-card p-3">
      <img src={item.productId.imageUrl || 'https://via.placeholder.com/80'} alt={item.productId.name} className="w-20 h-20 rounded-md object-cover" />
      <div className="flex-grow">
        <Link to={`/product/${item.productId._id}`} className="font-semibold text-white hover:text-primary transition">
          {item.productId.name}
        </Link>
        <p className="text-sm text-slate-400">Quantity: {item.quantity}</p>
        <p className="text-sm text-primary font-bold">${item.productId.price.toFixed(2)}</p>
      </div>
      <button onClick={() => removeItem(item.productId._id)} className="text-slate-500 hover:text-red-400 transition-colors">
        <FiTrash2 size={20} />
      </button>
    </div>
  );
};

export default CartItem;