import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import IndentTable from "./IndentTable";
import { materialCatalogAPI } from "../../utils/materialAPI";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function UploadIndent() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Fetch materials from database on mount
  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const data = await materialCatalogAPI.getAll();
      console.log('📊 Fetched materials from DB:', data?.length || 0);
      setMaterials(data || []);
    } catch (err) {
      console.error("Failed to fetch materials:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Upload new Excel
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Directly upload to server without parsing on frontend
    await uploadToServer(file);
    
    // Reset file input
    e.target.value = '';
  };

const uploadToServer = async (file) => {
  try {
    setUploading(true);

    const response = await materialCatalogAPI.uploadExcel(file);
    console.log('✅ Upload response:', response);

    alert(`Excel uploaded successfully! ${response.count} records added, ${response.deletedCount || 0} old records deleted.`);

    // Fetch fresh data from database
    await fetchMaterials();
  } catch (error) {
    console.error('Upload error:', error);
    alert("Failed to upload Excel file: " + (error.message || 'Unknown error'));
  } finally {
    setUploading(false);
  }
};

  return (
    <DashboardLayout title="Upload Indent List">
    <div className="flex-1 p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Upload an Indent List / See Existing Indent List 1
          </h1>
          <p className="text-sm text-gray-500">Supported file: .xlsx</p>
        </div>

        <div>
          <label
            htmlFor="fileInput"
            className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
          >
            {uploading ? "Uploading..." : "Upload Excel"}
          </label>
          <input
            id="fileInput"
            type="file"
            accept=".xlsx"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading materials...</div>
      ) : materials.length > 0 ? (
        <IndentTable data={materials} />
      ) : (
        <div className="text-center py-8 text-gray-500">
          No materials found. Upload an Excel file to get started.
        </div>
      )}
    </div>
    </DashboardLayout>
  );
}
