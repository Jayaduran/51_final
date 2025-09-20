import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ProfileSidebar from './ProfileSidebar';
import MainDashboard from './MainDashboard';
import ManufacturingOrders from './ManufacturingOrders'; // Renamed for clarity
import WorkOrders from './WorkOrders';
import BOM from './BOM';
import StockLedger from './StockLedger';
import WorkCenters from './WorkCenters';
import ProductMaster from './ProductMaster';
import Reports from './Reports';
import Profile from './Profile';
import UserManagement from './UserManagement';

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      {/* Profile Sidebar */}
      <ProfileSidebar 
        isOpen={isProfileSidebarOpen} 
        onClose={() => setIsProfileSidebarOpen(false)} 
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Header onProfileClick={() => setIsProfileSidebarOpen(true)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<MainDashboard />} />
            <Route path="/manufacturing-orders" element={<ManufacturingOrders />} />
            <Route path="/work-orders" element={<WorkOrders />} />
            <Route path="/bom" element={<BOM />} />
            <Route path="/stock-ledger" element={<StockLedger />} />
            <Route path="/work-centers" element={<WorkCenters />} />
            <Route path="/product-master" element={<ProductMaster />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user-management" element={<UserManagement />} />
            {/* Redirect from old main dashboard route */}
            <Route path="/dashboard" element={<Navigate to="/dashboard/manufacturing-orders" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
