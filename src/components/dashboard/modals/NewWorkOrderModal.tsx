import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ClipboardList } from 'lucide-react';
import { useData } from '../../../contexts/DataContext';

interface WorkOrderData {
  manufacturingOrderId: string;
  item: string;
  operation: string;
  assignedTo: string;
  estimatedHours: number;
}

interface NewWorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWorkOrder: (order: WorkOrderData) => void;
}

const NewWorkOrderModal: React.FC<NewWorkOrderModalProps> = ({ isOpen, onClose, onAddWorkOrder }) => {
  const { manufacturingOrders } = useData();
  const [formData, setFormData] = useState<Omit<WorkOrderData, 'item'>>({
    manufacturingOrderId: '',
    operation: '',
    assignedTo: '',
    estimatedHours: 8,
  });

  const selectedManufacturingOrder = useMemo(() => {
    return manufacturingOrders.find(mo => mo.id === formData.manufacturingOrderId);
  }, [formData.manufacturingOrderId, manufacturingOrders]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estimatedHours' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedManufacturingOrder || !formData.operation || !formData.assignedTo) {
      alert('Please fill all required fields.');
      return;
    }
    onAddWorkOrder({ ...formData, item: selectedManufacturingOrder.item });
    setFormData({ manufacturingOrderId: '', operation: '', assignedTo: '', estimatedHours: 8 });
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
                  <ClipboardList className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Create Work Order</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturing Order</label>
                  <select name="manufacturingOrderId" value={formData.manufacturingOrderId} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="" disabled>Select an order</option>
                    {manufacturingOrders.map(mo => <option key={mo.id} value={mo.id}>{mo.orderNumber} - {mo.item}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Operation</label>
                    <input type="text" name="operation" value={formData.operation} onChange={handleChange} required placeholder="e.g., Assembly" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                    <input type="text" name="assignedTo" value={formData.assignedTo} onChange={handleChange} required placeholder="e.g., Operator 1" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
                    <input type="number" name="estimatedHours" value={formData.estimatedHours} onChange={handleChange} min="1" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 rounded-b-2xl">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Create Work Order
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NewWorkOrderModal;
