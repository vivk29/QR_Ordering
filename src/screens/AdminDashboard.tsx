import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Order, OrderStatus } from '../types';
import { LayoutDashboard, Utensils, Users, Settings, Bell, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

export const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'tables' | 'stats'>('orders');

  useEffect(() => {
    // Mock data for preview
    const mockOrders: Order[] = [
      {
        id: 'ORD-XJ92K1',
        vendorId: 'v1',
        items: [{ id: '1', name: 'Paneer Tikka', price: 240, quantity: 2 }, { id: '3', name: 'Butter Chicken', price: 450, quantity: 1 }],
        totalAmount: 930,
        status: 'Placed',
        paymentMethod: 'UPI',
        createdAt: { toDate: () => new Date() },
        orderNumber: '4291',
      },
      {
        id: 'ORD-PL82M4',
        vendorId: 'v1',
        items: [{ id: '2', name: 'Chicken Wings', price: 320, quantity: 1 }],
        totalAmount: 320,
        status: 'Preparing',
        paymentMethod: 'Cash',
        createdAt: { toDate: () => new Date(Date.now() - 1000 * 60 * 15) },
        orderNumber: '8821',
      }
    ];
    setOrders(mockOrders);
  }, []);

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1F2937] text-white flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#FF6B35] rounded-lg" />
          <h1 className="text-xl font-bold tracking-tight">QuickServe</h1>
        </div>
        
        <nav className="flex-grow px-4 space-y-2 mt-4">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Live Orders" 
            active={activeTab === 'orders'} 
            onClick={() => setActiveTab('orders')} 
          />
          <SidebarItem 
            icon={Utensils} 
            label="Menu Manager" 
            active={activeTab === 'menu'} 
            onClick={() => setActiveTab('menu')} 
          />
          <SidebarItem 
            icon={Users} 
            label="Table Overview" 
            active={activeTab === 'tables'} 
            onClick={() => setActiveTab('tables')} 
          />
          <SidebarItem 
            icon={Settings} 
            label="Settings" 
            active={activeTab === 'stats'} 
            onClick={() => setActiveTab('stats')} 
          />
        </nav>
        
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-600" />
            <div>
              <p className="text-sm font-bold">Admin User</p>
              <p className="text-xs opacity-50">Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col overflow-hidden">
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-8">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1.5 w-96">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search orders, tables..." 
              className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-gray-200" />
            <span className="text-sm font-medium text-gray-600">March 04, 2026</span>
          </div>
        </header>

        <div className="p-8 overflow-y-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Live Orders</h2>
              <p className="text-gray-500">Monitor and manage incoming restaurant orders</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                <Filter size={16} /> Filter
              </button>
              <button className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#e85a2a]">
                Export Data
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {orders.map(order => (
                <AdminOrderCard 
                  key={order.id} 
                  order={order} 
                  onStatusUpdate={updateStatus} 
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
      active ? 'bg-[#FF6B35] text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

interface AdminOrderCardProps {
  order: Order;
  onStatusUpdate: (id: string, status: OrderStatus) => Promise<void> | void;
}

const AdminOrderCard: React.FC<AdminOrderCardProps> = ({ order, onStatusUpdate }) => {
  const statusColors = {
    'Placed': 'bg-blue-100 text-blue-600',
    'Preparing': 'bg-orange-100 text-orange-600',
    'Ready': 'bg-green-100 text-green-600',
    'Completed': 'bg-gray-100 text-gray-600',
    'Cancelled': 'bg-red-100 text-red-600',
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col"
    >
      <div className="p-5 border-b border-gray-100 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">#{order.orderNumber}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${statusColors[order.status]}`}>
              {order.status}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900">{order.paymentMethod} Payment</h3>
        </div>
        <span className="text-xs text-gray-400">{format(order.createdAt.toDate(), 'HH:mm')}</span>
      </div>
      
      <div className="p-5 flex-grow space-y-3">
        {order.items.map(item => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-gray-600"><span className="font-bold text-gray-900">{item.quantity}x</span> {item.name}</span>
            <span className="font-medium">₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>
      
      <div className="px-5 py-4 bg-gray-50 flex justify-between items-center">
        <div className="text-sm">
          <p className="text-gray-500">Total Amount</p>
          <p className="font-bold text-gray-900">₹{order.totalAmount}</p>
        </div>
        
        <div className="flex gap-2">
          {order.status === 'Placed' && (
            <button 
              onClick={() => onStatusUpdate(order.id, 'Preparing')}
              className="px-4 py-2 bg-[#FF6B35] text-white text-xs font-bold rounded-lg hover:bg-[#e85a2a]"
            >
              Start Preparing
            </button>
          )}
          {order.status === 'Preparing' && (
            <button 
              onClick={() => onStatusUpdate(order.id, 'Ready')}
              className="px-4 py-2 bg-[#10B981] text-white text-xs font-bold rounded-lg hover:bg-[#0da371]"
            >
              Mark Ready
            </button>
          )}
          {order.status === 'Ready' && (
            <button 
              onClick={() => onStatusUpdate(order.id, 'Completed')}
              className="px-4 py-2 bg-gray-800 text-white text-xs font-bold rounded-lg hover:bg-gray-900"
            >
              Mark Completed
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
