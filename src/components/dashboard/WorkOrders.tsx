import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus, Filter, Search, Eye, Edit, Trash2, Clock, User, CheckCircle2 } from 'lucide-react';
import NewWorkOrderModal from './modals/NewWorkOrderModal';

const WorkOrders: React.FC = () => {
  const { workOrders, addWorkOrder } = useData();
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    return workOrders.filter(order => {
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.operation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [workOrders, statusFilter, searchTerm]);

  const stats = useMemo(() => {
    const total = workOrders.length;
    const notStarted = workOrders.filter(o => o.status === 'Not Started').length;
    const inProgress = workOrders.filter(o => o.status === 'In Progress').length;
    const completed = workOrders.filter(o => o.status === 'Completed').length;
    const onHold = workOrders.filter(o => o.status === 'On Hold').length;

    return { total, notStarted, inProgress, completed, onHold };
  }, [workOrders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'On Hold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Not Started': return <Clock className="h-4 w-4" />;
      case 'In Progress': return <User className="h-4 w-4" />;
      case 'Completed': return <CheckCircle2 className="h-4 w-4" />;
      case 'On Hold': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
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
      <NewWorkOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddWorkOrder={(order) => {
          addWorkOrder(order);
          setIsModalOpen(false);
        }}
      />
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Work Orders</h1>
          <p className="text-gray-600">Assign and manage work steps for operators</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          New Work Order
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Not Started</p>
            <p className="text-2xl font-bold text-gray-600">{stats.notStarted}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">On Hold</p>
            <p className="text-2xl font-bold text-red-600">{stats.onHold}</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search work orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Work Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Order Number</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Item</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Operation</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Assigned To</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Hours</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Start Date</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-900">{order.orderNumber}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-900">{order.item}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-900">{order.operation}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="bg-gray-100 p-1 rounded-full">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="text-gray-900">{order.assignedTo}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <div className="text-gray-900">
                        <span className="font-medium">{order.actualHours}h</span> / {order.estimatedHours}h
                      </div>
                      <div className={`text-xs ${
                        order.actualHours > order.estimatedHours ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {order.actualHours <= order.estimatedHours ? 'On track' : 'Over budget'}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-600">{formatDate(order.startDate)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No work orders found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkOrders;
