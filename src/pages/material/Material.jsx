import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Intent from "./Intent";
import MaterialTransfer from "./MaterialTransfer";
import UpcomingDeliveries from "./UpcomingDeliveries";

export default function Material({ activeTab }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Determine active tab based on route or prop
  const getCurrentTab = () => {
    if (activeTab) return activeTab;
    const path = location.pathname;
    if (path.includes('/material/transfer')) return 'transfer';
    if (path.includes('/material/deliveries')) return 'deliveries';
    if (path.includes('/material/grn')) return 'grn';
    return 'intent';
  };

  const currentTab = getCurrentTab();

  const tabs = [
    { name: 'Intent', path: '/material/intent', key: 'intent' },
    { name: 'Material Transfer', path: '/material/transfer', key: 'transfer' },
    { name: 'Upcoming Deliveries', path: '/material/deliveries', key: 'deliveries' },
    { name: 'GRN', path: '/material/grn', key: 'grn' },
  ];

  const renderContent = () => {
    switch (currentTab) {
      case 'intent':
        return <Intent isTabView={true} />;
      case 'transfer':
        return <MaterialTransfer isTabView={true} />;
      case 'deliveries':
        return <UpcomingDeliveries isTabView={true} />;
      case 'grn':
        return (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-600 text-sm">GRN Page - Coming Soon</p>
          </div>
        );
      default:
        return <Intent isTabView={true} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Container with consistent mobile width */}
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-xl">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 pt-6 pb-6 rounded-b-3xl shadow-lg relative">
          <button
            className="absolute top-6 left-6 text-white flex items-center gap-2 hover:bg-white/20 px-3 py-1.5 rounded-full transition-all"
            onClick={() => navigate('/dashboard')}
          >
            <FaArrowLeft size={16} />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="text-center pt-8">
            <h1 className="text-white text-2xl font-bold mb-2">Material Management</h1>
            <p className="text-white/80 text-sm">{user?.name || 'User'}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 px-2 -mt-2">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => navigate(tab.path)}
                className={`px-3 py-3 text-xs font-medium whitespace-nowrap transition-all ${
                  currentTab === tab.key
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
