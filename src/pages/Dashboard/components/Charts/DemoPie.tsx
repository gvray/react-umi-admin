import Chart from '@/components/Charts';
import { CategoryData } from '@/services/dashboard';
import { EChartsOption } from 'echarts';
import React from 'react';
import { styled } from 'umi';

const DemoWrapper = styled.div`
  height: 300px;
`;

interface DemoPieProps {
  data?: CategoryData[];
}

const DemoPie: React.FC<DemoPieProps> = ({ data = [] }) => {
  // 默认数据
  const defaultData: CategoryData[] = [
    { name: '手机', value: 1048 },
    { name: '笔记本电脑', value: 735 },
    { name: '平板电脑', value: 580 },
    { name: '智能手表', value: 484 },
    { name: '智能家居设备', value: 300 },
  ];

  const chartData = data.length > 0 ? data : defaultData;
  const options: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)', // 使用 formatter 属性来自定义悬浮框内容
    },
    legend: {
      bottom: '5%',
      left: 'center',
      textStyle: {
        fontSize: 12, // 设置图例文字大小
      },
      itemWidth: 16, // 设置图例方块宽度
      itemHeight: 10, // 设置图例方块高度
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['45%', '66%'],
        avoidLabelOverlap: false,
        padAngle: 5,
        itemStyle: {
          borderRadius: 10,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        center: ['50%', '40%'], // 调整饼图位置，将位置向上移动一点
        data: chartData,
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
