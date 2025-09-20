import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Settings } from 'lucide-react';

interface WorkCenterData {
  name: string;
  location: string;
  capacity: number;
  costPerHour: number;
}

interface NewWorkCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCenter: (center: WorkCenterData) => void;
}

const NewWorkCenterModal: React.FC<NewWorkCenterModalProps> = ({ isOpen, onClose, onAddCenter }) => {
  const [formData, setFormData] = useState<WorkCenterData>({
    name: '',
    location: '',
    capacity: 8,
    costPerHour: 50,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' || name === 'costPerHour' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.location) {
      alert('Please fill all fields.');
      return;
    }
    onAddCenter(formData);
    setFormData({ name: '', location: '', capacity: 8, costPerHour: 50 });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg"
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Settings className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Create Work Center</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Work Center Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g., CNC Machine 1" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="e.g., Building A" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (hours/day)</label>
                    <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} min="1" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost Per Hour ($)</label>
                    <input type="number" name="costPerHour" value={formData.costPerHour} onChange={handleChange} min="0" step="0.01" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 rounded-b-2xl">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Create Work Center
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NewWorkCenterModal;
