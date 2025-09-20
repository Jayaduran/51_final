import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus, Search, Filter, Package2, TrendingUp, TrendingDown, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import RecordMovementModal from './modals/RecordMovementModal';

const StockLedger: React.FC = () => {
  const { stockItems, stockMovements, recordStockMovement } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredItems = useMemo(() => {
    return stockItems.filter(item => {
      const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesFilter = true;
      if (stockFilter === 'Low Stock') {
        matchesFilter = item.currentStock < 50;
      } else if (stockFilter === 'Out of Stock') {
        matchesFilter = item.currentStock === 0;
      } else if (stockFilter === 'In Stock') {
        matchesFilter = item.currentStock > 0;
      }
      
      return matchesSearch && matchesFilter;
    });
  }, [stockItems, searchTerm, stockFilter]);

  const stats = useMemo(() => {
    const totalItems = stockItems.length;
    const inStock = stockItems.filter(item => item.currentStock > 0).length;
    const lowStock = stockItems.filter(item => item.currentStock > 0 && item.currentStock < 50).length;
    const outOfStock = stockItems.filter(item => item.currentStock === 0).length;
    const totalValue = stockItems.reduce((sum, item) => sum + (item.currentStock * 10), 0); // Assuming avg cost of $10

    return { totalItems, inStock, lowStock, outOfStock, totalValue };
  }, [stockItems]);

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { color: 'text-red-600', icon: TrendingDown, label: 'Out of Stock' };
    } else if (stock < 50) {
      return { color: 'text-yellow-600', icon: AlertTriangle, label: 'Low Stock' };
    } else {
      return { color: 'text-green-600', icon: TrendingUp, label: 'In Stock' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <RecordMovementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRecordMovement={(movement) => {
          recordStockMovement(movement);
          setIsModalOpen(false);
        }}
      />
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Ledger</h1>
          <p className="text-gray-600">Track material movement and inventory balance</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Record Movement
        </button>
      </div>

      {/* Stats Cards & Current Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="font-semibold text-lg mb-4">Current Stock Levels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm font-medium text-green-700">In Stock</p>
              <p className="text-2xl font-bold text-green-600">{stats.inStock}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <p className="text-sm font-medium text-yellow-700">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <p className="text-sm font-medium text-red-700">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col justify-center">
            <h3 className="font-semibold text-lg mb-4">Total Inventory Value</h3>
            <p className="text-4xl font-bold text-purple-600">
              ${stats.totalValue.toLocaleString()}
            </p>
        </div>
      </div>

      {/* Stock Movements */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b">
            <h3 className="font-semibold text-lg">Stock Movements</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-600 text-sm">Date</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600 text-sm">Product</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600 text-sm">Type</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600 text-sm">Quantity</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600 text-sm">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stockMovements.slice(0, 10).map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-gray-700">{formatDate(m.date)}</td>
                  <td className="py-4 px-6 font-medium text-gray-900">{m.productName}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-2 font-medium text-sm ${m.type === 'In' ? 'text-green-600' : 'text-red-600'}`}>
                      {m.type === 'In' ? <TrendingUp className="h-4 w-4"/> : <TrendingDown className="h-4 w-4"/>}
                      {m.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-700">{m.quantity}</td>
                  <td className="py-4 px-6 text-gray-700">{m.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockLedger;
