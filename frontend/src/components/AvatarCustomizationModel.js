import React, { useState } from "react";

const AvatarCustomizationModal = ({ currentConfig, onClose, onSave }) => {
  const [tempConfig, setTempConfig] = useState(currentConfig);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempConfig({
      ...tempConfig,
      [name]: value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg">
        <h2 className="text-lg font-bold mb-4">Customize Your Avatar</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(tempConfig);
          }}
        >
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={tempConfig.name}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-customPurple focus:border-customPurple"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Background Color
            </label>
            <input
              type="color"
              name="backgroundColor"
              value={tempConfig.backgroundColor}
              onChange={handleInputChange}
              className="w-12 h-8 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Font Size (0.1 to 1.0)
            </label>
            <input
              type="number"
              name="fontSize"
              value={tempConfig.fontSize}
              min="0.1"
              max="1"
              step="0.1"
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-customPurple focus:border-customPurple"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-customPurple text-white rounded hover:bg-[#8060DB]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AvatarCustomizationModal;
