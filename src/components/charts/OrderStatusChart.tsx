import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useData } from '../../contexts/DataContext';

const OrderStatusChart: React.FC = () => {
  const { manufacturingOrders } = useData();

  const getChartData = () => {
    const statusCounts = {
      'Planned': 0,
      'In Progress': 0,
      'Done': 0,
      'Canceled': 0,
    };

    manufacturingOrders.forEach(order => {
      if (statusCounts.hasOwnProperty(order.status)) {
        statusCounts[order.status]++;
      }
    });

    return [
      { value: statusCounts['Done'], name: 'Done' },
      { value: statusCounts['In Progress'], name: 'In Progress' },
      { value: statusCounts['Planned'], name: 'Planned' },
      { value: statusCounts['Canceled'], name: 'Canceled' },
    ];
  };

  const data = getChartData();

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['Done', 'In Progress', 'Planned', 'Canceled'],
      textStyle: {
        color: '#4B5563'
      }
    },
    series: [
      {
        name: 'Order Status',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data,
        color: ['#10B981', '#F59E0B', '#3B82F6', '#EF4444']
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '350px', width: '100%' }} />;
};

export default OrderStatusChart;
