import React, { useRef, useEffect } from "react";
import { FileUp, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddIndentPopup({ onClose, onUploadClick }) {
  const popupRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleCreateIntent = () => {
    onClose(); // close popup
    navigate("/material/intent/new"); // go to create intent (PO) page
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end justify-center z-50 animate-fade-in">
      <div
        ref={popupRef}
        className="bg-white rounded-t-3xl w-full max-w-md p-6 shadow-2xl animate-slide-up"
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>
        
        <h3 className="text-gray-900 font-bold text-lg mb-6">
          Create New Intent
        </h3>

        <div className="flex flex-col space-y-3">
          <button
            onClick={handleCreateIntent}
            className="flex items-center space-x-4 bg-gradient-to-r from-orange-50 to-orange-100 text-gray-900 font-semibold p-4 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all shadow-sm hover:shadow-md transform hover:scale-[1.02]"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
              <ShoppingCart size={22} className="text-white" />
            </div>
            <div className="text-left flex-1">
              <p className="font-bold text-gray-900">Create Intent (PO)</p>
              <p className="text-xs text-gray-600 mt-0.5">Fill form to create new intent</p>
            </div>
          </button>

          <button
            onClick={onClose}
            className="flex items-center justify-center space-x-2 bg-white border-2 border-gray-200 text-gray-700 font-semibold p-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
}
