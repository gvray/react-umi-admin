import { Charts } from '@/components';
import type { EChartsOption } from 'echarts';
import React from 'react';

interface LoginTrendProps {
  data: number[];
  height?: number;
}

const LoginTrend: React.FC<LoginTrendProps> = ({ data, height = 320 }) => {
  const options: EChartsOption = {
    title: {
      text: '最近7天登录趋势',
      left: 'center',
      top: 10,
      textStyle: { fontSize: 14 },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLine: { show: true, lineStyle: { color: '#e5e7eb' } },
      axisTick: { show: true, lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#94a3b8' },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: true, lineStyle: { color: '#e5e7eb' } },
      axisTick: { show: true, lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#94a3b8' },
      splitLine: { show: true, lineStyle: { color: '#f1f5f9' } },
    },
    series: [
      {
        name: '登录次数',
        data,
        type: 'line',
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
            ],
          },
        },
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: '#1890ff',
        },
        itemStyle: {
          color: '#1890ff',
          borderColor: '#fff',
          borderWidth: 2,
        },
      },
    ],
  };

  return (
    <div style={{ height, width: '100%' }}>
      <Charts options={options} />
    </div>
  );
};

export default LoginTrend;
