import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus, Search, Eye, Edit, Trash2, Package, DollarSign, Filter, Settings } from 'lucide-react';
import AddComponentModal from './modals/AddComponentModal';

const BOM: React.FC = () => {
  const { boms, products, addComponentToBOM } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [productFilter, setProductFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredBOMs = useMemo(() => {
    return boms.filter(bom => {
      const matchesSearch = bom.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bom.productCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = productFilter === 'All' || bom.id === productFilter;
      return matchesSearch && matchesFilter;
    });
  }, [boms, searchTerm, productFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <AddComponentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddComponent={(data) => {
          addComponentToBOM(data);
          setIsModalOpen(false);
        }}
      />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bill of Materials (BOM)</h1>
          <p className="text-gray-600">Define components and operations needed for each product</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Component
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-auto"
            >
              <option value="All">All Products</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* BOM Cards */}
      {filteredBOMs.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBOMs.map((bom) => (
            <div key={bom.id} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{bom.productName}</h3>
                  <p className="text-sm text-gray-500">{bom.productCode}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Total Cost */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Total Material Cost</span>
                  <span className="text-lg font-bold text-green-600">{formatCurrency(bom.totalCost)}</span>
                </div>
              </div>

              {/* Components */}
              <div className="flex-grow">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Components ({bom.components.length})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {bom.components.map((component) => (
                    <div key={component.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{component.name}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <span>Qty: {component.quantity} {component.unit}</span>
                          <div className="flex items-center gap-1">
                            <Settings className="h-3 w-3" />
                            <span>{component.operation}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(component.cost * component.quantity)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatCurrency(component.cost)}/{component.unit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Bill of Materials Found</h3>
          <p className="text-gray-500">No BOMs found for the current filter. Try adding a new component.</p>
        </div>
      )}
    </div>
  );
};

export default BOM;
