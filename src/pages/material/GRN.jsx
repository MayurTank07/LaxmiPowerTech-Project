import React, { useState, useEffect } from "react";
import { upcomingDeliveryAPI } from "../../utils/materialAPI";
import { Package, Calendar, MapPin, FileText, User, TrendingUp, Eye } from "lucide-react";

export default function GRN({ isTabView = false }) {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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
    setSelectedDelivery(delivery);
    setShowDetailsModal(true);
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
                      {delivery.st_id || delivery.transfer_number}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {delivery.type === 'PO' ? '📋 Purchase Order' : '🚚 Site Transfer'}
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

      {/* Details Modal */}
      {showDetailsModal && selectedDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">GRN Details</h3>
                <p className="text-sm text-gray-500">{selectedDelivery.st_id || selectedDelivery.transfer_number}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* GRN Summary Section */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">📄 GRN Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      {selectedDelivery.type === 'PO' ? 'Purchase Order ID' : 'Site Transfer ID'}
                    </label>
                    <p className="text-gray-900 font-bold text-lg mt-1">{selectedDelivery.st_id || selectedDelivery.transfer_number}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Type</label>
                    <p className="text-gray-900 font-semibold mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                        selectedDelivery.type === 'PO' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {selectedDelivery.type === 'PO' ? '📋 Purchase Order' : '🚚 Site Transfer'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Status</label>
                    <p className="text-gray-900 font-semibold mt-1">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        ✅ {selectedDelivery.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Date</label>
                    <p className="text-gray-900 font-semibold mt-1">{formatDate(selectedDelivery.date || selectedDelivery.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Location & Requestor Details */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                <div>
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">From Location</label>
                  <p className="text-gray-900 font-medium mt-1">📍 {selectedDelivery.from || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">To Location</label>
                  <p className="text-gray-900 font-medium mt-1">📍 {selectedDelivery.to || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Requested By</label>
                  <p className="text-gray-900 font-medium mt-1">👤 {selectedDelivery.createdBy || 'N/A'}</p>
                </div>
              </div>

              {/* Materials Table */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package size={18} className="text-green-600" />
                  📦 Materials Received
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                      <tr>
                        <th className="border px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Item</th>
                        <th className="border px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Category</th>
                        <th className="border px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wide">Ordered</th>
                        <th className="border px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wide">Received</th>
                        <th className="border px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wide">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDelivery.items?.map((item, index) => {
                        const approvedQty = item.st_quantity || 0;
                        const receivedQty = item.received_quantity || 0;
                        const isFullyReceived = receivedQty >= approvedQty;
                        
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border px-3 py-2 text-sm text-gray-900">
                              {item.category || item.name || 'N/A'}
                            </td>
                            <td className="border px-3 py-2 text-sm text-gray-600">
                              {[item.sub_category, item.sub_category1, item.sub_category2]
                                .filter(Boolean)
                                .join(' - ') || '-'}
                            </td>
                            <td className="border px-3 py-2 text-center text-sm font-bold text-blue-600">
                              {approvedQty}
                            </td>
                            <td className="border px-3 py-2 text-center text-sm font-bold text-green-600">
                              ✓ {receivedQty}
                            </td>
                            <td className="border px-3 py-2 text-center">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                isFullyReceived 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'bg-orange-100 text-orange-600'
                              }`}>
                                {isFullyReceived ? 'Complete' : 'Partial'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Attachments */}
              {selectedDelivery.attachments && selectedDelivery.attachments.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText size={18} />
                    Attachments
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedDelivery.attachments.map((attachment, index) => {
                      const attachmentUrl = typeof attachment === 'string' ? attachment : attachment.url;
                      const fileName = attachmentUrl.split('/').pop();
                      
                      return (
                        <a
                          key={index}
                          href={attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <FileText size={16} className="text-orange-500" />
                          <span className="text-sm text-gray-700 truncate">{fileName}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}