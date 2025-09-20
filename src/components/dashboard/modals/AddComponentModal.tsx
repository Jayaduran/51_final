import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, FileText } from 'lucide-react';
import { useData } from '../../../contexts/DataContext';

interface AddComponentData {
  parentProductId: string;
  componentProductId: string;
  quantity: number;
  operation: string;
}

interface AddComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddComponent: (data: AddComponentData) => void;
}

const AddComponentModal: React.FC<AddComponentModalProps> = ({ isOpen, onClose, onAddComponent }) => {
  const { products } = useData();
  const [formData, setFormData] = useState<AddComponentData>({
    parentProductId: '',
    componentProductId: '',
    quantity: 1,
    operation: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.parentProductId || !formData.componentProductId || formData.quantity <= 0 || !formData.operation) {
      alert('Please fill all fields correctly.');
      return;
    }
    if (formData.parentProductId === formData.componentProductId) {
      alert('Parent and component product cannot be the same.');
      return;
    }
    onAddComponent(formData);
    setFormData({ parentProductId: '', componentProductId: '', quantity: 1, operation: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl"
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Add Bill of Materials Component</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent Product</label>
                  <select name="parentProductId" value={formData.parentProductId} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="" disabled>Select parent product</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Component Product</label>
                  <select name="componentProductId" value={formData.componentProductId} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="" disabled>Select component product</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="1" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Operation</label>
                    <input type="text" name="operation" value={formData.operation} onChange={handleChange} required placeholder="e.g., Assembly, Welding" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 rounded-b-2xl">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Add Component
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddComponentModal;
