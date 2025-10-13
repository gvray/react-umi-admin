import { Charts } from '@/components';
import type { EChartsOption } from 'echarts';
import React, { useMemo } from 'react';

interface RoleDistributionProps {
  height?: number;
  data: {
    name: string;
    value: number;
    itemStyle?: {
      color: string;
    };
  }[];
}
const colorPalette = [
  '#f5222d',
  '#faad14',
  '#1890ff',
  '#52c41a',
  '#13c2c2',
  '#722ed1',
];
const RoleDistribution: React.FC<RoleDistributionProps> = ({
  height = 320,
  data,
}) => {
  const dataWithColor = useMemo(
    () =>
      data?.map((item, index) => ({
        ...item,
        itemStyle: {
          color:
            item.itemStyle?.color ||
            colorPalette[index % colorPalette.length] ||
            '#ccc',
        },
      })),
    [data],
  );
  const options: EChartsOption = {
    title: {
      text: '用户角色分布',
      left: 'left',
      top: 10,
      textStyle: { fontSize: 12 },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'horizontal',
      bottom: 10,
      left: 'center',
      itemWidth: 12,
      itemHeight: 8,
      textStyle: { fontSize: 12 },
    },
    series: [
      {
        name: '角色分布',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{d}%',
          fontSize: 11,
        },
        labelLine: {
          show: true,
          length: 8,
          length2: 5,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        data: dataWithColor,
      },
    ],
  };

  return (
    <div style={{ height, width: '100%' }}>
      <Charts options={options} />
    </div>
  );
};

export default RoleDistribution;
