import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useData } from '../../contexts/DataContext';

const ProductionTrendChart: React.FC = () => {
  const { manufacturingOrders } = useData();

  const getChartData = () => {
    const monthlyData: { [key: string]: number } = {};
    
    manufacturingOrders.forEach(order => {
      const month = new Date(order.createdDate).toLocaleString('en-US', { month: 'short', year: '2-digit' });
      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }
      monthlyData[month] += order.quantity;
    });

    const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
      const dateA = new Date(`01 ${a}`);
      const dateB = new Date(`01 ${b}`);
      return dateA.getTime() - dateB.getTime();
    });

    return {
      labels: sortedMonths,
      data: sortedMonths.map(month => monthlyData[month]),
    };
  };

  const { labels, data } = getChartData();

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: labels,
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          color: '#6B7280'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          color: '#6B7280'
        }
      }
    ],
    series: [
      {
        name: 'Units Produced',
        type: 'bar',
        barWidth: '60%',
        data: data,
        itemStyle: {
          color: '#3B82F6'
        }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '350px', width: '100%' }} />;
};

export default ProductionTrendChart;
