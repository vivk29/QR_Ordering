import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ChevronLeft, Trash2, Plus, Minus, CreditCard, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export const CartScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Cash'>('UPI');
  const { items, updateQuantity, removeItem, totalAmount, clearCart, setActiveOrder } = useCart();
  const [isPlacing, setIsPlacing] = useState(false);

  const restaurantId = searchParams.get('restaurantId');

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setIsPlacing(true);
    
    try {
      const orderNumber = Math.floor(1000 + Math.random() * 9000).toString();
      const orderData: any = {
        vendorId: restaurantId,
        items,
        totalAmount,
        status: 'Placed',
        paymentMethod,
        createdAt: new Date(),
        orderNumber,
      };

      // Mocking order for preview
      const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      const fullOrder = { id: orderId, ...orderData };
      
      setTimeout(() => {
        setActiveOrder(fullOrder);
        clearCart();
        navigate('/customer/home');
      }, 1500);
      
    } catch (error) {
      console.error("Error placing order:", error);
      setIsPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <header className="bg-white p-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Your Cart</h1>
      </header>

      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <ShoppingBag size={48} className="mb-4 opacity-20" />
            <p>Your cart is empty</p>
            <button 
              onClick={() => navigate(-1)}
              className="mt-4 text-[#FF6B35] font-bold"
            >
              Go back to menu
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <h3 className="font-bold text-gray-900 px-2">Order Summary</h3>
              {items.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-black/5 flex justify-between items-center">
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-[#FF6B35] font-bold">₹{item.price}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1">
                        <Minus size={16} />
                      </button>
                      <span className="mx-2 font-bold text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1">
                        <Plus size={16} />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-gray-900 px-2">Payment Method</h3>
              <div className="grid grid-cols-1 gap-2">
                <PaymentOption 
                  id="UPI" 
                  label="UPI (GPay, PhonePe)" 
                  active={paymentMethod === 'UPI'} 
                  onClick={() => setPaymentMethod('UPI')} 
                />
                <PaymentOption 
                  id="Card" 
                  label="Credit / Debit Card" 
                  active={paymentMethod === 'Card'} 
                  onClick={() => setPaymentMethod('Card')} 
                />
                <PaymentOption 
                  id="Cash" 
                  label="Cash at Counter" 
                  active={paymentMethod === 'Cash'} 
                  onClick={() => setPaymentMethod('Cash')} 
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-black/5 space-y-3">
              <h3 className="font-bold text-gray-900">Bill Details</h3>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Item Total</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Taxes & Charges</span>
                <span>₹{(totalAmount * 0.05).toFixed(2)}</span>
              </div>
              <div className="h-px bg-gray-100 my-2" />
              <div className="flex justify-between font-bold text-lg text-gray-900">
                <span>To Pay</span>
                <span>₹{(totalAmount * 1.05).toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {items.length > 0 && (
        <div className="p-4 bg-white border-t border-gray-100">
          <button 
            disabled={isPlacing}
            onClick={handlePlaceOrder}
            className="w-full bg-[#FF6B35] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-[#e85a2a] transition-colors disabled:opacity-50"
          >
            {isPlacing ? 'Placing Order...' : (
              <>
                Place Order <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

const PaymentOption = ({ id, label, active, onClick }: { id: string, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
      active ? 'border-[#FF6B35] bg-[#FF6B35]/5 ring-1 ring-[#FF6B35]' : 'border-gray-200 bg-white'
    }`}
  >
    <span className={`font-medium ${active ? 'text-[#FF6B35]' : 'text-gray-700'}`}>{label}</span>
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? 'border-[#FF6B35]' : 'border-gray-300'}`}>
      {active && <div className="w-2.5 h-2.5 bg-[#FF6B35] rounded-full" />}
    </div>
  </button>
);

const ShoppingBag = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
