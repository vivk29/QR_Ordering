import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, X, Camera } from 'lucide-react';
import QrScanner from 'react-qr-scanner';
import { motion } from 'motion/react';

export const ScannerScreen: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleScan = (data: any) => {
    if (data) {
      // Assuming QR data is a vendorId or a URL containing it
      // For demo, we'll just navigate to v1
      const vendorId = data.text || 'v1';
      navigate(`/menu/${vendorId}`);
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    setError("Could not access camera. Please ensure permissions are granted.");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="p-6 flex justify-between items-center text-white z-10">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-full backdrop-blur-md">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-bold">Scan QR Code</h1>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <div className="flex-grow relative flex items-center justify-center overflow-hidden">
        {/* Scanner Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white rounded-3xl overflow-hidden">
            <div className="absolute inset-0 border-4 border-[#FF6B35] animate-pulse" />
            <div className="absolute top-0 left-0 w-full h-1 bg-[#FF6B35] animate-scan shadow-[0_0_15px_#FF6B35]" />
          </div>
        </div>

        <div className="w-full h-full flex items-center justify-center">
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      <div className="p-10 bg-black text-center text-white z-10">
        {error ? (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        ) : (
          <p className="text-white/60 text-sm mb-4">Align the QR code within the frame to scan</p>
        )}
        <button 
          onClick={() => navigate('/customer/search')}
          className="text-[#FF6B35] font-bold text-sm"
        >
          Can't scan? Search by code
        </button>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
};
