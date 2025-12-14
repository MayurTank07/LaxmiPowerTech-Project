import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { upcomingDeliveryAPI } from "../../utils/materialAPI";
import { Package, Calendar, MapPin, FileText, User, TrendingUp, Eye } from "lucide-react";

export default function GRN({ isTabView = false }) {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCompletedDeliveries();
  }, []);

  // Auto-refresh when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      fetchCompletedDeliveries();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Listen for delivery updates
  useEffect(() => {
    const handleDeliveryUpdate = () => {
      fetchCompletedDeliveries();
    };
    
    window.addEventListener('deliveryUpdated', handleDeliveryUpdate);
    window.addEventListener('upcomingDeliveryRefresh', handleDeliveryUpdate);
    
    return () => {
      window.removeEventListener('deliveryUpdated', handleDeliveryUpdate);
      window.removeEventListener('upcomingDeliveryRefresh', handleDeliveryUpdate);
    };
  }, []);

  const fetchCompletedDeliveries = async () => {
    try {
      setLoading(true);
      const response = await upcomingDeliveryAPI.getAll(1, 100, "");
      if (response.success) {
        // Filter only transferred/completed deliveries
        const completed = response.data.filter(d => 
          d.status?.toLowerCase() === 'transferred'
        );
        setDeliveries(completed);
        console.log(`📦 GRN: Found ${completed.length} transferred deliveries`);
      }
    } catch (err) {
      console.error("Error fetching GRN:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (delivery) => {
    // Navigate to GRN detail page (Intent-style view)
    navigate(`/material/grn/${delivery._id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <>
      <div className={isTabView ? "px-6 py-6" : "p-3"}>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Goods Receipt Note (GRN)</h2>
          <p className="text-sm text-gray-500">Completed deliveries ({deliveries.length} records)</p>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-600 text-sm">Loading GRN records...</p>
          </div>
        ) : deliveries.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No completed deliveries yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {deliveries.map((delivery) => (
              <div
                key={delivery._id}
                className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {delivery.transfer_number || delivery.st_id}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {delivery.type === 'PO' ? '📋 Vendor-wise PO' : '🚚 Site Transfer'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-600">
                      Completed
                    </span>
                    <button
                      onClick={() => handleViewDetails(delivery)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span>{delivery.from || 'N/A'} → {delivery.to || 'N/A'}</span>
                  </div>
                  {delivery.createdBy && (
                    <div className="flex items-center gap-2">
                      <User size={14} />
                      <span>Requested by: {delivery.createdBy}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>Date: {formatDate(delivery.date || delivery.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package size={14} />
                    <span>{delivery.items?.length || 0} items received</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}