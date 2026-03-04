import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search as SearchIcon, Store, MapPin, Hash } from 'lucide-react';
import { motion } from 'motion/react';

const MOCK_VENDORS = [
  { id: 'v1', name: 'The Grand Bistro', address: '123 Food Street', vendorCode: 'BISTRO01', category: 'Fine Dining' },
  { id: 'v2', name: 'Burger King', address: 'Mall Road', vendorCode: 'BK001', category: 'Fast Food' },
  { id: 'v3', name: 'Pizza Hut', address: 'City Center', vendorCode: 'PHUT22', category: 'Italian' },
];

export const VendorSearchScreen: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filteredVendors = MOCK_VENDORS.filter(v => 
    v.name.toLowerCase().includes(query.toLowerCase()) || 
    v.vendorCode.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <header className="bg-white p-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-grow relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            autoFocus
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search vendor name or code..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-[#FF6B35] outline-none text-sm"
          />
        </div>
      </header>

      <div className="p-4 space-y-4">
        {query.length > 0 ? (
          filteredVendors.length > 0 ? (
            filteredVendors.map(vendor => (
              <motion.button 
                key={vendor.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => navigate(`/menu/${vendor.id}`)}
                className="w-full bg-white p-4 rounded-2xl shadow-sm border border-black/5 flex items-center gap-4 text-left hover:border-[#FF6B35] transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF6B35] flex items-center justify-center flex-shrink-0">
                  <Store size={24} />
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-gray-900">{vendor.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[10px] text-gray-400 uppercase font-bold">
                      <Hash size={10} /> {vendor.vendorCode}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-gray-400 uppercase font-bold">
                      <MapPin size={10} /> {vendor.address}
                    </span>
                  </div>
                </div>
              </motion.button>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No vendors found matching "{query}"</p>
            </div>
          )
        ) : (
          <div className="space-y-6">
            <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest px-2">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {['Burger', 'Pizza', 'BISTRO01', 'Cafe', 'PHUT22'].map(tag => (
                <button 
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
