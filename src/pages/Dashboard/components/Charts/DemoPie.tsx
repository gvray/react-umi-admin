import Chart, { EChartsOption } from '@/components/Charts';
import { CategoryData } from '@/services/dashboard';
import React from 'react';
import { styled } from 'umi';

const DemoWrapper = styled.div`
  height: 300px;
  padding: 20px;
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  border-radius: 12px;
  overflow: visible;
`;

interface DemoPieProps {
  data?: CategoryData[];
}

const DemoPie: React.FC<DemoPieProps> = ({ data = [] }) => {
  // 默认数据
  const defaultData: CategoryData[] = [];

  const chartData = data.length > 0 ? data : defaultData;
  const options: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(50, 50, 50, 0.95)',
      borderColor: '#333',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontSize: 12,
      },
      formatter: function (params: any) {
        return `<div style="padding: 8px;">
          <div style="margin-bottom: 4px; font-weight: bold;">${params.name}</div>
          <div style="display: flex; align-items: center;">
            <span style="display: inline-block; width: 10px; height: 10px; background: ${params.color}; border-radius: 50%; margin-right: 8px;"></span>
            <span>数量: ${params.value}</span>
          </div>
          <div style="margin-top: 4px; color: #ffa726;">占比: ${params.percent}%</div>
        </div>`;
      },
    },
    legend: {
      bottom: 5,
      left: 'center',
      textStyle: {
        fontSize: 12,
        color: '#666',
      },
      itemWidth: 14,
      itemHeight: 8,
      itemGap: 20,
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['50%', '41%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2,
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.1)',
        },
        label: {
          show: true,
          position: 'outside',
          fontSize: 12,
          color: '#666',
          formatter: '{b}\n{d}%',
          fontWeight: 'bold',
          lineHeight: 16,
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 10,
          smooth: true,
          lineStyle: {
            color: '#999',
            width: 1,
          },
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          },
          label: {
            show: true,
            fontSize: 12,
            fontWeight: 'bold',
          },
        },
        data: chartData.map((item, index) => {
          const colors = [
            {
              type: 'linear' as const,
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#ff6b6b' },
                { offset: 1, color: '#ffa726' },
              ],
            },
            {
              type: 'linear' as const,
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#4facfe' },
                { offset: 1, color: '#00f2fe' },
              ],
            },
            {
              type: 'linear' as const,
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#43e97b' },
                { offset: 1, color: '#38f9d7' },
              ],
            },
            {
              type: 'linear' as const,
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#fa709a' },
                { offset: 1, color: '#fee140' },
              ],
            },
            {
              type: 'linear' as const,
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#a8edea' },
                { offset: 1, color: '#fed6e3' },
              ],
            },
          ];
          return {
            value: item.value,
            name: item.name,
            itemStyle: {
              color: colors[index % colors.length],
            },
          };
        }),
      },
    ],
  };
  return (
    <DemoWrapper>
      <Chart options={options} />
    </DemoWrapper>
  );
};

export default DemoPie;
