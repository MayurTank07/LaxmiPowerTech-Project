import { useState } from "react";

export default function IndentTable({ data }) {
  const [search, setSearch] = useState("");

  // Define columns to display
  const displayColumns = ['srNo', 'category', 'subCategory', 'subCategory1', 'sheetName'];
  const columnLabels = {
    srNo: 'SR NO.',
    category: 'Category',
    subCategory: 'Sub Category',
    subCategory1: 'Sub Category 1',
    sheetName: 'Sheet Name'
  };

  // Filter data based on search
  const filteredData = data
    .filter((row) => {
      const searchLower = search.toLowerCase();
      return displayColumns.some(col => 
        String(row[col] || '').toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      // Sort by srNo or rowIndex
      const aValue = a.srNo || a.rowIndex || 0;
      const bValue = b.srNo || b.rowIndex || 0;
      return String(aValue).localeCompare(String(bValue));
    });

  if (!data || data.length === 0)
    return <p className="text-gray-500 text-center mt-10">No data found.</p>;

  return (
    <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-700">Material Catalog</h2>
          <p className="text-sm text-gray-500">{data.length} materials in database</p>
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded p-2 w-64 focus:ring-2 focus:ring-orange-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="min-w-full border text-sm">
        <thead className="bg-orange-100">
          <tr>
            {displayColumns.map((col) => (
              <th key={col} className="border px-4 py-2 text-left font-medium text-gray-700">
                {columnLabels[col]}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredData.map((row, idx) => (
            <tr key={row._id || idx} className="hover:bg-gray-50">
              {displayColumns.map((col) => {
                const value = row[col];
                return (
                  <td key={col} className="border px-4 py-2 text-black">
                    {String(value || "-")}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
