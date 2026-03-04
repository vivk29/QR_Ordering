import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, ChefHat, Bell, UtensilsCrossed, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { OrderStatus } from '../types';
import { useCart } from '../context/CartContext';

const STATUS_STEPS: { status: OrderStatus; icon: any; label: string }[] = [
  { status: 'Placed', icon: Bell, label: 'Order Placed' },
  { status: 'Preparing', icon: ChefHat, label: 'Preparing' },
  { status: 'Ready', icon: Clock, label: 'Ready to Serve' },
  { status: 'Completed', icon: UtensilsCrossed, label: 'Completed' },
];

export const OrderTrackingScreen: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('Placed');
  const { activeOrder, setActiveOrder } = useCart();

  // Simulate status updates for preview
  useEffect(() => {
    const timer = setTimeout(() => setCurrentStatus('Preparing'), 5000);
    const timer2 = setTimeout(() => setCurrentStatus('Ready'), 15000);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    if (activeOrder) {
      setActiveOrder({ ...activeOrder, status: currentStatus });
    }
  }, [currentStatus]);

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.status === currentStatus);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <header className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <Link to="/" className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">Track Order</h1>
      </header>

      <div className="p-6 flex-grow flex flex-col items-center">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-black/5">
          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 mb-1">Order ID</p>
            <h2 className="text-lg font-mono font-bold text-gray-900">{orderId}</h2>
          </div>

          <div className="space-y-8 relative">
            {/* Vertical Line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-100" />
            
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const Icon = step.icon;

              return (
                <div key={step.status} className="flex items-center gap-6 relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${
                    isCompleted ? 'bg-[#10B981] text-white' : 
                    isCurrent ? 'bg-[#FF6B35] text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                  </div>
                  <div>
                    <p className={`font-bold ${isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-[#FF6B35] font-medium"
                      >
                        {step.status === 'Preparing' ? 'Chef is working on your meal' : 'Almost there!'}
                      </motion.p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 w-full max-w-md space-y-4">
          <h3 className="font-bold text-gray-800 px-2">Need help?</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-white p-4 rounded-2xl shadow-sm border border-black/5 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                <Bell size={20} />
              </div>
              <span className="text-sm font-medium">Call Waiter</span>
            </button>
            <button className="bg-white p-4 rounded-2xl shadow-sm border border-black/5 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-cyan-50 text-cyan-500 flex items-center justify-center">
                <UtensilsCrossed size={20} />
              </div>
              <span className="text-sm font-medium">Request Water</span>
            </button>
          </div>
          <button className="w-full bg-white p-4 rounded-2xl shadow-sm border border-black/5 flex items-center justify-center gap-2 font-bold text-gray-700 hover:bg-gray-50 transition-colors">
            <CreditCard size={20} />
            Request Bill
          </button>
        </div>
      </div>
    </div>
  );
};

const CreditCard = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
);
