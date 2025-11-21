import React, { useState, useEffect } from "react";
import { upcomingDeliveryAPI } from "../../utils/materialAPI";
import { Package, Calendar, MapPin } from "lucide-react";

export default function GRN({ isTabView = false }) {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCompletedDeliveries();
  }, []);

  const fetchCompletedDeliveries = async () => {
    try {
      setLoading(true);
      const response = await upcomingDeliveryAPI.getAll(1, 100, "");
      if (response.success) {
        // Filter only transferred/completed deliveries
        const completed = response.data.filter(d => d.status === 'Transferred');
        setDeliveries(completed);
      }
    } catch (err) {
      console.error("Error fetching GRN:", err);
    } finally {
      setLoading(false);
    }
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
    <div className={isTabView ? "px-6 py-6" : "p-3"}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Goods Receipt Note (GRN)</h2>
        <p className="text-sm text-gray-500">Completed deliveries</p>
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
                  <div className="text-sm font-semibold text-gray-900">{delivery.st_id}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{delivery.transfer_number}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-600">
                  Completed
                </span>
              </div>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  <span>{delivery.from} → {delivery.to}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>{formatDate(delivery.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package size={14} />
                  <span>{delivery.items.length} items received</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}