import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Store, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export const RoleSelectionScreen: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSelectRole = (role: 'customer' | 'vendor') => {
    if (role === 'customer') {
      navigate('/login?role=customer');
    } else {
      navigate('/login?role=vendor');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="w-20 h-20 bg-[#FF6B35] rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-[#FF6B35]/20">
          <Store className="text-white" size={40} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">QuickServe</h1>
        <p className="text-gray-500 mt-2">Order food without the wait</p>
      </motion.div>

      <div className="w-full max-w-sm space-y-4">
        <button 
          onClick={() => handleSelectRole('customer')}
          className="w-full bg-white p-6 rounded-2xl shadow-sm border border-black/5 flex items-center justify-between group hover:border-[#FF6B35] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF6B35] flex items-center justify-center group-hover:bg-[#FF6B35] group-hover:text-white transition-colors">
              <User size={24} />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900">Continue as Customer</p>
              <p className="text-xs text-gray-500">Scan QR and order food</p>
            </div>
          </div>
          <ChevronRight className="text-gray-300 group-hover:text-[#FF6B35]" size={20} />
        </button>

        <button 
          onClick={() => handleSelectRole('vendor')}
          className="w-full bg-white p-6 rounded-2xl shadow-sm border border-black/5 flex items-center justify-between group hover:border-[#FF6B35] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center group-hover:bg-[#FF6B35] group-hover:text-white transition-colors">
              <Store size={24} />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900">Login as Vendor</p>
              <p className="text-xs text-gray-500">Manage your restaurant</p>
            </div>
          </div>
          <ChevronRight className="text-gray-300 group-hover:text-[#FF6B35]" size={20} />
        </button>
      </div>
    </div>
  );
};
