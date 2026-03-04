import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { MenuItem } from '../types';
import { FoodCard } from '../components/FoodCard';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

const CATEGORIES = ['Starters', 'Main Course', 'Desserts', 'Drinks'] as const;

export const MenuScreen: React.FC = () => {
  const { restaurantId: vendorId } = useParams<{ restaurantId: string }>();
  const [searchParams] = useSearchParams();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Starters');
  const [loading, setLoading] = useState(true);
  const { totalItems, totalAmount } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // Mock data for preview
        const mockItems: MenuItem[] = [
          { id: '1', vendorId: 'v1', name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices', category: 'Starters', price: 240, imageURL: '', availability: true },
          { id: '2', vendorId: 'v1', name: 'Chicken Wings', description: 'Spicy buffalo wings with dip', category: 'Starters', price: 320, imageURL: '', availability: true },
          { id: '3', vendorId: 'v1', name: 'Butter Chicken', description: 'Creamy tomato gravy with chicken', category: 'Main Course', price: 450, imageURL: '', availability: true },
          { id: '4', vendorId: 'v1', name: 'Dal Makhani', description: 'Slow cooked black lentils', category: 'Main Course', price: 380, imageURL: '', availability: true },
          { id: '5', vendorId: 'v1', name: 'Gulab Jamun', description: 'Sweet milk dumplings', category: 'Desserts', price: 120, imageURL: '', availability: true },
          { id: '6', vendorId: 'v1', name: 'Fresh Lime Soda', description: 'Refreshing citrus drink', category: 'Drinks', price: 90, imageURL: '', availability: true },
        ];
        
        setMenuItems(mockItems);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching menu:", error);
        setLoading(false);
      }
    };

    fetchMenu();
  }, [vendorId]);

  const filteredItems = menuItems.filter(item => item.category === activeCategory);

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  if (loading) return <div className="flex items-center justify-center h-screen text-[#FF6B35]">Loading Menu...</div>;

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <header className="bg-white p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">The Grand Bistro</h1>
            <p className="text-xs text-gray-500">Vendor ID: {vendorId}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#FF6B35]/10 flex items-center justify-center">
             <img src="https://picsum.photos/seed/restaurant/100/100" className="rounded-full" alt="logo" />
          </div>
        </div>
        
        {/* Categories */}
        <div className="flex gap-4 mt-4 overflow-x-auto no-scrollbar pb-2">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category 
                ? 'bg-[#FF6B35] text-white' 
                : 'bg-gray-100 text-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      {/* Menu List */}
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-bold text-gray-800">{activeCategory}</h2>
        <div className="grid gap-4">
          {filteredItems.map(item => (
            <div key={item.id} onClick={() => setSelectedItem(item)}>
              <FoodCard item={item} />
            </div>
          ))}
        </div>
      </div>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full max-w-lg rounded-t-[32px] p-6 pb-10"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" onClick={() => setSelectedItem(null)} />
              <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-gray-100">
                <img 
                  src={selectedItem.imageURL || `https://picsum.photos/seed/${selectedItem.name}/600/400`} 
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{selectedItem.name}</h2>
                <span className="text-xl font-bold text-[#FF6B35]">₹{selectedItem.price}</span>
              </div>
              <p className="text-gray-500 mb-8">{selectedItem.description}</p>
              
              <button 
                onClick={() => {
                  // Add to cart logic is already in FoodCard, but we can add one here too
                  setSelectedItem(null);
                }}
                className="w-full bg-[#FF6B35] text-white py-4 rounded-2xl font-bold shadow-lg"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Cart Bar */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-6 left-4 right-4 bg-[#FF6B35] text-white rounded-2xl p-4 shadow-lg flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <ShoppingBag size={20} />
              </div>
              <div>
                <p className="text-xs font-medium opacity-80">{totalItems} Items</p>
                <p className="font-bold">₹{totalAmount}</p>
              </div>
            </div>
            <Link to={`/cart?restaurantId=${vendorId}`} className="flex items-center gap-1 font-bold">
              View Cart <ChevronRight size={20} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
