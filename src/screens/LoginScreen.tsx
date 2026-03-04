import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, Mail, Phone, LogIn } from 'lucide-react';
import { motion } from 'motion/react';

export const LoginScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const role = searchParams.get('role') as 'customer' | 'vendor';
  const [email, setEmail] = useState('');

  const handleLogin = (method: string) => {
    login(role, email || 'guest@example.com');
    if (role === 'vendor') {
      navigate('/vendor/dashboard');
    } else {
      navigate('/customer/home');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 flex flex-col">
      <button onClick={() => navigate('/')} className="p-2 w-fit hover:bg-gray-100 rounded-full mb-8">
        <ChevronLeft size={24} />
      </button>

      <div className="flex-grow flex flex-col justify-center max-w-sm mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Login to continue as {role}</p>
        </motion.div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <button 
            onClick={() => handleLogin('email')}
            className="w-full bg-[#FF6B35] text-white py-4 rounded-xl font-bold shadow-lg shadow-[#FF6B35]/20 flex items-center justify-center gap-2"
          >
            <LogIn size={20} /> Login
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#F9FAFB] px-2 text-gray-400">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleLogin('google')} className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              Google
            </button>
            <button onClick={() => handleLogin('phone')} className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              <Phone size={18} className="text-gray-600" />
              Phone
            </button>
          </div>

          {role === 'customer' && (
            <button 
              onClick={() => handleLogin('guest')}
              className="w-full text-gray-500 font-medium py-4 hover:text-[#FF6B35] transition-colors"
            >
              Continue as Guest
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
