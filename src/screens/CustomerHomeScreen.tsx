import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { QrCode, Search, LogOut, ShoppingBag, Clock, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';

export const CustomerHomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { activeOrder } = useCart();

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <header className="bg-white p-6 flex justify-between items-center shadow-sm">
        <div>
          <p className="text-xs text-gray-500">Welcome back,</p>
          <h1 className="text-xl font-bold text-gray-900">{user?.email?.split('@')[0] || 'Guest'}</h1>
        </div>
        <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
          <LogOut size={20} />
        </button>
      </header>

      <div className="p-6 space-y-8">
        {/* Main Actions */}
        <div className="grid grid-cols-1 gap-4">
          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/customer/scan')}
            className="bg-[#FF6B35] p-8 rounded-[32px] text-white flex flex-col items-center text-center shadow-lg shadow-[#FF6B35]/20"
          >
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <QrCode size={32} />
            </div>
            <h2 className="text-xl font-bold">Scan QR Code</h2>
            <p className="text-white/70 text-sm mt-1">Scan the code on your table to view menu</p>
          </motion.button>

          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/customer/search')}
            className="bg-white p-8 rounded-[32px] border border-black/5 flex flex-col items-center text-center shadow-sm"
          >
            <div className="w-16 h-16 bg-gray-50 text-[#FF6B35] rounded-2xl flex items-center justify-center mb-4">
              <Search size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Search Vendor</h2>
            <p className="text-gray-500 text-sm mt-1">Search by restaurant name or code</p>
          </motion.button>
        </div>

        {/* Recent Vendors / Recommendations */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900">Popular Vendors</h3>
            <button className="text-[#FF6B35] text-sm font-bold">See All</button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
            {[1, 2, 3].map(i => (
              <Link 
                key={i} 
                to={`/menu/v${i}`}
                className="flex-shrink-0 w-48 bg-white rounded-2xl overflow-hidden border border-black/5 shadow-sm"
              >
                <img src={`https://picsum.photos/seed/vendor${i}/400/250`} className="w-full h-24 object-cover" alt="vendor" referrerPolicy="no-referrer" />
                <div className="p-3">
                  <h4 className="font-bold text-sm">Restaurant {i}</h4>
                  <p className="text-xs text-gray-500">Fast Food • 4.5 ★</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Floating Order Tracker */}
      <AnimatePresence>
        {activeOrder && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => navigate(`/order-tracking/${activeOrder.id}`)}
            className="fixed bottom-6 right-6 bg-white rounded-2xl p-4 shadow-2xl border border-[#FF6B35]/20 flex items-center gap-4 cursor-pointer z-50 max-w-[280px]"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center flex-shrink-0">
              <Clock size={24} className="animate-pulse" />
            </div>
            <div className="flex-grow overflow-hidden">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-bold text-[#FF6B35] uppercase tracking-wider">Active Order</p>
                <ChevronRight size={14} className="text-gray-300" />
              </div>
              <p className="font-bold text-gray-900 truncate">Order #{activeOrder.orderNumber}</p>
              <p className="text-xs text-gray-500">{activeOrder.status} • ~15 mins</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
