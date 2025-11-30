import React, { useState, useRef, useEffect } from 'react';
import { X, Edit2, ChevronDown } from 'lucide-react';

// Searchable Dropdown Component
function SearchableDropdown({ value, onChange, options, placeholder, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(true);
      inputRef.current?.focus();
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const displayValue = isOpen ? searchTerm : (value || '');

  return (
    <div ref={dropdownRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onClick={handleInputClick}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-white border border-gray-300 rounded-md px-3 py-2.5 pr-8 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
          autoComplete="off"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            <ul className="py-1">
              {filteredOptions.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(option)}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-orange-50 transition-colors ${
                    option === value ? 'bg-orange-100 text-orange-700 font-medium' : 'text-gray-900'
                  }`}
                >
                  {option}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500 text-center">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MaterialLineItem({
  material,
  index,
  isEditing,
  categories,
  getSubcategories,
  getSubSubcategories,
  getSubSubSubcategories,
  onUpdate,
  onRemove,
  onEdit,
  onDoneEditing,
  loading = false
}) {
  const isComplete = material.category && material.subCategory && material.subCategory1 && material.subCategory2 && material.quantity;

  // Collapsed Card View - Matching Snapshot 2
  if (!isEditing && isComplete) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-4 relative animate-fade-in">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 mb-3">Material #{index + 1}</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <span className="text-gray-500 text-xs">Category:</span>
                <p className="text-gray-900 font-medium">{material.category}</p>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Sub Category:</span>
                <p className="text-gray-900 font-medium">{material.subCategory}</p>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Sub Category 1:</span>
                <p className="text-gray-900 font-medium">{material.subCategory1}</p>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Quantity:</span>
                <p className="text-gray-900 font-medium">{material.quantity}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0 pt-1">
            <button
              onClick={onEdit}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="Edit material"
            >
              <Edit2 size={18} className="text-gray-600" />
            </button>
            <button
              onClick={onRemove}
              className="p-1.5 hover:bg-red-50 rounded transition-colors"
              title="Remove material"
            >
              <X size={18} className="text-red-500" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Expanded Edit View - Matching Snapshot 3
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 relative animate-slide-down">
      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="absolute top-4 right-4 text-red-500 hover:text-red-700 z-10"
        title="Remove material"
      >
        <X size={18} />
      </button>

      <p className="text-sm font-semibold text-gray-900 mb-4">Material #{index + 1}</p>

      {/* Row 1: Category and Sub Category */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-gray-700 text-sm mb-1.5 block">Category</label>
          <SearchableDropdown
            value={material.category}
            onChange={(value) => onUpdate('category', value)}
            options={categories}
            placeholder="Select or type..."
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-gray-700 text-sm mb-1.5 block">Sub Category</label>
          <SearchableDropdown
            value={material.subCategory}
            onChange={(value) => onUpdate('subCategory', value)}
            options={material.category ? getSubcategories(material.category) : []}
            placeholder="Select or type..."
            disabled={!material.category || loading}
          />
        </div>
      </div>

      {/* Row 2: Sub Category 1 and Sub Category 2 */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-gray-700 text-sm mb-1.5 block">Sub Category 1</label>
          <SearchableDropdown
            value={material.subCategory1}
            onChange={(value) => onUpdate('subCategory1', value)}
            options={material.subCategory ? getSubSubcategories(material.category, material.subCategory) : []}
            placeholder="Select or type..."
            disabled={!material.subCategory || loading}
          />
        </div>

        <div>
          <label className="text-gray-700 text-sm mb-1.5 block">Sub Category 2</label>
          <SearchableDropdown
            value={material.subCategory2}
            onChange={(value) => onUpdate('subCategory2', value)}
            options={material.subCategory1 ? getSubSubSubcategories(material.category, material.subCategory, material.subCategory1) : []}
            placeholder="Select or type..."
            disabled={!material.subCategory1 || loading}
          />
        </div>
      </div>

      {/* Row 3: Quantity */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-gray-700 text-sm mb-1.5 block">Quantity</label>
          <input
            type="number"
            placeholder="Enter qty"
            value={material.quantity}
            onChange={(e) => onUpdate('quantity', e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            min="1"
          />
        </div>
      </div>

      {/* Done Editing Button (only show if material is complete) */}
      {isComplete && (
        <button
          onClick={onDoneEditing}
          className="mt-3 w-full text-sm text-orange-500 font-semibold hover:text-orange-600 transition-colors py-2"
        >
          ✓ Done editing
        </button>
      )}
    </div>
  );
}