import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus, Search, Settings, Activity, DollarSign, Clock, AlertCircle } from 'lucide-react';
import NewWorkCenterModal from './modals/NewWorkCenterModal';

const WorkCenters: React.FC = () => {
  const { workCenters, addWorkCenter } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredWorkCenters = useMemo(() => {
    return workCenters.filter(center =>
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [workCenters, searchTerm]);

  const stats = useMemo(() => {
    const total = workCenters.length;
    const active = workCenters.filter(center => center.status === 'Active').length;
    const maintenance = workCenters.filter(center => center.status === 'Maintenance').length;
    const avgUtilization = workCenters.length > 0 ? workCenters.reduce((sum, center) => sum + center.utilization, 0) / workCenters.length : 0;
    const totalCapacity = workCenters.reduce((sum, center) => sum + center.capacity, 0);

    return { total, active, maintenance, avgUtilization, totalCapacity };
  }, [workCenters]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600';
    if (utilization >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <NewWorkCenterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCenter={(center) => {
          addWorkCenter(center);
          setIsModalOpen(false);
        }}
      />
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Work Centers</h1>
          <p className="text-gray-600">Manage machines/locations capacity, downtime, and utilization</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          New Work Center
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Centers</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Maintenance</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.maintenance}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Avg. Utilization</p>
            <p className={`text-2xl font-bold ${getUtilizationColor(stats.avgUtilization)}`}>
              {stats.avgUtilization.toFixed(0)}%
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Capacity</p>
            <p className="text-2xl font-bold text-purple-600">{stats.totalCapacity}h</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search work centers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Work Centers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkCenters.map((center) => (
          <div key={center.id} className="bg-white rounded-xl border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Settings className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{center.name}</h3>
                  <p className="text-sm text-gray-500">{center.description}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(center.status)}`}>
                {center.status}
              </span>
            </div>

            {/* Metrics */}
            <div className="space-y-4">
              {/* Cost Per Hour */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Cost/Hour</span>
                </div>
                <span className="font-medium text-gray-900">
                  {formatCurrency(center.costPerHour)}
                </span>
              </div>

              {/* Capacity */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Capacity</span>
                </div>
                <span className="font-medium text-gray-900">{center.capacity}h/day</span>
              </div>

              {/* Utilization */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Utilization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${getUtilizationColor(center.utilization)}`}>
                      {center.utilization}%
                    </span>
                    {center.utilization >= 90 && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
                
                {/* Utilization Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      center.utilization >= 90 
                        ? 'bg-red-500' 
                        : center.utilization >= 70 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${center.utilization}%` }}
                  />
                </div>
              </div>

              {/* Status Indicators */}
              <div className="pt-4 border-t border-gray-200">
                {center.status === 'Active' && (
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm">Operational</span>
                  </div>
                )}
                {center.status === 'Maintenance' && (
                  <div className="flex items-center gap-2 text-yellow-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">Under Maintenance</span>
                  </div>
                )}
                {center.status === 'Inactive' && (
                  <div className="flex items-center gap-2 text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Offline</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredWorkCenters.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No work centers found</h3>
          <p className="text-gray-500">No work centers found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default WorkCenters;
