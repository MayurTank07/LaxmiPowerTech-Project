import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";

export default function DeliveryDetails() {
    const location = useLocation();
    const navigate = useNavigate();

    const { item, type } = location.state || {};
    const [materials, setMaterials] = useState(item?.materials || []);
    const [deliveryImages, setDeliveryImages] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);

    // ✅ Fix: Move navigate to useEffect to avoid render-phase navigation
    useEffect(() => {
        if (!item || !type) {
            console.warn('⚠️ DeliveryDetails: Missing item or type, redirecting...');
            navigate('/dashboard/material');
        }
    }, [item, type, navigate]);

    // Show loading while checking for data
    if (!item || !type) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading delivery details...</p>
                </div>
            </div>
        );
    }

    const handleCheckbox = (id, checked) => {
        setMaterials((prev) =>
            prev.map((m) =>
                m.id === id ? { ...m, receivedQty: checked ? m.poQty : 0 } : m
            )
        );
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setDeliveryImages(prev => [...prev, ...files]);
        
        // Create preview URLs
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setDeliveryImages(prev => prev.filter((_, i) => i !== index));
        setImagePreview(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        // send updated materials and images back
        navigate(-1, {
            state: {
                updated: true,
                type,
                id: item.id,
                materials,
                deliveryImages, // Include images in submission
            },
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
            {/* Container with consistent mobile width */}
            <div className="max-w-md mx-auto bg-white shadow-xl">
                {/* Header with Gradient */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 pt-6 pb-8 rounded-b-3xl shadow-lg relative">
                    <button
                        className="absolute top-6 left-6 text-white flex items-center gap-2 hover:bg-white/20 px-3 py-1.5 rounded-full transition-all"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={16} />
                        <span className="text-sm font-medium">Back</span>
                    </button>

                    <div className="text-center pt-8">
                        <h1 className="text-white text-2xl font-bold mb-2">Delivery Details</h1>
                        <p className="text-white/80 text-sm">{type} - {item.id}</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="px-6 py-6 -mt-4 pb-24">
                    <div className="space-y-4">
                        {/* Materials Card */}
                        <div className="bg-white rounded-lg border p-4">
                            <h2 className="font-semibold text-gray-900 mb-3">Materials</h2>
                            
                            <div className="space-y-3">
                                {materials.map((m) => (
                                    <div
                                        key={m.id}
                                        className="bg-white rounded-lg border border-gray-200 p-4"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">{m.name}</p>
                                            </div>
                                            {isEditMode && (
                                                <input
                                                    type="checkbox"
                                                    checked={m.receivedQty >= m.poQty}
                                                    onChange={(e) => handleCheckbox(m.id, e.target.checked)}
                                                    className="w-5 h-5 accent-orange-500 cursor-pointer"
                                                />
                                            )}
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs text-gray-500 block mb-1">P.O Qty</label>
                                                <p className="text-sm font-medium text-orange-600">{m.poQty}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 block mb-1">Received</label>
                                                <p className="text-sm font-medium text-gray-900">{m.receivedQty}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Delivery Proof Upload - Only in Edit Mode */}
                        {isEditMode && (
                        <div className="bg-white rounded-lg border p-4">
                            <h2 className="font-semibold text-gray-900 mb-3">Delivery Proof (Optional)</h2>
                            
                            {/* Image Preview */}
                            {imagePreview.length > 0 && (
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    {imagePreview.map((preview, index) => (
                                        <div key={index} className="relative border border-gray-300 rounded-lg overflow-hidden">
                                            <img 
                                                src={preview} 
                                                alt={`Delivery proof ${index + 1}`}
                                                className="w-full h-32 object-cover"
                                            />
                                            <button
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                            <div className="p-2 bg-white border-t border-gray-200">
                                                <p className="text-xs text-gray-600 truncate">{deliveryImages[index]?.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {/* Upload Button */}
                            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors">
                                <Upload size={20} className="text-gray-500" />
                                <span className="text-sm text-gray-600 font-medium">Upload Delivery Proof (Challan, etc.)</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                            <p className="text-xs text-gray-500 mt-2">Upload images of delivery challan or proof</p>
                        </div>
                        )}
                    </div>
                </div>

                {/* Fixed Bottom Buttons */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
                    <div className="max-w-[390px] mx-auto px-4 py-3">
                        {!isEditMode ? (
                            // View mode: Show only Edit button (No Delete)
                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setIsEditMode(true)}
                                    className="flex-1 bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition-colors shadow-md"
                                >
                                    Edit
                                </button>
                            </div>
                        ) : (
                            // Edit mode: Show Cancel and Submit buttons
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setIsEditMode(false);
                                        setMaterials(item?.materials || []);
                                        setDeliveryImages([]);
                                        setImagePreview([]);
                                    }}
                                    className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition-colors shadow-md"
                                >
                                    Submit
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
