import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Download, Calendar, BarChart, PieChart, DollarSign, Clock, FileText, TrendingUp } from 'lucide-react';
import ProductionTrendChart from '../charts/ProductionTrendChart';
import OrderStatusChart from '../charts/OrderStatusChart';

const Reports: React.FC = () => {
  const { manufacturingOrders, workOrders, boms, products } = useData();
  const [dateRange, setDateRange] = useState('last-90-days');

  const kpis = useMemo(() => {
    const totalOrders = manufacturingOrders.length;
    const avgProductionTime = workOrders.length > 0
      ? workOrders.reduce((sum, wo) => sum + wo.actualHours, 0) / workOrders.length
      : 0;
    const avgCostPerUnit = boms.length > 0
      ? boms.reduce((sum, bom) => sum + bom.totalCost, 0) / boms.length
      : 0;
    const inventoryValue = products.reduce((sum, p) => sum + (p.unitPrice * p.stockQuantity), 0);
    
    return { totalOrders, avgProductionTime, avgCostPerUnit, inventoryValue };
  }, [manufacturingOrders, workOrders, boms, products]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600">Performance metrics, trends, and data exports</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="last-30-days">Last 30 Days</option>
              <option value="last-90-days">Last 90 Days</option>
              <option value="all-time">All Time</option>
            </select>
          </div>
          <button onClick={() => alert('Exporting to Excel...')} className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="h-4 w-4" /> Excel
          </button>
          <button onClick={() => alert('Downloading PDF...')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <FileText className="h-4 w-4" /> PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{kpis.totalOrders}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Production Time</p>
              <p className="text-3xl font-bold text-gray-900">{kpis.avgProductionTime.toFixed(1)}h</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Cost / Unit</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(kpis.avgCostPerUnit)}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inventory Value</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(kpis.inventoryValue)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <BarChart className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <BarChart className="h-6 w-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Production Trend</h2>
          </div>
          <ProductionTrendChart />
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <PieChart className="h-6 w-6 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Order Status Distribution</h2>
          </div>
          <OrderStatusChart />
        </div>
      </div>
    </div>
  );
};

export default Reports;
