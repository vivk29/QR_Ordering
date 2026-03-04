import React from 'react';
import { MenuItem } from '../types';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';

interface FoodCardProps {
  item: MenuItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { addItem, updateQuantity, items } = useCart();
  const cartItem = items.find(i => i.id === item.id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden flex p-3 gap-4"
    >
      <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
        <img 
          src={item.imageURL || `https://picsum.photos/seed/${item.name}/200/200`} 
          alt={item.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 leading-tight">{item.name}</h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-[#FF6B35]">₹{item.price}</span>
          
          {cartItem ? (
            <div className="flex items-center bg-[#FF6B35]/10 rounded-full px-2 py-1">
              <button 
                onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
                className="p-1 text-[#FF6B35]"
              >
                <Minus size={16} />
              </button>
              <span className="mx-2 font-bold text-sm text-[#FF6B35]">{cartItem.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
                className="p-1 text-[#FF6B35]"
              >
                <Plus size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => addItem({ id: item.id, name: item.name, price: item.price, quantity: 1 })}
              className="bg-white border border-[#FF6B35] text-[#FF6B35] px-4 py-1 rounded-full text-sm font-bold hover:bg-[#FF6B35] hover:text-white transition-colors"
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
