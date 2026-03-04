import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RoleSelectionScreen } from './screens/RoleSelectionScreen';
import { LoginScreen } from './screens/LoginScreen';
import { CustomerHomeScreen } from './screens/CustomerHomeScreen';
import { VendorSearchScreen } from './screens/VendorSearchScreen';
import { ScannerScreen } from './screens/ScannerScreen';
import { MenuScreen } from './screens/MenuScreen';
import { CartScreen } from './screens/CartScreen';
import { OrderTrackingScreen } from './screens/OrderTrackingScreen';
import { AdminDashboard } from './screens/AdminDashboard';

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: string }) => {
  const { role, isLoading } = useAuth();
  if (isLoading) return null;
  if (role !== allowedRole) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<RoleSelectionScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            
            {/* Customer Routes */}
            <Route path="/customer/home" element={
              <ProtectedRoute allowedRole="customer">
                <CustomerHomeScreen />
              </ProtectedRoute>
            } />
            <Route path="/customer/search" element={
              <ProtectedRoute allowedRole="customer">
                <VendorSearchScreen />
              </ProtectedRoute>
            } />
            <Route path="/customer/scan" element={
              <ProtectedRoute allowedRole="customer">
                <ScannerScreen />
              </ProtectedRoute>
            } />
            <Route path="/menu/:restaurantId" element={<MenuScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/order-tracking/:orderId" element={<OrderTrackingScreen />} />
            
            {/* Vendor Routes */}
            <Route path="/vendor/dashboard" element={
              <ProtectedRoute allowedRole="vendor">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
